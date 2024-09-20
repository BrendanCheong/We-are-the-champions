import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { TeamAndGroupResponse } from "@/features/teams/types";

interface TeamsTableProps {
  teams: TeamAndGroupResponse[];
  isLoading: boolean;
}

const TeamsTable: React.FC<TeamsTableProps> = ({ teams }) => {
  function handleActionClick(team: TeamAndGroupResponse) {
    console.log("Team information:", {
      id: team.id,
      name: team.name,
      registrationDate: team.registrationDate,
      groupId: team.groupId,
      groupNumber: team.group.groupNumber,
    });
  }

  return (
    <Table>
      <TableCaption>A list of your teams.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Team Name</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams &&
          teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>
                {format(parseISO(team.registrationDate), "MMM d")}
              </TableCell>
              <TableCell>{team.group.groupNumber}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleActionClick(team)}
                  variant="outline"
                  size="sm"
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TeamsTable;
