import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Fab,
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Checkbox
} from "@material-ui/core";
import {
  apiGet,
  apiPost,
  openAddSecurityGroupDialog,
  GOT_ALL_GROUPS_AND_PERMISSIONS,
  SAVED_GROUP_PERMISSIONS
} from "../actions";
import { setDifference } from "../util";
import AddIcon from "@material-ui/icons/Add";

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

const toProps = index => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  tab: {
    fontWeight: "bold"
  },
  header: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper
  },
  title: {
    marginLeft: "50px"
  },
  add: {
    marginLeft: "10px"
  }
}));

const PermissionTab = ({
  group,
  securityPermissions,
  permissionIdSet,
  storePermissionIdSet,
  onChange,
  onCancel,
  onSave
}) => {
  const canNotSave =
    permissionIdSet.size === storePermissionIdSet.size &&
    [...permissionIdSet].every(value => storePermissionIdSet.has(value));
  const createdAt = new Date(group.createdAt);
  return (
    <React.Fragment>
      {`Created at: ${createdAt.toLocaleTimeString(
        "en-US"
      )} ${createdAt.toLocaleDateString("vi")}`}
      <List>
        {securityPermissions.map(perm => (
          <ListItem key={perm.id}>
            <Checkbox
              checked={permissionIdSet.has(perm.id)}
              onChange={() => onChange(group, perm)}
              value="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            {perm.name}
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSave(group)}
        disabled={canNotSave}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onCancel(group)}
        disabled={canNotSave}
      >
        Cancel
      </Button>
    </React.Fragment>
  );
};

const SecurityPermission = ({
  securityGroups,
  securityPermissions,
  mapOfGroupIdToPermissionIdSet,
  getAllGroupsAndPermissions,
  saveGroupPermissions,
  openAddGroup
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [mapPermissions, setMapPermissions] = useState(
    mapOfGroupIdToPermissionIdSet
  );

  useEffect(() => {
    setMapPermissions(mapOfGroupIdToPermissionIdSet);
  }, [mapOfGroupIdToPermissionIdSet]);

  useEffect(() => {
    getAllGroupsAndPermissions();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const permissionTabOnChange = (group, perm) => {
    if (mapPermissions[group.id].has(perm.id)) {
      const newSet = new Set([...mapPermissions[group.id]]);
      newSet.delete(perm.id);
      setMapPermissions({ ...mapPermissions, [group.id]: newSet });
    } else {
      const newSet = new Set([...mapPermissions[group.id], perm.id]);
      setMapPermissions({ ...mapPermissions, [group.id]: newSet });
    }
  };

  const onCancel = group => {
    setMapPermissions({
      ...mapPermissions,
      [group.id]: mapOfGroupIdToPermissionIdSet[group.id]
    });
  };

  const onSave = group => {
    const a = mapPermissions[group.id];
    const b = mapOfGroupIdToPermissionIdSet[group.id];
    const toBeInserted = setDifference(a, b);
    const toBeDeleted = setDifference(b, a);
    saveGroupPermissions(group.id, [...toBeInserted], [...toBeDeleted]);
  };

  return (
    <React.Fragment>
      <Divider />
      <div className={classes.header}>
        <Fab className={classes.add} onClick={openAddGroup} color="secondary">
          <AddIcon />
        </Fab>
        <Typography className={classes.title} variant="h5">
          Assign Permissions to Security Groups
        </Typography>
      </div>
      <Divider />
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {securityGroups.map((group, index) => (
            <Tab
              key={group.id}
              className={classes.tab}
              label={group.name}
              {...toProps(index)}
            />
          ))}
        </Tabs>
        {securityGroups.map((group, index) => (
          <TabPanel key={group.id} value={value} index={index}>
            <PermissionTab
              group={group}
              securityPermissions={securityPermissions}
              permissionIdSet={mapPermissions[group.id] || new Set([])}
              storePermissionIdSet={mapOfGroupIdToPermissionIdSet[group.id]}
              onChange={permissionTabOnChange}
              onCancel={onCancel}
              onSave={onSave}
            />
          </TabPanel>
        ))}
      </div>
    </React.Fragment>
  );
};

const mapState = createSelector(
  state => state.security,
  security => {
    const groupToPermissionIdSet = group =>
      new Set(
        security.securityGroupPermissions
          .filter(item => item.id.securityGroupId === group.id)
          .map(item => item.id.securityPermissionId)
      );

    const mapOfGroupIdToPermissionIdSet = {};
    Object.values(security.securityGroups).forEach(group => {
      mapOfGroupIdToPermissionIdSet[group.id] = groupToPermissionIdSet(group);
    });

    return {
      securityGroups: Object.values(security.securityGroups),
      securityPermissions: Object.values(security.securityPermissions),
      mapOfGroupIdToPermissionIdSet
    };
  }
);

const mapDispatch = dispatch => ({
  getAllGroupsAndPermissions: () =>
    dispatch(
      apiGet("/api/security/permission", GOT_ALL_GROUPS_AND_PERMISSIONS)
    ),
  saveGroupPermissions: (groupId, toBeInserted, toBeDeleted) =>
    dispatch(
      apiPost(
        "/api/security/save-group-permissions",
        {
          securityGroupId: groupId,
          toBeInserted,
          toBeDeleted
        },
        SAVED_GROUP_PERMISSIONS
      )
    ),
  openAddGroup: () => dispatch(openAddSecurityGroupDialog())
});

export default connect(mapState, mapDispatch)(SecurityPermission);
