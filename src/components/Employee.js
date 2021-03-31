import React, { useState, useEffect } from "react";

const deafultImageSrc = "/img/useravator1.jpg";

const initialFieldValues = {
  employeeId: 0,
  employeeName: "",
  occupation: "",
  imageName: "",
  imageSrc: deafultImageSrc,
  imageFile: null,
};

export default function Employee(props) {
  const { addOrEdit, recordForEdit } = props;
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recordForEdit != null) {
      setValues(recordForEdit);
    }
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues({
          ...values,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: deafultImageSrc,
      });
    }
  };
  const validate = () => {
    let temp = {};
    temp.employeeName = values.employeeName == "" ? false : true;
    temp.imageSrc = values.imageSrc == deafultImageSrc ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x == true);
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] == false ? " invalid-field" : "";

  const resetForm = () => {
    setValues(initialFieldValues);
    document.getElementById("image-uploader").value = null;
    setErrors({});
  };

  const handleFormSubmit = (e) => {
      debugger;
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("employeeId", values.employeeId);
      formData.append("employeeName", values.employeeName);
      formData.append("occupation", values.occupation);
      formData.append("imageName", values.imageName);
      formData.append("imageFile", values.imageFile);
      addOrEdit(formData, resetForm);
    }
  };

  return (
    <div>
      <div className="container text-center">An Employee</div>
      <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
        <div className="card">
          <img src={values.imageSrc} className="card-img-top photoDefault" />
          <div className="card-body">
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                className={"form-control-file" + applyErrorClass("imageSrc")}
                onChange={showPreview}
                id="image-uploader"
              />
            </div>
            <br />
            <div className="form-group">
              <input
                className={"form-control" + applyErrorClass("employeeName")}
                placeholder="Employee Name"
                name="employeeName"
                value={values.employeeName}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Occupation"
                name="occupation"
                value={values.occupation}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-lg btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
