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
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogOutCircle } from "react-icons/bi";
import { useRef } from 'react';

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
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet"

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover"
 

function SideBar() {
//   const decode = (data: string) => atob(data);
   const {empData, deleteEmpData} = useStore();
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
      <div className='bg-[]'>

      <Sheet>
      <SheetTrigger>
      <div className='w-8 h-8 fixed top-4 left-4 sm:hidden block z-30 hover:cursor-pointer hover:text-blue-600 hover:bg-gray-200 rounded-md'>
            <GiHamburgerMenu className='w-8 h-8 p-1'/>
         </div>
      </SheetTrigger>
      <SheetContent side={'left'} className='w-60 sm:hidden block'>
         <SheetHeader>
            <SheetTitle>
            <DropdownMenu>
                  <DropdownMenuTrigger>
                  <motion.div drag className='group flex hover:cursor-pointer'>
                        <img src={empData.picture_location} className="h-6 rounded-full me-2 sm:h-8" alt="logo" />
                        <div className=''>
                        <p className='font-bold text-xs group-hover:text-blue-600 group flex justify-start'>{empData.first_name} {empData.last_name}</p>
                        <p className='text-[0.7rem] font-bold text-gray-700 flex justify-start'>{empData.job_job_title}</p>
                        </div>
                     </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='mb-3 w-56 sm:block hidden bg-slate-200 z-50' align='center'>
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className='flex hover:cursor-pointer hover:bg-white z-50' onClick={() => openDialog()}>
                     < div className='flex hover:text-blue-600 '>
                           <BiLogOutCircle className='h-5 w-5 mt-0.5 me-2'/> 
                           <p className='text-sm'>Logout</p>
                           </div>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
            </SheetTitle>
            <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </SheetDescription>
            <ul>
               <li>
              
               </li>
               <li>
                  Request ITR
               </li>
               <li>
               Request COE
               </li>
               <li>
               Request COC 
               </li>
               <li>
               Request CF1
               </li>
               <li>
               Request 13th Month Pay
               </li>
            </ul>

         </SheetHeader>
      </SheetContent>
      </Sheet>
        
       
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

   <Popover>
  <PopoverTrigger>
  <motion.div drag className='group flex hover:cursor-pointer'>
      <img src={empData.picture_location} className="h-6 rounded-full me-2 sm:h-8" alt="logo" />
      <div className=' '>
        <p className='font-bold text-xs group-hover:text-blue-600 group flex justify-start text-justify pr-2'>{empData.first_name} {empData.last_name}</p>
        <p className='text-[0.7rem] font-bold text-gray-700 flex justify-start'>{empData.job_job_title}</p>
      </div>
    </motion.div>
  </PopoverTrigger>
  <PopoverContent className="relative w-56 mb-3 h-16  justify-center sm:block hidden bg-slate-200">
   <div className=' w-full h-9 mb-3'>
   <ul className='w-full'>
      <li className='flex justify-center p-1 rounded-sm hover:bg-gray-300 font-semibold text-gray-800 hover:text-blue-600 border border-gray-300 hover:cursor-pointer' onClick={() => openDialog()}>
         <div className='flex'>
         <BiLogOutCircle className='h-5 w-5 mt-0.5 me-2' /> 
         <p>Logout</p>
         </div>
      
      </li>
   </ul>
   </div>
  </PopoverContent>
</Popover>
    
    
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
