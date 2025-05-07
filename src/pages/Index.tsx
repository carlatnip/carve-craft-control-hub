
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { MachineProvider } from "@/contexts/MachineContext";
import { GCodeProvider } from "@/contexts/GCodeContext";
import Header from "@/components/Header";
import ConnectionPanel from "@/components/ConnectionPanel";
import MachineStatus from "@/components/MachineStatus";
import JogControls from "@/components/JogControls";
import GCodeEditor from "@/components/GCodeEditor";
import ConsoleOutput from "@/components/ConsoleOutput";

const Index = () => {
  return (
    <ConnectionProvider>
      <MachineProvider>
        <GCodeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-1 space-y-6">
                <ConnectionPanel />
                <MachineStatus />
                <JogControls />
              </div>
              
              <div className="md:col-span-2 grid grid-rows-2 gap-6 h-[calc(100vh-10rem)]">
                <div className="row-span-1">
                  <GCodeEditor />
                </div>
                <div className="row-span-1">
                  <ConsoleOutput />
                </div>
              </div>
            </main>
          </div>
        </GCodeProvider>
      </MachineProvider>
    </ConnectionProvider>
  );
};

export default Index;
