
import { Routes, Route } from "react-router-dom";
//import SideBar from "./components/SideBar";
import COE from "./components/Employee/COE/COE";
import ITR2316 from "./components/Employee/ITR/ITR2316";
import LoginEmployee from "./components/Employee/LoginPage/LoginEmployee";
import HRsideBar from "./components/HRStaff/HRsideBar";
import HRITR2316 from "./components/HRStaff/ITR/HRITR2316";
import { AppSidebar } from "./components/HRStaff/AppSideBar";

function App() {
  return (
    <Routes>
      {/* HR */}
      <Route path="/HR-ITR" element={<HRITR2316 />} />
      <Route path="/APP" element={<AppSidebar />} />
      {/* EMPLOYEE */}
      <Route path="/hr" element={<HRsideBar />} />
      <Route path="/" element={<LoginEmployee />} />
      <Route path="/login" element={<LoginEmployee />} />
      <Route path="/COE" element={<COE />} />
      <Route path="/ITR" element={<ITR2316 />} />
    </Routes>
  );
}

export default App;
