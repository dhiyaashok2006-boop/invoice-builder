import React from "react";

const inputClass =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800 placeholder-slate-400 transition-all";

const labelClass = "block text-xs font-medium text-slate-500 mb-1";

export default function InvoiceForm({
  invoice,
  updateField,
  addItem,
  updateItem,
  removeItem,
  calculations,
  currencySymbol,
  onPreview,
}) {
  const fmt = (n) =>
    `${currencySymbol}${Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      {/* Invoice Meta */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
          Invoice Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Invoice Number</label>
            <input
              className={inputClass}
              value={invoice.invoiceNumber}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className={labelClass}>Invoice Date</label>
            <input
              type="date"
              className={inputClass}
              value={invoice.invoiceDate}
              onChange={(e) => updateField("invoiceDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              className={inputClass}
              value={invoice.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select
              className={inputClass}
              value={invoice.currency}
              onChange={(e) => updateField("currency", e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sender & Client */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* From */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
            From (Your Details)
          </h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Full Name / Business Name</label>
              <input
                className={inputClass}
                value={invoice.senderName}
                onChange={(e) => updateField("senderName", e.target.value)}
                placeholder="Your Name or Company"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={invoice.senderEmail}
                onChange={(e) => updateField("senderEmail", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                className={inputClass}
                value={invoice.senderAddress}
                onChange={(e) => updateField("senderAddress", e.target.value)}
                placeholder="Street Address"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={invoice.senderCity}
                  onChange={(e) => updateField("senderCity", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  value={invoice.senderState}
                  onChange={(e) => updateField("senderState", e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  className={inputClass}
                  value={invoice.senderZip}
                  onChange={(e) => updateField("senderZip", e.target.value)}
                  placeholder="600001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* To */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
            Bill To (Client Details)
          </h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Client Name / Business Name</label>
              <input
                className={inputClass}
                value={invoice.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Client Name"
              />
            </div>
            <div>
              <label className={labelClass}>Client Email</label>
              <input
                type="email"
                className={inputClass}
                value={invoice.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                className={inputClass}
                value={invoice.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                placeholder="Street Address"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={invoice.clientCity}
                  onChange={(e) => updateField("clientCity", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  value={invoice.clientState}
                  onChange={(e) => updateField("clientState", e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  className={inputClass}
                  value={invoice.clientZip}
                  onChange={(e) => updateField("clientZip", e.target.value)}
                  placeholder="600001"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Line Items
          </h2>
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-2 bg-slate-50 rounded-lg mb-2">
          <div className="col-span-5 text-xs font-medium text-slate-500 uppercase">Description</div>
          <div className="col-span-2 text-xs font-medium text-slate-500 uppercase text-center">Qty</div>
          <div className="col-span-2 text-xs font-medium text-slate-500 uppercase text-right">Unit Rate</div>
          <div className="col-span-2 text-xs font-medium text-slate-500 uppercase text-right">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {invoice.items.map((item, idx) => {
            const amount = item.quantity * item.unitRate;
            return (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="col-span-12 sm:col-span-5">
                  <label className="sm:hidden text-xs text-slate-400 mb-1 block">Description</label>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder={`Item ${idx + 1} description`}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-xs text-slate-400 mb-1 block">Qty</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={`${inputClass} text-center`}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 0))
                    }
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-xs text-slate-400 mb-1 block">Unit Rate</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputClass} text-right`}
                    value={item.unitRate}
                    onChange={(e) =>
                      updateItem(item.id, "unitRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="col-span-3 sm:col-span-2 text-right">
                  <label className="sm:hidden text-xs text-slate-400 mb-1 block">Amount</label>
                  <span className="text-sm font-medium text-slate-700 font-mono">
                    {fmt(amount)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={invoice.items.length === 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax & Totals + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
            Notes
          </h2>
          <textarea
            className={`${inputClass} resize-none`}
            rows={5}
            value={invoice.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Payment terms, thank you note, or any additional information..."
          />
        </div>

        {/* Totals */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
            Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-mono font-medium text-slate-700">
                {fmt(calculations.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Tax Rate</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-16 border border-slate-200 rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={invoice.taxRate}
                  onChange={(e) =>
                    updateField("taxRate", parseFloat(e.target.value) || 0)
                  }
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <span className="text-sm font-mono font-medium text-slate-700">
                {fmt(calculations.taxAmount)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-base font-semibold text-slate-800">Grand Total</span>
              <span className="text-xl font-bold font-mono text-blue-600">
                {fmt(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-4">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview & Export
        </button>
      </div>
    </div>
  );
}
