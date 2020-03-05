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
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import StoreIcon from "@material-ui/icons/Store";
import ImportExportIcon from "@material-ui/icons/ImportExport";

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
          text="Account"
          url="account"
          subItems={[
            {
              text: "Party",
              url: "party",
              permission: "VIEW_EDIT_PARTY"
            },
            {
              text: "User Login",
              url: "user-login",
              permission: "VIEW_EDIT_USER_LOGIN"
            }
          ]}
        />
        <NavMenu
          classes={classes}
          icon={<VerifiedUserIcon />}
          text="Security"
          url="security"
          subItems={[
            {
              text: "User Login to Group",
              url: "group",
              permission: "VIEW_EDIT_SECURITY_GROUP"
            },
            {
              text: "Group to Permission",
              url: "permission",
              permission: "VIEW_EDIT_SECURITY_PERMISSION"
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
              text: "View & Edit",
              url: "view-edit",
              permission: "VIEW_EDIT_ORDER"
            }
          ]}
        />

        <NavMenu
          classes={classes}
          icon={<LocalMallIcon />}
          text="Product"
          url="product"
          subItems={[
            {
              text: "View & Edit",
              url: "view-edit",
              permission: "VIEW_EDIT_PRODUCT"
            }
          ]}
        />

        <NavMenu
          classes={classes}
          icon={<StoreIcon />}
          text="Facility"
          url="facility"
          subItems={[
            {
              text: "View & Edit",
              url: "view-edit",
              permission: "VIEW_EDIT_FACILITY"
            }
          ]}
        />

        <NavMenu
          classes={classes}
          icon={<ImportExportIcon />}
          text="Import & Export"
          url="import-export"
          subItems={[
            {
              text: "Import",
              url: "import",
              permission: "IMPORT"
            },
            {
              text: "Export",
              url: "export",
              permission: "EXPORT"
            }
          ]}
        />
      </List>
    </Drawer>
  );
};

export default NavBar;
