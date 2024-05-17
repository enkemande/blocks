"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/libs/trpc/client";
import { CreateBlockSchema } from "@/schemas/block";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export type AddBlockFormProps = {
  title: string;
  description: string;
};

type CreateBlockFormType = z.infer<typeof CreateBlockSchema>;

export const AddBlockForm: React.FC<AddBlockFormProps> = ({}) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const createBlock = trpc.block.create.useMutation({
    onSuccess: (data) => {
      router.push(`/${session.data?.user?.username}/${data.name}`);
      setIsOpen(false);
    },
  });

  const form = useForm<CreateBlockFormType>({
    resolver: zodResolver(CreateBlockSchema),
    defaultValues: {
      name: "",
      description: "",
      framework: "react",
      library: "shadcn",
      visibility: "public",
    },
  });

  const onSubmit: SubmitHandler<CreateBlockFormType> = (data) => {
    createBlock.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Block</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Assign a unique name for your block.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe what your block does.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose a framework for your block.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="library"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Library</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Library" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadcn">Shadcn</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose a library for your block.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="w-full" type="submit">
                Create block
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
