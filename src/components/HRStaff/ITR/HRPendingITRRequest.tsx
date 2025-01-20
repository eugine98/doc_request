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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { IoEye } from "react-icons/io5";
import { MdEdit, MdErrorOutline } from "react-icons/md";
import { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import { API_SERVER_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";
import useStore from "@/components/Employee/LoginPage/store";
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
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
} from "@/components/ui/dialog";

export type PendingITR = {
  i_archive: string;
  i_req_id: string;
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
  r_mail: string;
};

export function DataTableDemo() {
  const { empData } = useStore();
  const columns: ColumnDef<PendingITR>[] = [
    {
      accessorKey: "i_id_no",
      header: "Id_no",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("i_id_no") != "" ? row.getValue("i_id_no") : "-"}
        </div>
      ),
    },
    {
      accessorKey: "i_employee_name",
      header: "Employee_name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("i_employee_name")}</div>
      ),
    },
    {
      accessorKey: "r_date_requested",
      header: "Date_requested",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("r_date_requested")}</div>
      ),
    },
    {
      accessorKey: "i_department",
      header: "Department",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("i_department") != ""
            ? row.getValue("i_department")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "i_designation",
      header: "Designation",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("i_designation") != ""
            ? row.getValue("i_designation")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "i_emp_status",
      header: "Emp_status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("i_emp_status")}</div>
      ),
    },
    {
      accessorKey: "i_req_status",
      header: "Req_Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("i_req_status")}</div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;
        const [requestStatus, setRequestStatus] = useState(0);
        const [isOpen, setIsOpen] = useState(false);
        const openDialog = () => {
          set_mail(employee.r_mail);
          //getMail(empID)
          setIsOpen(true);
        };
        const closeDialog = async () => {
          requestStatus == 8 &&
            (await update_req_status(
              employee.i_req_id,
              employee.i_id,
              "",
              "",
              "",
              "true"
            ));
          set_mail("");
          await fetch_count_pending_itr_for_hr();
          await fetch_pending_itr_for_hr();
          setIsOpen(false);
        };
        const [isOpenRejectConfirm, setIsOpenRejectConfirm] = useState(false);
        const [req_id, setReqId] = useState("");
        const [id, setId] = useState("");
        const [receiptName, setReceiptName] = useState("");
        const confirmRejection = async (
          req_id: string,
          id: string,
          receiptName: string
        ) => {
          if (rejection_reason != "" && mail != "" && mail != undefined) {
            setReqId(req_id);
            setId(id);
            setReceiptName(receiptName);
            setIsOpenRejectConfirm(true);
          } else {
            if (rejection_reason == "") {
              toast.error("", {
                className: "my-classname",
                description: "No reason was provided. Please enter one.",
                duration: 2000,
                icon: <MdErrorOutline className="h-5 w-5" />,
              });
            } else if (mail == "") {
              toast.error("", {
                className: "my-classname",
                description: "No email was provided. Please enter one.",
                duration: 2000,
                icon: <MdErrorOutline className="h-5 w-5" />,
              });
            }
          }
        };

        const update_req_status = async (
          req_id: string,
          id: string,
          req_status: string,
          action: string,
          doc_type: string,
          update_archive: string
        ) => {
          try {
            const formdata = new FormData();
            formdata.append("id", id);
            formdata.append("req_id", req_id);
            formdata.append("req_status", req_status);
            formdata.append("doc_type", doc_type);
            formdata.append("action", action);
            formdata.append("update_archive", update_archive);
            await axios.post(
              `${API_SERVER_URL}/Api/update_req_status`,
              formdata
            );
            //const data = JSON.parse(response.data); // Parse the JSON string into an object
            // console.log("THIS IS PENDING REQUEST", data); // Now this will be "object"
            // return data;
          } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Important to throw error to catch it in onError
          }
        };

        const [reqID, setReqID] = useState("");
        const [ID, setID] = useState("");
        const [reqStatus, setReqStatus] = useState("");
        const [buttonType, setButtonType] = useState("");
        const [docType, setDocType] = useState("");
        const update_status = async (
          req_id: string,
          id: string,
          req_status: string,
          button_type: string,
          doc_type: string,
          receiptName: string
        ) => {
          setReqID(req_id);
          setID(id);
          setReqStatus(req_status);
          setButtonType(button_type);
          setDocType(doc_type);
          setReceiptName(receiptName);
          setConfirmUpdate(true);
        };
        const [rejection_reason, set_rejection_reason] = useState("");
        const [mail, set_mail] = useState("");

        // const getMail = async (empID : string) => {
        //   if(mail == ""){
        //     try {
        //       const formdata = new FormData();
        //       formdata.append("idno", empID);
        //       const response = await axios.post(`${API_SERVER_URL}/Api/getMail`, formdata);
        //       set_mail(response.data.res.message.other_email)
        //       //console.log("response data: email:  ", employee.r_mail)
        //       //set_mail(employee.r_mail)
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //         throw error; // Important to throw error to catch it in onError
        //     }
        //   }
        // }
        const reject_request = async (
          req_id: string,
          id: string,
          receiptName: string
        ) => {
          if (rejection_reason != "" && mail != "" && mail != undefined) {
            try {
              const formdata = new FormData();
              formdata.append("req_id", req_id);
              formdata.append("id", id);
              formdata.append("reason_for_reject", rejection_reason);
              formdata.append("table_type", "ITR");
              await axios.post(
                `${API_SERVER_URL}/Api/reject_request`,
                formdata
              );
            } catch (error) {
              console.error("Error fetching data:", error);
              throw error; // Important to throw error to catch it in onError
            }

            fetch_count_pending_itr_for_hr();
            fetch_pending_itr_for_hr();
            send_email(receiptName);
            toast.success("", {
              className: "my-classname",
              description: "Message sent!",
              duration: 2000,
              icon: <MdErrorOutline className="h-5 w-5" />,
            });
          } else {
            if (rejection_reason == "") {
              toast.error("", {
                className: "my-classname",
                description: "No reason was provided. Please enter one.",
                duration: 2000,
                icon: <MdErrorOutline className="h-5 w-5" />,
              });
            } else if (mail == "" && mail != undefined) {
              toast.error("", {
                className: "my-classname",
                description: "No email was provided. Please enter one.",
                duration: 2000,
                icon: <MdErrorOutline className="h-5 w-5" />,
              });
            }
          }
        };
        const send_email = async (receiptName: string) => {
          try {
            const formdata = new FormData();
            formdata.append("header", "ITR Rejection Notice");
            formdata.append("doc_type", "ITR");
            formdata.append("reason", rejection_reason);
            formdata.append("receiptEmailAdd", mail);
            formdata.append("sender", empData.first_name);
            formdata.append("receiptName", receiptName);
            const response = await axios.post(
              `${API_SERVER_URL}/Email/send_email`,
              formdata
            );
            console.log(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        const for_claim_email = async (receiptName: string) => {
          // alert(mail)
          try {
            const formdata = new FormData();
            formdata.append("header", "ITR For Claim");
            formdata.append("doc_type", "ITR");
            formdata.append("receiptEmailAdd", mail);
            formdata.append("sender", empData.first_name);
            formdata.append("receiptName", receiptName);
            const response = await axios.post(
              `${API_SERVER_URL}/Email/for_claim_email`,
              formdata
            );
            console.log(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        const [confirmUpdate, setConfirmUpdate] = useState(false);
        const confirm = async (receiptName: string) => {
          await update_req_status(
            reqID,
            ID,
            reqStatus,
            buttonType,
            docType,
            "false"
          );
          if (buttonType == "done") {
            if (reqStatus == "7") {
              for_claim_email(receiptName);
            }

            setRequestStatus((prevStat) => prevStat + 1);
            toast.success("", {
              className: "my-classname",
              description: (
                <div className="ms-4 font-semibold">
                  <p>Updated!</p>
                </div>
              ),
              duration: 2000,
              icon: <MdErrorOutline className="h-5 w-5" />,
            });
          } else {
            setRequestStatus((prevStat) => prevStat - 1);
          }
          setReqID("");
          setID("");
          setReqStatus("");
          setButtonType("");
          setDocType("");
        };
        return (
          <>
            <div>
              <AlertDialog open={confirmUpdate} onOpenChange={setConfirmUpdate}>
                <AlertDialogContent className="w-96">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Marked this task {buttonType}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {/* Task: For Validate! */}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="h-8">No</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => confirm(receiptName)}
                      className="h-8"
                    >
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div>
              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="w-1/2 ">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <div className="flex justify-between">
                        <p> ITR/2316</p>
                        <div className="">
                          <X
                            className="p-1 text-gray-600 hover:text-gray-900  rounded-sm hover:cursor-pointer"
                            onClick={() => closeDialog()}
                          />
                        </div>
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="">
                        <p> Name: {employee.i_employee_name}</p>
                        <p className="capitalize">
                          Status: {employee.i_emp_status}
                        </p>
                        <p>
                          {" "}
                          Id no:{" "}
                          {employee.i_emp_status == "active"
                            ? employee.i_id_no
                            : "####"}
                        </p>
                      </div>
                    </AlertDialogDescription>
                    <Accordion type="single" collapsible className="w-full ">
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          className={` ${
                            requestStatus > 0
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Hr Staff to validate the request form
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            {requestStatus > 0 ? (
                              <p>Done!</p>
                            ) : (
                              <p className="font-medium text-xs">
                                Click 'Done' if the request form is validated
                                and looks good. <br />
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
                                      // onClick={() => getMail()}
                                    >
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-[450px] h-fit">
                                    <DialogHeader>
                                      <DialogTitle>Are you sure?</DialogTitle>
                                      <DialogDescription className="pb-5">
                                        Once you send this message, request will
                                        be rejected!
                                      </DialogDescription>
                                      <div className="mb-5">
                                        <Label htmlFor="" className="">
                                          To:
                                        </Label>
                                        <Input
                                          required
                                          type="email"
                                          defaultValue={employee.r_mail}
                                          placeholder="test@gmail.com"
                                          onChange={(e) =>
                                            set_mail(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="" className="">
                                          Reason:
                                        </Label>
                                        <Textarea
                                          required
                                          id="rejection_reason"
                                          rows={6}
                                          onChange={(e) =>
                                            set_rejection_reason(e.target.value)
                                          }
                                        />
                                      </div>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <div className="flex justify-between mt-5 w-full">
                                        <p className="flex justify-start text-xs mt-3 text-red-600">
                                          *Check the email before sending, as it
                                          may be incomplete.
                                        </p>
                                        <Button
                                          type="submit"
                                          className=""
                                          onClick={() =>
                                            confirmRejection(
                                              employee.i_req_id,
                                              employee.i_id,
                                              employee.i_employee_name
                                            )
                                          }
                                        >
                                          Send
                                        </Button>
                                      </div>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "1",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "0",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 1
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Hr Staff to submit the request form to the HR Manager
                          for her sign
                          {/* <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(HR Manageer)</span>
                              </div> */}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 1 ? (
                                <p>Done!</p>
                              ) : requestStatus == 1 ? (
                                <p className="font-medium text-xs">
                                  Click "Done" if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )}
                            </div>
                            {requestStatus == 1 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "2",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "1",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2.0">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 2
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Hr Staff will transmit the signed request form to
                          Accounting Staff
                          {/* <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(HR Manageer)</span>
                              </div> */}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 2 ? (
                                <p>Done!</p>
                              ) : requestStatus == 2 ? (
                                <p className="font-medium text-xs">
                                  Click 'Done' if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )}
                            </div>
                            {requestStatus == 2 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "3",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "2",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 3
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Accounting Staff will process the ITR/2316.
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 3 ? (
                                <p>Done!</p>
                              ) : requestStatus == 3 ? (
                                <p className="font-medium text-xs">
                                  Click 'Done' if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )}
                            </div>
                            {requestStatus == 3 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "4",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "3",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 4
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Accounting Staff will give the ITR/2316 to their
                          Accounting Manager for her sign.
                          {/* <div className="flex justify-start">
                                <p>
                                For Sign
                                </p>
                               <span className="text-[0.7rem] ms-2">(Accounting Manager)</span>
                              </div> */}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 4 ? (
                                <p>Done!</p>
                              ) : requestStatus == 4 ? (
                                <p className="font-medium text-xs">
                                  Click 'Done' if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )
                              //<p className="font-medium text-xs">Click 'Done' if the form is signed by the Accounting Manager.</p>
                              }
                            </div>
                            {requestStatus == 4 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "5",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "4",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 5
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Accounting Staff will transmitted back the Signed
                          ITR/2316 to Hr Staff
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 5 ? (
                                <p>Done!</p>
                              ) : requestStatus == 5 ? (
                                <p className="font-medium text-xs">
                                  Click 'Done' if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )
                              //<p className="font-medium text-xs">Click 'Done' if the ITR is returned to HR staff.</p>
                              }
                            </div>
                            {requestStatus == 5 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "6",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
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
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "5",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Undone
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-6">
                        <AccordionTrigger
                          className={`${
                            requestStatus > 6
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          Hr Staff to notify the EE
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            {requestStatus > 6 ? (
                              <p>Done!</p>
                            ) : requestStatus == 6 ? (
                              <p className="font-medium text-xs">
                                Click 'Done' if this task is complete.
                              </p>
                            ) : (
                              <p className="font-medium text-xs">Undone!</p>
                            )
                            //<p className="font-medium text-xs">Click 'Done' if you have notified the employee to claim the ITR.</p>
                            }
                          </div>
                          {requestStatus == 6 && (
                            <div className="w-full space-x-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                onClick={() =>
                                  update_status(
                                    employee.i_req_id,
                                    employee.i_id,
                                    "7",
                                    "done",
                                    "ITR",
                                    employee.i_employee_name
                                  )
                                }
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
                                onClick={() =>
                                  update_status(
                                    employee.i_req_id,
                                    employee.i_id,
                                    "6",
                                    "undone",
                                    "ITR",
                                    ""
                                  )
                                }
                              >
                                Undone
                              </Button>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-7">
                        <AccordionTrigger
                          className={`  ${
                            requestStatus > 7
                              ? "text-green-600 text-[0.8rem] pt-3 pb-3"
                              : "text-red-600 text-[0.8rem] pt-3 pb-3"
                          }`}
                        >
                          EE to claim and sign the receiving copy.
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <div>
                              {requestStatus > 7 ? (
                                <p>Done!</p>
                              ) : requestStatus == 7 ? (
                                <p className="font-medium text-xs">
                                  Click 'Done' if this task is complete.
                                </p>
                              ) : (
                                <p className="font-medium text-xs">Undone!</p>
                              )
                              //<p className="font-medium text-xs">Click 'Done' if the ITR has been claimed.</p>
                              }
                            </div>
                            {requestStatus == 7 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "8",
                                      "done",
                                      "ITR",
                                      ""
                                    )
                                  }
                                >
                                  Done
                                </Button>
                              </div>
                            )}
                            {requestStatus == 8 && (
                              <div className="w-full space-x-1 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-600 text-white hover:bg-red-500 hover:text-white"
                                  onClick={() =>
                                    update_status(
                                      employee.i_req_id,
                                      employee.i_id,
                                      "7",
                                      "undone",
                                      "ITR",
                                      ""
                                    )
                                  }
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
            <div>
              <AlertDialog
                open={isOpenRejectConfirm}
                onOpenChange={setIsOpenRejectConfirm}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Click Yes to reject the request and send the message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="h-8">No</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => reject_request(req_id, id, receiptName)}
                      className="h-8"
                    >
                      Yes
                    </AlertDialogAction>
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
                        <div
                          className="bg-orange-600 p-1 rounded-sm hover:cursor-pointer"
                          onClick={() => {
                            openDialog();
                            if (
                              employee.i_req_status ==
                              "Hr Staff to validate the request form"
                            ) {
                              setRequestStatus(0);
                            } else if (
                              employee.i_req_status ==
                              "Hr Staff to submit the request form to the HR Manager for her sign"
                            ) {
                              setRequestStatus(1);
                            } else if (
                              employee.i_req_status ==
                              "Hr Staff will transmit the signed request form to Accounting Staff"
                            ) {
                              setRequestStatus(2);
                            } else if (
                              employee.i_req_status ==
                              "Accounting Staff will process the ITR/2316."
                            ) {
                              setRequestStatus(3);
                            } else if (
                              employee.i_req_status ==
                              "Accounting Staff will give the ITR/2316 to their Accounting Manager for her sign."
                            ) {
                              setRequestStatus(4);
                            } else if (
                              employee.i_req_status ==
                              "Accounting Staff will transmitted back the Signed ITR/2316 to Hr Staff"
                            ) {
                              setRequestStatus(5);
                            } else if (
                              employee.i_req_status ==
                              "Hr Staff to notify the EE"
                            ) {
                              setRequestStatus(6);
                            } else if (
                              employee.i_req_status ==
                              "EE to claim and sign the receiving copy."
                            ) {
                              setRequestStatus(7);
                            } else if (employee.i_req_status == "Done") {
                              setRequestStatus(8);
                            }
                          }}
                        >
                          <MdEdit className="w-4 h-4 text-white" />
                        </div>
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
                                <form
                                  className="w-full space-y-4 p-3 bg-white rounded shadow-md text-gray-700 text-[0.65rem] font-medium"
                                  style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                  <div>
                                    <div className="flex justify-between">
                                      <label
                                        htmlFor="date_requested"
                                        className="block"
                                      >
                                        Date Requested:
                                      </label>
                                    </div>
                                    <input
                                      disabled
                                      type="date"
                                      id="date_requested"
                                      className="mt-1 block w-full border rounded-md p-2"
                                      value={employee.r_date_requested}
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between">
                                      <label
                                        htmlFor="employee-name"
                                        className="block"
                                      >
                                        Employee Name:
                                      </label>
                                    </div>
                                    <input
                                      disabled
                                      type="text"
                                      id="employee_name"
                                      className="mt-1 block w-full border rounded-md  p-2"
                                      value={employee.i_employee_name}
                                    />
                                  </div>

                                  {employee.i_emp_status == "active" && (
                                    <div>
                                      <div className="flex justify-between">
                                        <label
                                          htmlFor="department"
                                          className="block"
                                        >
                                          Department/Project:
                                        </label>
                                      </div>
                                      <input
                                        disabled
                                        type="text"
                                        id="department"
                                        className="mt-1 block w-full border rounded-md p-2 "
                                        value={employee.i_department}
                                      />
                                    </div>
                                  )}

                                  {employee.i_emp_status == "active" && (
                                    <div>
                                      <label
                                        htmlFor="designation"
                                        className="block"
                                      >
                                        Designation:
                                      </label>
                                      <input
                                        disabled
                                        type="text"
                                        id="designation"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        value={employee.i_designation}
                                      />
                                    </div>
                                  )}

                                  <div>
                                    <label htmlFor="status" className="block">
                                      Status:
                                    </label>
                                    <input
                                      disabled
                                      type="text"
                                      id="status"
                                      className="mt-1 block w-full border rounded-md p-2"
                                      value={employee.i_emp_status}
                                    />
                                  </div>

                                  {employee.i_emp_status == "active" && (
                                    <div>
                                      <label
                                        htmlFor="date_hired"
                                        className="block"
                                      >
                                        Date Hired:
                                      </label>
                                      <input
                                        disabled
                                        type="date"
                                        id="date_hired"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        value={employee.i_date_hired}
                                      />
                                    </div>
                                  )}

                                  {employee.i_emp_status != "active" && (
                                    <div>
                                      <label
                                        htmlFor="date_resigned"
                                        className="block"
                                      >
                                        Date Resigned:
                                      </label>
                                      <input
                                        disabled
                                        type="date"
                                        id="date_resigned"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        value={employee.i_date_resigned}
                                      />
                                    </div>
                                  )}

                                  <div>
                                    <label htmlFor="itr_year" className="block">
                                      2316 / ITR for the year:
                                    </label>
                                    <input
                                      disabled
                                      type="text"
                                      id="itr_year"
                                      className="mt-1 block w-full border rounded-md p-2"
                                      value={employee.i_itr_year}
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="reason_request"
                                      className="block"
                                    >
                                      Reason of Request:
                                    </label>
                                    <textarea
                                      id="reason_request"
                                      className="mt-1 block w-full border rounded-md p-2 h-14 "
                                      disabled
                                    >
                                      {employee.i_reason_request}
                                    </textarea>
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
  const [filterBy, setFilterBy] = useState("i_id_no");
  const [itrCount, setItrCount] = useState(0);

  const fetch_pending_itr_for_hr = async () => {
    try {
      const formdata = new FormData();
      formdata.append("limit", rowsPerPage.toString());
      formdata.append("current_page", [page_].toString());
      formdata.append("is_pending", "pending");
      formdata.append("for_search", forSearch);
      formdata.append("col_type", filterBy.replace("_", "."));
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_pending_itr_for_hr`,
        formdata
      );
      //console.log("response ini: ", response.data)
      setItrData(response.data);
      //return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };
  const fetch_count_pending_itr_for_hr = async () => {
    try {
      const formdata = new FormData();
      formdata.append("is_pending", "pending");
      formdata.append("for_search", forSearch);
      formdata.append("col_type", filterBy.replace("_", "."));
      const response = await axios.post(
        `${API_SERVER_URL}/Api/fetch_count_pending_itr_for_hr`,
        formdata
      );
      setItrCount(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to allow react-query to handle the error
    }
  };

  useEffect(() => {
    // refetchCount();
    fetch_count_pending_itr_for_hr();
    fetch_pending_itr_for_hr();
  }, [page_, forSearch, filterBy]);

  useEffect(() => {
    if (forSearch != "") {
      setPage(0);
    }
  }, [forSearch]);

  const next = () => {
    if ((page_ + 1) * rowsPerPage < itrCount) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prev = () => {
    if (page_ > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // const { data: itrCount, refetch: refetchCount } = useQuery({
  //   queryKey: ['itr_count'],
  //   queryFn: fetch_count_pending_itr_for_hr,
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
                Filter by <ChevronDown className="h-4 w-4 ms-2 text-[0.7rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="capitalize">
              {table
                .getAllColumns()
                .slice(0, -1)
                .map((column) => (
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
            placeholder={filterBy.slice(2) + "....."}
            //value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
            // onChange={(event) =>
            //   table.getColumn(filterBy)?.setFilterValue(event.target.value)
            // }
            onChange={(e) => setForSearch(e.target.value)}
            className="max-w-sm me-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
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
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className=" text-[0.8rem] ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 410 }}
              className=" text-[0.65rem] text-gray-900"
            >
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${row.index % 2 !== 1 ? "bg-slate-100" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-10 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {itrCount > 0 ? rowsPerPage * page_ + 1 : "0"} -{" "}
            {Math.min(rowsPerPage * (page_ + 1), itrCount)} of {itrCount}
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
