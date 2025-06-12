import { Typography, Link } from "@mui/material"
import React from "react"

export const Copyright = () => {
    return (
        <Typography
            variant="body2"
            align="center"
            sx={{
                marginTop: '2em',
                color: 'text.secondary',
            }}
        >
            {'Copyright © '}
            <Link color="inherit" href="https://www.linkedin.com/in/ludovic-gustin/">
                Ludovic Gustin
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}