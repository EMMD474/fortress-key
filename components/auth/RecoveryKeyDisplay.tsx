"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, ShieldAlert, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  recoveryKey: string;
  onConfirmed: () => void;
}

/**
 * Shows the Recovery Key exactly once. The user must copy or download it and
 * tick the confirmation before continuing. The key is never sent to the server
 * and cannot be recovered if lost (docs/ENCRYPTION_DESIGN.md §4.1, §4.3).
 */
const RecoveryKeyDisplay = ({ recoveryKey, onConfirmed }: Props) => {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setCopied(true);
      toast.success("Recovery key copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please select and copy it manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        "Fortress Key — Recovery Key\n",
        "===========================\n\n",
        `${recoveryKey}\n\n`,
        "Keep this somewhere safe and private. It is the ONLY way to recover\n",
        "your vault if you forget your master password. We cannot recover it for\n",
        "you — if you lose both, your data is permanently unreadable.\n",
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fortress-key-recovery-key.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-transparent">
      <div className="flex flex-col items-center text-center">
        <ShieldAlert className="h-10 w-10 text-amber-500" />
        <h2 className="mt-2 text-2xl font-bold text-blue-800 dark:text-blue-300">
          Save your Recovery Key
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          This is shown <span className="font-semibold">only once</span>. It's the
          only way back into your vault if you forget your master password.
        </p>
      </div>

      <div className="rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
        <code className="block break-all text-center font-mono text-sm tracking-wide text-gray-900 dark:text-gray-100">
          {recoveryKey}
        </code>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCopy}
          className="w-full py-2 flex items-center justify-center gap-2"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          onClick={handleDownload}
          className="w-full py-2 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800"
        >
          <Download size={18} />
          Download
        </Button>
      </div>

      <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
        If you lose both your master password and this recovery key, your vault
        becomes <span className="font-semibold">permanently unreadable</span>. No
        one — including us — can recover it.
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        I have saved my recovery key somewhere safe.
      </label>

      <button
        type="button"
        disabled={!confirmed}
        onClick={onConfirmed}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Continue to login
      </button>
    </div>
  );
};

export default RecoveryKeyDisplay;
