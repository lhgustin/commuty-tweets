import type { Request, Response, NextFunction } from 'express'
import { TweetStatDTOSchema, type TweetStatDTOOut } from '../../../common/index.ts'
import { ConsumerState } from '../services/consumer/index.ts'
import { registry } from '../services/open-api/index.ts';

export const statPath = "/stats";
registry.registerPath({
  method: 'get',
  path: statPath,
  tags: ['Statistics'],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: TweetStatDTOSchema
        }
      }
    }
  }
});

export const getStatistics = async (req: Request, res: Response<TweetStatDTOOut>, next: NextFunction) => {
    const stats = ConsumerState.getSingleton().getStatistics()
    const dtoOutResult = TweetStatDTOSchema.safeParse(stats)
    if (!dtoOutResult.success) {
        return next(dtoOutResult.error)
    }
    res.status(200).json(stats)
}
