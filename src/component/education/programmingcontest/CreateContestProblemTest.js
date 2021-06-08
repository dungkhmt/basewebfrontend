import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
} from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";

function CreateContestProblemTest() {
  return (
    <Card>
      <TextField>Test Name</TextField>
      <label>Select Input file</label>
      <input type="file" onChange={onInputFileChange} />

      <label>Select Output file</label>
      <input type="file" onChange={onOutputFileChange} />

      <TextField>Points</TextField>

      <button onClick={onUpload}>Upload!</button>
    </Card>
  );
}

export default CreateContestProblemTest;
