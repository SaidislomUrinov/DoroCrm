import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectSocket } from "../utils/socket";
import { FaDotCircle } from "react-icons/fa";

function Socket() {
  const [isConnect, setIsConnect] = useState(false);
  const { _id } = useSelector((e) => e?.user);
  useEffect(() => {
    connectSocket(_id, setIsConnect);
  }, []);
  return (
    <div className="flex items-center fixed bottom-0 right-[20px] justify-center gap-[10px] z-[1] p-[5px_10px] bg-white rounded-t-[10px]">
      <FaDotCircle
        className={`${isConnect ? "text-green-500" : "text-red-500"}`}
      />
      <p className="text-[12px] uppercase">
        {!isConnect ? "Offline" : "Online"}
      </p>
    </div>
  );
}

export default Socket;
