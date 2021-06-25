import { Box, Icon, Typography } from "@material-ui/core";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { GiInfo } from "react-icons/gi";
import { IconContext } from "react-icons/lib/cjs";
import { MdCancel, MdWarning } from "react-icons/md";
import { toast } from "react-toastify";
import TertiaryButton from "../component/button/TertiaryButton";

// Snackbar

export const processingNoti = (toastId, autoClose) =>
  (toastId.current = toast.info(
    <Box display="flex" alignItems="center">
      <IconContext.Provider>
        <GiInfo size={20} style={{ marginRight: "5px" }} />
      </IconContext.Provider>
      Đang xử lý...
    </Box>,
    {
      position: "bottom-right",
      autoClose: autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  ));

export const updateSuccessNoti = (toastId, message) =>
  toast.update(toastId.current, {
    type: toast.TYPE.SUCCESS,
    autoClose: 2000,
    render: (
      <Box display="flex" alignItems="center">
        <IconContext.Provider>
          <FiCheckCircle size={20} style={{ marginRight: "5px" }} />
        </IconContext.Provider>
        {message}
      </Box>
    ),
  });

export const updateErrorNoti = (toastId, message) =>
  toast.update(toastId.current, {
    type: toast.TYPE.ERROR,
    autoClose: false,
    render: (
      <Box display="flex" alignItems="center">
        <IconContext.Provider>
          <MdCancel size={20} style={{ marginRight: "5px" }} />
        </IconContext.Provider>
        {message}
      </Box>
    ),
  });

export const wifiOffNotify = (toastId) =>
  toast.dark(
    <Box display="flex" alignItems="center">
      <Icon style={{ margin: 6 }}>wifi_off_rounded</Icon>
      <Typography component="span" style={{ padding: 6, flexGrow: 1 }}>
        Bạn đang offline.
      </Typography>
      <TertiaryButton
        disableRipple
        onClick={() => window.location.reload(false)}
        style={{ width: 92, fontSize: "1rem", color: "#42a5f5" }}
      >
        Làm mới
      </TertiaryButton>
    </Box>,
    {
      toastId: toastId,
      autoClose: false,
      pauseOnHover: true,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    }
  );

export const unduplicatedErrorNoti = (toastId, message, autoClose) =>
  toast.error(
    <Box display="flex" alignItems="center">
      <IconContext.Provider>
        <MdCancel size={20} style={{ marginRight: "5px" }} />
      </IconContext.Provider>
      {message}
    </Box>,
    {
      toastId: toastId,
      position: "bottom-right",
      autoClose: autoClose === undefined ? false : autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );

export const errorNoti = (message, autoClose) =>
  toast.error(
    <Box display="flex" alignItems="center">
      <IconContext.Provider>
        <MdCancel size={20} style={{ marginRight: "5px" }} />
      </IconContext.Provider>
      {message}
    </Box>,
    {
      position: "bottom-right",
      autoClose: autoClose === undefined ? false : autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );

export const successNoti = (message, autoClose) =>
  toast.success(
    <Box display="flex" alignItems="center">
      {/* <IconContext.Provider>
        <FiCheckCircle size={20} style={{marginRight: "5px" }} />
      </IconContext.Provider> */}
      <CheckCircleRoundedIcon style={{ marginRight: "5px" }} />
      {message}
    </Box>,
    {
      position: "bottom-right",
      autoClose: autoClose === undefined ? false : autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );

export const warningNoti = (message, autoClose) =>
  toast.warning(
    <Box display="flex" alignItems="center">
      <IconContext.Provider>
        <MdWarning size={20} style={{ marginRight: "5px" }} />
      </IconContext.Provider>
      {message}
    </Box>,
    {
      position: "bottom-right",
      autoClose: autoClose === undefined ? false : autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );

export const infoNoti = (message, autoClose) =>
  toast.info(
    <Box display="flex" alignItems="center">
      <IconContext.Provider>
        <GiInfo size={20} style={{ marginRight: "5px" }} />
      </IconContext.Provider>
      {message}
    </Box>,
    {
      position: "bottom-right",
      autoClose: autoClose === undefined ? false : autoClose,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
