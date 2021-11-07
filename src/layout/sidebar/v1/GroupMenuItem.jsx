import { Downgraded } from "@hookstate/core";
import {
  Collapse,
  Icon,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { whiteColor } from "../../../assets/jss/material-dashboard-react";
import { menuIconMap } from "../../../config/menuconfig";
import { useMenuState } from "../../../state/MenuState";
import MenuItem, { hexToRgb } from "./MenuItem";

export const menuItemBaseStyle = (theme) => ({
  whiteFont: {
    color: "#FFF",
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
  },
  menuItemIcon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    marginRight: "15px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "rgba(" + hexToRgb(whiteColor) + ", 0.8)",
  },
  menuItemText: {
    fontWeight: theme.typography.fontWeightMedium,
    margin: "0",
    lineHeight: "30px",
    fontSize: "14px",
  },
});

const useStyles = makeStyles((theme) => ({
  childSelected: {
    "&.MuiListItem-button": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
  iconExpand: { transform: "rotate(-180deg)", transition: "0.3s" },
  iconCollapse: { transition: "0.3s" },
  whiteFont: {
    ...menuItemBaseStyle(theme).whiteFont,
  },
  menuItemIcon: {
    ...menuItemBaseStyle(theme).menuItemIcon,
  },
  menuItemText: {
    ...menuItemBaseStyle(theme).menuItemText,
  },
  menuItem: {
    ...menuItemBaseStyle(theme).menuItem,
    color: whiteColor,

    "&.MuiListItem-button:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
}));

const activeRoute = (route) => {
  if (route === "/" || route === "") {
    // access http://localhost:3000/ or http://localhost:3000, location is always http://localhost:3000/
    return window.location.href === `${process.env.REACT_APP_PUBLIC_URL}/`;
  } else
    return (
      window.location.href.indexOf(
        route,
        process.env.REACT_APP_PUBLIC_URL.length
      ) === process.env.REACT_APP_PUBLIC_URL.length
    );
};

function GroupMenuItem(props) {
  const classes = useStyles();
  const { color, group } = props;
  const location = useLocation();

  //
  const menuState = useMenuState();
  const permittedFunctions = menuState.permittedFunctions
    .attach(Downgraded)
    .get();

  //
  const [expanded, setExpanded] = useState(false);
  const [hasChildSelected, setHasChildSelected] = useState(false);
  const [selected, setSelected] = useState(
    group.child.map((menuItem) => activeRoute(menuItem.path))
  );

  //
  const checkSelected = () => {
    setHasChildSelected(false);
    setSelected(
      group.child.map((menuItem) => {
        const selected = activeRoute(menuItem.path);

        if (selected) setHasChildSelected(true);
        return selected;
      })
    );
  };

  useEffect(() => {
    checkSelected();
  }, [location.pathname]);

  if (!group.isPublic) {
    if (!permittedFunctions.has(group.id)) return null;
  }

  if (group.child?.length === 1) {
    const childMenuItem = group.child[0];

    return (
      <MenuItem
        key={childMenuItem.text}
        menuItem={childMenuItem}
        color={color}
        selected={selected[0]}
        menu={permittedFunctions}
        icon
      />
    );
  } else
    return (
      <li>
        <ListItem
          button
          key={group.text}
          className={classNames(classes.menuItem, {
            [classes.childSelected]: hasChildSelected,
          })}
          onClick={() => setExpanded(!expanded)}
        >
          {/* Icon */}
          <Icon
            className={classNames(classes.menuItemIcon, classes.whiteFont)}
            style={{ marginLeft: 3, marginRight: 27 }}
          >
            {menuIconMap.get(group.icon)}
          </Icon>

          {/* Label */}
          <ListItemText
            primary={group.text}
            className={classNames(classes.menuItemText, classes.whiteFont)}
            disableTypography={true}
          />

          <Icon
            className={classNames(classes.menuItemIcon, classes.whiteFont, {
              [classes.iconExpand]: expanded,
              [classes.iconCollapse]: !expanded,
            })}
            style={{ marginRight: 0, marginLeft: 6 }}
          >
            <ArrowDropDownIcon />
          </Icon>
        </ListItem>
        <Collapse in={expanded} timeout="auto">
          <List disablePadding>
            {group.child.map((childMenuItem, index) => (
              <MenuItem
                key={childMenuItem.text}
                menuItem={childMenuItem}
                color={color}
                selected={selected[index]}
                menu={permittedFunctions}
              />
            ))}
          </List>
        </Collapse>
      </li>
    );
}

export default GroupMenuItem;
