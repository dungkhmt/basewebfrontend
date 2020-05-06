import InputLabel from "@material-ui/core/InputLabel";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import TextField from "@material-ui/core/TextField";

export const notNegativeIntFilterOnChange = (newValue, setValue) => {
  newValue = parseInt(newValue);
  notNegativeFilterOnChange(newValue, setValue);
};

export const notNegativeFilterOnChange = (newValue, setValue) => {
  if (newValue >= 0) {
    setValue(newValue);
  }
};

export function select(label, list, id, name, value, onChange) {
  return <div>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={event => onChange(event.target.value)}>
      {list.map(e => (<MenuItem value={e}>{e[name] + ' (' + e[id] + ')'}</MenuItem>))}
    </Select>
    <p/>
  </div>;
}

export function textField(id, label, type, value, onChange, readOnly) {
  return <div>
    <TextField id={id}
               label={label}
               type={type}
               fullWidth={true}
               value={value}
               onChange={event => onChange(event.target.value)}
               InputProps={{readOnly: readOnly}}/>
    <p/>
  </div>;
}