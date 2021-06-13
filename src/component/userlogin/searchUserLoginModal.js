import { Button, Grid, IconButton, Modal, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState } from "react";
import { authGet } from "../../api";
import withScreenSecurity from "../withScreenSecurity";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Search from "@material-ui/icons/Search";
import { RemoveCircleOutline } from "@material-ui/icons";

const modalStyle = {
    paper: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: 600,
        maxHeight: 600,
        // border: '2px solid #000',
        borderRadius: '5px',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        backgroundColor: 'white',
        zIndex: 999,
        left: '50%',
        top: '50%',
        transform: 'translate(-50% , -50%)',
        padding: '20px 40px'

    }
}

const NotFound = (props) => {
    return (
        <Grid style={{ margin: "50px 0" }} container item xs={12} justify="center" alignContent="center" alignItems="center">
            <h2 hidden={props.hidden} style={{ color: "#6f6f6f" }}>NO USER FOUND</h2>
        </Grid>
    )
}

const FoundUserDetails = (props) => {

    let userLink = "userlogin/" + props.user.partyId

    return (
        <div style={{
            padding: "30px 40px",
            width: "100%"
        }}>
            <Grid style={{
                padding: "10px 10px",
                margin: 0,
                width: "100%",
                borderRadius: "5px",
                boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
            }} container spacing={2} alignItems="center">
                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    User Name
                </Grid>
                <Grid item xs={9}>
                    <Link to={"/userlogin/" + props.user.partyId}>{props.user.userLoginId}</Link>
                </Grid>
                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    Full Name
                </Grid>
                <Grid item xs={9}>
                    {props.user.fullName}
                </Grid>
                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    Status
                </Grid>
                <Grid item xs={9}>
                    {props.user.status}
                </Grid>

                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    Type
                </Grid>
                <Grid item xs={9}>
                    {props.user.partyType}
                </Grid>
                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    Created Date
                </Grid>
                <Grid item xs={9}>
                    {props.user.createdDate}
                </Grid>

                <Grid item xs={3} style={{ fontWeight: "500" }}>
                    Party Code
                </Grid>
                <Grid item xs={9}>
                    {props.user.partyCode}
                </Grid>
            </Grid>
        </div>
    )
}

function SearchUserLoginModal(props) {

    const dispatch = useDispatch();

    const [found, setFound] = React.useState(false);

    const [foundUser, setFoundUser] = React.useState({});

    const [searchField, setSearchField] = React.useState("");

    const [isFirstTime, setIsFirstTime] = React.useState(true);

    const token = useSelector((state) => state.auth.token);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setIsFirstTime(false);
        authGet(
            dispatch,
            token,
            "/user" +
            "?userId=" +
            searchField
        ).then(
            (res) => {
                console.log(res)
                if (res.userLoginId === undefined || res.userLoginId === null) {
                    setFound(false)
                    setFoundUser({});
                }
                else {
                    setFound(true)
                    setFoundUser(res);
                }
            },
            (error) => {
                console.log("error");
                setFound(false)
                setFoundUser({});
            }
        );

    }

    const onInputChange = (event) => {
        let userId = event.target.value
        setSearchField(userId);
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle.paper}>
                <h2 id="simple-modal-title">Search by User Name</h2>
                <div width="100%">
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item xs={1}>
                                <Search />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField onChange={onInputChange} fullWidth={true} id="input-with-icon-grid" label="Search" />
                            </Grid>
                            <Grid item xs={2}>
                                <Button color="primary" type="submit" onChange={onInputChange} width="100%">Search</Button>
                            </Grid>
                        </Grid>
                    </form>
                    {
                        found === true
                            ? <FoundUserDetails user={foundUser} />
                            : <NotFound hidden={isFirstTime} />
                    }

                </div>
            </div>
        </Modal>
    );
}

export default SearchUserLoginModal;