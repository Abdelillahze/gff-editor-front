"use client";
import axios from "axios";
import { useRef } from "react";

interface ISetting {
  page: string;
  options: {
    url: string;
    start: number;
    end: number;
    source: string;
  };
}

export default function VideoLayout({
  setting,
  setSettings,
}: {
  setting: ISetting;
  setSettings: any;
}) {
  const isDown = useRef(false);
  const coordinate = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const createVideo = async () => {
    try {
      const parent = parentRef.current?.getBoundingClientRect()!;
      const container = containerRef.current?.getBoundingClientRect()!;
      const containerStyle = window.getComputedStyle(containerRef.current!);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/clip",
        {
          url: setting.options.source,
          options: {
            start: setting.options.start,
            end: setting.options.end,
            blurredBackground: true,
            resolution: 1080,
            //   captions: [
            //     {
            //       text: "omg 555 lm9wd",
            //       start: 0,
            //       end: 30,
            //       x: 350,
            //       y: 100,
            //       fontSize: 50,
            //       padding: [50, 45],
            //       borderRadius: 15,
            //       style: "blackWhite",
            //     },
            //   ],
            layouts: [
              {
                label: "content",
                frame: {
                  width: 1080,
                  height: 1920,
                  x: 0,
                  y: 0,
                },
                crop: {
                  ParentWidth: parent.width,
                  ParentHeight: parent.height,
                  width: container.width,
                  height: container.height,
                  x: containerStyle.getPropertyValue("left").split("px")[0],
                  y: 0,
                },
              },
            ],
          },
        }
      );
      const data = await res.data;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full min-h-screen text-black">
      <div className="w-full">
        <h1>Layout</h1>
        <div
          ref={parentRef}
          onMouseUp={() => {
            //   console.log("up", isDown.current);
            isDown.current = false;
          }}
          onMouseMove={(e) => {
            e.preventDefault();
            const parent = e.currentTarget;
            const Elem = containerRef.current;
            if (!Elem) return;
            if (isDown.current) {
              const parentRect = parent.getBoundingClientRect();
              const containerRect = Elem.getBoundingClientRect();
              const parentToCursor = e.clientX - parentRect.left;
              const ElemToCursor = coordinate.current.x;
              const left = parentToCursor - ElemToCursor;
              const rest = containerRect.width - left + ElemToCursor;
              console.log(
                parentRect.width,
                containerRect.width,
                parentToCursor,
                ElemToCursor,
                left,
                rest,
                coordinate.current
              );
              console.log(left);
              if (
                left > -5 &&
                left < parentRect.width - containerRect.width + 5
              ) {
                Elem.style.left = `${left}px`;
              }
            }
          }}
          className="relative w-2/3 overflow-hidden"
        >
          <div
            ref={containerRef}
            draggable={false}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              isDown.current = true;
              coordinate.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };
            }}
            className="z-10 border-2 border-dashed border-white opacity-50 absolute inset-0 h-full aspect-ratio box-shadow-container"
          ></div>
          <video
            className="w-full"
            autoPlay
            muted
            loop
            onTimeUpdate={(e) => {
              const videoElement = e.currentTarget;
              const start = setting.options.start;
              const end = setting.options.end;
              if (videoElement.currentTime > end) {
                videoElement.currentTime = start;
              }
            }}
          >
            <source
              src={setting.options.source + `#t=${setting.options.start}`}
              type="video/mp4"
            ></source>
          </video>
        </div>
        <button onClick={createVideo}>next</button>
      </div>
    </div>
  );
}
