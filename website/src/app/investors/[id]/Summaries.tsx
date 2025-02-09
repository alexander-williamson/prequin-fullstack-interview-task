import { Card, CardContent, CardDescription } from "@/components/ui/card";
import numeral from "numeral";

type Args = {
  summaries?: {
    assets: { name: string; amount: number }[];
  };
  isLoading: boolean;
};

export default function summaries({ summaries }: Args) {
  return (
    <div className="flex justify-center items-center gap-3 overflow-x-auto w-full">
      {summaries?.assets.map((item) => (
        <Card key={item.name} role="rowgroup" className="items-center justify-center text-center ">
          <CardContent className="p-2">
            <CardContent className="p-2">{numeral(item.amount).format("0.0a")}</CardContent>
            <CardDescription className="p-2">{item.name}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
