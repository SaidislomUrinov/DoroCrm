import {
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { BiDotsVertical } from "react-icons/bi";
import { FaShoppingBag, FaSuitcase } from "react-icons/fa";
import {
  FaBoxesStacked,
  FaPencil,
  FaUserGroup,
  FaXmark,
} from "react-icons/fa6";
import { API } from "../../utils/fetching";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function List({ users }) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [uId, setUid] = useState("");
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const nv = useNavigate();

  const handleRightClick = (e, id) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setMenuPosition({ x: clientX, y: clientY });
    setUid(id);
  };

  const handleCloseMenu = () => {
    setUid("");
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".custom-context-menu")) {
      handleCloseMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains("cursor-move")) {
      setDragging(true);
      setOffset({
        x: e.clientX - menuPosition.x,
        y: e.clientY - menuPosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setMenuPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="flex items-start justify-start flex-col w-full 2xl:w-auto overflow-x-scroll 2xl:overflow-auto shadow-[0_10px_20px] shadow-[#0000000e] rounded-[10px]">
      <div className="flex items-center justify-start h-[40px] bg-slate-800 rounded-t-[10px]">
        <div className="flex items-center justify-center border-r w-[50px] h-full">
          <p className="text-white text-[14px]">#</p>
        </div>
        <div className="flex items-center justify-center border-r w-[100px] h-full">
          <p className="text-white text-[14px]">ID</p>
        </div>
        <div className="flex items-center justify-center border-r w-[70px] h-full">
          <p className="text-white text-[14px]">Rasmi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[150px] h-full">
          <p className="text-white text-[14px]">Ismi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[150px] h-full">
          <p className="text-white text-[14px]">Raqami</p>
        </div>
        <div className="flex items-center justify-center border-r w-[150px] h-full">
          <p className="text-white text-[14px]">Kompaniyalar</p>
        </div>
        <div className="flex items-center justify-center border-r w-[150px] h-full">
          <p className="text-white text-[14px]">Ishchilar</p>
        </div>
        <div className="flex items-center justify-center border-r w-[150px] h-full">
          <p className="text-white text-[14px]">Mahsulotlar</p>
        </div>
        <div className="flex items-center justify-center w-[150px] h-full">
          <p className="text-white text-[14px]">Qo'shilgan sana</p>
        </div>
      </div>
      {users?.map((u, i) => {
        const lastUser = i === users.length - 1;
        return (
          <div
            onContextMenu={(e) => handleRightClick(e, u?._id)}
            key={i}
            className={`flex items-center duration-200 justify-start h-[50px]  
            ${
              uId && uId !== u?._id
                ? "opacity-50 bg-white"
                : uId === u?._id
                ? "bg-white"
                : i % 2 === 0
                ? "bg-white"
                : "bg-slate-100"
            }
            ${
              lastUser
                ? "rounded-b-[10px] border-b-0"
                : "rounded-0 border-b border-slate-300"
            }`}
          >
            <div className="flex items-center justify-center border-r border-slate-300 w-[50px] h-full">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <IconButton variant="text">
                    <BiDotsVertical fontSize={20} />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    onClick={() => nv(`#edit-${u?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaPencil className="text-[16px] text-blue-500" />
                    Taxrirlash
                  </MenuItem>
                  <MenuItem
                    onClick={() => nv(`#companies-${u?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaSuitcase className="text-[16px] text-cyan-500" />
                    Kompaniyalar
                  </MenuItem>
                  <MenuItem
                    onClick={() => nv(`#sales-${u?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaShoppingBag className="text-[16px] text-indigo-500" />
                    Sotuvlar
                  </MenuItem>
                  <MenuItem
                    onClick={() => nv(`#staffs-${u?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaUserGroup className="text-[16px] text-orange-500" />
                    Ishchilar
                  </MenuItem>
                  <MenuItem
                    onClick={() => nv(`#products-${u?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaBoxesStacked className="text-[16px] text-green-500" />
                    Mahsulotlar
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[100px] h-full">
              <Chip variant="ghost" size="sm" value={`${u?.id}`} />
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[70px] h-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gradient-to-br from-yellow-500 to-red-500 rounded-full overflow-hidden">
                {u?.image ? (
                  <img src={API + u?.image} alt="u_img" />
                ) : (
                  <p className="uppercase text-white font-bold">
                    {u?.name?.[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[150px] h-full">
              <p className="text-slate-800 text-[14px] text-center">
                {u?.name}
              </p>
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[150px] h-full">
              <p
                onClick={() => window.open(`tel:${u?.phone}`)}
                className="text-slate-800 hover:underline cursor-pointer text-[14px]"
              >
                {u?.phone}
              </p>
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[150px] h-full">
              <Chip variant="ghost" size="sm" value={`${u?.companies}`} />
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[150px] h-full">
              <Chip variant="ghost" size="sm" value={`${u?.staffs}`} />
            </div>
            <div className="flex items-center justify-center border-r border-slate-300 w-[150px] h-full">
              <Chip variant="ghost" size="sm" value={`${u?.products}`} />
            </div>
            <div className="flex items-center justify-center border-slate-300 w-[150px] h-full">
              <p className="text-slate-800 text-[14px]">{u?.created}</p>
            </div>
          </div>
        );
      })}

      {uId !== "" && (
        <div
          style={{
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
          }}
          className="fixed z-[5] overflow-hidden custom-context-menu bg-white border border-gray-300 shadow-lg rounded-md"
        >
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center cursor-move active:cursor-grabbing justify-end p-[10px] bg-slate-800 w-full"
          >
            <FaXmark
              className="text-white cursor-pointer"
              onClick={handleCloseMenu}
            />
          </div>
          <MenuItem
            onClick={() => {
              nv(`#edit-${uId}`);
              setUid("");
            }}
            className="flex rounded-none items-center justify-start gap-[10px] text-[13px] text-slate-500"
          >
            <FaPencil className="text-[16px] text-blue-500" />
            Taxrirlash
          </MenuItem>
          <MenuItem
            onClick={() => {
              nv(`#companies-${uId}`);
              setUid("");
            }}
            className="flex rounded-none items-center justify-start gap-[10px] text-[13px] text-slate-500"
          >
            <FaSuitcase className="text-[16px] text-cyan-500" />
            Kompaniyalar
          </MenuItem>
          <MenuItem
            onClick={() => {
              nv(`#sales-${uId}`);
              setUid("");
            }}
            className="flex rounded-none items-center justify-start gap-[10px] text-[13px] text-slate-500"
          >
            <FaShoppingBag className="text-[16px] text-indigo-500" />
            Sotuvlar
          </MenuItem>
          <MenuItem
            onClick={() => {
              nv(`#staffs-${uId}`);
              setUid("");
            }}
            className="flex rounded-none items-center justify-start gap-[10px] text-[13px] text-slate-500"
          >
            <FaUserGroup className="text-[16px] text-orange-500" />
            Ishchilar
          </MenuItem>
          <MenuItem
            onClick={() => {
              nv(`#products-${uId}`);
              setUid("");
            }}
            className="flex rounded-none items-center justify-start gap-[10px] text-[13px] text-slate-500"
          >
            <FaBoxesStacked className="text-[16px] text-green-500" />
            Mahsulotlar
          </MenuItem>
        </div>
      )}
    </div>
  );
}

export default List;
