import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useStore from "./LoginPage/store";
import { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { API_SERVER_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import fpo2 from "../../assets/img/fpo2.png";

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
//    Drawer,
//    DrawerClose,
//    DrawerContent,
//    DrawerDescription,
//    DrawerFooter,
//    DrawerHeader,
//    DrawerTitle,
//    DrawerTrigger,
//  } from "@/components/ui/drawer"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, NotebookPen, SearchX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InterfaceForClaim {
  id: string;
  id_no: string;
  employee_name: string;
  doc_type: string;
  date_requested: string;
  date_approved: string;
  date_for_claim: string;
  date_rejected: string;
  reason_for_reject: string;
  status: string;
  archive: string;
}

function SideBar() {
  //const decode = (data: string) => atob(data);
  const { empData, deleteEmpData } = useStore();
  const [hasNotif, setHasNotif] = useState(false);

  const logout = async () => {
    await deleteEmpData();
    navigate("/login");
    // Optionally, you can add a notification or UI update here
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const openNotifDialog = () => {
    refetch_docs_for_claim();
    refetch_docs_for_claim();
    setIsOpenNotif(true);
  };
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  //AUTOMATIC LOG OUT AFTER INACTIVE
  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };
    // Attach event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);

    // Start the timer when the component mounts
    resetTimer();

    // Cleanup event listeners and timer when the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, []);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      await deleteEmpData();
      navigate("/login");
    }, 1800000);
  };
  const fetch_for_claim_ITR = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        "employee_name",
        empData.first_name + " " + empData.last_name
      );
      formdata.append("emp_status", empData.status);
      formdata.append("id_no", empData.idno);
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_for_claim_ITR`,
        formdata
      );
      // console.log("EMP DATA", empData.idno)
      // console.log("DATA FOR CLAIM: ", response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };

  const {
    data: docs_for_claim,
    isLoading: docs_for_claim_is_loading,
    refetch: refetch_docs_for_claim,
  } = useQuery({
    queryKey: ["docs_for_claim"],
    queryFn: () => fetch_for_claim_ITR(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3,
    // refetchInterval: 1500
    // refetchIntervalInBackground: true,
  });

  const fetch_claimed_ITR = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        "employee_name",
        empData.first_name + " " + empData.last_name
      );
      formdata.append("emp_status", empData.status);
      formdata.append("id_no", empData.idno);
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_claimed_ITR`,
        formdata
      );
      // console.log("EMP DATA", empData.idno);
      // console.log("DATA FOR CLAIM: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };

  const {
    data: docs_claimed,
    isLoading: docs_claimed_is_loading,
    refetch: refetch_docs_claimed,
  } = useQuery({
    queryKey: ["docs_for_claim"],
    queryFn: () => fetch_claimed_ITR(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3,
    // refetchInterval: 1500
    // refetchIntervalInBackground: true,
  });

  const fetch_rejected_ITR = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        "employee_name",
        empData.first_name + " " + empData.last_name
      );
      formdata.append("emp_status", empData.status);
      formdata.append("id_no", empData.idno);
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_rejected_ITR`,
        formdata
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };

  const {
    data: docs_rejected,
    isLoading: docs_rejected_is_loading,
    refetch: refetch_docs_rejected,
  } = useQuery({
    queryKey: ["docs_rejected"],
    queryFn: () => fetch_rejected_ITR(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3,
    // refetchInterval: 2500,
    // refetchIntervalInBackground: true,
  });

  const remove_notif = async (id: string) => {
    try {
      const formdata = new FormData();
      formdata.append("id", id);
      const response = await axios.post(
        `${API_SERVER_URL}/Api/remove_notif`,
        formdata
      );
      if (response.data.msg == "updated") {
        // toast.success('', {
        //    className: 'my-classname',
        //    description: '',
        //    duration: 2000,
        //    icon: <MdErrorOutline className="h-5 w-5" />,
        // });
        refetch_docs_rejected();
        refetch_docs_for_claim();
      }

      //  alert(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };

  useEffect(() => {
    fetch_rejected_ITR();
    fetch_for_claim_ITR();
    refetch_docs_for_claim();
    refetch_docs_rejected();
  }, []);

  useEffect(() => {
    refetch_docs_for_claim();
    refetch_docs_rejected();
  }, [hasNotif]);

  useEffect(() => {
    // Ensure docs_rejected and docs_for_claim are arrays before checking length
    if (
      (Array.isArray(docs_rejected) && docs_rejected.length > 0) ||
      (Array.isArray(docs_for_claim) && docs_for_claim.length > 0)
    ) {
      setHasNotif(true);
    } else {
      setHasNotif(false); // Optionally reset the state if there's no notification
    }
  }, [docs_rejected, docs_for_claim]);

  return (
    <>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="w-[29rem]">
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

      <div className="bg-[]">
        {/* sidebar */}
        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 sm:w-52 w-16 h-screen transition-transform -translate-x-0 sm:translate-x-0"
          aria-label="Sidebar"
          // style={{ fontFamily: "Nunito, sans-serif"}}
          style={{
            background:
              "linear-gradient(0deg, rgba(0,34,68,1) 25%, rgba(0,70,135,1) 100%)",
          }}
        >
          <div className="h-full px-2 py-1.5 overflow-y-auto  dark:bg-gray-800 ">
            <motion.div
              className="flex flex-col rounded-sm sm:pb-2 bg-slate-200"
              style={{
                boxShadow:
                  "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
              }}
            >
              <div className="flex justify-center">
                <img
                  // src="src\assets\img\fpo2.png"
                  src={fpo2}
                  className=" sm:pt-2 p-0.5"
                  alt="Logo"
                />
              </div>
              <motion.p
                className="self-center font-semibold whitespace-nowrap hidden sm:block dark:text-white z-20 text-[0.8rem] text-gray-800 pt-1.5 pb-0.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Document Request
              </motion.p>
            </motion.div>
            <motion.ul
              className="text-[0.65rem] sm:text-xs  text-gray-900 sm:mt-4 mt-7"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.04rem]  sm:border-none"
                onClick={() => navigate("/ITR")}
              >
                <div
                  className={`flex items-center sm:p-2 p-2 sm:rounded-md rounded-sm hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/ITR"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={location.pathname === "/ITR" ? 3 : undefined}
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="flex-1 sm:ms-1.5 whitespace-nowrap ">
                    ITR
                  </span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem]  sm:border-none"
                onClick={() => navigate("/COE")}
              >
                <div
                  className={`flex items-center sm:p-2 p-2 sm:rounded-md rounded-sm hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/COE"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={location.pathname === "/COE" ? 3 : undefined}
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className=" sm:ms-1.5 ">COE</span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.04rem]  sm:border-none"
                onClick={() => navigate("/COC")}
              >
                <div
                  className={`flex items-center sm:p-2 p-2 sm:rounded-md rounded-sm hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/COC"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={location.pathname === "/COC" ? 3 : undefined}
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="sm:ms-1.5 whitespace-nowrap mr-5">COC</span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem]  sm:border-none"
                onClick={() => navigate("/CF1")}
              >
                <div
                  className={`flex items-center sm:p-2 p-2 sm:rounded-md rounded-sm hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/CF1"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={location.pathname === "/CF1" ? 3 : undefined}
                    className="w-4 h-4 pb-0.5 hidden sm:block"
                  />
                  <span className="flex-1 sm:ms-1.5 whitespace-nowrap ">
                    CF1
                  </span>
                </div>
              </li>
              <li
                className="hover:cursor-pointer pt-[0.03rem] pb-[0.03rem] "
                onClick={() => navigate("/13Month")}
              >
                <div
                  className={`flex items-center sm:p-2 p-2 sm:rounded-md rounded-sm hover:bg-slate-200 hover:shadow-sm group hover:text-black ${
                    location.pathname == "/13Month"
                      ? "bg-gray-200 shadow-md font-semibold text-gray-950"
                      : "text-white"
                  }`}
                >
                  <NotebookPen
                    strokeWidth={
                      location.pathname === "/13Month" ? 3 : undefined
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
            <Dialog open={isOpenNotif} onOpenChange={setIsOpenNotif}>
              <DialogContent className="w-3/4 rounded-md">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex">
                      <div className="relative w-5 h-5 me-1">
                        <Bell className="w-5 h-5 absolute" />
                        {hasNotif && (
                          <div className="h-2 w-2 absolute -top-0.5 right-0 rounded-full bg-orange-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm">Notification</p>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    {/* This action cannot be undone. This will permanently delete your account
         and remove your data from our servers. */}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full h-[500px]">
                  <div className="sticky -top-0.5 z-10 bg-white">
                    <TabsList className="w-full flex justify-start">
                      <TabsTrigger
                        value="account"
                        className="w-1/4 flex justify-start text-[0.7rem] sm:text-xs"
                        onClick={() => {
                          refetch_docs_for_claim();
                        }}
                      >
                        For Claim
                      </TabsTrigger>
                      <TabsTrigger
                        value="password"
                        className="w-1/4 flex justify-start text-[0.7rem] sm:text-xs"
                        onClick={() => refetch_docs_rejected()}
                      >
                        Rejected
                      </TabsTrigger>
                      <TabsTrigger
                        value="test"
                        className="w-1/4 flex justify-start text-[0.7rem] sm:text-xs"
                        onClick={() => {
                          refetch_docs_claimed();
                        }}
                      >
                        History
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="account">
                    <ScrollArea>
                      <ul
                        className="w-full space-y-2 pt-2 h-[450px]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {!docs_for_claim_is_loading ? (
                          docs_for_claim.length > 0 ? (
                            docs_for_claim.map((doc: InterfaceForClaim) => (
                              <li
                                className="  p-2 group hover:shadow-md"
                                onClick={() => {
                                  if (doc.doc_type === "ITR") {
                                    navigate("/ITR");
                                  } else if (
                                    doc.doc_type === "13th Month Pay"
                                  ) {
                                    navigate("/13Month");
                                  } else if (doc.doc_type === "COC") {
                                    navigate("/COC");
                                  } else if (doc.doc_type === "COE") {
                                    navigate("/COE");
                                  } else if (doc.doc_type === "CF1") {
                                    navigate("/CF1");
                                  }
                                  setIsOpenNotif(false);
                                }}
                                key={doc.id}
                              >
                                <div className="flex justify-between group-hover:cursor-pointer">
                                  <div className="flex ">
                                    <Bell className=" h-7 w-7 rounded-full border border-gray-600 p-1 text-gray-700 me-1 " />
                                    <div className="w-fit mt-1 ">
                                      <p className="text-[0.65rem] sm:text-xs">
                                        {doc.doc_type}{" "}
                                        <span className="text-gray-500">
                                          {" "}
                                          - Claim and sign the receiving copy.
                                        </span>{" "}
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                        {" "}
                                        {doc.date_for_claim}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-[400px] ">
                              <div className="text-xl">
                                <div className="flex justify-center">
                                  <SearchX className=" w-7 h-7 mb-1" />
                                </div>
                                <p className="text-sm">No results found!</p>
                              </div>
                            </div>
                          )
                        ) : (
                          <p>LOADING....</p>
                        )}
                      </ul>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="password">
                    <ScrollArea className="pr-5">
                      <ul
                        className="w-full space-y-2 pt-2 h-[450px]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {!docs_rejected_is_loading ? (
                          docs_rejected.length > 0 ? (
                            docs_rejected.map((doc: InterfaceForClaim) => (
                              <li
                                className="  p-2 hover:shadow-xl hover:bg-gray-50"
                                key={doc.id}
                              >
                                <div className="flex justify-between">
                                  <div className="flex">
                                    <Bell className=" h-7 w-7 rounded-full border border-gray-600 p-1 text-gray-700 me-1" />
                                    <div className="w-fit mt-1">
                                      <p className="text-[0.65rem] sm:text-xs">
                                        {doc.doc_type} request{" "}
                                        <span className="text-[0.65rem] sm:text-xs text-gray-500">
                                          {" "}
                                          Got rejected!
                                        </span>{" "}
                                      </p>
                                      <p className="text-gray-500 text-[0.63rem]">
                                        {doc.date_rejected}
                                      </p>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger>
                                      <p className="font-black me-2 text-xs hover:cursor-pointer text-gray-600 -mt-8 hover:text-gray-500">
                                        ...
                                      </p>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" -mt-7">
                                      <DropdownMenuItem
                                        className="hover:cursor-pointer text-[11px]"
                                        onClick={() => remove_notif(doc.id)}
                                      >
                                        Remove Notification
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className=" ms-11 col-span-2 border border-gray-200 rounded-md mt-1 h-fit flex justify-start">
                                  <p className="text-[0.7rem] p-0.5 min-h-10 ms-1">
                                    from HR : <br /> {doc.reason_for_reject}
                                  </p>
                                </div>
                              </li>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-[400px] ml-5">
                              <div className="text-xl">
                                <div className="flex justify-center">
                                  <SearchX className=" w-7 h-7 mb-1" />
                                </div>
                                <p className="text-sm">No results found!</p>
                              </div>
                            </div>
                          )
                        ) : (
                          <p>LOADING....</p>
                        )}
                      </ul>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="test">
                    <ScrollArea>
                      <ul
                        className="w-full space-y-2 pt-2 h-[450px]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {!docs_claimed_is_loading ? (
                          docs_claimed.length > 0 ? (
                            docs_claimed.map((doc: InterfaceForClaim) => (
                              <li className="  p-2 group hover:shadow-md">
                                <div className="flex justify-between">
                                  <div className="flex">
                                    <Bell className=" h-7 w-7 rounded-full border border-gray-600 p-1 text-gray-700 me-1 " />
                                    <div className="w-fit mt-1">
                                      <p className="text-[0.65rem] sm:text-xs">
                                        {doc.doc_type}{" "}
                                        <span className="text-gray-500">
                                          Claimed!
                                        </span>{" "}
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                        {" "}
                                        {doc.date_for_claim}
                                      </p>
                                    </div>
                                  </div>
                                  {/* <DropdownMenu>
                              <DropdownMenuTrigger>
                                    <p className='font-black text-xs hover:cursor-pointer text-gray-600 -mt-8 hover:text-gray-500 mr-7'>...</p>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className=' -mt-7'>
                                 <DropdownMenuItem className='hover:cursor-pointer text-[11px]' onClick={() => remove_notif(doc.id)}>Remove Notification</DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu> */}
                                </div>
                              </li>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-[400px] ">
                              <div className="text-xl">
                                <div className="flex justify-center">
                                  <SearchX className=" w-7 h-7 mb-1" />
                                </div>
                                <p className="text-sm">No results found!</p>
                              </div>
                            </div>
                          )
                        ) : (
                          <p>LOADING....</p>
                        )}
                      </ul>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

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
                  onClick={() => openNotifDialog()}
                >
                  <Bell />
                  <span>Notification</span>
                </DropdownMenuItem>
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

        {/* content */}
        {/* <div className="p-4 sm:ml-64">
   <div className="p-4 border-2 border-red-700 border-dashed rounded-sm dark:border-gray-700 mt-14">
      <COE />
   </div>
</div> */}
      </div>
    </>
  );
}

export default SideBar;
