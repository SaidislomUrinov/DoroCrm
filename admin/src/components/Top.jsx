import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function Top() {
  const p = useLocation().pathname.slice(1);
  const { name } = useSelector((e) => e.user);
  return (
    <div className="flex items-center justify-between w-full px-[20px] bg-slate-800 h-[10vh]">
      <div className=""></div>
      <p className="uppercase font-semibold text-[20px] md:text-[30px] text-white">
        {!p ? "Dashboard" : p}
      </p>
      <div className="flex items-center justify-center gap-[10px]">
        <div className="flex items-center justify-center w-[30px] aspect-square rounded-full bg-gradient-to-br from-red-500 to-yellow-500">
          <p className="text-white uppercase font-bold text-[20px]">
            {name?.[0]}
          </p>
        </div>
        <p className="text-white md:inline-block hidden">{name}</p>
      </div>
    </div>
  );
}

export default Top;
