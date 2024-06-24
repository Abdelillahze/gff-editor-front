"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function VideoController({ setSettings }: { setSettings: any }) {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!url.match(urlRegex)) return;
    getSource();
  }, [url]);

  // functions

  const getSource = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/upload",
        { url }
      );
      const data = await res.data.data;
      setSource(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onPreview = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = start;
    videoElement.play();
    videoElement.addEventListener("timeupdate", function preview(): void {
      if (videoElement.currentTime > end) {
        videoElement.pause();
        return videoElement.removeEventListener("timeupdate", preview);
      } else if (videoElement.currentTime < start) {
        return videoElement.removeEventListener("timeupdate", preview);
      }
    });
  };

  return (
    <div className="w-full min-h-screen text-black">
      <header className="mb-4">
        <input
          className={`${inputStyle}`}
          type="url"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          placeholder="url"
        />
      </header>
      {source ? (
        <section className="w-full flex">
          <div className="w-1/5">
            <h1>current time: </h1>
            <div className="flex justify-start [&>*:not(:last-child)]:mr-8">
              <button
                onClick={() => {
                  const videoElement = videoRef.current;
                  if (!videoElement) return;
                  videoElement.currentTime -= 0.1;
                }}
              >
                ◀
              </button>
              <span>{currentTime}</span>
              <button
                onClick={() => {
                  const videoElement = videoRef.current;
                  if (!videoElement) return;
                  videoElement.currentTime += 0.1;
                }}
              >
                ▶
              </button>
            </div>
            <div className="flex">
              <button
                className="mr-4"
                onClick={() =>
                  setStart((prevState: number) => {
                    if (currentTime > end) return prevState;
                    return currentTime;
                  })
                }
              >
                start
              </button>
              <button
                onClick={() =>
                  setEnd((prevState: number) => {
                    if (currentTime < start) return prevState;
                    return currentTime;
                  })
                }
              >
                end
              </button>
            </div>
            <div className="flex">
              <span>start: {start}</span>
              <input type="text" placeholder="not set"></input>
            </div>
            <div className="flex">
              <span>end: {end}</span>
              <input type="text" placeholder="not set"></input>
            </div>
            <span>duration: {(end - start).toFixed(2)}</span>
            <div className="flex">
              <button className="mr-2" onClick={onPreview}>
                preview
              </button>
              <button
                onClick={() =>
                  setSettings({
                    page: "layout",
                    options: {
                      start,
                      end,
                      source,
                      url: "/layout",
                    },
                  })
                }
              >
                Next
              </button>
            </div>
          </div>
          <div className="w-3/5">
            <video
              ref={videoRef}
              onTimeUpdate={(e) => {
                const videoElement = e.currentTarget;
                setTimeout(() => {
                  console.log("change ?");
                  setCurrentTime(+videoElement.currentTime.toFixed(2));
                }, 10);
              }}
              onLoadedData={(e) => {
                setEnd(+e.currentTarget.duration.toFixed(2));
              }}
              className="w-full"
              controls
            >
              <source src={source} type="video/mp4"></source>
            </video>
          </div>
        </section>
      ) : url ? (
        <div>Loading...</div>
      ) : (
        <></>
      )}
    </div>
  );
}

const inputStyle =
  "py-2 px-3 border border-black text-black w-[400px] outline-none";
