import Pagination from "@material-ui/lab/Pagination";
import React, { useState, useEffect } from "react";
import {Grid, MenuItem, Table, TableBody, TableCell, TableHead, TextField} from "@material-ui/core";
// import {authGet} from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import TableRow from "@material-ui/core/TableRow";
import {win} from "leaflet/src/core/Browser";
import {Link, NavLink} from "react-router-dom";
import {request} from "./Request";
import {API_URL} from "../../../config/config";
import {styled} from "@mui/material/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



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
    // await authGet(dispatch, token, "/get-contest-problem-paging?size="+pageSize+"&page="+(page-1)).then(
    //   (res) => {
    //     console.log("problem list", res);
    //     setTotalPage(res.totalPages);
    //     setContestProblems(res.content);
    //   }
    // )
    request(
      "get",
      API_URL+"/get-contest-problem-paging?size="+pageSize+"&page="+(page-1),
      (res)=>{
        console.log("problem list", res.data);
        setTotalPage(res.data.totalPages);
        setContestProblems(res.data.content);
      }
    ).then();
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="left">Title</StyledTableCell>
                <StyledTableCell align="left">Solution</StyledTableCell>
                <StyledTableCell align="left">Difficulty</StyledTableCell>
                <StyledTableCell align="left">Add Testcase</StyledTableCell>
                <StyledTableCell align="left">Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contestProblems.map((problem) => (
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">

                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/problem-detail/"+problem.problemId}  style={{ textDecoration: 'none', color:"#000000", hover:{color:"#00D8FF", textPrimary:"#00D8FF"}}} >
                      {problem.problemName}
                    </Link>
                  </StyledTableCell>

                  <StyledTableCell align="left">

                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <span style={{color:getColor(`${problem.levelId}`)}}>{`${problem.levelId}`}</span>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/problem-detail-create-test-case/"+problem.problemId}  style={{ textDecoration: 'none', color:"black"}} >
                      ADD
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/edit-problem/"+problem.problemId}  style={{ textDecoration: 'none', color:"black", cursor:""}} >
                      Edit
                    </Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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