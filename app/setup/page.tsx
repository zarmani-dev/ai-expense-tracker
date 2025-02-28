"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, DollarSign, PiggyBank, Settings } from "lucide-react";
import { AnimatedIcon } from "@/components/animated-icon";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [initialAmount, setInitialAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);

    // Store setup data in cookies/localStorage
    document.cookie = "expense-tracker-setup=true; path=/; max-age=31536000";
    localStorage.setItem("expense-tracker-initial-amount", initialAmount);
    localStorage.setItem("expense-tracker-currency", currency);

    // Add some sample data for demo purposes
    const currentDate = new Date();
    const sampleExpenses = [
      {
        id: "1",
        amount: 45.99,
        category: "Groceries",
        name: "Weekly groceries",
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 2
        ).toISOString(),
      },
      {
        id: "2",
        amount: 12.5,
        category: "Transportation",
        name: "Bus fare",
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 5
        ).toISOString(),
      },
      {
        id: "3",
        amount: 89.99,
        category: "Entertainment",
        name: "Concert tickets",
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 8
        ).toISOString(),
      },
      {
        id: "4",
        amount: 34.75,
        category: "Dining",
        name: "Restaurant dinner",
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1
        ).toISOString(),
      },
    ];

    localStorage.setItem(
      "expense-tracker-expenses",
      JSON.stringify(sampleExpenses)
    );

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-3xl font-bold text-violet-900 mb-2"
          >
            Setup Your Account
          </motion.h1>
          <p className="text-gray-600">Let's get your expense tracker ready</p>
        </div>

        <div className="flex justify-center">
          <AnimatedIcon icon={<Settings size={64} />} color="text-violet-600" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="initial-amount">Initial Balance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="initial-amount"
                    type="number"
                    placeholder="Enter your initial balance"
                    className="pl-10"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the amount you currently have
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!initialAmount}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="currency">Select Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select your currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Choose the currency you want to use
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!currency || isLoading}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Setting up...</span>
                    </div>
                  ) : (
                    <>
                      Complete Setup
                      <PiggyBank className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
