//import React from 'react'
// import COE from "./COE/COE"
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// import { CiSquareQuestion } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from './LoginPage/store';
import { GrDocumentText } from "react-icons/gr";
import { useState } from 'react';
// import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogOutCircle } from "react-icons/bi";
import { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios';
import { API_SERVER_URL } from '@/config';
// import { useQuery } from '@tanstack/react-query';

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
 } from "@/components/ui/drawer"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"

import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
//   DialogTrigger,
} from "@/components/ui/dialog"
 
interface RequestForClaim {
   request_type: string;
   time_: string;
}

function SideBar() {
//   const decode = (data: string) => atob(data);
   const {empData, deleteEmpData} = useStore();
   const [requestForClaim, setRequestForClaim] = useState<RequestForClaim[]>([]);

   const logout = async () => {
      await deleteEmpData();
      navigate("/login");
      // Optionally, you can add a notification or UI update here
  };

   const location = useLocation();
   const navigate = useNavigate();
   const [isOpen, setIsOpen] = useState(false);
   const [isOpenNotif, setIsOpenNotif] = useState(false);
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
        formdata.append("employee_name", empData.first_name+ " " +empData.last_name);
        formdata.append("emp_status", empData.status);
        formdata.append("id_no", empData.idno);
        const response = await axios.post(
          `${API_SERVER_URL}/Api/fetch_for_claim_ITR`,
          formdata
        );
      //   alert(response.data[0].r_date_for_claim);
        if(response.data.length > 0){
               const myObject = {
                  request_type: response.data[0].r_doc_type + ' for claim',
                  time_: response.data[0].r_date_for_claim,
               };
               // Check if the claim already exists
               const exists = requestForClaim.some(claim => claim.request_type === myObject.request_type);
               
               if (!exists) {
                  setRequestForClaim([myObject]);
               } else {
                  alert('Claim already exists!'); // Optional alert for user feedback
               }
         }
      //   return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw to allow react-query to handle the error
      }
    };
    const fetch_for_claim_COE = async () => {
      try {
        const formdata = new FormData();
        formdata.append("employee_name", empData.first_name+ " " +empData.last_name);
        formdata.append("emp_status", empData.status);
        formdata.append("id_no", empData.idno);
        const response = await axios.post(
          `${API_SERVER_URL}/Api/fetch_for_claim_COE`,
          formdata
        );
        console.log("DATA FROM COE: ", response.data)
      //   alert(response.data[0].r_date_for_claim);
        if(response.data.length > 0){
               const myObject = {
                  request_type: response.data[0].r_doc_type + ' for claim',
                  time_: response.data[0].r_date_for_claim,
               };
               // Check if the claim already exists
               const exists = requestForClaim.some(claim => claim.request_type === myObject.request_type);
               
               if (!exists) {
                  setRequestForClaim(prevData => [...prevData, myObject]);
               } else {
                  alert('Claim already exists!'); // Optional alert for user feedback
               }
         }
      //   return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw to allow react-query to handle the error
      }
    };
  
useEffect(() => {
   fetch_for_claim_ITR();
   fetch_for_claim_COE();
}, [])

  return (
    <>
    <div>
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              {/* You will be logged out of your account.
              Do you want to continue? */}
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDialog} className="h-8">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => logout()} className="h-8">Log out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
    <div>
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
         <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
         </DrawerHeader>
         <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose>
            {/* <Button variant="outline">Cancel</Button> */}
            </DrawerClose>
         </DrawerFooter>
      </DrawerContent>
      </Drawer>
    </div>
      <div className='bg-[]'>


        
       
{/* sidebar */}
<aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar"
   // style={{ fontFamily: "Nunito, sans-serif"}}
   style={{
      backgroundColor: 'white',
      // backgroundImage: 'linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)',

      // backgroundColor: '#0093E9',
      // backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
       fontFamily: "Nunito, sans-serif"
  }}
