import { z } from 'zod'
import { PubNubMessageSchema } from './PubNubMessage.ts'

export const BaseSearchCriteriaSchema = z.object({
    logicalOperator: z.enum(['AND', 'OR']),
    verifiedOnly: PubNubMessageSchema.shape.user.shape.verified.optional(),
    userScreenName: PubNubMessageSchema.shape.user.shape.screen_name.optional(),
    text: PubNubMessageSchema.shape.text.optional(),
    language: PubNubMessageSchema.shape.lang.optional(),
})

export const ExtendedSearchCriteriaSchema = BaseSearchCriteriaSchema.extend({
    uuid: z.string().uuid(),
})

// Refine does not allow to extend or extract (infer) the schema
export const SearchCriteriaSchema: z.ZodType = BaseSearchCriteriaSchema.refine(
    // Among userScreenName, text, verifiedOnly, at least one must be provided
    (o) => {
        return o.language !== undefined || o.userScreenName !== undefined || o.text !== undefined
    },
    {
        message: 'At least one of language, userScreenName, or text must be provided',
        path: ['language', 'userScreenName', 'text'],
    }
)

export const SearchCriteriaDTOInSchema = BaseSearchCriteriaSchema
export const SearchCriteriaDTOOutSchema = z.object({
    searchCriteria: z.string().uuid(), // UUID v4 validation
})

// TypeScript exports
export type SearchCriteria = z.infer<typeof BaseSearchCriteriaSchema>
export type ExtendedSearchCriteria = z.infer<typeof ExtendedSearchCriteriaSchema>
export type SearchCriteriaDTOIn = z.infer<typeof SearchCriteriaDTOInSchema>
export type SearchCriteriaDTOOut = z.infer<typeof SearchCriteriaDTOOutSchema>
