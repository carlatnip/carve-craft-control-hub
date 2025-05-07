
import React, { createContext, useContext, useState, useEffect } from "react";
import { MachineStatus, ConnectionSettings } from "@/types";
import { arduinoService } from "@/services/arduinoService";
import { useToast } from "@/components/ui/use-toast";

interface MachineContextType {
  status: MachineStatus;
  isConnecting: boolean;
  isDisconnecting: boolean;
  connect: (settings: ConnectionSettings) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  sendCommand: (command: string) => Promise<string>;
  jogAxis: (axis: 'X' | 'Y' | 'Z', direction: 'positive' | 'negative', distance: number, feedRate: number) => Promise<void>;
  runGCode: (gcode: string[]) => Promise<void>;
  pauseJob: () => void;
  resumeJob: () => void;
  stopJob: () => void;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<MachineStatus>({
    connected: false,
    running: false,
    paused: false,
    position: { x: 0, y: 0, z: 0 }
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleStatusChange = (newStatus: MachineStatus) => {
      setStatus(newStatus);
    };

    arduinoService.on('statusChange', handleStatusChange);

    return () => {
      arduinoService.off('statusChange', handleStatusChange);
    };
  }, []);

  const connect = async (settings: ConnectionSettings): Promise<boolean> => {
    try {
      setIsConnecting(true);
      const result = await arduinoService.connect(settings);
      if (result) {
        toast({
          title: "Connected",
          description: `Connected to ${settings.port} at ${settings.baudRate} baud`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to device",
          variant: "destructive",
        });
      }
      return result;
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      setIsDisconnecting(true);
      const result = await arduinoService.disconnect();
      if (result) {
        toast({
          title: "Disconnected",
          description: "Successfully disconnected from device",
        });
      }
      return result;
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDisconnecting(false);
    }
  };

  const sendCommand = async (command: string): Promise<string> => {
    try {
      return await arduinoService.sendCommand(command);
    } catch (error) {
      console.error("Command error:", error);
      toast({
        title: "Command Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      throw error;
    }
  };

  const jogAxis = async (
    axis: 'X' | 'Y' | 'Z',
    direction: 'positive' | 'negative',
    distance: number,
    feedRate: number
  ): Promise<void> => {
    try {
      const value = direction === 'positive' ? distance : -distance;
      const command = `G91 G0 ${axis}${value} F${feedRate}`;
      await sendCommand(command);
      // Return to absolute positioning
      await sendCommand("G90");
    } catch (error) {
      console.error("Jog error:", error);
      toast({
        title: "Jog Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const runGCode = async (gcode: string[]): Promise<void> => {
    try {
      await arduinoService.sendGCodeFile(gcode);
      toast({
        title: "Job Complete",
        description: "G-code program execution finished",
      });
    } catch (error) {
      console.error("G-code execution error:", error);
      toast({
        title: "Job Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const pauseJob = () => {
    try {
      arduinoService.pause();
      toast({
        title: "Job Paused",
        description: "G-code execution paused",
      });
    } catch (error) {
      console.error("Pause error:", error);
    }
  };

  const resumeJob = () => {
    try {
      arduinoService.resume();
      toast({
        title: "Job Resumed",
        description: "G-code execution resumed",
      });
    } catch (error) {
      console.error("Resume error:", error);
    }
  };

  const stopJob = () => {
    try {
      arduinoService.stop();
      toast({
        title: "Job Stopped",
        description: "G-code execution stopped",
      });
    } catch (error) {
      console.error("Stop error:", error);
    }
  };

  const value = {
    status,
    isConnecting,
    isDisconnecting,
    connect,
    disconnect,
    sendCommand,
    jogAxis,
    runGCode,
    pauseJob,
    resumeJob,
    stopJob
  };

  return (
    <MachineContext.Provider value={value}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = (): MachineContextType => {
  const context = useContext(MachineContext);
  if (context === undefined) {
    throw new Error("useMachine must be used within a MachineProvider");
  }
  return context;
};
