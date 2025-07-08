import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { X } from "lucide-react";

export const PeriodFilterModal = ({
  open,
  dateRange,
  onClose,
  onApply,
  onChange,
}: {
  open: boolean;
  dateRange: Date[];
  onClose: () => void;
  onApply: () => void;
  onChange: (dates: Date[]) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full dark:bg-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Period
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <Flatpickr
                options={{ mode: "range", dateFormat: "Y-m-d" }}
                value={dateRange}
                onChange={(dates) => {
                  if (dates.length === 2) onChange(dates);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-700 dark:hover:bg-indigo-800"
                onClick={onApply}
                disabled={dateRange.length !== 2}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
