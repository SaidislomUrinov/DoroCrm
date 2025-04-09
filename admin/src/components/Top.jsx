import { useLocation } from "react-router-dom";
import links from "../utils/links";
import { useSelector } from "react-redux";
function Top() {
  const p = useLocation().pathname;
  const { name, username } = useSelector((e) => e.user);
  return (
    <div className="flex items-center justify-between w-full px-[2%] bg-slate-800 h-[10vh] md:h-[5vh]">
      <div className="lg:hidden"></div>
      <p className="text-[20px] font-bold text-white uppercase">
        {links.find((l) => l.path === p)?.title || "404 not found"}
      </p>
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-center justify-center w-[30px] aspect-square bg-gradient-to-tl from-red-500 to-yellow-500 rounded-full">
          <p className="font-bold text-white">{name?.[0]}</p>
        </div>
        <div className="flex items-start justify-start flex-col">
          <p className="text-[14px] mb-[-3px] text-white">{name}</p>
          <p className="text-[12px] mt-[-3px] text-slate-400">@{username}</p>
        </div>
      </div>
    </div>
  );
}

export default Top;
