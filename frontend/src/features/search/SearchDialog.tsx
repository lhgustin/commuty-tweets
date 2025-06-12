import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    type SelectChangeEvent,
    Alert,
} from '@mui/material';
import { SearchCriteria, SearchCriteriaSchema } from '../../../../common/index.ts'

type SearchDialogProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (criteria: Omit<SearchCriteria, 'uuid'>) => void;
};

const defaultFormData: Omit<SearchCriteria, 'uuid'> = {
    logicalOperator: 'AND',
    text: undefined,
    userScreenName: undefined,
    verifiedOnly: undefined,
    language: undefined,
}

export const SearchDialog = ({ open, onClose, onSubmit }: SearchDialogProps) => {
    const [formData, setFormData] = useState<Omit<SearchCriteria, 'uuid'>>({...defaultFormData});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(open) {
            setFormData({...defaultFormData})
        }
    }, [open])

    const handleSubmit = () => {
        const result = SearchCriteriaSchema.safeParse(formData);
        if (!result.success) {
            console.error('Invalid form data:', result.error);
            setError(result.error.errors.map((e) => e.message).join('\n'));
            return;
        }
        setError(null);
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>New Search Criteria</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Logical Operator</InputLabel>
                            <Select
                                value={formData.logicalOperator}
                                label="Logical Operator"
                                onChange={(e: SelectChangeEvent) => setFormData({ ...formData, logicalOperator: e.target.value as SearchCriteria['logicalOperator'] })}
                            >
                                <MenuItem value="AND">AND</MenuItem>
                                <MenuItem value="OR">OR</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Tweet Text"
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="User Screen Name"
                            value={formData.userScreenName}
                            onChange={(e) => setFormData({ ...formData, userScreenName: e.target.value })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Language"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Verified Users Only</InputLabel>
                            <Select
                                value={formData.verifiedOnly?.toString() ?? 'false'}
                                label="Verified Users Only"
                                onChange={(e: SelectChangeEvent) => setFormData({ ...formData, verifiedOnly: e.target.value === 'true' })}
                            >
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Create Search</Button>
            </DialogActions>
        </Dialog>
    );
}; 