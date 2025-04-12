import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { errorMsg, successMsg } from "../../utils/alert";
import { postReq } from "../../utils/fetching";
const schema = {
  name: "",
  price: "",
  yearlyDiscount: "",
  catalogs: "",
  products: "",
  staffs: "",
  statistics: "simple", // ["simple", "pro", "super"],
  cashier: "simple", // ["simple", "pro", "super"],
  ordersViaTelegram: "",
  //
  isPopular: false,
  unlimitProducts: false,
  unlimitOrdersViaTelegram: false,
  staffsSalary: false,
  regularCustomer: false,
  branding: false,
  apiIntegration: false,
  //
  importFromExcel: false,
  exportToExcel: false,
  //
  notifyViaTelegram: false,
  notifyViaSms: false,
};
function Add({ setPlans }) {
  const [form, setForm] = useState(schema);
  const [disabled, setDisabled] = useState(false);
  const nv = useNavigate();
  const h = useLocation().hash;
  const close = () => {
    nv("#");
    setForm(schema);
  };
  const submit = async () => {
    try {
      setDisabled(true);

      const res = await postReq("/plan/create", form);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);

      setPlans((prev) => [...prev, data]);
      successMsg(msg);
      close();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <Dialog open={h === "#add"}>
      <DialogHeader>Ta'rif qo'shish</DialogHeader>
      <DialogBody className="flex items-start h-[500px] overflow-y-scroll justify-start gap-[10px] flex-col border-y">
        {/* name && price */}
        <div className="flex items-center flex-col md:flex-row justify-center gap-[10px] w-full">
          <Input
            label="Nomi"
            className="!font-bold"
            required
            variant="standard"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
          />
          <Input
            label="Oylik to'lov"
            className="!font-bold"
            type="number"
            required
            variant="standard"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            value={form.price}
          />
        </div>
        {/* yearlyDiscount && catalogs */}
        <div className="flex items-center flex-col md:flex-row justify-center gap-[10px] w-full">
          <Input
            label="Yillik chegirma %"
            type="number"
            className="!font-bold"
            variant="standard"
            onChange={(e) =>
              setForm({ ...form, yearlyDiscount: e.target.value })
            }
            value={form.yearlyDiscount}
          />
          <Input
            label="Kataloglar soni"
            className="!font-bold"
            type="number"
            required
            variant="standard"
            onChange={(e) => setForm({ ...form, catalogs: e.target.value })}
            value={form.catalogs}
          />
        </div>
        {/* staffs && products */}
        <div className="flex items-center flex-col md:flex-row justify-center gap-[10px] w-full">
          <Input
            label="Ishchilar soni"
            type="number"
            className="!font-bold"
            required
            variant="standard"
            onChange={(e) => setForm({ ...form, staffs: e.target.value })}
            value={form.staffs}
          />
          <Input
            label="Mahsulotlar soni"
            className="!font-bold"
            type="number"
            required
            disabled={form.unlimitProducts}
            variant="standard"
            onChange={(e) => setForm({ ...form, products: e.target.value })}
            value={form.products}
          />
        </div>
        {/* statistics && cashier */}
        <div className="flex items-center flex-col md:flex-row justify-center gap-[10px] w-full">
          <Select
            onChange={(e) => setForm({ ...form, statistics: e })}
            value={form.statistics}
            variant="standard"
            className="!font-bold"
            label="Statistika turi"
          >
            <Option value="simple">Oddiy</Option>
            <Option value="pro">Professional</Option>
            <Option value="super">Super</Option>
          </Select>
          <Select
            onChange={(e) => setForm({ ...form, cashier: e })}
            value={form.cashier}
            variant="standard"
            className="!font-bold"
            label="Kassa turi"
          >
            <Option value="simple">Oddiy</Option>
            <Option value="pro">Professional</Option>
            <Option value="super">Super</Option>
          </Select>
        </div>
        {/* ordersViaTelegram */}
        <div className="flex items-center flex-col md:flex-row justify-center gap-[10px] w-full">
          <Input
            label="Telegramdan oylik buyurtmalar"
            type="number"
            className="!font-bold"
            required
            disabled={form.unlimitOrdersViaTelegram}
            variant="standard"
            onChange={(e) =>
              setForm({ ...form, ordersViaTelegram: e.target.value })
            }
            value={form.ordersViaTelegram}
          />
        </div>
        {/*  */}
        <div className="flex items-center justify-center flex-wrap w-full gap-[5px]">
          <Checkbox
            className="rounded-full"
            label="Ommabop"
            color="blue"
            checked={form.isPopular}
            onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
          />
          <Checkbox
            className="rounded-full"
            label="Cheksiz mahsulotlar"
            color="blue"
            checked={form.unlimitProducts}
            onChange={(e) =>
              setForm({
                ...form,
                unlimitProducts: e.target.checked,
                products: "",
              })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Brendlash"
            color="blue"
            checked={form.branding}
            onChange={(e) => setForm({ ...form, branding: e.target.checked })}
          />
          <Checkbox
            className="rounded-full"
            label="Doimiy mijozlar"
            color="blue"
            checked={form.regularCustomer}
            onChange={(e) =>
              setForm({ ...form, regularCustomer: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Ishchilar maoshini hisoblash"
            color="blue"
            checked={form.staffsSalary}
            onChange={(e) =>
              setForm({ ...form, staffsSalary: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="API integratsiyasi"
            color="blue"
            checked={form.apiIntegration}
            onChange={(e) =>
              setForm({ ...form, apiIntegration: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Exceldan import"
            color="blue"
            checked={form.importFromExcel}
            onChange={(e) =>
              setForm({ ...form, importFromExcel: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Excelga export"
            color="blue"
            checked={form.exportToExcel}
            onChange={(e) =>
              setForm({ ...form, exportToExcel: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="SMS bildirishnomalari"
            color="blue"
            checked={form.notifyViaSms}
            onChange={(e) =>
              setForm({ ...form, notifyViaSms: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Telegram bildirishnomalari"
            color="blue"
            checked={form.notifyViaTelegram}
            onChange={(e) =>
              setForm({ ...form, notifyViaTelegram: e.target.checked })
            }
          />
          <Checkbox
            className="rounded-full"
            label="Telegram orqali cheksiz buyurtmalar"
            color="blue"
            checked={form.unlimitOrdersViaTelegram}
            onChange={(e) =>
              setForm({
                ...form,
                unlimitOrdersViaTelegram: e.target.checked,
                ordersViaTelegram: "",
              })
            }
          />
        </div>
      </DialogBody>
      <DialogFooter className="gap-[10px]">
        <Button variant="text" disabled={disabled} onClick={close}>
          Ortga
        </Button>
        <Button loading={disabled} onClick={submit} color="green">
          {!disabled && <FaSave />}
          Saqlash
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default Add;
