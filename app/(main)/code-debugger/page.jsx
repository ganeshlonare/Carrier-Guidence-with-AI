"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { generateCodeSnippet } from "@/actions/generateCode";
import { validateCode } from "@/actions/validateCode";

const LiveCodeDebugger = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [field, setField] = useState("Technology");
  const [level, setLevel] = useState("Beginner");

  // Generate a new code snippet
  const handleGenerateCode = async () => {
    try {
      const codeSnippet = await generateCodeSnippet(field, level);
      setCode(codeSnippet);
      setOutput("");
      setIsCorrect(null);
    } catch (error) {
      setOutput("❌ Failed to generate code snippet. Please try again.");
    }
  };

  // Validate the user's code
  const handleValidateCode = async () => {
    try {
      const validationResult = await validateCode(code, field, level);
      setOutput(validationResult);

      // Check if the validation result indicates correctness
      if (validationResult.toLowerCase().includes("correct")) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      setOutput("❌ Failed to validate code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8 ml-10">💻 Live Code Debugger</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Code Editor */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Debug the Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Code Editor */}
              <div className="h-[400px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button onClick={handleGenerateCode} className="bg-gray-800 hover:bg-gray-700 text-gray-100">
              Generate Code
            </Button>
            <Button onClick={handleValidateCode} className="bg-gray-200 hover:bg-gray-100 text-gray-800">
              Validate Code
            </Button>
          </CardFooter>
        </Card>

        {/* Right Side: Output */}
        <Card className="bg-[black] border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg h-[400px] overflow-y-auto">
              <pre className="text-sm text-gray-100">{output}</pre>
            </div>
          </CardContent>
          <CardFooter>
            {isCorrect !== null && (
              <p
                className={`text-lg ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCorrect ? "✅ Great job! All errors are fixed." : "❌ Keep trying! Some errors remain."}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LiveCodeDebugger;