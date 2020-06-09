import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SelectSalesmanDialog(props) {
  const classes = useStyles();
  const { onClose, open, items} = props;

  const handleClose = () => {
    onClose();
  };
  
  const handleListItemClick = partySalesmanId => {
    onClose(partySalesmanId);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="select-salesman-dialog" open={open}>
        <DialogTitle id="select-salesman-dialog">
          Chọn nhân viên bán hàng
        </DialogTitle>
        <List>
            {items.map(item => (
            <ListItem button onClick={() => handleListItemClick(item.partySalesmanId)} key={item.partySalesmanId}>
                <ListItemAvatar>
                <Avatar className={classes.avatar}>
                    <PersonIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.salesmanName} />
            </ListItem>
            ))}
        </List>
    </Dialog>
  );
}

SelectSalesmanDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  //selectedValue: PropTypes.string.isRequired,
};

export default SelectSalesmanDialog;