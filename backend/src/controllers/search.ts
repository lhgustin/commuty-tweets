import type { Request, Response, NextFunction } from 'express'
import {
    ApiErrorSchema,
    SearchCriteriaDTOInSchema,
    SearchCriteriaDTOOutSchema,
    SearchCriteriaSchema,
    type ApiError,
    type SearchCriteriaDTOIn,
    type SearchCriteriaDTOOut,
} from '../../../common/index.ts'
import { v4 as uuidv4 } from 'uuid'
import {
    SearchPathParamsSchema,
    SearchQueryDTOOutSchema,
    SearchQueryParamsSchema,
    type SearchPathParams,
    type SearchQueryDTOOut,
    type SearchQueryParams,
} from '../../../common/index.ts'
import { ConsumerState } from '../services/consumer/index.ts'
import { registry } from '../services/open-api/index.ts'

export const searchPath = '/search'
registry.registerPath({
    method: 'post',
    path: searchPath,
    tags: ['Search'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: SearchCriteriaDTOInSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: SearchCriteriaDTOOutSchema,
                },
            },
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: ApiErrorSchema,
                },
            },
        },
    },
})

export const postSearch = async (
    req: Request<unknown, unknown, SearchCriteriaDTOIn>,
    res: Response<SearchCriteriaDTOOut|ApiError>,
    next: NextFunction
) => {
    const searchParams = req.body
    const result = SearchCriteriaSchema.safeParse(searchParams)
    if (!result.success) {
        res.status(400).json({
            message: result.error.errors.map((e) => e.message).join('\n'),
        })
    }
    const criteria: SearchCriteriaDTOOut = {
        searchCriteria: uuidv4(),
    }
    ConsumerState.getSingleton().addSearchCriteria(criteria.searchCriteria, searchParams)
    const dtoOutResult = SearchCriteriaDTOOutSchema.safeParse(criteria)
    if (!dtoOutResult.success) {
        return next(dtoOutResult.error)
    }
    res.status(200).json(criteria)
}

registry.registerPath({
    method: 'get',
    path: `${searchPath}/:uuid`,
    tags: ['Search'],
    request: {
        params: SearchPathParamsSchema,
        query: SearchQueryParamsSchema,
    },
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: SearchQueryDTOOutSchema,
                },
            },
        },
        404: {
            description: 'Not Found',
            content: {
                'application/json': {
                    schema: ApiErrorSchema,
                },
            },
        },
    },
})

export const getSearch = async (
    req: Request<SearchPathParams, unknown, unknown, SearchQueryParams>,
    res: Response<SearchQueryDTOOut|ApiError>,
    next: NextFunction
) => {
    const paramsResult = SearchPathParamsSchema.safeParse(req.params)
    if (!paramsResult.success) {
        return next(paramsResult.error)
    }
    const queryResult = SearchQueryParamsSchema.safeParse(req.query)
    if (!queryResult.success) {
        return next(queryResult.error)
    }
    //
    const { uuid } = req.params
    const { limit = 10, direction = 'DESC'} = queryResult.data
    const search = ConsumerState.getSingleton().getSearchResults(uuid, limit, direction)
    if(search === null) {
        res.status(404).json({
            message: `Search criteria with uuid ${uuid} does not exist`,
        })
        return
    }
    const dtoOutResult = SearchQueryDTOOutSchema.safeParse(search)
    if (!dtoOutResult.success) {
        return next(dtoOutResult.error)
    }
    res.status(200).json(search)
}

registry.registerPath({
    method: 'delete',
    path: `${searchPath}/:uuid`,
    tags: ['Search'],
    request: {
        params: SearchPathParamsSchema,
    },
    responses: {
        200: {
            description: 'Success',
        },
        404: {
            description: 'Not Found',
            content: {
                'application/json': {
                    schema: ApiErrorSchema,
                },
            },
        },
    },
})

export const deleteSearch = async (
    req: Request<SearchPathParams, unknown, unknown, unknown>,
    res: Response<unknown>,
    next: NextFunction
) => {
    const paramsResult = SearchPathParamsSchema.safeParse(req.params)
    if (!paramsResult.success) {
        return next(paramsResult.error)
    }
    const { uuid } = req.params
    if(ConsumerState.getSingleton().deleteSearchCriteria(uuid)){
        res.status(200).json('OK')
    } else {
        res.status(404).json({
            message: `Search criteria with uuid ${uuid} does not exist`,
        })
    }
}

