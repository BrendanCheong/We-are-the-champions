import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDeleteAllMutation } from "../api/useDeleteAllQuery";
import { TEST_USER_ID } from "@/config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { GET_RANKING_QUERY_KEY } from "@/features/leaderboard/constants";
import { GET_MATCHES_QUERY_KEY } from "@/features/matches/constants";
import { GET_TEAMS_AND_GROUP_QUERY_KEY } from "@/features/teams/constants";
import { GET_LOGS_QUERY_KEY } from "@/features/logging/constants";

const DeleteAllDataDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteAllMutation = useDeleteAllMutation({
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
      toast({
        title: "Deletion Successful",
        description: "All matches, teams, and groups have been deleted.",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Deletion Failed",
        description: "An error occurred while deleting data.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAll = () => {
    deleteAllMutation.mutate(TEST_USER_ID);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete All Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all your
            teams, matches, and group data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={deleteAllMutation.isPending}
          >
            {deleteAllMutation.isPending
              ? "Deleting..."
              : "Yes, Delete All Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllDataDialog;
