import { BadgeCheck, CircleCheck, CircleEllipsis, CircleX, Ellipsis, Pencil, SearchX, Trash2, Trash2Icon, TriangleAlert, X } from 'lucide-react'
//import React from 'react'
import axios from 'axios';
import { API_SERVER_URL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import useStore from '../LoginPage/store';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRef } from 'react';


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
import SkeletonComp from '@/components/Skeleton';

function MonthPayPending() {
  const {empData} = useStore();
  const [showLoader, setShowLoader] = useState(false)
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const dateResignedRef = useRef<HTMLInputElement>(null);
  const TMYearRef = useRef<HTMLSelectElement>(null);
  const [exitWsaving, setExitWsaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [edit13thMonthYear, setEdit13thMonthYear] = useState("");
  const [editDateResigned, seteditDateResigned] = useState("");


  //FETCH PENDING
const fetch_pending_thirteen = async () => {
  // console.log("HI: ", empData.idno, empData.first_name, empData.last_name);
  try {
      const formdata = new FormData();
      formdata.append("id", empData.idno);
      formdata.append("emp_status", empData.status);
      formdata.append("employee_name", `${empData.first_name} ${empData.last_name}`);
      const response = await axios.post(`${API_SERVER_URL}/Api/fetch_pending_thirteen`, formdata);
      const data = JSON.parse(response.data); // Parse the JSON string into an object
      console.log("THIS IS PENDING REQUEST", data); // Now this will be "object"
      // if(response.data.length > 0){
      //   const myObject = {
      //     status: pendingRequest.data.tm,
      //     date_resigned: "", 
      //     thirteen_month_year: "", 
      //     reason_request: "",
      //   };
      // setPrevEmpReq(myObject);
      // }
      setShowLoader(false)
      return data;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Important to throw error to catch it in onError
  }
};
  const { data : pendingRequest, isLoading,  refetch : refetchPendingRequest } = useQuery ({
    queryKey: ['pendingThirteenMonthCount'],
    queryFn: () => fetch_pending_thirteen(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 10 * 60 * 1000,
  });
  useEffect(() => {
    fetch_pending_thirteen();
  }, [])
  useEffect(() => {
    setShowLoader(true)
    fetch_pending_thirteen();
    refetchPendingRequest();
  }, [pendingRequest, isLoading])

  const openEdit = () => {
    if( pendingRequest.data.tm_req_status > 0 ){
      toast.warning('', {
        className: 'my-classname',
        description: <div className="font-semibold">Action invalid: form already validated.</div>,
        duration: 2500,
        icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
    });
    }else{
      setEdit13thMonthYear(pendingRequest.data.tm_thirteen_month_year)
      seteditDateResigned(pendingRequest.data.tm_date_resigned)
      setEditMode(true);
    }
  }
  const closeEdit = () => {
    if(pendingRequest.data.tm_thirteen_month_year != edit13thMonthYear || pendingRequest.data.tm_date_resigned != editDateResigned){
      setExitWsaving(true);
    }else{
      // setEdit13thMonthYear(pendingRequest.data.tm_thirteen_month_year)
      // seteditDateResigned(pendingRequest.data.tm_date_resigned)
      // if (reasonRef.current) reasonRef.current.value = pendingRequest.data.tm_reason_request;
      // if (dateResignedRef.current) dateResignedRef.current.value = pendingRequest.data.tm_date_resigned;
      // if (TMYearRef.current) TMYearRef.current.value = pendingRequest.data.tm_thirteen_month_year;
      // setEditMode(false)
      confirmExitWsaving()
    }
  }
  const confirmExitWsaving = () => {
      setEdit13thMonthYear(pendingRequest.data.tm_thirteen_month_year)
      seteditDateResigned(pendingRequest.data.tm_date_resigned)
      if (reasonRef.current) reasonRef.current.value = pendingRequest.data.tm_reason_request;
      if (dateResignedRef.current) dateResignedRef.current.value = pendingRequest.data.tm_date_resigned;
      if (TMYearRef.current) TMYearRef.current.value = pendingRequest.data.tm_thirteen_month_year;
      setEditMode(false)
  }

  const save_Changes = async () => {
    try {
      const formdata = new FormData();
      formdata.append("id", pendingRequest.data.tm_id);
      formdata.append("date_resigned", editDateResigned);
      formdata.append("thirteen_month_year", edit13thMonthYear);
      await axios.post(`${API_SERVER_URL}/Api/update_tm_req`, formdata);
      fetch_pending_thirteen();
      refetchPendingRequest();
      toast.success('', {
        className: 'my-classname',
        description: <div className="font-semibold">Changes saved!</div>,
        duration: 2500,
        icon: <BadgeCheck className="h-5 w-5 mt-0.5" />,
      });
      setEditMode(false)
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Important to throw error to catch it in onError
    }
  }
  const savingChangesValidation = () => {
    if(pendingRequest.data.tm_emp_status == 'active'){
      if(pendingRequest.data.tm_thirteen_month_year != edit13thMonthYear){
        setConfirmChanges(true)
      }else{
        toast.warning('', {
          className: 'my-classname',
          description: <div className="font-semibold">No changes were made!</div>,
          duration: 2500,
          icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
      });
        setEditMode(false)
      }
    }else{
      if(pendingRequest.data.tm_thirteen_month_year != edit13thMonthYear || pendingRequest.data.tm_date_resigned != editDateResigned){
        setConfirmChanges(true)
      }else{
        toast.warning('', {
          className: 'my-classname',
          description: <div className="font-semibold">No changes were made!</div>,
          duration: 2500,
          icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
      });
        setEditMode(false)
      }
    }
  }
  const openDelete = () => {
    if( pendingRequest.data.tm_req_status > 0 ){
      toast.warning('', {
        className: 'my-classname',
        description: <div className="font-semibold">Action invalid: form already validated.</div>,
        duration: 2500,
        icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
    });
    }else{
      setIsOpen(true);
    }
  }
  const confirmDelete = async () => {
    try {
      const formdata = new FormData();
      formdata.append("id", pendingRequest.data.tm_id);
      formdata.append("req_id", pendingRequest.data.tm_req_id);
      await axios.post(`${API_SERVER_URL}/Api/delete_tm_req`, formdata);
      fetch_pending_thirteen();
      refetchPendingRequest();
      toast.success('', {
        className: 'my-classname',
        description: <div className="font-semibold">Deleted</div>,
        duration: 2500,
        icon: <Trash2Icon className="h-5 w-5 mt-0.5" />,
    });
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Important to throw error to catch it in onError
    }
    
  }

  const [isOpen, setIsOpen] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => (2000 + i).toString());
  return (
  <>
        <>
        {showLoader && (
          <SkeletonComp  />
        )}
      </>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className='w-96'>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this request?</AlertDialogTitle>
              <AlertDialogDescription>
                {/* Delete this request */}
              </AlertDialogDescription>
            </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel  className="h-8">No</AlertDialogCancel>
                <AlertDialogAction onClick={() => confirmDelete()} className="h-8">Yes</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <AlertDialog open={confirmChanges} onOpenChange={setConfirmChanges}>
          <AlertDialogContent className='w-96'>
            <AlertDialogHeader>
              <AlertDialogTitle>Save changes?</AlertDialogTitle>
              <AlertDialogDescription>
                {/* Delete this request */}
              </AlertDialogDescription>
            </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel  className="h-8">No</AlertDialogCancel>
                <AlertDialogAction onClick={() => save_Changes()}  className="h-8">Yes</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <AlertDialog open={exitWsaving} onOpenChange={setExitWsaving}>
          <AlertDialogContent className='w-96'>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit without saving?</AlertDialogTitle>
              <AlertDialogDescription>
                {/* Delete this request */}
              </AlertDialogDescription>
            </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel  className="h-8">No</AlertDialogCancel>
                <AlertDialogAction onClick={() => confirmExitWsaving()} className="h-8">Yes</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className={`flex items-center justify-center w-full bg-white dark:bg-gray-800 ${showLoader && 'hidden'}`}>
        {!isLoading && pendingRequest.code == 1 && pendingRequest.data.tm_req_status != undefined ? (
        <div className='w-full md:flex md:justify-between lg:pl-10 lg:pr-10 pl-5 pr-5'
        style={{
          background: 'linear-gradient(0deg, rgba(255, 253, 253, 1) 25%, rgba(240, 240, 240, 1) 100%)',
        }} 
        >
            <div 
            //className='relative md:w-1/2 w-full bg-blue-200 rounded-sm'
            className={`relative md:w-1/2 w-full rounded-sm ${editMode && 'bg-blue-200 mt-2'}`}
            >
                <div className='w-full absolute flex justify-end'>
                <div className={`w-full flex justify-between p-3 pb-0 ${!editMode && 'hidden'}`}>
                  <button type='submit' className={`rounded-sm h-5 w-5  bg-red-600 flex justify-center text-white hover:bg-red-500 ${!editMode && 'hidden'}`} 
                onClick={() => closeEdit()}
                  >
                    <X className='w-5 h-5' />
                  </button>
                  <button type='submit' className={`h-7 w-16 rounded-sm bg-blue-600 flex justify-center text-white ${!editMode && 'hidden'}`}
                    onClick={() => savingChangesValidation()}
                  >
                    {/* <Save size={15} className='mt-1.5 me-0.5 -ms-0.5' /> */}
                    <span className='mt-1 text-sm'>Save</span>
                  </button>
                </div>

                <div className='fixed top-28 mr-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                  <Ellipsis className={`${editMode && 'hidden'}`}/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='mr-10 sm:mr-0 -mt-1.5'>
                  <DropdownMenuItem 
                  onClick={() => openEdit()}
                  >
                    <Pencil />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='hover:cursor-pointer' 
                  onClick={() => openDelete()}
                  >
                    <Trash2 />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
       
                </div>
                </div>
               
            <form className="w-full p-5 space-y-4 mt-1.5 pt-10 sm-pt-4  rounded shadow-md text-gray-700 text-[0.63rem] font-semibold" 
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
                      value={pendingRequest.data.tm_employee_name}
                    />
                </div>


                {pendingRequest.data.tm_emp_status == 'active' && (
                <div>
                    <div className='flex justify-between'>
                        <label htmlFor="department" className="block">Department/Project:</label>
                    </div>
                        <input 
                        disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                        value={pendingRequest.data.tm_department}
                        />
                    </div>
                )}
                
              
                {pendingRequest.data.tm_emp_status == 'active' && (
                <div>
                    <label htmlFor="designation" className="block">Designation:</label>
                    <input 
                      disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.tm_designation}
                    />
                </div>
                )}
               
                <div>
                    <label htmlFor="status" className="block">Staus:</label>
                    <input 
                      disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.tm_emp_status}
                    />
                </div>
                
              
                {pendingRequest.data.tm_emp_status == 'active' ? ( 
                    <div>
                      <label htmlFor="date_hired" className="block">Date Hired:</label>
                      <input 
                        disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                        value={pendingRequest.data.tm_date_hired}
                      />
                    </div>
                  ):(
                    <div>
                      <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                       <input 
                        disabled={!editMode} type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                        defaultValue={pendingRequest.data.tm_date_resigned}
                        onChange={(e) => seteditDateResigned(e.target.value)}
                        ref={dateResignedRef}
                      />
                    </div>
                  )}
                    
                <div>
                      <label htmlFor="thirteen_month_year" className="block">13<span className="inline-block align-text-top text-[0.55rem]">th</span> Month Pay for the year:</label>
                  <select
                    required
                    id="thirteen_month_year"
                    disabled={!editMode}
                    className='mt-1 block w-full border rounded-md p-2' 
                    defaultValue={pendingRequest.data.tm_thirteen_month_year}
                     onChange={(e) => setEdit13thMonthYear(e.target.value)}
                    ref={TMYearRef}
                  >
                    <option value="">Select a year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                    </div>
              
            </form>
            </div>
            
            <div className='relative md:ms-12 md:w-1/2 w-full pt-5 '>
                <div className='absolute full p-10 md-p-0'>
                    <div className=' md:fixed md:top-32'>
                        <ul className='flex ms-6 mb-10 space-x-8 text-xs'>
                            <li className='flex'><p>Undone</p><CircleX className='ms-1 h-4 w-4 text-red-600'/></li>
                            <li className='flex'><p>Ongoing</p> <CircleEllipsis className='ms-1 h-4 w-4 text-blue-600' /></li>
                            <li className='flex'><p>Done</p><CircleCheck className='ms-1 h-4 w-4 text-green-600'/></li>
                        </ul>
                    <ol className="relative text-gray-500 border-s border-gray-100 dark:border-gray-700 dark:text-gray-400 w-full">    
                        {/*1st step*/}
                        <li className="mb-5 ms-6">    
                            {pendingRequest.data.tm_req_status <= 3 ? (
                                <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            ): 
                            pendingRequest.data.tm_req_status > 3 && (
                                <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            )}    
                            <p className="font-medium leading-tight text-sm">Hr Staff</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.tm_req_status > 0 && 'text-green-700'}`}>Hr Staff to validate the request form</li>
                              <li className={` ${pendingRequest.data.tm_req_status > 1 && 'text-green-700'}`}>Hr Staff to submit the request form to the HR Manager for her sign</li>
                              <li className={` ${pendingRequest.data.tm_req_status > 2 && 'text-green-700'}`}>Hr Staff will transmit the signed request form to Accounting Staff</li>
                            </ul>
                        </li>
                        {/*2nd step*/}
                        <li className="mb-5 ms-6">
                            {pendingRequest.data.tm_req_status <= 3 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.tm_req_status > 5 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )}
                            <p className="font-medium leading-tight text-sm">Accounting Staff</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.tm_req_status > 3 && 'text-green-700'}`}>Accounting Staff check if EE’s clearance status is already cleared.</li>
                              <li className={` ${pendingRequest.data.tm_req_status > 4 && 'text-green-700'}`}>Accounting Staff processing the 13th Month Pay checked.</li>
                              <li className={` ${pendingRequest.data.tm_req_status > 5 && 'text-green-700'}`}>Accounting Staff will transmitted the 13th month check w/ voucher to HR Staff.</li>
                            </ul>
                          </li>
                        {/*3rd step*/}
                        <li className="mb-5 ms-6">
                        {pendingRequest.data.tm_req_status <= 7 ? (
                                <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.tm_req_status > 8 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )} 
                            <p className="font-medium leading-tight text-sm">Employee</p>
                             <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.tm_req_status == 8 && 'animate-pulse font-medium text-orange-600'}`}>Claim and sign the receiving copy.</li>
                            </ul>
                        </li>
                    </ol>
                    </div>
                </div>
            </div>
     
            {/* <p>{JSON.stringify(pendingRequest.data.tm_id_no)}</p> */}
        </div>
        ):(
          <div className='w-full '
          style={{
            background: 'linear-gradient(0deg, rgba(255, 253, 253, 1) 25%, rgba(240, 240, 240, 1) 100%)',
          }} 
          >
            <div className={`text-xl mt-40`}>
            <div className="flex justify-center">
               <SearchX className=" w-7 h-7 mb-1"/>
            </div>
            <p className='text-sm flex justify-center'>No results found!</p>
         </div>
          </div>
        )}
    </div>
  </>
  )
}

export default MonthPayPending
