import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { StatsTable } from './StatsTable'
import PieChart from '../../components/PieChart'
import { useState, useCallback, useEffect } from 'react'
import { TweetStatDTOOut } from '../../../../common/index.ts'
import { BASE_URL } from '../../lib/constants.tsx'

export const StatsTab = () => {
    const [data, setData] = useState<TweetStatDTOOut>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

    const fetchData = useCallback(() => {
        setLoading(true)
        fetch(`${BASE_URL}/stats`)
            .then((response) => response.json())
            .then((data: TweetStatDTOOut) => {
                setData(data)
                setLastFetchTime(new Date())
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" onClick={fetchData} disabled={loading}>
                    {loading ? 'Loading...' : 'Reload Data'}
                </Button>
                {lastFetchTime && (
                    <Typography variant="body2" color="text.secondary">
                        Last updated: {lastFetchTime.toLocaleString()}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {/* Col1 */}
                <Box sx={{ flex: 1 }}>
                    <StatsTable data={data} loading={loading} error={error} />
                </Box>
                
                {/* Col2 */}
                <Box sx={{ flex: 2 }}>
                    <Box sx={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
                        <PieChart
                            labels={data.map((item) => item.lang)}
                            values={data.map((item) => item.oneMinuteRate)}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}
