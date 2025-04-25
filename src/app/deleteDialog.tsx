import React, { Dispatch, SetStateAction } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Box, Button, Tooltip } from "@mui/material";

interface DeleteDialogInterface {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title: String;
    text: String;
    handleSubmit: () => void;
};

const DeleteDialog: React.FC<DeleteDialogInterface> = ({ open, setOpen, title, text, handleSubmit }) => {
    return (
        <Tooltip title={"Delete"}>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle id="status-dialog-title">
                    <Box sx={{
                        borderRadius: "25px",
                        width: 200,
                        margin: "auto",
                        fontWeight: "bold",
                        alignContent: "center",
                        textAlign: "center"
                    }}>
                        {title}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="status-dialog-description">
                        {`${text}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleSubmit(); setOpen(false); }}>Yes</Button>
                    <Button onClick={() => setOpen(false)}>No</Button>
                </DialogActions>
            </Dialog>
        </Tooltip>
    )
};

export default DeleteDialog;