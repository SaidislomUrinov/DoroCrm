import { Button, IconButton, Input } from "@material-tailwind/react";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
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
  const runSearch = () => {};
  //
  return (
    <div className="flex items-center justify-start w-full flex-col gap-[10px]">
      <div className="flex flex-wrap gap-[10px] items-center justify-between w-full p-[10px] rounded-[10px] bg-white">
        {/* pagination */}
        <div className="flex items-center justify-center gap-1">
          <IconButton disabled={page < 2} onClick={prevPage}>
            <FaAngleLeft />
          </IconButton>
          <p className="text-[14px] font-semibold text-slate-800">
            {pages} / {page}
          </p>
          <IconButton disabled={page + 1 > pages} onClick={nextPage}>
            <FaAngleRight />
          </IconButton>
        </div>
        <Button className="lg:hidden" onClick={() => nv("#add")} color="blue">
          <FaPlusCircle />
          Qo'shish
        </Button>
        {/* search */}
        <div className="flex items-center relative flex-1 justify-center w-full sm:w-[300px] md:w-[500px]">
          <Input
            placeholder="Qidiruv: +998..."
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{ className: "min-w-[100px]" }}
            onChange={(e) => setSearch(e.target.value.trim())}
            type="tel"
            value={search}
          />
          <div className="absolute right-[3px]">
            <Button disabled={!search} onClick={runSearch} size="sm">
              Qidirish
            </Button>
          </div>
        </div>
        <Button
          className="hidden lg:flex"
          onClick={() => nv("#add")}
          color="blue"
        >
          <FaPlusCircle />
          Qo'shish
        </Button>
      </div>
    </div>
  );
}

export default Users;
