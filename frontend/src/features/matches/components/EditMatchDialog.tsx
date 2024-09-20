import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { usePutMatchMutation } from "../api/useMatchesQuery";
import { PutMatchData } from "../types";
import { TEST_USER_ID } from "@/config/constants";
import { GET_RANKING_QUERY_KEY } from "@/features/leaderboard/constants";
import { GET_TEAMS_AND_GROUP_QUERY_KEY } from "@/features/teams/constants";
import { GET_MATCHES_QUERY_KEY } from "../constants";
import { isAxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface MatchResponse {
  id: string;
  firstTeamName: string;
  secondTeamName: string;
  firstTeamGoals: number;
  secondTeamGoals: number;
  firstTeamId: string;
  secondTeamId: string;
}

interface EditMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchResponse | null;
}

const EditMatchDialog: React.FC<EditMatchDialogProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const [editedMatch, setEditedMatch] = useState<PutMatchData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (match) {
      setEditedMatch({
        firstTeamName: match.firstTeamName,
        secondTeamName: match.secondTeamName,
        firstTeamId: match.firstTeamId,
        secondTeamId: match.secondTeamId,
        firstTeamGoal: match.firstTeamGoals,
        secondTeamGoal: match.secondTeamGoals,
        matchId: match.id,
        userId: TEST_USER_ID,
      });
    }
  }, [match]);

  const { mutate, isPending } = usePutMatchMutation({
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
      ]);
      handleClose();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data.error);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update match. Please try again.",
        });
      }
    },
  });

  function handleClose() {
    onClose();
    setErrorMessage("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editedMatch) {
      setEditedMatch({
        ...editedMatch,
        [e.target.name]:
          e.target.type === "number" ? Number(e.target.value) : e.target.value,
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editedMatch) {
      mutate(editedMatch);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstTeamName" className="text-right">
                First Team
              </Label>
              <Input
                id="firstTeamName"
                name="firstTeamName"
                value={editedMatch?.firstTeamName || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondTeamName" className="text-right">
                Second Team
              </Label>
              <Input
                id="secondTeamName"
                name="secondTeamName"
                value={editedMatch?.secondTeamName || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstTeamGoal" className="text-right">
                First Team Goals
              </Label>
              <Input
                id="firstTeamGoal"
                name="firstTeamGoal"
                type="number"
                min={0}
                value={editedMatch?.firstTeamGoal || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondTeamGoal" className="text-right">
                Second Team Goals
              </Label>
              <Input
                id="secondTeamGoal"
                name="secondTeamGoal"
                type="number"
                min={0}
                value={editedMatch?.secondTeamGoal || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Label
            htmlFor="errorMessage"
            className="text-red-600 dark:text-red-400"
          >
            {errorMessage}
          </Label>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Match"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMatchDialog;
