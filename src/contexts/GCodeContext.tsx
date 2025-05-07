
import React, { createContext, useContext, useState } from "react";
import { GCodeCommand } from "@/types";
import { parseGCode, sampleGCode } from "@/utils/gcodeParser";

interface GCodeContextType {
  code: string;
  setCode: (code: string) => void;
  commands: GCodeCommand[];
  loadSample: () => void;
  loadFile: (file: File) => Promise<void>;
  saveToFile: () => void;
}

const GCodeContext = createContext<GCodeContextType | undefined>(undefined);

export const GCodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>("");
  const [commands, setCommands] = useState<GCodeCommand[]>([]);

  const updateCode = (newCode: string) => {
    setCode(newCode);
    setCommands(parseGCode(newCode));
  };

  const loadSample = () => {
    updateCode(sampleGCode);
  };

  const loadFile = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      updateCode(text);
    } catch (error) {
      console.error("Error loading file:", error);
      throw error;
    }
  };

  const saveToFile = () => {
    if (!code) return;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carvecraft_gcode.nc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const value = {
    code,
    setCode: updateCode,
    commands,
    loadSample,
    loadFile,
    saveToFile
  };

  return (
    <GCodeContext.Provider value={value}>
      {children}
    </GCodeContext.Provider>
  );
};

export const useGCode = (): GCodeContextType => {
  const context = useContext(GCodeContext);
  if (context === undefined) {
    throw new Error("useGCode must be used within a GCodeProvider");
  }
  return context;
};
