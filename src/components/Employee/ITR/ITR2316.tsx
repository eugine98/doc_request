// import React from 'react'
import SideBar from '../SideBar'
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { API_SERVER_URL } from "@/config";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import useStore from '../LoginPage/store';
import { GrDocumentText } from 'react-icons/gr';
import Loader from '../../Loader';
import ITRPendingRequest from './ITRPendingRequest';
import { toast } from 'sonner';
import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  // id_no: z.string().min(1, { message: "Name is required." }),
  id_no: z.string().optional(),
  employee_name: z.string().min(1, { message: "Name is required." }),
  date_requested: z.string().refine(value => {
    const date = new Date(value);
    return !isNaN(date.getTime());
    }, {
        message: "Date is required.",
    }),
  department: z.string().optional(),
  designation: z.string().optional(),
  date_hired: z.string().optional(),
  emp_status: z.string().min(1, { message: "required." }),
  date_resigned: z.string().optional(),
  itr_year: z.string().min(1, { message: "required." }),
  reason_request: z.string().min(1, { message: "required." }),
})
type FormData = z.infer<typeof schema>

function ITR2316() {
  
  const { 
    register, 
    handleSubmit, 
    watch,
    // reset,
    formState: { errors } ,
    setValue 
  } = useForm<FormData>({resolver: zodResolver(schema),
  });
  
//USESTATE
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState("request_form")
  const [showLoader, setShowLoader] = useState(true)
  const {empData} = useStore();
/////////////////////////////////
//ADDING REQUEST TO DATABASE
  const onSubmit = async (data: FormData) => {
    // console.log("DATA INI HA:", data)
    try {
      const formdata = new FormData();
      formdata.append("data", JSON.stringify(data));
      const response = await axios.post(`${API_SERVER_URL}/Api/add_itr_request`, formdata);
      console.log("INSERT DATA:", response.data);
      if(response.data.code == 0){
        toast.error('', {
          className: 'my-classname',
          description: response.data.msg,
          duration: 2500,
          icon: <MdErrorOutline className="h-5 w-5" />,
        });
      }else{
        toast.success('', {
          className: 'my-classname',
          description: response.data.msg,
          duration: 2500,
          icon: <FaRegCheckCircle className="h-5 w-5" />,
        });
        // reset();
      }
      // return response.data.res.message
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Important to throw error to catch it in onError
  }
  };
  /////////////////////////////////
//USE QUERY
  const get_user_data = async () => {
    try {
        const formdata = new FormData();
        formdata.append("id", empData.idno);
        // formdata.append("id", 'FQWP');
        const response = await axios.post(`${API_SERVER_URL}/Api/get_user_data`, formdata);
        console.log("DATA FROM HRMS:", response.data.res.message);
        return response.data.res.message
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Important to throw error to catch it in onError
    }
};
const { data: empDataFromBackend, isLoading: empDataLoading, refetch: refetchEmpData } = useQuery ({
    queryKey: ['empData'],
    queryFn: () => get_user_data(),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    // retry: 3
    // refetchInterval: 1500
    // refetchIntervalInBackground: true,
  });
  /////////////////////////////////
  //USEEFFECT
  useEffect(() => {
    console.log("EMP DATA:", empData);
    //alert(empData.idno)
    // if(empData.idno.length > 0){
    //   alert(empData.idno)
    //   setShowLoader(true);
    //   refetchEmpData();
    // }else{
    //   navigate('/login');
    // }
}, [empData]);

useEffect(() => {
  const timer = setTimeout(() => {
    if (empData && Object.keys(empData).length > 0) {
      // console.log('empData has a value:', empData);
      if(empData.status != ''){
        if(empData.type == 'employee'){
          if(empData.status == 'resigned'){
            setShowLoader(false);
          }
        }else if(empData.type == 'hr'){
          setShowLoader(false);
          navigate('/HR-ITR')
        }
       
      }else{
        navigate('/login')
      }
      // Do something when empData has a value
    } 
  }, 10); // Delay for 5 seconds
  // Cleanup function to clear the timeout
  return () => clearTimeout(timer);
}, [empData]); // Runs when empData changes

  useEffect(() => {
    if(!empDataLoading){
      if(empDataFromBackend.first_name != undefined){
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setValue("id_no", empDataFromBackend.idno);
        setValue("date_requested", formattedDate);
        setValue("employee_name", `${empDataFromBackend.first_name} ${empDataFromBackend.last_name}`);
        setValue("department", empDataFromBackend.department)
        setValue("designation", empDataFromBackend.job_job_title)
        setValue("emp_status", empData.status)
        setValue("date_resigned", '')
        setValue("date_hired", empDataFromBackend.joined_date)
        setShowLoader(false)
      }else{
        // alert(empData.status)
        if(empData.status == 'active'){
          refetchEmpData()
        }else if(empData.status == 'resigned'){
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          setValue("id_no", '');
          setValue("date_requested", formattedDate);
          setValue("employee_name", `${empData.first_name} ${empData.last_name}`);
          setValue("department", '')
          setValue("designation", '')
          setValue("emp_status", empData.status)
          setValue("date_resigned", '')
          setValue("date_hired", '')
          setShowLoader(false)
        }
      }
    }
  }, [empDataFromBackend, empDataLoading, empData] )
/////////////////////////////////
  const emp_status = watch("emp_status");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => (2000 + i).toString());
  return (
    <>
        {showLoader && (
          <Loader/>
        )}
        <div>
    <div>
        <SideBar />
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
          ITR/2316
        </motion.p>
      <div className=' w-full bg-white ms-4'>
        <div>
            <ul className='flex space-x-10 text-sm font-semibold '
             style={{ fontFamily: "Nunito, sans-serif"}}
            >
              <li 
              className={` pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "request_form" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("request_form")}>
                  <div className="flex items-center p-2 rounded-lg dark:text-white group">
                  <GrDocumentText className='w-4 h-4' />
                  <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600">Request Form</span>
                </div>
              </li>
              <li 
                 className={`pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "pending_request" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("pending_request")}>
                <div className="flex items-center p-2 rounded-lg dark:text-white  group">
                <GrDocumentText className='w-4 h-4' />
                <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600">Pending Request</span>
              </div>
              </li>
            </ul>
        </div>
      </div>
        </div>
        
      </div>
       
        <div className="w-full pt-24 p-5">
        {currentPage == "request_form" ? (
          <div className=" rounded-lg bg-white p-5">
          <div className='flex justify-center'>
            <div className=' bg-white lg:w-3/4 lg:min-w-3/4 w-full'>
            <table className='border border-gray-200 text-center w-full text-gray-700 text-xs font-bold'
            style={{ fontFamily: "Nunito, sans-serif"}}
            >
              <tr>
                  <td className='border border-gray-200  item-center' rowSpan={2}>
                    <div className='flex justify-center'>
                    <img src="src\assets\img\idcsi.png" className="h-14 sm:h-10 lg:h-16 w-20 " alt="Logo" />
                    </div>
                    
                  </td>
                  <td className='border border-gray-200' colSpan={2}>FREIGHT PROCESS OUTSOURCING SOLUTIONS, INC.</td>
                  <td className='border border-gray-200' colSpan={2}>
                      Document No. <br/>
                      ISMS-HR-FR-193
                  </td>
              </tr>
              <tr>
                  <td className='border border-gray-200' colSpan={2}>
                  Request for 2316/ ITR Form
                  </td>
                  <td className='border border-gray-200' colSpan={2}></td>
              </tr>
            </table>
            </div>
          </div>

          <div className="flex justify-center">
          <div className=" w-full flex justify-center">
          <div className="pt-2 lg:w-3/4 lg:min-w-3/4 w-full">
          {/* form */}
            <form className="p-6 space-y-4 bg-white rounded shadow-md text-gray-700 text-xs font-medium" onSubmit={handleSubmit(onSubmit)}
            style={{fontFamily: "Poppins, sans-serif"}}
            >
                <div>
                <div className='flex justify-between'>
                    <label htmlFor="date_requested" className="block">Date Requested:</label>
                </div>
                <input
                    required 
                    type="date" 
                    id="date_requested" 
                    className={`mt-1 block w-full border rounded-md p-2 ${errors.date_requested && 'bg-red-100 border-2 border-red-400'}`}
                    //value={currentDate}
                    //onChange={(e) => setCurrentDate(e.target.value)} 
                    {...register("date_requested", {
                      required: true,
                      validate: (value) => {
                        const date = new Date(value);
                        return !isNaN(date.getTime());
                      },
                    })}
                />
                </div>

                <div>
                  <div className='flex justify-between'>
                    <label htmlFor="employee-name" className="block">Employee Name:</label>
                  </div>
                    <input 
                        required type="text" id="employee_name" 
                      className={`mt-1 block w-full border rounded-md  p-2 ${errors.employee_name && 'bg-red-100 border-2 border-red-400'}`}
                      {...register("employee_name")}
                    />
                </div>


                {emp_status == "active" && (
                    <div>
                <div className='flex justify-between'>
                    <label htmlFor="department" className="block">Department/Project:</label>
                  </div>
                    <input 
                        required type="text" id="department" className={`mt-1 block w-full border rounded-md p-2 ${errors.department && 'bg-red-100 border-2 border-red-400'}`}
                     {...register("department")}
                    />
                    
                </div>
                )}
              
              {emp_status == "active" && (
                  <div>
                    <label htmlFor="designation" className="block">Designation:</label>
                    <input 
                        required type="text" id="designation" className={`mt-1 block w-full border rounded-md p-2 ${errors.designation && 'bg-red-100 border-2 border-red-400'}`}
                        {...register("designation")}
                    />
                </div>
                )}
                
               

              <div className="">
                <label className="block">Status:</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  defaultValue={empData.status}
                  {...register("emp_status")}
                >
                  {empData.status == "active" ? (
                    <option value="active">Active</option>
                  ):(
                    <option value="resigned">Resigned</option>
                  )}
                 
                  
                </select>
              </div>


              {emp_status == "active" && (
                    <div>
                      <label htmlFor="date_hired" className="block">Date Hired:</label>
                      <input 
                          required type="date" id="date_hired" className={`mt-1 block w-full border rounded-md p-2 ${errors.date_hired && 'bg-red-100 border-2 border-red-400'}`}
                        {...register("date_hired")}
                      />
                    </div>
                )}


              {emp_status == "resigned" && (
                    <div>
                      <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                       <input 
                          required type="date" id="date_resigned" className={`mt-1 block w-full border rounded-md p-2 ${errors.date_resigned && 'bg-red-100 border-2 border-red-400'}`}
                        {...register("date_resigned")}
                      />
                  </div>
              )}

            <div>
                  <label htmlFor="itr_year" className="block">2316 / ITR for the year:</label>
                  <select
                  required
                    id="itr_year"
                    className={`mt-1 block w-full border rounded-md p-2 ${errors.itr_year ? 'bg-red-100 border-2 border-red-400' : ''}`}
                    {...register("itr_year")}
                  >
                    <option value="">Select a year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

              <div>
                  <label htmlFor="reason_request" className="block">Reason of Request:</label>
                  <textarea id="reason_request" className={`mt-1 block w-full border rounded-md p-2 h-14 ${errors.reason_request && 'bg-red-100 border-2 border-red-400'}`}
                    required
                    {...register("reason_request")}
                  ></textarea>
              </div>
                <motion.button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 fixed bottom-10 right-10">Submit</motion.button>
            </form>
        </div>
          </div>
          </div>
          </div>
        ):
        (
          <div className=" rounded-lg bg-white p-5">
            <ITRPendingRequest/>
          </div>
        )}
          
        </div>
    </div>
</div>
    </>

  )
}

export default ITR2316
