
import { Button } from "@/components/ui/button";
import { useMachine } from "@/contexts/MachineContext";

const Header = () => {
  const { status } = useMachine();
  
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b">
      <div className="flex items-center">
        <div className="text-xl font-bold text-cnc-primary">CarveCraft</div>
        <div className="ml-2 text-muted-foreground">Control Hub</div>
      </div>
      
      <div className="flex items-center">
        {status.connected && (
          <div className="flex items-center mr-4">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