>
<div className="h-full px-3 py-7 overflow-y-auto  dark:bg-gray-800 border-r border-gray-200 pb-24">
      <motion.div drag className="flex items-center mb-5 mt-4 justify-center">
         <motion.span  className="self-center text-xl font-semibold whitespace-nowrap dark:text-white pt-1 z-20">Document Request </motion.span>
      </motion.div>
      <motion.ul  className="text-[0.87rem] font-medium mt-14 text-gray-900 " style={{ fontFamily: "Fredoka, sans-serif"}}>
        <li className="hover:cursor-pointer border-b border-gray-200" onClick={()=> navigate("/ITR")}>
            <div 
            className={`flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname == "/ITR" && "bg-gray-200 dark:bg-gray-700" }` }
            >
               <GrDocumentText className='w-4 h-4 pb-0.5' />
               <span className="flex-1 ms-1.5 whitespace-nowrap group-hover:text-blue-600">ITR/2316</span>
               {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
            </div>
         </li>
         <li className="hover:cursor-pointer border-b border-gray-200" onClick={()=> navigate("/COE")}>
            <div 
            className={`flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname == "/COE" && "bg-gray-200 dark:bg-gray-700" }` }
            >
               <GrDocumentText className='w-4 h-4 pb-0.5' />
               <span className=" ms-1.5 group-hover:text-blue-600">COE</span>
            </div>
         </li>
         <li className="hover:cursor-pointer border-b border-gray-200 ">
            <div className="flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <GrDocumentText className='w-4 h-4 pb-0.5' />
               <span className="ms-1.5 whitespace-nowrap group-hover:text-blue-600 ">Request COC</span>
               <span className=' ms-2 text-[0.7rem] rounded-full dark:bg-gray-700 dark:text-gray-300  bg-gray-300 pr-2 pl-2'>regular</span>
               {/* <span className="group-hover:text-blue-600 inline-flex items-center justify-center px-2 ms-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">(regular)</span> */}
            </div>
         </li>
         <li className="hover:cursor-pointer border-b border-gray-200">
            <div className="flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <GrDocumentText className='w-4 h-4 pb-0.5' />
               <span className="flex-1 ms-1.5 whitespace-nowrap group-hover:text-blue-600">CF1</span>
            </div>
         </li>
         <li className="hover:cursor-pointer border-b border-gray-200 ">
            <div 
            //className="flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            className={`flex items-center p-4 rounded-xs dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname == "/PAY" && "bg-gray-100 dark:bg-gray-700" }` }
            >
               <GrDocumentText className='w-4 h-4 pb-0.5' />
               <span className=" ms-1.5 group-hover:text-blue-600">13th Month Pay</span>
            </div>
         </li>
      </motion.ul>
   </div>
   <div className='w-full border border-gray-200 fixed bottom-0 pt-4 pb-4 pl-2 flex bg-white z-20' 
   // style={{ backgroundColor: '#74EBD5',}}
   >

   
   <Dialog open={isOpenNotif} onOpenChange={setIsOpenNotif}>
   <DialogContent className='w-1/2'>
      <DialogHeader>
         <DialogTitle>
         < div className='flex'>
            <div className='relative w-5 h-5 me-1'>
            <Bell className='w-5 h-5 absolute' />
            <div className='h-2 w-2 absolute -top-0.5 right-0 rounded-full bg-orange-600 animate-pulse'/>
            </div>
         <p className='text-sm'>Notification</p>
         </div>   
         </DialogTitle>
         <DialogDescription>
         {/* This action cannot be undone. This will permanently delete your account
         and remove your data from our servers. */}
         </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="account" className="w-full h-[500px] overflow-y-scroll">
      <div className="sticky -top-0.5 z-10 bg-white">
      <TabsList>
        <TabsTrigger value="account">For Claim</TabsTrigger>
        <TabsTrigger value="password">Rejected</TabsTrigger>
      </TabsList>
    </div>
      <TabsContent value="account">
      <ul className='w-full space-y-2 pt-2'>
            {requestForClaim.length > 0 ? (
               requestForClaim.map((claim, index) => (
               <li className='border-b border-gray-200 p-3 flex justify-between' key={index} > 
               <div className='flex group' onClick={() => { claim.request_type == "ITR for claim" && navigate("/ITR"); setIsOpenNotif(false);} }>
                     <GrDocumentText className='mt-0.5 me-1 group-hover:cursor-pointer'/> 
                     <p className='text-sm group-hover:cursor-pointer'>{claim.request_type}</p>
                  </div>
                  <div className='text-gray-400 text-xs'>
                  {claim.time_}
                  </div>
               </li>
               ))
            ):(
               <p>No request</p>
            )}
      </ul>
      </TabsContent>
      <TabsContent value="password">
          <ul className='w-full space-y-2 pt-2'>
            {requestForClaim.length > 0 ? (
               requestForClaim.map((claim, index) => (
               <li className=' border-gray-200 pl-3 pr-3 pt-1 flex justify-between' key={index}> 
                  <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="item-1">
                        <AccordionTrigger>ITR request</AccordionTrigger>
                        <AccordionContent className='w-full'>
                        Date: {claim.time_}
                        <div>
                           <p>HR Message:</p>
                           <p className='ms-4'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis dolores dolore ea delectus dignissimos repellat nam eligendi. Repellendus, vitae earum.</p>
                        </div>
                        </AccordionContent>
                     </AccordionItem>
                     </Accordion>
               </li>
               ))
            ):(
               <p>No request</p>
            )}
      </ul>
      </TabsContent>
      </Tabs>

   </DialogContent>
   </Dialog>

<DropdownMenu>
  <DropdownMenuTrigger>
   <div className='flex justify-between'>
   <motion.div drag className='group flex hover:cursor-pointer'>
      <img src={empData.picture_location} className="h-6 rounded-full me-2 sm:h-8" alt="logo" />
      <div className=''>
        <p className='font-bold text-xs group-hover:text-blue-600 group flex justify-start'>{empData.first_name} {empData.last_name}</p>
        <p className='text-[0.7rem] font-bold text-gray-700 flex justify-start'>{empData.job_job_title}</p>
      </div>
    </motion.div>
    <div className='relative w-4 h-5 ms-1'>
    <Bell className='w-4 h-5 absolute' />
    <div className='h-2 w-2 absolute -top-0.5 right-0 rounded-full bg-orange-600 animate-pulse'/>
    </div>
   </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='mb-3 w-56 sm:block hidden bg-slate-200' align='center'>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='flex hover:cursor-pointer hover:bg-white' onClick={() => setIsOpenNotif(true)}>
    < div className='flex hover:text-blue-600 '>
            <div className='relative w-4 h-5 me-2'>
            <Bell className='w-4 h-5 absolute' />
            <div className='h-2 w-2 absolute -top-0.5 right-0 rounded-full bg-orange-600 animate-pulse'/>
            </div>
         <p className='text-sm'>Notification</p>
      </div>
    </DropdownMenuItem>
    <DropdownMenuItem className='flex hover:cursor-pointer hover:bg-white ' onClick={() => openDialog()}>
    < div className='flex hover:text-blue-600 '>
         <BiLogOutCircle className='h-6 w-6 mt-0.5 me-2'/> 
         <p className='text-sm'>Logout</p>
         </div>
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

  )
}

export default SideBar
