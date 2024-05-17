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
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "../loading-spinner";

type CreateBlockFormType = z.infer<typeof CreateBlockSchema>;

export type AddBlockFormProps = {
  title: string;
  description: string;
  trigger: React.ReactNode;
  defaultValues?: CreateBlockFormType;
  id?: number;
};

export const BlockForm: React.FC<AddBlockFormProps> = ({
  trigger,
  defaultValues,
  title,
  description,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const updateBlock = trpc.block.update.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
  });

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
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<CreateBlockFormType> = (data) => {
    if (id) {
      updateBlock.mutate({ id, ...data });
    } else {
      createBlock.mutate(data);
    }
  };

  const isLoading = useMemo(() => {
    return updateBlock.isPending || createBlock.isPending;
  }, [updateBlock.isPending, createBlock.isPending]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      readOnly={id ? true : false}
                    />
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
              <Button
                disabled={isLoading}
                className="w-full flex gap-2"
                type="submit"
              >
                {isLoading && <LoadingSpinner className="w-4 h-4" />}
                {id ? "Update Block" : "Create Block"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
