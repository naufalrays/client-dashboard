import {
  X,
  Users,
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const CreateGroupModal = ({
  open,
  onClose,
  onSubmit,
  groupName,
  onGroupNameChange,
  searchTerm,
  onSearchTermChange,
  handleFileUpload,
  currentUsers,
  selectedUsers,
  handleUserSelection,
  handleSelectAllUsers,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsers,
  currentPage,
  totalPages,
  handlePageChange,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  groupName: string;
  onGroupNameChange: (value: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentUsers: any[];
  selectedUsers: number[];
  handleUserSelection: (id: number) => void;
  handleSelectAllUsers: () => void;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  filteredUsers: any[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden dark:bg-gray-800">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="w-5 h-5" />
                Create Group
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Group Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => onGroupNameChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500"
                placeholder="Enter group name"
              />
            </div>

            {/* Search and Import Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500"
                  placeholder="Search users..."
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer inline-flex items-center gap-2 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  <Upload className="w-4 h-4" />
                  Import Excel
                </label>
              </div>
            </div>

            {/* Users Table */}
            <div className="flex-1 overflow-hidden">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-700 dark:border-gray-600">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === currentUsers.length &&
                            currentUsers.length > 0
                          }
                          onChange={handleSelectAllUsers}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-600 dark:checked:border-indigo-600"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Learners
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Level
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Referral
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                    {currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelection(user.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-600 dark:checked:border-indigo-600"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {user.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {user.referral}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                  <span>
                    Showing {indexOfFirstUser + 1} to{" "}
                    {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                    {filteredUsers.length} users
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === page
                            ? "bg-indigo-600 text-white dark:bg-indigo-700"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Users Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {selectedUsers.length} user(s) selected
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-700 dark:hover:bg-indigo-800"
                onClick={onSubmit}
                disabled={!groupName.trim()}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
