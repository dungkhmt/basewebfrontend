import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../api";
import Loading from "../../common/Loading";
import NotAuthorized from "../../common/NotAuthorzied";

function withScreenSecurity(SecuredComponent, id) {
  return function SecuredScreen(props) {
    const history = useHistory();
    const token = useSelector((state) => state.auth.token);

    const [state, setState] = useState({ name: "CHECKING" });

    const getViewPermissions = () => {
      request(
        token,
        history,
        "get",
        `/view-permissions/?screenId=${id}`,
        (res) => {
          if (res.data.length > 0) {
            setState({ name: "PERMITED", permissions: new Set(res.data) });
          } else {
            setState({ name: "NOT_PERMITED" });
          }
        },
        { noResponse: (e) => setState({ name: "NO_RESPONSE" }) } // No response -> return 404 page
      );
    };

    useEffect(() => {
      getViewPermissions();
    }, []);

    switch (state.name) {
      case "CHECKING":
        return <Loading />;
      case "NO_RESPONSE":
        return null; // Not implemented.
      case "PERMITED":
        return <SecuredComponent permissions={state.permissions} {...props} />;
      case "NOT_PERMITED":
        return <NotAuthorized />;
      default:
        return null;
    }
  };
}

export default withScreenSecurity;
