import { BlockForm } from "@/components/block-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/libs/auth";
import { trpcCaller } from "@/libs/trpc/server";
import { Pencil, Trash } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Details from "./details";
import SetupInstructions from "./setup-instructions";

type BlockPageProps = {
  params: { blockName: string; userId: string };
};

export default async function BlockPage(props: BlockPageProps) {
  const session = await getServerSession(authOptions);
  const { blockName, userId } = props.params;
  const user = await trpcCaller.user.getByIdOrUsername(userId);

  if (!user) notFound();

  const block = await trpcCaller.block.get({
    userId: user?.id,
    name: blockName,
  });

  if (!block) notFound();

  return (
    <main className="container">
      <div className="py-2 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            {block.user.image && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={block.user.image} />
              </Avatar>
            )}
            <h1 className="font-bold text-lg">{block.name}</h1>
          </div>
          <div className="flex flex-row items-center gap-2">
            {session && session.user.id === block.user.id && (
              <div className="flex items-center gap-2">
                <BlockForm
                  title="Edit block"
                  description="Update your block details"
                  id={block.id}
                  defaultValues={{
                    name: block.name,
                    description: block.description!,
                    framework: block.framework!,
                    library: block.library!,
                  }}
                  trigger={
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex gap-2 h-8"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  }
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex gap-2 h-8"
                >
                  <Trash className="h-3 w-3" />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        {block.files.length === 0 ? <SetupInstructions /> : <Details />}
      </div>
    </main>
  );
}
