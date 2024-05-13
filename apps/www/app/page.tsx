import { trpcCaller } from "@/libs/trpc/server";

interface HomePageProps {
  searchParams: { pageSize: number; page: number; query: string; sort: string };
}

export default async function Home(props: HomePageProps) {
  const blocks = await trpcCaller.block.getAll();

  return (
    <main className="p-4">
      {blocks.map((block, key) => (
        <div key={key}>
          <h1>{block.name}</h1>
          <p>{block.description}</p>
        </div>
      ))}
    </main>
  );
}
