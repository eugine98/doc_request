import HRsideBar from '../HRsideBar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useStore from '@/components/Employee/LoginPage/store';
import { GrDocumentText } from 'react-icons/gr';
import Loader from '../../Loader';
import { useNavigate } from 'react-router-dom';
import { NotebookPen } from 'lucide-react';
import { DataTableCOE } from './HRCOEPendingRequest';
import { DataTableClaimedCOE } from './HRCOEClaimed';

function HRCOE() {
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
    
    <div className="relative sm:ml-52 ml-14 bg-white mt-6 ">
      <div className="absolute w-full h-5 ">
      </div>
      <div className="absolute w-full h-5 z-20">
        <div className='fixed top-0 border-l-0 border border-gray-200 w-full'>
        <div className='flex border-b border-gray-200 '>
        <NotebookPen size={25} className='ms-3 mt-2.5 mr-1 '/>
                <motion.p className="  font-bold text-2xl w-full bg-white p-2 pl-0.5 flex "
          style={{ fontFamily: "Nunito, sans-serif"}}
        >
          COE
        </motion.p>
        </div>
      <div className=' w-full bg-white'>
        <div>
            <ul className='flex text-sm font-medium'
             style={{ fontFamily: "Nunito, sans-serif"}}
            >
              <li 
                 className={`pt-2 pb-2 ps-3.5 hover:cursor-pointer hover:text-blue-600 ${currentPage == "pending_request" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("pending_request")}>
                <div className="flex items-center rounded-lg dark:text-white  group w-40">
                <GrDocumentText className='w-4 h-4' />
                <div className='flex'>
                    <p className='flex-1 ms-1 mt-1.5 whitespace-nowrap group-hover:text-blue-600'>Pending</p>
                </div>
              </div>
              </li>
              <li 
              className={` pt-2 pb-2 ps-3.5 hover:cursor-pointer hover:text-blue-600 ${currentPage == "request_form" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("request_form")}>
                  <div className="flex items-center rounded-lg dark:text-white group w-40">
                  <GrDocumentText className='w-4 h-4'/>
                  <div className='flex'>
                    <p className='flex-1 ms-1 mt-1.5 whitespace-nowrap group-hover:text-blue-600'>Claimed</p>
                  </div>
                 
                </div>
              </li>
            </ul>
        </div>
      </div>
        </div>
        
      </div>
       
        <div className="w-full pt-14 sm:pt-14 sm:p-5 p-0.5">
        {currentPage == 'pending_request' ? (
          <div className=" rounded-lg bg-white  p-5">
            <DataTableCOE />
          </div>
        ):(
          <div className=" rounded-lg bg-white  p-5">
            <DataTableClaimedCOE />
          </div>

        )}
        </div>
    </div>
</div>
    </>

  )
}

export default HRCOE
