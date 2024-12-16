
import { Routes, Route } from "react-router-dom";
//import SideBar from "./components/SideBar";
import COE from "./components/Employee/COE/COE";
import ITR2316 from "./components/Employee/ITR/ITR2316";
import LoginEmployee from "./components/Employee/LoginPage/LoginEmployee";
import HRsideBar from "./components/HRStaff/HRsideBar";
import HRITR2316 from "./components/HRStaff/ITR/HRITR2316";
import MonthPay from "./components/Employee/13thMonth/MonthPay";

import HRMonthPay from "./components/HRStaff/MonthPay/HRMonthPay";
import CF1 from "./components/Employee/CF1/CF1";
import HRCF1 from "./components/HRStaff/CF1/HRCF1";
import COC from "./components/Employee/COC/COC";
import HRCOC from "./components/HRStaff/COC/HRCOC";
import HRCOE from "./components/HRStaff/COE/HRCOE";
import Loader from "./components/Loader";
import Loader2nd from "./components/Loader2nd";
import Skeleton from "./components/Skeleton";


function App() {
  return (
    <Routes>
      {/* HR */}
      <Route path="/HR-ITR" element={<HRITR2316 />} />
      <Route path="/HR-13Month" element={<HRMonthPay />} />
      <Route path="/HR-CF1" element={<HRCF1 />} />
      <Route path="/HR-COC" element={<HRCOC />} />
      <Route path="/HR-COE" element={<HRCOE />} />
      {/* EMPLOYEE */}
      <Route path="/hr" element={<HRsideBar />} />
      <Route path="/" element={<LoginEmployee />} />
      <Route path="/login" element={<LoginEmployee />} />
      <Route path="/COE" element={<COE />} />
      <Route path="/CF1" element={<CF1 />} />
      <Route path="/COC" element={<COC />} />
      <Route path="/ITR" element={<ITR2316 />} />
      <Route path="/13Month" element={<MonthPay />} />
      <Route path="/Loader" element={<Loader />} />
      <Route path="/Loader2" element={<Loader2nd />} />
      <Route path="/Skeleton" element={<Skeleton />} />
    </Routes>
  );
}

export default App;
