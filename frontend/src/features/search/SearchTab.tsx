import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { SearchDialog } from './SearchDialog.tsx'
import { StyledPaper } from '../../components/StyledPaper.tsx'
import { ExtendedSearchCriteria, SearchCriteria, SearchQueryParams } from '../../../../common/index.ts'
import { SearchQueryDTOOut } from '../../../../common/index.ts'
import { AppThemeHeight, BASE_URL } from '../../lib/constants.tsx'

const ALL_LIMITS = [10, 25, 50, 100]

// FIXME not responsive
export const SearchTab = () => {
    const [searchCriteria, setSearchCriteria] = useState<ExtendedSearchCriteria[]>([])
    const [selectedCriteria, setSelectedCriteria] = useState<string | null>(null)
    const [searchResults, setSearchQueryDTOOuts] = useState<SearchQueryDTOOut | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [limit, setLimit] = useState(10)
    const [direction, setDirection] = useState<SearchQueryParams['direction']>('DESC')
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

    useEffect(() => {
        fetch(`${BASE_URL}/criteria`)
            .then((response) => response.json())
            .then((data) => setSearchCriteria(data.searchCriteria))
            .catch((error) => console.error('Error fetching search criteria:', error))
    }, [])

    const handleCreateSearch = async (criteria: Omit<SearchCriteria, 'uuid'>) => {
        try {
            const response = await fetch(`${BASE_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(criteria),
            })
            const data = await response.json()
            setSearchCriteria([...searchCriteria, { ...criteria, uuid: data.searchCriteria }])
        } catch (error) {
            console.error('Error creating search:', error)
        }
    }

    const handleDeleteSearch = async (uuid: string) => {
        try {
            await fetch(`${BASE_URL}/search/${uuid}`, { method: 'DELETE' })
            setSearchCriteria(searchCriteria.filter((c) => c.uuid !== uuid))
            if (selectedCriteria === uuid) {
                setSelectedCriteria(null)
                setSearchQueryDTOOuts(null)
            }
        } catch (error) {
            console.error('Error deleting search:', error)
        }
    }

    const fetchSearchQueryDTOOuts = async (uuid: string) => {
        try {
            const response = await fetch(`${BASE_URL}/search/${uuid}?limit=${limit}&direction=${direction}`)
            const data = await response.json()
            setSearchQueryDTOOuts(data)
            setLastFetchTime(new Date())
        } catch (error) {
            console.error('Error fetching search results:', error)
        }
    }

    useEffect(() => {
        if (selectedCriteria) {
            fetchSearchQueryDTOOuts(selectedCriteria)
        }
    }, [selectedCriteria, limit, direction])

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SearchDialog open={showDialog} onClose={() => setShowDialog(false)} onSubmit={handleCreateSearch} />

            {/* Top = Options Panel */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={4}>
                        <FormControl fullWidth>
                            <InputLabel>Results Limit</InputLabel>
                            <Select
                                value={limit}
                                label="Results Limit"
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                {ALL_LIMITS.map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={4}>
                        <FormControl fullWidth>
                            <InputLabel>Sort Direction</InputLabel>
                            <Select
                                value={direction}
                                label="Sort Direction"
                                onChange={(e) => setDirection(e.target.value as 'ASC' | 'DESC')}
                            >
                                <MenuItem value="ASC">Ascending</MenuItem>
                                <MenuItem value="DESC">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            onClick={() => selectedCriteria && fetchSearchQueryDTOOuts(selectedCriteria)}
                            disabled={!selectedCriteria}
                            color="primary"
                            title="Reload results"
                        >
                            <RefreshIcon />
                        </IconButton>
                        {lastFetchTime && (
                            <Typography variant="caption" color="text.secondary">
                                Last updated: {lastFetchTime.toLocaleTimeString()}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Bottom = Master Detail */}
            <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: '400px' }}>
                {/* Left = Search Criteria List */}
                <StyledPaper sx={{ width: 300, ...AppThemeHeight }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Search Criteria</Typography>
                        <IconButton onClick={() => setShowDialog(true)} color="primary">
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {searchCriteria.map((criteria) => (
                            <ListItem
                                key={criteria.uuid}
                                sx={{
                                    bgcolor: selectedCriteria === criteria.uuid ? 'action.selected' : 'inherit',
                                }}
                                onClick={() => setSelectedCriteria(criteria.uuid)}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleDeleteSearch(criteria.uuid)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    // FIXME extract utils
                                    primary={[
                                        criteria.text ?? '',
                                        criteria.userScreenName ?? '',
                                        criteria.language ?? '',
                                    ]
                                        .filter((s) => !!s)
                                        .join(' - ')}
                                    secondary={`${criteria.logicalOperator} - ${criteria.verifiedOnly ? 'Verified Only' : 'All Users'}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </StyledPaper>

                {/* Right = Search Results */}
                <StyledPaper sx={{ flex: 1, minHeight: '55vh', maxHeight: '55vh', overflow: 'auto' }}>
                    {selectedCriteria ? (
                        searchResults ? (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Search Results ({searchResults.tweets.length} / {searchResults.totalCount} total)
                                </Typography>
                                <List>
                                    {searchResults.tweets.map((tweet, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1">
                                                            {tweet.authorName} (@{tweet.authorNickname})
                                                            {tweet.verified && ' ✅'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            {/* <Typography variant="body2">{tweet.text}</Typography> */}
                                                            <Typography variant="caption">
                                                                {new Date(tweet.creationTime).toLocaleString()} •{' '}
                                                                {tweet.language}
                                                                {tweet.country && ` • ${tweet.country}`}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            {index < searchResults.tweets.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </>
                        ) : (
                            <Typography>Loading results...</Typography>
                        )
                    ) : (
                        <Typography>Select a search criteria to view results</Typography>
                    )}
                </StyledPaper>
            </Box>
        </Box>
    )
}
