import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReq } from "./utils/fetching";
import { updateUser } from "./contexts/user";
import Loading from "./components/Loading";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Top from "./components/Top";

function App() {
  const { _id } = useSelector((e) => e.user);
  const dp = useDispatch();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    getReq("/admin/verifyAccess")
      .then((res) => {
        const { ok, data } = res.data;
        if (ok) dp(updateUser(data));
      })
      .finally(() => {
        setLoad(true);
      });
  }, []);
  if (!load)
    return (
      <div className="flex items-center justify-center w-full h-[100vh]">
        <Loading />
      </div>
    );
  if (!_id) return <Auth />;
  return (
    <div className="flex items-start justify-center w-full">
      <Navbar />
      <div className="flex items-center justify-start flex-col w-full lg:w-4/5 xl:w-5/6">
        <Top />
        <div className="flex items-center justify-start flex-col w-full h-[90vh] md:h-[95vh] p-[10px] overflow-y-scroll"></div>
      </div>
    </div>
  );
}

export default App;
