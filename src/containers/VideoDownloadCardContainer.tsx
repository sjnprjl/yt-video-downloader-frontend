import { useState } from "react";
import { api } from "../api";
import { VideoDownloadCard } from "../components/VideoDownloadCard";
import { YtVideo } from "../interface/yt-video.interface";
import { useVideoState } from "../stores";
import { saveAs } from 'file-saver';
import { Modal } from "../components/Modal";
import toast from "react-hot-toast";
import { axiosErrorMessage } from "../utils";
import { AxiosError } from "axios";

export function VideoDownloadCardContainer() {
  const [openModal, setOpenModal] = useState(false);
  const [toAbortItem, setToAbortItem] = useState<YtVideo | null>(null);
  const videos = useVideoState((state) => state.videos);
  const mutateVideoState = useVideoState((state) => state.mutateVideoState);
  const deleteVideo = useVideoState((state) => state.removeVideo);

  const [controllerIndexes, setControllerIndexes] = useState<{ [key: string]: AbortController }>({});


  const handleCancelDownload = (item: YtVideo) => {
    setToAbortItem(item);
    setOpenModal(true);
  }

  const abortDownload = () => {
    if (toAbortItem) {
      controllerIndexes[toAbortItem.id]?.abort?.();
      setOpenModal(false);
      delete controllerIndexes[toAbortItem.id];
      setControllerIndexes({ ...controllerIndexes });
      deleteVideo(toAbortItem.id);
      setToAbortItem(null);
    }
  }

  const handleStartDownload = async (item: YtVideo, audioOnly: boolean) => {
    const controller = new AbortController();
    setControllerIndexes(indexes => {
      if (item.id in indexes) {
        return indexes;
      }
      indexes[item.id] = controller;
      return { ...indexes };
    })
    mutateVideoState(item.id, { status: 'loading' });
    try {

      const { data: fileSizeData } = await api.post('yt/file-size', {
        videoUrl: item.url,
        isAudioOnly: audioOnly,
      })
      mutateVideoState(item.id, { fileSize: fileSizeData.fileSize });

      mutateVideoState(item.id, { status: 'downloading' })

      const response = await api.post<Blob>('yt/download', {
        isAudioOnly: audioOnly,
        videoUrl: item.url,
      }, {
        responseType: 'blob',
        signal: controller.signal,
        onDownloadProgress(progressEvent) {
          const progress = progressEvent.loaded / (fileSizeData.fileSize ?? progressEvent.loaded) * 100;
          mutateVideoState(item.id, { progress });
        },
      });
      const blob = response.data;
      toast.success('Download successfully!');
      saveAs(blob, item.title);
      mutateVideoState(item.id, { status: 'success', progress: 100 });
    } catch (err) {
      console.log(`error reason for video id ${item.id}`, err);
      const message = axiosErrorMessage(err as AxiosError);
      toast.error(message);
      mutateVideoState(item.id, { status: 'error' })
    }
  }

  return <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[70vh]">
    <Modal title={"Are you sure?"} description={`You are going to remove download of video "${toAbortItem?.title}". This cannot be undone.`} open={openModal}>
      <div className="modal-action">
        <button className="btn btn-neutral" onClick={() => setOpenModal(false)}>No</button>
        <button className="btn bg-red-600 hover:bg-red-700" onClick={abortDownload}>Yes</button>
      </div>
    </Modal>
    {videos.map((item) => <VideoDownloadCard key={item.id} {...item} onStartDownload={(audioOnly: boolean) => handleStartDownload(item, audioOnly)} onCancelDownload={() => handleCancelDownload(item)} />)}
  </div>;

}
