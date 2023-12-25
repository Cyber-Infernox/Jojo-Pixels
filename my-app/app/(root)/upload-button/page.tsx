"use client";

import { UploadButton } from "@/lib/uploadthingPost";
import { useState } from "react";

export default function Home() {
  // const [files, setFiles] = useState<File[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="mediaPost"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
