import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { GET_MATCHES_QUERY_KEY, MAXIMUM_MATCHES_PER_TEAM } from "../constants";
import { GetMatchesAndTeamsResponse } from "../types";
import { TEST_USER_ID } from "@/config/constants";
import transformMatchesData from "../utils";
import { useCreateMatchesMutation } from "../api/useMatchesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { GET_RANKING_QUERY_KEY } from "@/features/leaderboard/constants";

interface IProps {
  matches: GetMatchesAndTeamsResponse[];
  isLoading: boolean;
}

const MatchesTextArea: React.FC<IProps> = (props) => {
  const { matches, isLoading } = props;
  const [matchesInput, setMatchesInput] = useState("");
  const [matchesInputError, setMatchesInputError] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mutateMatches } = useCreateMatchesMutation({
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [GET_MATCHES_QUERY_KEY, TEST_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_RANKING_QUERY_KEY, TEST_USER_ID],
        }),
      ]);
      setMatchesInputError("");
    },
    onError: (error: Error) => {
      console.error("Error creating matches:", error);
      setMatchesInputError("Failed to create matches. Please try again.");
    },
  });

  function handleMatchInputSubmit() {
    if (matchesInput.trim() === "") {
      setMatchesInputError(
        "You cannot submit an empty field, please enter your match(es)"
      );
      return;
    }

    const input = matchesInput.split("\n").filter((line) => line.trim() != "");

    const checkExistingMatches = new Set(
      matches.map((match) => `${match.firstTeamName}_${match.secondTeamName}`)
    );
    const teamMatchCounts = new Map();

    for (let x = 0; x < input.length; x++) {
      const line = input[x];

      if (!line) {
        setMatchesInputError(
          `Error on line ${
            x + 1
          }: Invalid input. Refresh the page and try again if error persists.`
        );
        return;
      }

      const fields = line.trim().split(/\s+/);

      // Check correct number of fields
      if (fields.length !== 4) {
        setMatchesInputError(
          `Error on line ${
            x + 1
          }: Each line must contain exactly 4 fields (Team 1, Team 2, Team 1 goals, Team 2 goals).`
        );
        return;
      }

      const [team1, team2, score1, score2] = fields;

      if (!team1 || !team2 || !score1 || !score2) {
        setMatchesInputError(
          `Error on line ${
            x + 1
          }: All fields are required (Team 1, Team 2, Team 1 goals, Team 2 goals)`
        );
        return;
      }

      // Check that the teams are not the same
      if (team1 === team2) {
        setMatchesInputError(
          `Error on line ${x + 1}: Team 1 and Team 2 cannot be the same.`
        );
        return;
      }

      // Check that the scores are valid numbers
      const score1Num = parseInt(score1);
      const score2Num = parseInt(score2);
      if (
        isNaN(score1Num) ||
        isNaN(score2Num) ||
        score1Num < 0 ||
        score2Num < 0
      ) {
        setMatchesInputError(
          `Error on line ${x + 1}: Scores must be valid, non-negative numbers.`
        );
        return;
      }

      // Check for duplicate matches
      const matchKey1 = `${team1}_${team2}`;
      const matchKey2 = `${team2}_${team1}`;
      if (
        checkExistingMatches.has(matchKey1) ||
        checkExistingMatches.has(matchKey2)
      ) {
        setMatchesInputError(
          `Error on line ${x + 1}: This match has already been recorded.`
        );
        return;
      }
      checkExistingMatches.add(matchKey1);

      // Check maximum matches per team
      teamMatchCounts.set(team1, (teamMatchCounts.get(team1) || 0) + 1);
      teamMatchCounts.set(team2, (teamMatchCounts.get(team2) || 0) + 1);
      if (
        teamMatchCounts.get(team1) > MAXIMUM_MATCHES_PER_TEAM ||
        teamMatchCounts.get(team2) > MAXIMUM_MATCHES_PER_TEAM
      ) {
        setMatchesInputError(
          `Error on line ${
            x + 1
          }: A team cannot play more than ${MAXIMUM_MATCHES_PER_TEAM} matches.`
        );
        return;
      }
    }

    setMatchesInputError("");
    const matchesData = transformMatchesData(matchesInput, TEST_USER_ID);
    mutateMatches(matchesData);
  }

  function handleClear() {
    setMatchesInput("");
    setMatchesInputError("");
  }

  return (
    <div className="mb-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-2">Matches</Label>
        <Textarea
          value={matchesInput}
          onChange={(e) => setMatchesInput(e.target.value)}
          rows={12}
          placeholder="Enter your matches here"
          id="message-2"
          disabled={isLoading}
          aria-disabled={isLoading}
        />
        <Label htmlFor="message-2" className="text-red-600 dark:text-red-400">
          {matchesInputError}
        </Label>
      </div>
      <section id="button-container" className="flex justify-between mt-4">
        <div className="w-[80%]">
          <Button className="w-full" onClick={handleMatchInputSubmit}>
            Save
          </Button>
        </div>
        <div className="w-[20%] ml-2">
          <Button className="w-full" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MatchesTextArea;
