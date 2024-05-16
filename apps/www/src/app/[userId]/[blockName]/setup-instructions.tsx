import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SetupInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Instructions s</CardTitle>
        <CardDescription>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre>
          <code>npx nke-blocks bundle data</code>
        </pre>
      </CardContent>
    </Card>
  );
}
