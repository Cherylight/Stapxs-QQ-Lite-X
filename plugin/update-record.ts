import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'

const virtualModuleId = 'virtual:update-record'
const resolvedVirtualModuleId = '\0' + virtualModuleId

const MAX_RECORDS = 100
const ALLOW_TYPE = new Set([
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'perf',
    'test',
    'chore',
    'ci',
])

export default function updateRecordPlugin(): Plugin {
    return {
        name: 'vite-plugin-update-record',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
            return undefined
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                try {
                    const commitLog = execSync(
                        `git log -n ${MAX_RECORDS} --pretty=format:"%H|%s|%an|%at"`,
                    ).toString()

                    const commits: {
                        hash: string
                        content: string
                        type:
                            | 'feat'
                            | 'fix'
                            | 'docs'
                            | 'style'
                            | 'refactor'
                            | 'perf'
                            | 'test'
                            | 'chore'
                            | 'revert'
                            | 'ci'
                            | 'unknown'
                        author: string
                        date: number
                    }[] = []

                    for (const line of commitLog.split('\n')) {
                        if (!line.trim()) continue
                        const [hash, subject, author, date] = line.split('|')
                        const title = subject.split('\n')[0]
                        let type = title.split(':')[0]
                        if (!ALLOW_TYPE.has(type)) {
                            type = 'unknown'
                        }
                        const content = title.replaceAll(
                            new RegExp(`^${type}:\\s*`, 'gi'),
                            '',
                        )
                        commits.push({
                            hash,
                            type: type as
                                | 'feat'
                                | 'fix'
                                | 'docs'
                                | 'style'
                                | 'refactor'
                                | 'perf'
                                | 'test'
                                | 'chore'
                                | 'ci'
                                | 'unknown',
                            content,
                            author,
                            date: Number.parseInt(date),
                        })
                    }

                    return `export default ${JSON.stringify(commits)};`
                } catch (e) {
                    console.error('Failed to get git commits:', e)
                    return 'export default [];'
                }
            }
        },
    }
}
