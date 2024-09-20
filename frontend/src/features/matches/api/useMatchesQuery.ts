import { FIVE_MINUTES, RETRY_COUNT, TEN_MINUTES } from "@/config/constants";
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  CREATE_MATCHES_MUTATION_KEY,
  GET_MATCHES_QUERY_KEY,
} from "../constants";
import {
  CreateMatchesRequest,
  CreateMatchesResponse,
  GetMatchesAndTeamsResponse,
} from "../types";
import axios from "axios";

const postCreateMatches = async (data: CreateMatchesRequest) => {
  const response = await axios.post<CreateMatchesResponse>(
    `${import.meta.env.VITE_APP_API_URL}/matches`,
    data
  );
  return response.data;
};

const getMatches = async (userId: string) => {
  const response = await axios.get<GetMatchesAndTeamsResponse[]>(
    `${import.meta.env.VITE_APP_API_URL}/matches?userId=${userId}`
  );
  return response.data;
};

export const useCreateMatchesMutation = (
  options?: UseMutationOptions<
    CreateMatchesResponse,
    Error,
    CreateMatchesRequest
  >
) => {
  return useMutation({
    mutationKey: CREATE_MATCHES_MUTATION_KEY,
    mutationFn: postCreateMatches,
    retry: RETRY_COUNT,
    ...options,
  });
};

export const useMatchesQuery = (userId: string) => {
  return useQuery({
    queryKey: [GET_MATCHES_QUERY_KEY, userId],
    queryFn: () => getMatches(userId),
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: RETRY_COUNT,
    staleTime: TEN_MINUTES,
  });
};
