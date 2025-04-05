import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getReq } from "../../utils/fetching";
import { setMsg } from "../../contexts/cfg";
import { errorMsg } from "../../utils/alert";
import Loading from "../../components/Loading";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa6";

import fastfood from "../../assets/fastfood.png";
import pharmacy from "../../assets/pharmacy.png";
import store from "../../assets/store.png";
import retail from "../../assets/retail.png";
//
import click from "../../assets/payments/click.png";
import payme from "../../assets/payments/payme.png";
import cash from "../../assets/payments/cash.png";
import card from "../../assets/payments/card.png";
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
  const [users, setUSers] = useState([]);
  const [user, setUser] = useState({
    _id: "",
    name: "",
    image: "",
    phone: "",
  });
  const [form, setForm] = useState({
    name: "",
    image: "",
    companyType: "", //fastfood", retail, store, pharmacy
    botToken: "",
    planId: "",
    isPaid: false,
    paymentType: "", //clicl, payme, cash
    month: "",
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
        <div className="flex bg-white p-[20px] rounded-[10px] items-center justify-center w-full gap-[10px] flex-col">
          {/*  */}
          <div className="flex items-center gap-[10px] justify-center w-full flex-col md:flex-row">
            <Input
              placeholder="Selly, Sello, ..."
              label="Company name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              value={form.name}
              required
            />
            <Input
              placeholder="12345:qwertyu"
              label="Bot token"
              onChange={(e) => setForm({ ...form, botToken: e.target.value })}
              value={form.botToken}
            />
          </div>
          {/*  */}
          <div className="flex items-center gap-[10px] justify-center w-full flex-col md:flex-row">
            <Select
              onChange={(e) => setForm({ ...form, companyType: e })}
              value={form.companyType}
              label="Company type"
            >
              <Option
                value="fastfood"
                className="flex items-center justify-start"
              >
                <img
                  src={fastfood}
                  alt="f"
                  className="w-[20px] inline mr-[10px]"
                />
                Fast food
              </Option>
              <Option value="store" className="flex items-center justify-start">
                <img
                  src={store}
                  alt="s"
                  className="w-[20px] inline mr-[10px]"
                />
                Store
              </Option>
              <Option
                value="retail"
                className="flex items-center justify-start"
              >
                <img
                  src={retail}
                  alt="r"
                  className="w-[20px] inline mr-[10px]"
                />
                Retail
              </Option>
              <Option
                value="pharmacy"
                className="flex items-center justify-start"
              >
                <img
                  src={pharmacy}
                  alt="r"
                  className="w-[20px] inline mr-[10px]"
                />
                Pharmacy
              </Option>
            </Select>
          </div>
          {/*  */}
        </div>
      )}
      {/*  */}
    </div>
  );
}

export default CompanyAdd;
