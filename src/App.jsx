import React, { useState, useCallback } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

const generateInvoiceNumber = () => {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
};

const today = () => new Date().toISOString().split("T")[0];

const initialState = {
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: today(),
  dueDate: "",
  // Client Info
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  clientCity: "",
  clientState: "",
  clientZip: "",
  // Sender Info
  senderName: "",
  senderEmail: "",
  senderAddress: "",
  senderCity: "",
  senderState: "",
  senderZip: "",
  // Items
  items: [
    { id: Date.now(), description: "", quantity: 1, unitRate: 0 },
  ],
  // Tax & Notes
  taxRate: 18,
  notes: "",
  currency: "INR",
};

export default function App() {
  const [invoice, setInvoice] = useState(initialState);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"

  const updateField = useCallback((field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: "", quantity: 1, unitRate: 0 },
      ],
    }));
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const resetInvoice = () => {
    setInvoice({ ...initialState, invoiceNumber: generateInvoiceNumber(), invoiceDate: today(), items: [{ id: Date.now(), description: "", quantity: 1, unitRate: 0 }] });
  };

  // Calculations
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitRate,
    0
  );
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const calculations = { subtotal, taxAmount, grandTotal };

  const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
  const currencySymbol = currencySymbols[invoice.currency] || "₹";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-800 text-lg">Invoice Builder</span>
            </div>

            {/* Tab Switch */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === "edit"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={resetInvoice}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Invoice
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "edit" ? (
          <InvoiceForm
            invoice={invoice}
            updateField={updateField}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            calculations={calculations}
            currencySymbol={currencySymbol}
            onPreview={() => setActiveTab("preview")}
          />
        ) : (
          <InvoicePreview
            invoice={invoice}
            calculations={calculations}
            currencySymbol={currencySymbol}
            onEdit={() => setActiveTab("edit")}
          />
        )}
      </main>
    </div>
  );
}
