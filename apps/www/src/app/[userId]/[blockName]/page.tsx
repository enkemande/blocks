import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpcCaller } from "@/libs/trpc/server";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import Details from "./details";
import SetupInstructions from "./setup-instructions";

type BlockPageProps = {
  params: { blockName: string; userId: string };
};

export default async function BlockPage(props: BlockPageProps) {
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
            <Button size="sm" variant="outline" className="flex gap-2 h-8">
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          </div>
        </div>
        {block.files.length === 0 ? <SetupInstructions /> : <Details />}
      </div>
    </main>
  );
}
