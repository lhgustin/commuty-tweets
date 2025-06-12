import { SxProps, Theme } from "@mui/material"

// FIXME create an apiService to list all api calls
// FIXME use axios instance, with a baseUrl from a dotenv
export const BASE_URL = 'http://localhost:3000'

// FIXME use a theme provider
export const AppThemeHeight: SxProps<Theme> = {
    maxHeight: '55vh',
    minHeight: '55vh',
    overflow: 'auto'
}