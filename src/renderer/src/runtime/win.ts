import horizontalStyles from '@renderer/assets/css/append/mobile/append_mobile_horizontal.css?raw'
import verticalCss from '@renderer/assets/css/append/mobile/append_mobile_vertical.css?raw'
import { logger } from '@renderer/function/base'
import useRuntimeData from '@renderer/state/runtimeData'
import { computed, ComputedRef, shallowRef, watchEffect, markRaw } from 'vue'
import { backend } from './backend'

export type WinAction = 'maximize' | 'minimize' | 'unmaximize' | 'close'

const win = markRaw({
    _isTiling: undefined as any as ComputedRef<boolean>,
    _isMaximized: shallowRef(false),
    _needBar: undefined as any as ComputedRef<boolean>,
    _needMargin: undefined as any as ComputedRef<boolean>,

    _forceTilingState: shallowRef<undefined | boolean>(),
    _darkMode: shallowRef<boolean | undefined>(undefined),
    _vibrancyMode: shallowRef<boolean>(false),

    hasInit: false,

    TILING_WMS: [
        'i3',
        'sway',
        'bspwm',
        'awesome',
        'herbstluftwm',
        'hyprland',
        'niri',
    ],

    /**
     * 初始化
     */
    async init() {
        const runtimeData = useRuntimeData()
        // computed 初始化
        this._needBar = computed(() => {
            if (backend.isWeb()) return false
            return !win.tiling
        })
        this._needMargin = computed(() => {
            if (backend.isWeb()) return false
            if (win.tiling) return false
            return !win.maximized
        })
        this._isTiling = computed(() => {
            if (backend.platform !== 'linux') return false
            return this.TILING_WMS.includes(backend.de || '')
        })

        // 最大化检测
        backend.addListener(
            undefined,
            'win:maximizedChanged',
            (_, data) => (win.maximized = data),
        )
        win.maximized = await backend.call(undefined, 'win:isMaximized', true)
        // 添加样式
        await this.loadAppendStyle()
        watchEffect(() => {
            if (win.margin) document.body.classList.add('margin')
            else document.body.classList.remove('margin')

            if (win.withBar) document.body.classList.add('with-bar')
            else document.body.classList.remove('with-bar')
        })
        // 安全区域规划
        document.body.style.setProperty(
            '--safe-area-bottom',
            Math.max(runtimeData.sysConfig.fs_adaptation, 0) + 'px',
        )
        document.body.style.setProperty('--safe-area-top', '0')
        document.body.style.setProperty('--safe-area-left', '0')
        document.body.style.setProperty('--safe-area-right', '0')
        // Capacitor：移动端初始化安全区域
        if (backend.isMobile()) {
            const safeArea = await backend.call('SafeArea', 'getSafeArea', true)
            if (safeArea) {
                logger.debug('安全区域：', safeArea)
                document.body.style.setProperty(
                    '--safe-area-top',
                    safeArea.top + 'px',
                )
                document.body.style.setProperty(
                    '--safe-area-bottom',
                    safeArea.bottom + 'px',
                )
                document.body.style.setProperty(
                    '--safe-area-left',
                    safeArea.left + 'px',
                )
                document.body.style.setProperty(
                    '--safe-area-right',
                    safeArea.right + 'px',
                )
            }
        }
        // 添加配置监听
        // 亮暗模式
        this.refreshDarkMode()
        watchEffect(() => {
            this.refreshDarkMode()
        })
        // 透明模式
        this.refreshVibrancyState()
        watchEffect(() => {
            this.refreshVibrancyState()
        })

        this.hasInit = true
    },

    /**
     * 窗口最小化
     */
    minimize() {
        this.control('minimize')
    },

    /**
     * 切换最大化
     */
    switchMaximize() {
        this.control(this.maximized ? 'unmaximize' : 'maximize')
    },

    /**
     * 关闭窗口
     */
    close() {
        this.control('close')
    },

    /**
     * 操控窗口
     * @param action
     */
    control(action: WinAction) {
        backend.call(undefined, `win:${action}`, false)
    },

    async loadAppendStyle() {
        const platform = backend.platform
        logger.info('正在装载补充样式……')
        // UI 2.0 附加样式
        if (backend.isDesktop()) {
            await import('@renderer/assets/css/append/append_new.css')
            logger.info('UI 2.0 附加样式加载完成')
        }

        if (platform != undefined) {
            try {
                await import(
                    `@renderer/assets/css/append/append_${platform}.css`
                )
                logger.info(`${platform} 平台附加样式加载完成`)
            } catch {
                logger.info('未找到对应平台的附加样式：' + platform)
            }
        }

        // 添加手机端样式
        const updateCss = (appendCss = '') => {
            const cssStyle = document.getElementById('mobile-css')

            const width = window.innerWidth
            const height = window.innerHeight
            if (cssStyle) {
                if (width > 600) {
                    cssStyle.innerHTML =
                        (width > height
                            ? horizontalStyles
                            : horizontalStyles + verticalCss) + appendCss
                } else {
                    cssStyle.innerHTML =
                        horizontalStyles + verticalCss + appendCss
                }
            }

            if (backend.isDesktop()) {
                backend.call(undefined, 'win:maximize', false)
                const topBar = document.getElementsByClassName(
                    'top-bar',
                )[0] as HTMLElement
                if (topBar) {
                    topBar.style.display = 'none'
                }
            }
        }
        if (backend.isMobile()) {
            const styleTag = document.createElement('style')
            styleTag.id = 'mobile-css'
            document.head.appendChild(styleTag)
            updateCss()
            // 屏幕旋转事件处理
            window.addEventListener('resize', () => {
                updateCss()
            })
        }

        await import('@renderer/assets/css/append/append_vibrancy.css')
        if (backend.platform === 'linux')
            await import('@renderer/assets/css/append/append_linux_vibrancy.css')
        logger.info('透明 UI 附加样式加载完成')
    },

    /**
     * 刷新透明效果状态
     */
    refreshVibrancyState() {
        const runtimeData = useRuntimeData()
        if (this.hasInit) this.changeAnimation()

        const useVibrancy = runtimeData.sysConfig.vibrancy
        if (useVibrancy === this._vibrancyMode.value) return
        this.setVibrancy(useVibrancy)
    },
    /**
     * 设置透明效果
     */
    setVibrancy(use: boolean) {
        const runtimeData = useRuntimeData()
        if (use) {
            document.body.classList.add('vibrancy')
            runtimeData.tags.vibrancy = true
            logger.info('透明 UI 附加样式启用')
        } else {
            document.body.classList.remove('vibrancy')
            runtimeData.tags.vibrancy = false
            logger.info('已移除透明 UI 效果禁用')
        }

        this._vibrancyMode.value = use
    },

    /**
     * 刷新暗色模式
     */
    refreshDarkMode() {
        const runtimeData = useRuntimeData()
        let darkMode: boolean
        switch (runtimeData.sysConfig.opt_dark_mode) {
            case 'auto':
                darkMode = runtimeData.defaultColorMode === 'dark'
                break
            case 'dark':
                darkMode = true
                break
            case 'light':
                darkMode = false
                break
        }
        if (darkMode === this._darkMode.value) return
        this.setDarkMode(darkMode)
    },
    /**
     * 设置暗色模式
     * @param dark 是否启用
     */
    setDarkMode(dark: boolean) {
        if (this.hasInit) this.changeAnimation()
        if (dark) {
            document.body.classList.remove('light')
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
            document.body.classList.add('light')
        }
        this._darkMode.value = dark
    },

    /**
     * 样式切换动画
     */
    changeAnimation(time: number = 300) {
        document.body.style.transition = `${time}ms`
        setTimeout(() => {
            document.body.style.transition = ''
        }, time)
    },

    async supportVibrancyCheck(): Promise<boolean> {
        // 透明 UI 附加样式
        if (!backend.isDesktop()) return false
        let subVersion = backend.release?.split(' ')?.[1]?.split('.') as any
        subVersion = subVersion ? Number(subVersion[2]) : 0

        // mac
        if (backend.platform == 'darwin') return true

        // windows 10 20H1 以上
        if (backend.platform == 'win32' && subVersion > 22621) return true

        // linux 一大帮自
        if (backend.de === 'hyprland') return true
        if (backend.de === 'gnome') {
            const gnomeExtInfo = await backend.call(
                undefined,
                'sys:getGnomeExt',
                true,
            )
            if (gnomeExtInfo) {
                const info = await gnomeExtInfo
                if (
                    info['enable-all'] == 'true' ||
                    (info['whitelist'] != undefined &&
                        info['whitelist'].indexOf('stapxs-qq-lite') > 0)
                ) {
                    return true
                }
            }
        }

        return false
    },

    /**
     * 是否为平铺桌面
     */
    get tiling() {
        if (this._forceTilingState.value !== undefined)
            return this._forceTilingState.value
        return this._isTiling.value
    },

    /**
     * 是否为最大化
     */
    get maximized() {
        return this._isMaximized.value
    },

    set maximized(value) {
        this._isMaximized.value = value
    },

    get withBar() {
        return this._needBar.value
    },

    get margin() {
        return this._needMargin.value
    },

    get darkMode() {
        return this._darkMode.value
    },
    get vibrancyMode() {
        return this._vibrancyMode.value
    },
})

export default win
