import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import {
  GET_TEAMS_AND_GROUP_QUERY_KEY,
  MAXIMUM_AMOUNT_OF_TEAMS,
  MAXMIMUM_AMOUNT_OF_GROUPS,
} from "../constants";
import { parse, isValid, isDate } from "date-fns";
import { TeamAndGroupResponse } from "../types";
import { TEST_USER_ID } from "@/config/constants";
import transformTeamsData from "../utils";
import { useCreateTeamsMutation } from "../api/useTeamsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { GET_RANKING_QUERY_KEY } from "@/features/leaderboard/constants";
import { GET_MATCHES_QUERY_KEY } from "@/features/matches/constants";

interface IProps {
  teams: TeamAndGroupResponse[];
  isLoading: boolean;
}

const TeamsTextArea: React.FC<IProps> = (props) => {
  const { teams, isLoading } = props;
  const [teamsInput, setTeamsInput] = useState("");
  const [teamsInputError, setTeamsInputError] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mutateTeams } = useCreateTeamsMutation({
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [GET_TEAMS_AND_GROUP_QUERY_KEY, TEST_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_MATCHES_QUERY_KEY, TEST_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_RANKING_QUERY_KEY, TEST_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_LOGS_QUERY_KEY, TEST_USER_ID],
        }),
      ]);
      setTeamsInputError("");
    },
    onError: (error: Error) => {
      console.error("Error creating teams:", error);
      setTeamsInputError("Failed to create teams. Please try again.");
    },
  });

  function handleTeamInputSubmit() {
    if (teamsInput.trim() === "") {
      setTeamsInputError(
        "You cannot submit an empty field, please enter your team(s)"
      );
      return;
    }

    const input = teamsInput.split("\n").filter((line) => line.trim() != "");
    const proposedTeamCount = teams.length + input.length;

    if (proposedTeamCount > MAXIMUM_AMOUNT_OF_TEAMS) {
      setTeamsInputError(
        `You cannot have more than ${MAXIMUM_AMOUNT_OF_TEAMS} teams`
      );
      return;
    }

    const checkTeamNames = new Set(teams.map((team) => team.name));
    const existingGroups = new Set(teams.map((team) => team.group.groupNumber));
    const groupCounts = teams.reduce((acc, team) => {
      acc[team.group.groupNumber] = (acc[team.group.groupNumber] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (let x = 0; x < input.length; x++) {
      const line = input[x];

      if (!line) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: Invalid input. Refresh the page and try again if error persist.`
        );
        return;
      }

      const fields = line.trim().split(/\s+/);

      // Check correct number of fields
      if (fields.length !== 3) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: Each line must contain these fields only (Name, Registration Date, Group Number).`
        );
        return;
      }

      const [nName, nRegistrationDate, nGroupNumber] = fields;

      if (!nName || !nRegistrationDate || !nGroupNumber) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: All fields are required (Name, Registration Date, Group Number)`
        );
        return;
      }

      // Check that the name is not taken
      if (checkTeamNames.has(nName)) {
        setTeamsInputError(
          `Error on line ${x + 1}: Team name "${nName}" is already taken.`
        );
        return;
      }
      checkTeamNames.add(nName);

      // Check that the group number is a number
      //TODO: use zod here instead
      if (
        !Number.isFinite(Number(nGroupNumber)) &&
        !(Number(nGroupNumber) >>> 0 === parseFloat(nGroupNumber))
      ) {
        setTeamsInputError(
          `Error on line ${x + 1}: Group number must be a valid number.`
        );
        return;
      }
      const parsedGroupNumber = parseInt(nGroupNumber);

      // Check if the group number is valid
      if (existingGroups.size < 2) {
        existingGroups.add(parsedGroupNumber);
      } else if (!existingGroups.has(parsedGroupNumber)) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: Invalid group number. Only two different group numbers are allowed.`
        );
        return;
      }

      // Check if the group has less than 6 teams
      groupCounts[nGroupNumber] = (groupCounts[nGroupNumber] || 0) + 1;
      if (groupCounts[nGroupNumber] > MAXMIMUM_AMOUNT_OF_GROUPS) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: Group ${nGroupNumber} already has the maximum number of 6 teams.`
        );
        return;
      }

      // Check if the registration day is correct
      const parsedDate = parse(nRegistrationDate, "dd/MM", new Date());

      if (!isDate(parsedDate) || !isValid(parsedDate)) {
        setTeamsInputError(
          `Error on line ${
            x + 1
          }: Invalid registration date. Ensure that it is in the format: DD/MM.`
        );
        return;
      }
    }

    setTeamsInputError("");
    const teamsData = transformTeamsData(teamsInput, TEST_USER_ID);
    mutateTeams(teamsData);
  }

  function handleClear() {
    setTeamsInput("");
    setTeamsInputError("");
  }
  return (
    <div className="mb-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-2">Teams</Label>
        <Textarea
          value={teamsInput}
          onChange={(e) => setTeamsInput(e.target.value)}
          rows={12}
          placeholder="Register your teams here"
          id="message-2"
          disabled={isLoading}
          aria-disabled={isLoading}
        />
        <Label htmlFor="message-2" className="text-red-600 dark:text-red-400">
          {teamsInputError}
        </Label>
      </div>
      <section id="button-container" className="flex justify-between mt-4">
        <div className="w-[80%]">
          <Button className="w-full" onClick={handleTeamInputSubmit}>
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

export default TeamsTextArea;
