import {z} from 'zod'

export const messagesSchema =z.object({
    content: z.string()
    .min(10,{message: 'content must be at least 10 charcters'})
    .max(500, {message: 'content must no be longer than 500 characters'})
})