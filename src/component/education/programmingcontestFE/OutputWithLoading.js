import ContentLoader from "react-content-loader";
import CodeMirror from "@uiw/react-codemirror";
import React, {useEffect, useState} from "react";

export function OutputWithLoading(props){
  const load = props.load;
  const output = props.output;
  const extension = props.extension;
  const color = props.color;

  if(load){
    return <ContentLoader
      speed={2}
      width={"100%"}
      height={"200px"}
      viewBox="0 0 400 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
      <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
      <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
      <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
      <circle cx="20" cy="20" r="20" />
    </ContentLoader>;
  }else{
    return <CodeMirror
      value={output}
      height={"150px"}
      width="100%"
      extensions={extension}
      autoFocus={true}
      editable={false}
      theme={color}
    />
  }
}