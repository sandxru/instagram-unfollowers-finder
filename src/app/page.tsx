// @ts-nocheck
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Follower {
  string_list_data: { value: string }[];
}
interface Following {
  string_list_data: { value: string }[];
}

const compareFollowersAndFollowing = (
  followersData: Follower[],
  followingData: Following[]
) => {
  const followers = followersData.map(
    (item) => item.string_list_data[0]?.value
  );

  // Finding objects in following.json that are not in followers.json
  const notFollowingBack = followingData.relationships_following.filter(
    (item) => !followers.includes(item.string_list_data[0]?.value)
  );

  console.log("Users in following but not in followers:", notFollowingBack);

  return notFollowingBack;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzeData, setanalyzeData] = useState<any>(null); // Stores parsed JSON data
  const [isAnalyzed, setIsAnalyzed] = useState(false); // To control rendering

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

      // Get all files in the zip and filter out those that start with "followers_"
      const followersDataArray: any[] = [];

      // Collect all follower files
      const followerFilesPromises = Object.keys(zipContent.files)
        .filter((filePath) =>
          filePath.startsWith("connections/followers_and_following/followers_")
        )
        .map(async (filePath) => {
          const file = zipContent.file(filePath);
          if (file) {
            const fileContent = await file.async("string");
            const data = JSON.parse(fileContent);
            followersDataArray.push(...data); // Merge follower data
          }
        });

      // Wait for all follower files to be processed
      await Promise.all(followerFilesPromises);

      // Fetch the following file
      const followingFile = zipContent.file(followingFilePath);
      if (!followingFile) {
        console.error(`File not found: ${followingFilePath}`);
        return;
      }

      const followingFileContent = await followingFile.async("string");
      const followingData = JSON.parse(followingFileContent);

      // Now that all files are processed, check if followers data exists
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
      setanalyzeData(results); // Update state with the parsed data
      setIsAnalyzed(true); // Mark as analyzed to render the section
    } catch (error) {
      console.error("Error analyzing the file:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-6 pb-16 gap-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Download data from Instagram</li>
          <li>Upload it below to Analyze</li>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {" "}
            <br />
            <u>Learn how to Donwload</u>
          </a>
        </ol>

        <div className="flex items-center w-full max-w-sm">
          <Input
            id="picture"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="rounded-l-full w-full"
          />
          <Button
            onClick={handleAnalyze}
            className="rounded-full -ml-4 pl-8 pr-8"
          >
            Analyze
          </Button>
        </div>

        {isAnalyzed && analyzeData && (
          <div className="flex flex-col w-full gap-4">
            <div className="text-center sm:text-left text-lg font-semibold">
              Total: {analyzeData?.length || 0}
            </div>
            {analyzeData.map((user, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-4 border-b border-gray-300 pb-4"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
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
      </main>
    </div>
  );
}
