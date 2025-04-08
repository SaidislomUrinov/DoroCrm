import { Button, IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import links from "../utils/links";
import { useDispatch } from "react-redux";
import { postReq } from "../utils/fetching";
import { successMsg } from "../utils/alert";
import { clearUser } from "../contexts/user";
import { BiLogOut } from "react-icons/bi";
function Navbar() {
  const [open, setOpen] = useState(false);
  const dp = useDispatch();
  const p = useLocation().pathname;
  useEffect(() => {
    setOpen(false);
  }, [p]);
  //
  const logOut = async () => {
    const res = await postReq("/admin/logOut");
    const { ok, msg } = res.data;
    if (ok) {
      successMsg(msg);
      sessionStorage.clear();
      dp(clearUser());
    }
  };
  //
  return (
    <>
      <div
        className={`flex z-[3] duration-300 items-center top-0 fixed lg:relative justify-start flex-col w-[300px] lg:w-1/5 xl:w-1/6 h-[100vh] bg-white ${
          open ? "left-0 lg:left-auto" : "left-[-300px] lg:left-auto"
        }`}
      >
        <div className="flex relative bg-slate-800 items-center justify-between lg:justify-center px-[10px] w-full h-[10vh] md:h-[5vh]">
          <p className="text-[30px] font-semibold uppercase bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent">
            FASTIX
          </p>
          {/*  */}
          <div
            className={`${
              open ? "right-[10px]" : "right-[-50px]"
            } absolute duration-300 lg:hidden`}
          >
            <IconButton
              className="text-[20px]"
              color="white"
              variant="text"
              onClick={() => setOpen(!open)}
            >
              {!open ? <FaBars /> : <FaXmark />}
            </IconButton>
          </div>
        </div>
        {/*  */}
        <div className="flex items-start justify-start w-full h-[90vh] md:h-[95vh] gap-[10px] overflow-y-scroll p-[10px] flex-col relative">
          {/*  */}
          {links.map((l, i) => {
            return (
              <Link
                key={i}
                className={`w-full hover:bg-slate-100 px-[20px] h-[50px] rounded-[10px] flex items-center justify-start gap-[20px] ${
                  l.path === p ? "text-slate-800" : "text-slate-400"
                }`}
                to={l?.path}
              >
                <l.icon
                  className={`text-[20px] ${
                    p === l.path ? "text-yellow-800" : "text-slate-500"
                  }`}
                />
                {l.title}
              </Link>
            );
          })}
          <div className="absolute bottom-[10px]">
            <Button onClick={logOut} color="red">
              <BiLogOut />
              Chiqish
            </Button>
          </div>
        </div>
        {/*  */}
      </div>
      {/* closer */}
      <div
        onClick={() => setOpen(false)}
        className={`${
          open ? "w-full" : "w-0"
        } h-[100vh] fixed top-0 left-0 duration-200 lg:hidden bg-[#0009] z-[2]`}
      ></div>
    </>
  );
}

export default Navbar;
