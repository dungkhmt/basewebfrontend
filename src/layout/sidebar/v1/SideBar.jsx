import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { drawerWidth } from "../../../assets/jss/material-dashboard-react";
import styles from "../../../assets/jss/material-dashboard-react/components/sidebarStyle";
import { MENU_LIST } from "../../../config/menuconfig";
import GroupMenuItem from "./GroupMenuItem";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menu: {
    paddingTop: theme.spacing(10),
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawerPaper: {
    width: drawerWidth,
    border: "none",
    // boxShadow: `2px 0px 1px -1px rgb(0 0 0 / 20%),
    //   1px 0px 1px 0px rgb(0 0 0 / 14%),
    //   1px 0px 3px 0px rgb(0 0 0 / 12%)`,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    // width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sidebarWrapper: {
    width: "100%",
    paddingTop: 75,
    position: "relative",
    height: "100vh",
    zIndex: "4",
    // transitionDuration: ".2s, .2s, .35s",
    // transitionProperty: "top, bottom, width",
    // transitionTimingFunction: "linear, linear, ease",
  },
}));

export default function SideBar(props) {
  const assetClasses = makeStyles(styles)();
  const classes = useStyles();

  const { open, image, color: bgColor } = props;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: classNames(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classNames(classes.sidebarWrapper)}>
        <SimpleBar
          style={{
            height: "100%",
            overflowX: "hidden",
            overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu'scrollbar reach end
          }}
        >
          <nav>
            <List>
              {MENU_LIST.map((group) => (
                <GroupMenuItem key={group.text} group={group} color={bgColor} />
              ))}
            </List>
          </nav>
        </SimpleBar>
      </div>
      {image && (
        <div
          className={assetClasses.background}
          style={{ backgroundImage: "url(" + image + ")" }}
        />
      )}
    </Drawer>
  );
}

SideBar.propTypes = {
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  image: PropTypes.string,
  open: PropTypes.bool,
};
