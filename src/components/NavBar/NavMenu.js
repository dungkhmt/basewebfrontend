import React, { useState } from "react";
import { createSelector } from "reselect";
import { connect } from "react-redux";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@material-ui/core";

import { NavLink, useRouteMatch } from "react-router-dom";

import { StarBorder } from "@material-ui/icons";

const NavMenu = ({
  existPermissions,
  filterSubItems,
  classes,
  icon,
  url,
  text,
  subItems
}) => {
  const match = useRouteMatch({
    path: `/${url}`
  });
  const [open, setOpen] = useState(!!match);

  return (
    <React.Fragment>
      {existPermissions(subItems) ? (
        <React.Fragment>
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              className={classes.outerNavItemText}
              disableTypography
              primary={text}
            />
          </ListItem>

          <Collapse in={open}>
            <List>
              {filterSubItems(subItems).map(item => (
                <ListItem
                  key={item.text}
                  className={classes.innerNavItem}
                  component={NavLink}
                  to={`/${url}/${item.url}`}
                  activeClassName={classes.linkActive}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

const mapState = createSelector(
  state => state.auth.securityPermissions,
  securityPermissions => ({
    existPermissions: subItems =>
      subItems.some(item => securityPermissions.includes(item.permission)),
    filterSubItems: subItems =>
      subItems.filter(item => securityPermissions.includes(item.permission))
  })
);

export default connect(mapState)(NavMenu);
