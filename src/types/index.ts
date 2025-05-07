
export interface MachineStatus {
  connected: boolean;
  running: boolean;
  paused: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface SerialPort {
  id: string;
  name: string;
  manufacturer?: string;
}

export interface GCodeCommand {
  line: number;
  command: string;
  raw: string;
}

export interface ConnectionSettings {
  port: string;
  baudRate: number;
}

export type Axis = 'X' | 'Y' | 'Z';

export type ControlDirection = 'positive' | 'negative';

export type FeedRate = 10 | 50 | 100 | 500 | 1000;
