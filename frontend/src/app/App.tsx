import "./App.css";
import useIsMobile from "@/hooks/useIsMobile";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function App() {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  return (
    <div className={`${isMobile ? "flex flex-col" : "flex h-screen"}`}>
      <Button onClick={handleSignOut} className="absolute top-4 right-4">
        Sign Out
      </Button>
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default App;
