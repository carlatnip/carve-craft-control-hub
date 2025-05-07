
import { useMachine } from "@/contexts/MachineContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon, CheckCircleIcon, PauseCircleIcon } from "lucide-react";

const MachineStatus = () => {
  const { status } = useMachine();

  const getStatusIndicator = () => {
    if (!status.connected) {
      return (
        <div className="flex items-center space-x-2">
          <AlertCircleIcon className="h-5 w-5 text-destructive" />
          <span className="text-destructive font-medium">Disconnected</span>
        </div>
      );
    }

    if (status.running) {
      if (status.paused) {
        return (
          <div className="flex items-center space-x-2">
            <PauseCircleIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-yellow-500 font-medium">Paused</span>
          </div>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
          <span className="text-green-500 font-medium">Running</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
        <span className="text-green-500 font-medium">Idle</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Machine Status</CardTitle>
        <CardDescription>Current position and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getStatusIndicator()}

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Current Position</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 text-center">
                <Badge variant="outline" className="w-12 mx-auto">X</Badge>
                <p className="font-mono text-lg font-semibold">{status.position.x.toFixed(3)}</p>
              </div>
              <div className="space-y-1 text-center">
                <Badge variant="outline" className="w-12 mx-auto">Y</Badge>
                <p className="font-mono text-lg font-semibold">{status.position.y.toFixed(3)}</p>
              </div>
              <div className="space-y-1 text-center">
                <Badge variant="outline" className="w-12 mx-auto">Z</Badge>
                <p className="font-mono text-lg font-semibold">{status.position.z.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineStatus;
