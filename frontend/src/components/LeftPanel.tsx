import useIsMobile from "@/hooks/useIsMobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import React from "react";
import TeamsTextArea from "@/features/teams/components/TeamsTextArea";
import { TEST_USER_ID } from "@/config/constants";
import { useTeamsAndGroupQuery } from "@/features/teams/api/useTeamsQuery";
import MatchesTextArea from "@/features/matches/components/MatchesTextArea";
import { useMatchesQuery } from "@/features/matches/api/useMatchesQuery";
import DeleteAllDataDialog from "@/features/deleteAll/components/DeleteAllDialog";

const LeftPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: teams, isLoading: isTeamsLoading } =
    useTeamsAndGroupQuery(TEST_USER_ID);
  const { data: matches, isLoading: isMatchesLoading } =
    useMatchesQuery(TEST_USER_ID);

  console.log(matches, isMatchesLoading);

  return (
    <div
      className={`${
        isMobile
          ? "w-full"
          : "w-[43%] h-screen overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 active:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:active:[&::-webkit-scrollbar-thumb]:bg-neutral-300 "
      } p-4`}
    >
      <div className="flex justify-end items-center mb-4">
        <DeleteAllDataDialog />
      </div>
      {/* First Accordion */}
      <Accordion type="single" collapsible defaultValue="text-inputs">
        <AccordionItem value="text-inputs">
          <AccordionTrigger>Teams & match input</AccordionTrigger>
          <AccordionContent className="p-2">
            <Label className="font-base text-gray-400">
              Add registered teams and matches played here.
            </Label>
            <div className="pt-4">
              <TeamsTextArea teams={teams ?? []} isLoading={isTeamsLoading} />
              <MatchesTextArea
                matches={matches ?? []}
                isLoading={isMatchesLoading}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Second Accordion */}

      <Accordion type="single" collapsible defaultValue="logging-history">
        <AccordionItem value="logging-history">
          <AccordionTrigger>Logs</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <div className="border rounded p-2 mb-2">Log/History Item 1</div>
              <div className="border rounded p-2 mb-2">Log/History Item 2</div>
              <div className="border rounded p-2">Log/History Item 3</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LeftPanel;
