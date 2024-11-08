import { SearchX } from 'lucide-react'
import React from 'react'

function MonthPayPending() {
  return (
    <div className="flex items-center justify-center w-full bg-white dark:bg-gray-800">
 
        <div className="text-xl mt-40">
            <div className="flex justify-center">
               <SearchX className=" w-7 h-7 mb-1"/>
            </div>
            <p className='text-sm'>No results found!</p>
         </div>
</div>
  )
}

export default MonthPayPending
