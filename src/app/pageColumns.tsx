import { GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import { specialties } from '@/db/seed/advocates';
import { Select, MenuItem, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';

const columns: GridColDef[] = [
    {
        field: 'firstName',
        headerName: 'First Name',
        flex: 1,
        editable: true
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        flex: 1,
        editable: true
    },
    {
        field: 'city',
        headerName: 'City',
        flex: 1,
        editable: true
    },
    {
        field: 'degree',
        headerName: 'Degree',
        flex: 1,
        editable: true
    },
    {
        field: 'specialties',
        headerName: 'Specialties',
        flex: 2,
        sortComparator: (v1: string[], v2: string[]) => {
            const first = v1.length > 0 ? v1[0] : '';
            const second = v2.length > 0 ? v2[0] : '';
            return first.localeCompare(second);
        }, // This allows sorting based on the first element
        renderCell: (params) => (params.value as string[]).join(', '),
        renderEditCell: (params: GridRenderEditCellParams<string[]>) => {
            const handleChange = (event: SelectChangeEvent<string[]>) => {
                const value = event.target.value as string[];
                params.api.setEditCellValue({ id: params.id, field: params.field, value });
            };

            return (
                <Select
                    multiple
                    value={params.value || []} // Ensure params.value is treated as string[]
                    onChange={handleChange}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                >
                    {specialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                            <Checkbox checked={(params.value || []).includes(specialty)} />
                            <ListItemText primary={specialty} />
                        </MenuItem>
                    ))}
                </Select>
            );
        },
        valueOptions: specialties,
        editable: true
    },
    {
        field: 'yearsOfExperience',
        headerName: 'Years of Experience',
        flex: 1,
        editable: true
    },
    {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        flex: 1,
        editable: true
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        flex: 1,
        renderCell: (params) => (params.value as string).split("T")[0] // Only show the date for cleaner view
    },
];

export default columns;