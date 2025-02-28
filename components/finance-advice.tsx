"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { AnimatedIcon } from "@/components/animated-icon";

export default function FinanceAdvice() {
  const [currentAdvice, setCurrentAdvice] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const generateAdvice = async () => {
    try {
      const response = await fetch("/api/generate-finance-advice", {
        method: "POST",
      });
      const data = await response.json();
      return data.advice;
    } catch (error) {
      console.error("Error generating advice:", error);
      return "Start an emergency fund to cover 3-6 months of expenses."; // fallback advice
    }
  };

  useEffect(() => {
    const changeAdvice = async () => {
      setIsAnimating(true);
      const newAdvice = await generateAdvice();
      setTimeout(() => {
        setCurrentAdvice(newAdvice);
        setIsAnimating(false);
        setIsLoading(false);
      }, 500);
    };

    changeAdvice();
    const interval = setInterval(changeAdvice, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Finance Tip of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex items-center">
        <div className="w-1/4">
          <AnimatedIcon
            icon={<Lightbulb size={64} />}
            color="text-yellow-500"
          />
        </div>
        <div className="w-3/4 pl-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
              </motion.div>
            ) : (
              <motion.p
                key={currentAdvice}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-medium text-gray-700"
              >
                {currentAdvice}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
