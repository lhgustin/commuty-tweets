import { Router } from 'express'
import { getStatistics, statPath } from './stats.ts'
import { deleteSearch, getSearch, postSearch, searchPath } from './search.ts'
import { criteriaPath, getAllSearchCriteria } from './criteria.ts'

const router = Router({ mergeParams: true })

// 1. Stats
router.get(`${statPath}`, getStatistics)

// 2. Search
router.post(`${searchPath}`, postSearch)
router.route(`${searchPath}/:uuid`).get(getSearch).delete(deleteSearch)

// 3. Criteria (optional)
router.get(`${criteriaPath}`, getAllSearchCriteria)

export default router
