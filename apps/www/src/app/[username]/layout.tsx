import { trpcCaller } from "@/libs/trpc/server";

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: { username: string };
};

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const user = await trpcCaller.user.getByUsername(params.username);
  console.log(user);
  return <div>{children}</div>;
}
