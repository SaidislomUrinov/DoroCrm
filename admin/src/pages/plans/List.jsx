import {
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useRef, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function List({ plans }) {
  // SCROLL QILSIH
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Tezlik
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  //
  const nv = useNavigate();
  //
  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="flex items-start select-none cursor-grab active:cursor-grabbing justify-start flex-col w-full overflow-x-scroll shadow-[0_10px_20px] shadow-[#0000000e] rounded-[10px]"
    >
      {/* struct */}
      <div className="flex items-center justify-start h-[40px] bg-slate-800 rounded-t-[10px]">
        <div className="flex items-center justify-center border-r w-[50px] h-full">
          <p className="text-white text-[14px]">#</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Nomi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Narxi/Oy</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Yillik chegirma %</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Ommabop</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Mahsulotlar soni</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Kataloglar soni</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Ishchilar soni</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Ishchilar oyligi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Doimiy mijoz</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Exceldan import</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Excelga export</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Kassa turi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Statistika turi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Telegramdan / Oy</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">Brendlash</p>
        </div>
        <div className="flex items-center justify-center border-r w-[140px] h-full">
          <p className="text-white text-[14px]">API integratsiyasi</p>
        </div>
        <div className="flex items-center justify-center border-r w-[180px] h-full">
          <p className="text-white text-[14px]">Telegram bildirishnoma</p>
        </div>
        <div className="flex items-center justify-center w-[140px] h-full">
          <p className="text-white text-[14px]">SMS bildirishnoma</p>
        </div>
      </div>
      {/* mapping */}
      {plans?.map((p, i) => {
        const lastPlan = i === plans.length - 1;
        return (
          <div
            key={i}
            className={`flex items-center duration-200 justify-start h-[50px]  
            ${i % 2 === 0 ? "bg-white" : "bg-slate-100"}
            ${
              lastPlan
                ? "rounded-b-[10px] border-b-0"
                : "rounded-0 border-b border-slate-300"
            }`}
          >
            <div className="flex items-center border-slate-300 justify-center border-r w-[50px] h-full">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <IconButton variant="text">
                    <BiDotsVertical fontSize={20} />
                  </IconButton>
                </MenuHandler>
                <MenuList className="shadow-[0_0_10px] shadow-[#00000059]">
                  <MenuItem
                    onClick={() => nv(`#edit-${p?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaPencil className="text-[16px] text-blue-500" />
                    Taxrirlash
                  </MenuItem>
                  <MenuItem
                    disabled
                    onClick={() => nv(`#delete-${p?._id}`)}
                    className="flex items-center justify-start gap-[10px]"
                  >
                    <FaTrash className="text-[16px] text-red-500" />
                    o"chirish
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <p className="text-slate-800 text-[14px]">{p.name}</p>
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <p className="text-slate-800 text-[14px]">{p?.price}</p>
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <p className="text-slate-800 text-[14px]">{p?.yearlyDiscount}</p>
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.isPopular ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.isPopular ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.products === "infinity" ? "Cheksiz" : p?.products}
                variant="ghost"
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip value={p?.catalogs} variant="ghost" />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip value={p?.staffs} variant="ghost" />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.staffsSalary ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.staffsSalary ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.regularCustomer ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.regularCustomer ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.importFromExcel ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.importFromExcel ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.exportToExcel ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.exportToExcel ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip value={p?.cashier} variant="ghost" />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip value={p?.statistics} variant="ghost" />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={
                  p?.ordersViaTelegram === "infinity"
                    ? "Cheksiz"
                    : p?.ordersViaTelegram
                }
                variant="ghost"
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.branding ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.branding ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[140px] h-full">
              <Chip
                value={p?.apiIntegration ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.apiIntegration ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center border-r w-[180px] h-full">
              <Chip
                value={p?.notifyViaTelegram ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.notifyViaTelegram ? "green" : "red"}
              />
            </div>
            <div className="flex items-center border-slate-300 justify-center w-[140px] h-full">
              <Chip
                value={p?.notifyViaSms ? "Xa" : "Yo'q"}
                variant="ghost"
                color={p?.notifyViaSms ? "green" : "red"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default List;
