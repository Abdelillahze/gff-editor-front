"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";

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
  const [cropCoordinate, setCropCoordinate] = useState({
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  });
  const [frameCoordinate, setFrameCoordinate] = useState({
    width: 230,
    height: 300,
    x: 0,
    y: 0,
  });
  const cropRef = useRef<any>(null);
  const cropParentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<any>(null);
  const frameParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blurredCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d")!;
    let animation;
    const {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    } = cropCoordinate;
    const originalWidth = video.videoWidth;
    const originalHeight = video.videoHeight;
    const width = (originalWidth * cropWidth) / video.offsetWidth;
    const height = (originalHeight * cropHeight) / video.offsetHeight;
    const x = (originalWidth * cropX) / video.offsetWidth;
    const y = (originalHeight * cropY) / video.offsetHeight;
    let frameWidth = cropWidth;
    let frameHeight = cropHeight;
    let offsetX = 0;
    let offsetY = 0;
    const aspectRatio = cropWidth / cropHeight;

    canvas.width = frameCoordinate.width;
    canvas.height = frameCoordinate.height;

    if (canvas.width > frameWidth) {
      console.log("width");
      frameWidth = canvas.width;
      frameHeight = canvas.width / aspectRatio;
      if (canvas.height > frameHeight) {
        frameWidth = canvas.height * aspectRatio;
        frameHeight = canvas.height;
      }
    } else if (canvas.height > frameHeight) {
      console.log("height");
      frameWidth = canvas.height * aspectRatio;
      frameHeight = canvas.height;
    }

    if (frameWidth > canvas.width) {
      offsetX = (frameWidth - canvas.width) / 2;
    }
    if (frameHeight > canvas.height) {
      offsetY = (frameHeight - canvas.height) / 2;
    }

    const cropVideo = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        video,
        x,
        y,
        width,
        height,
        -offsetX,
        -offsetY,
        frameWidth,
        frameHeight
      );

      animation = requestAnimationFrame(cropVideo);
    };

    cropVideo();
    return () => {
      cancelAnimationFrame(animation!);
    };
  }, [frameCoordinate, cropCoordinate]);

  const createVideo = async () => {
    console.log(cropCoordinate, frameCoordinate, cropRef, frameRef);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/clip",
        {
          url: setting.options.source,
          options: {
            start: setting.options.start,
            end: setting.options.end,
            blurredBackground: false,
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
                  ParentWidth: frameParentRef.current?.offsetWidth,
                  ParentHeight: frameParentRef.current?.offsetHeight,
                  width: frameCoordinate.width,
                  height: frameCoordinate.height,
                  x: frameCoordinate.x,
                  y: frameCoordinate.y,
                },
                crop: {
                  ParentWidth: cropParentRef.current?.offsetWidth,
                  ParentHeight: cropParentRef.current?.offsetHeight,
                  width: cropCoordinate.width,
                  height: cropCoordinate.height,
                  x: cropCoordinate.x,
                  y: cropCoordinate.y,
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

  // const onResizeHandler = () => {
  //   if (!cropRef.current || !cropParentRef.current || !canvasRef.current)
  //     return;

  //   const crop = cropRef.current.resizableElement.current;
  //   const cropParent = cropParentRef.current;

  //   const width =
  //     (frameCoordinate.width * cropCoordinate.width) / cropParent.offsetWidth;
  //   const height =
  //     (frameCoordinate.height * cropCoordinate.height) /
  //     cropParent.offsetHeight;

  //   console.log(cropCoordinate);

  //   setCanvasCoordinate({ ...canvasCoordinate, width, height });
  // };

  // const onDragHandler = () => {
  //   if (!cropRef.current || !canvasRef.current || !cropParentRef.current)
  //     return;

  //   const crop = window.getComputedStyle(
  //     cropRef.current.resizableElement.current
  //   );
  //   const cropParent = cropParentRef.current;
  //   const [cropLeft, cropTop] = crop.transform
  //     .split(", ")
  //     .slice(4)
  //     .map((num) => parseFloat(num));

  //   const top = (frameCoordinate.height * cropTop) / cropParent.offsetHeight;
  //   const left = (frameCoordinate.width * cropLeft) / cropParent.offsetWidth;

  //   setCanvasCoordinate({ ...canvasCoordinate, x: left, y: top });
  // };

  return (
    <div className="w-full min-h-screen text-black">
      <div className="w-full">
        <h1>Layout</h1>
        <div className="flex gap-2">
          <div
            ref={cropParentRef}
            className="relative w-2/3 h-fit overflow-hidden"
          >
            <Rnd
              ref={cropRef}
              className="border-2 border-dashed border-white z-50 box-shadow-container"
              size={{
                width: cropCoordinate.width,
                height: cropCoordinate.height,
              }}
              position={{ x: cropCoordinate.x, y: cropCoordinate.y }}
              onDrag={(e, d) => {
                setCropCoordinate({ ...cropCoordinate, x: d.x, y: d.y });
                // onDragHandler();
              }}
              onResize={(e, direction, ref, delta, position) => {
                setCropCoordinate({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                });
                // onResizeHandler();
              }}
              bounds={"parent"}
            ></Rnd>
            <video
              ref={videoRef}
              controls
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
          <div
            ref={frameParentRef}
            className="relative w-1/4 bg-black aspect-ratio overflow-hidden"
          >
            <canvas
              className="absolute top-0 left-0"
              ref={blurredCanvasRef}
            ></canvas>
            <Rnd
              ref={frameRef}
              bounds={"parent"}
              className="relative border border-white z-50 box-shadow-container overflow-hidden"
              size={{
                width: frameCoordinate.width,
                height: frameCoordinate.height,
              }}
              position={{ x: frameCoordinate.x, y: frameCoordinate.y }}
              onDrag={(e, d) => {
                setFrameCoordinate({ ...frameCoordinate, x: d.x, y: d.y });
                // onDragHandler();
              }}
              onResize={(e, direction, ref, delta, position) => {
                setFrameCoordinate({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                });
                // onResizeHandler();
              }}
            >
              <canvas ref={canvasRef}></canvas>
            </Rnd>
          </div>
        </div>
        <button onClick={createVideo}>next</button>
      </div>
    </div>
  );
}
