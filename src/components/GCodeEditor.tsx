
import { useEffect, useRef } from "react";
import { useGCode } from "@/contexts/GCodeContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileIcon, SaveIcon, PlayIcon, Code2Icon } from "lucide-react";
import { useMachine } from "@/contexts/MachineContext";
import { parseGCode, highlightGCode } from "@/utils/gcodeParser";

const GCodeEditor = () => {
  const { code, setCode, loadSample, loadFile, saveToFile } = useGCode();
  const { status, runGCode, pauseJob, resumeJob, stopJob } = useMachine();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update highlighted code
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = highlightGCode(code) || '<div class="p-4 text-muted-foreground">No code loaded. Upload a file or load the sample G-code.</div>';
    }
  }, [code]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file).catch(console.error);
    }
    // Reset input value so the same file can be selected again
    event.target.value = '';
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRunCode = () => {
    if (status.connected && code) {
      const commands = parseGCode(code);
      const codeLines = commands.map(cmd => cmd.raw);
      runGCode(codeLines).catch(console.error);
    }
  };

  const handlePauseResume = () => {
    if (status.paused) {
      resumeJob();
    } else {
      pauseJob();
    }
  };

  const handleStop = () => {
    stopJob();
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>G-Code Editor</CardTitle>
            <CardDescription>View and edit G-code commands</CardDescription>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".nc,.gcode,.g,.gc,.ngc"
          />
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleFileUpload}>
                    <FileIcon className="h-4 w-4" />
                    <span className="sr-only">Upload G-code file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload G-code file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={loadSample}>
                    <Code2Icon className="h-4 w-4" />
                    <span className="sr-only">Load sample G-code</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Load sample G-code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={saveToFile} disabled={!code}>
                    <SaveIcon className="h-4 w-4" />
                    <span className="sr-only">Save G-code file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save G-code file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <div className="relative h-full overflow-auto">
          <div 
            className="gcode-editor p-4 min-h-full text-sm bg-card whitespace-pre-wrap outline-none border-0"
            ref={editorRef}
            contentEditable={!status.running}
            onBlur={(e) => setCode(e.currentTarget.innerText)}
            spellCheck={false}
          >
            {/* Content will be set by the effect */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center space-x-2 w-full">
          <Button 
            className="flex-1" 
            onClick={handleRunCode} 
            disabled={!status.connected || status.running || !code}
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Run
          </Button>
          
          {status.running && (
            <>
              <Button 
                variant={status.paused ? "default" : "outline"} 
                onClick={handlePauseResume}
              >
                {status.paused ? "Resume" : "Pause"}
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleStop}
              >
                Stop
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GCodeEditor;
