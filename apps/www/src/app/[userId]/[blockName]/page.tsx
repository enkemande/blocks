import { trpcCaller } from "@/libs/trpc/server";
import { notFound } from "next/navigation";

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

  return (
    <div>
      <h1>BlockPage</h1>
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  );
}
