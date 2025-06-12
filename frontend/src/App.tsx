import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import Box from '@mui/material/Box'
import { Copyright } from './components/Copyright.tsx'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { SearchTab } from './features/search/SearchTab.tsx'
import { StatsTab } from './features/stats/StatsTab.tsx'

export const App = () => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    // FIXME save a global accross tabs ?
    // Each tab content is unmounted when switching tabs
    return (
        <Container maxWidth="md">
            <div className="my-4">
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    DASHBOARD
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                        <Tab label="Statistics" />
                        <Tab label="Search" />
                    </Tabs>
                </Box>
                {tabValue === 0 && <StatsTab />}
                {tabValue === 1 && <SearchTab />}
                <Copyright />
            </div>
        </Container>
    )
}