import React, { Dispatch, SetStateAction } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridRowEditStopReasons,
    GridRowModes,
    GridRowModesModel,
    GridActionsCellItem,
    GridRowEditStopParams,
    MuiEvent,
    GridRowId,
    GridToolbarProps
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import {
    Add as AddIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import DeleteDialog from "./deleteDialog";

interface Advocate {
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: number;
    createdAt: Date;
};

interface DatagridProps {
    rows: any[]; // Keep this any so we can reuse this datagrid with other tables
    setRows: Dispatch<SetStateAction<Advocate[]>>;
    columns: any[]; // Keep this any so we can reuse this datagrid with other tables
    loading: boolean;
    heightPerRow: number;
    add: boolean;
    edit: boolean;
    del: boolean;
    processRowCreate: () => void;
    processRowUpdate: (newRow: Advocate, oldRow: Advocate, params: { rowId: GridRowId }) => Advocate | Promise<Advocate>;
    processRowDelete: (id: GridRowId) => void;
    fieldToFocus: String;
};

interface CustomToolbarProps {
    setRows: React.Dispatch<React.SetStateAction<any[]>>;
    setRowModesModel: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};

const Datagrid: React.FC<DatagridProps> = ({ rows, setRows, columns, loading, heightPerRow, add, edit, del, processRowCreate, processRowUpdate, processRowDelete, fieldToFocus }) => {
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<GridRowId>(0);

    const handleRowEditStop = (
        params: GridRowEditStopParams,
        event: MuiEvent
    ): void => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDeleteClick = () => {
        processRowDelete(deleteId);
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel: React.SetStateAction<{}>) => {
        setRowModesModel(newRowModesModel);
    };

    const CustomToolbar: React.FC<GridToolbarProps> = (props) => {
        const handleClick = () => {
            processRowCreate();
        };

        return (
            <GridToolbarContainer sx={{ display: "flex" }}>
                <GridToolbarQuickFilter sx={{ flex: 2 }} />
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add
                </Button>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    };

    return (
        <Box
            sx={{
                paddingTop: "5%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%', // Full width container
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    maxWidth: '70%', // Prevent excessive width on large screens
                    minWidth: '300px', // Shrink gracefully on small screens
                }}
            >
                <DeleteDialog
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    title={`Confirm Delete?`}
                    text={``}
                    handleSubmit={handleConfirmDeleteClick}
                />
                <DataGrid
                    rows={rows}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    columns={!edit && !del ? columns :
                        [
                            ...columns,
                            {
                                field: 'actions',
                                type: 'actions',
                                headerName: 'Actions',
                                width: edit && del ? 100 : 70,
                                cellClassName: 'actions',
                                getActions: ({ id }) => {
                                    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                                    if (isInEditMode) {
                                        return [
                                            <GridActionsCellItem
                                                icon={<SaveIcon />}
                                                label="Save"
                                                sx={{
                                                    color: 'primary.main',
                                                }}
                                                onClick={handleSaveClick(id)}
                                            />,
                                            <GridActionsCellItem
                                                icon={<CancelIcon />}
                                                label="Cancel"
                                                className="textPrimary"
                                                onClick={handleCancelClick(id)}
                                                color="inherit"
                                            />,
                                        ];
                                    }

                                    if (del && !edit) {
                                        return [
                                            <GridActionsCellItem
                                                icon={<DeleteIcon />}
                                                label="Delete"
                                                onClick={handleDeleteClick(id)}
                                                color="inherit"
                                            />
                                        ]
                                    }
                                    else if (edit && !del) {
                                        return [
                                            <GridActionsCellItem
                                                icon={<EditIcon />}
                                                label="Edit"
                                                className="textPrimary"
                                                onClick={handleEditClick(id)}
                                                color="inherit"
                                            />
                                        ]
                                    }
                                    else {
                                        return [
                                            <GridActionsCellItem
                                                icon={<EditIcon />}
                                                label="Edit"
                                                className="textPrimary"
                                                onClick={handleEditClick(id)}
                                                color="inherit"
                                            />,
                                            <GridActionsCellItem
                                                icon={<DeleteIcon />}
                                                label="Delete"
                                                onClick={handleDeleteClick(id)}
                                                color="inherit"
                                            />,
                                        ]
                                    }
                                },
                            },
                        ]
                    }
                    loading={loading}
                    pagination
                    pageSizeOptions={[10, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10, // Ensure page size remains constant
                            },
                        },
                    }}
                    rowHeight={heightPerRow} // Fixed height per row (default)
                    sx={{
                        height: `${heightPerRow * 11}px`, // 52px per row * 10 rows + header row height
                    }}
                    slots={{
                        toolbar: CustomToolbar, // Attach the CustomToolbar component
                    }}
                    slotProps={{
                        toolbar: {
                            setRows,
                            setRowModesModel
                        } as Partial<GridToolbarProps>,
                    }}
                />
            </Box>
        </Box>
    )
}

export default Datagrid;