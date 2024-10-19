import { useEffect } from 'react'
import axios from 'axios'
import { API_SERVER_URL } from '@/config';
import useStore from '../LoginPage/store';
import { useQuery } from '@tanstack/react-query';
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
                    <div className=' md:fixed md:top-40 '>
                    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 w-full">    
                        {/*1st step*/}
                        <li className="mb-10 ms-6">            
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                                <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                            </span>
                            <p className="font-medium leading-tight text-sm">Hr Staff1</p>
                            <p className="text-sm">Validate form/HR Manager signing</p>
                        </li>
                        {/*2nd step*/}
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2pa1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2pa1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2pa1 1 0 1 1 0 2Z"/>
                                </svg>
                            </span>
                            <p className="font-medium leading-tight text-sm">Accounting Staff
                            </p>
                            <p className="text-sm">Processing of ITR/2316/Accounting Manager signing</p>
                        </li>
                        {/*3rd step*/}
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2pa1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2pa1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2pa1 1 0 1 1 0 2Z"/>
                                </svg>
                            </span>
                            <p className="font-medium leading-tight text-sm">For Claim</p>
                            <p className="text-sm">Claim your Document at HR Office</p>
                        </li>
                        {/*4th step*/}
                        <li className="ms-6">
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
                                </svg>
                            </span>
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
