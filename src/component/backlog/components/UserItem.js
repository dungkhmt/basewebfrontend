import React from 'react';
import {
  ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const getFullName = (user) => {
  return user.person ? user.person.firstName + " " + user.person.middleName + " " + user.person.lastName : ""
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 36,
    height: 36,
  },
}));

export default function UserItem(props) {
  const classes = useStyles();

  let { user, secondaryAction, avatarClass, avatarColor, 
    primaryTypographyProps, secondaryTypographyProps } = props;

  if (avatarClass == null) {
    avatarClass = classes.avatar;
  }

  return (
    <ListItem key={user.userLoginId} ContainerComponent="div">
      <ListItemAvatar>
        <Avatar className={avatarClass} style={{ background: avatarColor }}>
          {(user.person && user.person.lastName && user.person.lastName !== "") ? user.person.lastName.substring(0, 1) : ""}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        id={user.userLoginId}
        primary={getFullName(user)}
        secondary={user.userLoginId}
        primaryTypographyProps={primaryTypographyProps}
        secondaryTypographyProps={secondaryTypographyProps}
      />
      <ListItemSecondaryAction>
        {secondaryAction}
      </ListItemSecondaryAction>
    </ListItem >
  )
}