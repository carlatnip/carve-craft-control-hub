
import React, { createContext, useContext, useState, useEffect } from "react";
import { SerialPort, ConnectionSettings } from "@/types";
import { arduinoService } from "@/services/arduinoService";

interface ConnectionContextType {
  availablePorts: SerialPort[];
  isLoadingPorts: boolean;
  refreshPorts: () => Promise<SerialPort[]>;
  selectedPort: string;
  setSelectedPort: (port: string) => void;
  baudRate: number;
  setBaudRate: (rate: number) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availablePorts, setAvailablePorts] = useState<SerialPort[]>([]);
  const [isLoadingPorts, setIsLoadingPorts] = useState(false);
  const [selectedPort, setSelectedPort] = useState("");
  const [baudRate, setBaudRate] = useState(115200);

  const refreshPorts = async (): Promise<SerialPort[]> => {
    try {
      setIsLoadingPorts(true);
      const ports = await arduinoService.getAvailablePorts();
      setAvailablePorts(ports);
      return ports;
    } catch (error) {
      console.error("Error refreshing ports:", error);
      return [];
    } finally {
      setIsLoadingPorts(false);
    }
  };

  // Load ports initially
  useEffect(() => {
    refreshPorts();
  }, []);

  const value = {
    availablePorts,
    isLoadingPorts,
    refreshPorts,
    selectedPort,
    setSelectedPort,
    baudRate,
    setBaudRate
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
