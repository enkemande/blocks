import { trpcCaller } from "@/libs/trpc/server";

export type BlocksProps = {
  userId: string;
};

export default async function Blocks(props: BlocksProps) {
  const blocks = await trpcCaller.block.getAllForUser(props.userId);
  return (
    <div>
      <h1>Blocks</h1>
      <pre>{JSON.stringify(blocks, null, 2)}</pre>
    </div>
  );
}
