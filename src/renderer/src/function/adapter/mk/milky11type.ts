import * as z from 'zod'

export const GetCustomFaceUrlListInput = z.object({})
export const GetCustomFaceUrlListOutput = z.object({
    urls: z.array(z.string()),
})

export const SetNicknameInput = z.object({
    new_nickname: z.string(),
})
export const SetNicknameOutput = z.object({})

export const SetBioInput = z.object({
    new_bio: z.string(),
})
export const SetBioOutput = z.object({})
