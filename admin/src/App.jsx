import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReq } from "./utils/fetching";
import { updateUser } from "./contexts/user";
import Loading from "./components/Loading";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Top from "./components/Top";
import Socket from "./components/Socket";
import { Route, Routes } from "react-router-dom";
import CompanyAdd from "./pages/companies/Add";
const Users = lazy(() => import("./pages/Users"));
const Plans = lazy(() => import("./pages/Plans"));
const Companies = lazy(() => import("./pages/companies/Companies"));

function App() {
  const dp = useDispatch();
  const [load, setLoad] = useState(false);
  const { _id } = useSelector((e) => e.user);

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

  if (!_id) {
    return <Auth />;
  }

  return (
    <div className="flex items-start justify-center w-full h-[100vh]">
      {/* NAVBAR */}
      <Navbar />
      {/* CONTENT */}
      <div className="flex items-center justify-start flex-col w-full lg:w-4/5 xl:w-5/6 h-[100vh]">
        {/* TOP */}
        <Top />
        <Socket />
        {/* MAIN */}
        <div className="flex p-[10px] items-center justify-start flex-col w-full h-[90vh] overflow-y-scroll">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/companies">
                <Route path="" element={<Companies />} />
                <Route path="add" element={<CompanyAdd />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

export default App;
