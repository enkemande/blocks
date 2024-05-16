import { trpcCaller } from "@/libs/trpc/server";
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
      {block.files.length === 0 ? <SetupInstructions /> : <Details />}
    </main>
  );
}
