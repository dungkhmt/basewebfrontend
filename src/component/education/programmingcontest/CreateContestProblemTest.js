import { Card, TextField } from "@material-ui/core/";
import React from "react";

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
