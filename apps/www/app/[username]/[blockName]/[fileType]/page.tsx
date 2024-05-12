import { notFound } from "next/navigation";

type FilePageProps = {
  params: { username: string; blockName: string; fileType: string };
};

const ACCEPTED_FILE_TYPES = ["tree", "blob"];

export default function FilePage({ params }: FilePageProps) {
  const { username, blockName, fileType } = params;
  if (!ACCEPTED_FILE_TYPES.includes(fileType)) return notFound();

  return <div>File</div>;
}
