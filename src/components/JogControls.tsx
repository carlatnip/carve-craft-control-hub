
import { useState } from "react";
import { useMachine } from "@/contexts/MachineContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, HomeIcon } from "lucide-react";
import { Axis, ControlDirection, FeedRate } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JogControls = () => {
  const { status, jogAxis, sendCommand } = useMachine();
  const [stepSize, setStepSize] = useState<number>(1);
  const [feedRate, setFeedRate] = useState<FeedRate>(500);

  const moveAxis = async (axis: Axis, direction: ControlDirection) => {
    if (status.connected && !status.running) {
      await jogAxis(axis, direction, stepSize, feedRate);
    }
  };

  const handleHome = async () => {
    if (status.connected && !status.running) {
      await sendCommand("G28");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Machine Control</CardTitle>
        <CardDescription>Manual control of CNC axes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jog" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jog">Jog Control</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="jog" className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-2 max-w-[250px] mx-auto">
              {/* Z Up */}
              <div className="col-start-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("Z", "positive")}
                >
                  <span className="font-semibold text-lg">Z+</span>
                </Button>
              </div>

              {/* X/Y Controls */}
              <div className="col-start-1 row-start-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("X", "negative")}
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </Button>
              </div>
              <div className="col-start-2 row-start-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={handleHome}
                >
                  <HomeIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="col-start-3 row-start-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("X", "positive")}
                >
                  <ArrowRightIcon className="h-6 w-6" />
                </Button>
              </div>

              {/* Y Backward */}
              <div className="col-start-2 row-start-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("Y", "negative")}
                >
                  <ArrowDownIcon className="h-6 w-6" />
                </Button>
              </div>

              {/* Y Forward */}
              <div className="col-start-2 row-start-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("Y", "positive")}
                >
                  <ArrowUpIcon className="h-6 w-6" />
                </Button>
              </div>

              {/* Z Down */}
              <div className="col-start-2 row-start-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  disabled={!status.connected || status.running}
                  onClick={() => moveAxis("Z", "negative")}
                >
                  <span className="font-semibold text-lg">Z-</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="stepSize" className="text-sm font-medium">
                  Step Size (mm)
                </label>
                <Select
                  value={stepSize.toString()}
                  onValueChange={(value) => setStepSize(Number(value))}
                >
                  <SelectTrigger id="stepSize">
                    <SelectValue placeholder="Select step size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1</SelectItem>
                    <SelectItem value="0.5">0.5</SelectItem>
                    <SelectItem value="1">1.0</SelectItem>
                    <SelectItem value="5">5.0</SelectItem>
                    <SelectItem value="10">10.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="feedRate" className="text-sm font-medium">
                  Feed Rate (mm/min)
                </label>
                <Select
                  value={feedRate.toString()}
                  onValueChange={(value) => setFeedRate(Number(value) as FeedRate)}
                >
                  <SelectTrigger id="feedRate">
                    <SelectValue placeholder="Select feed rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JogControls;
