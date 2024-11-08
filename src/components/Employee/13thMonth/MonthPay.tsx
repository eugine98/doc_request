//import React from 'react'
import { GrDocumentText } from "react-icons/gr";
import SideBar from "../SideBar"
import { motion } from 'framer-motion';
import { useState } from "react";
import MonthPayPending from "./MonthPayPending";

function MonthPay() {
  const [currentPage, setCurrentPage] = useState("request_form")
    const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => (2000 + i).toString());
  return (
//     <div>
//     <div>
//         <SideBar />
//     </div>
    
//     <div className="relative sm:ml-64 bg-gray-200 mt-6 ">
//       <div className="absolute w-full h-5 ">
//       <div className=" w-full h-6 bg-white fixed top-0">

//       </div>
//       </div>
//       <div className="absolute w-full h-5">
//       <motion.p className=" fixed top-6 font-bold text-lg w-full bg-gray-200 p-3"
//           style={{ fontFamily: "Nunito, sans-serif"}}
//         >
//           COE Request Form
//         </motion.p>
//       </div>
       
//         <div className="w-full pt-16 p-5 ">
//           <div className=" rounded-lg bg-white p-5">
//           <div className='flex justify-center'>
//             <div className=' bg-white w-3/4 min-w-3/4'>
//             <table className='border border-gray-500 text-center w-full text-gray-700 text-sm font-medium'>
//               <tr>
      
//                   <td className='border border-gray-500  item-center' rowSpan={2}>
//                     <div className='flex justify-center'>
//                     <img src="src\assets\img\idcsi.png" className="h-20 w-20 " alt="Logo" />
//                     </div>
                    
//                   </td>
//                   <td className='border border-gray-500' colSpan={2}>FREIGHT PROCESS OUTSOURCING SOLUTIONS, INC.</td>
//                   <td className='border border-gray-500' colSpan={2}>
//                   Document No.
//                   ISMS-HR-FR-193</td>
//               </tr>
//               <tr>
//                   <td className='border border-gray-500' colSpan={2}>
//                   Request for Certificate of 
//                   Employment
//                   </td>
//                   <td className='border border-gray-500' colSpan={2}></td>
//               </tr>
//               </table>
      
//             </div>
//           </div>

//           <div className="flex justify-center">
//           <div className=" w-full flex justify-center">
//           <div className="pt-4 w-3/4 min-w-3/4">
//           <form className="p-6 space-y-4 bg-white rounded shadow-md text-gray-700 text-sm">
//             <div className="">
//               <label className="block">Date Requested:</label>
//               <input
//                 type="date"
//                 name="dateRequested"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Employee Name:</label>
//               <input
//                 type="text"
//                 name="employeeName"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Department/Project:</label>
//               <input
//                 type="text"
//                 name="department"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Designation:</label>
//               <input
//                 type="text"
//                 name="designation"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Date Hired:</label>
//               <input
//                 type="date"
//                 name="dateHired"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Status:</label>
//               <select
//                 name="status"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               >
//                 <option value="active">Active</option>
//                 <option value="resigned">Resigned</option>
//               </select>
//             </div>

//             <div className="">
//               <label className="block">Date Resigned:</label>
//               <input
//                 type="date"
//                 name="dateResigned"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Cleared:</label>
//               <select
//                 name="cleared"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               >
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//               </select>
//             </div>

//             <div className="">
//               <label className="block">Purpose:</label>
//               <textarea
//                 name="purpose"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 rows={4}
//               />
//             </div>

//             <div className="">
//               <label className="block">Signature:</label>
//               <input
//                 type="text"
//                 name="signature"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div className="">
//               <label className="block">Noted by:</label>
//               <input
//                 type="text"
//                 name="notedBy"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <motion.button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 fixed bottom-10 right-10">Submit</motion.button>
//           </form>
//         </div>
//           </div>
//           </div>
//           </div>
//         </div>
//     </div>
// </div>
<div>
<div>
    <SideBar />
</div>

<div className="relative sm:ml-56 bg-white mt-6 ">
  <div className="absolute w-full h-5 ">
  {/* <div className=" w-full h-6 bg-white fixed top-0">

  </div> */}
  </div>
  <div className="absolute w-full h-5 ">
    <div className='fixed top-0 border-l-0 border border-gray-200 w-full'>
    <motion.p className="  font-bold text-2xl w-full bg-white p-4 border-b border-gray-200"
      style={{ fontFamily: "Nunito, sans-serif"}}
    >
      COE
    </motion.p>
  <div className=' w-full bg-white ms-4'>
    <div>
        {/* <ul className='flex space-x-10 text-sm font-semibold'
         style={{ fontFamily: "Nunito, sans-serif"}}
        >
          <li className='border-b-2 border-blue-600 pt-3 pb-3 hover:cursor-pointer'>
              <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <GrDocumentText className='w-4 h-4' />
              <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600">Request Form</span>
            </div>
          </li>
          <li className='border-b-2 border-blue-600 pt-3 pb-3 hover:cursor-pointer'>
            <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <GrDocumentText className='w-4 h-4' />
            <span className="flex-1 ms-3 whitespace-nowrap group-hover:text-blue-600">Pending Request</span>
          </div>
          </li>
        </ul> */}
        <ul className='flex space-x-10 text-sm font-semibold '
             style={{ fontFamily: "Nunito, sans-serif"}}
            >
              <li 
              className={` pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "request_form" && 'border-b-2 border-blue-600 text-blue-600'}`}
              onClick={() => setCurrentPage("request_form")}>
                  <div className="flex items-center p-2 rounded-lg dark:text-white group w-40">
                  <GrDocumentText className='w-3.5 h-3.5' />
                  <span className="flex-1 ms-1 whitespace-nowrap group-hover:text-blue-600 mt-1.5">13<span className="inline-block align-text-top text-xs">th</span> Month Form</span>
                </div>
              </li>
              <li 
                className={`pt-3 pb-3 hover:cursor-pointer hover:text-blue-600 ${currentPage == "pending_request" && 'border-b-2 border-blue-600 text-blue-600'}`}
                onClick={() => setCurrentPage("pending_request")}>
                <div className="flex items-center p-2 rounded-lg dark:text-white  group w-40">
                  <GrDocumentText className='w-3.5 h-3.5' />
                  <span className="flex-1 ms-1 whitespace-nowrap group-hover:text-blue-600 mt-1.5">Pending Request</span>
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
                         ISMS-HR-FR-195
                     </td>
                 </tr>
                 <tr>
                     <td className='border border-gray-200' colSpan={2}>
                     REQUEST FOR 13th MONTH PAY FORM
                     </td>
                     <td className='border border-gray-200' colSpan={2}></td>
                 </tr>
               </table>
               </div>
         </div>
   
         <div className="flex justify-center">
         <div className=" w-full flex justify-center">
         <div className="pt-2 w-3/4 min-w-3/4">
         {/* form */}
         <form className="p-6 space-y-4 bg-white rounded shadow-md text-gray-700 text-xs font-semibold">
               <div className="">
                 <label className="block">Date Requested:</label>
                 <input
                   type="date"
                   name="dateRequested"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Employee Name:</label>
                 <input
                   type="text"
                   name="employeeName"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Department/Project:</label>
                 <input
                   type="text"
                   name="department"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Designation:</label>
                 <input
                   type="text"
                   name="designation"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Date Hired:</label>
                 <input
                   type="date"
                   name="dateHired"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Status:</label>
                 <select
                   name="status"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 >
                   <option value="active">Active</option>
                   <option value="resigned">Resigned</option>
                 </select>
               </div>
               <div>
                     <label htmlFor="itr_year" className="block">13th month pay for the year:</label>
                     <select
                     required
                       id="itr_year"
                       className={`mt-1 block w-full border rounded-md p-2`}
                       // {...register("itr_year")}
                     >
                       <option value="">Select a year</option>
                       {years.map(year => (
                         <option key={year} value={year}>{year}</option>
                       ))}
                     </select>
                   </div>
   
               {/* <div className="">
                 <label className="block">Date Resigned:</label>
                 <input
                   type="date"
                   name="dateResigned"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div>
   
               <div className="">
                 <label className="block">Cleared:</label>
                 <select
                   name="cleared"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 >
                   <option value="yes">Yes</option>
                   <option value="no">No</option>
                 </select>
               </div>
   
               <div className="">
                 <label className="block">Purpose:</label>
                 <textarea
                   name="purpose"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                   rows={4}
                 />
               </div>
   
               <div className="">
                 <label className="block">Noted by:</label>
                 <input
                   type="text"
                   name="notedBy"
                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                 />
               </div> */}
   
               <motion.button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 fixed bottom-10 right-10">Submit</motion.button>
             </form>
       </div>
         </div>
         </div>
         </div>
        ):
        (
          <div className=" rounded-lg bg-white p-5">
            <MonthPayPending/>
          </div>
        )}
          
        </div>

</div>
</div>
  )
}

export default MonthPay
