import Collapse from "@material-ui/core/Collapse";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {MENU_LIST, menuIconMap} from "../config/menuconfig";

const drawerWidth = 340;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
}));
export default function SideBar(props) {
  const open = props.open;

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
          handleOpenCollapseMenu(selectedFunction.parent.parent.id);
        }
      }
  }, [selectedFunction]);
  // const logo = require('../favicon.ico');

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={clsx(classes.menu)}>
          <ListMenuItem
            configs={MENU_LIST}
            openCollapse={openCollapse}
            menu={props.menu}
            handleListClick={handleListClick}
            iconMap={menuIconMap}
            selectedFunction={selectedFunction}
          />
        </div>
      </Drawer>
    </div>
  );
}

function ListMenuItem(props) {
  let menuItems = props.configs.map((config) => (
    <MenuItem
      key={config.id}
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
