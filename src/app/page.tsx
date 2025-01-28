"use client";
import { useState } from "react";
import JSZip from "jszip";
import Link from "next/link";
import { Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type InstagramUser = {
  string_list_data: {
    href: string;
    value: string;
    timestamp: number;
  }[];
};

type FollowingData = {
  relationships_following: InstagramUser[];
};

const FOLLOWER_PATH_PREFIX = "connections/followers_and_following/followers_";
const FOLLOWING_PATH = "connections/followers_and_following/following.json";

const useUnfollowerAnalysis = () => {
  const [results, setResults] = useState<InstagramUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      // Process followers
      const followerPromises = Object.keys(zipContent.files)
        .filter((filePath) => filePath.startsWith(FOLLOWER_PATH_PREFIX))
        .map(async (filePath) => {
          const file = zipContent.file(filePath);
          return file ? JSON.parse(await file.async("string")) : [];
        });

      const followersData = (await Promise.all(followerPromises)).flat();

      // Process following
      const followingFile = zipContent.file(FOLLOWING_PATH);
      if (!followingFile) throw new Error("Following data not found");
      const followingData: FollowingData = JSON.parse(
        await followingFile.async("string")
      );

      // Compare data
      const followerSet = new Set(
        followersData.map((f) => f.string_list_data[0]?.value)
      );
      const notFollowingBack = followingData.relationships_following.filter(
        (user) => !followerSet.has(user.string_list_data[0]?.value)
      );

      setResults(notFollowingBack);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze data. Please check the file format.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, analyzeData };
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const { results, isLoading, error, analyzeData } = useUnfollowerAnalysis();

  const handleAnalyze = async () => {
    if (!file) return;
    await analyzeData(file);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-6 pb-16 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-start sm:items-start w-full max-w-2xl overflow-hidden">
        <h1 className="flex flex-col items-center w-full text-neutral-800 text-2xl">
          Instagram Unfollowers Finder
        </h1>
        <h2 className="text-neutral-800">
          You can use this tool to find out who isn’t following you back on
          Instagram.
        </h2>

        <ol className="text-neutral-800 list-inside list-decimal text-sm text-left sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Download data from Instagram</li>
          <li className="mb-2">
            Select the zip file downloaded from Instagram.
          </li>
          <li className="mb-2">Hit Analyze</li>
          <Link
            href="/guide"
            className="text-blue-500 underline hover:text-blue-700"
          >
            <u>Learn how to Download</u>
          </Link>
        </ol>

        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-neutral-800 pt-6 pb-1">
          <div className="flex items-center w-full">
            <Input
              id="picture"
              type="file"
              accept=".zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-l-full w-full"
              disabled={isLoading}
            />
            <Button
              onClick={handleAnalyze}
              className={cn(
                "rounded-full -ml-4 pl-8 pr-8 bg-neutral-800 hover:bg-neutral-700",
                isLoading
                  ? "opacity-100 bg-neutral-800 text-neutral-200 scale-100 cursor-wait"
                  : "disabled:opacity-100 disabled:bg-neutral-500"
              )}
              disabled={!file || isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          <span className="text-xs text-neutral-400 mt-2">
            Your data stays secure and does not leave your device.
          </span>
        </div>

        {error && (
          <div className="text-red-500 text-center w-full text-sm">{error}</div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col w-full gap-4">
            <div className="text-neutral-800 text-center sm:text-left text-lg font-semibold">
              Total: {results.length}
            </div>
            {results.map((user, index) => {
              const userData = user.string_list_data[0] || {};
              // Extract the first valid character (ignoring underscores)
              const fallbackLetter =
                userData.value
                  ?.replace(/^_+/, "") // Remove leading underscores
                  ?.charAt(0)
                  ?.toUpperCase() ?? "IG";

              return (
                <div
                  key={`${userData.value}-${index}`}
                  className="text-neutral-800 flex w-full items-center gap-4 border-b border-neutral-200 pb-4"
                >
                  <Avatar>
                    <AvatarFallback>{fallbackLetter}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    {userData.value || "@ig_user"} <br />
                    <span className="text-xs text-neutral-400">
                      Following since{" "}
                      {userData.timestamp
                        ? new Date(userData.timestamp * 1000)
                            .toISOString()
                            .split("T")[0]
                        : "not available"}
                    </span>
                  </div>
                  <a
                    href={userData.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-rose-600 bg-opacity-10 text-rose-600 rounded-full h-7 pl-5 pr-5 text-xs hover:bg-rose-800 hover:bg-opacity-10 transform hover:scale-105 transition duration-200">
                      Unfollow
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <footer className="flex flex-row justify-between items-center w-[90%] mx-auto py-3 bg-white bg-opacity-50 backdrop-blur-md fixed bottom-0 left-1/2 transform -translate-x-1/2 flex-wrap sm:flex-nowrap">
          <Link
            href="https://sandarumuthuwadige.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm order-1 sm:order-1"
          >
            sandarumuthuwadige.com
          </Link>
          <Link
            href="https://github.com/sandxru/instagram-unfollowers-finder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm w-8 hover:scale-110 transition-transform p-2 order-2 sm:order-2"
          >
            <Github className="w-4 h-4 text-neutral-800 hover:text-neutral-700" />
          </Link>
        </footer>
      </main>
    </div>
  );
}
