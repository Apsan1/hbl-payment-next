"use client";

import SecurityData from "@/lib/SecurityData";
import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    input_currency: "NPR",
    input_amount: "1",
    input_3d: "N",
    success_url: "http://localhost:3000/payment/success",
    fail_url: "http://localhost:3000/payment/failed",
    cancel_url: "http://localhost:3000/payment/cancel",
    backend_url: "http://localhost:3000/payment/backend",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // redirect to gateway
      } else {
        alert("Payment request failed!");
        console.error("Payment response:", data);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white text-black shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          HBL Payment Gateway
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium ">Currency</label>
            <select
              name="input_currency"
              value={form.input_currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="NPR">NPR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium ">Amount</label>
            <input
              type="number"
              name="input_amount"
              value={form.input_amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* 3D Secure */}
          <div>
            <label className="block text-sm font-medium ">3D Secure</label>
            <select
              name="input_3d"
              value={form.input_3d}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>

          {/* URLs */}
          {["success_url", "fail_url", "cancel_url", "backend_url"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium  capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>
            <strong>Himalayan Bank Limited</strong>
          </p>
          <p>Kamaladi, Kathmandu</p>
          <p>G.P.O. Box: 20590</p>
          <p>Phone: +977-1-4227749</p>
          <p>Fax: +977-1-4222800</p>
        </div>
      </div>
    </div>
  );
}
