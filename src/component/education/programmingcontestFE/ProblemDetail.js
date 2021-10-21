import * as React from 'react';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import {cpp, cppLanguage} from '@codemirror/lang-cpp';
import {java} from '@codemirror/lang-java';
import {pythonLanguage} from '@codemirror/lang-python';
import { go } from '@codemirror/legacy-modes/mode/go';
import { javascript } from '@codemirror/lang-javascript';
import { StreamLanguage } from '@codemirror/stream-parser';
import CodeMirror from "@uiw/react-codemirror";
import {
  Tabs,
  Tab,
  Toolbar,
  Box,
  TextField,
  Grid, MenuItem, Button, TextareaAutosize,
} from "@material-ui/core";
import { MuiThemeProvider, createTheme, makeStyles } from "@material-ui/core/styles";
import {Console} from "./Console";
import {ScrollBox} from 'react-scroll-box';
import PropTypes from "prop-types"; // ES6
import {a11yProps, TabPanel} from "./TabPanel";
import {authGet, authPost} from "../../../api";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {Markup} from "interweave";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: theme.navBarHeight
  },
  // tabIndicator: {
  //   backgroundColor: PRIMARY_RED.default
  // },
  tabBar: {
    top: '80px'
  },
  rightAlign: {
    marginLeft: 'auto',
  },
  appBarContainer : {
    padding : '10px 20px'
    , display : 'flex'
    , flexFlow : 'row nowrap'
    , justifyContent : 'space-between'
    , marginBottom : '0px ' // removing !important doesn't help
    , '& > *' : {
      border : "2px dashed back"
    }
  }
}));




