"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Sparkles, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function AISuggestions({ expenses, currencySymbol }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsKeySet(true);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini-api-key", apiKey.trim());
      setIsKeySet(true);
    }
  };

  const generateSuggestions = async () => {
    if (!apiKey || expenses.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expenses,
          apiKey,
          currencySymbol,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError(
        err.message || "Failed to generate suggestions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isKeySet) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
          <Key className="h-8 w-8 text-blue-500" />
          <p className="text-gray-700">
            Enter your Gemini API key to get AI-powered suggestions
          </p>
          <p className="text-xs text-gray-500">
            Your key is stored locally and never sent to our servers
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <Button
          onClick={saveApiKey}
          disabled={!apiKey.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Enable AI Suggestions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={generateSuggestions}
        disabled={isLoading || expenses.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating Suggestions...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI Suggestions
          </>
        )}
      </Button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {suggestions.length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-3 border-l-4 border-l-blue-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">{suggestion.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    {suggestion.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && suggestions.length === 0 && expenses.length > 0 && (
        <div className="text-center text-gray-500">
          Click the button above to get AI-powered suggestions based on your
          expenses.
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center text-gray-500">
          Add some expenses to get AI-powered suggestions.
        </div>
      )}
    </div>
  );
}
