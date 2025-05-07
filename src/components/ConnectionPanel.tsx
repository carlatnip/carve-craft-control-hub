
import { useState } from "react";
import { useConnection } from "@/contexts/ConnectionContext";
import { useMachine } from "@/contexts/MachineContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon, PowerIcon, PowerOffIcon } from "lucide-react";

const ConnectionPanel = () => {
  const { 
    availablePorts, 
    isLoadingPorts, 
    refreshPorts, 
    selectedPort, 
    setSelectedPort, 
    baudRate, 
    setBaudRate 
  } = useConnection();
  
  const { status, isConnecting, isDisconnecting, connect, disconnect } = useMachine();

  const handleConnect = async () => {
    if (selectedPort && baudRate) {
      await connect({ port: selectedPort, baudRate });
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connection</CardTitle>
        <CardDescription>
          Configure and manage the connection to your Arduino CNC controller
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 space-y-1">
              <label htmlFor="port" className="text-sm font-medium">
                Port
              </label>
              <Select
                value={selectedPort}
                onValueChange={setSelectedPort}
                disabled={status.connected || isConnecting}
              >
                <SelectTrigger id="port">
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map((port) => (
                    <SelectItem key={port.id} value={port.name}>
                      {port.name} {port.manufacturer ? `(${port.manufacturer})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={refreshPorts}
              disabled={isLoadingPorts || status.connected || isConnecting}
            >
              <ReloadIcon className={`h-4 w-4 ${isLoadingPorts ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh Ports</span>
            </Button>
          </div>

          <div className="space-y-1">
            <label htmlFor="baudRate" className="text-sm font-medium">
              Baud Rate
            </label>
            <Select
              value={baudRate.toString()}
              onValueChange={(value) => setBaudRate(Number(value))}
              disabled={status.connected || isConnecting}
            >
              <SelectTrigger id="baudRate">
                <SelectValue placeholder="Select baud rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9600">9600</SelectItem>
                <SelectItem value="19200">19200</SelectItem>
                <SelectItem value="38400">38400</SelectItem>
                <SelectItem value="57600">57600</SelectItem>
                <SelectItem value="115200">115200</SelectItem>
                <SelectItem value="230400">230400</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-cnc-success animate-pulse' : 'bg-destructive'}`}></div>
              <span className="text-sm">
                {status.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {status.connected ? (
          <Button 
            variant="destructive" 
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="w-full"
          >
            {isDisconnecting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <PowerOffIcon className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleConnect} 
            disabled={!selectedPort || isConnecting || isLoadingPorts}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <PowerIcon className="mr-2 h-4 w-4" />
                Connect
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectionPanel;
