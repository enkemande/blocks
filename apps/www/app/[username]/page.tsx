type UserPageProps = {
  params: { username: string };
};

export default function UserPage(props: UserPageProps) {
  console.log(props.params.username);
  return <div>user page</div>;
}
