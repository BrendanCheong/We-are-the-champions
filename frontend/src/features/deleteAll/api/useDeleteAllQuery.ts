// In a file like hooks/useDeleteAllMutation.ts
import { RETRY_COUNT } from "@/config/constants";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { DELETE_ALL_MUTATION_KEY } from "../constant";

const deleteAllTeamsMatchesGroups = async (userId: string) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_APP_API_URL}/delete-all?userId=${userId}`
  );
  return response.data;
};

export const useDeleteAllMutation = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  return useMutation({
    mutationKey: DELETE_ALL_MUTATION_KEY,
    mutationFn: deleteAllTeamsMatchesGroups,
    retry: RETRY_COUNT,
    ...options,
  });
};
