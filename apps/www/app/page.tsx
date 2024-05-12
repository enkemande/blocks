interface HomePageProps {
  searchParams: { pageSize: number; page: number; query: string; sort: string };
}

export default async function Home(props: HomePageProps) {
  return <main className="p-4"></main>;
}
