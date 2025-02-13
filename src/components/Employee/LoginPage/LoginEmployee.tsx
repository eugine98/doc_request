import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { API_SERVER_URL } from "@/config";
import { useMutation } from "@tanstack/react-query";
import useStore from "./store";
import { MdErrorOutline } from "react-icons/md";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IoEyeSharp, IoInformationCircleOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import fpo2 from "../../../assets/img/fpo2.png";

interface intEmpDatabase {
  status: string;
  first_name: string;
  idno: string;
  job_job_title: string;
  last_name: string;
  picture_location: string;
  type: string;
}

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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaEyeSlash } from "react-icons/fa";
import Turnstile from "@/components/Recapcha";

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
  const [recaptchaStatus, setRecaptchaStatus] = useState(false);
  const handleSuccess = (token: string) => {
    // Handle the Turnstile success callback
    // console.log('Turnstile token:', token);

    const formdata = new FormData();

    formdata.append("cf-turnstile-response", token);
    // Send the token to the server for verification
    axios
      .post(`${API_SERVER_URL}/Api/recapcha`, formdata)
      .then(() => {
        setRecaptchaStatus(true);
        //  console.log('Verification success:', response.data);
      })
      .catch((error) => {
        console.error("Verification failed:", error);
        setRecaptchaStatus(false);
        // setErrorMsg(error.toString());
        // setError(true);
      });
    // You can send this token to your server to validate the response
  };

  const [empDatabase, setEmpDatabase] = useState<intEmpDatabase | undefined>(
    undefined
  );
  const { empData, setEmpData } = useStore();
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const navigate = useNavigate();
  const [empStatus, setEmpStatus] = useState("None");
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mail, setMail] = useState("");
  const [loginAs, setLoginAs] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state to show/hide password
  };

  const login = async (userPass: loginCred) => {
    try {
      const formdata = new FormData();
      formdata.append("data", JSON.stringify(userPass));
      const response = await axios.post(
        `${API_SERVER_URL}/Api/login`,
        formdata
      );
      return response;
    } catch (error) {
      toast.error("", {
        className: "my-classname",
        description: "Error fetching data: " + error,
        duration: 2500,
        icon: <IoInformationCircleOutline className="h-5 w-5" />,
      });
      console.error("Error fetching data:", error);
      throw error; // Important to throw error to catch it in onError
    }
  };
  // const user_session = async (myObject: object) => {
  //     try {
  //         // const formdata = new FormData();
  //         // formdata.append("data", JSON.stringify(myObject));
  //         const response = await axios.get(`${API_SERVER_URL}/Api/user_session`);
  //         console.log("inuman SESSION: ", response.data)
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //         throw error; // Important to throw error to catch it in onError
  //     }
  // };
  // const fetch_user_session = async () => {
  //     try {
  //       const response = await axios.get(`${API_SERVER_URL}/Api/fetch_user_session`);
  //       console.log("HELLO WORLD: ", response.data); // Update state with session data
  //     } catch (err) {
  //       const axiosError = err as AxiosError;
  //       if (axiosError.response?.status === 401) {
  //         // Handle session expiration (e.g., redirect to login page)
  //         console.log('Session expired. Please log in again.');
  //       } else {
  //         console.log('Failed to fetch session data.');
  //       }
  //       console.error('Error fetching session data:', err);
  //     }
  //   };

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      const response = data;
      // console.log("DONE! done", typeof response_ini.data.res.code);
      if (response.data.res.code !== 0) {
        if (response.data.res.message.includes("<br>")) {
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
            toast.error("", {
              className: "my-classname",
              description: (
                <div className="ms-4 font-semibold">
                  <p>Incorrect password</p>
                  <p>Remaining Tries: {tries}</p>
                </div>
              ),
              duration: 5500,
              icon: <MdErrorOutline className="h-5 w-5" />,
            });
          }
        } else {
          toast.error("", {
            className: "my-classname",
            description: (
              <p className="font-semibold">{response.data.res.message}</p>
            ),
            duration: 5500,
            icon: <MdErrorOutline className="h-5 w-5" />,
          });
        }

        //   alert(response.data.res.message)
      } else {
        if (
          response.data.res.message.job_job_title == "PROGRAMMER" ||
          (response.data.res.message.job_job_title == "HRD STAFF" &&
            response.data.res.message.department == "SOFTWARE")
        ) {
          setEmpDatabase(response.data.res.message);
          openLoginAsDialog();
        } else {
          const myObject = {
            status: "active",
            first_name: response.data.res.message.first_name,
            idno: response.data.res.message.idno,
            job_job_title: response.data.res.message.job_job_title,
            last_name: response.data.res.message.last_name,
            picture_location: response.data.res.message.picture_location,
            type: "employee",
            mail: "",
          };
          setEmpData(myObject);
          navigate("/ITR");
          // user_session(myObject);
          // fetch_user_session();
        }
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    if (recaptchaStatus) {
      mutate(data);
    }
  };

  // USE EFFECT
  useEffect(() => {
    if (isLoading) {
      // console.log("Loading...");
    }
  }, [isLoading]);

  useEffect(() => {
    // user_session();
    // fetch_user_session();
    openDialog();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (empData && Object.keys(empData).length > 0) {
        if (empData.status != "") {
          if (empData.type == "hr") {
            navigate("/HR-ITR");
          } else if (empData.type == "employee") {
            navigate("/ITR");
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
    if (empStatus != "None") {
      if (empStatus == "resigned") {
        // const myObject = {
        setFormStatus(true);
        // navigate("/ITR")
        // setIsOpen(false)
      } else {
        setFormStatus(false);
        setIsOpen(false);
      }
    } else {
      toast.info("", {
        className: "my-classname",
        description: (
          <div className="ms-4 font-semibold">Please make a selection!</div>
        ),
        duration: 2500,
        icon: <IoInformationCircleOutline className="h-5 w-5" />,
      });
    }
  };
  const closeResignedForm = () => {
    setFormStatus(false);
    openDialog();
  };
  const [openLoginAsForm, setOpenLoginAsForm] = useState(false);
  const openLoginAsDialog = () => {
    setOpenLoginAsForm(true);
  };
  const closeLoginAsDialog = (empDatabase: intEmpDatabase) => {
    if (loginAs == "hr") {
      const myObject = {
        status: "active",
        first_name: empDatabase.first_name,
        idno: empDatabase.idno,
        job_job_title: empDatabase.job_job_title,
        last_name: empDatabase.last_name,
        picture_location: empDatabase.picture_location,
        type: "hr",
        mail: "",
      };
      //   user_session(myObject)
      //   fetch_user_session();
      setEmpData(myObject);
      navigate("/HR-ITR");
    } else if (loginAs == "employee") {
      const myObject = {
        status: "active",
        first_name: empDatabase.first_name,
        idno: empDatabase.idno,
        job_job_title: empDatabase.job_job_title,
        last_name: empDatabase.last_name,
        picture_location: empDatabase.picture_location,
        type: "employee",
        mail: "",
      };
      //   user_session(myObject)
      //   fetch_user_session();
      setEmpData(myObject);
      navigate("/ITR");
    } else if (loginAs == "") {
      toast.info("", {
        className: "my-classname",
        description: (
          <div className="ms-4 font-semibold">Please make a selection!</div>
        ),
        duration: 2500,
        icon: <IoInformationCircleOutline className="h-5 w-5" />,
      });
    }
  };

  const submitResignedForm = () => {
    const myObject = {
      status: "resigned",
      first_name: fname,
      idno: "",
      job_job_title: "Resigned User",
      last_name: lname,
      picture_location:
        "http://idcsi-officesuites.com:8080/hrms/elfinder/files/.profile_pic/FPZG_1684815634.jpg",
      type: "employee",
      mail: mail,
    };
    setEmpData(myObject);
    setIsOpen(false);
    setFormStatus(false);
    navigate("/ITR");
  };

  return (
    <>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className={`${formStatus ? "w-96" : "w-fit"}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isOpen && !formStatus
                  ? "Employee Status"
                  : " Fill out the form"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isOpen && !formStatus ? (
                  <div className="mt-5">
                    <p className="mb-1">Are you active or resigned?</p>
                    <Select onValueChange={(value) => setEmpStatus(value)}>
                      <SelectTrigger className="w-[163px]">
                        <SelectValue
                          placeholder={
                            empStatus != "None" ? empStatus : "My Status"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <form className="mt-5" onSubmit={submitResignedForm}>
                    {/* <p className="mb-1">Are you active or resigned?</p> */}
                    <div className="mb-5">
                      <div className="flex justify-between">
                        <label htmlFor="fnmae" className="block">
                          First Name
                        </label>
                      </div>
                      <input
                        required
                        type="text"
                        id="fnmae"
                        className="mt-1 block w-full border rounded-md p-2"
                        onChange={(e) => setFname(e.target.value)}
                      />
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between">
                        <label htmlFor="lname" className="block">
                          Last Name
                        </label>
                      </div>
                      <input
                        required
                        type="text"
                        id="lname"
                        className="mt-1 block w-full border rounded-md p-2"
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="mail" className="block">
                          Email:
                        </label>
                      </div>
                      <input
                        required
                        type="email"
                        id="mail"
                        className="mt-1 block w-full border rounded-md p-2"
                        onChange={(e) => setMail(e.target.value)}
                      />
                    </div>
                    <div className="w-full flex justify-end gap gap-x-4">
                      <Button onClick={closeResignedForm} className="mt-10">
                        Back
                      </Button>
                      <Button type="submit" className="mt-10">
                        Submit
                      </Button>
                    </div>
                    {/* <Button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 ">Submit</Button> */}
                  </form>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogAction onClick={closeDialog} className="h-8">Submit</AlertDialogAction> */}
              {isOpen && !formStatus && (
                <Button onClick={closeDialog} className="mt-10">
                  Submit
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <AlertDialog open={openLoginAsForm} onOpenChange={setOpenLoginAsForm}>
          <AlertDialogContent className="w-fit">
            <AlertDialogHeader>
              <AlertDialogTitle>Login as:</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="mt-5 mb-5">
                  <Select onValueChange={(value) => setLoginAs(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="hr">Hr/Accounting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setOpenLoginAsForm(false)} className="h-8">
                Back
              </Button>
              <Button
                onClick={() => closeLoginAsDialog(empDatabase!)}
                className="h-8"
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        className="flex items-center justify-center min-h-screen bg-slate-100"
        // style={{
        //     background: 'linear-gradient(0deg, rgba(0,34,68,1) 25%, rgba(0,70,135,1) 100%)',
        // }}
      >
        <div className="w-full sm:flex justify-center sm:justify-normal ml-10 mr-10 lg:ml-52 lg:mr-52 rounded-sm bg-white mt-5 sm:mt-0 mb-5 sm:mb-0">
          <div className="sm:w-1/2 w-full flex-col lg:p-10 lg:pr-5 lg:pl-5 p-16 sm:border-r-[3px] border-b-[3px] sm:border-b-0 border-slate-100 mt-0 sm:mt-12 md:mt-9 lg:mt-0">
            <img src={fpo2} className="flex" alt="Logo" />
            <div className="flex-col mt-2">
              <p className="flex justify-center text-lg">DOCUMENT REQUEST</p>
              <p className="flex justify-center text-[0.54rem] font-medium text-slate-500 italic">
                Integrated with HRMS Credentials
              </p>
            </div>
          </div>
          <Card className="sm:w-1/2 w-full text-black shadow-none rounded-sm bg-inherit border-none">
            <CardHeader>
              <CardTitle className="font-medium">Login</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid w-full items-center gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="uname" className="font-normal">
                      Username
                    </Label>
                    <Input
                      disabled={isLoading}
                      id="uname"
                      {...register("uname")}
                      className=" uppercase"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="pass" className="font-normal">
                      Password
                    </Label>
                    <div className=" relative">
                      <Input
                        disabled={isLoading}
                        id="pass"
                        type={showPassword ? "text" : "password"}
                        {...register("pass")}
                        required
                      />
                      <div className="flex justify-end mr-2">
                        {showPassword ? (
                          <FaEyeSlash
                            className=" absolute top-0 text-slate-800 mt-[0.2rem] h-7 w-7 ml-[16.8rem] hover:cursor-pointer bg-white pl-1 pr-1"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <IoEyeSharp
                            className=" absolute top-0 text-slate-800 mt-[0.2rem] h-7 w-7 ml-[16.8rem] hover:cursor-pointer bg-white pl-1 pr-1"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex mb-5">
                    <Label className="font-normal">Status:</Label>
                    <Label
                      className="hover:cursor-pointer ms-1 underline text-green-700 hover:text-green-600"
                      onClick={() => !isLoading && openDialog()}
                    >
                      {empStatus}
                    </Label>
                    <div
                      className={`w-2 h-2 mt-1 ms-1 rounded-full  ${
                        empStatus == "active" ? "bg-green-700" : "bg-red-700"
                      }`}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-start">
                  <Turnstile
                    sitekey="0x4AAAAAAAiTUc2l5e4SXdWL"
                    onSuccess={handleSuccess}
                  />
                </div>

                <CardFooter className="flex justify-end p-0 mt-5 w-full">
                  {/* <CgSpinner className=" animate-spin inline w-4 h-4 me-3 text-white  border border-red-600" /> */}
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-[#002796]"
                    style={{ background: "#002796" }}
                  >
                    {isLoading ? (
                      <div className="flex">
                        <CgSpinner className=" animate-spin inline w-5 h-5 me-3 text-white" />{" "}
                        <p>Logging in . . . .</p>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default LoginEmployee;
