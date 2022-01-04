import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { failed } from "../../action/Auth";
import { authPost } from "../../api";
import MenuItem from "@material-ui/core/MenuItem";

function AssignSalesman2Distributor(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [salesman, setSalesman] = useState();
  const [salesmans, setSalesmans] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [distributor, setDistributor] = useState();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleDistributorChange = (event) => {
    setDistributor(event.target.value);
  };
  const handleSalesmanChange = (event) => {
    setSalesman(event.target.value);
  };

  function getListDistributor() {
    authPost(dispatch, token, "/get-list-distributor", { statusId: null })
      .then(
        (res) => {
          console.log(res);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 200) {
            return res.json();
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .then((res) => {
        console.log("got distributors ", res.lists);
        setDistributors(res.lists);
      });
  }

  function getListSalesman() {
    authPost(dispatch, token, "/get-list-all-salesmans", { statusId: null })
      .then(
        (res) => {
          console.log(res);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 200) {
            return res.json();
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .then((res) => {
        console.log("got salesman ", res.list);
        setSalesmans(res.list);
      });
  }

  const handleSubmit = () => {
    const data = {
      salesmanId: salesman,
      distributorId: distributor,
    };
    authPost(dispatch, token, "/add-salesman-sell-from-distributor", data).then(
      (res) => {
        console.log(res);
        setIsRequesting(false);
        if (res.status === 401) {
          dispatch(failed());
          throw Error("Unauthorized");
        } else if (res.status === 409) {
          alert("Id exits!!");
        } else if (res.status === 201) {
          return res.json();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    getListDistributor();
    getListSalesman();
  }, []);
  return (
    <div>
      <Card>
        <CardActions>
          <TextField
            id="select-distributor"
            select
            label="Select"
            value={distributor}
            onChange={handleDistributorChange}
            helperText="Select distributor"
          >
            {distributors.map((distributor) => (
              <MenuItem key={distributor.partyId} value={distributor.partyId}>
                {distributor.distributorName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="select-salesman"
            select
            label="Select"
            value={salesman}
            onChange={handleSalesmanChange}
            helperText="Select salesman"
          >
            {salesmans.map((sm) => (
              <MenuItem key={sm.partyId} value={sm.partyId}>
                {sm.fullName}
              </MenuItem>
            ))}
          </TextField>
        </CardActions>

        <CardActions>
          <Button
            disabled={false}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default AssignSalesman2Distributor;
