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
import LogDetailsDialog from "./LogDetailsDialog";
import { Log } from "../types";

interface LoggingTableProps {
  logs: Log[];
  isLoading: boolean;
}

const LoggingTable: React.FC<LoggingTableProps> = ({ logs, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = logs.slice(indexOfFirstItem, indexOfLastItem);

  function handleViewDetails(log: Log) {
    setSelectedLog(log);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedLog(null);
  }

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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
      <div className="mb-4">
        <Select
          onValueChange={handleItemsPerPageChange}
          value={itemsPerPage.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
          {currentItems.map((log, index) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {indexOfFirstItem + index + 1}
              </TableCell>
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
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(logs.length / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= logs.length}
        >
          Next
        </Button>
      </div>
      <LogDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        log={selectedLog}
      />
    </>
  );
};

export default LoggingTable;
