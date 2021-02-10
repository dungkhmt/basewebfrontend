import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getMenu, logout } from "../action";
import { LayoutBreadcrumbs } from "./LayoutBreadcrumbs";
import AccountButton from "./account/AccountButton";
import SideBar from "./SideBar";
import Back2Top from "../utils/Back2Top";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import bgImage from "../assets/img/sidebar-2.jpg";

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
    // background: "white",
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
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  // hideButton: {
  //   marginLeft: drawerWidth / 2 - theme.spacing(6),
  // },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    // transition: theme.transitions.create("margin", {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
    // marginLeft: -drawerWidth,
  },
  // contentShift: {
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginLeft: 0,
  // },
  // largeIcon: {
  //   width: 50,
  //   height: 50,
  // },
  menuButton: {
    marginRight: 36,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  grow: {
    flexGrow: 1,
  },
}));

function Layout(props) {
  const { children } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [image] = useState(bgImage);
  const [color] = useState("blue");

  const handleLogout = () => {
    props.processLogout();
  };

  useEffect(() => {
    if (props.isMenuGot === false) props.getMenu();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
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
          {/* )} */}
          <Typography
            className={classes.title}
            variant="h6"
            style={{ color: "white" }}
            noWrap
          >
            Hệ thống quản trị nghiệp vụ
          </Typography>

          {/* use this div tag to push the icons to the right */}
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <AccountButton handleLogout={handleLogout} />
          </div>
        </Toolbar>
      </AppBar>
      <SideBar open={open} image={image} color={color} />
      <main
        className={clsx(classes.content, {
          // [classes.contentShift]: open,
        })}
      >
        <div id="back-to-top-anchor" className={classes.toolbar} />
        <LayoutBreadcrumbs />
        {children}
      </main>
      <Back2Top />
    </div>
  );
}

const mapStateToProps = (state) => ({
  isMenuGot: state.menu.isMenuGot,
});

const mapDispatchToProps = (dispatch) => ({
  getMenu: () => dispatch(getMenu()),
  processLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
