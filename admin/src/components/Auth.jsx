import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMsg } from "../contexts/cfg";
import { FaArrowDown, FaAt, FaLock, FaSmile } from "react-icons/fa";
import { Button, Input } from "@material-tailwind/react";
import { errorMsg, successMsg } from "../utils/alert";
import { postReq } from "../utils/fetching";
import { updateUser } from "../contexts/user";

function Auth() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const dp = useDispatch();
  const [disabled, setDisabled] = useState(false);
  async function submit() {
    try {
      const { username, password } = form;

      if (!username || !password) throw new Error("Fill the rows");

      dp(setMsg("Please wait..."));
      setDisabled(true);
      const res = await postReq(`/admin/signIn`, { username, password });
      const { ok, data, msg, access } = res.data;

      if (!ok) throw new Error(msg);

      localStorage.setItem("access", access);
      successMsg(msg);
      setTimeout(() => {
        dp(updateUser(data));
      }, 500);
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg(""));
      setDisabled(false);
    }
  }
  return (
    <div
      onKeyDown={(k) => k.key === "Enter" && submit()}
      className="flex items-center justify-center w-full h-[100vh]"
    >
      <div className="flex items-start justify-start gap-[10px] flex-col w-[90%] sm:w-[520px] rounded-[20px] bg-white p-[20px]">
        <p className="uppercase flex text-[20px] items-center justify-center gap-[10px] font-semibold text-slate-700 sm:text-[30px]">
          Welcome back
          <FaSmile className="text-orange-500" />
        </p>
        {/*  */}
        <p className="text-[14px] text-slate-500 flex items-center justify-center gap-[10px]">
          Please fill the rows
          <FaArrowDown className="text-indigo-500" />
        </p>
        {/*  */}
        <Input
          label="Username"
          required
          variant="standard"
          placeholder="john"
          icon={<FaAt />}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value.trim().toLowerCase() })
          }
          value={form.username}
        />
        {/*  */}
        <Input
          label="Password"
          type="password"
          required
          variant="standard"
          placeholder="*****"
          icon={<FaLock />}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value.trim().toLowerCase() })
          }
          value={form.password}
        />
        <Button onClick={submit} className="w-full" loading={disabled}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Auth;
