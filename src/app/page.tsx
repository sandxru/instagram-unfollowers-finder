"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const compareFollowersAndFollowing = (followersData, followingData) => {
  // Extracting usernames from followers.json
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
      setanalyzeData(results); // Update state with the parsed data
      setIsAnalyzed(true); // Mark as analyzed to render the section
    } catch (error) {
      console.error("Error analyzing the file:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
          <li>Upload it here to Analyze</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="picture"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
            />
          </div>

          <Button onClick={handleAnalyze}>Analyze</Button>
        </div>

        {/* Conditional rendering */}
        {isAnalyzed && analyzeData && (
          <div className="flex w-full gap-4 items-center flex-col sm:flex-row">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>{analyzeData?.string_list_data?.[1]?.value || "@ig_user"}</div>

            <Button className="justify-self-end">Unfollow</Button>
          </div>
        )}
      </main>
    </div>
  );
}
