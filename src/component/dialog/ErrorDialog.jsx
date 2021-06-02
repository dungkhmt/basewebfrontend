import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import CustomizedDialogs from "./CustomizedDialogs";

const useStyles = makeStyles((theme) => ({
  btn: { width: 100 },
  dialogContent: { width: 550, borderBottom: "none" },
  actions: { paddingRight: theme.spacing(2) },
}));

function ErrorDialog({ open }) {
  const classes = useStyles();

  //
  const [openDialog, setOpen] = useState(open);

  //
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomizedDialogs
      open={openDialog}
      handleClose={handleClose}
      title="Rất tiếc"
      content={
        <Typography color="textSecondary" gutterBottom>
          Đã xảy ra lỗi. Chúng tôi đang cố gắng khắc phục lỗi sớm nhất có thể.
        </Typography>
      }
      contentDividers={true}
      actions={
        <>
          <PrimaryButton className={classes.btn} onClick={handleClose}>
            Đã hiểu
          </PrimaryButton>
        </>
      }
      style={{ content: classes.dialogContent, actions: classes.actions }}
    />
  );
}

export default ErrorDialog;
