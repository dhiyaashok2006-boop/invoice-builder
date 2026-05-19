import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePreview({ invoice, calculations, currencySymbol, onEdit }) {
  const invoiceRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const fmt = (n) =>
    `${currencySymbol}${Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // Multi-page support
        let yOffset = 0;
        while (yOffset < imgHeight) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
          yOffset += pageHeight;
        }
      }

      const fileName = `${invoice.invoiceNumber || "invoice"}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    }
    setExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Edit
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {exporting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div
        id="invoice-preview"
        ref={invoiceRef}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="bg-white rounded-xl border border-slate-200 p-10 max-w-3xl mx-auto shadow-sm"
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">INVOICE</h1>
            <p className="text-slate-500 text-sm font-mono">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Issue Date</p>
            <p className="font-medium text-slate-800">{formatDate(invoice.invoiceDate)}</p>
            {invoice.dueDate && (
              <>
                <p className="text-sm text-slate-500 mt-2">Due Date</p>
                <p className="font-medium text-red-600">{formatDate(invoice.dueDate)}</p>
              </>
            )}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              From
            </p>
            <p className="font-semibold text-slate-800">
              {invoice.senderName || "Your Name"}
            </p>
            {invoice.senderEmail && (
              <p className="text-sm text-slate-500">{invoice.senderEmail}</p>
            )}
            {invoice.senderAddress && (
              <p className="text-sm text-slate-500">{invoice.senderAddress}</p>
            )}
            {(invoice.senderCity || invoice.senderState) && (
              <p className="text-sm text-slate-500">
                {[invoice.senderCity, invoice.senderState, invoice.senderZip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Bill To
            </p>
            <p className="font-semibold text-slate-800">
              {invoice.clientName || "Client Name"}
            </p>
            {invoice.clientEmail && (
              <p className="text-sm text-slate-500">{invoice.clientEmail}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-sm text-slate-500">{invoice.clientAddress}</p>
            )}
            {(invoice.clientCity || invoice.clientState) && (
              <p className="text-sm text-slate-500">
                {[invoice.clientCity, invoice.clientState, invoice.clientZip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-6" />

        {/* Items Table */}
        <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">
                Description
              </th>
              <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 w-16">
                Qty
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 w-28">
                Unit Rate
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 w-28">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => {
              const amount = item.quantity * item.unitRate;
              return (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="py-3 pr-4 text-sm text-slate-700">
                    {item.description || <span className="text-slate-400 italic">No description</span>}
                  </td>
                  <td className="py-3 text-center text-sm text-slate-600 font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-sm text-slate-600 font-mono">
                    {fmt(item.unitRate)}
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-slate-800 font-mono">
                    {fmt(amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-mono text-slate-700">{fmt(calculations.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Tax ({invoice.taxRate}%)</span>
              <span className="text-sm font-mono text-slate-700">{fmt(calculations.taxAmount)}</span>
            </div>
            <div className="flex justify-between py-3 mt-1 bg-blue-600 rounded-lg px-3">
              <span className="text-sm font-semibold text-white">Total</span>
              <span className="text-sm font-bold font-mono text-white">
                {fmt(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Notes
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 mt-8 pt-4 text-center">
          <p className="text-xs text-slate-400">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
