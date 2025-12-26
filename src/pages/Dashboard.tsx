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
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PieLabelProps } from "recharts/types/polar/Pie";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMontly, getTransactionsSummary } from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formatters";

const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
  expensesByCategory: [],
};

interface ChartLabelProps {
  categoryName: string;
  percent: number;
}

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonthh] = useState(currentDate.getMonth() + 1);
  const [summary, setSummaryy] = useState<TransactionSummary>(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionsSummary(month, year);
      setSummaryy(response);
      console.log(response);
    }

    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionsMontly(month, year, 4);

      setMonthlyItemsData(response.history);
      console.log(response);
    }

    loadTransactionsMonthly();
  }, [month, year]);

  // ✅ Função corrigida: usa PieLabelProps + aplica ChartLabelProps
  const renderPieChartLabel = (props: PieLabelProps) => {
    const chartLabelData: ChartLabelProps = {
      categoryName: props.name?.toString() || "",
      percent: props.percent ?? 0,
    };

    const percentValue = (chartLabelData.percent * 100).toFixed(0);
    return `${chartLabelData.categoryName}: ${percentValue}%`;
  };

  const formatToolTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0"> Dashboard</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonthh}
          onYearChange={setYear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2 ${
              summary.balance > 0 ? "text-primary-500" : "text-red-300"
            }`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-2xl font-semibold mt-2 text-primary-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        <Card icon={<Wallet size={20} className="text-red-600" />} title="Despesas" hover>
          <p className="text-2xl font-semibold mt-2 text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
          hover
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChartLabel}
                  >
                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada nesse período
            </div>
          )}
        </Card>
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-80"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    tick={{ style: { textTransform: "capitalize" } }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 14 } }}
                  />
                  <Tooltip
                    formatter={formatCurrency}
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      borderColor: "#2A2A2A",
                    }}
                    labelStyle={{ color: "#F8F8F8" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="expenses"
                    fill="#FF6384"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  />
                  <Bar
                    dataKey="income"
                    fill="#37E359"
                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
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
