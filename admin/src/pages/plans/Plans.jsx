import { useEffect, useState } from "react";
import { getReq } from "../../utils/fetching";
import { errorMsg } from "../../utils/alert";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { FaChartPie, FaPlusCircle } from "react-icons/fa";
import Loading from "../../components/Loading";
import Add from "./Add";

function Plans() {
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [plans, setPlans] = useState([]);
  //
  useEffect(() => {
    getReq("/plan/list")
      .then((res) => {
        const { ok, data } = res.data;
        if (ok) {
          setPlans(data);
        }
      })
      .catch((error) => {
        errorMsg(error.message);
      })
      .finally(() => {
        setLoad(true);
      });
  }, []);
  //
  const nv = useNavigate();
  return (
    <div className="flex items-start justify-start flex-col gap-[10px] w-full">
      <Button
        onClick={() => nv("#add")}
        color="orange"
        className="rounded-full"
      >
        <FaPlusCircle />
        Qo'shish
      </Button>
      {/*  */}
      {!load && <Loading />}
      {/*  */}
      {load && !plans?.[0] && (
        <div className="flex items-center justify-center w-full flex-col h-[50vh] gap-1">
          <FaChartPie className="text-[50px] text-slate-500" />
          <p className="text-[14px]">Ta'riflar mavjud emas!</p>
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
      {/*  */}
      <Add setPlans={setPlans} />
      {/*  */}
    </div>
  );
}

export default Plans;
