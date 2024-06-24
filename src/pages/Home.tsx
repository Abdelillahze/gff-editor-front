"use client";
import { useState } from "react";
import VideoController from "@/components/VideoController";
import VideoLayout from "@/components/VideoLayout";

interface IOptions {
  start?: number | null;
  end?: number | null;
  x?: number | null;
}

interface ISetting {
  page: string;
  options: any;
}

export default function Home() {
  const [settings, setSettings] = useState<ISetting>({
    page: "trim",
    options: {},
  });
  return (
    <div className="bg-white w-full min-h-screen p-4">
      {settings.page === "trim" && (
        <VideoController setSettings={setSettings} />
      )}
      {settings.page === "layout" && (
        <VideoLayout setting={settings} setSettings={setSettings} />
      )}
    </div>
  );
}

export type { IOptions };
