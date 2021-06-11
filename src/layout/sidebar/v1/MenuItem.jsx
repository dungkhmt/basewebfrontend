import { ListItemText } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import React from "react";
import ListItemLink from "./ListItemLink";

const infoColor = ["#00acc1", "#26c6da", "#00acc1", "#00d3ee"];
export const whiteColor = "#FFF";
export const hexToRgb = (input) => {
  input = input + "";
  input = input.replace("#", "");
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error("input is not a valid hex color.");
  }
  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase();
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let last = input[4] + input[5];
  return (
    parseInt(first, 16) +
    ", " +
    parseInt(second, 16) +
    ", " +
    parseInt(last, 16)
  );
};

const useStyles = makeStyles((theme) => ({
  firstOrderMenu: {
    color: whiteColor,
    "&.MuiListItem-button:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
  whiteFont: {
    color: whiteColor,
  },
  menuItem: {
    margin: "10px 15px 0 12px",
    padding: "10px",
    width: "auto",
    minWidth: 50,
    transition: "all 300ms linear",
    borderRadius: "3px",
    position: "relative",
    backgroundColor: "transparent",
    // lineHeight: "1.5em",
    height: 40,
    textDecoration: "none",
    "&:hover,&:focus,&:visited,&": {
      color: whiteColor,
    },
  },
  menuItemText: {
    fontWeight: theme.typography.fontWeightMedium,
    margin: "0",
    lineHeight: "30px",
    fontSize: "14px",
    color: whiteColor,
    paddingLeft: 54,
  },
  blue: {
    backgroundColor: infoColor[0],
    boxShadow:
      "0 12px 20px -10px rgba(" +
      hexToRgb(infoColor[0]) +
      ",.28), 0 4px 20px 0 rgba(" +
      hexToRgb("#000") +
      ",.12), 0 7px 8px -5px rgba(" +
      hexToRgb(infoColor[0]) +
      ",.2)",
    "&:hover,&:focus": {
      backgroundColor: infoColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb("#000") +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.2)",
    },
  },
}));

function MenuItem(props) {
  const classes = useStyles();
  const { color, menuItem, selected, menu } = props;

  if (!menuItem.isPublic) {
    if (!menu?.has(menuItem.id)) return null;
  }

  return (
    <ListItemLink
      button
      disableGutters={false}
      to={process.env.PUBLIC_URL + menuItem.path}
      className={clsx(classes.menuItem, {
        [classes[color]]: selected,
        [classes.firstOrderMenu]: !selected,
      })}
    >
      <ListItemText
        primary={menuItem.text}
        className={clsx(classes.menuItemText, classes.whiteFont)}
        disableTypography={true}
      />
    </ListItemLink>
  );
}

export default React.memo(MenuItem);
