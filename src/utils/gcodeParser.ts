
import { GCodeCommand } from "@/types";

export function parseGCode(code: string): GCodeCommand[] {
  const lines = code.split('\n');
  const commands: GCodeCommand[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith(';')) {
      // Still include comments in the result
      commands.push({
        line: index + 1,
        command: '',
        raw: trimmedLine
      });
      return;
    }
    
    // Remove inline comments
    const commentStart = trimmedLine.indexOf(';');
    const codeOnly = commentStart >= 0 ? trimmedLine.substring(0, commentStart).trim() : trimmedLine;
    
    if (codeOnly) {
      commands.push({
        line: index + 1,
        command: codeOnly,
        raw: trimmedLine
      });
    }
  });
  
  return commands;
}

// Function to highlight GCode syntax with HTML spans
export function highlightGCode(code: string): string {
  if (!code) return '';
  
  // Split into lines to process each line
  return code.split('\n').map(line => {
    // Handle comments
    if (line.trim().startsWith(';')) {
      return `<span class="gcode-comment">${line}</span>`;
    }
    
    // Handle inline comments
    const commentIndex = line.indexOf(';');
    if (commentIndex >= 0) {
      const code = line.substring(0, commentIndex);
      const comment = line.substring(commentIndex);
      return processCodePart(code) + `<span class="gcode-comment">${comment}</span>`;
    }
    
    return processCodePart(line);
  }).join('\n');
}

function processCodePart(line: string): string {
  // Match G-codes and M-codes
  let processed = line.replace(/\b([GM]\d+(\.\d+)?)\b/g, '<span class="gcode-command">$1</span>');
  
  // Match parameters (letters followed by numbers)
  processed = processed.replace(/\b([XYZIJKFPS])(-?\d+(\.\d+)?)\b/g, '<span class="gcode-parameter">$1</span><span class="gcode-value">$2</span>');
  
  return processed;
}

// Sample GCode for testing
export const sampleGCode = `; CarveCraft Sample GCode
; Square outline 20x20mm

G90 ; Absolute positioning
G21 ; Millimeter units
G17 ; XY plane selection
G54 ; Use coordinate system 1

; Move to start position
G0 Z5 ; Lift to safe height
G0 X0 Y0 ; Move to origin
G0 Z0.5 ; Move close to work surface

; Start cutting
M3 S10000 ; Start spindle
G4 P2 ; Wait 2 seconds for spindle to reach speed
G1 Z-1 F100 ; Plunge into material
G1 X20 F500 ; Cut to X20
G1 Y20 F500 ; Cut to Y20
G1 X0 F500 ; Cut to X0
G1 Y0 F500 ; Cut back to origin

; Finish
G0 Z10 ; Lift to safe height
M5 ; Stop spindle
M30 ; End program
`;
