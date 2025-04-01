import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { delReq, getReq, postReq, putReq } from "../utils/fetching";
import { setMsg } from "../contexts/cfg";
import { errorMsg, successMsg } from "../utils/alert";
import Loading from "../components/Loading";
import { FaChartPie, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { BiDotsVertical } from "react-icons/bi";

function Plans() {
  // scrolling
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const dp = useDispatch();
  const [plans, setPlans] = useState([]);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // fetching
  useEffect(() => {
    setLoad(false);
    dp(setMsg("Fetching plans..."));
    getReq(`/admin/plans`)
      .then((res) => {
        const { ok, data, msg } = res.data;
        if (!ok) {
          errorMsg(msg);
        } else {
          setPlans(data);
          console.log(data);
        }
      })
      .catch((err) => {
        errorMsg(err.message);
      })
      .finally(() => {
        dp(setMsg());
        setLoad(true);
      });
  }, []);
  //
  const [add, setAdd] = useState({
    open: false,
    name: "",
    price: "",
    products: "",
    staffs: "",
    annualDiscount: "",
    catalogs: "",
    isPopular: false,
    regularCustomer: false,
    cashbackSystem: false,
    additionalRow: false,
    telegramBot: false,
    paymentSystems: false,
    unlimitedProducts: false,
    apiSystems: false,
  });
  const closeAdd = () => {
    setAdd({
      open: false,
      name: "",
      price: "",
      products: "",
      staffs: "",
      annualDiscount: "",
      catalogs: "",
      isPopular: false,
      regularCustomer: false,
      cashbackSystem: false,
      additionalRow: false,
      telegramBot: false,
      unlimitedProducts: false,
      paymentSystems: false,
      apiSystems: false,
    });
  };
  const submitAdd = async () => {
    try {
      setDisabled(true);
      dp(setMsg("Adding new plan..."));

      const res = await postReq("/admin/plans", add);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);
      successMsg(msg);
      setPlans((prev) => [...prev, data]);
      closeAdd();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg());
      setDisabled(false);
    }
  };
  //
  const [edit, setEdit] = useState({
    _id: "",
    name: "",
    price: "",
    products: "",
    staffs: "",
    annualDiscount: "",
    catalogs: "",
    isPopular: false,
    regularCustomer: false,
    cashbackSystem: false,
    additionalRow: false,
    telegramBot: false,
    unlimitedProducts: false,
    paymentSystems: false,
    apiSystems: false,
  });
  const closeEdit = () => {
    setEdit({
      _id: "",
      name: "",
      price: "",
      products: "",
      staffs: "",
      annualDiscount: "",
      catalogs: "",
      isPopular: false,
      regularCustomer: false,
      cashbackSystem: false,
      additionalRow: false,
      telegramBot: false,
      unlimitedProducts: false,
      paymentSystems: false,
      apiSystems: false,
    });
  };
  const submitEdit = async () => {
    try {
      setDisabled(true);
      dp(setMsg("Updating plan..."));

      const res = await putReq(`/admin/plans`, edit);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);
      successMsg(msg);
      setPlans((prev) =>
        prev.map((plan) => (plan._id === edit._id ? data : plan))
      );
      closeEdit();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg());
      setDisabled(false);
    }
  };
  //
  const [del, setDel] = useState({
    _id: "",
    name: "",
  });
  const closeDel = () => {
    setDel({ _id: "", name: "" });
  };
  const submitDel = async () => {
    try {
      setDisabled(true);
      dp(setMsg("Deleting plan..."));

      const res = await delReq(`/admin/plans`, del);
      const { ok, msg } = res.data;

      if (!ok) throw new Error(msg);
      successMsg(msg);
      setPlans((prev) => prev.filter((plan) => plan._id !== del._id));
      closeDel();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg());
      setDisabled(false);
    }
  };
  return (
    <div className="flex items-center justify-start flex-col gap-[10px] w-full">
      <div className="flex w-full flex-wrap items-center justify-between gap-[10px]">
        {/* PAGINATION */}
        <Chip variant="ghost" value={`${plans?.length} Plans`} />
        {/* ADD */}
        <Button
          variant={"gradient"}
          onClick={() => setAdd({ ...add, open: true })}
        >
          Add
          <FaPlus />
        </Button>
      </div>
      {!load && <Loading />}
      {load && !plans?.[0] && (
        <div className="flex items-center justify-center w-full h-[50vh] flex-col gap-[10px]">
          <FaChartPie className="text-[50px] text-slate-500" />
          <p className="text-[14px] text-slate-700 uppercase">
            Plans not found
          </p>
          <Button
            variant={"gradient"}
            onClick={() => setAdd({ ...add, open: true })}
          >
            Add now
            <FaPlus />
          </Button>
        </div>
      )}
      {load && plans?.[0] && (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-start justify-start flex-col w-full gap-[5px] overflow-x-scroll lg:overflow-auto"
        >
          {/* STRUCT */}
          <div className="flex items-center select-none cursor-grab active:cursor-grabbing rounded-[10px] min-w-max justify-start h-[40px] w-full bg-gradient-to-b from-slate-600 to-slate-900 lg:w-auto">
            {/* ACT */}
            <div className="flex items-center justify-center w-[60px] h-full border-r">
              <p className="text-white text-[13px]">#</p>
            </div>
            {/* id */}
            <div className="flex items-center justify-center w-[60px] h-full border-r">
              <p className="text-white text-[13px]">ID</p>
            </div>
            {/* name */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Name</p>
            </div>
            {/* Price */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Price</p>
            </div>
            {/* Products */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Products</p>
            </div>
            {/* Staffs */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Staffs</p>
            </div>
            {/* Annual discount */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Annual discount</p>
            </div>
            {/* Catalogs */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Catalogs</p>
            </div>
            {/* is popular */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Is popular?</p>
            </div>
            {/* regularCustomer */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Regular customer</p>
            </div>
            {/* cashbackSystem */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Cashback system</p>
            </div>
            {/* additionalRow */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Additional row</p>
            </div>
            {/* telegramBot */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Telegram bot</p>
            </div>
            {/* paymentSystems */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Payment Systems</p>
            </div>
            {/* apiSystems */}
            <div className="flex items-center justify-center w-[120px] h-full">
              <p className="text-white text-[13px]">Api systems</p>
            </div>
          </div>
          {/*  */}
          {plans?.map((p, i) => {
            return (
              <div
                key={i}
                className="flex items-center rounded-[10px] min-w-max justify-start h-[60px] w-full bg-white lg:w-auto"
              >
                {/* ACT */}
                <div className="flex items-center justify-center w-[60px] h-full border-r">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <IconButton variant="text">
                        <BiDotsVertical fontSize={20} />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="border gap-[4px] flex items-center justify-start flex-col border-slate-300 shadow-lg">
                      <MenuItem
                        onClick={() =>
                          setEdit({
                            ...p,
                            unlimitedProducts: p?.products === "unlimited",
                          })
                        }
                        className="text-black flex items-center justify-start gap-[10px] text-[14px]"
                      >
                        <FaEdit className="text-blue-500" fontSize={18} />
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => setDel(p)}
                        className="text-black flex items-center justify-start gap-[10px] text-[14px]"
                      >
                        <FaTrash className="text-red-500" fontSize={18} />
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
                {/* id */}
                <div className="flex items-center justify-center w-[60px] h-full border-r">
                  <p className="text-slate-700 text-[15px]">{i + 1}</p>
                </div>
                {/* name */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <p className="text-slate-700 text-[15px]">{p?.name}</p>
                </div>
                {/* Price */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <p className="text-slate-700 text-[15px]">{p?.price}</p>
                </div>
                {/* Products */}
                <div className="flex items-center justify-center w-[120px] h-full border-r">
                  <Chip variant="ghost" value={`${p?.products}`} />
                </div>
                {/* Staffs */}
                <div className="flex items-center justify-center w-[120px] h-full border-r">
                  <Chip variant="ghost" value={`${p?.staffs}`} />
                </div>
                {/* Annual discount */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    color="red"
                    value={`${p?.annualDiscount}%`}
                  />
                </div>
                {/* Catalogs */}
                <div className="flex items-center justify-center w-[120px] h-full border-r">
                  <Chip variant="ghost" value={`${p?.catalogs}`} />
                </div>
                {/* is popular */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.isPopular ? "YES" : "NO"}
                    color={p?.isPopular ? "green" : "orange"}
                  />
                </div>
                {/* regularCustomer */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.regularCustomer ? "YES" : "NO"}
                    color={p?.regularCustomer ? "green" : "orange"}
                  />
                </div>
                {/* cashbackSystem */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.cashbackSystem ? "YES" : "NO"}
                    color={p?.cashbackSystem ? "green" : "orange"}
                  />{" "}
                </div>
                {/* additionalRow */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.additionalRow ? "YES" : "NO"}
                    color={p?.additionalRow ? "green" : "orange"}
                  />{" "}
                </div>
                {/* telegramBot */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.telegramBot ? "YES" : "NO"}
                    color={p?.telegramBot ? "green" : "orange"}
                  />{" "}
                </div>
                {/* paymentSystems */}
                <div className="flex items-center justify-center w-[150px] h-full border-r">
                  <Chip
                    variant="ghost"
                    value={p?.paymentSystems ? "YES" : "NO"}
                    color={p?.paymentSystems ? "green" : "orange"}
                  />{" "}
                </div>
                {/* apiSystems */}
                <div className="flex items-center justify-center w-[120px] h-full">
                  <Chip
                    variant="ghost"
                    value={p?.apiSystems ? "YES" : "NO"}
                    color={p?.apiSystems ? "green" : "orange"}
                  />{" "}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* adding */}
      <Dialog open={add?.open}>
        <DialogHeader>
          <p className="uppercase">Add new plan</p>
        </DialogHeader>
        <DialogBody className="border-y flex items-center justify-start flex-col max-h-[450px] overflow-y-scroll gap-[10px]">
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="Standart"
              required
              label="Name"
              onChange={(e) => setAdd({ ...add, name: e.target.value })}
              value={add?.name}
            />
            <Input
              placeholder="249000"
              required
              type="number"
              label="Monthly payment"
              onChange={(e) => setAdd({ ...add, price: e.target.value })}
              value={add?.price}
            />
          </div>
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="10"
              required
              disabled={add?.unlimitedProducts}
              type="Number"
              label="Number of products"
              onChange={(e) => setAdd({ ...add, products: e.target.value })}
              value={add?.products}
            />
            <Input
              placeholder="4"
              required
              type="number"
              label="Number of staffs"
              onChange={(e) => setAdd({ ...add, staffs: e.target.value })}
              value={add?.staffs}
            />
          </div>
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="8"
              required
              type="Number"
              label="Number of catalogs"
              onChange={(e) => setAdd({ ...add, catalogs: e.target.value })}
              value={add?.catalogs}
            />
            <Input
              placeholder="20%"
              required
              type="number"
              label="Annual discount"
              onChange={(e) =>
                setAdd({ ...add, annualDiscount: e.target.value })
              }
              value={add?.annualDiscount}
            />
          </div>
          {/*  */}
          <div className="flex items-start w-full flex-wrap justify-start gap-[10px]">
            <Checkbox
              label="Unlimited products"
              onChange={(e) =>
                setAdd({
                  ...add,
                  unlimitedProducts: e.target.checked,
                  products: Infinity,
                })
              }
              checked={add?.unlimitedProducts}
            />
            <Checkbox
              label="Is popular?"
              onChange={(e) => setAdd({ ...add, isPopular: e.target.checked })}
              checked={add?.isPopular}
            />
            <Checkbox
              label="Regular customer?"
              onChange={(e) =>
                setAdd({ ...add, regularCustomer: e.target.checked })
              }
              checked={add?.regularCustomer}
            />
            <Checkbox
              label="Cashback system?"
              onChange={(e) =>
                setAdd({ ...add, cashbackSystem: e.target.checked })
              }
              checked={add?.cashbackSystem}
            />
            <Checkbox
              label="Additional Row?"
              onChange={(e) =>
                setAdd({ ...add, additionalRow: e.target.checked })
              }
              checked={add?.additionalRow}
            />
            <Checkbox
              label="Telegram bot"
              onChange={(e) =>
                setAdd({ ...add, telegramBot: e.target.checked })
              }
              checked={add?.telegramBot}
            />
            <Checkbox
              label="Payment systems"
              onChange={(e) =>
                setAdd({ ...add, paymentSystems: e.target.checked })
              }
              checked={add?.paymentSystems}
            />
            <Checkbox
              label="Api system"
              onChange={(e) => setAdd({ ...add, apiSystems: e.target.checked })}
              checked={add?.apiSystems}
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-[10px]">
          <Button variant="text" disabled={disabled} onClick={closeAdd}>
            Close
          </Button>
          <Button
            variant="gradient"
            disabled={disabled}
            loading={disabled}
            onClick={submitAdd}
            color="green"
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
      {/* editing */}
      <Dialog open={edit?._id !== ""}>
        <DialogHeader>
          <p className="uppercase">edit plan</p>
        </DialogHeader>
        <DialogBody className="border-y flex items-center justify-start flex-col max-h-[450px] overflow-y-scroll gap-[10px]">
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="Standart"
              required
              label="Name"
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              value={edit?.name}
            />
            <Input
              placeholder="249000"
              required
              type="number"
              label="Monthly payment"
              onChange={(e) => setEdit({ ...edit, price: e.target.value })}
              value={edit?.price}
            />
          </div>
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="10"
              required
              disabled={edit?.unlimitedProducts}
              type="Number"
              label="Number of products"
              onChange={(e) => setEdit({ ...edit, products: e.target.value })}
              value={edit?.products}
            />
            <Input
              placeholder="4"
              required
              type="number"
              label="Number of staffs"
              onChange={(e) => setEdit({ ...edit, staffs: e.target.value })}
              value={edit?.staffs}
            />
          </div>
          {/*  */}
          <div className="flex items-center w-full flex-wrap md:flex-nowrap justify-center gap-[10px]">
            <Input
              placeholder="8"
              required
              type="Number"
              label="Number of catalogs"
              onChange={(e) => setEdit({ ...edit, catalogs: e.target.value })}
              value={edit?.catalogs}
            />
            <Input
              placeholder="20%"
              required
              type="number"
              label="Annual discount"
              onChange={(e) =>
                setEdit({ ...edit, annualDiscount: e.target.value })
              }
              value={edit?.annualDiscount}
            />
          </div>
          {/*  */}
          <div className="flex items-start w-full flex-wrap justify-start gap-[10px]">
            <Checkbox
              label="Unlimited products"
              onChange={(e) =>
                setEdit({
                  ...edit,
                  unlimitedProducts: e.target.checked,
                  products: Infinity,
                })
              }
              checked={edit?.unlimitedProducts}
            />
            <Checkbox
              label="Is popular?"
              onChange={(e) =>
                setEdit({ ...edit, isPopular: e.target.checked })
              }
              checked={edit?.isPopular}
            />
            <Checkbox
              label="Regular customer?"
              onChange={(e) =>
                setEdit({ ...edit, regularCustomer: e.target.checked })
              }
              checked={edit?.regularCustomer}
            />
            <Checkbox
              label="Cashback system?"
              onChange={(e) =>
                setEdit({ ...edit, cashbackSystem: e.target.checked })
              }
              checked={edit?.cashbackSystem}
            />
            <Checkbox
              label="Additional Row?"
              onChange={(e) =>
                setEdit({ ...edit, additionalRow: e.target.checked })
              }
              checked={edit?.additionalRow}
            />
            <Checkbox
              label="Telegram bot"
              onChange={(e) =>
                setEdit({ ...edit, telegramBot: e.target.checked })
              }
              checked={edit?.telegramBot}
            />
            <Checkbox
              label="Payment systems"
              onChange={(e) =>
                setEdit({ ...edit, paymentSystems: e.target.checked })
              }
              checked={edit?.paymentSystems}
            />
            <Checkbox
              label="Api system"
              onChange={(e) =>
                setEdit({ ...edit, apiSystems: e.target.checked })
              }
              checked={edit?.apiSystems}
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-[10px]">
          <Button variant="text" disabled={disabled} onClick={closeEdit}>
            Close
          </Button>
          <Button
            variant="gradient"
            disabled={disabled}
            loading={disabled}
            onClick={submitEdit}
            color="green"
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
      {/* deleting */}
      <Dialog open={del?._id !== ""}>
        <DialogHeader>
          <p className="uppercase">delete plan</p>
        </DialogHeader>
        <DialogBody>
          <p>Are you sure you want to delete the plan: {del?.name}</p>
        </DialogBody>
        <DialogFooter className="gap-[10px]">
          <Button variant="text" onClick={closeDel}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={submitDel}
            loading={disabled}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Plans;
