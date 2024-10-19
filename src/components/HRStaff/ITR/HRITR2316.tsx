// import React from 'react'
import HRsideBar from '../HRsideBar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DataTableDemo } from './HRPendingITRRequest';
// import axios from 'axios';
// import { API_SERVER_URL } from "@/config";
// import { useQuery } from '@tanstack/react-query';
// import useStore from '.../LoginPage/store';
import useStore from '@/components/Employee/LoginPage/store';
import { GrDocumentText } from 'react-icons/gr';
import Loader from '../../Loader';

// import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function HRITR2316() {
//USESTATE
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState("pending_request")
  const [showLoader, setShowLoader] = useState(false)
  const {empData} = useStore();
  /////////////////////////////////
//USE QUERY



  /////////////////////////////////
  //USEEFFECT
useEffect(() => {
  const timer = setTimeout(() => {
    if (empData && Object.keys(empData).length > 0) {
      // console.log('empData has a value:', empData);
      if(empData.status != ''){
        if(empData.type == 'hr'){
          if(empData.status == 'resigned'){
            setShowLoader(false);
          }
        }else if(empData.type == 'employee'){
          setShowLoader(false);
          navigate('/ITR')
        }
      }else{
        navigate('/login')
      }
    } 
  }, 1000); // Delay for 5 seconds

  // Cleanup function to clear the timeout
  return () => clearTimeout(timer);
}, [empData]); // Runs when empData changes

// useEffect(() => {
//   console.log("ITR PENDING: ", itrPending)
// }, [])

/////////////////////////////////
  return (
    <>
        {showLoader && (
          <Loader/>
        )}
        <div>
    <div>
        <HRsideBar />
    </div>
    
    <div className="relative sm:ml-56 bg-white mt-6 ">
      <div className="absolute w-full h-5 ">
      {/* <div className=" w-full h-6 bg-white fixed top-0">

      </div> */}
      </div>
      <div className="absolute w-full h-5 z-20">
        <div className='fixed top-0 border-l-0 border border-gray-200 w-full'>
        <motion.p className="  font-bold text-2xl w-full bg-white p-4 flex justify-end sm:justify-start border-b border-gray-200 "
          style={{ fontFamily: "Nunito, sans-serif"}}
        >
          Request for ITR/2316
        </motion.p>
      <div className=' w-full bg-white ms-4'>
        <div>
            <ul className='flex space-x-10 text-sm font-semibold '
             style={{ fontFamily: "Nunito, sans-serif"}}
            >
              <li 
                 className={`pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "pending_request" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("pending_request")}>
                <div className="flex items-center p-2 rounded-lg dark:text-white  group">
                <GrDocumentText className='w-4 h-4' />
                <div className='flex'>
                    <p className='flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600'>Pending</p>
                    {/* <p className=" ms-2 text-green-600">active</p>
                 <div className='w-2 h-2 mt-1.5 ms-1 rounded-full bg-green-600'></div> */}
                </div>
              </div>
              </li>
              <li 
              className={` pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "request_form" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("request_form")}>
                  <div className="flex items-center p-2 rounded-lg dark:text-white group">
                  <GrDocumentText className='w-4 h-4' />
                  <div className='flex'>
                    <p className='flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600'>Test</p>
                    {/* <p className=" ms-2 text-red-600">resigned</p>
                 <div className='w-2 h-2 mt-1.5 ms-1 rounded-full bg-red-600'></div> */}
                  </div>
                 
                </div>
              </li>
            </ul>
        </div>
      </div>
        </div>
        
      </div>
       
        <div className="w-full pt-20 p-5">
        {currentPage == 'pending_request' ? (
          <div className=" rounded-lg bg-white  p-5">
          <DataTableDemo />
          </div>
        ):(
          <div className=" rounded-lg bg-white mt-20 p-5">
       test
          </div>
        )}
          
          
        </div>
    </div>
</div>
    </>

  )
}

export default HRITR2316
