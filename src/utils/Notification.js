import React from "react";
import { IconContext } from "react-icons/lib/cjs";
import { toast } from "react-toastify";
import { GiInfo } from "react-icons/gi";
import { FiCheckCircle } from "react-icons/fi";
import { MdCancel, MdWarning } from "react-icons/md";
import { Box } from "@material-ui/core";

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
      <IconContext.Provider>
        <FiCheckCircle size={20} style={{colorl: 'white', marginRight: "5px" }} />
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
