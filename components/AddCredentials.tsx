// app/components/ExpensesForm.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

interface CredentialsFormProps {
  onClose: () => void;
}

const CredentialsForm: React.FC<CredentialsFormProps> = ({ onClose }) => {
  const { data: session, status } = useSession();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("food");
  const [otherCategory, setOtherCategory] = useState<string>("");
  const [formError, setFormError] = useState({
    description: false,
    amount: false,
    otherCategory: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setLoading(true);

  const newErrors = {
    description: !description.trim(),
    amount: !amount || amount < 1,
    otherCategory: category === "other" && !otherCategory.trim(),
  };

  setFormError(newErrors);

  if (newErrors.description || newErrors.amount || newErrors.otherCategory) {
    toast.error("Please fill in all fields correctly.", {
      icon: <XCircle className="text-red-500" />,
    });
    setLoading(false);
    return;
  }

  const finalCategory = category === "other" ? otherCategory : category;
  const apiData = {
    description,
    category: finalCategory,
    amount,
  };

  try {
    const response = await api.post("/api/expenses", apiData) as Response;

    // If backend returns non-2xx, treat it as error
    if (response.status >= 400) {
      const errorData = await response.json();
      toast.error(
        errorData?.error || "Failed to add expense",
        { icon: <XCircle className="text-red-500" /> }
      );
      setLoading(false);
      return;
    }

    toast.success(`Expense "${description}" added!`, {
      icon: <CheckCircle className="text-green-500" />,
    });

    // reset form
    setDescription("");
    setAmount("");
    setCategory("food");
    setOtherCategory("");
    setFormError({ description: false, amount: false, otherCategory: false });
    onClose();
  } catch (err: any) {
    console.error("Error creating expense:", err);
    toast.error(err?.message || "Failed to add expense", {
      icon: <XCircle className="text-red-500" />,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="shadow-lg p-4 sm:p-6 bg-gray-900 rounded-md"
      >
        <h2 className="text-green-600 text-lg sm:text-xl font-bold mb-4">
          Add New Expense
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Expense Name"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              className={`w-full p-2 sm:p-3 rounded-md bg-gray-800 text-white outline-none border ${
                formError.description ? "border-red-500" : "border-transparent"
              } focus:border-gray-600 text-sm sm:text-base`}
            />
            {formError.description && (
              <p className="text-red-500 text-xs mt-1">
                Expense name is required
              </p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              step="0.01"
              min="0"
              className={`w-full p-2 sm:p-3 rounded-md bg-gray-800 text-white outline-none border ${
                formError.amount ? "border-red-500" : "border-transparent"
              } focus:border-gray-600 text-sm sm:text-base`}
            />
            {formError.amount && (
              <p className="text-red-500 text-xs mt-1">
                Amount must be greater than 0
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-white text-sm sm:text-base">Category</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="flex items-center text-white text-sm sm:text-base">
                <input
                  type="radio"
                  name="category"
                  value="food"
                  checked={category === "food"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCategory(e.target.value)
                  }
                  className="mr-2 accent-green-500 cursor-pointer"
                />
                Food
              </label>
              <label className="flex items-center text-white text-sm sm:text-base">
                <input
                  type="radio"
                  name="category"
                  value="clothes"
                  checked={category === "clothes"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCategory(e.target.value)
                  }
                  className="mr-2 accent-green-500 cursor-pointer"
                />
                Clothes
              </label>
              <label className="flex items-center text-white text-sm sm:text-base">
                <input
                  type="radio"
                  name="category"
                  value="transport"
                  checked={category === "transport"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCategory(e.target.value)
                  }
                  className="mr-2 accent-green-500 cursor-pointer"
                />
                Transport
              </label>
              <label className="flex items-center text-white text-sm sm:text-base">
                <input
                  type="radio"
                  name="category"
                  value="other"
                  checked={category === "other"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCategory(e.target.value)
                  }
                  className="mr-2 accent-green-500 cursor-pointer"
                />
                Other
              </label>
            </div>
            <div
              className={`flex flex-col gap-2 mt-2 ${
                category === "other" ? "block" : "hidden"
              }`}
            >
              <label
                htmlFor="other"
                className="text-white text-sm sm:text-base"
              >
                Other
              </label>
              <input
                id="other"
                type="text"
                placeholder="Enter Category"
                value={otherCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOtherCategory(e.target.value)
                }
                className={`w-full p-2 sm:p-3 rounded-md bg-gray-800 text-white outline-none border ${
                  formError.otherCategory
                    ? "border-red-500"
                    : "border-transparent"
                } focus:border-gray-600 text-sm sm:text-base`}
              />
              {formError.otherCategory && (
                <p className="text-red-500 text-xs mt-1">
                  Custom category is required
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 p-2 sm:p-3 rounded-md cursor-pointer hover:bg-green-700 transition text-sm sm:text-base"
          >
            {loading ? (
              <span>Adding Expense...</span>
            ) : (
              <span>Add Expense </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CredentialsForm;
