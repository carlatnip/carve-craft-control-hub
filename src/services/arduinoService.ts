
import { SerialPort, ConnectionSettings, MachineStatus } from "@/types";

class ArduinoService {
  private connected = false;
  private ports: SerialPort[] = [];
  private status: MachineStatus = {
    connected: false,
    running: false,
    paused: false,
    position: { x: 0, y: 0, z: 0 },
  };
  private callbacks: { [key: string]: Function[] } = {};

  // Mock method to simulate getting available ports
  async getAvailablePorts(): Promise<SerialPort[]> {
    // In a real implementation, this would use the Web Serial API
    console.log("Getting available ports");
    
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock ports
    this.ports = [
      { id: "port1", name: "COM3", manufacturer: "Arduino" },
      { id: "port2", name: "COM4", manufacturer: "CH340" },
      { id: "port3", name: "/dev/ttyACM0", manufacturer: "Arduino" },
    ];
    
    return this.ports;
  }

  // Mock method to connect to an Arduino
  async connect(settings: ConnectionSettings): Promise<boolean> {
    console.log(`Connecting to ${settings.port} at ${settings.baudRate} baud`);
    
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (settings.port && settings.baudRate > 0) {
      this.connected = true;
      this.status.connected = true;
      this.triggerEvent('statusChange', this.status);
      console.log("Connected successfully");
      return true;
    }
    
    console.error("Connection failed");
    return false;
  }

  // Mock method to disconnect
  async disconnect(): Promise<boolean> {
    console.log("Disconnecting from device");
    
    // Simulate disconnect delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    this.connected = false;
    this.status.connected = false;
    this.status.running = false;
    this.status.paused = false;
    this.triggerEvent('statusChange', this.status);
    
    return true;
  }

  // Mock method to send GCode commands
  async sendCommand(command: string): Promise<string> {
    if (!this.connected) {
      throw new Error("Not connected to device");
    }
    
    console.log(`Sending command: ${command}`);
    
    // Simulate command processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Process movement commands to update position
    if (command.startsWith('G0') || command.startsWith('G1')) {
      this.processMovementCommand(command);
    } else if (command === 'M0' || command === 'M1') {
      // Pause
      this.status.paused = true;
      this.triggerEvent('statusChange', this.status);
    } else if (command === 'M2' || command === 'M30') {
      // End program
      this.status.running = false;
      this.triggerEvent('statusChange', this.status);
    }
    
    return "ok";
  }

  // Mock method to send a file of GCode commands
  async sendGCodeFile(gcode: string[]): Promise<void> {
    if (!this.connected) {
      throw new Error("Not connected to device");
    }
    
    this.status.running = true;
    this.triggerEvent('statusChange', this.status);
    
    for (const line of gcode) {
      if (!this.status.running || this.status.paused) {
        break;
      }
      
      try {
        // Skip empty lines and comments
        if (line.trim() === '' || line.trim().startsWith(';')) {
          continue;
        }
        
        await this.sendCommand(line);
        
        // Simulate execution time
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error sending command: ${line}`, error);
        this.status.running = false;
        this.triggerEvent('statusChange', this.status);
        throw error;
      }
    }
    
    this.status.running = false;
    this.triggerEvent('statusChange', this.status);
  }

  // Pause the current job
  pause(): void {
    if (this.status.running && !this.status.paused) {
      this.status.paused = true;
      this.triggerEvent('statusChange', this.status);
    }
  }

  // Resume the current job
  resume(): void {
    if (this.status.paused) {
      this.status.paused = false;
      this.triggerEvent('statusChange', this.status);
    }
  }

  // Stop the current job
  stop(): void {
    this.status.running = false;
    this.status.paused = false;
    this.triggerEvent('statusChange', this.status);
  }

  // Get current machine status
  getStatus(): MachineStatus {
    return { ...this.status };
  }

  // Mock movement command processing
  private processMovementCommand(command: string): void {
    const xMatch = command.match(/X(-?\d+(\.\d+)?)/);
    const yMatch = command.match(/Y(-?\d+(\.\d+)?)/);
    const zMatch = command.match(/Z(-?\d+(\.\d+)?)/);
    
    if (xMatch) {
      this.status.position.x = parseFloat(xMatch[1]);
    }
    
    if (yMatch) {
      this.status.position.y = parseFloat(yMatch[1]);
    }
    
    if (zMatch) {
      this.status.position.z = parseFloat(zMatch[1]);
    }
    
    this.triggerEvent('statusChange', this.status);
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }

  private triggerEvent(event: string, data: any): void {
    if (!this.callbacks[event]) return;
    for (const callback of this.callbacks[event]) {
      callback(data);
    }
  }
}

// Export as singleton
export const arduinoService = new ArduinoService();
