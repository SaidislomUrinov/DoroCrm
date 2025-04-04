import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMsg } from "../../contexts/cfg";
import { getReq } from "../../utils/fetching";
import { errorMsg } from "../../utils/alert";
import Search from "../../components/Search";
import { Button, IconButton } from "@material-tailwind/react";
import { FaCaretLeft, FaCaretRight, FaPlus, FaSuitcase } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import Loading from "../../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";

function Companies() {
  const dp = useDispatch();
  const [q] = useSearchParams();
  const nv = useNavigate();
  const uId = q.get("uid");
  const [load, setLoad] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [refresh, setRefresh] = useState(false);
  // pagination
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const nextPage = () => {
    if (page < pages) setPage(page + 1);
  };
  //
  useEffect(() => {
    setLoad(false);
    dp(setMsg("Fetching companies..."));
    const params = {};

    if (uId) params.uId = uId;
    if (!uId) params.page = page;

    getReq(`/admin/companies`, params)
      .then((res) => {
        const { ok, data, pages, page, msg } = res.data;
        if (!ok) {
          errorMsg(msg);
        } else {
          setCompanies(data);
          setPages(pages);
          setPage(page);
        }
      })
      .catch(() => {
        errorMsg();
      })
      .finally(() => {
        setLoad(true);
        dp(setMsg());
      });
  }, [page, refresh, uId]);
  //
  const [search, setSearch] = useState("");
  const runSearch = async () => {
    try {
      setLoad(false);
      dp(setMsg("Searching comapnies..."));
      const params = { name: search };

      const res = await getReq("/admin/companies", params);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);
      setCompanies(data);
    } catch (error) {
      console.log(error);
      errorMsg(error.message);
    } finally {
      dp(setMsg());
      setLoad(true);
    }
  };
  //
  return (
    <div className="flex items-center justify-start flex-col w-full">
      <div className="flex w-full flex-wrap items-center justify-between gap-[10px]">
        <div className="flex items-center gap-[10px] justify-center">
          <IconButton
            variant="gradient"
            disabled={page === 1}
            onClick={prevPage}
          >
            <FaCaretLeft fontSize={20} />
          </IconButton>
          <p>
            Page {page} of {pages}
          </p>
          <IconButton
            variant="gradient"
            disabled={page === pages}
            onClick={nextPage}
          >
            <FaCaretRight fontSize={20} />
          </IconButton>
        </div>
        <div className="flex md:hidden items-center justify-center gap-[10px]">
          <IconButton
            className="rounded-full"
            onClick={() => setRefresh(!refresh)}
          >
            <BiRefresh fontSize={20} />
          </IconButton>
          <Button variant={"gradient"} onClick={() => nv("add")}>
            Add
            <FaPlus />
          </Button>
        </div>
        <div className="flex items-center relative justify-center w-full md:w-[300px] lg:w-[500px]">
          <Search
            onChange={setSearch}
            value={search}
            placeholder={"Search company"}
            run={runSearch}
          />
        </div>
        <div className="hidden md:flex items-center justify-center gap-[10px]">
          <IconButton
            className="rounded-full"
            onClick={() => setRefresh(!refresh)}
          >
            <BiRefresh fontSize={20} />
          </IconButton>
          <Button variant={"gradient"} onClick={() => nv("add")}>
            Add
            <FaPlus />
          </Button>
        </div>
      </div>
      {/* !load */}
      {!load && <Loading />}
      {load && !companies?.[0] && (
        <div className="flex items-center justify-center w-full h-[50vh] flex-col gap-[10px]">
          <FaSuitcase className="text-[50px] text-slate-500" />
          <p className="text-[14px] text-slate-700">Companies not found</p>
          <Button variant={"gradient"} onClick={() => nv("add")}>
            Add now
            <FaPlus />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Companies;
