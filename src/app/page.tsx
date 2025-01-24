import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Download data from Instagram</li>
          <li>Upload it here to Analyze</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" />
          </div>

          <Button>Analyze</Button>
        </div>
      </main>
    </div>
  );
}
