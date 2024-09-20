import "./App.css";
import useIsMobile from "@/hooks/useIsMobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDemo from "@/components/TableDemo";
import LeftPanel from "@/components/LeftPanel";

function App() {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? "flex flex-col" : "flex h-screen"}`}>
      {/* Left Side Panel (or Full Width on Mobile) */}
      <LeftPanel />

      {/* Right Side Panel (or Below on Mobile) */}
      <div
        className={`${isMobile ? "w-full" : "w-[57%]"} p-4`}
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
