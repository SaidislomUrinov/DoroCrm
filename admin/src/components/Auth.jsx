import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { errorMsg, successMsg } from "../utils/alert";
import { postReq } from "../utils/fetching";
import { updateUser } from "../contexts/user";
import { useNavigate } from "react-router-dom";
import { FaAt, FaLock } from "react-icons/fa";

function Auth() {
  const dp = useDispatch();
  const [disabled, setDisabled] = useState();
  const nv = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const submit = async () => {
    try {
      if (!form.username || !form.password) {
        throw new Error("Qatorlarni to'ldiring!");
      }

      const res = await postReq("/admin/signIn", form);
      const { ok, data, access, msg } = res.data;

      if (!ok) {
        throw new Error(msg);
      }

      successMsg(msg);
      sessionStorage.setItem("access", access);
      setTimeout(() => {
        dp(updateUser(data));
        nv("/dashboard");
      }, 500);
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full  h-[100vh]">
      <div
        onKeyDown={(k) => k.key === "Enter" && submit()}
        className="flex items-start w-[90%] sm:w-[500px] justify-start rounded-[20px] flex-col p-[20px] gap-[10px] border border-slate-300"
      >
        <div className="flex items-start justify-start flex-col">
          <p className="font-semibold text-[20px] text-slate-700">
            Tizimga kirish
          </p>
          <p className="text-slate-500 text-[12px]">Qatorlarni to'ldiring!</p>
        </div>
        {/*  */}
        <Input
          variant="standard"
          label="Username"
          placeholder="jonny"
          required
          onChange={(e) =>
            setForm({ ...form, username: e.target.value.trim().toLowerCase() })
          }
          value={form.username}
          icon={<FaAt />}
        />
        <Input
          type="password"
          variant="standard"
          label="Parol"
          placeholder="******"
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value.trim() })
          }
          value={form.password}
          icon={<FaLock />}
        />
        {/*  */}
        <Button loading={disabled} onClick={submit} className="w-full">
          Kirish
        </Button>
      </div>
    </div>
  );
}

export default Auth;
