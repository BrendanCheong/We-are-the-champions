import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GroupRanking } from "../types";
import { cn } from "@/utils/cn";

interface LeaderboardTableProps {
  groupRankings: GroupRanking[];
  isLoading: boolean;
}
const LeaderboardTable: React.FC<LeaderboardTableProps> = (props) => {
  const { groupRankings } = props;
  return (
    <div className="mt-4">
      {groupRankings.map((groupRanking, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Group {groupRanking.groupNumber}
          </h2>
          <Table>
            <TableCaption>
              Ranking for Group {groupRanking.groupNumber}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Position</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Goals</TableHead>
                <TableHead className="text-right">Alt. Score</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Draws</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupRanking.teams.map((team, index) => (
                <TableRow
                  key={team.teamName}
                  className={cn(
                    index < 4 && "bg-orange-200 hover:bg-orange-300",
                    index >= 4 && "hover:bg-gray-100"
                  )}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell className="text-right">
                    {team.totalPoints}
                  </TableCell>
                  <TableCell className="text-right">
                    {team.totalScore}
                  </TableCell>
                  <TableCell className="text-right">
                    {team.alternatePoints}
                  </TableCell>
                  <TableCell className="text-right">{team.wins}</TableCell>
                  <TableCell className="text-right">{team.losses}</TableCell>
                  <TableCell className="text-right">{team.draws}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardTable;
