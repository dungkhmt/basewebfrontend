import Pagination from "@material-ui/lab/Pagination";
import React, { useState, useEffect } from "react";
import {Grid, MenuItem, Table, TableBody, TableCell, TableHead, TextField} from "@material-ui/core";
import {authGet} from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import TableRow from "@material-ui/core/TableRow";
import {win} from "leaflet/src/core/Browser";
import {Link} from "react-router-dom";


function ListProblem(){
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPage] = useState(0);
  const pageSizes = [1,3, 6, 9];
  const [contestProblems, setContestProblems] = useState([])


  const handlePageChange = (event, value) => {
    setPage(value);
    // getProblemContestList();
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    // getProblemContestList();
  };

  async function getProblemContestList() {
    // var p = page-1;
    console.log("p ", page);
    await authGet(dispatch, token, "/get-contest-problem-paging?size="+pageSize+"&page="+(page-1)).then(
      (res) => {
        console.log("problem list", res);
        setTotalPage(res.totalPages);
        setContestProblems(res.content);
      }
    )
  }

  useEffect(() => {
    console.log("use effect");
    getProblemContestList()
  }, [page, pageSize])

  const getColor = (level) => {
    const colors = ['red', 'yellow', 'green']
    switch (level){
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'blue';
    }
  }


  return (
    <div>
      <div>
        <TableHead>
          <TableCell width={"10%"}>
            Status
          </TableCell>
          <TableCell width={"50%"}>
            Title
          </TableCell>
          <TableCell width={"10%"}>
            Solution
          </TableCell>
          <TableCell width={"10%"}>
            Difficulty
          </TableCell>
          <TableCell width={"10%"}>
            Add Testcase
          </TableCell>
          <TableCell width={"10%"}>
            Difficulty
          </TableCell>
        </TableHead>
        <TableBody>
          {
            contestProblems.map(problem =>{
              return(
                <TableRow>
                  <TableCell width={"10%"}>

                  </TableCell>
                  <TableCell width={"50%"}>
                    <Link to={"/programming-contest/problem-detail/"+problem.problemId}  style={{ textDecoration: 'none', color:"black", cursor:""}} >
                      {problem.problemName}
                    </Link>
                  </TableCell>
                  <TableCell width={"10%"}>

                  </TableCell>
                  <TableCell width={"10%"} >
                    <span style={{color:getColor(`${problem.levelId}`)}}>{`${problem.levelId}`}</span>
                  </TableCell>
                  <TableCell width={"10%"}>
                    <Link to={"/programming-contest/problem-detail-create-test-case/"+problem.problemId}  style={{ textDecoration: 'none', color:"black", cursor:""}} >
                      ADD
                    </Link>
                  </TableCell>
                  <TableCell width={"10%"}>

                  </TableCell>
                </TableRow>
              );

            })
          }
        </TableBody>
      </div>
      <br></br>
      <Grid container spacing={12}>
        <Grid item xs={6}>

          <TextField
            variant={"outlined"}
            autoFocus
            size={"small"}
            required
            select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizes.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item >
          <Pagination
            className="my-3"
            count={totalPages}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>


    </div>
  )
}
export default ListProblem;