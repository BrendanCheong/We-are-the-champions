import { FIVE_MINUTES, RETRY_COUNT, TEN_MINUTES } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GET_RANKING_QUERY_KEY } from "../constants";

const getRanking = async (userId: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_URL}/ranking?userId=${userId}`
  );
  return response.data;
};

export const useRankingQuery = (userId: string) => {
  return useQuery({
    queryKey: [GET_RANKING_QUERY_KEY, userId],
    queryFn: () => getRanking(userId),
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: RETRY_COUNT,
    staleTime: TEN_MINUTES,
  });
};
