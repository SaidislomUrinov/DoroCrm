import { Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";

function Message() {
  const { msg } = useSelector((e) => e.cfg);
  return (
    <div
      className={`flex z-[99999] items-center min-w-[100px] gap-[10px] h-[30px] duration-300 rounded-bl-[10px] px-[10px] fixed justify-center bg-white right-0 ${
        msg !== "" ? "shadow-md top-0" : "top-[-32px]"
      }`}
    >
      {msg !== "" && <Spinner className="w-[15px] h-[15px]" />}
      <p className="text-[13px]">{msg}</p>
    </div>
  );
}

export default Message;
