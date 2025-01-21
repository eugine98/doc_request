//import React from 'react'
// import COE from "./COE/COE"
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// import { Sidebar } from '../ui/sidebar';
// import { Sidebar } from "@/components/ui/sidebar"
// import { CiSquareQuestion } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useStore from "../Employee/LoginPage/store";
// import { GrDocumentText } from "react-icons/gr";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogOutCircle } from "react-icons/bi";
import fpo2 from "../../assets/img/fpo2.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// import {
//    Popover,
//    PopoverContent,
//    PopoverTrigger,
//  } from "@/components/ui/popover"
import { NotebookPen } from "lucide-react";

function HRsideBar() {
  //   const decode = (data: string) => atob(data);
  useEffect(() => {
    // alert(typeof location.pathname)
    // alert(empData.idno)
  }, []);
  const { empData, deleteEmpData } = useStore();
  const logout = async () => {
    await deleteEmpData();
    navigate("/login");
    // Optionally, you can add a notification or UI update here
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  //    const logout = async () => {
  //     // if (Cookies.get("authCheckInventory")) {
  //     //   Cookies.remove("authCheckInventory", {
  //     //     domain: window.location.hostname,
  //     //   });
  //     // }

  //     navigate("/login");

  //   };
  return (
    <>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {/* You will be logged out of your account.
              Do you want to continue? */}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDialog} className="h-8">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => logout()} className="h-8">
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="">
        <div className="w-8 h-8 fixed top-4 left-4 sm:hidden block z-30 hover:cursor-pointer hover:text-blue-600 hover:bg-gray-200 rounded-md">
          <GiHamburgerMenu className="w-8 h-8 p-1" />
        </div>

        {/* sidebar */}
        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 sm:w-52 w-16 h-screen transition-transform -translate-x-0 sm:translate-x-0"
          aria-label="Sidebar"
          // style={{ fontFamily: "Nunito, sans-serif"}}
          style={{
            // backgroundColor: '#0093E9',
            // backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
            // background: 'rgb(0, 127, 255)', // Fallback background color (solid blue)
            // backgroundImage: 'linear-gradient(0deg, rgba(0, 127, 255, 1) 25%, rgba(137, 207, 240, 1) 100%)' // Gradient from blue to light blue
            // background: 'rgb(150, 0, 24)', // Fallback background color (dark red)
            // backgroundImage: 'linear-gradient(0deg, rgba(150, 0, 24, 1) 25%, rgba(255, 8, 0, 1) 100%)' // Gradient from dark red to
            background:
              "linear-gradient(0deg, rgba(0,34,68,1) 25%, rgba(0,70,135,1) 100%)",
          }}
        >
          <div className="h-full px-2 py-2 overflow-y-auto  dark:bg-gray-800 ">
            <motion.div
              className="flex flex-col rounded-sm pb-2 bg-slate-200"
              style={{
                boxShadow:
                  "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
              }}
            >
              <div className="flex justify-center">
                <img
                  // src="src\assets\img\fpo2.png"
                  src={fpo2}
                  className=" pt-2"
                  alt="Logo"
                />
              </div>
              <motion.p
                className="self-center font-semibold whitespace-nowrap dark:text-white z-20 text-[0.7rem] text-gray-800  hidden sm:block pt-1.5 pb-0.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Document Request
              </motion.p>
            </motion.div>
            <motion.ul
              className=" text-[0.65rem] sm:text-xs text-gray-900 mt-4"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem]"
                onClick={() => navigate("/HR-ITR")}
              >
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/HR-ITR"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/HR-ITR" ? 3 : undefined
                    }
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="flex-1 sm:ms-1.5 whitespace-nowrap ">
                    ITR
                  </span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem] "
                onClick={() => navigate("/HR-COE")}
              >
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/HR-COE"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/HR-COE" ? 3 : undefined
                    }
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className=" sm:ms-1.5 ">COE</span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem] "
                onClick={() => navigate("/HR-COC")}
              >
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/HR-COC"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/HR-COC" ? 3 : undefined
                    }
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="sm:ms-1.5 whitespace-nowrap  mr-5">COC</span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem] "
                onClick={() => navigate("/HR-CF1")}
              >
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/HR-CF1"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/HR-CF1" ? 3 : undefined
                    }
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="flex-1 sm:ms-1.5 whitespace-nowrap ">
                    CF1
                  </span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem]  "
                onClick={() => navigate("/HR-13Month")}
              >
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/HR-13Month"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/HR-13Month" ? 3 : undefined
                    }
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className=" sm:ms-1.5 ">
                    13
                    <span className="inline-block align-text-top text-[0.55rem]">
                      th
                    </span>{" "}
                    Month Pay
                  </span>
                </div>
              </li>
            </motion.ul>
          </div>
          <div className="w-full fixed bottom-0 pt-1 pb-4 pl-2 flex z-20 shadow-lg border-t border-blue-950 bg-[#082444]">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex w-full ">
                  <motion.div className="group flex hover:cursor-pointer mt-3">
                    <img
                      src={empData.picture_location}
                      className="h-8 ms-1.5 sm:ms-0 rounded-full me-2 "
                      alt="logo"
                    />
                    <div className="mt-1 hidden sm:block">
                      <p className="font-bold text-[0.60rem]  group flex justify-start text-gray-400">
                        {empData.first_name} {empData.last_name}
                      </p>
                      <p className="text-[0.50rem] font-bold text-gray-500 flex justify-start">
                        {empData.job_job_title}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="center">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:cursor-pointer "
                  onClick={() => openDialog()}
                >
                  <BiLogOutCircle />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      </div>
    </>
  );
}

export default HRsideBar;
