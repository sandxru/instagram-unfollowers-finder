"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const compareFollowersAndFollowing = (followersData, followingData) => {
  const followers = followersData.map(
    (item) => item.string_list_data[0]?.value
  );

  const notFollowingBack = followingData.relationships_following.filter(
    (item) => !followers.includes(item.string_list_data[0]?.value)
  );

  console.log("Users in following but not in followers:", notFollowingBack);

  return notFollowingBack;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzeData, setanalyzeData] = useState<any>(null);
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

      const followersFilePath =
        "connections/followers_and_following/followers_1.json";

      const followingFile = zipContent.file(followingFilePath);
      if (!followingFile) {
        console.error(`File not found: ${followingFilePath}`);
        return;
      }

      const followersFile = zipContent.file(followersFilePath);
      if (!followersFile) {
        console.error(`File not found: ${followersFilePath}`);
        return;
      }

      const followingFileContent = await followingFile.async("string");
      const followingData = JSON.parse(followingFileContent);

      const followersFileContent = await followersFile.async("string");
      const followersData = JSON.parse(followersFileContent);

      console.log("Data in following.json:", followingData);
      console.log("Data in followers.json:", followersData);

      const results = compareFollowersAndFollowing(
        followersData,
        followingData
      );
      setanalyzeData(results);
      setIsAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing the file:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-6 pb-16 gap-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Download data from{" "}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <u>Instagram</u>
            </a>
          </li>
          <li>Upload it below to Analyze</li>
        </ol>
        <div className="flex flex-col gap-4 items-center sm:flex-row justify-center w-full">
          <div className="w-full max-w-sm items-center gap-1.5">
            <Input
              id="picture"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
            />
          </div>

          <Button onClick={handleAnalyze} className="mt-4 sm:mt-0 sm:ml-4">
            Analyze
          </Button>
        </div>

        {isAnalyzed && analyzeData && (
          <div className="flex flex-col w-full gap-4 mt-8">
            <div>Total: {analyzeData?.length || 0}</div>
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
                    UNFOLLOW
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
