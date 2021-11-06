import {Button, Grid, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {cpp, cppLanguage} from '@codemirror/lang-cpp';
import {java} from '@codemirror/lang-java';
import {pythonLanguage} from '@codemirror/lang-python';
import { go } from '@codemirror/legacy-modes/mode/go';
import { StreamLanguage } from '@codemirror/stream-parser';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import {useDispatch, useSelector} from "react-redux";
import {authPost} from "../../../api";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import {OutputWithLoading} from "./OutputWithLoading";

function IDE(){
  const dispatch = useDispatch();
  const [computerLanguage, setComputerLanguage] = useState("CPP");
  const computerLanguageList = ["CPP", "GOLANG", "JAVA", "PYTHON3"];
  const [source, setSource] = useState();
  const [screenHeight, setScreenHeight] = useState((window.innerHeight-200) + "px");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const colorList = ["light", "dark"];
  const [load, setLoad] = useState(false);
  const [color, setColor] = useState("light");
  const token = useSelector((state) => state.auth.token);
  async function handleRun() {
    // console.log("input", input);
    // console.log("source", source);
    setLoad(true);
    let body = {
      source: source,
      input: input,
    }
    await authPost(dispatch, token, "/ide/"+computerLanguage,body).then(
      (res) =>{
        console.log("done");
        console.log("res", res);
        setOutput(res.output);
        setLoad(false);
      }
    );



    // await fetch(API_URL + "/ide/"+computerLanguage, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //     "X-Auth-Token": token,
    //   },
    //   body: JSON.stringify(body),
    // }).then(
    //   (res)=>{
    //     if (!res.ok) {
    //       if (res.status === 401) {
    //         dispatch(failed());
    //         throw Error("Unauthorized");
    //       } else {
    //         console.log("res", res);
    //         try {
    //           res.json().then((res1) => console.log(res1));
    //         } catch (err) {}
    //         throw Error();
    //       }
    //       // return null;
    //     }
    //     console.log("res json", res);
    //   }
    // )
  }
  useEffect(() => {
    console.log("use effect");
    console.log("token ", token);
  }, [])
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

  return(
    <div>

      <TextField
        variant="outlined"
        size="small"
        autoFocus
        // required
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



      <Grid container spacing={12}>
        <Grid item xs={8}>
          <CodeMirror
            height={screenHeight}
            width="100%"
            extensions={getExtension()}
            onChange={(value, viewUpdate) => {
              setSource(value);
            }}
            autoFocus={true}
            theme={color}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={12}>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={10}>
              <Typography>Input</Typography>
              <CodeMirror
                value={input}
                height={"100px"}
                width="100%"
                extensions={getExtension()}
                onChange={(value, viewUpdate) => {
                  setInput(value);
                }}
                autoFocus={true}
                theme={color}
              />
            </Grid>
            <Grid container spacing={12}>
              <Grid item xs={2}></Grid>
              <Grid item xs={10}>
                <Typography>Output</Typography>
                <OutputWithLoading
                  load={load}
                  output={output}
                  extension={getExtension()}
                  color={color}
                />

              </Grid>
              <Grid item xs={2}></Grid>
              <Button
                variant="contained"
                color="light"
                // style={{marginLeft:"90px"}}
                onClick={handleRun}
              >
                Run Code
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default IDE;

