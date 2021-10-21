import {Alert} from "@material-ui/lab";
import * as React from "react";

export function CompileStatus(props){
  const showCompile=props.showCompile;
  const statusSuccessful=props.statusSuccessful
  if(!showCompile){
    return(
      <div>
      <br/><br/>
    </div>);
  }else {
    if(statusSuccessful){
      return (
        <div>
          <Alert severity="success">Successful</Alert>
        </div>
      );
    }else{
      return (

        <div>
          <Alert severity="error">CompileError</Alert>
        </div>
      );
    }

  }
}