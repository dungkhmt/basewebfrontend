import React from "react";

import {
  Drawer,
  makeStyles,
  useTheme,
  IconButton,
  Divider,
  List
} from "@material-ui/core";

import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import NavMenu from "./NavMenu";

export const navBarWidth = 240;

export const drawerHeader = theme => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
});

const useStyles = makeStyles(
  theme =>
    console.log(theme) || {
      drawer: {
        width: navBarWidth,
        flexShrink: 0
      },
      drawerPaper: {
        width: navBarWidth
      },
      drawerHeader: drawerHeader(theme),
      innerNavItem: {
        paddingLeft: theme.spacing(4)
      },
      outerNavItemText: {
        ...theme.typography.h6
      },
      linkActive: {
        color: theme.palette.secondary.main
      }
    }
);

const NavBar = ({ open, handleNavBarClose }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleNavBarClose}>
          {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <NavMenu
          classes={classes}
          icon={<SupervisorAccountIcon />}
          text="Admin"
          url="admin"
          subItems={[
            {
              text: "Create User",
              url: "create-user"
            },
            {
              text: "View Users",
              url: "view-users"
            }
          ]}
        />

        <NavMenu
          classes={classes}
          icon={<ShoppingCartIcon />}
          text="Order"
          url="order"
          subItems={[
            {
              text: "Create Order",
              url: "create-order"
            },
            {
              text: "View Orders",
              url: "view-orders"
            }
          ]}
        />
      </List>
    </Drawer>
  );
};

export default NavBar;
