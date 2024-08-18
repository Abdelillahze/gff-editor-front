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
    page: "layout",
    options: {
      source:
        "https://rr1---sn-5abxgpxuxaxjvh-vgol.googlevideo.com/videoplayback?expire=1724014716&ei=HAzCZtKwJ4TPp-oP8Kq-uA0&ip=41.98.30.221&id=o-ACMfgeWpXawt-KnTdIk_EYTfl61wFenVbR4hNvZXZ-vA&itag=136&aitags=134%2C136%2C160&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=ZM&mm=31%2C29&mn=sn-5abxgpxuxaxjvh-vgol%2Csn-hpa7knle&ms=au%2Crdu&mv=m&mvi=1&pl=19&initcwndbps=633750&bui=AQmm2ewST5CFyaZT8f2Of_jxjyDU20fCVWrZH-qE1a54xTRUUO7CCR3QQKcTh1RvK6VSy-Kb-0zO7a-L&spc=Mv1m9sfX5AVynbg-YP6kHqp7fNFhxyBH6tyLADbgJuhUq0GuJ6tzxUDyF77X&vprv=1&svpuc=1&mime=video%2Fmp4&ns=Zs08OYilDrKUUa1Zj9ijjqcQ&rqh=1&gir=yes&clen=738076&dur=2.766&lmt=1676741710151228&mt=1723992801&fvip=4&keepalive=yes&c=WEB&sefc=1&txp=6219224&n=amcXpV0_nHtuOQ&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIhAMIYDoahsLjLavSFEPNKF_5W-OOrXbwYiFT8J8yeitz-AiAt0zwkrEWIcv6sqc_TWpoQKSx1PxxIhe8j5ykMnYB6hw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AGtxev0wRQIgItRibrf5Z0NOkSSBsQvVvKIqYUiL3cKDfQbHXlbdrhMCIQDFh6onnVysBmwISraVvumYuY4X8v69dz_5Fio9bOH0vA%3D%3D",
    },
    // page: "trim",
    // options: {},
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
