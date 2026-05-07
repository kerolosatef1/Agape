import { Card } from "@/components/ui/card";

export default function PageHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card className="mb-4 p-4">
      <div className="text-lg font-semibold">{title}</div>
      {description ? (
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
      ) : null}
    </Card>
  );
}
