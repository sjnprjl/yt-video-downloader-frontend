import { useRef, useState } from "react";
import { api } from "../../api";
import { YtVideo } from "../../interface/yt-video.interface";
import toast from "react-hot-toast";
import { axiosErrorMessage } from "../../utils";
import { AxiosError } from "axios";

type Status = "idle" | "loading";

interface DownloadInputCardProps {
  onMetadataFound?: (metadata: YtVideo) => void;
}
export function DownloadInputCard(props: DownloadInputCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [downloadStatus, setDownloadStatus] = useState<Status>("idle");

  async function handleDownload() {
    setDownloadStatus("loading");
    if (inputRef.current) {
      const url = encodeURIComponent(inputRef.current.value);
      try {
        const { data } = await api.get(`/yt/${url}/metadata`);
        props.onMetadataFound?.(data);
        inputRef.current.value = "";
      } catch (err) {
        console.log("error occured", err);
        const message = axiosErrorMessage(err as AxiosError);
        toast.error(message);
      } finally {
        setDownloadStatus("idle");
      }
    }
  }

  return (
    <div className="w-full mt-4">
      {/* info text */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Online Video Downloader</h1>
        <p className="text-center mb-4">
          Download Online video anywhere anytime.
        </p>
      </div>
      {/* input */}
      <div className="flex gap-2 flex-1 w-full">
        <input
          disabled={downloadStatus === "loading"}
          ref={inputRef}
          type="text"
          placeholder="Enter video URL"
          className="input input-bordered flex-1"
        />
        <button
          disabled={downloadStatus === "loading"}
          onClick={() => {
            inputRef?.current?.value != ""
              ? handleDownload()
              : toast.error("Please Enter Video Url");
          }}
          className="btn btn-primary"
        >
          {downloadStatus === "loading" && inputRef?.current?.value != "" && (
            <span className="loading loading-spinner"></span>
          )}
          Download
        </button>
      </div>
    </div>
  );
}
