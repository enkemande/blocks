import { trpcCaller } from "@/libs/trpc/server";
import { Upload } from "./upload";

interface HomePageProps {
  searchParams: { pageSize: number; page: number; query: string; sort: string };
}

export default async function Home(props: HomePageProps) {
  const blocks = await trpcCaller.block.getAll();

  return (
    <main className="p-4">
      {/* {blocks.map((block, key) => (
        <div key={key}>
          <h1>{block.name}</h1>
          <p>{block.description}</p>
        </div>
      ))} */}
      <div className="grid grid-cols-3 auto-rows-auto gap-4">
        <div className="row-span-3 bg-green-600">01</div>
        <div className="col-span-2 bg-yellow-500">02</div>
        <div className="row-span-2 col-span-2 bg-blue-500">03</div>
        <div className="row-span-3 bg-green-600">01</div>
        <div className="col-span-2 bg-yellow-500">02</div>
        <div className="row-span-2 col-span-2 bg-blue-500">03</div>
      </div>
      <Upload />
    </main>
  );
}
