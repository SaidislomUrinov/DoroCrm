import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  FaFilePdf,
  FaLock,
  FaPhone,
  FaPrint,
  FaSave,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { BiImageAdd } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { errorMsg } from "../../utils/alert";
import { postReq } from "../../utils/fetching";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
function Add({ setUsers, page, setTotal }) {
  const h = useLocation().hash;
  const nv = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    image: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const close = () => {
    nv("#");
    setShow(false);
    setForm({
      name: "",
      phone: "",
      password: "",
      image: "",
    });
  };
  const submit = async () => {
    try {
      setDisabled(true);
      const { name, image, password, phone } = form;
      if (!name || !phone || !password)
        throw new Error("Qatorlarni to'ldiring!");

      const f = new FormData();
      f.append("name", name);
      f.append("phone", phone);
      f.append("password", password);
      if (image) f.append("image", image);

      const res = await postReq("/user/create", f);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);

      setShow(true);
      setUsers((prev) => {
        if (+page === 1) {
          const updated = [data, ...prev];
          if (updated.length > 30) updated.pop();
          return updated;
        }
        return prev;
      });
      setTotal((prev) => {
        return prev + 1;
      });
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setDisabled(false);
    }
  };
  //
  const print = () => {
    const printContents = document.querySelector(".result");
    const printWindow = window.open("", "_blank");

    if (!printContents || !form.name) return;

    printWindow.document.write(`
    <html>
      <head><title>${form.name}</title></head>
      <body>${printContents.innerHTML}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const savePdf = async () => {
    const { name } = form;
    const content = document.querySelector(".result");

    if (!content || !name) return;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}.pdf`);
  };
  //
  return (
    <>
      <Dialog size="sm" open={h === "#add"}>
        <DialogHeader>User qo'shish</DialogHeader>
        <DialogBody className="border-y flex items-start justify-start flex-col gap-[10px]">
          {/*  */}
          <div className="relative">
            <label className="w-[100px] flex items-center justify-center h-[100px] overflow-hidden cursor-pointer rounded-[10px] bg-slate-100 hover:bg-slate-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files?.[0] })
                }
                className="hidden"
              />
              {!form.image ? (
                <BiImageAdd className="text-[50px]" />
              ) : (
                <img src={URL.createObjectURL(form.image)} />
              )}
            </label>
            {form.image && (
              <div className="absolute cursor-pointer top-[5px] right-[5px]">
                <FaXmark
                  className="text-red-500"
                  onClick={() => setForm({ ...form, image: "" })}
                />
              </div>
            )}
          </div>
          {/*  */}
          <Input
            label="Ismi"
            required
            placeholder="Shoxrux, ..."
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
            icon={<FaUser />}
          />
          {/*  */}
          <InputMask
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            value={form.phone}
            mask={"+\\9\\98 99 999 99 99"}
            maskChar={""}
          >
            {(props) => (
              <Input {...props} required label="Raqami" icon={<FaPhone />} />
            )}
          </InputMask>
          {/*  */}
          <Input
            label="Paroli"
            required
            placeholder="******"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
            icon={<FaLock />}
          />
        </DialogBody>
        <DialogFooter className="gap-1">
          <Button variant="text" disabled={disabled} onClick={close}>
            Ortga
          </Button>
          <Button loading={disabled} onClick={submit} color="green">
            {!disabled && <FaSave />}
            Saqlash
          </Button>
        </DialogFooter>
      </Dialog>
      {/*  */}
      <Dialog size="xs" open={show}>
        <DialogHeader className="relative">
          Natija
          <div className="absolute right-[5px]">
            <IconButton onClick={close} variant="text">
              <FaXmark fontSize={20} />
            </IconButton>
          </div>
        </DialogHeader>
        <DialogBody className="border-y result flex items-start justify-start flex-col gap-[10px]">
          <p className="text-slate-800 font-normal w-full">
            <b className="text-orange-500">{form.name}</b> uchun profil
            ma'lumotlari
          </p>
          <p className="text-black font-normal">
            Raqam: <code className="font-semibold">{form.phone}</code>
          </p>
          <p className="text-black font-normal">
            Parol: <code className="font-semibold">{form.password}</code>
          </p>
          <p className="text-center bg-slate-100 p-[10px] rounded-[10px] text-[13px] text-slate-800 font-bold">
            Diqqat ushbu raqam va parolni ma'lumotlaringiz xavfsizligi uchun
            faqat o'zingiz ishlating!
          </p>
        </DialogBody>
        <DialogFooter className="gap-1">
          <Button onClick={print} color="cyan">
            <FaPrint />
            Chop etish
          </Button>
          <Button onClick={savePdf} color="blue">
            <FaFilePdf />
            PDF ni saqlash
          </Button>
        </DialogFooter>
      </Dialog>
      {/*  */}
    </>
  );
}

export default Add;
