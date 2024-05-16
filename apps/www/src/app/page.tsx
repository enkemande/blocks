import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpcCaller } from "@/libs/trpc/server";
import _ from "lodash";
import Link from "next/link";

const FRAMEWORKS_ICON = {
  react: {},
};

const LIBRARY_ICON = {
  shadcn: {},
};

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
            <Card key={key}>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    {block.user.image && (
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={block.user.image} />
                      </Avatar>
                    )}
                    <Link
                      className="text-sm text-slate-500 hover:underline"
                      href={`/${block.user.username}`}
                    >
                      {block.user.username}
                    </Link>
                  </div>
                </div>
                <CardTitle>
                  <Link
                    className="hover:text-primary hover:underline"
                    href={`/${block.user.username}/${block.name}`}
                  >
                    {block.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              {block.description && (
                <CardContent>
                  <p>{_.truncate(block.description, { length: 100 })}</p>
                </CardContent>
              )}
              <CardFooter>
                <div className="flex flex-row items-center gap-2">
                  <p>{block.framework}</p>
                  <p>{block.library}</p>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
