import {
  Button,
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
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import {
  FaCaretLeft,
  FaCaretRight,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaPlus,
  FaSuitcase,
  FaUnlock,
  FaUser,
  FaUsersSlash,
} from "react-icons/fa";
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import { API, getReq, postReq, putReq } from "../../utils/fetching";
import { errorMsg, successMsg } from "../../utils/alert";
import { BiDotsVertical, BiImageAdd } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setMsg } from "../../contexts/cfg";
import { FaMessage } from "react-icons/fa6";

function Users() {
  const dp = useDispatch();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  // pagination
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const nextPage = () => {
    if (page < pages) setPage(page + 1);
  };
  // fetching
  useEffect(() => {
    setLoad(false);
    dp(setMsg("Fetching users..."));
    getReq(`/admin/users`, { page })
      .then((res) => {
        const { ok, data, pages, page, msg } = res.data;
        if (!ok) {
          errorMsg(msg);
        } else {
          setUsers(data);
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
  }, [page]);
  //search
  const [search, setSearch] = useState("");
  const runSearch = () => {};
  // add
  const [add, setAdd] = useState({
    open: false,
    name: "",
    phone: "",
    password: "",
    image: "",
    show: false,
  });
  const closeAdd = () => {
    setAdd({
      open: false,
      name: "",
      phone: "",
      password: "",
      image: "",
      show: false,
    });
  };
  const submitAdd = async () => {
    try {
      const { name, phone, password, image } = add;
      if (!name || !phone || !password) throw new Error("Fill the rows");

      setDisabled(true);
      dp(setMsg("Adding new user..."));
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("password", password);
      if (image) formData.append("image", image);

      const res = await postReq("/admin/users", formData);
      const { ok, data, msg } = res.data;
      if (!ok) throw new Error(msg);

      successMsg(msg);

      setUsers((prev) => {
        const updatedUsers = [data, ...prev];
        return updatedUsers.length > 30
          ? updatedUsers.slice(0, 30)
          : updatedUsers;
      });
      closeAdd();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      setDisabled(false);
      dp(setMsg());
    }
  };
  //edit
  const [edit, setEdit] = useState({
    _id: "",
    name: "",
    phone: "",
    password: "",
    image: "",
    show: false,
    newImage: "",
    removeImage: false,
  });
  const closeEdit = () => {
    setEdit({
      _id: "",
      name: "",
      phone: "",
      password: "",
      image: "",
      show: false,
      newImage: "",
      removeImage: false,
    });
  };
  const submitEdit = async () => {
    try {
      const { _id, name, phone, password, newImage, removeImage } = edit;
      if (!name || !phone) throw new Error("Fill the name and phone");

      setDisabled(true);
      dp(setMsg("Updating user..."));
      const formData = new FormData();

      formData.append("_id", _id);
      formData.append("name", name);
      formData.append("phone", phone);
      if (password) formData.append("password", password);
      if (newImage && !removeImage) formData.append("image", newImage);
      if (removeImage) formData.append("removeImage", "true");

      const res = await putReq(`/admin/users`, formData);
      const { ok, data, msg } = res.data;

      if (!ok) throw new Error(msg);
      successMsg(msg);

      const updatedUsers = users.map((user) =>
        user._id === _id ? data : user
      );
      setUsers(updatedUsers);
      closeEdit();
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg());
      setDisabled(false);
    }
  };
  // block
  const blockUser = async (_id, block) => {
    try {
      dp(setMsg(block ? "Blocking user..." : "Unblocking user..."));
      const res = await postReq(`/admin/users/block`, { _id, block });
      const { ok, msg } = res.data;

      if (!ok) throw new Error(msg);
      successMsg(msg);

      const updatedUsers = users.map((user) =>
        user._id === _id ? { ...user, block: block } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      errorMsg(error.message);
    } finally {
      dp(setMsg());
    }
  };
  return (
    <div className="flex items-start justify-start gap-[10px] flex-col w-full">
      {/* TOP */}
      <div className="flex w-full flex-wrap items-center justify-between gap-[10px]">
        {/* PAGINATION */}
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
        {/* ADD */}
        <Button
          variant={"gradient"}
          onClick={() => setAdd({ ...add, open: true })}
          className="md:hidden"
        >
          Add
          <FaPlus />
        </Button>
        {/* search bar */}
        <div className="flex items-center relative justify-center w-full md:w-[300px] lg:w-[500px]">
          <Search
            onChange={setSearch}
            value={search}
            placeholder={"Search user"}
            run={runSearch}
          />
        </div>
        {/*  */}
        <Button
          variant={"gradient"}
          onClick={() => setAdd({ ...add, open: true })}
          className="hidden md:flex"
        >
          Add
          <FaPlus />
        </Button>
      </div>
      {/* !load */}
      {!load && <Loading />}
      {load && !users?.[0] && (
        <div className="flex items-center justify-center w-full h-[50vh] flex-col gap-[10px]">
          <FaUsersSlash className="text-[50px] text-slate-500" />
          <p className="text-[14px] text-slate-700">Users not found</p>
          <Button
            variant={"gradient"}
            onClick={() => setAdd({ ...add, open: true })}
          >
            Add now
            <FaPlus />
          </Button>
        </div>
      )}
      {load && users?.[0] && (
        <div className="flex items-start justify-start flex-col w-full gap-[5px] overflow-x-scroll lg:overflow-auto">
          {/* STRUCT */}
          <div className="flex items-center rounded-[10px] min-w-max justify-start h-[40px] w-full bg-gradient-to-b from-slate-600 to-slate-900 lg:w-auto">
            {/* ACT */}
            <div className="flex items-center justify-center w-[60px] h-full border-r">
              <p className="text-white text-[13px]">#</p>
            </div>
            {/* id */}
            <div className="flex items-center justify-center w-[60px] h-full border-r">
              <p className="text-white text-[13px]">ID</p>
            </div>
            {/* id */}
            <div className="flex items-center justify-center w-[80px] h-full border-r">
              <p className="text-white text-[13px]">Image</p>
            </div>
            {/* name */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Name</p>
            </div>
            {/* Phone */}
            <div className="flex items-center justify-center w-[150px] h-full border-r">
              <p className="text-white text-[13px]">Phone</p>
            </div>
            {/* Companies */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Companies</p>
            </div>
            {/* Products */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Products</p>
            </div>
            {/* Staffs */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Staffs</p>
            </div>
            {/* Blocked */}
            <div className="flex items-center justify-center w-[120px] h-full border-r">
              <p className="text-white text-[13px]">Blocked</p>
            </div>
            {/* Created */}
            <div className="flex items-center justify-center w-[150px] h-full">
              <p className="text-white text-[13px]">Joined</p>
            </div>
          </div>
          {/*  */}
          {users?.map((u, i) => {
            return (
              <div
                key={i}
                className="flex items-center rounded-[10px] min-w-max justify-start h-[60px] w-full bg-white lg:w-auto"
              >
                {/* ACT */}
                <div className="flex items-center justify-center w-[60px] h-full border-r border-slate-300">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <IconButton variant="text">
                        <BiDotsVertical fontSize={20} />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="border gap-[4px] flex items-center justify-start flex-col border-slate-300 shadow-lg">
                      <MenuItem
                        onClick={() => setEdit(u)}
                        className="text-black flex items-center justify-start gap-[10px] text-[14px]"
                      >
                        <FaEdit className="text-blue-500" fontSize={18} />
                        Edit
                      </MenuItem>
                      <MenuItem className="text-black flex items-center justify-start gap-[10px] text-[14px]">
                        <FaSuitcase className="text-indigo-500" fontSize={18} />
                        Companies
                      </MenuItem>
                      {u?.block ? (
                        <MenuItem
                          onClick={() => blockUser(u?._id, false)}
                          className="text-black flex items-center justify-start gap-[10px] text-[14px]"
                        >
                          <FaUnlock className="text-green-500" fontSize={18} />
                          Unblock
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={() => blockUser(u?._id, true)}
                          className="text-black flex items-center justify-start gap-[10px] text-[14px]"
                        >
                          <FaLock className="text-red-500" fontSize={18} />
                          Block
                        </MenuItem>
                      )}
                      <MenuItem className="text-black flex items-center justify-start gap-[10px] text-[14px]">
                        <FaMessage className="text-purple-500" fontSize={18} />
                        Chat
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
                {/* id */}
                <div className="flex items-center justify-center w-[60px] h-full border-r border-slate-300">
                  <p className="text-slate-700 text-[15px]">{u?.id}</p>
                </div>
                {/* id */}
                <div className="flex items-center justify-center w-[80px] h-full border-r border-slate-300">
                  <div className="flex overflow-hidden items-center justify-center w-[40px] aspect-square rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                    {u?.image ? (
                      <img src={`${API}${u?.image}`} alt={`image_${u?.id}`} />
                    ) : (
                      <p className="text-white font-bold text-[20px]">
                        {u?.name?.[0]}
                      </p>
                    )}
                  </div>
                </div>
                {/* name */}
                <div className="flex items-center justify-center w-[150px] h-full border-r border-slate-300">
                  <p className="text-slate-700 text-[15px] text-center">
                    {u?.name}
                  </p>
                </div>
                {/* Phone */}
                <div className="flex items-center justify-center w-[150px] h-full border-r border-slate-300">
                  <p className="text-slate-700 text-[15px] text-center">
                    {u?.phone}
                  </p>
                </div>
                {/* Companies */}
                <div className="flex items-center justify-center w-[120px] h-full border-r border-slate-300">
                  <Chip variant="ghost" value={`${u?.companies}`} />
                </div>
                {/* Products */}
                <div className="flex items-center justify-center w-[120px] h-full border-r border-slate-300">
                  <Chip variant="ghost" value={`${u?.products}`} />
                </div>
                {/* Staffs */}
                <div className="flex items-center justify-center w-[120px] h-full border-r border-slate-300">
                  <Chip variant="ghost" value={`${u?.staffs}`} />
                </div>
                {/* Blocked */}
                <div className="flex items-center justify-center w-[120px] h-full border-r border-slate-300">
                  {u.block && (
                    <Chip variant={"gradient"} color="red" value={`Blocked`} />
                  )}
                </div>
                {/* Created */}
                <div className="flex items-center justify-center w-[150px] h-full">
                  <p className="text-slate-700 text-[15px]">{u?.createdAt}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* adding */}
      <Dialog open={add.open}>
        <DialogHeader>
          <p>Add new user</p>
        </DialogHeader>
        <DialogBody className="border-y flex items-start justify-start gap-[10px] flex-col">
          {/*  */}
          <div className="flex items-start flex-col justify-start gap-[10px]">
            <label className="w-[125px] aspect-square flex items-center justify-center cursor-pointer rounded-[10px] bg-slate-100 hover:bg-slate-200 overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAdd({ ...add, image: e.target.files?.[0] })}
              />
              {!add?.image ? (
                <BiImageAdd className="text-[50px]" />
              ) : (
                <img className="w-full" src={URL.createObjectURL(add?.image)} />
              )}
            </label>
            <Button
              variant="gradient"
              disabled={!add?.image}
              onClick={() => setAdd({ ...add, image: "" })}
              color="red"
              size="sm"
            >
              Remove image
            </Button>
          </div>
          {/*  */}
          <Input
            label="Name"
            required
            icon={<FaUser className="text-[20px]" />}
            variant="standard"
            placeholder="John doe"
            value={add.name}
            onChange={(e) => setAdd({ ...add, name: e.target.value })}
          />
          {/*  */}
          <InputMask
            mask="+\9\98-(99)-999-99-99"
            maskChar={""}
            value={add.phone}
            onChange={(e) => setAdd({ ...add, phone: e.target.value })}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                label="Phone Number"
                required
                icon={<FaPhone className="text-[20px]" />}
                type="tel"
                variant="standard"
              />
            )}
          </InputMask>
          <Input
            label="Password"
            required
            icon={
              add.show ? (
                <FaEye
                  className="cursor-pointer text-[20px]"
                  onClick={() => setAdd({ ...add, show: false })}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer text-[20px]"
                  onClick={() => setAdd({ ...add, show: true })}
                />
              )
            }
            variant="standard"
            type={add.show ? "tel" : "password"}
            placeholder="*****"
            value={add.password}
            onChange={(e) =>
              setAdd({ ...add, password: e.target.value?.trim() })
            }
          />
        </DialogBody>
        <DialogFooter className="gap-[10px]">
          <Button variant="text" onClick={closeAdd} disabled={disabled}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={submitAdd}
            disabled={disabled}
            loading={disabled}
          >
            Add
          </Button>
        </DialogFooter>
      </Dialog>
      {/* editing */}
      <Dialog open={edit._id !== ""}>
        <DialogHeader>
          <p>Edit user</p>
        </DialogHeader>
        <DialogBody className="border-y flex items-start justify-start gap-[10px] flex-col">
          {/*  */}
          <div className="flex items-start flex-col justify-start gap-[10px]">
            <label className="w-[125px] aspect-square flex items-center justify-center cursor-pointer rounded-[10px] bg-slate-100 hover:bg-slate-200 overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    newImage: e.target.files?.[0],
                    removeImage: false,
                  })
                }
              />
              {edit?.newImage ? (
                <img
                  className="w-full"
                  src={URL.createObjectURL(edit.newImage)}
                />
              ) : edit?.image ? (
                <img className="w-full" src={API + edit.image} />
              ) : (
                <BiImageAdd className="text-[50px]" />
              )}
            </label>
            <Button
              variant="gradient"
              disabled={!edit?.image && !edit?.newImage}
              onClick={() =>
                setEdit({ ...edit, newImage: "", image: "", removeImage: true })
              }
              color="red"
              size="sm"
            >
              Remove image
            </Button>
          </div>
          {/*  */}
          <Input
            label="Name"
            required
            icon={<FaUser className="text-[20px]" />}
            variant="standard"
            placeholder="John doe"
            value={edit.name}
            onChange={(e) => setEdit({ ...edit, name: e.target.value })}
          />
          {/*  */}
          <InputMask
            mask="+\9\98-(99)-999-99-99"
            maskChar={""}
            value={edit.phone}
            onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                label="Phone Number"
                required
                icon={<FaPhone className="text-[20px]" />}
                type="tel"
                variant="standard"
              />
            )}
          </InputMask>
          <Input
            label="Password"
            required
            icon={
              edit.show ? (
                <FaEye
                  className="cursor-pointer text-[20px]"
                  onClick={() => setEdit({ ...edit, show: false })}
                />
              ) : (
                <FaEyeSlash
                  className="cursor-pointer text-[20px]"
                  onClick={() => setEdit({ ...edit, show: true })}
                />
              )
            }
            variant="standard"
            type={add.show ? "tel" : "password"}
            placeholder="*****"
            value={add.password}
            onChange={(e) =>
              setAdd({ ...add, password: e.target.value?.trim() })
            }
          />
        </DialogBody>
        <DialogFooter className="gap-[10px]">
          <Button variant="text" onClick={closeEdit} disabled={disabled}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={submitEdit}
            disabled={disabled}
            loading={disabled}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Users;
