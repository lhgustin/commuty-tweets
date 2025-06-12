import { z } from 'zod'
import { SearchCriteriaDTOOutSchema } from './SearchCriteria.ts'
import { TweetQueryDTOSchema } from './TweetMessage.ts'

export const SearchPathParamsSchema = z.object({
    uuid: SearchCriteriaDTOOutSchema.shape.searchCriteria,
})

// TODO default values?
export const SearchQueryParamsSchema = z.object({
    limit: z.string().transform((val) => parseInt(val, 10)).optional(), //.default('10'),
    direction: z.enum(['ASC', 'DESC']).optional(), //.default('DESC'),
})

export const SearchQueryDTOOutSchema = z.object({
    searchCriteria: SearchCriteriaDTOOutSchema.shape.searchCriteria,
    tweets: z.array(TweetQueryDTOSchema),
    totalCount: z.number(),
})

// TypeScript exports
export type SearchPathParams = z.infer<typeof SearchPathParamsSchema>
export type SearchQueryParams = z.infer<typeof SearchQueryParamsSchema>
export type SearchQueryDTOOut = z.infer<typeof SearchQueryDTOOutSchema>
