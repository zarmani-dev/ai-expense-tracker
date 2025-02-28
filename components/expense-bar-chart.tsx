"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

export default function ExpenseBarChart({ expenses, currency, isMonthlyReport = false }) {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (expenses.length === 0) {
      setChartData([])
      setIsLoading(false)
      return
    }

    if (isMonthlyReport) {
      // Group by day for monthly report
      const dailyData = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date)
        const day = date.getDate()

        if (!acc[day]) {
          acc[day] = {
            name: `Day ${day}`,
            amount: 0,
          }
        }

        acc[day].amount += Number(expense.amount)
        return acc
      }, {})

      const sortedData = Object.values(dailyData).sort((a, b) => {
        const dayA = Number.parseInt(a.name.split(" ")[1])
        const dayB = Number.parseInt(b.name.split(" ")[1])
        return dayA - dayB
      })

      setChartData(sortedData)
    } else {
      // Group by category for regular chart
      const categoryData = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = {
            name: expense.category,
            amount: 0,
          }
        }

        acc[expense.category].amount += Number(expense.amount)
        return acc
      }, {})

      setChartData(Object.values(categoryData))
    }

    setIsLoading(false)
  }, [expenses, isMonthlyReport])

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
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fill: "#666" }} tickLine={{ stroke: "#ccc" }} />
          <YAxis
            tick={{ fill: "#666" }}
            tickLine={{ stroke: "#ccc" }}
            tickFormatter={(value) => `${getCurrencySymbol(currency)}${value}`}
          />
          <Tooltip
            formatter={(value) => [`${getCurrencySymbol(currency)}${value}`, "Amount"]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend />
          <Bar dataKey="amount" name="Amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

