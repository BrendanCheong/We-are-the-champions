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
import LogDetailsDialog from "./LogDetailsDialog";
import { Log } from "../types";

interface LoggingTableProps {
  logs: Log[];
  isLoading: boolean;
}

const LoggingTable: React.FC<LoggingTableProps> = ({ logs, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  function handleViewDetails(log: Log) {
    setSelectedLog(log);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedLog(null);
  }

  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  return (
    <>
      <p className="mb-4 text-sm text-gray-600">
        History of all actions taken. The operations logged are for the actions
        of <strong>create</strong>, <strong>delete</strong>,{" "}
        <strong>put</strong>.
      </p>
      <Table>
        <TableCaption>All data changes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Action Type</TableHead>
            <TableHead>Table Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{log.actionType}</TableCell>
              <TableCell>{log.tableName}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleViewDetails(log)}
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LogDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        log={selectedLog}
      />
    </>
  );
};

export default LoggingTable;
