import { useEffect, useState } from "react";
import { connectSocket } from "../utils/socket";
import { useSelector } from "react-redux";
import { FaDotCircle, FaSpinner } from "react-icons/fa";

function Socket() {
  const { _id } = useSelector((e) => e?.user);
  const [connect, setConnect] = useState(false);
  const connector = async () => await connectSocket(_id, setConnect);

  useEffect(() => {
    connector();
  }, []);
  return (
    <div className="fixed flex items-center justify-center gap-1 bottom-0 rounded-tl-[10px] right-0 z-[1] bg-white p-[5px_10px]">
      {connect ? (
        <>
          <FaDotCircle fontSize={14} className="text-green-500" />
          <p className="text-[12px]">Online</p>
        </>
      ) : (
        <>
          <FaSpinner fontSize={14} className="text-orange-500 animate-spin" />
          <p className="text-[12px]">Ulanmoqda</p>
        </>
      )}
    </div>
  );
}

export default Socket;
