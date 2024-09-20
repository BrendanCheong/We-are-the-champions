import { TEST_USER_ID } from "@/config/constants";
import { CreateMatchesRequest, Match } from "./types";

export default function transformMatchesData(
  input: string,
  userId: string = TEST_USER_ID
): CreateMatchesRequest {
  const lines = input.split("\n").filter((line) => line.trim() !== "");
  const matches: Match[] = lines.map((line) => {
    const [firstTeam, secondTeam, score1, score2] = line.trim().split(/\s+/);
    return {
      firstTeam,
      secondTeam,
      firstTeamGoals: parseInt(score1),
      secondTeamGoals: parseInt(score2),
    };
  });

  return {
    userId,
    matches,
  };
}
