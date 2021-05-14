import {
    Button, Card, CardActions, CardContent, TextField, Typography, IconButton,
    MenuItem, Checkbox, 
  } from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
//import IconButton from '@material-ui/core/IconButton';

/* class QuizTestList extends React.Component {

    name(params) {
        
    }

    render() {
        const history = useHistory();
        return (
            //<Card>
            <IconButton color="primary" aria-label="upload picture" component="span" 
                onClick={() => { history.push('create_quiz_test') }}>
                 <AddIcon color='primary' fontSize='large' />
            </IconButton>
            /* <Button >
                <AddIcon color='primary' fontSize='large' />
            </Button> 
            
            //</Card>
        )
    }
} */

function QuizTestList(){
    const history = useHistory();

    return (
        //<Card>
        <IconButton color="primary" aria-label="upload picture" component="span" 
            onClick={() => { 
                history.push('create-quiz-test');
            }}>
                <AddIcon color='primary' fontSize='large' />
        </IconButton>
    )
}

export default QuizTestList;