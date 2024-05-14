import { trpcCaller } from "@/libs/trpc/server";

type BlockPageProps = {
  params: { blockName: string; username: string };
};

export default async function BlockPage(props: BlockPageProps) {
  const { blockName, username } = props.params;
  const block = await trpcCaller.block.get({
    ownerUsername: username,
    name: blockName,
  });

  return (
    <div>
      <h1>BlockPage</h1>
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  );
}
