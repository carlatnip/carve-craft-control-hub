
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, TrashIcon } from "lucide-react";
import { useMachine } from "@/contexts/MachineContext";

interface ConsoleMessage {
  id: number;
  type: 'sent' | 'received' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

const ConsoleOutput = () => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    { 
      id: 0, 
      type: 'system', 
      content: 'Console initialized. Connect to a device to start sending commands.', 
      timestamp: new Date() 
    }
  ]);
  const [commandInput, setCommandInput] = useState("");
  const { status, sendCommand } = useMachine();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(1);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const addMessage = (type: ConsoleMessage['type'], content: string) => {
    setMessages(prev => [
      ...prev, 
      { 
        id: messageIdCounter.current++, 
        type, 
        content, 
        timestamp: new Date() 
      }
    ]);
  };

  const handleSendCommand = async () => {
    if (!commandInput.trim() || !status.connected) return;
    
    const command = commandInput.trim();
    addMessage('sent', command);
    setCommandInput("");
    
    try {
      const response = await sendCommand(command);
      addMessage('received', response);
    } catch (error) {
      addMessage('error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleClearConsole = () => {
    setMessages([
      { 
        id: messageIdCounter.current++, 
        type: 'system', 
        content: 'Console cleared.', 
        timestamp: new Date() 
      }
    ]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Console</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleClearConsole}>
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Clear console</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="px-4 py-2 min-h-full">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-1 font-mono text-xs ${
                  msg.type === 'sent' ? 'text-cnc-primary' : 
                  msg.type === 'received' ? 'text-cnc-secondary' : 
                  msg.type === 'error' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}
              >
                <span className="text-muted-foreground">[{formatTime(msg.timestamp)}] </span>
                <span className="font-semibold">
                  {msg.type === 'sent' ? '>' : 
                   msg.type === 'received' ? '<' : 
                   msg.type === 'error' ? '!' : 
                   '#'}
                </span> {msg.content}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
          <div className="flex space-x-2">
            <Input 
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter G-code command..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendCommand();
                }
              }}
              disabled={!status.connected}
              className="font-mono"
            />
            <Button 
              onClick={handleSendCommand}
              disabled={!commandInput.trim() || !status.connected}
              size="icon"
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsoleOutput;
