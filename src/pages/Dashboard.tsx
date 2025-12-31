import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthly, getTransactionsSummary } from "../services/transactionService";

import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formatters";

/* 🔑 Tipo compatível com Recharts */
type PieChartData = {
  [key: string]: string | number;
};

const InitialSummary: TransactionSummary = {
  totalIncomes: 0,
  totalExpenses: 0,
  balance: 0,
  expenseCategory: [],
};

const Dashboard = () => {
  const currentDate = new Date();

  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(InitialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionsSummary(month, year);
      setSummary(response);
    }

    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionsMonthly(month, year, 4);
      setMonthlyItemsData(response.history ?? []);
    }

    loadTransactionsMonthly();
  }, [month, year]);

  /* 🔑 DADOS ADAPTADOS PARA O PIE */
  const expenseCategoryChartData: PieChartData[] = summary.expenseCategory.map((item) => ({
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    amount: item.amount,
    categoryColor: item.categoryColor,
  }));

  const renderPieChatLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    return `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`;
  };

  const formatToolTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>

        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-bold mt-2 ${
              summary.balance > 0 ? "text-green-500" : "text-red-300"
            }`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-2xl font-bold mt-2 text-green-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        <Card
          icon={<Wallet size={20} className="text-red-600" />}
          title="Despesas"
          hover
          variant="danger"
        >
          <p className="text-2xl font-bold mt-2 text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por categoria"
          className="min-h-80"
        >
          {expenseCategoryChartData.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expenseCategoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChatLabel}
                  >
                    {expenseCategoryChartData.map((entry) => (
                      <Cell key={entry.categoryId} fill={String(entry.categoryColor)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              Nenhuma despesa registrada nesse período
            </div>
          )}
        </Card>

        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" tickFormatter={formatCurrency} />
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                  <Bar dataKey="expenses" name="Despesas" fill="#FF6384" />
                  <Bar dataKey="income" name="Receitas" fill="#37E359" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                Nenhuma despesa registrada nesse período
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
