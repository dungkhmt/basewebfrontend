import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor, } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {authPost} from "../../../api";
import {Button} from "@material-ui/core";
import draftToHtml from "draftjs-to-html";
import {API_URL} from "../../../config/config";
import {cpp, cppLanguage} from '@codemirror/lang-cpp';
import {java} from '@codemirror/lang-java';
import {pythonLanguage} from '@codemirror/lang-python';
import { go } from '@codemirror/legacy-modes/mode/go';
import { javascript } from '@codemirror/lang-javascript';
import { StreamLanguage } from '@codemirror/stream-parser';
import CodeMirror from "@uiw/react-codemirror";
import {SubmitWarming} from "./SubmitWarming";
import {CompileStatus} from "./CompileStatus";
import {SubmitSuccess} from "./SubmitSuccess";
import {useParams} from "react-router";
import {request} from "./Request";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));
const descriptionStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,

    },

  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },

}));

const editorStyle = {
  toolbar: {
    background: "#FFFFFF",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

function EditProblem(){
  const {problemId} = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();
  const [problemName, setProblemName] = useState("");
  const [problemDescriptions, setProblemDescription] = useState();
  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(1);
  const [levelId, setLevelId] = useState("");
  const [categoryId, setCategoryId] = useState();
  const defaultLevel = ["easy", "medium", "hard"];
  const listCategory = [];
  const classes = useStyles();
  const descriptionClass = descriptionStyles();
  const [editorStateDescription, setEditorStateDescription] = useState(EditorState.createEmpty());
  const [editorStateSolution, setEditorStateSolution] = useState(EditorState.createEmpty());
  const [codeSolution, setCodeSolution] = useState();
  const [languageSolution, setLanguageSolution] = useState("CPP");
  const computerLanguageList = ["CPP", "GOLANG", "JAVA", "PYTHON3"];
  const [showSubmitWarming, setShowSubmitWarming] = useState(false);
  const [showCompile, setShowCompile] = useState(false);
  const [statusSuccessful, setStatusSuccessful] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  useEffect( () =>{
    console.log("problemid ", problemId);
    let url = API_URL+"/problem-details/"+problemId;
    console.log("url ", url);
    request(
      "get",
      API_URL+"/problem-details/"+problemId,
      (res) =>{
        console.log("res data", res.data);
        console.log(res.data.levelId);
        // setEditorStateDescription(EditorState.set(res.data.problemDescription));
        setProblemName(res.data.problemName);
        setLevelId(res.data.levelId);
        setMemoryLimit(res.data.memoryLimit);
        setCodeSolution(res.data.correctSolutionSourceCode);
        setTimeLimit(res.data.timeLimit);
        setEditorStateDescription(EditorState.createWithText(res.data.problemDescription));
        setEditorStateSolution(EditorState.createWithText(res.data.solution));
        // setEditorStateSolution(res.data.solution);
        // setLanguageSolution(res.data.correctSolutionLanguage);
        // setEditorStateDescription(res.data.description);
      },
      {}
    );
  }, [problemId]);

  const onChangeEditorStateDescription = (editorState) => {
    setEditorStateDescription(editorState);
  };



  const onChangeEditorStateSolution = (editorState) => {
    setEditorStateSolution(editorState);
  }

  const getExtension = () =>{
    switch (languageSolution){
      case "CPP":
        return [cppLanguage];
      case "GoLang":
        return StreamLanguage.define(go);
      case "Java":
        return java();
      case "Python3":
        return StreamLanguage.define(pythonLanguage);
      default:
        return javascript();
    }
  }

  function checkCompile(){
    console.log("check compile");
    let body = {
      source: codeSolution,
      computerLanguage: languageSolution
    }
    // authPost(dispatch, token, "/check-compile", body).then(
    //   (res) =>{
    //     console.log("res", res);
    //     if(res.status == "Successful"){
    //       setShowCompile(true);
    //       setShowSubmitWarming(false);
    //       setStatusSuccessful(true);
    //     }else{
    //       setShowCompile(true);
    //       setStatusSuccessful(false);
    //     }
    //   }
    // )
    request(
      "post",
      API_URL+"/check-compile",
      (res)=>{
        if(res.data.status == "Successful"){
          setShowCompile(true);
          setShowSubmitWarming(false);
          setStatusSuccessful(true);
        }else{
          setShowCompile(true);
          setStatusSuccessful(false);
        }
      },
      {},
      body
    ).then();
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function handleSubmit(){
    if(!statusSuccessful){
      setShowSubmitWarming(true);
      return;
    }
    let description = draftToHtml(convertToRaw(editorStateDescription.getCurrentContent()));
    let solution = draftToHtml(convertToRaw(editorStateSolution.getCurrentContent()));

    let body = {
      problemName: problemName,
      problemDescription: description,
      timeLimit: timeLimit,
      levelId: levelId,
      categoryId: categoryId,
      memoryLimit: memoryLimit,
      correctSolutionLanguage: languageSolution,
      solution: solution,
      correctSolutionSourceCode: codeSolution,
    }
    request(
      "post",
      API_URL+"/update-problem-detail/"+problemId,
      (res) =>{
        console.log("res ", res);
        setShowSubmitSuccess(true);
        sleep(1000).then(r => {
          history.push("/programming-contest/list-problems");
        });
      },
      {},
      body
    ).then();
  }

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Edit Problem <Typography variant="h4" > {problemId}</Typography>
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField
                  value={problemName}
                  autoFocus
                  required
                  id="problemName"
                  label="Problem Name"
                  placeholder="Problem Name"
                  onChange={(event) => {
                    setProblemName(event.target.value);
                  }}
                >
                </TextField>

                <TextField
                  autoFocus
                  required
                  id="timeLimit"
                  label="Time Limit"
                  placeholder="Time Limit"
                  onChange={(event) => {
                    setTimeLimit(event.target.value);
                  }}
                  value={timeLimit}
                >
                </TextField>

                <TextField
                  autoFocus
                  required
                  id="memoryLimit"
                  label="Memory Limit"
                  placeholder="Memory Limit"
                  onChange={(event) => {
                    setMemoryLimit(event.target.value);
                  }}
                  value={memoryLimit}
                >
                </TextField>

                <TextField

                  autoFocus
                  required
                  select
                  id="levelId"
                  label="Level ID"
                  placeholder="Level ID"
                  onChange={(event) => {
                    setLevelId(event.target.value);
                  }}
                  value={levelId}
                >
                  {defaultLevel.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  autoFocus
                  // required
                  select
                  id="categoryId"
                  label="Category ID"
                  placeholder="Category ID"
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                  }}
                  value={categoryId}
                >
                  {listCategory.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </form>
            <form className={descriptionClass.root} noValidate autoComplete="off">
              <div>
                <Typography>
                  <h2>Problem Description</h2>
                </Typography>
                <Editor
                  editorState={editorStateDescription}
                  handlePastedText={() => false}
                  onEditorStateChange={onChangeEditorStateDescription}
                  toolbarStyle={editorStyle.toolbar}
                  editorStyle={editorStyle.editor}
                />
              </div>
              <div>
                <Typography>
                  <h2>Problem Solution</h2>
                </Typography>
                <Editor
                  editorState={editorStateSolution}
                  handlePastedText={() => false}
                  onEditorStateChange={onChangeEditorStateSolution}
                  toolbarStyle={editorStyle.toolbar}
                  editorStyle={editorStyle.editor}
                />
              </div>
            </form>
            <Typography>
              <h2>Correct Solution Source Code</h2>
            </Typography>
            <TextField
              style={{width:0.075*window.innerWidth, margin:20}}
              variant={"outlined"}
              size={"small"}
              autoFocus
              value={languageSolution}
              select
              id="computerLanguage"
              onChange={(event) => {
                setLanguageSolution(event.target.value);
              }}
            >
              {computerLanguageList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <CodeMirror
              height={"500px"}
              width="100%"
              extensions={getExtension()}
              onChange={(value, viewUpdate) => {
                setCodeSolution(value);
              }}
              autoFocus={false}

              value={codeSolution}
            />
            <CompileStatus
              showCompile={showCompile}
              statusSuccessful={statusSuccessful}/>

          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="light"
              style={{marginLeft:"45px"}}
              onClick={checkCompile}
            >
              Check Solution Compile
            </Button>
            <Button
              variant="contained"
              color="light"
              style={{marginLeft:"45px"}}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <SubmitWarming
              showSubmitWarming={showSubmitWarming}
              content={"Your source must be pass compile process"}
            />
            <SubmitSuccess
              showSubmitSuccess={showSubmitSuccess}
              content={"You have saved problem"}/>
          </CardActions>
        </Card>
      </MuiPickersUtilsProvider>
    </div>
  );
}
export default EditProblem;

