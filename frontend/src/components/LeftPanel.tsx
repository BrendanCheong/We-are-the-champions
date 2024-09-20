import useIsMobile from "@/hooks/useIsMobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import React from "react";
import TeamsTextArea from "@/features/teams/components/TeamsTextArea";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { TEST_USER_ID } from "@/config/constants";
import { useTeamsAndGroupQuery } from "@/features/teams/api/useTeamsQuery";

const LeftPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const { data, isLoading } = useTeamsAndGroupQuery(TEST_USER_ID);

  return (
    <div
      className={`${
        isMobile
          ? "w-full"
          : "w-[43%] h-screen overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 active:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:active:[&::-webkit-scrollbar-thumb]:bg-neutral-300 "
      } p-4`}
    >
      {/* First Accordion */}
      <Accordion type="single" collapsible defaultValue="text-inputs">
        <AccordionItem value="text-inputs">
          <AccordionTrigger>Teams & match input</AccordionTrigger>
          <AccordionContent className="p-2">
            <Label className="font-base text-gray-400">
              Add registered teams and matches played here.
            </Label>
            <div className="pt-4">
              <TeamsTextArea teams={data ?? []} isLoading={isLoading} />
              <div className="mb-4">
                {/** Text Area */}
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message-2">Matches</Label>
                  <Textarea
                    placeholder="Type your message here."
                    id="message-2"
                  />
                </div>
                <section
                  id="button-container"
                  className="flex justify-between mt-4"
                >
                  <div className="w-[80%]">
                    <Button className="w-full">Save</Button>
                  </div>
                  <div className="w-[20%] ml-2">
                    <Button className="w-full" variant="outline">
                      Clear
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Second Accordion */}

      <Accordion type="single" collapsible defaultValue="logging-history">
        <AccordionItem value="logging-history">
          <AccordionTrigger>Logs</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <div className="border rounded p-2 mb-2">Log/History Item 1</div>
              <div className="border rounded p-2 mb-2">Log/History Item 2</div>
              <div className="border rounded p-2">Log/History Item 3</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LeftPanel;
