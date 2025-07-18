import { X } from "lucide-react";

export const GroupFilterModal = ({
  open,
  onClose,
  schoolGroups,
  selectedGroups,
  onChange,
  onApply,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  schoolGroups: { id: string; name: string; description?: string }[];
  selectedGroups: string[];
  onChange: (id: string) => void;
  onApply: () => void;
  loading?: boolean;
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
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 disabled:opacity-50"
                disabled={loading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading groups...
                </p>
              </div>
            ) : (
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
                      disabled={loading}
                    />
                    <div className="ml-3 text-left">
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {group.name}
                      </span>
                      {group.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onApply}
                disabled={loading}
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
