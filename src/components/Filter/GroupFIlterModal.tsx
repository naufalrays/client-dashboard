import { X } from "lucide-react";

export const GroupFilterModal = ({
  open,
  onClose,
  schoolGroups,
  selectedGroups,
  onChange,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  schoolGroups: { id: string; name: string }[];
  selectedGroups: string[];
  onChange: (id: string) => void;
  onApply: () => void;
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
                Select Groups
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {schoolGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={
                      group.id === "all"
                        ? selectedGroups.length === schoolGroups.length - 1
                        : selectedGroups.includes(group.id)
                    }
                    onChange={() => onChange(group.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-600 dark:checked:border-indigo-600"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-200">
                    {group.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                onClick={onApply}
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
