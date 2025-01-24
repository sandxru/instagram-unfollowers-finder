import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-6 pb-16 gap-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-start sm:items-start w-full max-w-2xl">
        <ol className="text-neutral-800 list-inside list-decimal text-sm text-left sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 ">
            Open the Instagram app and go to <b>Settings</b>
          </li>
          <li className="mb-2 ">
            Select <b>Account Center</b>
          </li>
          <li className="mb-2 ">
            Go to <b>Your information and permissions</b>
          </li>
          <li className="mb-2 ">
            Choose <b>Download your information</b>
          </li>
          <li className="mb-2 ">
            Select <b>Download or transfer information</b>
          </li>
          <li className="mb-2 ">
            Choose your <b>Instagram account</b> (not your Facebook account, if
            it’s connected)
          </li>
          <li className="mb-2 ">
            Under <b>Some of your information</b>, scroll down to{" "}
            <b>Connections</b>, then select <b>Followers and following</b>
          </li>
          <li className="mb-2 ">Download to device</li>
          <li className="mb-2 ">
            Set the date range to <b>All Time</b>
          </li>
          <li className="mb-2 ">
            Choose the format <b>JSON</b>
          </li>
          <li className="mb-2 ">
            Click <b>Create file</b>
          </li>
          <li className="mb-2 ">
            Wait for the process to complete; you can download the file from the
            same section
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
