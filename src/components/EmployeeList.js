import React, { useState, useEffect } from "react";
import Employee from "./Employee";
import axios from "axios";

export default function EmployeeList() {
  const [emplyeeList, setEmployeeList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  useEffect(() => {
    refreashEmployeeLsit();
  }, []);

  const employeeAPI = (url = "http://localhost:2361/api/Employee/") => {
    return {
      fetchAll: () => axios.get(url + "GetEmployees"),
      create: (newRecord) => axios.post(url + "AddEmployee", newRecord),
      update: (updateRecord) => axios.post(url + "UpdateEmployee", updateRecord),
      delete: (id) => axios.delete(url + "DeleteEmployee/?id=" + id),
    };
  };
  function refreashEmployeeLsit() {
    employeeAPI()
      .fetchAll()
      .then((res) => setEmployeeList(res.data))
      .catch((err) => console.log(err));
  }

  const addOrEdit = (formData, onSuccess) => {
      if (formData.get('employeeId')==0) {
        employeeAPI()
        .create(formData)
        .then((res) => {
          onSuccess();
          refreashEmployeeLsit();
        })
        .catch((err) => console.log(err));
      } else {
        employeeAPI()
        .update(formData)
        .then((res) => {
          onSuccess();
          refreashEmployeeLsit();
        })
        .catch((err) => console.log(err));
      }
    
  };

  const handleEdit = (data) => {
    setRecordForEdit(data);
  };

  const handleDelete = (e, id) => {
    if (window.confirm("Are you sure delete this record?"))
      employeeAPI()
        .delete(id)
        .then((res) => refreashEmployeeLsit())
        .catch((err) => console.log(err));
  };

  const imageCard = (data) => {
    <div className="card">
      <img src={data.iamgeSrc} className="card-img-top rounded-circle" />
      <div className="card-body">
        <h5>{data.employeeName}</h5>
        <span>{data.occupation}</span>
      </div>
    </div>;
  };

  return (
    <div className="row">
      <div className="bg-light p-5 rounded mt-3 text-center">
        <h1>Employee Register</h1>
      </div>
      <br />
      <div className="col-md-4">
        <Employee addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
      </div>
      <div className="col-md-8">
        <table>
          <tbody>
            {/* {[...Array(Math.ceil(emplyeeList.length / 3))].map((e, i) => 
              <tr>
                <td>{imageCard(emplyeeList[3 * i])}</td>
                <td>
                  {emplyeeList[3 * i + 1]
                    ? imageCard(emplyeeList[3 * i + 1])
                    : null}
                </td>
                <td>
                  {emplyeeList[3 * i + 2]
                    ? imageCard(emplyeeList[3 * i + 2])
                    : null}
                </td>
              </tr>
            )} */}
          </tbody>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Occupation</th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {emplyeeList.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.employeeId}</td>
                  <td>{item.employeeName}</td>
                  <td>{item.occupation}</td>
                  <td>
                    {" "}
                    <img
                      src={item.imageSrc}
                      className="card-img-top rounded-circle photo"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        handleEdit(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) =>
                        handleDelete(e, parseInt(item.employeeId))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
