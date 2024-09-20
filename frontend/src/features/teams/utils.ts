import { CreateTeamsRequest } from "./types";

export default function transformTeamsData(
  input: string,
  userId: string
): CreateTeamsRequest {
  const lines = input.trim().split("\n");
  const teams = lines.map((line) => {
    const [name, registrationDate, groupStr] = line.trim().split(/\s+/);
    return {
      name,
      registrationDate,
      group: parseInt(groupStr, 10),
    };
  });

  return {
    teams,
    userId,
  };
}
