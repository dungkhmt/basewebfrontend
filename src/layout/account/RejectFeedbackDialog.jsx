import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import PrimaryButton from "../../component/button/PrimaryButton";
import TertiaryButton from "../../component/button/TertiaryButton";
import CustomizedDialogs from "../../component/dialog/CustomizedDialogs";

const useStyles = makeStyles(() => ({
  btn: { margin: 4, width: 148 },
}));

function RejectFeedbackDialog({ open, handleContinue, handleReject }) {
  const classes = useStyles();

  return (
    <CustomizedDialogs
      open={open}
      handleClose={handleContinue}
      contentTopDivider
      title="Bỏ phản hồi?"
      content={
        <Typography style={{ padding: "0 8px", width: 550, marginTop: -1 }}>
          Nếu bỏ bây giờ, bạn sẽ không chia sẻ bất cứ ý kiến đóng góp nào với
          chúng tôi.
        </Typography>
      }
      actions={
        <>
          <TertiaryButton className={classes.btn} onClick={handleContinue}>
            Tiếp tục chỉnh sửa
          </TertiaryButton>
          <PrimaryButton
            className={classes.btn}
            onClick={handleReject}
            style={{ marginLeft: 4 }}
          >
            Bỏ
          </PrimaryButton>
        </>
      }
    />
  );
}

export default RejectFeedbackDialog;
