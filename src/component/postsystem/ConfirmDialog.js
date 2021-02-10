import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
export default function ConfirmDialog({ confirmAction, setConfirmAction }) {
    const handleSuccess = () => {
        confirmAction.handleSuccess();
    };

    const handleCancel = (event) => {
        setConfirmAction({
            open: false,
            handleSuccess: undefined,
            content: undefined,
            title: undefined,
        })
    };

    return (
        <div>
            <Dialog open={confirmAction.open} onClose={handleCancel}>
                <DialogTitle>{confirmAction.title}</DialogTitle>
                <DialogContent>
                    {"Xác nhận " + confirmAction.content + '?'}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSuccess} color="primary">
                        Xác nhận
                    </Button>
                    <Button onClick={handleCancel} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}