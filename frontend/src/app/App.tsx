import "./App.css";
import useIsMobile from "@/hooks/useIsMobile";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";

function App() {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? "flex flex-col" : "flex h-screen"}`}>
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default App;
