import { useRef, useState } from "react";
import { api } from "../../api";
import { YtVideo } from "../../interface/yt-video.interface";

type Status = "idle" | "loading";

interface DownloadInputCardProps {
    onMetadataFound?: (metadata: YtVideo) => void
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
                inputRef.current.value = '';
            } catch (err) {
                console.log('error occured', err);
            } finally {
                setDownloadStatus('idle');
            }
        }
    }


    return (
        <div className="w-full mt-2">
            {/* info text */}
            <div className="text-center">
                <h1 className="text-3xl font-bold">Youtube Video Downloader</h1>
                <p className="text-center">Download youtube video easily.</p>
            </div>
            {/* input */}
            <div className="flex gap-2 flex-1 w-full">
                <input disabled={downloadStatus === "loading"} ref={inputRef} type="text" placeholder="Enter youtube video URL" className="input input-bordered flex-1" />
                <button disabled={downloadStatus === "loading"} onClick={handleDownload} className="btn btn-primary">
                    {downloadStatus === "loading" && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Download
                </button>
            </div>
        </div>

    )

}