import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>
          <code>npx nke-blocks bundle data</code>
        </pre>
      </CardContent>
    </Card>
  );
}
