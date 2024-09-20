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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditMatchDialog from "./EditMatchDialog";

interface MatchResponse {
  id: string;
  firstTeamName: string;
  secondTeamName: string;
  firstTeamGoals: number;
  secondTeamGoals: number;
  firstTeamId: string;
  secondTeamId: string;
}

interface MatchesTableProps {
  matches: MatchResponse[];
  isLoading: boolean;
}

const MatchesTable: React.FC<MatchesTableProps> = ({ matches, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = matches.slice(indexOfFirstItem, indexOfLastItem);

  function handleEditClick(match: MatchResponse) {
    setSelectedMatch(match);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMatch(null);
  }

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Select
          onValueChange={handleItemsPerPageChange}
          value={itemsPerPage.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Matches per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>A list of your matches.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Team</TableHead>
            <TableHead>Second Team</TableHead>
            <TableHead>First Team Score</TableHead>
            <TableHead>Second Team Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="font-medium">
                {match.firstTeamName}
              </TableCell>
              <TableCell>{match.secondTeamName}</TableCell>
              <TableCell>{match.firstTeamGoals}</TableCell>
              <TableCell>{match.secondTeamGoals}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEditClick(match)}
                  variant="outline"
                  size="sm"
                >
                  Edit
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
          Page {currentPage} of {Math.ceil(matches.length / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= matches.length}
        >
          Next
        </Button>
      </div>
      <EditMatchDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        match={selectedMatch}
      />
    </>
  );
};

export default MatchesTable;
