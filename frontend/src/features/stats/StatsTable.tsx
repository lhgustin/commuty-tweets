import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { TweetStatDTOOut } from '../../../../common/index.ts'
import { AppThemeHeight } from '../../lib/constants.tsx'

export type StatsTableProps = {
    data: TweetStatDTOOut
    loading: boolean
    error: string | null
}

export const StatsTable = ({ data, loading, error }: StatsTableProps) => {
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
            </div>
        )
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    if (!data) {
        return <Alert severity="info">No data available</Alert>
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                ...AppThemeHeight,
            }}
        >
            <Table size="small" aria-label="stats table" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Language</TableCell>
                        <TableCell align="center">Rate (per minute)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.lang}>
                            <TableCell align="center">{row.lang}</TableCell>
                            <TableCell align="center">{row.oneMinuteRate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}