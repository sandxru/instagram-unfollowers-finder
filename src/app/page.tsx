"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Github } from "lucide-react";

interface Follower {
  string_list_data: { value: string }[];
}
interface Following {
  string_list_data: { value: string }[];
}

interface AnalyzeDataItem {
  string_list_data: {
    href?: string;
    value?: string;
    timestamp?: number;
  }[];
}

interface StringListData {
  href: string;
  value: string;
  timestamp: number;
}

interface FollowerData {
  string_list_data: StringListData[];
}

const compareFollowersAndFollowing = (
  followersData: Follower[],
  followingData: { relationships_following: Following[] }
) => {
  const followers = followersData.map(
    (item) => item.string_list_data[0]?.value
  );

  if (!followingData.relationships_following) {
    console.error("Invalid following data structure.");
    return [];
  }

  const notFollowingBack = followingData.relationships_following.filter(
    (item) => !followers.includes(item.string_list_data[0]?.value)
  );

  console.log("Users in following but not in followers:", notFollowingBack);

  return notFollowingBack;
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzeData, setAnalyzeData] = useState<AnalyzeDataItem[] | null>(
    null
  );
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      console.error("No file uploaded");
      return;
    }

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      const followingFilePath =
        "connections/followers_and_following/following.json";

      const followersDataArray: FollowerData[] = [];

      const followerFilesPromises = Object.keys(zipContent.files)
        .filter((filePath) =>
          filePath.startsWith("connections/followers_and_following/followers_")
        )
        .map(async (filePath) => {
          const file = zipContent.file(filePath);
          if (file) {
            const fileContent = await file.async("string");
            const data = JSON.parse(fileContent);
            followersDataArray.push(...data);
          }
        });

      await Promise.all(followerFilesPromises);

      const followingFile = zipContent.file(followingFilePath);
      if (!followingFile) {
        console.error(`File not found: ${followingFilePath}`);
        return;
      }

      const followingFileContent = await followingFile.async("string");
      const followingData = JSON.parse(followingFileContent);

      if (followersDataArray.length === 0) {
        console.error("No followers files found.");
        return;
      }

      console.log("Data in following.json:", followingData);
      console.log("Data in followers.json:", followersDataArray);

      const results = compareFollowersAndFollowing(
        followersDataArray,
        followingData
      );
      setAnalyzeData(results);
      setIsAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing the file:", error);
    }
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
          <li className="mb-2 ">Download data from Instagram</li>
          <li className="mb-2 ">
            Select the zip file downloaded from Instagram.
          </li>
          <li className="mb-2 ">Hit Analyze</li>

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
              onChange={handleFileChange}
              className="rounded-l-full w-full"
            />
            <Button
              onClick={handleAnalyze}
              className="rounded-full -ml-4 pl-8 pr-8 bg-neutral-800 hover:bg-neutral-700"
            >
              Analyze
            </Button>
          </div>
          <span className="text-xs text-neutral-400 mt-2">
            Your data stays secure and does not leave your device.
          </span>
        </div>

        {isAnalyzed && analyzeData && (
          <div className="flex flex-col w-full gap-4">
            <div className="text-neutral-800 text-center sm:text-left text-lg font-semibold">
              Total: {analyzeData?.length || 0}
            </div>
            {analyzeData.map((user, index) => (
              <div
                key={index}
                className="text-neutral-800 flex w-full items-center gap-4 border-b border-gray-300 pb-4"
              >
                <Avatar>
                  <AvatarImage src="https://github.com" alt="avatar" />
                  <AvatarFallback>IG</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  {user?.string_list_data?.[0]?.value || "@ig_user"} <br></br>
                  <span className="text-xs text-neutral-400">
                    Following since{" "}
                    {user?.string_list_data?.[0]?.timestamp
                      ? new Date(user.string_list_data[0].timestamp * 1000)
                          .toISOString()
                          .split("T")[0]
                      : "not available"}
                  </span>
                </div>
                <a
                  href={user?.string_list_data?.[0]?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-rose-600 bg-opacity-10 text-rose-600 rounded-full h-7 pl-5 pr-5 text-xs hover:bg-rose-800 hover:bg-opacity-10 transform hover:scale-105 transition duration-200">
                    Unfollow
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}

        <footer className="flex flex-row justify-between items-center w-[90%] mx-auto py-3 bg-white bg-opacity-50 backdrop-blur-md fixed bottom-0 left-1/2 transform -translate-x-1/2 flex-wrap sm:flex-nowrap">
          <Link
            href="https://sandarumuthuwadige.com"
            target="_blank"
            className="text-blue-500 hover:text-blue-700 text-sm order-1 sm:order-1"
          >
            sandarumuthuwadige.com
          </Link>
          <Link
            href="https://github.com/sandxru/instagram-unfollowers-finder"
            target="_blank"
            className="inline-flex h-8 items-center rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm w-8 hover:scale-110 transition-transform p-2 order-2 sm:order-2"
          >
            <Github className="w-4 h-4 text-neutral-800 hover:text-neutral-700" />
          </Link>
        </footer>
      </main>
    </div>
  );
}
