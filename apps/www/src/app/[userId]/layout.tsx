type ProfileLayoutProps = {
  children: React.ReactNode;
};

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  return <div>{children}</div>;
}
