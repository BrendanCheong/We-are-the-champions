import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const QUERY_KEY = ["hello"];
const FIVE_MINUTES = 1000 * 60 * 5;
const TEN_MINUTES = 1000 * 60 * 10;
const RETRY_COUNT = 3;

const fetchHelloMessage = async () => {
  const response = await axios.get("http://localhost:4000/v1/api/hello");
  return response.data;
};

export const useHelloQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchHelloMessage,
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    refetchOnWindowFocus: false,
    retry: RETRY_COUNT,
    enabled: true,
  });
};
