import z from 'zod'
import { registry } from '../services/open-api/index.ts'
import { BaseSearchCriteriaSchema } from '../../../common/models/SearchCriteria.ts'
import type { Request, Response, NextFunction } from 'express'
import { ConsumerState } from '../services/consumer/index.ts'

const AllCriteriaDTOOut = z.array(
    BaseSearchCriteriaSchema.extend({
        uuid: z.string().uuid(),
    })
)

export const criteriaPath = '/criteria'
registry.registerPath({
    method: 'get',
    path: `${criteriaPath}`,
    tags: ['Search'],
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: AllCriteriaDTOOut
                },
            },
        },
    },
})

export const getAllSearchCriteria = async (req: Request, res: Response, next: NextFunction) => {
    const searchCriteria = ConsumerState.getSingleton().getAllSearchCriteria()
    res.status(200).json({ searchCriteria })
}
