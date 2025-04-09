import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Edit({ users, setUsers }) {
  const h = useLocation().hash;
  const nv = useNavigate();

  const [form, setForm] = useState({
    _id: "",
    name: "",
    phone: "",
    image: "",
    password: "",
    newImage: "",
  });
  const closeEdit = () => {
    setForm({
      _id: "",
      name: "",
      phone: "",
      image: "",
      password: "",
      newImage: "",
    });
    nv("#");
  };
  return <div className="flex">edit</div>;
}

export default Edit;
