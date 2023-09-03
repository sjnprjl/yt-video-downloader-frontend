import { Toaster } from "react-hot-toast";
import { DownloadInputCard } from "./components/DownloadInputCard"
import { VideoDownloadCardContainer } from "./containers/VideoDownloadCardContainer"
import { YtVideo } from "./interface/yt-video.interface";
import { useVideoState } from "./stores";


function App() {
  const setVideos = useVideoState((state) => state.addNewVideo);

  function handleNewVideo(metadata: YtVideo) {
    setVideos(metadata);
  }

  return <div className="w-[90%] max-w-[40rem] m-auto h-full flex flex-col items-center">
    <DownloadInputCard onMetadataFound={handleNewVideo} />
    <div className="mt-2 w-full">
      <VideoDownloadCardContainer />
    </div>
    <Toaster toastOptions={{
      className: 'toast-style',
    }} />
  </div>
}

export default App
