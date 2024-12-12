import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_SERVER_URL } from '@/config';
import useStore from '../LoginPage/store';
import { useQuery } from '@tanstack/react-query';
// import { CiCircleCheck } from "react-icons/ci";
import { BadgeCheck, CircleCheck, Ellipsis, Pencil, SearchX, Trash2, Trash2Icon, TriangleAlert, X } from 'lucide-react';
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
import { toast } from 'sonner';
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
//import { IoInformationCircleOutline } from 'react-icons/io5';
// import { motion } from 'framer-motion';
// interface intForEdit {
//   status: string,
//   date_resigned: string, 
//   itr_year: string, 
//   reason_request: string,
// }
function ITRPendingRequest() {
    const {empData} = useStore();
    //const [prevEmpReq, setPrevEmpReq] = useState<intForEdit | undefined>(undefined);
    const reasonRef = useRef<HTMLTextAreaElement>(null);
    const dateResignedRef = useRef<HTMLInputElement>(null);
    const ITRYearRef = useRef<HTMLSelectElement>(null);
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
        // alert(12)
        // console.log("trying.....")
        // console.log("THIS IS PENDING REQUEST", data); // Now this will be "object"
        // alert(12)
        // if(response.data.length > 0){
        //   const myObject = {
        //     status: pendingRequest.data.i,
        //     date_resigned: "", 
        //     itr_year: "", 
        //     reason_request: "",
        //   };
        // setPrevEmpReq(myObject);
        // }
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

//   useEffect(() => {
//     const myObject = {
//         status: pendingRequest.data.i_emp_status,
//         date_resigned: pendingRequest.data.i_date_resigned, 
//         itr_year: pendingRequest.data.i_itr_year, 
//         reason_request: pendingRequest.data.i_reason_request,
//       };
//     setPrevEmpReq(myObject);
//  }, [pendingRequest])

  const [editDateResigned, seteditDateResigned] = useState("");
  const [editITRYear, setEditITRYear] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [exitWsaving, setExitWsaving] = useState(false);
  const confirmExitWsaving = () => {
    setEditReason(pendingRequest.data.i_reason_request)
    setEditITRYear(pendingRequest.data.i_itr_year)
    seteditDateResigned(pendingRequest.data.i_date_resigned)
    if (reasonRef.current) reasonRef.current.value = pendingRequest.data.i_reason_request;
    if (dateResignedRef.current) dateResignedRef.current.value = pendingRequest.data.i_date_resigned;
    if (ITRYearRef.current) ITRYearRef.current.value = pendingRequest.data.i_itr_year;
    setEditMode(false)
  }

  const openEdit = () => {
    // alert(pendingRequest.data.i_req_status)
    if( pendingRequest.data.i_req_status > 0 ){
      toast.warning('', {
        className: 'my-classname',
        description: <div className="font-semibold">Action invalid: form already validated.</div>,
        duration: 2500,
        icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
    });
    }else{
      setEditReason(pendingRequest.data.i_reason_request)
      setEditITRYear(pendingRequest.data.i_itr_year)
      seteditDateResigned(pendingRequest.data.i_date_resigned)
      setEditMode(true);
    }
  }
  const closeEdit = () => {
    if(pendingRequest.data.i_reason_request != editReason.trim() || pendingRequest.data.i_itr_year != editITRYear){
      setExitWsaving(true);
    }else{
      setEditReason(pendingRequest.data.i_reason_request)
      setEditITRYear(pendingRequest.data.i_itr_year)
      seteditDateResigned(pendingRequest.data.i_date_resigned)
      if (reasonRef.current) reasonRef.current.value = pendingRequest.data.i_reason_request;
      if (dateResignedRef.current) dateResignedRef.current.value = pendingRequest.data.i_date_resigned;
      if (ITRYearRef.current) ITRYearRef.current.value = pendingRequest.data.i_itr_year;
      setEditMode(false)
    }
  }
  const [isOpen, setIsOpen] = useState(false);
  const openDelete = () => {
    if( pendingRequest.data.i_req_status > 0 ){
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
      formdata.append("id", pendingRequest.data.i_id);
      formdata.append("req_id", pendingRequest.data.i_req_id);
      await axios.post(`${API_SERVER_URL}/Api/delete_req`, formdata);
      fetch_pending_itr();
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

  const [confirmChanges, setConfirmChanges] = useState(false);
  const savingChangesValidation = () => {
    if(editReason.trim() != ""){
      if(pendingRequest.data.i_emp_status == 'active'){
        if(pendingRequest.data.i_reason_request != editReason.trim() || pendingRequest.data.i_itr_year != editITRYear){
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
        if(pendingRequest.data.i_reason_request != editReason.trim() || pendingRequest.data.i_itr_year != editITRYear || pendingRequest.data.i_date_resigned != editDateResigned){
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
    }else{
      toast.error('', {
        className: 'my-classname',
        description: <div className="font-semibold">All fields are required!</div>,
        duration: 2500,
        icon: <TriangleAlert className="h-5 w-5 mt-0.5" />,
      });
    }
  }
  const save_Changes = async () => {
    try {
      const formdata = new FormData();
      formdata.append("id", pendingRequest.data.i_id);
      formdata.append("reason_request", editReason);
      formdata.append("date_resigned", editDateResigned);
      formdata.append("itr_year", editITRYear);
      await axios.post(`${API_SERVER_URL}/Api/update_req`, formdata);
      fetch_pending_itr();
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => (2000 + i).toString());
  return (
    <>
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
     <div className="flex items-center justify-center w-full bg-white dark:bg-gray-800">
        {!isLoading  && pendingRequest.code == 1 && pendingRequest.data.i_req_status != undefined ? (
        <div className='w-full md:flex md:justify-between lg:pl-10 lg:pr-10 pl-5 pr-5'
               style={{
            background: 'linear-gradient(0deg, rgba(255, 253, 253, 1) 25%, rgba(240, 240, 240, 1) 100%)',
          }} 
        >
            <div 
            //className='relative md:w-1/2 w-full bg-blue-200 rounded-sm'
            className={`relative md:w-1/2 w-full rounded-sm ${editMode && 'bg-blue-200'}`}
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

                <div className='fixed top-24 flex'>
                <DropdownMenu>
                  <DropdownMenuTrigger disabled={pendingRequest.data.i_req_status == undefined}>
                    <Ellipsis className={`mt-4 mr-6 ${editMode && 'hidden'}`}/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='-mt-1.5 mr-6'>
                  <DropdownMenuItem onClick={() => openEdit()}>
                    <Pencil />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='hover:cursor-pointer' onClick={() => openDelete()}>
                    <Trash2 />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
       
                </div>
                </div>
               
            <form className="w-full p-4 space-y-4 mt-1.5 pt-10 sm-pt-4 rounded shadow-md text-gray-700 text-[0.63rem] font-semibold" 
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
                        disabled={!editMode} type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                        defaultValue={pendingRequest.data.i_date_resigned}
                        onChange={(e) => seteditDateResigned(e.target.value)}
                        ref={dateResignedRef}
                      />
                    </div>
                  )}
                    
                <div>
                      <label htmlFor="itr_year" className="block">2316 / ITR for the year:</label>
                  <select
                    required
                    id="itr_year"
                    disabled={!editMode}
                    className='mt-1 block w-full border rounded-md p-2' 
                    defaultValue={pendingRequest.data.i_itr_year}
                    onChange={(e) => setEditITRYear(e.target.value)}
                    ref={ITRYearRef}
                  >
                    <option value="">Select a year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                    </div>

              <div>
                  <label htmlFor="reason_request"  className="block">Reason of Request:</label>
                  <textarea id="reason_request" required ref={reasonRef} className='mt-1 block w-full border rounded-md p-2 h-16 ' disabled={!editMode} onChange={(e) => setEditReason(e.target.value)}>
                    {pendingRequest.data.i_reason_request}
                  </textarea>
              </div>
              
            </form>
            </div>
            
            <div className='relative md:ms-12 md:w-1/2 w-full pt-5'>
                <div className='absolute w-full pt-5 p-10 md-p-0'>
                    <div className=' md:fixed md:top-32'>
                        <ul className='flex ms-6 mb-10 space-x-8 text-xs'>
                            <li className='flex'><p>Undone</p><CircleX className='ms-1 h-4 w-4 text-red-600'/></li>
                            <li className='flex'><p>Ongoing</p> <CircleEllipsis className='ms-1 h-4 w-4 text-blue-600' /></li>
                            <li className='flex'><p>Done</p><CircleCheck className='ms-1 h-4 w-4 text-green-600'/></li>
                        </ul>
                    <ol className="relative text-gray-500 border-s border-gray-100 dark:border-gray-700 dark:text-gray-400 w-full">    
                        {/*1st step*/}
                        <li className="mb-5 ms-6">    
                            {pendingRequest.data.i_req_status <= 2 ? (
                                <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            ): 
                            pendingRequest.data.i_req_status > 2 && (
                                <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            )}    
                            <p className="font-medium leading-tight text-sm">Hr Staff</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.i_req_status > 0 && 'text-green-700'}`}>Hr Staff to validate the request form</li>
                              <li className={` ${pendingRequest.data.i_req_status > 1 && 'text-green-700'}`}>Hr Staff to submit the request form to the HR Manager for her sign</li>
                              <li className={` ${pendingRequest.data.i_req_status > 2 && 'text-green-700'}`}>Hr Staff will transmit the signed request form to Accounting Staff</li>
                            </ul>

                        </li>
                        {/*2nd step*/}
                        <li className="mb-5 ms-6">

                            {pendingRequest.data.i_req_status <= 2 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.i_req_status > 5 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                                ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )}
                            <p className="font-medium leading-tight text-sm">Accounting Staff</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.i_req_status > 3 && 'text-green-700'}`}>Accounting Staff will process the ITR/2316.</li>
                              <li className={` ${pendingRequest.data.i_req_status > 4 && 'text-green-700'}`}>Accounting Staff will give the ITR/2316 to their Accounting Manager for her sign.</li>
                              <li className={` ${pendingRequest.data.i_req_status > 5 && 'text-green-700'}`}>Accounting Staff will transmitted back the Signed ITR/2316 to Hr Staff</li>
                            </ul>
                        </li>
                        {/*3rd step*/}
                        <li className="mb-5 ms-6">
                        {pendingRequest.data.i_req_status <= 6 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.i_req_status > 7 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )} 
                            <p className="font-medium leading-tight text-sm">Employee</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className='text-[0.8rem] '>
                              <li className={` ${pendingRequest.data.i_req_status == 7 && 'animate-pulse font-medium text-orange-600'}`}>Claim and sign the receiving copy.</li>
                            </ul>
                        </li>
                    </ol>
                    </div>
                </div>
            </div>
     
            {/* <p>{JSON.stringify(pendingRequest.data.i_id_no)}</p> */}
        </div>
        ):(
          <div className='w-full '
          style={{
            background: 'linear-gradient(0deg, rgba(255, 253, 253, 1) 25%, rgba(240, 240, 240, 1) 100%)',
          }} 
          >
            <div className="text-xl mt-40">
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

export default ITRPendingRequest
