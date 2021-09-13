import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { default as MenuIcon } from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import bgImage from "../assets/img/sidebar-2.webp";
import AccountButton from "./account/AccountButton";
import NotificationButton from "./notification/NotificationButton";
import SideBar, { drawerWidth, miniDrawerWidth } from "./sidebar/v1/SideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: theme.shadows[1],
    // transition: theme.transitions.create(["width", "margin"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
  },
  menuButton: {
    marginRight: 24,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  title: {
    paddingLeft: 4,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  maxWidthContent: {
    maxWidth: `calc(100% - ${miniDrawerWidth}px)`,
    transition: theme.transitions.create("max-width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  minWidthContent: {
    maxWidth: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create("max-width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // appBarShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // },
  // appBarTitle: {
  //   marginLeft: theme.spacing(2),
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // },
  // hideButton: {
  //   marginLeft: drawerWidth / 2 - theme.spacing(6),
  // },
  // largeIcon: {
  //   width: 50,
  //   height: 50,
  // },
}));

function Layout(props) {
  const { children } = props;
  const classes = useStyles();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [open, setOpen] = React.useState(true);
  const [image] = useState(bgImage);
  const [color] = useState("blue");

  return (
    <div className={classes.root}>
      <AppBar
        elevation={0}
        position="fixed"
        color="inherit"
        className={clsx(classes.appBar, {
          // [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {/* <IconButton color="inherit" className={clsx(classes.largeIcon, {})}>
            <Logo fontSize="large" />
          </IconButton>
          {open ? (
            <Typography variant="h6" noWrap>
              
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawer}
                edge="start"
                className={classes.hideButton}
              >
                <MenuOpenIcon />
              </IconButton>
            </Typography>
          ) : ( */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            className={clsx(classes.menuButton, {
              // [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <SvgIcon fontSize="large">
            <Logo width={20} height={20} x={2} y={2} />
          </SvgIcon>
          {/* )} */}
          <Typography className={classes.title} variant="h6" noWrap>
            Open ERP
          </Typography>

          {/* use this div tag to push the icons to the right */}
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            {isAuthenticated && (
              <>
                <NotificationButton />
                <AccountButton />
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <SideBar open={open} image={image} color={color} />
      <main
        className={clsx(classes.content, {
          [classes.maxWidthContent]: !open,
          [classes.minWidthContent]: open,
          // [classes.contentShift]: !open,
        })}
      >
        <div id="back-to-top-anchor" className={classes.toolbar} />
        {/* <LayoutBreadcrumbs /> */}
        {children}
      </main>
      {/* <Back2Top /> */}
    </div>
  );
}

export default Layout;