export default function ProblemDetail(){
  const [description, setDescription] = useState();
  const [solution, setSolution] = useState();
  const [problem, setProblem] = useState();
  const [value, setValue] = useState(0);
  const [color, setColor] = useState("light");
  const colorList = ["light", "dark"];
  const [computerLanguage, setComputerLanguage] = useState("CPP");
  const computerLanguageList = ["CPP", "GOLANG", "JAVA", "PYTHON3"];
  const classes = useStyles();
  const [source, setSource] = useState();
  const [showConsole, setShowConsole] = useState(false);
  const [screenHeight, setScreenHeight] = useState((window.innerHeight-180) + "px");
  const [runCodeLoading, setRunCodeLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState();
  const [consoleTabIndex, setConsoleTabIndex] = useState(0);
  const [timeLimit, setTimeLimit] = useState(false);
  const [accept, setAccept] = useState(false);
  const [run, setRun] = useState(false);
  const [expected, setExpected] = useState();
  const [compileError, setCompileError] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const {problemId} = useParams();
  const history = useHistory();

  const onInputChange = (input) =>{
    setInput(input);
  }
  const onChangeConsoleTabIndex = (value)=>{
    setConsoleTabIndex(value)
  }
  const handleScroll = () =>{
    if(showConsole){
      setScreenHeight((window.innerHeight-180) + "px");
      setShowConsole(false);
    }else{
      setScreenHeight((window.innerHeight-455) + "px");
      setShowConsole(true);
    }

  }

  const handleRunCode = () =>{
    console.log("handle run code")
    setRunCodeLoading(true);
    setConsoleTabIndex(1);
    setShowConsole(true);
    setScreenHeight((window.innerHeight-455) + "px");
    let body =  {
      sourceCode: source,
      computerLanguage: computerLanguage,
      input: input
    }
    authPost(dispatch, token, "/problem-detail-run-code/"+problemId,body).then(
      (res) =>{
        console.log("res" , res);
        setRun(true);
        setRunCodeLoading(false);
        if(res.status == "Time Limit Exceeded"){
          setTimeLimit(true);
          setCompileError(false);
          setAccept(false);
        }else if(res.status == "Compile Error"){
          setTimeLimit(false);
          setCompileError(true);
          console.log("111");
        }else if(res.status == "Accept"){
          setAccept(true);
          setTimeLimit(false);
          setCompileError(false);
        }else{
          setAccept(false);
          setTimeLimit(false);
          setCompileError(false);
        }
        setOutput(res.output);
        setExpected(res.expected);

        // setAccept(true);
        // setTimeLimit(false);
      }
    )
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getExtension = () =>{
    switch (computerLanguage){
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

  useEffect(() =>{
    authGet(dispatch,token, "/problem-details/"+problemId).then(
      (res) =>{
        console.log("res ", res);
        setProblem(res);
        setDescription(res.problemDescription);
        setSolution(res.solution);
      }
    );
  },[])

  return (
    <div onScroll={false}>

      {/*<AppBar position="static" color={"default"} variant={"outlined"} style={{width: "100%", height: "65px", marginTop:"0px"}} >*/}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar style={{height:"0px", marginTop:"-12px", marginBottom:"-8px", border:"1px solid transparent", position: "relative", width:"100%"}} color={"default"} >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor={"primary"}
              autoFocus
              style={{
                width:"50%",
                display:"inline-table",
                border: "1px solid transparent ",
                position: "relative",
                borderBottom:"none",
              }}
              // variant={"fullWidth"}
              aria-label="basic tabs example"
            >
              <Tab label="Description" {...a11yProps(0)} style={{width:"25%"}}/>
              <Tab label="Solution" {...a11yProps(1)} style={{width:"25%"}}/>
              <Tab label="Discuss" {...a11yProps(2)} style={{width:"25%"}}/>
              <Tab label="Submissions" {...a11yProps(3)} style={{width:"25%"}}/>
            </Tabs>
            <div>

              <TextField
                style={{width:0.075*window.innerWidth, margin:20}}
                variant={"outlined"}
                size={"small"}
                autoFocus
                value={computerLanguage}
                select
                id="computerLanguage"
                onChange={(event) => {
                  setComputerLanguage(event.target.value);
                }}
              >
                {computerLanguageList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{width:"100px", margin:20}}
                variant="outlined"
                size="small"
                autoFocus
                // required
                value={color}
                select
                id="color"
                onChange={(event) => {
                  setColor(event.target.value);
                }}
              >
                {colorList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Toolbar>
        </Box>
      {/*</AppBar>*/}
      {/*</MuiThemeProvider>*/}




      <Grid container spacing={12}>
        <Grid item xs={6}>
          <TabPanel value={value} index={0}>
            <ScrollBox style={{width: '100%', overflow:"auto", height:(window.innerHeight-180) + "px"}}>
              <Markup content={description} />
            </ScrollBox>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ScrollBox style={{width: '100%', overflow:"auto", height:(window.innerHeight-180) + "px"}}>
              <Markup content={solution} />
            </ScrollBox>
          </TabPanel>
          <TabPanel value={value} index={2}>
          </TabPanel>
          <TabPanel value={value} index={3}>
          </TabPanel>
        </Grid>
        <Grid item xs={6}>
          <CodeMirror
            height={screenHeight}
            width="100%"
            extensions={getExtension()}
            onChange={(value, viewUpdate) => {
              setSource(value);
            }}
            autoFocus={false}
            theme={color}
          />
          <Console
            showConsole={showConsole}
            load={runCodeLoading}
            output={output}
            color={color}
            extension={getExtension()}
            input={input}
            onInputChange={onInputChange}
            consoleTabIndex={consoleTabIndex}
            onChangeConsoleTabIndex={onChangeConsoleTabIndex}
            accept={accept}
            run={run}
            timeLimit={timeLimit}
            expected={expected}
            compileError={compileError}
          />
        </Grid>
      </Grid>





      <Button
        variant="contained"
        color="light"
        // style={{marginLeft:"90px"}}
        // onClick={handleRun}
        // style={{position}}
        style={{left:"95%"}}
      >
        Submit
      </Button>
      <Button
        variant="contained"
        color="light"
        // style={{marginLeft:"90px"}}
        onClick={handleRunCode}
        // style={{position}}
        style={{left:"82%"}}
      >
        Run Code
      </Button>
      <Button
        variant="contained"
        color="light"
        // style={{marginLeft:"90px"}}
        onClick={handleScroll}
        // style={{position}}
        style={{left:"40%"}}
        extension={getExtension()}
      >
        Console
      </Button>
    </div>


  );

}