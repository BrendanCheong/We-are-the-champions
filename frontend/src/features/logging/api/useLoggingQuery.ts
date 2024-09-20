import { FIVE_MINUTES, RETRY_COUNT, TEN_MINUTES } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GET_LOGS_QUERY_KEY } from "../constants";
import { Log } from "../types";

export const useLogsQuery = (userId: string) => {
  return useQuery({
    queryKey: [GET_LOGS_QUERY_KEY, userId],
    queryFn: () => getLogs(userId),
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: RETRY_COUNT,
    staleTime: TEN_MINUTES,
  });
};

const getLogs = async (userId: string): Promise<Log[]> => {
  const response = await axios.get<Log[]>(
    `${import.meta.env.VITE_APP_API_URL}/logs?userId=${userId}`
  );
  return response.data;
};
