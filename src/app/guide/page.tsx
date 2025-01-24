import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-6 pb-16 gap-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-start sm:items-start w-full max-w-2xl">
        <ol className="text-neutral-800 list-inside list-decimal text-sm text-left sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 ">Open Instagram app and Go to settings.</li>
          <li className="mb-2 ">Account center.</li>
          <li className="mb-2 ">Your information and permissions.</li>
          <li className="mb-2 ">Download your information.</li>
          <li className="mb-2 ">Download or transfer information.</li>
          <li className="mb-2 ">
            Select your Instagram account. (Not Facebook account, if its
            connected)
          </li>
          <li className="mb-2 ">Some of your information</li>
          <li className="mb-2 ">
            Scroll down, under Connections; select Followers and following.
          </li>
          <li className="mb-2 ">Download to device.</li>
          <li className="mb-2 ">Date range: All time</li>
          <li className="mb-2 ">Format: JSON</li>
          <li className="mb-2 ">Create file</li>
          <li className="mb-2 ">
            Wait till it process, you can download the file under the same place
          </li>

          <Link
            href="/"
            className="text-blue-500 underline hover:text-blue-700"
          >
            <br />
            <u>Go back</u>
          </Link>
        </ol>
      </main>
    </div>
  );
}
