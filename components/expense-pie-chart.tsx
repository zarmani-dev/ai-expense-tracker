"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

export default function ExpensePieChart({ expenses, currency }) {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const COLORS = [
    "#8b5cf6", // violet
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#f97316", // orange
    "#8b5cf6", // violet (darker)
  ]

  useEffect(() => {
    if (expenses.length === 0) {
      setChartData([])
      setIsLoading(false)
      return
    }

    // Group by category
    const categoryData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = {
          name: expense.category,
          value: 0,
        }
      }

      acc[expense.category].value += Number(expense.amount)
      return acc
    }, {})

    setChartData(Object.values(categoryData))
    setIsLoading(false)
  }, [expenses])

  const getCurrencySymbol = (code) => {
    const currencyMap = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "$",
      AUD: "$",
      INR: "₹",
      CNY: "¥",
    }
    return currencyMap[code] || "$"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No data available to display</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={200}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${getCurrencySymbol(currency)}${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

