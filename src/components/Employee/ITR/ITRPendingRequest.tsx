import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_SERVER_URL } from '@/config';
import useStore from '../LoginPage/store';
import { useQuery } from '@tanstack/react-query';
// import { CiCircleCheck } from "react-icons/ci";
import { CircleCheck, Pencil, Save, SearchX, Trash2 } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { CircleEllipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
// import { motion } from 'framer-motion';

function ITRPendingRequest() {
    const {empData} = useStore();
//FETCH PENDING
const fetch_pending_itr = async () => {
    // console.log("HI: ", empData.idno, empData.first_name, empData.last_name);
    try {
        const formdata = new FormData();
        formdata.append("id", empData.idno);
        formdata.append("emp_status", empData.status);
        formdata.append("employee_name", `${empData.first_name} ${empData.last_name}`);
        const response = await axios.post(`${API_SERVER_URL}/Api/fetch_pending_itr`, formdata);
        const data = JSON.parse(response.data); // Parse the JSON string into an object
        console.log("THIS IS PENDING REQUEST", data); // Now this will be "object"
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Important to throw error to catch it in onError
    }
};
/////////////////////////////////
//USEEFFECT//
useEffect(() => {
    fetch_pending_itr();
    refetchPendingRequest();
}, [])
///////////////////////////////
//USEQUERY
const { data : pendingRequest, isLoading,  refetch : refetchPendingRequest } = useQuery ({
    queryKey: ['pendingCount'],
    queryFn: () => fetch_pending_itr(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 10 * 60 * 1000,
  });

  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete?</AlertDialogTitle>
              <AlertDialogDescription>
                Lorem ipsum dolor sit amet.
              </AlertDialogDescription>
            </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel  className="h-8">No</AlertDialogCancel>
                <AlertDialogAction  className="h-8">Yes</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
     <div className="flex items-center justify-center w-full bg-white dark:bg-gray-800">
        {!isLoading && pendingRequest.code == 1 ? (
        <div className='w-full md:flex md:justify-between lg:pl-10 lg:pr-10'>
            <div className='relative md:w-1/2 w-full'>
                <div className='w-full absolute flex justify-end pr-5'>
                <div className='fixed top-40 flex'>
                <button className={` h-7 w-16 mt-2 mr-2 rounded-sm bg-blue-600 flex justify-center text-white ${!editMode && 'hidden'}`} onClick={() => setEditMode(false)}>
                <Save size={15} className='mt-1.5 me-0.5 -ms-0.5' />
                  <span className='mt-1 text-sm'>Save</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                          <p className={`text-2xl font-medium cursor-pointer mb-2 ${editMode && ''}`}>...</p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='-mt-1'>
                  <DropdownMenuItem onClick={() => setEditMode(true)}>
                    <Pencil />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='hover:cursor-pointer' onClick={() => setIsOpen(true)}>
                    <Trash2 />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
       
                </div>
                </div>
                 <form className="w-full p-5 space-y-4 bg-white rounded shadow-md text-gray-700 text-xs font-medium " 
                style={{fontFamily: "Poppins, sans-serif"}}
             >
                <div>
                <div className='flex justify-between'>
                    <label htmlFor="date_requested" className="block">Date Requested:</label>
                </div>
                <input
                  disabled 
                    type="date" 
                    id="date_requested" 
                    className='mt-1 block w-full border rounded-md p-2'
                    value={pendingRequest.data.r_date_requested}
                   
                />
                </div>

                <div>
                  <div className='flex justify-between'>
                    <label htmlFor="employee-name" className="block">Employee Name:</label>
                  </div>
                    <input 
                      disabled type="text" id="employee_name" 
                      className='mt-1 block w-full border rounded-md  p-2' 
                      value={pendingRequest.data.i_employee_name}
                    />
                </div>


                {pendingRequest.data.i_emp_status == 'active' && (
                <div>
                    <div className='flex justify-between'>
                        <label htmlFor="department" className="block">Department/Project:</label>
                    </div>
                        <input 
                        disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                        value={pendingRequest.data.i_department}
                        />
                    </div>
                )}
                
              
                {pendingRequest.data.i_emp_status == 'active' && (
                <div>
                    <label htmlFor="designation" className="block">Designation:</label>
                    <input 
                      disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.i_designation}
                    />
                </div>
                )}
               
                <div>
                    <label htmlFor="status" className="block">Staus:</label>
                    <input 
                      disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.i_emp_status}
                    />
                </div>
                
              
                {pendingRequest.data.i_emp_status == 'active' ? ( 
                    <div>
                      <label htmlFor="date_hired" className="block">Date Hired:</label>
                      <input 
                        disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                        value={pendingRequest.data.i_date_hired}
                      />
                    </div>
                  ):(
                    <div>
                      <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                       <input 
                        disabled type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                        value={pendingRequest.data.i_date_resigned}
                      />
                    </div>
                  )}
                    
                    {/* <div>
                      <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                       <input 
                        disabled type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                   
                      />
                  </div> */}
             

                <div>
                      <label htmlFor="itr_year" className="block">2316 / ITR for the year:</label>
                      <input 
                        disabled type="text" id="itr_year" className='mt-1 block w-full border rounded-md p-2' 
                        value={pendingRequest.data.i_itr_year}
                      />
                    </div>

              <div>
                  <label htmlFor="reason_request" className="block">Reason of Request:</label>
                  <textarea id="reason_request" className='mt-1 block w-full border rounded-md p-2 h-14 ' disabled
                    
                  >{pendingRequest.data.i_reason_request}</textarea>
              </div>
              
            </form>
            </div>
            
            <div className='relative md:ms-12 md:w-1/2 w-full pt-5 '>
                <div className='absolute full pt-5 '>
                    <div className=' md:fixed md:top-40'>
                        <ul className='flex ms-6 mb-10 space-x-8 text-xs'>
                            <li className='flex'><p>Undone</p><CircleX className='ms-1 h-4 w-4 text-red-600'/></li>
                            <li className='flex'><p>Ongoing</p> <CircleEllipsis className='ms-1 h-4 w-4 text-blue-600' /></li>
                            <li className='flex'><p>Done</p><CircleCheck className='ms-1 h-4 w-4 text-green-600'/></li>
                        </ul>
                    <ol className="relative text-gray-500 border-s border-gray-100 dark:border-gray-700 dark:text-gray-400 w-full">    
                        {/*1st step*/}
                        <li className="mb-10 ms-6">    
                            {pendingRequest.data.i_req_status == 0 || pendingRequest.data.i_req_status == 1 ? (
                                <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            ): 
                            pendingRequest.data.i_req_status > 1 && (
                                <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            )}    
                            <p className="font-medium leading-tight text-sm">Hr Staff</p>
                            <p className="text-sm">Validate form/HR Manager signing</p>
                        </li>
                        {/*2nd step*/}
                        <li className="mb-10 ms-6">

                            {pendingRequest.data.i_req_status <= 1 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.i_req_status > 4 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )}
                            <p className="font-medium leading-tight text-sm">Accounting Staff
                            </p>
                            <p className="text-sm">Processing of ITR/2316/Accounting Manager signing</p>
                        </li>
                        {/*3rd step*/}
                        <li className="mb-10 ms-6">
                        {pendingRequest.data.i_req_status <= 5 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.i_req_status > 6 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )} 
                            <p className="font-medium leading-tight text-sm">For Claim</p>
                            <p className="text-sm">Claim your Document at HR Office</p>
                        </li>
                        {/*4th step*/}
                        <li className="ms-6">
                            {pendingRequest.data.i_req_status <= 6 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.i_req_status > 6 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )}
                            <p className="font-medium leading-tight text-sm">Claimed</p>
                            <p className="text-sm">Step details here</p>
                        </li>
                    </ol>
                    </div>
                </div>
            </div>
     
            {/* <p>{JSON.stringify(pendingRequest.data.i_id_no)}</p> */}
        </div>
        ):(
        <div className="text-xl mt-40">
            <div className="flex justify-center">
               <SearchX className=" w-7 h-7 mb-1"/>
            </div>
            <p className='text-sm'>No results found!</p>
         </div>
        )}
    </div>
    </>
   

  )
}

export default ITRPendingRequest
