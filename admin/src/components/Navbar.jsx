import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiLogOut, BiSolidDashboard } from "react-icons/bi";
import {
  FaBars,
  FaChartArea,
  FaChartPie,
  FaSuitcase,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { FaMessage, FaXmark } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { errorMsg } from "../utils/alert";
import { useDispatch, useSelector } from "react-redux";
import { setMsg } from "../contexts/cfg";
import { postReq } from "../utils/fetching";
const NavLink = ({ path = "", text = "", icon, notify = false }) => {
  const p = useLocation().pathname;
  const Icon = icon;
  const isActive = p.startsWith(path);
  return (
    <Link
      className={`w-full relative min-h-max flex items-center hover:bg-slate-900 rounded-[8px] p-[10px] justify-start gap-[20px] ${
        isActive
          ? "text-slate-700 bg-gradient-to-br from-gray-200 to-white"
          : "text-slate-400"
      }`}
      to={path}
    >
      <Icon className={`text-[20px]`} />
      {text}
      {notify && (
        <span
          className={`absolute right-[10px] ${
            !isActive ? "bg-red-500" : "bg-white"
          } w-2 aspect-square rounded-full`}
        ></span>
      )}
    </Link>
  );
};
function Navbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const dp = useDispatch();
  //
  const { notify } = useSelector((e) => e.cfg);
  // notify fetching

  // LOGOUT
  const [openLogout, setOpenLogout] = useState(false);
  const logout = async () => {
    try {
      dp(setMsg("Please wait..."));
      const res = await postReq(`/admin/logOut`);

      const { ok, msg } = res.data;
      if (!ok) throw new Error(msg);

      localStorage.removeItem("access");
      setOpenLogout(false);
      setOpen(false);
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg(""));
    }
  };
  const p = useLocation().pathname;
  const nv = useNavigate();
  useEffect(() => {
    setOpen(false);
    if (p === "/") nv("/dashboard");
  }, [p]);
  return (
    <>
      <div
        className={`flex z-[3] fixed duration-300 lg:relative items-center top-0 h-[100vh] justify-start ${
          open ? "left-0" : "left-[-300px] lg:left-0"
        } flex-col w-[300px] lg:w-1/5 xl:w-1/6 bg-slate-800`}
      >
        {/* TOP */}
        <div className="flex relative items-center justify-center w-full h-[10vh] border-b border-slate-500">
          <p className="text-[40px] bg-gradient-to-br font-bold from-yellow-500 to-red-500 bg-clip-text text-transparent">
            DORO
          </p>
          <div
            className={`absolute duration-300 lg:hidden ${
              open ? "right-[10px]" : "right-[-50px]"
            }`}
          >
            <IconButton
              className="text-[25px]"
              color="white"
              variant="text"
              onClick={handleOpen}
            >
              {!open ? <FaBars /> : <FaXmark />}
            </IconButton>
          </div>
        </div>
        {/* LINKS */}
        <div className="flex items-center justify-start flex-col w-full h-[90vh] overflow-y-scroll gap-[10px] p-[10px]">
          <NavLink path="/dashboard" text="Dashboard" icon={BiSolidDashboard} />
          <NavLink path="/plans" text="Plans" icon={FaChartPie} />
          <NavLink path="/sales" text="Sales" icon={FaChartArea} />
          <NavLink path="/users" text="Users" icon={FaUsers} />
          <NavLink
            path="/companies"
            text="Companies"
            icon={FaSuitcase}
            notify={notify.companies}
          />
          <NavLink
            path="/leads"
            text="Leads"
            icon={FaUserPlus}
            notify={notify.leads}
          />
          <NavLink
            path="/chat"
            text="Chat"
            icon={FaMessage}
            notify={notify.chat}
          />
          <div
            onClick={() => setOpenLogout(true)}
            className={`w-full relative text-red-500 cursor-pointer min-h-max flex items-center hover:bg-slate-900 rounded-[8px] p-[10px] justify-start gap-[20px]`}
          >
            <BiLogOut className="text-[20px]" />
            Log out
          </div>
        </div>
      </div>
      {/*  */}
      <div
        className={`fixed lg:hidden duration-300 bg-[#0009] ${
          open ? "w-full" : "w-0"
        } top-0 left-0 h-[100vh] z-[2]`}
        onClick={handleOpen}
      ></div>
      <Dialog size="sm" open={openLogout}>
        <DialogHeader>Log out</DialogHeader>
        <DialogBody>
          <p className="text-black">Are you sure you want to log out?</p>
        </DialogBody>
        <DialogFooter className="gap-1">
          <Button onClick={() => setOpenLogout(false)} variant="text">
            Cancel
          </Button>
          <Button onClick={logout} color="red">
            Log out
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Navbar;
