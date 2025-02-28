"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ListFilter,
  PieChart,
  Plus,
  Sparkles,
} from "lucide-react";
import ExpenseList from "@/components/expense-list";
import ExpenseBarChart from "@/components/expense-bar-chart";
import ExpensePieChart from "@/components/expense-pie-chart";
import AddExpenseDialog from "@/components/add-expense-dialog";
import AISuggestions from "@/components/ai-suggestions";
import FinanceAdvice from "@/components/finance-advice";

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [initialAmount, setInitialAmount] = useState("0");
  const [currency, setCurrency] = useState("THB");
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setIsClient(true);

    // Check if setup is completed
    const isSetup = document.cookie.includes("expense-tracker-setup=true");
    if (!isSetup) {
      router.push("/");
      return;
    }

    // Load data from localStorage
    const storedAmount =
      localStorage.getItem("expense-tracker-initial-amount") || "0";
    const storedCurrency =
      localStorage.getItem("expense-tracker-currency") || "THB";
    const storedExpenses = JSON.parse(
      localStorage.getItem("expense-tracker-expenses") || "[]"
    );

    setInitialAmount(storedAmount);
    setCurrency(storedCurrency);
    setExpenses(storedExpenses);

    // Calculate current balance
    const totalExpenses = storedExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setBalance(Number(storedAmount) - totalExpenses);
  }, [router]);

  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [
      ...expenses,
      { ...newExpense, id: Date.now().toString() },
    ];
    setExpenses(updatedExpenses);
    localStorage.setItem(
      "expense-tracker-expenses",
      JSON.stringify(updatedExpenses)
    );

    // Update balance
    const totalExpenses = updatedExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setBalance(Number(initialAmount) - totalExpenses);

    setIsAddExpenseOpen(false);
  };

  const handleEditExpense = (editedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === editedExpense.id ? editedExpense : expense
    );
    setExpenses(updatedExpenses);
    localStorage.setItem(
      "expense-tracker-expenses",
      JSON.stringify(updatedExpenses)
    );

    // Update balance
    const totalExpenses = updatedExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setBalance(Number(initialAmount) - totalExpenses);
  };

  const handleDeleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== expenseId
    );
    setExpenses(updatedExpenses);
    localStorage.setItem(
      "expense-tracker-expenses",
      JSON.stringify(updatedExpenses)
    );

    // Update balance
    const totalExpenses = updatedExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setBalance(Number(initialAmount) - totalExpenses);
  };

  const getCurrencySymbol = (code) => {
    const currencyMap = {
      MMK: "K",
      THB: "฿",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    };
    return currencyMap[code] || "฿";
  };

  const changeMonth = (increment) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth.getMonth() &&
      expenseDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-violet-900">
              ExpenseAI Dashboard
            </h1>
            <p className="text-gray-600">
              Track, visualize, and optimize your expenses
            </p>
          </div>
          <Button
            onClick={() => setIsAddExpenseOpen(true)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
                <CardTitle className="flex items-center">
                  <CircleDollarSign className="mr-2 h-5 w-5" />
                  Current Balance
                </CardTitle>
                <CardDescription className="text-violet-100">
                  Available funds
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-violet-900">
                  {getCurrencySymbol(currency)}
                  {balance.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Initial amount: {getCurrencySymbol(currency)}
                  {initialAmount}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Monthly Overview
                </CardTitle>
                <CardDescription className="text-emerald-100">
                  Current month spending
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-emerald-700">
                  {getCurrencySymbol(currency)}
                  {expenses
                    .reduce((sum, expense) => sum + Number(expense.amount), 0)
                    .toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {expenses.length} transactions this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="flex items-center">
                  <ArrowUpRight className="mr-2 h-5 w-5" />
                  Top Category
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Highest spending area
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {expenses.length > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-amber-700">
                      {(() => {
                        const categories = expenses.reduce((acc, expense) => {
                          acc[expense.category] =
                            (acc[expense.category] || 0) +
                            Number(expense.amount);
                          return acc;
                        }, {});
                        const topCategory = Object.entries(categories).sort(
                          (a, b) => b[1] - a[1]
                        )[0];
                        return topCategory ? topCategory[0] : "None";
                      })()}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {getCurrencySymbol(currency)}
                      {(() => {
                        const categories = expenses.reduce((acc, expense) => {
                          acc[expense.category] =
                            (acc[expense.category] || 0) +
                            Number(expense.amount);
                          return acc;
                        }, {});
                        const topCategory = Object.entries(categories).sort(
                          (a, b) => b[1] - a[1]
                        )[0];
                        return topCategory ? topCategory[1].toFixed(2) : "0.00";
                      })()}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-amber-700">
                      None
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      No expenses recorded yet
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Expense Visualization</CardTitle>
                    <CardDescription>
                      View your expenses in different formats
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="bar">
                    <TabsList className="mb-4">
                      <TabsTrigger value="bar" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Bar Chart
                      </TabsTrigger>
                      <TabsTrigger value="pie" className="flex items-center">
                        <PieChart className="mr-2 h-4 w-4" />
                        Pie Chart
                      </TabsTrigger>
                      <TabsTrigger value="list" className="flex items-center">
                        <ListFilter className="mr-2 h-4 w-4" />
                        List View
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bar" className="h-[350px]">
                      <ExpenseBarChart
                        expenses={filteredExpenses}
                        currency={currency}
                      />
                    </TabsContent>

                    <TabsContent value="pie" className="h-[350px]">
                      <ExpensePieChart
                        expenses={filteredExpenses}
                        currency={currency}
                      />
                    </TabsContent>

                    <TabsContent value="list">
                      <ExpenseList
                        expenses={filteredExpenses}
                        currency={currency}
                        currencySymbol={getCurrencySymbol(currency)}
                        onEditExpense={handleEditExpense}
                        onDeleteExpense={handleDeleteExpense}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Powered by Gemini 2.0 Flash
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <AISuggestions expenses={expenses} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FinanceAdvice />
        </motion.div>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAddExpense={handleAddExpense}
        currencySymbol={getCurrencySymbol(currency)}
      />
    </main>
  );
}
