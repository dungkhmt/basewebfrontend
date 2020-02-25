import React, { useState } from "react";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@material-ui/core";

import { NavLink, useRouteMatch } from "react-router-dom";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const NavMenu = ({ classes, icon, url, text, subItems }) => {
  const match = useRouteMatch({
    path: `/${url}`
  });
  const [open, setOpen] = useState(!!match);

  return (
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
          {subItems.map(item => (
            <ListItem
              key={item.text}
              className={classes.innerNavItem}
              component={NavLink}
              to={`/${url}/${item.url}`}
              activeClassName={classes.linkActive}
            >
              <ListItemIcon>
                <KeyboardArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default NavMenu;
