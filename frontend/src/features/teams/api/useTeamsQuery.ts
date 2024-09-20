import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import {
  CREATE_TEAMS_MUTATION_KEY,
  GET_TEAMS_AND_GROUP_QUERY_KEY,
} from "../constants";
import { FIVE_MINUTES, RETRY_COUNT, TEN_MINUTES } from "@/config/constants";
import {
  CreateTeamsRequest,
  CreateTeamsResponse,
  TeamAndGroupResponse,
} from "../types";

const postCreateTeams = async (data: CreateTeamsRequest) => {
  const response = await axios.post<CreateTeamsResponse>(
    `${import.meta.env.VITE_APP_API_URL}/teams`,
    data
  );
  return response.data;
};

const getTeamsAndGroup = async (userId: string) => {
  const response = await axios.get<TeamAndGroupResponse[]>(
    `${import.meta.env.VITE_APP_API_URL}/teams?userId=${userId}`
  );
  return response.data;
};

export const useCreateTeamsMutation = (
  options?: UseMutationOptions<CreateTeamsResponse, Error, CreateTeamsRequest>
) => {
  return useMutation({
    mutationKey: CREATE_TEAMS_MUTATION_KEY,
    mutationFn: postCreateTeams,
    retry: RETRY_COUNT,
    ...options,
  });
};

export const useTeamsAndGroupQuery = (userId: string) => {
  return useQuery({
    queryKey: [GET_TEAMS_AND_GROUP_QUERY_KEY, userId],
    queryFn: () => getTeamsAndGroup(userId),
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: RETRY_COUNT,
    staleTime: TEN_MINUTES,
  });
};
