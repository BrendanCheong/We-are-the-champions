import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamAndGroupResponse } from "@/features/teams/types";
import TeamDetailsDialog from "./TeamsDetailsDialog";

interface TeamsTableProps {
  teams: TeamAndGroupResponse[];
  isLoading: boolean;
}

const TeamsTable: React.FC<TeamsTableProps> = ({ teams, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamAndGroupResponse | null>(
    null
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = teams.slice(indexOfFirstItem, indexOfLastItem);

  function handleActionClick(team: TeamAndGroupResponse) {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedTeam(null);
  }

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  if (isLoading) {
    return <div>Loading teams...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Select
          onValueChange={handleItemsPerPageChange}
          value={itemsPerPage.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Teams per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
          {currentTeams.map((team) => (
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
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(teams.length / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= teams.length}
        >
          Next
        </Button>
      </div>
      <TeamDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        team={selectedTeam}
      />
    </>
  );
};

export default TeamsTable;
