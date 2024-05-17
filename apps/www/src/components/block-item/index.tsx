import _ from "lodash";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export type BlockItemProps = {
  ownerImage?: string | null;
  ownerUsername: string | null;
  name: string;
  description?: string | null;
  framework: string | null;
  library: string | null;
};

const LIBRARY_ICON = {
  react: "https://cdn.skypack.dev/react",
  vue: "https://cdn.skypack.dev/vue",
  angular: "https://cdn.skypack.dev/angular",
};

export const BlockItem: React.FC<BlockItemProps> = ({
  ownerImage,
  ownerUsername,
  name,
  description,
  framework,
  library,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            {ownerImage && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={ownerImage} />
              </Avatar>
            )}
            <Link
              className="text-sm text-slate-500 hover:underline"
              href={`/${ownerUsername}`}
            >
              {ownerUsername}
            </Link>
          </div>
        </div>
        <CardTitle>
          <Link
            className="hover:text-primary hover:underline"
            href={`/${ownerUsername}/${name}`}
          >
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <p>{_.truncate(description, { length: 100 })}</p>
        </CardContent>
      )}
      <CardFooter>
        <div className="flex flex-row items-center gap-2">
          <p>{framework}</p>
          <p>{library}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
