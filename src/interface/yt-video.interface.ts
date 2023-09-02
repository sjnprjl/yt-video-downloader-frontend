export type VideoStatus =
  | "loading"
  | "success"
  | "error"
  | "idle"
  | "pending"
  | "downloading";
export interface YtVideo {
  id: string;
  title: string;
  thumbnail?: string;
  progress?: number;
  status?: VideoStatus;
  url: string;
  fileSize?: number;
}
