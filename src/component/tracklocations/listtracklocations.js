import React,{ useEffect, useState } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {connect} from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from "../../config/config";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

function ListTrackLocations(props) {
    const classes = useStyles();
    const [data,setData]= useState([]);
    /*
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
      }
      
    const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];
    */

    //const data = [{"trackLocationId":"bd3b7ecb-9bda-48b3-8486-28cd23d3704d","partyId":"287db6a8-2783-11ea-b1c9-54bf64436441","location":"10.11,103.83","timePoint":"2019-12-26T04:45:50.770+0000"},
    //{"trackLocationId":"fbd864f3-252b-4788-b80c-b7dbff9fe066","partyId":"287db6a8-2783-11ea-b1c9-54bf64436441","location":"10.11,103.83","timePoint":"2019-12-26T04:45:50.770+0000"},
    //{"trackLocationId":"db04cf36-8de5-46d9-9e95-e53913eee34a","partyId":"287db6a8-2783-11ea-b1c9-54bf64436441","location":"10.11,103.83","timePoint":"2019-12-26T04:45:50.770+0000"},
    //{"trackLocationId":"a2401982-6c84-4708-b867-cb8d292b8516","partyId":"287db6a8-2783-11ea-b1c9-54bf64436441","location":"10.11,103.83","timePoint":"2019-12-26T04:45:50.770+0000"}];
    useEffect(() => {
      console.log("listtracklocations , useEffect");
        console.log(props.isUpdate);
        const headers = new Headers();

        //headers.append("Accept", "application/json");
    
        headers.append("X-Auth-Token", props.token);
        fetch(`${API_URL}/get-track-locations`, {
          method: "GET",
          headers: headers
        })
          .then(res => res.json())
          .then(
            res => {
                setData(res);
                console.log(res);
            },
            error => {
                setData([]);
            }
          );
      },[props.isUpdate]);
    return (
      
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Party</TableCell>
            <TableCell align="right">Location</TableCell>
            <TableCell align="right">Time-Point</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.trackLocationId}>
              <TableCell component="th" scope="row">
                {row.partyId}
              </TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.timePoint}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>

        
    );
  }
  const mapStateToProps = state => ({
    token: state.auth.token
  });
  
  const mapDispatchToProps = dispatch => ({});
  
  export default connect(mapStateToProps, mapDispatchToProps)(ListTrackLocations);