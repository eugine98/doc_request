import { useEffect } from 'react'
import axios from 'axios'
import { API_SERVER_URL } from '@/config';
import useStore from '../LoginPage/store';
import { useQuery } from '@tanstack/react-query';
// import { CiCircleCheck } from "react-icons/ci";
import { CircleCheck } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { CircleEllipsis } from 'lucide-react';
// import { motion } from 'framer-motion';

function ITRPendingRequest() {
    const {empData} = useStore();
//FETCH PENDING
const fetch_pending_itr = async () => {
    try {
        const formdata = new FormData();
        formdata.append("id", empData.idno);
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


  return (
    <div className="flex items-center justify-center w-full bg-white dark:bg-gray-800">
        {!isLoading && pendingRequest.code == 1 ? (
        <div className=' w-full md:flex md:justify-between lg:pl-10 lg:pr-10'>
   
             <form className="md:w-1/2 w-full p-5 space-y-4 bg-white rounded shadow-md text-gray-700 text-xs font-medium " 
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
                    value={pendingRequest.data.date_requested}
                   
                />
                </div>

                <div>
                  <div className='flex justify-between'>
                    <label htmlFor="employee-name" className="block">Employee Name:</label>
                  </div>
                    <input 
                      disabled type="text" id="employee_name" 
                      className='mt-1 block w-full border rounded-md  p-2' 
                      value={pendingRequest.data.employee_name}
                    />
                </div>


                {pendingRequest.data.emp_status == 'active' && (
                <div>
                    <div className='flex justify-between'>
                        <label htmlFor="department" className="block">Department/Project:</label>
                    </div>
                        <input 
                        disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                        value={pendingRequest.data.department}
                        />
                    </div>
                )}
                
              
                {pendingRequest.data.emp_status == 'active' && (
                <div>
                    <label htmlFor="designation" className="block">Designation:</label>
                    <input 
                      disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.designation}
                    />
                </div>
                )}
               
                <div>
                    <label htmlFor="status" className="block">Staus:</label>
                    <input 
                      disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                      value={pendingRequest.data.emp_status}
                    />
                </div>
                
              
                    <div>
                      <label htmlFor="date_hired" className="block">Date Hired:</label>
                      <input 
                        disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                        value={pendingRequest.data.date_hired}
                      />
                    </div>
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
                        value={pendingRequest.data.itr_year}
                      />
                    </div>

              <div>
                  <label htmlFor="reason_request" className="block">Reason of Request:</label>
                  <textarea id="reason_request" className='mt-1 block w-full border rounded-md p-2 h-14 ' disabled
                    
                  >{pendingRequest.data.reason_request}</textarea>
              </div>
              
            </form>
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
                            {pendingRequest.data.req_status == 0 || pendingRequest.data.req_status == 1 ? (
                                <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            ): 
                            pendingRequest.data.req_status > 1 && (
                                <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            )}    
                            <p className="font-medium leading-tight text-sm">Hr Staff</p>
                            <p className="text-sm">Validate form/HR Manager signing</p>
                        </li>
                        {/*2nd step*/}
                        <li className="mb-10 ms-6">

                            {pendingRequest.data.req_status <= 1 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.req_status > 4 ? (
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
                        {pendingRequest.data.req_status <= 5 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.req_status > 6 ? (
                                    <CircleCheck strokeWidth={1.3} className='absolute flex items-center justify-center w-5 h-5 -start-2.5 bg-green-200 rounded-full text-green-600  dark:text-gray-400'/>
                            ): (
                                    <CircleEllipsis strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-blue-600  dark:text-gray-400'/>
                            )} 
                            <p className="font-medium leading-tight text-sm">For Claim</p>
                            <p className="text-sm">Claim your Document at HR Office</p>
                        </li>
                        {/*4th step*/}
                        <li className="ms-6">
                            {pendingRequest.data.req_status <= 6 ? (
                                    <CircleX strokeWidth={1.3} className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 bg-gray-100 rounded-full text-red-600  dark:text-gray-400'/>
                                ): 
                                pendingRequest.data.req_status > 6 ? (
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
     
            {/* <p>{JSON.stringify(pendingRequest.data.id_no)}</p> */}
        </div>
        ):(
            <p>No Request</p>
        )}
</div>

  )
}

export default ITRPendingRequest
