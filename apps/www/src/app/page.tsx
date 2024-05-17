import { BlockItem } from "@/components/block-item";
import { trpcCaller } from "@/libs/trpc/server";

interface HomePageProps {
  searchParams: { pageSize: number; page: number; query: string; sort: string };
}

export default async function Home({ searchParams }: HomePageProps) {
  const blocks = await trpcCaller.block.getAll();

  return (
    <main className="container">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2 py-2">
        {blocks.map((block, key) => {
          return (
            <BlockItem
              key={key}
              ownerImage={block.user.image}
              ownerUsername={block.user.username}
              name={block.name}
              description={block.description}
              framework={block.framework}
              library={block.library}
            />
          );
        })}
      </div>
    </main>
  );
}
