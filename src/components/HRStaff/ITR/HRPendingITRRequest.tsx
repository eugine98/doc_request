//import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react";
import { IoEye } from "react-icons/io5";
import { MdEdit, MdErrorOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_SERVER_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  // AlertDialogAction,
  // AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export type PendingITR = {
  i_archive: string;
  i_date_hired: string;
  r_date_requested: string;
  i_date_resigned: string;
  i_department: string;
  i_designation: string;
  i_emp_status: string;
  i_employee_name: string;
  i_id: string;
  i_id_no: string;
  i_itr_year: string;
  i_reason_request: string;
  i_req_status: string;
};



export function DataTableDemo() {
  const columns: ColumnDef<PendingITR>[] = [
    {
      accessorKey: "i_id_no",
      header: "Id_no",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_id_no")}</div>,
    },
    {
      accessorKey: "i_employee_name",
      header: "Employee_name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_employee_name")}</div>,
    },
    {
      accessorKey: "r_date_requested",
      header: "Date_requested",
      cell: ({ row }) => <div className="capitalize">{row.getValue("r_date_requested")}</div>,
    },
    {
      accessorKey: "i_department",
      header: "Department",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_department")}</div>,
    },
    {
      accessorKey: "i_designation",
      header: "Designation",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_designation")}</div>,
    },
    {
      accessorKey: "i_emp_status",
      header: "Emp_status",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_emp_status")}</div>,
    },
    {
      accessorKey: "i_req_status",
      header: "Req_Status",
      cell: ({ row }) => <div className="capitalize">{row.getValue("i_req_status")}</div>,
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;
        const [requestStatus, setRequestStatus] = useState(0)
        const [isOpen, setIsOpen] = useState(false);
        const openDialog = () => setIsOpen(true);
        const closeDialog = async () => {
          await refetchCount();
          await fetch_pending_itr_for_hr();
          setIsOpen(false);
        }
  
        const update_req_status = async (id: string, req_status: string, action: string) => {
          try {
              const formdata = new FormData();
              formdata.append("id", id);
              formdata.append("req_status", req_status);
              formdata.append("action", action);
              await axios.post(`${API_SERVER_URL}/Api/update_req_status`, formdata);
              //const data = JSON.parse(response.data); // Parse the JSON string into an object
              // console.log("THIS IS PENDING REQUEST", data); // Now this will be "object"
              // return data;
          } catch (error) {
              console.error("Error fetching data:", error);
              throw error; // Important to throw error to catch it in onError
          }
      };
  
      const update_status = async (id: string, req_status: string, button_type: string) => {
        await update_req_status(id, req_status, button_type);
        if(button_type == 'done'){
          setRequestStatus(prevStat => prevStat + 1);
          toast.success('', {
            className: 'my-classname',
            description: <div className="ms-4 font-semibold">
                <p>Updated!</p>
            </div>,
            duration: 2000,
            icon: <MdErrorOutline className="h-5 w-5" />,
          });
        }else{
          setRequestStatus(prevStat => prevStat - 1);
        }
       
        // refetchCount();
        // await fetch_pending_itr_for_hr();
      }
        return (
          <>
            <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className='w-1/2 '>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                      <div className="flex justify-between">
                        <p> ITR/123414</p>
                        <div className=""><X className="p-1 text-gray-600 hover:text-gray-900  rounded-sm hover:cursor-pointer" onClick={() => closeDialog()} /></div>
                      </div>
                       
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="">
                            <p> Name: {employee.i_employee_name}</p>
                            <p className=" capitalize"> Employee Status: {employee.i_emp_status}</p>
                            <p> Id no: {employee.i_emp_status == 'active' ? employee.i_id_no : '----'}</p>
                          </div>
                    </AlertDialogDescription>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className={` ${requestStatus > 0 ? 'text-green-600' : 'text-red-600'}`}>For validate</AccordionTrigger>
                          <AccordionContent>
                          <div>
                            {requestStatus > 0 ? (
                              <p>
                                Done!
                              </p>
                            ): (
                              <p className="font-medium text-xs">
                                Click 'Done' if the request form is validated and looks good. <br/>
                                Click 'Reject' if there are any issues.
                              </p>
                            )}
                            
                            {requestStatus == 0 && (
                              <div className="w-full space-x-1 flex justify-end">
                            <Dialog>
                              <DialogTrigger>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                // onClick={() => update_status(employee.i_id, '1', 'done')}
                              >
                                Reject 
                              </Button>
                              </DialogTrigger>
                              <DialogContent className="w-96 h-fit">
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                  <DialogDescription className="pb-5">
                                  Once you send this message, request will be rejected!
                                  </DialogDescription>
                                  <div className="mb-5">
                                    <Label htmlFor="" className="">To:</Label>
                                    <Input defaultValue={employee.i_emp_status}/>
                                  </div>
                                  <div>
                                    <Label htmlFor="" className="">Reason why rejected:</Label>
                                    <Textarea rows={6} />
                                  </div>
                               
                                

                                </DialogHeader>
                                 <DialogFooter>
                                    <Button type="submit">Send</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '1', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 1 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '0', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger className={`  ${requestStatus > 1 ? 'text-green-600' : 'text-red-600'}`}>
                              <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(HR Manageer)</span>
                              </div>
                            </AccordionTrigger>
                          <AccordionContent>
                           <div>
                              <div>
                              {requestStatus > 1 ? (
                                    <p>Done!</p>
                                  ):(
                                    <p className="font-medium text-xs">Click 'Done' if the form is signed by the HR Manager.</p>
                                  )}
                              </div>
                            {requestStatus == 1 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '2', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 2 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '1', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger className={`  ${requestStatus > 2 ? 'text-green-600' : 'text-red-600'}`}>Accounting staff processing the ITR/2316.</AccordionTrigger>
                          <AccordionContent>
                          <div>
                          <div>
                              {requestStatus > 2 ? (
                                    <p>Done!</p>
                                  ):(
                                    <p className="font-medium text-xs">Click 'Done' if the ITR is processed by the accounting staff.</p>
                                  )}
                              </div>
                            {requestStatus == 2 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '3', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 3 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '2', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger className={`  ${requestStatus > 3 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(Accounting Manager)</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent>
                          <div>
                          <div>
                              {requestStatus > 3 ? (
                                    <p>Done!</p>
                                  ):(
                                    <p className="font-medium text-xs">Click 'Done' if the form is signed by the Accounting Manager.</p>
                                  )}
                              </div>
                            {requestStatus == 3 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '4', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 4 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '3', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger className={`  ${requestStatus > 4 ? 'text-green-600' : 'text-red-600'}`}>Return to HR staff</AccordionTrigger>
                          <AccordionContent>
                          <div>
                          <div>
                              {requestStatus > 4 ? (
                                    <p>Done!</p>
                                  ):(
                                    <p className="font-medium text-xs">Click 'Done' if the ITR is returned to HR staff.</p>
                                  )}
                              </div>
                            {requestStatus == 4 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '5', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 5 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '4', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                          <AccordionTrigger className={`  ${requestStatus > 5 ? 'text-green-600' : 'text-red-600'}`}>Notif EE to claim the ITR</AccordionTrigger>
                          <AccordionContent>
                            <div>
                                {requestStatus > 5 ? (
                                      <p>Done!</p>
                                    ):(
                                      <p className="font-medium text-xs">Click 'Done' if you have notified the employee to claim the ITR.</p>
                                    )}
                            </div>
                            {requestStatus == 5 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '6', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 6 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '5', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-7">
                          <AccordionTrigger className={`  ${requestStatus > 6 ? 'text-green-600' : 'text-red-600'}`}>ITR For Claim</AccordionTrigger>
                          <AccordionContent>
                          <div>
                          <div>
                              {requestStatus > 6 ? (
                                    <p>Done!</p>
                                  ):(
                                    <p className="font-medium text-xs">Click 'Done' if the ITR has been claimed.</p>
                                  )}
                              </div>
                            {requestStatus == 6 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '7', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 7 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '6', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                </AlertDialogHeader>
                    <AlertDialogFooter>
                    {/* <AlertDialogAction onClick={closeDialog} className="h-8">Submit</AlertDialogAction> */}
                    {/* {isOpen && !formStatus  && ( <Button onClick={closeDialog} className="mt-10">Submit</Button>)}
                    */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
            <div className="p-1">
            <ul className="flex space-x-3">
            <li>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                  <div className="bg-orange-600 p-1 rounded-sm hover:cursor-pointer" onClick={() => { openDialog();
                        if(employee.i_req_status == 'For Sign(HR Manager)'){
                          setRequestStatus(1)
                        }else if(employee.i_req_status == 'Accounting staff processing the ITR/2316'){
                          setRequestStatus(2)
                        }else if(employee.i_req_status == 'For Sign(Accounting Manager)'){
                          setRequestStatus(3)
                        }else if(employee.i_req_status == 'Return to HR staff'){
                          setRequestStatus(4)
                        }else if(employee.i_req_status == 'Notif EE'){
                          setRequestStatus(5)
                        }else if(employee.i_req_status == 'For Claim'){
                          setRequestStatus(6)
                        }else if(employee.i_req_status == 'Done'){
                          setRequestStatus(7)
                        }
                      }}>
                        <MdEdit className="w-4 h-4 text-white" />
                      </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Req Status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                  <Dialog >
                    <DialogTrigger>
                      <div className="bg-orange-600 p-1 rounded-sm hover:cursor-pointer" onClick={() => { openDialog();
                        if(employee.i_req_status == 'For Sign(HR Manager)'){
                          setRequestStatus(1)
                        }else if(employee.i_req_status == 'Accounting staff processing the ITR/2316'){
                          setRequestStatus(2)
                        }else if(employee.i_req_status == 'For Sign(Accounting Manager)'){
                          setRequestStatus(3)
                        }else if(employee.i_req_status == 'Return to HR staff'){
                          setRequestStatus(4)
                        }else if(employee.i_req_status == 'Notif EE'){
                          setRequestStatus(5)
                        }else if(employee.i_req_status == 'Claimed'){
                          setRequestStatus(6)
                        }else if(employee.i_req_status == 'Done'){
                          setRequestStatus(7)
                        }
                      }}>
                        <MdEdit className="w-4 h-4 text-white" />
                      </div>
                    </DialogTrigger>
                      <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ITR/2316 Request Status</DialogTitle>
                        <DialogDescription>
                          <div className="">
                            <p> Name: {employee.i_employee_name}</p>
                            <p className=" capitalize"> Employee Status: {employee.i_emp_status}</p>
                            <p> Id no: {employee.i_emp_status == 'active' ? employee.i_id_no : '----'}</p>
                          </div>
                         
                        </DialogDescription>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className={` ${requestStatus > 0 ? 'text-green-600' : 'text-red-600'}`}>For validate</AccordionTrigger>
                          <AccordionContent>
                          <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 0 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '1', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 1 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '0', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger className={`  ${requestStatus > 1 ? 'text-green-600' : 'text-red-600'}`}>
                              <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(HR Manageer)</span>
                              </div>
                            </AccordionTrigger>
                          <AccordionContent>
                           <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 1 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '2', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 2 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '1', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger className={`  ${requestStatus > 2 ? 'text-green-600' : 'text-red-600'}`}>Accounting staff processing the ITR/2316.</AccordionTrigger>
                          <AccordionContent>
                          <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 2 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '3', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 3 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '2', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger className={`  ${requestStatus > 3 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(Accounting Manager)</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent>
                          <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 3 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '4', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 4 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '3', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger className={`  ${requestStatus > 4 ? 'text-green-600' : 'text-red-600'}`}>Return to HR staff</AccordionTrigger>
                          <AccordionContent>
                          <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 4 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '5', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 5 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '4', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                          <AccordionTrigger className={`  ${requestStatus > 5 ? 'text-green-600' : 'text-red-600'}`}>Notif EE to claim the ITR</AccordionTrigger>
                          <AccordionContent>
                            <div>
                              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, impedit illum? Iusto numquam delectus ipsa maiores id vero facilis omnis.</p>
                            </div>
                            {requestStatus == 5 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '6', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 6 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '5', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-7">
                          <AccordionTrigger className={`  ${requestStatus > 6 ? 'text-green-600' : 'text-red-600'}`}>ITR Claimed</AccordionTrigger>
                          <AccordionContent>
                          <div>
                            <p>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                            </p>
                            {requestStatus == 6 && (
                              <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '7', 'done')}
                              >
                                Done 
                              </Button>
                              </div>
                            )}
                              {requestStatus == 7 && (
                                 <div className="w-full space-x-1 flex justify-end">
                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                onClick={() => update_status(employee.i_id, '6', 'undone')}
                                >
                                Undone 
                                </Button>
                              </div>
                              )}
                           
                           </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
  
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
              
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Req Status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              </li>
              <li>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                  <Dialog>
                  <DialogTrigger>
                  <div className="bg-blue-600 p-1 rounded-sm hover:cursor-pointer">
                        <IoEye className="w-4 h-4 text-white" />
                      </div>
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <div className="">
                        <form className="w-full space-y-4 p-3 bg-white rounded shadow-md text-gray-700 text-xs font-medium" 
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
                                  value={employee.r_date_requested}
                                
                              />
                              </div>
  
                              <div>
                                <div className='flex justify-between'>
                                  <label htmlFor="employee-name" className="block">Employee Name:</label>
                                </div>
                                  <input 
                                    disabled type="text" id="employee_name" 
                                    className='mt-1 block w-full border rounded-md  p-2' 
                                    value={employee.i_employee_name}
                                  />
                              </div>
  
  
                              {employee.i_emp_status == 'active' && (
                              <div>
                                  <div className='flex justify-between'>
                                      <label htmlFor="department" className="block">Department/Project:</label>
                                  </div>
                                      <input 
                                      disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                                      value={employee.i_department}
                                      />
                                  </div>
                              )}
                              
                            
                              {employee.i_emp_status == 'active' && (
                              <div>
                                  <label htmlFor="designation" className="block">Designation:</label>
                                  <input 
                                    disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                                    value={employee.i_designation}
                                  />
                              </div>
                              )}
                            
                              <div>
                                  <label htmlFor="status" className="block">Staus:</label>
                                  <input 
                                    disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                                    value={employee.i_emp_status}
                                  />
                              </div>
                              
                              {employee.i_emp_status == 'active' && (
                                <div>
                                  <label htmlFor="date_hired" className="block">Date Hired:</label>
                                  <input 
                                    disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                                    value={employee.i_date_hired}
                                  />
                                </div>
                             )}
  
                            {employee.i_emp_status != 'active' && (
                                  <div>
                                    <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                                    <input 
                                      disabled type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                                      value={employee.i_date_resigned}
                                    />
                                </div>
                             )}
  
                              <div>
                                    <label htmlFor="itr_year" className="block">2316 / ITR for the year:</label>
                                    <input 
                                      disabled type="text" id="itr_year" className='mt-1 block w-full border rounded-md p-2' 
                                      value={employee.i_itr_year}
                                    />
                                  </div>
  
                            <div>
                                <label htmlFor="reason_request" className="block">Reason of Request:</label>
                                <textarea id="reason_request" className='mt-1 block w-full border rounded-md p-2 h-14 ' disabled
                                  
                                >{employee.i_reason_request}</textarea>
                            </div>
                            
                          </form> 
                        </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                    
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Form</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
        
              </li>
            
            </ul>
          </div>
          </>

        );
      },
    },
  ];

  const [page_, setPage] = useState(0);
  const [itrPending, setItrData] = useState<PendingITR[]>([]);
  const rowsPerPage = 10;

  const fetch_pending_itr_for_hr = async () => {
    try {
      const formdata = new FormData();
      formdata.append("limit", rowsPerPage.toString());
      formdata.append("current_page", [page_].toString());
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_pending_itr_for_hr`,
        formdata
      );
      console.log("response ini: ", response.data)
      setItrData(response.data)
      //return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };
  const fetch_count_pending_itr_for_hr = async () => {
    try {
      const formdata = new FormData();
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_count_pending_itr_for_hr`,
        formdata
      );return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };



  useEffect(() => {
    refetchCount();
    fetch_pending_itr_for_hr();
  }, [page_])
  
  const next = () => {
    if ((page_ + 1) * rowsPerPage < itrCount) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const prev = () => {
    if (page_ > 0) {
      setPage(prevPage => prevPage - 1);
    }
  };

  // const { data: itrPending = [], refetch: refetchPending } = useQuery({
  //   queryKey: ['itr_pending'], 
  //   queryFn: fetch_pending_itr_for_hr,
  //   staleTime: 10 * 1000,
  //   refetchOnWindowFocus: true,
  //   refetchOnReconnect: true,
  //   refetchOnMount: true,
  // });

  const { data: itrCount, refetch: refetchCount } = useQuery({
    queryKey: ['itr_count'],
    queryFn: fetch_count_pending_itr_for_hr,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: itrPending, // Use fetched data
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [filterBy, setFilterBy] = useState("id_no");

  return (
    <>
     <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-1 text-gray-600">
              Filter by <ChevronDown className="h-4 w-4 ms-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="capitalize">
            {table.getAllColumns().slice(0, -1).map((column) => (
              <DropdownMenuItem
                key={column.id}
                onSelect={() => setFilterBy(column.id.toString())}
              >
                {column.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder={filterBy.charAt(0).toUpperCase() + filterBy.slice(1) + ' . . .'}
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterBy)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody style={{fontFamily: "Poppins, sans-serif", fontWeight: 410}} className=" text-xs text-gray-900">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {(rowsPerPage * page_) + 1} - {Math.min(rowsPerPage * (page_ + 1), itrCount)} of {itrCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => prev()}
            disabled={page_ === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => next()}
            disabled={(page_ + 1) * rowsPerPage >= itrCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </>
   
  );
}
