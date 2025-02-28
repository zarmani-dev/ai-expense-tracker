import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { ArrowRight, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/animated-icon";

export default function Home() {
  const cookieStore = cookies();
  const isSetup = cookieStore.get("expense-tracker-setup");

  if (isSetup) {
    redirect("/dashboard");
  }

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
            className="text-4xl font-bold text-violet-900 mb-2"
          >
            ExpenseAI
          </motion.h1>
          <p className="text-gray-600">
            Smart expense tracking with AI-powered insights
          </p>
        </div>

        <div className="flex justify-center">
          <AnimatedIcon
            icon={<PiggyBank size={64} />}
            color="text-violet-600"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-violet-100 p-4 rounded-xl">
            <h2 className="font-medium text-violet-800">Features:</h2>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                <span>Track expenses with multiple currencies</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                <span>Visualize spending with interactive charts</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                <span>Monthly and yearly spending reports</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                <span>AI-powered suggestions to reduce expenses</span>
              </motion.li>
            </ul>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              <a href="/setup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
