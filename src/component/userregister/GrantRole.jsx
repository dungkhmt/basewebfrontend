import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { grey, pink, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React from "react";
import { FcApproval } from "react-icons/fc";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import TertiaryButton from "../button/TertiaryButton";

const useStyles = makeStyles((theme) => ({
  grantedRoles: {
    position: "relative",
    width: "100%",
    padding: "1rem",
    paddingRight: 50,
  },
  grantedRolesList: {
    "& li": {
      "& svg": {
        display: "none",
      },
    },
    "&:hover": {
      "& li": {
        "& svg": {
          display: "block",
          "&:hover": {
            color: red["A700"],
          },
        },
      },
    },
  },
  removeIcon: {
    fontSize: 42,
    color: pink[400],
    position: "absolute",
    right: 0,
    top: "50%",
    marginTop: -20,
    padding: 8,
  },
  menu: {
    borderRadius: 8,
    boxShadow:
      "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  },
  role: {
    borderRadius: 8,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    "&:hover": {
      background: grey[200],
    },
  },
  addRoleBtn: {
    marginLeft: "auto",
  },
  ListItemIcon: {
    minWidth: 32,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

function GrantRole({ grantedRoles, roles, setRoles }) {
  const classes = useStyles();

  // Menu.
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Functions.
  const onAddRole = (e) => {
    let { roleId } = e.currentTarget.dataset;

    const selectedRole = roles.find((role) => role.id === roleId);
    selectedRole.granted = true;

    setRoles([...roles]);

    handleClose(e);
  };

  const onRemoveRole = (removedRole) => {
    removedRole.granted = false;
    setRoles([...roles]);
  };

  return grantedRoles ? (
    <>
      <Typography variant="h6">Phân quyền</Typography>

      <Divider />

      <List>
        {grantedRoles.map((role) => (
          <ListItem key={role} className={classes.listItem}>
            <ListItemIcon className={classes.ListItemIcon}>
              <FcApproval size={24} />
            </ListItemIcon>
            <ListItemText primary={role} />
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <>
      <Box width="100%" display="flex" mb="1rem">
        <Typography component="span" variant="h6">
          Phân quyền
        </Typography>

        <TertiaryButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.addRoleBtn}
        >
          Thêm quyền
        </TertiaryButton>
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        <SimpleBar
          style={{
            width: 300,
            height: 400,
            overflowX: "hidden",
            overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu'scrollbar reach end
          }}
        >
          <List disablePadding aria-label="roles list">
            {roles?.map(
              (role) =>
                !role.granted && (
                  <MenuItem
                    key={role.id}
                    data-role-id={role.id}
                    onClick={onAddRole}
                    className={classes.role}
                  >
                    <Typography variant="inherit" noWrap>
                      {role.name}
                    </Typography>
                  </MenuItem>
                )
            )}
          </List>
        </SimpleBar>
      </Menu>

      <Divider />

      <List className={classes.grantedRolesList}>
        {roles?.map(
          (role) =>
            role.granted && (
              <ListItem key={role.id} divider className={classes.grantedRole}>
                <ListItemText>{role.name}</ListItemText>
                <RemoveCircleIcon
                  onClick={() => onRemoveRole(role)}
                  className={classes.removeIcon}
                />
              </ListItem>
            )
        )}
      </List>
    </>
  );
}

export default GrantRole;

/* <Button
        variant="outlined"
        color="primary"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        Thêm quyền
      </Button> 
       <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <SimpleBar
                  style={{
                    //   marginTop: 64,
                    //   marginBottom: 16,
                    //   position: "relative",
                    width: 500,
                    height: 400,
                    //   zIndex: "4",
                    overflowX: "hidden",
                    overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu'scrollbar reach end
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      {roles?.map(
                        (role) =>
                          !role.granted && (
                            <MenuItem
                              data-role-id={role.id}
                              onClick={onSelectRole}
                            >
                              {role.name}
                            </MenuItem>
                          )
                      )}
                    </MenuList>
                  </ThemeProvider>
                </SimpleBar>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper> */
