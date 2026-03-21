import React, { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingBag,
  CreditCard,
  Clock,
  Search,
  Plus,
  Download,
  Printer,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  X,
  Save,
} from "lucide-react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { useAuth } from "../context/AuthContext";

const DailySales = () => {
  const { authFetch } = useAuth();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newSale, setNewSale] = useState({
    patientName: "",
    serviceOrItem: "",
    quantity: 1,
    unitPrice: 0,
    paymentMethod: "Cash",
    status: "Paid",
  });

  const [stats, setStats] = useState({
    totalSales: 0,
    count: 0,
    cashPayments: 0,
    pendingAmount: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // LOAD DATA

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams(filters).toString();

      const [salesRes, statsRes] = await Promise.all([
        authFetch(`/sales?${query}`),
        authFetch(`/sales/stats`),
      ]);

      const salesData = await salesRes.json();
      const statsData = await statsRes.json();

      if (salesRes.ok) setSales(salesData.data?.data || []);
      if (statsRes.ok) setStats(statsData.data || statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authFetch, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // DELETE

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;

    await authFetch(`/sales/${id}`, { method: "DELETE" });

    loadData();
  };

  // ADD SALE

  const handleAddSale = async (e) => {
    e.preventDefault();

    const saleData = {
      ...newSale,
      totalAmount: newSale.quantity * newSale.unitPrice,
    };

    await authFetch("/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    setShowAddModal(false);

    setNewSale({
      patientName: "",
      serviceOrItem: "",
      quantity: 1,
      unitPrice: 0,
      paymentMethod: "Cash",
      status: "Paid",
    });

    loadData();
  };

  const chartData = [
    { hour: "08:00", amount: 450 },
    { hour: "10:00", amount: 1200 },
    { hour: "12:00", amount: 850 },
    { hour: "14:00", amount: 2100 },
    { hour: "16:00", amount: 1500 },
    { hour: "18:00", amount: 900 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* HEADER */}

        <div className="bg-white p-8 rounded-3xl shadow border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <TrendingUp />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Daily Sales</h1>
              <p className="text-slate-400 text-sm">
                Pharmacy sales dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value, to: e.target.value })
              }
              className="border rounded-lg px-4 py-2"
            />

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg flex gap-2 items-center"
            >
              <Plus size={18} /> Add Sale
            </button>

            <button
              onClick={() => window.print()}
              className="border px-3 py-2 rounded-lg"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            icon={<DollarSign />}
            title="Total Sales"
            value={`$${stats.totalSales}`}
          />

          <StatCard
            icon={<ShoppingBag />}
            title="Orders"
            value={stats.count}
          />

          <StatCard
            icon={<CreditCard />}
            title="Cash Payments"
            value={`$${stats.cashPayments}`}
          />

          <StatCard
            icon={<Clock />}
            title="Pending"
            value={`$${stats.pendingAmount}`}
          />

        </div>

        {/* TABLE + CHART */}

        <div className="grid xl:grid-cols-3 gap-8">

          {/* TABLE */}

          <div className="xl:col-span-2 bg-white rounded-3xl shadow border">

            <div className="p-6 border-b flex justify-between items-center">

              <div className="relative w-80">
                <Search className="absolute left-3 top-3 text-slate-400" />
                <input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

            </div>

            <table className="w-full text-left">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Invoice</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>

              <tbody>

                {sales.map((sale) => (

                  <tr key={sale._id} className="border-t hover:bg-slate-50">

                    <td className="p-4 font-semibold">{sale.invoiceId}</td>

                    <td className="p-4">{sale.patientName}</td>

                    <td className="p-4">{sale.serviceOrItem}</td>

                    <td className="p-4">${sale.totalAmount}</td>

                    <td className="p-4">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                        {sale.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">

                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>
            </table>

          </div>

          {/* CHART */}

          <div className="bg-white rounded-3xl shadow border p-6">

            <h3 className="font-bold mb-6">Sales Chart</h3>

            <ResponsiveContainer width="99%" minWidth={1} height={300}>
              <AreaChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="hour" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  fill="#93c5fd"
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* MODAL */}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white p-8 rounded-3xl w-[500px]">

              <div className="flex justify-between mb-6">

                <h2 className="text-xl font-bold">Add Sale</h2>

                <button onClick={() => setShowAddModal(false)}>
                  <X />
                </button>

              </div>

              <form onSubmit={handleAddSale} className="space-y-4">

                <input
                  placeholder="Client Name"
                  className="w-full border p-3 rounded-lg"
                  required
                  value={newSale.patientName}
                  onChange={(e) =>
                    setNewSale({ ...newSale, patientName: e.target.value })
                  }
                />

                <input
                  placeholder="Service / Medicine"
                  className="w-full border p-3 rounded-lg"
                  required
                  value={newSale.serviceOrItem}
                  onChange={(e) =>
                    setNewSale({ ...newSale, serviceOrItem: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border p-3 rounded-lg"
                  value={newSale.unitPrice}
                  onChange={(e) =>
                    setNewSale({
                      ...newSale,
                      unitPrice: Number(e.target.value),
                    })
                  }
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Sale
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow border flex items-center justify-between">

    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>

    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
      {icon}
    </div>

  </div>
);

export default DailySales;