"use client";

import React, { useState } from "react";
import { X, Upload, Download, FileJson, FileSpreadsheet, AlertCircle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "import" | "export";

const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("import");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['.json', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        toast.error("Invalid file type. Please upload a JSON or CSV file.");
        return;
      }

      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement actual import logic here
      // For now, just simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Successfully imported passwords from ${importFile.name}`, {
        icon: <CheckCircle className="text-green-500" />,
      });

      setImportFile(null);
      onClose();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import passwords. Please check the file format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual export logic here
      // For now, just simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));

      const filename = `fortress-key-backup-${new Date().toISOString().split('T')[0]}.${exportFormat}`;

      // Simulate file download
      toast.success(`Vault exported as ${filename}`, {
        icon: <CheckCircle className="text-green-500" />,
      });

      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export vault. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Backup & Import</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab("import")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                activeTab === "import"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </div>
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                activeTab === "export"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "import" ? (
            <div className="space-y-6">
              {/* Import Info */}
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Import your passwords</p>
                  <p className="text-blue-400/80">
                    Upload a JSON or CSV file containing your passwords. Make sure the file follows the correct format.
                  </p>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select File
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JSON or CSV files only</p>
                    </div>
                  </label>
                </div>

                {importFile && (
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4">
                    {importFile.name.endsWith('.json') ? (
                      <FileJson className="w-8 h-8 text-blue-400" />
                    ) : (
                      <FileSpreadsheet className="w-8 h-8 text-green-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{importFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(importFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setImportFile(null)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Supported Formats */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Supported Formats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <FileJson className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">JSON</p>
                      <p className="text-xs text-gray-400">Fortress Key format</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">CSV</p>
                      <p className="text-xs text-gray-400">Chrome, Firefox exports</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-300">
                  <p className="font-medium mb-1">Security Notice</p>
                  <p className="text-yellow-400/80">
                    Importing will add new credentials to your vault. Duplicates will be skipped.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Export Info */}
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Export your vault</p>
                  <p className="text-blue-400/80">
                    Download all your passwords in a secure format. Keep this file safe and encrypted.
                  </p>
                </div>
              </div>

              {/* Export Format Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Export Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setExportFormat("json")}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      exportFormat === "json"
                        ? "bg-blue-500/10 border-blue-500/30 text-gray-200"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <FileJson className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium">JSON Format</p>
                      <p className="text-xs text-gray-500">Full data structure</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setExportFormat("csv")}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      exportFormat === "csv"
                        ? "bg-blue-500/10 border-blue-500/30 text-gray-200"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <FileSpreadsheet className="w-6 h-6 text-green-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium">CSV Format</p>
                      <p className="text-xs text-gray-500">Excel compatible</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Export Preview */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  What will be exported
                </label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Credentials</span>
                    <span className="text-white font-semibold">147 items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Format</span>
                    <span className="text-white font-semibold uppercase">{exportFormat}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estimated Size</span>
                    <span className="text-white font-semibold">~24 KB</span>
                  </div>
                </div>
              </div>

              {/* Security Warning */}
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-medium mb-1">Important Security Warning</p>
                  <ul className="text-red-400/80 space-y-1 list-disc list-inside">
                    <li>The exported file contains unencrypted passwords</li>
                    <li>Store it in a secure, encrypted location</li>
                    <li>Delete the file after use if not needed</li>
                    <li>Never share this file or upload it online</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-gray-300 rounded-lg font-medium transition-all border border-gray-700"
            >
              Cancel
            </button>
            {activeTab === "import" ? (
              <button
                onClick={handleImport}
                disabled={!importFile || isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none"
              >
                {isProcessing ? "Importing..." : "Import Passwords"}
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-green-500/20 disabled:shadow-none"
              >
                {isProcessing ? "Exporting..." : "Export Vault"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
