import { create } from "zustand";
import { YtVideo } from "../interface/yt-video.interface";

interface VideoState {
  videos: YtVideo[];
  addNewVideo: (video: YtVideo) => void;
  addVideoList: (videos: YtVideo[]) => void;
  mutateVideoState: (id: string, video: Partial<YtVideo>) => void;
  removeVideo: (id: string) => void;
}

export const useVideoState = create<VideoState>()((set) => ({
  videos: [],
  addNewVideo: (video) =>
    set((state) => ({ videos: [...state.videos, video] })),
  addVideoList(videos) {
    set({ videos });
  },
  mutateVideoState(id, video) {
    set((state) => {
      const videoIndex = state.videos.findIndex((v) => v.id === id);
      if (videoIndex === -1) return state;
      state.videos[videoIndex] = { ...state.videos[videoIndex], ...video };

      return { videos: [...state.videos] };
    });
  },
  removeVideo(id) {
    set((state) => ({ videos: state.videos.filter((v) => v.id !== id) }));
  },
}));
