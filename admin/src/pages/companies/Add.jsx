import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getReq } from "../../utils/fetching";
import { setMsg } from "../../contexts/cfg";
import { errorMsg } from "../../utils/alert";
import Loading from "../../components/Loading";
import { Button, Input } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa6";

function CompanyAdd() {
  const nv = useNavigate();
  const dp = useDispatch();
  const [plans, setPlans] = useState([]);
  const [plansLoaded, setPlansLoaded] = useState(false);
  // fetching plans
  useEffect(() => {
    dp(setMsg("Fetching plans..."));
    getReq("/admin/plans")
      .then((res) => {
        const { ok, data, msg } = res.data;
        if (!ok) {
          errorMsg(msg);
        } else {
          setPlans(data);
          setPlansLoaded(true);
        }
      })
      .catch(() => {
        errorMsg();
      })
      .finally(() => {
        dp(setMsg());
      });
  }, []);
  //
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState({
    _id: "",
    name: "",
    image: "",
    phone: "",
  });
  //
  return (
    <div className="flex items-start gap-[10px] justify-start flex-col w-full">
      {/*  */}
      <div className="flex items-start justify-between w-full">
        <Button onClick={() => nv("../")}>
          <FaArrowLeft />
          Go back
        </Button>
        <div className="flex items-start justify-start flex-col">
          <h1 className="text-2xl font-bold">Add Company</h1>
          <h1 className="text-slate-500">Please fill the rows</h1>
        </div>
      </div>
      {/*  */}
      {!plansLoaded && <Loading />}
      {/*  */}
      {plansLoaded && (
        <div className="flex items-center justify-center w-full gap-[10px] flex-col">
          {/*  */}
          <div className="flex items-center justify-center w-full flex-col md:flex-row">
            <Input label="Name of company" />
          </div>
          {/*  */}
        </div>
      )}
      {/*  */}
    </div>
  );
}

export default CompanyAdd;
