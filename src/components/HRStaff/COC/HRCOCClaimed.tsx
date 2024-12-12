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
  // import { Textarea } from "@/components/ui/textarea"
  // import { Label } from "@/components/ui/label"
  import { BadgeCheck, ChevronDown, Trash2 } from "lucide-react";
  import { IoEye } from "react-icons/io5";
  // import { MdEdit, MdErrorOutline } from "react-icons/md";
  import { useEffect, useState } from "react";
  // import { useQuery } from "@tanstack/react-query";
  import { API_SERVER_URL } from "@/config";
  import { Button } from "@/components/ui/button";
  import { toast } from 'sonner';
  // import { X } from 'lucide-react';
  // import useStore from "@/components/Employee/LoginPage/store";
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
    AlertDialogAction,
     AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  // import {
  //   Accordion,
  //   AccordionContent,
  //   AccordionItem,
  //   AccordionTrigger,
  // } from "@/components/ui/accordion"
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
    // DialogDescription,
    DialogHeader,
    // DialogTitle,
    DialogTrigger,
    // DialogFooter,
  } from "@/components/ui/dialog"
  
  export type PendingITR = {
    c_archive: string;
    c_req_id: string;
    c_date_hired: string;
    r_date_requested: string;
    c_date_resigned: string;
    c_department: string;
    c_designation: string;
    c_emp_status: string;
    c_employee_name: string;
    c_id: string;
    c_id_no: string;
    c_itr_year: string;
    c_purpose: string;
    c_req_status: string;
    r_mail: string;
  };
  
  
  
  export function DataTableClaimedCOC() {
    // const {empData} = useStore();
    const columns: ColumnDef<PendingITR>[] = [
      {
        accessorKey: "c_id_no",
        header: "Id_no",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_id_no") != "" ? row.getValue("c_id_no") : "-"}</div>,
      },
      {
        accessorKey: "c_employee_name",
        header: "Employee_name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_employee_name")}</div>,
      },
      {
        accessorKey: "r_date_requested",
        header: "Date_requested",
        cell: ({ row }) => <div className="capitalize">{row.getValue("r_date_requested")}</div>,
      },
      {
        accessorKey: "r_date_approved",
        header: "Date_claimed",
        cell: ({ row }) => <div className="capitalize">{row.getValue("r_date_approved")}</div>,
      },
      {
        accessorKey: "c_department",
        header: "Department",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_department") != "" ? row.getValue("c_department") : "-"}</div>,
      },
      {
        accessorKey: "c_designation",
        header: "Designation",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_designation") != "" ? row.getValue("c_designation") : "-"}</div>,
      },
      {
        accessorKey: "c_emp_status",
        header: "Emp_status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_emp_status")}</div>,
      },
      {
        accessorKey: "c_req_status",
        header: "Req_Status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("c_req_status")}</div>,
      },
      {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
          const employee = row.original;
          const [isOpen, setIsOpen] = useState(false);
          const openDialog = () => {
            setIsOpen(true)
          }
          const remove_from_claim_list = async (id: string) => {
            try {
              const formdata = new FormData();
              formdata.append("id", id);
              const response = await axios.post(
                `${API_SERVER_URL}/Api/remove_from_claim_list`,
                formdata
              );
              toast.success('', {
                className: 'my-classname',
                description: response.data.msg,
                duration: 2500,
                icon: <BadgeCheck className="h-5 w-5 mt-0.5" />,
            });
            fetch_pending_coc_for_hr()
            fetch_count_pending_coc_for_hr()
            } catch (error) {
              console.error("Error fetching data:", error);
              throw error; // Re-throw to allow react-query to handle the error
            }
          }

          return (
            <>
        <div>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='w-96'>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from list?</AlertDialogTitle>
                <AlertDialogDescription>
                  {/* Delete this request */}
                </AlertDialogDescription>
              </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel  className="h-8">No</AlertDialogCancel>
                  <AlertDialogAction onClick={() => remove_from_claim_list(employee.c_req_id)} className="h-8">Yes</AlertDialogAction>
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
                        <div className="bg-[#ff2600] p-1 rounded-sm hover:cursor-pointer" onClick={() => openDialog()}>
                            <Trash2 className="w-4 h-4 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove</p>
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
                                      value={employee.c_employee_name}
                                    />
                                </div>
    
                                {employee.c_emp_status == 'active' && (
                                <div>
                                    <div className='flex justify-between'>
                                        <label htmlFor="department" className="block">Department/Project:</label>
                                    </div>
                                        <input 
                                        disabled type="text" id="department" className='mt-1 block w-full border rounded-md p-2 '
                                        value={employee.c_department}
                                        />
                                    </div>
                                )}
                                
                              
                                {employee.c_emp_status == 'active' && (
                                <div>
                                    <label htmlFor="designation" className="block">Designation:</label>
                                    <input 
                                      disabled type="text" id="designation" className='mt-1 block w-full border rounded-md p-2' 
                                      value={employee.c_designation}
                                    />
                                </div>
                                )}
                              
                                <div>
                                    <label htmlFor="status" className="block">Status:</label>
                                    <input 
                                      disabled type="text" id="status" className='mt-1 block w-full border rounded-md p-2' 
                                      value={employee.c_emp_status}
                                    />
                                </div>
                                
                                {employee.c_emp_status == 'active' && (
                                  <div>
                                    <label htmlFor="date_hired" className="block">Date Hired:</label>
                                    <input 
                                      disabled type="date" id="date_hired" className='mt-1 block w-full border rounded-md p-2' 
                                      value={employee.c_date_hired}
                                    />
                                  </div>
                               )}
    
                              {employee.c_emp_status != 'active' && (
                                    <div>
                                      <label htmlFor="date_resigned" className="block">Date Resigned:</label>
                                      <input 
                                        disabled type="date" id="date_resigned" className='mt-1 block w-full border rounded-md p-2'
                                        value={employee.c_date_resigned}
                                      />
                                  </div>
                               )}
                              <div>
                                  <label htmlFor="purpose" className="block">Purpose:</label>
                                  <textarea id="purpose" className='mt-1 block w-full border rounded-md p-2 h-14 ' disabled
                                  >{employee.c_purpose}</textarea>
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
    const [forSearch, setForSearch] = useState("");
    const [filterBy, setFilterBy] = useState("c_id_no");
    const [itrCount, setItrCount] = useState(0);
  
    const fetch_pending_coc_for_hr = async () => {
      try {
        const formdata = new FormData();
        formdata.append("limit", rowsPerPage.toString());
        formdata.append("current_page", [page_].toString());
        formdata.append("is_pending", 'claimed');
        formdata.append("for_search", forSearch);
        formdata.append("col_type", filterBy.replace('_', '.'));
        const response = await axios.post(
          `${API_SERVER_URL}/Api/fetch_pending_coc_for_hr`,
          formdata
        );
        //console.log("response ini: ", response.data)
        setItrData(response.data)
        //return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw to allow react-query to handle the error
      }
    };
    const fetch_count_pending_coc_for_hr = async () => {
      try {
        const formdata = new FormData();
        formdata.append("is_pending", 'claimed');
        formdata.append("for_search", forSearch);
        formdata.append("col_type", filterBy.replace('_', '.'));
        const response = await axios.post(
          `${API_SERVER_URL}/Api/fetch_count_pending_coc_for_hr`,
          formdata
        );
        setItrCount(response.data)
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw to allow react-query to handle the error
      }
    };
  
    useEffect(() => {
      // refetchCount();
      fetch_count_pending_coc_for_hr();
      fetch_pending_coc_for_hr();
    }, [page_, filterBy, forSearch])
    
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
  
    // const { data: itrCount, refetch: refetchCount } = useQuery({
    //   queryKey: ['itr_count'],
    //   queryFn: fetch_count_pending_coc_for_hr,
    //   staleTime: 10 * 1000,
    //   refetchOnWindowFocus: true,
    //   refetchOnReconnect: true,
    //   refetchOnMount: true,
    // });
  
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
                  {column.id.slice(2)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            placeholder={filterBy.slice(2) + ' . . .'}
            // value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
            // onChange={(event) =>
            //   table.getColumn(filterBy)?.setFilterValue(event.target.value)
            // }
            onChange={(e) => setForSearch(e.target.value)}
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
                  {column.id.slice(2)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className=" text-[0.8rem]">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody style={{fontFamily: "Poppins, sans-serif", fontWeight: 410}} className=" text-[0.6rem] text-gray-900">
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
                  <TableCell colSpan={columns.length} className="h-10 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
           {itrCount > 0 ? (rowsPerPage * page_) + 1 : '0' } - {Math.min(rowsPerPage * (page_ + 1), itrCount)} of {itrCount}
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
  