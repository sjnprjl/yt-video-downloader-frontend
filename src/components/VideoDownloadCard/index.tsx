import { ArrowDownTrayIcon, CheckBadgeIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { VideoStatus, YtVideo } from "../../interface/yt-video.interface";

const fallBackImageUrl = "data:image/png;base64,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";

export interface VideoDownloadCardProp extends YtVideo {
  onStartDownload?: (audioOnly: boolean) => void;
  onCancelDownload?: () => void;
}

function DownloadButtonStateComponent(props: { status: VideoStatus }) {
  switch (props.status) {
    case "loading":
      return <span className="loading loading-spinner loading-sm"></span>;
    case "error":
      return <ExclamationCircleIcon className="text-red-200 text-xs h-5 w-5" />
    case "idle":
      return <ArrowDownTrayIcon className="text-white text-xs h-5 w-5" />
    case "success":
      return <CheckBadgeIcon className="text-green-200 text-xs h-5 w-5" />
    case 'downloading':
      return <XCircleIcon className="text-red-200 text-xs h-5 w-5" />
    default:
      return <ArrowDownTrayIcon className="text-white text-xs h-5 w-5" />

  }



}

const MAX_TITLE_LENGTH = 50;
export function VideoDownloadCard(props: VideoDownloadCardProp) {
  const [checked, setChecked] = useState(false);
  const title = props.title.length > MAX_TITLE_LENGTH ? props.title.substring(0, MAX_TITLE_LENGTH) + "..." : props.title;
  return <div className="flex gap-2 bg-base-100 shadow-xl p-3 justify-between">
    {/* thumbnail section */}
    <figure>
      <img className="h-12 rounded-md" src={props.thumbnail ?? fallBackImageUrl} alt="Movie" />
    </figure>
    {/* video info section */}
    <div className="flex-1">
      <h2 className="text-sm font-bold">{title}</h2>
      {/* progress and all */}
      <progress className={`progress progress-${props.status === "error" ? "error" : "accent"}`} value={props.progress ?? 0} max="100"></progress>
    </div>
    <div className="flex gap-2 items-center">
      <label className="label cursor-pointer">
        <span className="label-text">Audio Only</span>
        <input onChange={() => setChecked(!checked)} checked={checked} type="checkbox" className="toggle toggle-xs ml-2" disabled={props.status === 'loading'} />
      </label>
      {/* download button */}
      <button className="btn bg-base-200" onClick={() => {
        if (props.status === "idle" || !props.status)
          props.onStartDownload?.(checked)
        else if (props.status === 'downloading') {
          props.onCancelDownload?.()
        }
      }} disabled={props.status === 'loading'}>
        <DownloadButtonStateComponent status={props.status ?? "idle"} />
      </button>

    </div>
  </div>;
}
