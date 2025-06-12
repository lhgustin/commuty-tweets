import type { Request, Response, NextFunction } from 'express'

const data2str = (data: Record<string, unknown> | null | undefined, label: string): string =>
    data && Object.keys(data).length > 0 ? `\n${label}: ${JSON.stringify(data)}` : ''

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
    const queryParams = data2str(req.query, 'Query params')
    const body = data2str(req.body, 'Body')
    console.info(`${req.method} ${req.url}${queryParams}${body}`)
    next()
}
