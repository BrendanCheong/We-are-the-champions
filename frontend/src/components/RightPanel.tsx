import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useIsMobile from "@/hooks/useIsMobile";
import TeamsTable from "../features/teams/components/TeamsTable";
import { TEST_USER_ID } from "@/config/constants";
import { useTeamsAndGroupQuery } from "@/features/teams/api/useTeamsQuery";
import MatchesTable from "@/features/matches/components/MatchesTable";
import { useMatchesQuery } from "@/features/matches/api/useMatchesQuery";

const RightPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: teams, isLoading: isTeamsLoading } =
    useTeamsAndGroupQuery(TEST_USER_ID);
  const { data: matches, isLoading: isMatchesLoading } =
    useMatchesQuery(TEST_USER_ID);

  return (
    <div className={`${isMobile ? "w-full" : "w-[57%]"} p-4`} id="right-panel">
      <Tabs defaultValue="teams" className="flex border-b flex-col">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
        </TabsList>
        <TabsContent value="teams">
          <TeamsTable teams={teams ?? []} isLoading={isTeamsLoading} />
        </TabsContent>
        <TabsContent value="matches">
          <MatchesTable matches={matches ?? []} isLoading={isMatchesLoading} />
        </TabsContent>
        <TabsContent value="leaderboards">leaderboards table</TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
