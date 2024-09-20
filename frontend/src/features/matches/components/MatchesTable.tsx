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

  function handleEditClick(match: MatchResponse) {
    setSelectedMatch(match);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMatch(null);
  }

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <>
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
          {matches.map((match) => (
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
      <EditMatchDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        match={selectedMatch}
      />
    </>
  );
};

export default MatchesTable;
