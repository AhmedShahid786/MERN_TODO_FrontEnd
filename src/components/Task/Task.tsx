//? Import libraries and functional components
import React from "react";
import axios from "axios";
import { routes } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/context/AuthContext";

//? Import UI components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

//? Define the TaskProps interface
interface TaskProps {
  task: {
    _id: string;
    title: string;
    description: string;
    isCompleted: boolean;
  };
  ind: number;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
}

export default function Task({ task, ind, setRefetch, user }: TaskProps) {
  //* Destructure the task object
  const { _id, title, description, isCompleted } = task;
  const { toast } = useToast();

  //* Function to mark task as completed using the task id
  const markTaskCompleted = () => {
    axios
      .put(
        routes.updateTask + _id,
        { isCompleted: true },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      )
      .then(() => {
        toast({
          title: "Task Completed",
          description: "Task marked as completed",
        });
        setRefetch((prev) => !prev);
      })
      .catch((err) => {
        console.log("err", err);
        toast({
          title: "Oops!",
          description: "Something went wrong. Please try again.",
        });
      });
  };

  //* Function to mark task as pending using the task id
  const markTaskPending = () => {
    axios
      .put(
        routes.updateTask + _id,
        { isCompleted: false },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      )
      .then(() => {
        toast({
          title: "Task Pending.",
          description: "Task marked as pending.",
        });
        setRefetch((prev) => !prev);
      })
      .catch((err) => {
        console.log("err", err);
        toast({
          title: "Oops!",
          description: "Something went wrong. Please try again.",
        });
      });
  };

  //* Function to delete task from the database using the task id
  const deleteTaskFromDb = () => {
    axios
      .delete(routes.deleteTask + _id, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then(() => {
        toast({
          title: "Task Deleted",
          description: "Task deleted successfully",
        });
        setRefetch((prev) => !prev);
      })
      .catch((err) => {
        console.log("err", err);
        toast({
          title: "Oops!",
          description: "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-2 border-primary rounded-lg px-2"
    >
      <AccordionItem value={`item-${ind}`}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {description}

          <div className="flex gap-3">
            {isCompleted ? (
              <Button size="sm" onClick={markTaskPending}>
                Mark As Pending
              </Button>
            ) : (
              <Button size="sm" onClick={markTaskCompleted}>
                Mark As Done
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={deleteTaskFromDb}>
              Delete
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
