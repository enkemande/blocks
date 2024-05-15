import { trpcCaller } from "@/libs/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "./blocks";
import Overview from "./overview";

type ProfilePageProps = {
  searchParams: { tab: string };
  params: { userId: string };
};

export default async function ProfilePage({
  params: { userId },
  searchParams: { tab },
}: ProfilePageProps) {
  const user = await trpcCaller.user.getByIdOrUsername(userId);
  if (!user) notFound();

  return (
    <div>
      <h1>ProfilePage</h1>
      <p>This is the profile page</p>
      <div className="flex gap-2">
        <Link href={`/${user.username}?tab=overview`}>Overview</Link>
        <Link href={`/${user.username}?tab=blocks`}>Blocks</Link>
      </div>
      {(!tab || tab === "overview") && <Overview />}
      {tab === "blocks" && <Blocks userId={user.id} />}
    </div>
  );
}
