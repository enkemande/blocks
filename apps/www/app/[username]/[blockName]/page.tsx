type BlockPageProps = {
  params: { username: string; blockName: string };
};

export default function BlockPage({ params }: BlockPageProps) {
  const { username, blockName } = params;
  console.log(username, blockName);
  return <div>Block</div>;
}
