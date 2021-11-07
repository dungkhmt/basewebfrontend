import * as React from "react";

import Typography from "@mui/material/Typography";
import { Tab} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import CodeMirror from "@uiw/react-codemirror";
import ContentLoader from "react-content-loader";
import Box from '@mui/material/Box';
import {ScrollBox} from 'react-scroll-box'; // ES6

import {Alert} from "@material-ui/lab";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 0 }} marginLeft={"20px"}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function Console(props){
  const showConsole = props.showConsole;//
  const load = props.load;//
  const output = props.output;//
  const input = props.input;//
  const extension = props.extension;//
  const color = props.color;//
  const consoleTabIndex = props.consoleTabIndex;//
  const accept=props.accept;
  const timeLimit=props.timeLimit;
  const expected=props.expected;
  const run=props.run;
  const compileError=props.compileError;
  const handleChange = (event, newValue) => {
    props.onChangeConsoleTabIndex(newValue)
  };

  if(showConsole){
    return(
      <div>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={consoleTabIndex} onChange={handleChange} aria-label="basic tabs example" indicatorColor={"primary"} style={{marginLeft:"20px", marginTop:"-10px"}}>
                <Tab label="Testcase" {...a11yProps(0)} />
                <Tab label="Run Code Result" {...a11yProps(1)} />
              </Tabs>
          </Box>
          <TabPanel value={consoleTabIndex} index={0}>
            <CodeMirror
              value={input}
              height={"233px"}
              width="100%"
              extensions={extension}
              onChange={(value, viewUpdate) => {
                // setInput(value);
                props.onInputChange(value);
              }}
              autoFocus={true}
              theme={color}
            />
          </TabPanel>
          <TabPanel value={consoleTabIndex} index={1}>
            <ConsoleOutput
              load={load}
              accept={accept}
              output={output}
              expected={expected}
              input={input}
              run={run}
              timeLimit={timeLimit}
              compileError={compileError}
            />
          </TabPanel>
        </Box>
      </div>
    );
  }else{
    return (
      <div></div>
    );
  }
}

export function ConsoleOutput(props){
  const load=props.load;
  const accept=props.accept;
  const output=props.output;
  const expected=props.expected;
  const run=props.run;
  const timeLimit=props.timeLimit;
  const input=props.input;
  const compileError=props.compileError;

  if(load){
    return(
      <ContentLoader
        speed={3}
        width={"100%"}
        height={"233px"}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="5" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="30" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="55" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="80" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="115" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="140" rx="3" ry="3" width="100%" height="20" />
        <rect x="0" y="165" rx="3" ry="3" width="100%" height="20" />
      </ContentLoader>
    );
  }else{
    if(!run){
      return (
        <div>
          <br/><br/><br/>
          <Box sx={{ display: 'flex',   p: 1}}>

            <ScrollBox style={{width: '100%', overflow:"auto", height:"148px"}}  >
              <Typography variant={"h4"} style={{marginLeft:"20%"}} color={"#d6d6d6"}  >
                You must run your code first.
              </Typography>
            </ScrollBox>
          </Box>

        </div>
      );
    }else{
      if(timeLimit){
        return (
          <Alert severity="error">Time Limit Exceed</Alert>
        );
      }else if(compileError){
        return (
          <Alert severity="error">
            Compile Error <br/>
            {output}
          </Alert>
        );
      }else{
        if(accept){
          return (
            <div >
              <Alert severity="success">Accept</Alert>
              <Box sx={{ display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <Typography noWrap={false}>Input: {input}</Typography>
              </Box>
              <Box sx={{ display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <Typography>Output: {output}</Typography>
              </Box>
              <Box sx={{ display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <Typography>Expected: {expected}</Typography>
              </Box>
            </div>
          );
        }else{
          return (
            <div>
              <Alert severity="warning">Wrong Answer</Alert>
              <Box sx={{display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <ScrollBox style={{width: '100%', overflow:"auto", height:"50px"}}  >
                  Input: {input}
                </ScrollBox>
              </Box>
              <Box sx={{ display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <ScrollBox style={{width: '100%', overflow:"auto", height:"50px"}}  >
                  Output: {output}
                </ScrollBox>
              </Box>
              <Box sx={{ display: 'flex',  bgcolor: 'background.paper', p: 1}}>
                <ScrollBox style={{width: '100%', overflow:"auto", height:"50px"}}  >
                  Expected: {expected}
                </ScrollBox>
              </Box>
              {/*<Box sx={{ border: 1 }}>11</Box>*/}

            </div>
          )
        }
      }
    }
  }
}
