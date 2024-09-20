import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Log } from "../types";

interface LogDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  log: Log | null;
}

const LogDetailsDialog: React.FC<LogDetailsDialogProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <div>{log?.details ? log.details : "No details for this log"}</div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetailsDialog;
