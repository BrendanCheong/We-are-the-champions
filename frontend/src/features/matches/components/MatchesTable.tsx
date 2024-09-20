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

// Assuming you have this type defined somewhere
interface MatchResponse {
  id: string;
  firstTeamName: string;
  secondTeamName: string;
  firstTeamGoals: number;
  secondTeamGoals: number;
}

interface MatchesTableProps {
  matches: MatchResponse[];
  isLoading: boolean;
}

const MatchesTable: React.FC<MatchesTableProps> = ({ matches, isLoading }) => {
  function handleActionClick(match: MatchResponse) {
    console.log("Match information:", match);
  }

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
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
            <TableCell className="font-medium">{match.firstTeamName}</TableCell>
            <TableCell>{match.secondTeamName}</TableCell>
            <TableCell>{match.firstTeamGoals}</TableCell>
            <TableCell>{match.secondTeamGoals}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleActionClick(match)}
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

export default MatchesTable;
