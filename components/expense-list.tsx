"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash2 } from "lucide-react";
import AddExpenseDialog from "./add-expense-dialog";

export default function ExpenseList({
  expenses,
  currency,
  currencySymbol,
  onEditExpense,
  onDeleteExpense,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = [
    "all",
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      "Food & Dining": "bg-green-100 text-green-800",
      Transportation: "bg-blue-100 text-blue-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Utilities: "bg-red-100 text-red-800",
      Shopping: "bg-pink-100 text-pink-800",
      "Health & Fitness": "bg-emerald-100 text-emerald-800",
      Travel: "bg-indigo-100 text-indigo-800",
      Education: "bg-cyan-100 text-cyan-800",
      "Personal Care": "bg-yellow-100 text-yellow-800",
      "Gifts & Donations": "bg-orange-100 text-orange-800",
      Investments: "bg-teal-100 text-teal-800",
      "Bills & Fees": "bg-rose-100 text-rose-800",
      Home: "bg-amber-100 text-amber-800",
      Other: "bg-gray-100 text-gray-800",
    };

    return categoryColors[category] || "bg-gray-100 text-gray-800";
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  };

  const handleEditComplete = (editedExpense) => {
    onEditExpense(editedExpense);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expense</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getCategoryColor(expense.category)}
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {currencySymbol}
                    {Number(expense.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingExpense && (
        <AddExpenseDialog
          open={true}
          onOpenChange={() => setEditingExpense(null)}
          onAddExpense={handleEditComplete}
          currencySymbol={currencySymbol}
          initialExpense={editingExpense}
        />
      )}
    </div>
  );
}
