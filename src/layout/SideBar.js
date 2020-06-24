import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useTheme } from "@material-ui/core/styles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { menuIconMap, MENU_LIST } from "../config/menuconfig";
import { useSelector } from "react-redux";

const drawerWidth = 340;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: 0,
    [theme.breakpoints.up("sm")]: {
      width: 0,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
export default function SideBar(props) {
  const open = props.open;
  const handleDrawerClose = props.handleDrawerClose;
  const theme = useTheme();

  const selectedFunction = useSelector((state) => state.menu.selectedFunction);
  const classes = useStyles();
  const [openCollapse, setOpenCollapse] = React.useState(new Set());
  const handleOpenCollapseMenu = (id) => {
    let newCollapse = new Set(openCollapse);
    if (!newCollapse.has(id)) {
      newCollapse.add(id);
      setOpenCollapse(newCollapse);
    }
  };
  const handleListClick = (id) => {
    let newCollapse = new Set(openCollapse);
    if (newCollapse.has(id)) newCollapse.delete(id);
    else newCollapse.add(id);
    setOpenCollapse(newCollapse);
  };

  useEffect(() => {
    if (selectedFunction !== null)
      if (
        selectedFunction.parent !== null &&
        selectedFunction.parent !== undefined
      ) {
        handleOpenCollapseMenu(selectedFunction.parent.id);

        if (
          selectedFunction.parent.parent !== null &&
          selectedFunction.parent.parent !== undefined
        ) {
          handleOpenCollapseMenu(selectedFunction.parent.partent.id);
        }
      }
  }, [selectedFunction]);
  // const logo = require('../favicon.ico');

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        {/*<img src={logo} height={25} width={25}/>*/}
        {/*<h2>{'Daily Opt'}</h2>*/}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <ListMenuItem
        configs={MENU_LIST}
        openCollapse={openCollapse}
        menu={props.menu}
        handleListClick={handleListClick}
        iconMap={menuIconMap}
        selectedFunction={selectedFunction}
      />
    </Drawer>
  );
}

function ListMenuItem(props) {
  let menuItems = props.configs.map((config) => (
    <MenuItem
      config={config}
      openCollapse={props.openCollapse}
      menu={props.menu}
      handleListClick={props.handleListClick}
      iconMap={props.iconMap}
      selectedFunction={props.selectedFunction}
    />
  ));
  return (
    <List component="div" disablePadding>
      {menuItems}
    </List>
  );
}

function MenuItem(props) {
  let classes = useStyles();
  if (!props.config.isPublic) if (!props.menu.has(props.config.id)) return "";
  let icon = (
    <ListItemIcon>{props.iconMap.get(props.config.icon)}</ListItemIcon>
  );
  let menu = {};
  if (
    props.config.child !== undefined &&
    props.config.child !== null &&
    props.config.child.length !== 0
  ) {
    menu = (
      <div>
        <ListItem button onClick={() => props.handleListClick(props.config.id)}>
          {icon}
          <ListItemText primary={props.config.text} />
          {props.openCollapse.has(props.config.id) ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItem>
        <Collapse
          in={props.openCollapse.has(props.config.id)}
          timeout="auto"
          unmountOnExit
        >
          <ListMenuItem
            iconMap={props.iconMap}
            configs={props.config.child}
            openCollapse={props.openCollapse}
            menu={props.menu}
            handleListClick={props.handleListClick}
            selectedFunction={props.selectedFunction}
          />
        </Collapse>
      </div>
    );
  } else {
    menu = (
      <div>
        <ListItem
          button
          className={classes.nested}
          component={Link}
          selected={
            props.selectedFunction !== null
              ? props.config.id === props.selectedFunction.id ||
                props.config.path === props.selectedFunction.path
              : false
          }
          to={process.env.PUBLIC_URL + props.config.path}
        >
          {icon}
          <ListItemText primary={props.config.text} />
        </ListItem>
      </div>
    );
  }
  return menu;
}
