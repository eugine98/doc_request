import { Skeleton } from "@/components/ui/skeleton"

function SkeletonComp() {
  return (
   <>
   <div className="w-full md:flex md:justify-between lg:pl-10 lg:pr-10 pl-5 pr-5">
   <div className='w-full md:flex md:justify-between lg:pl-10 lg:pr-10 pl-5 pr-5'
        //  style={{
        //   background: 'linear-gradient(0deg, rgba(255, 253, 253, 1) 25%, rgba(240, 240, 240, 1) 100%)',
        // }} 
         >
             <div 
             className='relative md:w-1/2 w-full rounded-sm mt-2'
             >
             <div className="w-full p-5 space-y-4 mt-1.5 rounded text-[0.63rem] font-semibold" 
                 style={{fontFamily: "Poppins, sans-serif"}}
              >
                 <div className="mb-2">
                 <div className='flex justify-end'>
                 <Skeleton className="h-2 w-7" />
                 </div>
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-7 w-fulll" />
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-7 w-fulll" />
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-7 w-fulll" />
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-7 w-fulll" />
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-7 w-fulll" />
                 </div>
                 <div className="mb-2">
                 <div className='flex justify-between'>
                 <Skeleton className="h-5 w-20 mb-1" />
                 </div>
                 <Skeleton className="h-20 w-fulll" />
                 </div>
             </div>
             </div>
             
             <div className='relative md:ms-12 md:w-1/2 w-full pt-5 '>
                 <div className='absolute full p-10 md-p-0'>
                     <div className=' md:fixed md:top-32'>
                         <ul className='flex ms-6 mb-10 space-x-2 '>
                             <li> 
                                <div className="flex justify-between">
                                <Skeleton className="h-3 w-16 me-1" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                </div>
                               
                            </li>
                            <li> 
                                <div className="flex justify-between">
                                <Skeleton className="h-3 w-16 me-1" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                </div>
                               
                            </li>
                            <li> 
                                <div className="flex justify-between">
                                <Skeleton className="h-3 w-16 me-1" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                </div>
                               
                            </li>
                         </ul>
                     <ol className="relative  w-full">    
               
                         <li className="mb-5 ms-6">    
                         <Skeleton className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 rounded-full ' />
                             <Skeleton className='leading-tigh h-3.5 w-20' />
                             <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className="text-gray-300 mt-1">
                              <li><Skeleton className='h-2 sm:w-92 w-52' /></li>
                              <li><Skeleton className='h-2 sm:w-96 w-52' /></li>
                              <li><Skeleton className='h-2 sm:w-96 w-52' /></li>
                            </ul>
                         </li>
                         <li className="mb-5 ms-6">    
                         <Skeleton className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 rounded-full ' />
                             <Skeleton className='leading-tigh h-3.5 w-20' />
                             <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className="text-gray-300 mt-1">
                              <li><Skeleton className='h-2 sm:w-96 w-52' /></li>
                              <li><Skeleton className='h-2 sm:w-96 w-52' /></li>
                              <li><Skeleton className='h-2 sm:w-96 w-52' /></li>
                            </ul>
                         </li>
                         <li className="mb-5 ms-6">    
                         <Skeleton className='absolute flex items-center p-0 justify-center w-5 h-5 -start-2.5 rounded-full ' />
                             <Skeleton className='leading-tigh h-3.5 w-20' />
                             <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }} className="text-gray-300 mt-1">
                              <li><Skeleton className='h-2 sm:w-64 w-52' /></li>
                            </ul>
                         </li>
                     </ol>
                     </div>
                 </div>
             </div>
             {/* <p>{JSON.stringify(pendingRequest.data.c_id_no)}</p> */}
         </div>
   </div>
  
   </>
  )
}

export default SkeletonComp
