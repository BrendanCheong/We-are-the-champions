import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { TeamAndGroupResponse } from "@/features/teams/types";

interface TeamDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamAndGroupResponse | null;
}

const TeamDetailsDialog: React.FC<TeamDetailsDialogProps> = ({
  isOpen,
  onClose,
  team,
}) => {
  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team.name} Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="mt-4">
            <p>
              <strong>Team ID:</strong> {team.id}
            </p>
            <p>
              <strong>Registration Date:</strong>{" "}
              {format(parseISO(team.registrationDate), "MMMM d, yyyy")}
            </p>
            <p>
              <strong>Group Number:</strong> {team.group.groupNumber}
            </p>
            <p>
              <strong>Created By:</strong> {team.createdById}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {format(parseISO(team.createdAt), "MMMM d, yyyy HH:mm:ss")}
            </p>
            {team.updatedById && (
              <p>
                <strong>Updated By:</strong> {team.updatedById}
              </p>
            )}
            {team.updatedAt && (
              <p>
                <strong>Updated At:</strong>{" "}
                {format(team.updatedAt, "MMMM d, yyyy HH:mm:ss")}
              </p>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsDialog;
