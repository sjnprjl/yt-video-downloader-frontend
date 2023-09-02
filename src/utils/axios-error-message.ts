import { AxiosError } from "axios";

export const axiosErrorMessage = <T extends { message: string }>(
  error: AxiosError<T> | Error
) => {
  return error instanceof AxiosError
    ? error.response?.data?.message || error.message
    : error.message;
};
