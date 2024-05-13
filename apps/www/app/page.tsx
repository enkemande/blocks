import { trpcCaller } from "@/libs/trpc/server";

interface HomePageProps {
  searchParams: { pageSize: number; page: number; query: string; sort: string };
}

export default async function Home(props: HomePageProps) {
  const blocks = await trpcCaller.block.getAll();
  console.log(blocks);
  return <main className="p-4">{JSON.stringify(blocks)}</main>;
}
