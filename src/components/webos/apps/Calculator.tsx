import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const toggleSign = () => {
    if (display !== "0") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  return (
    <div className="h-full w-full p-6 bg-gradient-to-br from-background to-background/80">
      <div className="max-w-sm mx-auto">
        {/* Display */}
        <div className="glass rounded-xl p-6 mb-4 text-right">
          <div className="text-3xl font-mono text-foreground min-h-[2.5rem] flex items-center justify-end">
            {display}
          </div>
          {operation && (
            <div className="text-sm text-muted-foreground mt-1">
              {previousValue} {operation}
            </div>
          )}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            variant="secondary"
            className="h-14 glass hover:glow-primary"
            onClick={clear}
          >
            AC
          </Button>
          <Button
            variant="secondary"
            className="h-14 glass hover:glow-primary"
            onClick={clearEntry}
          >
            CE
          </Button>
          <Button
            variant="secondary"
            className="h-14 glass hover:glow-primary"
            onClick={inputPercent}
          >
            %
          </Button>
          <Button
            variant="default"
            className="h-14 gradient-primary hover:glow-primary"
            onClick={() => inputOperation("÷")}
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("7")}
          >
            7
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("8")}
          >
            8
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("9")}
          >
            9
          </Button>
          <Button
            variant="default"
            className="h-14 gradient-primary hover:glow-primary"
            onClick={() => inputOperation("×")}
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("4")}
          >
            4
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("5")}
          >
            5
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("6")}
          >
            6
          </Button>
          <Button
            variant="default"
            className="h-14 gradient-primary hover:glow-primary"
            onClick={() => inputOperation("-")}
          >
            −
          </Button>

          {/* Row 4 */}
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("1")}
          >
            1
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("2")}
          >
            2
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={() => inputNumber("3")}
          >
            3
          </Button>
          <Button
            variant="default"
            className="h-14 gradient-primary hover:glow-primary"
            onClick={() => inputOperation("+")}
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10 col-span-2"
            onClick={() => inputNumber("0")}
          >
            0
          </Button>
          <Button
            variant="ghost"
            className="h-14 glass hover:bg-white/10"
            onClick={inputDecimal}
          >
            .
          </Button>
          <Button
            variant="default"
            className="h-14 gradient-primary hover:glow-primary text-xl"
            onClick={performCalculation}
          >
            =
          </Button>
        </div>

        {/* Additional Functions */}
        <div className="mt-4 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 h-12 glass hover:glow-primary"
            onClick={toggleSign}
          >
            +/−
          </Button>
          <Button
            variant="secondary"
            className="flex-1 h-12 glass hover:glow-primary"
            onClick={() => {
              if (display.length > 1) {
                setDisplay(display.slice(0, -1));
              } else {
                setDisplay("0");
              }
            }}
          >
            <Delete className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};