import { z } from 'zod'
import { PubNubMessageSchema } from './PubNubMessage.ts'
import _ from 'lodash'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const TweetStatSchema = z.object({
    lang: PubNubMessageSchema.shape.lang,
    oneMinuteRate: z.number(),
    lastTimestamp: z.number(), //TODO remove
    // timeStart: z.number(),
    // timeEnd: z.number(),
}).openapi({
    title: 'TweetStat'
})

export const TweetStatDTOSchema = z.array(TweetStatSchema.pick({ lang: true, oneMinuteRate: true })).refine(
    (tweets) => {
        const languages = tweets.map((tweet) => tweet.lang)
        return languages.length === _.uniq(languages).length
    },
    {
        message: 'Each language should appear only once in the tweets array',
        path: ['stats'],
    }
).openapi({
    title: 'TweetStatDTOOut'
})


// TypeScript exports
export type TweetStat = z.infer<typeof TweetStatSchema>
export type TweetStatDTOOut = z.infer<typeof TweetStatDTOSchema>
