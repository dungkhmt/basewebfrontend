import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../../config/config";
import {Link} from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useHistory } from "react-router-dom";
import { CardContent, Tooltip, IconButton, BarChartIcon } from "@material-ui/core";
import { useParams } from "react-router";
function ProgramSubmissionDetail(){
    const params = useParams();
    const contestProgramSubmissionId = params.contestProgramSubmissionId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [programCode, setProgramCode] = useState(null);

    async function getProgramSubmissionDetail(){
        let res = await authGet(dispatch, token, '/get-detail-contest-program-submission/' + contestProgramSubmissionId);
        setProgramCode(res.programCode);
        console.log(res);
        
    }
    useEffect(() => {
        getProgramSubmissionDetail();
    }, []);


    return (

            <CardContent>
                {programCode.split("\n").map((i,key) => {
                    return <div key={key}>{i}</div>;
                })}
            </CardContent>

    );
}

export default ProgramSubmissionDetail;