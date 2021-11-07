import React from "react";
function NewLineText(props) {
  const text = props.text;

  if (text == null) return "";
  else {
    const str = text.split("\n");
    console.log(str);
    var ret = "";
    var i;
    for (i = 0; i < str.length; i++) {
      const s = str[i];
      ret = ret + "<p>" + s + "</p>";
      console.log("s = ", s, " ret = ", ret);
    }
    return text.split("\n").map((str) => (
      <p>
        <span>{str}</span>
      </p>
    ));
    //return ret;
  }
}

export default NewLineText;
