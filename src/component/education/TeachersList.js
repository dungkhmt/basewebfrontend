import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { Card, CardContent } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";
import { tableIcons } from "../../utils/iconutil";
import { authGet } from "../../api";
import { useState } from "react";

export default function TeachersList() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token);
  const [teachers, setTeachers] = useState([]);

  const columns = [
    { title: "Mã giáo viên", field: "teacherId" },
    { title: "Tên giáo viên", field: "teacherName" },
    { title: "Email", field: "email" },
  ];

  const getAllTeachers = () => {
    authGet(
      dispatch, 
      token,
      "/edu/get-all-teachers",

    )
      .then( res => {
        console.log(res);
        setTeachers(res);
      });
  }

  useEffect(() => {
    getAllTeachers()
  }, [])

  return (
    <div>
        <MuiThemeProvider>
            <Card>
                <CardContent>
                    <MaterialTable
                        title="Danh sách giáo viên"
                        columns={columns}
                        data={teachers}
                        icons={tableIcons}
                        localization={{
                            header: {
                                actions: ''
                            },
                            body: {
                                emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                                filterRow: {
                                    filterTooltip: 'Lọc'
                                }
                            }
                        }}
                        options={{
                          search: false,
                          filtering: true,
                          actionsColumnIndex: -1
                        }}                                                    
                    />
                </CardContent>
            </Card>
        </MuiThemeProvider>
    </div>
  );
}
