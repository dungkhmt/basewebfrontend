import { CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { authGet } from "../../../api";
import NewLineText from "./NewLineText";

function ProgramSubmissionDetail() {
  const params = useParams();
  const contestProgramSubmissionId = params.contestProgramSubmissionId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [programCode, setProgramCode] = useState(null);

  async function getProgramSubmissionDetail() {
    let res = await authGet(
      dispatch,
      token,
      "/get-detail-contest-program-submission/" + contestProgramSubmissionId
    );
    setProgramCode(res.programCode);
    console.log(res);
  }
  useEffect(() => {
    getProgramSubmissionDetail();
  }, []);

  return (
    <CardContent>
      <NewLineText text={programCode} />
    </CardContent>
  );
}

export default ProgramSubmissionDetail;
