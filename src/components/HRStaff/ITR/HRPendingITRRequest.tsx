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
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { IoEye } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_SERVER_URL } from "@/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type PendingITR = {
  archive: string;
  date_hired: string;
  date_requested: string;
  date_resigned: string;
  department: string;
  designation: string;
  emp_status: string;
  employee_name: string;
  id: string;
  id_no: string;
  itr_year: string;
  reason_request: string;
  req_status: string;
};

export const columns: ColumnDef<PendingITR>[] = [
  {
    accessorKey: "id_no",
    header: "Id_no",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id_no")}</div>,
  },
  {
    accessorKey: "employee_name",
    header: "Employee_name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("employee_name")}</div>,
  },
  {
    accessorKey: "date_requested",
    header: "Date_requested",
    cell: ({ row }) => <div className="capitalize">{row.getValue("date_requested")}</div>,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div className="capitalize">{row.getValue("department")}</div>,
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => <div className="capitalize">{row.getValue("designation")}</div>,
  },
  {
    accessorKey: "emp_status",
    header: "Emp_status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("emp_status")}</div>,
  },
  {
    accessorKey: "req_status",
    header: "Req_Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("req_status")}</div>,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;
      const [requestStatus, setRequestStatus] = useState(0)

      return (
        <div className="p-1">
          <ul className="flex space-x-3">
          <li>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                <Dialog>
                  <DialogTrigger>
                    <div className="bg-orange-600 p-1 rounded-sm hover:cursor-pointer" onClick={() => {
                      if(employee.req_status == 'For Sign(HR Manager)'){
                        setRequestStatus(1)
                      }else if(employee.req_status == 'Accounting staff processing the ITR/2316'){
                        setRequestStatus(2)
                      }else if(employee.req_status == 'For Sign(Accounting Manager)'){
                        setRequestStatus(3)
                      }else if(employee.req_status == 'Return to HR staff'){
                        setRequestStatus(4)
                      }else if(employee.req_status == 'For Claim'){
                        setRequestStatus(5)
                      }else if(employee.req_status == 'Claimed'){
                        setRequestStatus(6)
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
                          <p> Name: {employee.employee_name}</p>
                          <p className=" capitalize"> Employee Status: {employee.emp_status}</p>
                          <p> Id no: {employee.emp_status == 'active' ? employee.id_no : '----'}</p>
                        </div>
                       
                      </DialogDescription>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className={` ${requestStatus > 0 ? 'text-green-600' : 'text-red-600'}`}>{employee.req_status}</AccordionTrigger>
                        <AccordionContent>
                        <div>
                          <p>
                          Yes. It comes with default styles that matches the other
                          components&apos; aesthetic.
                          </p>
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
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
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
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
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
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
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
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
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
                         </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-6">
                        <AccordionTrigger className={`  ${requestStatus > 5 ? 'text-green-600' : 'text-red-600'}`}>Notif EE to claim the ITR</AccordionTrigger>
                        <AccordionContent>
                          Yes. It&apos;s animated by default, but you can disable it if you
                          prefer.
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
                          <div className="w-full space-x-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                          >
                            Done 
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          >
                            Undone 
                          </Button>
                          </div>
                         
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
            </TooltipProvider>
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
                                value={employee.date_requested}
                              
                            />
                            </div>

                            <div>
                              <div className='flex justify-between'>
                                <label htmlFor="employee-name" className="block">Employee Name:</label>
                              </div>
                                <input 
                                  disabled type="text" id="employee_name" 
                                  className='mt-1 block w-full border rounded-md  p-2' 
                                  value={employee.employee_name}
                                />
                            </div>


                            {employee.emp_status == 'active' && (
                            <div>
                                <div className='flex justify-between'>
                                    <label htmlFor="department" className="block">Department/Project:</label>
                                </div>
                                    <input 
                                    disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                                    value={employee.department}
                                    />
                                </div>
                            )}
                            
                          
                            {employee.emp_status == 'active' && (
                            <div>
                                <label htmlFor="designation" className="block">Designation:</label>
                                <input 
                                  disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                                  value={employee.designation}
                                />
                            </div>
                            )}
                          
                            <div>
                                <label htmlFor="status" className="block">Staus:</label>
                                <input 
                                  disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                                  value={employee.emp_status}
                                />
                            </div>
                            
                            {employee.emp_status == 'active' && (
                              <div>
                                <label htmlFor="date_hired" className="block">Date Hired:</label>
                                <input 
                                  disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                                  value={employee.date_hired}
                                />
                              </div>
                           )}

                          {employee.emp_status != 'active' && (
                                <div>
                                  <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                                  <input 
                                    disabled type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                                    value={employee.date_resigned}
                                  />
                              </div>
                           )}

                            <div>
                                  <label htmlFor="itr_year" className="block">2316 / ITR for the year:</label>
                                  <input 
                                    disabled type="text" id="itr_year" className='mt-1 block w-full border rounded-md p-2' 
                                    value={employee.itr_year}
                                  />
                                </div>

                          <div>
                              <label htmlFor="reason_request" className="block">Reason of Request:</label>
                              <textarea id="reason_request" className='mt-1 block w-full border rounded-md p-2 h-14 ' disabled
                                
                              >{employee.reason_request}</textarea>
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
      );
    },
  },
];

export function DataTableDemo() {
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
      // console.log("response ini: ", response.data)
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
          // value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn(filterBy)?.setFilterValue(event.target.value)
          // }
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
