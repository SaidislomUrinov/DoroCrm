import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { FaLock, FaPhone, FaSave, FaUser } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import ReactInputMask from "react-input-mask";
import { useLocation, useNavigate } from "react-router-dom";
import { API, putReq } from "../../utils/fetching";
import { errorMsg, successMsg } from "../../utils/alert";

function Edit({ users, setUsers }) {
  const [disabled, setDisabled] = useState(false);
  const h = useLocation().hash;
  const nv = useNavigate();

  const [form, setForm] = useState({
    _id: "",
    name: "",
    phone: "",
    image: "",
    password: "",
    deleteImage: false,
    newImage: "",
  });
  const submit = async () => {
    try {
      setDisabled(true);
      const { newImage, name, _id, phone, password, deleteImage } = form;
      if (!_id || !name || !phone) throw new Error("Qatorlarni to'ldiring!");

      const f = new FormData();
      if (deleteImage) f.append("deleteImage", "ok");
      if (newImage) f.append("image", newImage);
      if (password) f.append("password", password);
      f.append("_id", _id);
      f.append("name", name);
      f.append("phone", phone);
      //
      const res = await putReq("/user/edit", f);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);

      setUsers((prev) =>
        prev.map((u) => (u._id === data._id ? { ...u, ...data } : u))
      );
      successMsg(msg);
      closeEdit();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setDisabled(false);
    }
  };
  //
  useEffect(() => {
    if (h.startsWith("#edit-")) {
      const id = h.split("-")[1];
      console.log(id);
      const user = users.find((u) => u._id === id);
      console.log(user);
      if (user) {
        setForm({ ...form, ...user });
      }
    }
  }, [h]);
  //

  const closeEdit = () => {
    setForm({
      _id: "",
      name: "",
      phone: "",
      image: "",
      password: "",
      newImage: "",
      deleteImage: false,
    });
    nv("#");
  };

  return (
    <>
      {" "}
      <Dialog size="sm" open={h.startsWith("#edit-")}>
        <DialogHeader>Userni taxrirlash</DialogHeader>
        <DialogBody className="border-y flex items-start justify-start flex-col gap-[10px]">
          {/*  */}
          <div className="relative">
            <label className="w-[100px] flex items-center justify-center h-[100px] overflow-hidden cursor-pointer rounded-[10px] bg-slate-100 hover:bg-slate-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    newImage: e.target.files?.[0],
                    deleteImage: false,
                  })
                }
                className="hidden"
              />
              {!form?.newImage ? (
                !form.image ? (
                  <BiImageAdd className="text-[50px]" />
                ) : (
                  <img src={API + form.image} />
                )
              ) : (
                <img src={URL.createObjectURL(form.newImage)} alt="" />
              )}
            </label>
            {form.image && (
              <div className="absolute cursor-pointer top-[5px] right-[5px]">
                <FaXmark
                  className="text-red-500"
                  onClick={() =>
                    setForm({
                      ...form,
                      image: "",
                      newImage: "",
                      deleteImage: true,
                    })
                  }
                />
              </div>
            )}
          </div>
          {/*  */}
          <Input
            label="Ismi"
            required
            placeholder="Shoxrux, ..."
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
            icon={<FaUser />}
          />
          {/*  */}
          <ReactInputMask
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            value={form.phone}
            mask={"+\\9\\98 99 999 99 99"}
            maskChar={""}
          >
            {(props) => (
              <Input {...props} required label="Raqami" icon={<FaPhone />} />
            )}
          </ReactInputMask>
          {/*  */}
          <Input
            label="Yangi parol"
            placeholder="******"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
            icon={<FaLock />}
          />
        </DialogBody>
        <DialogFooter className="gap-1">
          <Button variant="text" disabled={disabled} onClick={closeEdit}>
            Ortga
          </Button>
          <Button loading={disabled} onClick={submit} color="green">
            {!disabled && <FaSave />}
            Saqlash
          </Button>
        </DialogFooter>
      </Dialog>
      {/*  */}
    </>
  );
}

export default Edit;
