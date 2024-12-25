//? Import libraries and functional components
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { routes } from "@/constants/routes";

//? Import UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TbLoader2 } from "react-icons/tb";

//? Define the AddTaskProps interface
interface AddTaskProps {
  setReFetch: (value: boolean) => void;
}

export default function AddTask({ setReFetch }: AddTaskProps) {
  const { user } = useContext(AuthContext)!;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  //* Define the task schema using zod
  const taskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  //* Define the form using react-hook-form and infer the type from the schema
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  //* Function to add task to the database
  const addTaskToDb = async (data: z.infer<typeof taskSchema>) => {
    setLoading(true);

    const taskObj = {
      title: data.title,
      description: data.description,
    };

    //* Make a POST request to the server and pass the task object and token in authorization header
    await axios
      .post(routes.addTask, taskObj, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      //* If the request is successful, stop loader, close the dialog and show toast
      .then((res) => {
        console.log("Task added", res.data);
        setLoading(false);
        setOpen(false);
        toast({
          title: "Task Added",
          description: "Task has been added successfully.",
        });
        //* Set reFetch to true to refetch the tasks so that new task is shown
        setReFetch(true);
      })
      //* If the request fails, stop loader and show toast
      .catch((err) => {
        console.log("Error adding task", err);
        setLoading(false);
        setOpen(false);
        toast({
          title: "Task Not Added",
          description: "Task could not be added. Please try again.",
        });
      });
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button size="sm">Add New</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 w-2/3 sm:w-full">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(addTaskToDb)}
                className="space-y-3 w-full"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="text-white font-poppins text-sm border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-poppins">
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="text-white font-poppins text-sm border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {loading ? <TbLoader2 className="animate-spin" /> : "Add"}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
