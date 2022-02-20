import { TableCell, TableRow, Typography } from "@material-ui/core";
import { Box } from "@mui/system";
import React from "react";

export default function TableRowProductInfo({ keyInfo, data, label }) {
  return (
    <TableRow key={keyInfo}>
      <TableCell align="left">
        <Box fontWeight="fontWeightBold" m={1} fontSize={20}>
          {label}
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body1" component="h4">
          {data}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
