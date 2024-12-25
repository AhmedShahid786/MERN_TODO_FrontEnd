"use client";

//? Import libraries and functional components
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { routes } from "@/constants/routes";
import Cookies from "js-cookie";

//? Import UI components
import Task from "@/components/Task/Task";
import AddTask from "@/components/AddTask/AddTask";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

//? Define the Task interface
interface Task {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export default function Home() {
  //* Get the user from the AuthContext
  const { user, setUser } = useContext(AuthContext)!;

  //* Define the state variables
  const [tasks, setTasks] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const [loading, setLoading] = useState(false);

  //* Get the router object
  const router = useRouter();

  useEffect(() => getTasks(), [user, reFetch]);

  //* Function to fetch user's tasks from the server
  const getTasks = () => {
    setLoading(true);
    axios
      //* Make a GET request to the server and pass the token in authorization header
      .get(routes.getTask, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      //* If the request is successful, set the tasks and stop loader
      .then((res) => {
        setTasks(res?.data?.data);
        setLoading(false);
      })
      //* If the request fails, log the error to console and stop loader
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  //* Function to logout the user by deleting the token from the cookies and setting the user state to null
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };
  return (
    <main className="w-full flex flex-col items-center justify-center gap-6">
      <p className="text-white text-xl font-poppins">
        Welcome, {user?.user?.fullname}!
      </p>
      <div className="w-2/3 sm:w-1/2 flex items-center justify-between border-2 border-primary rounded-lg p-2">
        <p className="text-white text-base font-orbitron font-medium tracking-wider">
          Tasks
        </p>
        <AddTask setReFetch={setReFetch} />
      </div>
      {/* If loading is true, show the loader, else show the tasks */}
      {loading ? (
        <div className="w-1/2 h-40 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary h-12 w-12" />
        </div>
      ) : (
        <div className="w-1/2 flex-1 flex flex-col items-center justify-center gap-3 pb-6 overflow-scroll">
          {tasks.length != 0 ? (
            tasks.map((task: Task, ind) => (
              <Task task={task} ind={ind} setRefetch={setReFetch} user={user} />
            ))
          ) : (
            <p className="text-primary text-base md:text-lg font-poppins">
              You've not added any tasks yet.
            </p>
          )}
        </div>
      )}

      {/* Logout Button */}
      <Button
        onClick={logout}
        className="absolute left-[75%] md:left-[90%] top-[1.5rem]"
      >
        Logout
      </Button>
    </main>
  );
}
