import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { API_SERVER_URL } from "@/config";
import axios from "axios";
import { useMutation } from '@tanstack/react-query';
import useStore from "./store";
import { MdErrorOutline } from "react-icons/md";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
import { IoInformationCircleOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";

interface intEmpDatabase {
    status: string,
    first_name: string,
    idno: string, 
    job_job_title: string, 
    last_name: string, 
    picture_location: string, 
    type: string, 
  }

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Label } from "@/components/ui/label"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
//import { useQuery } from "@tanstack/react-query";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"



const schema = z.object({
    uname: z.string().min(1, { message: "Name is required." }),
    pass: z.string().min(1, { message: "Password is required." }),
});
type FormData = z.infer<typeof schema>;

interface loginCred {
    uname?: string;
    pass?: string;
}

function LoginEmployee() {
    const [empDatabase, setEmpDatabase] = useState<intEmpDatabase | undefined>(undefined);
    const { empData, setEmpData } = useStore();
    const navigate = useNavigate();
    const [empStatus, setEmpStatus] = useState("None")
    const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [loginAs, setLoginAs] = useState("")

    const login = async (userPass: loginCred) => {
        try {
            const formdata = new FormData();
            formdata.append("data", JSON.stringify(userPass));
            const response = await axios.post(`${API_SERVER_URL}/Api/login`, formdata);
            return response;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Important to throw error to catch it in onError
        }
    };

    const { mutate, isLoading } = useMutation(login, {
        onSuccess: (data) => {
            const response = data;
            // console.log("DONE! done", typeof response_ini.data.res.code);
            if (response.data.res.code !== 0) {

                if(response.data.res.message.includes('<br>')){
                const message = response.data.res.message;
                // Function to extract remaining tries from the message
                const extractRemainingTries = (msg: string): number | null => {
                const regex = /Remaining Tries: (\d+)/;
                const match = msg.match(regex);
                return match ? parseInt(match[1], 10) : null;
                };
                // Parse the message
                const tries = extractRemainingTries(message);
                if (tries !== null) {
                    toast.error('', {
                        className: 'my-classname',
                        description: <div className="ms-4 font-semibold">
                            <p>Incorrect password</p>
                            <p>Remaining Tries: {tries}</p>
                        </div>,
                        duration: 5500,
                        icon: <MdErrorOutline className="h-5 w-5" />,
                      });
                }
                }else{
                    toast.error('', {
                        className: 'my-classname',
                        description: <p className="font-semibold">{response.data.res.message}</p>,
                        duration: 5500,
                        icon: <MdErrorOutline className="h-5 w-5" />,
                      });
                }
               
                //   alert(response.data.res.message)
            } else {
                if(response.data.res.message.job_job_title == 'PROGRAMMER' || response.data.res.message.job_job_title == 'HRD STAFF' && response.data.res.message.department == 'SOFTWARE'){
                    setEmpDatabase(response.data.res.message)
                    openLoginAsDialog()
                }else{
                    const myObject = {
                        status: 'active',
                        first_name: response.data.res.message.first_name,
                        idno: response.data.res.message.idno,
                        job_job_title: response.data.res.message.job_job_title,
                        last_name: response.data.res.message.last_name,
                        picture_location: response.data.res.message.picture_location,
                        type: 'employee',
                      };
                    setEmpData(myObject);
                    navigate("/ITR");
                }
               
            }
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });

    const onSubmit = (data: FormData) => {
        mutate(data);
    };


// USE EFFECT
    useEffect(() => {
        if (isLoading) {
            console.log("Loading...");
        }
    }, [isLoading]);

    useEffect(() => {
        openDialog();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
          if (empData && Object.keys(empData).length > 0) {
            if(empData.status != ''){
                if(empData.type == 'hr'){
                    navigate('/HR-ITR')
                }else if(empData.type == 'employee'){
                    navigate('/ITR')
                }
            }
          } 
        }, 10); // Delay for 5 seconds
      
        // Cleanup function to clear the timeout
        return () => clearTimeout(timer);
      }, [empData]); // Runs when empData changes

    const [isOpen, setIsOpen] = useState(false);
    const [formStatus, setFormStatus] = useState(false);
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => {
        if(empStatus != "None"){
            if(empStatus == "resigned"){
                // const myObject = {
                setFormStatus(true)
                // navigate("/ITR")
                // setIsOpen(false)
            }else{
                setFormStatus(false);
                setIsOpen(false);
            }
        }else{
            toast.info('', {
                className: 'my-classname',
                description: <div className="ms-4 font-semibold">Please make a selection!</div>,
                duration: 2500,
                icon: <IoInformationCircleOutline className="h-5 w-5" />,
            });
        }
      
    };
    const closeResignedForm = () => {
        setFormStatus(false)
        openDialog();
    };
    const [openLoginAsForm, setOpenLoginAsForm] = useState(false)
    const openLoginAsDialog = () => {
        setOpenLoginAsForm(true);
    }
    const closeLoginAsDialog = (empDatabase: intEmpDatabase) => {
        if(loginAs == 'hr'){
            const myObject = {
                status: 'active',
                first_name: empDatabase.first_name,
                idno: empDatabase.idno,
                job_job_title: empDatabase.job_job_title,
                last_name: empDatabase.last_name,
                picture_location: empDatabase.picture_location,
                type: 'hr',
              };
            setEmpData(myObject);
            navigate("/HR-ITR");
           }else if(loginAs == 'employee'){
            const myObject = {
                status: 'active',
                first_name: empDatabase.first_name,
                idno: empDatabase.idno,
                job_job_title: empDatabase.job_job_title,
                last_name: empDatabase.last_name,
                picture_location: empDatabase.picture_location,
                type: 'employee',
              };
            setEmpData(myObject);
            navigate("/ITR");
        }else if(loginAs == ''){
            toast.info('', {
                className: 'my-classname',
                description: <div className="ms-4 font-semibold">Please make a selection!</div>,
                duration: 2500,
                icon: <IoInformationCircleOutline className="h-5 w-5" />,
            });
        }
    }

    const submitResignedForm = () => {
         const myObject = {
            status: 'resigned',
            first_name: fname,
            idno: '',
            job_job_title: 'Resigned User',
            last_name: lname,
            picture_location: 'http://idcsi-officesuites.com:8080/hrms/elfinder/files/.profile_pic/FPZG_1684815634.jpg',
            type: 'employee',
        };
        setEmpData(myObject);
        setIsOpen(false);
        setFormStatus(false)
        navigate("/ITR")
    };
    

    return (
        <>
        <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className={`${formStatus ? 'w-96' : 'w-fit'}`}>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isOpen && !formStatus  ? 'Employee Status' : ' Fill out the form'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isOpen && !formStatus ? (
                            <div className="mt-5">
                            <p className="mb-1">Are you active or resigned?</p>
                            <Select onValueChange={(value) => setEmpStatus(value)}>
                                <SelectTrigger className="w-[163px]">
                                    <SelectValue placeholder={empStatus != "None" ? empStatus : "My Status"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="resigned">Resigned</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                        ):(
                            <form className="mt-5" onSubmit={submitResignedForm}>
                                {/* <p className="mb-1">Are you active or resigned?</p> */}
                                <div className="mb-5">
                                    <div className='flex justify-between'>
                                        <label htmlFor="fnmae" className="block">First Name</label>
                                    </div>
                                        <input 
                                            required type="text" id="fnmae" className='mt-1 block w-full border rounded-md p-2'
                                        onChange={(e) => setFname(e.target.value)}
                                        />
                                        
                                </div>
                            
                                <div>
                                <div className='flex justify-between'>
                                    <label htmlFor="lname" className="block">Last Name</label>
                                </div>
                                    <input 
                                        required type="text" id="lname" className='mt-1 block w-full border rounded-md p-2'
                                        onChange={(e) => setLname(e.target.value)}
                                    />
                                    
                                </div>
                                <div className="w-full flex justify-end gap gap-x-4">
                                <Button  onClick={closeResignedForm} className="mt-10">Back</Button>
                                <Button type="submit"  className="mt-10">Submit</Button>
                                </div>
                                {/* <Button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 ">Submit</Button> */}
                            </form>
                        )}
                       
                   
                    </AlertDialogDescription>
                </AlertDialogHeader>
                    <AlertDialogFooter>
                    {/* <AlertDialogAction onClick={closeDialog} className="h-8">Submit</AlertDialogAction> */}
                    {isOpen && !formStatus  && ( <Button onClick={closeDialog} className="mt-10">Submit</Button>)}
                   
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
        </div>
         <div>
            <AlertDialog open={openLoginAsForm} onOpenChange={setOpenLoginAsForm}>
                <AlertDialogContent className="w-fit">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Login as:
                        </AlertDialogTitle>
                    <AlertDialogDescription>
                    <div className="mt-5 mb-5">
                            <Select 
                            onValueChange={(value) => setLoginAs(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder='Choose'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="hr">Hr</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                    <AlertDialogFooter>
                    <Button onClick={() => setOpenLoginAsForm(false)} className="h-8">Back</Button> 
                    <Button onClick={() => closeLoginAsDialog(empDatabase!)} className="h-8">Submit</Button> 
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
        </div> 
         <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
         <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center gap-3">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="uname">Username</Label>
                            <Input disabled={isLoading} id="uname" {...register("uname")} className=" uppercase" required/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="pass">Password</Label>
                            <Input disabled={isLoading} id="pass" type="password" {...register("pass")} required/>
                        </div>
                        <div className="flex">
                            <Label >Status:</Label>
                            <Label className="hover:cursor-pointer ms-1 underline text-green-700 hover:text-green-600" onClick={()=> !isLoading && openDialog()}>{empStatus}</Label>
                            <div className={`w-2 h-2 mt-1 ms-1 rounded-full  ${empStatus == 'active' ? 'bg-green-700' : 'bg-red-700'}`}/>
                        </div>
                    </div>
                    <CardFooter className="flex justify-end p-0 mt-10 w-full">
                        {/* <CgSpinner className=" animate-spin inline w-4 h-4 me-3 text-white  border border-red-600" /> */}
                        <Button disabled={isLoading} type="submit" className="w-full">{isLoading ? <div className="flex"><CgSpinner className=" animate-spin inline w-5 h-5 me-3 text-white" /> <p>Logging in . . .  .</p></div> : 'Login'}</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>

            {/* <form className="w-96 mx-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <label htmlFor="uname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text" id="id="pass"" className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                        {...register("uname")}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="pass" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="pass" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                        {...register("pass")}
                    />
                </div>
                <div className="mb-4 flex">
                    <p className="text-sm font-semibold">Status: </p>
                    <p className="hover:text-blue-600 hover:cursor-pointer text-sm font-semibold ms-1 text-green-600" onClick={()=> openDialog()}>{empStatus}</p>
                </div>
                <button disabled={isLoading} type="submit" className="text-white flex justify-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
                
                <svg aria-hidden="true" role="status"
                className={`inline w-4 h-4 me-3 text-white animate-spin ${!isLoading && 'hidden'}`}
                //  className="inline w-4 h-4 me-3 text-white animate-spin border border-red-600" 
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                    {isLoading ? 'Logging in . . . ' : 'Login'}
                </button>
               
            </form> */}
        </div>
        </>
       
    );
}

export default LoginEmployee;
