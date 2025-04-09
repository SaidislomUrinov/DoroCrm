import { Button, IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPlusCircle,
  FaSearch,
  FaSearchMinus,
  FaUsers,
  FaUsersSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getReq } from "../../utils/fetching";
import { errorMsg } from "../../utils/alert";
import { FaXmark } from "react-icons/fa6";
import Loading from "../../components/Loading";
import Add from "./Add";
import List from "./List";

function Users() {
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  //
  const nextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  //
  const nv = useNavigate();
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const runSearch = async () => {
    try {
      const res = await getReq("/admin/users/search", { search });
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);

      setIsSearch(true);
      setUsers(data);
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setLoad(true);
    }
  };
  const clearSearch = () => {
    setSearch("");
    setPage(1);
    setIsSearch(false);
  };
  //
  useEffect(() => {
    if (!isSearch) {
      setLoad(false);
      getReq("/admin/users/list", { page })
        .then((res) => {
          const { ok, data, pages, page, total } = res.data;
          if (!ok) {
            errorMsg(msg);
          } else {
            setUsers(data);
            setPages(pages);
            setPage(page);
            setTotal(total);
          }
        })
        .catch(() => {
          errorMsg();
        })
        .finally(() => {
          setLoad(true);
        });
    }
  }, [page, isSearch]);
  //
  return (
    <div className="flex items-start justify-start w-full flex-col gap-[10px]">
      {/* top */}
      <div className="flex items-center justify-between flex-wrap gap-[10px] w-full">
        <div className="flex items-center justify-center gap-1">
          <IconButton
            size="sm"
            onClick={prevPage}
            disabled={page < 2 || isSearch}
          >
            <FaAngleLeft />
          </IconButton>
          <p className="text-[14px] font-semibold">
            {page} / {pages}
          </p>
          <IconButton
            size="sm"
            onClick={nextPage}
            disabled={page + 1 > pages || isSearch}
          >
            <FaAngleRight />
          </IconButton>
          <p className="mx-[10px] sm:mx-[20px]">|</p>
          <p className="text-[14px] font-semibold flex items-center justify-center gap-1">
            <FaUsers className="text-blue-500 text-[20px]" />: {total}
          </p>
        </div>
        <Button
          disabled={isSearch}
          color="orange"
          className="lg:hidden rounded-full"
          onClick={() => nv("#add")}
        >
          <FaPlusCircle />
          Qo'shish
        </Button>
        <div className="flex items-center justify-center w-full lg:w-[300px] xl:w-[500px] relative">
          {!search ? (
            <FaSearch className="absolute left-[15px] rotate-90 text-slate-500" />
          ) : (
            <FaXmark
              onClick={clearSearch}
              className="absolute cursor-pointer left-[15px] rotate-90 text-slate-500"
            />
          )}
          <input
            type="tel"
            placeholder="Qidirish: +998..."
            onChange={(e) => setSearch(e.target.value.trim())}
            value={search}
            onKeyDown={(k) => k.key === "Enter" && runSearch()}
            className="p-[0_60px_0_40px] !text-[14px] duration-100 w-full h-[40px] rounded-[20px] shadow-lg outline-none focus:ring-[3px] ring-0 ring-slate-500"
          />
          <div className="absolute right-[5px]">
            <Button
              color="orange"
              className="rounded-full"
              disabled={!search?.length}
              onClick={runSearch}
              size="sm"
            >
              Qidirish
            </Button>
          </div>
        </div>
        <Button
          disabled={isSearch}
          color="orange"
          className="hidden lg:flex rounded-full"
          onClick={() => nv("#add")}
        >
          <FaPlusCircle />
          Qo'shish
        </Button>
      </div>
      {/* !load */}
      {!load && <Loading />}
      {load && isSearch && !users?.[0] && (
        <div className="flex items-center justify-center w-full flex-col h-[50vh] gap-1">
          <FaSearchMinus className="text-[50px] text-slate-500" />
          <p className="text-[14px]">Qidiruv natijalari mavjud emas!</p>
          <Button color="orange" className="rounded-full" onClick={clearSearch}>
            Ortga
          </Button>
        </div>
      )}
      {load && !isSearch && !users?.[0] && (
        <div className="flex items-center justify-center w-full flex-col h-[50vh] gap-1">
          <FaUsersSlash className="text-[50px] text-slate-500" />
          <p className="text-[14px]">Userlar mavjud emas!</p>
          <Button
            color="orange"
            className="rounded-full"
            onClick={() => nv("#add")}
          >
            <FaPlusCircle />
            Birinchisini Qo'shish
          </Button>
        </div>
      )}
      {/* LIST */}
      {load && users?.[0] && <List users={users} />}
      {/* ADD */}
      <Add setUsers={setUsers} page={page} setTotal={setTotal} />
      {/*  */}
    </div>
  );
}

export default Users;
