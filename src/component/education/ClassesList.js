import React, {useEffect} from "react";
import {API_URL} from "../../config/config";
import {useSelector} from "react-redux";

function ClassesList(props) {
  const token = useSelector((state) => state.auth.token);
  const [semesters, setSemesters] = React.useState([]);

  useEffect(() => {
    fetch(API_URL + "/edu/get-all-semesters", {
      method: "GET",
      headers: {"Content-Type": "application/json", "X-Auth-Token": token},
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setSemesters(response);
      });
  }, []);

  return (
    <div>
      {semesters.map((semester) => {
        return (
          <div>
            <a href="facebook.com" color="blue">
              Xem danh sách các lớp của kì {semester.semesterName}
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default ClassesList;
