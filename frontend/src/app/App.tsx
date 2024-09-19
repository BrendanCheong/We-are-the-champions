import "./App.css";
import useIsMobile from "@/hooks/useIsMobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDemo from "@/components/TableDemo";

function App() {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? "flex flex-col" : "flex h-screen"}`}>
      {!isMobile && (
        // Quick Actions Bar (Desktop only)
        <div className="w-[4%] bg-gray-100 dark:bg-gray-800 p-2 flex flex-col items-center">
          <div className="mb-4 cursor-pointer">Icon 1</div>
          <div className="mb-4 cursor-pointer">Icon 2</div>
          <div className="mb-4 cursor-pointer">Icon 3</div>
        </div>
      )}

      {/* Left Side Panel (or Full Width on Mobile) */}
      <div
        className={`${
          isMobile
            ? "w-full"
            : "w-[41%] h-screen overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 active:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:active:[&::-webkit-scrollbar-thumb]:bg-neutral-300 "
        } p-4`}
      >
        {/* First Accordion */}
        <Accordion type="single" collapsible defaultValue="text-inputs">
          <AccordionItem value="text-inputs">
            <AccordionTrigger>Teams & match input</AccordionTrigger>
            <AccordionContent className="">
              <Label className="font-base text-gray-400">
                Add registered teams and matches played here.
              </Label>
              <div className="pt-4">
                <div className="mb-4">
                  {/** Text Area */}
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="message-2">Teams</Label>
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
                <div className="border rounded p-2 mb-2">
                  Log/History Item 1
                </div>
                <div className="border rounded p-2 mb-2">
                  Log/History Item 2
                </div>
                <div className="border rounded p-2">Log/History Item 3</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right Side Panel (or Below on Mobile) */}
      <div
        className={`${isMobile ? "w-full" : "w-[55%]"} p-4`}
        id="right-panel"
      >
        {/** Tabs */}
        <Tabs defaultValue="teams" className="flex border-b flex-col">
          <TabsList>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          </TabsList>
          {/** Tabs content */}
          <TabsContent value="teams">
            <TableDemo />
          </TabsContent>
          <TabsContent value="matches">matches table</TabsContent>
          <TabsContent value="leaderboards">leaderboards table</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
