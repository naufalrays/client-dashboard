import { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Users,
  UserCheck,
} from "lucide-react";
import { ActiveFilters } from "../components/GlobalFilter/ActiveFilters";
import { useFilter } from "../contexts/FilterContext";
import {
  userProgressService,
  type UserProgressItem,
  type UserProgressFilterParams,
} from "../services/userProgressService";
import { toast } from "react-toastify";

// Updated SortField type to match API capabilities
type SortField =
  | "lastActiveTime"
  | "curriculumProgress"
  | "grammarProgress"
  | "vocabularyProgress"
  | "level"
  | "logs"
  | "name"
  | "email"
  | "group"
  | "subscription"
  | "referralCode"
  | "context"
  | null;

type SortDirection = "asc" | "desc";

const UserProgress = () => {
  const { filters } = useFilter();

  // API data state
  const [userProgressData, setUserProgressData] = useState<UserProgressItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [activeTodayLoading, setActiveTodayLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(10);

  // Sorting state - Updated to support all API fields
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch user progress data
  const fetchUserProgress = async () => {
    try {
      setLoading(true);

      const params: UserProgressFilterParams = {
        page: currentPage,
        limit: usersPerPage,
        search: searchDebounced || undefined,
        sortBy: sortField || undefined,
        sortOrder: sortDirection,
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };

      const response = await userProgressService.getUserProgress(params);

      setUserProgressData(response.data);
      setTotalUsers(response.total);
      setTotalPages(
        response.totalPages || Math.ceil(response.total / usersPerPage)
      );
    } catch (error: any) {
      console.error("Failed to fetch user progress:", error);
      toast.error("Failed to load user progress data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch active today count
  const fetchActiveToday = async () => {
    try {
      setActiveTodayLoading(true);

      const params = {
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
      };

      const response = await userProgressService.getActiveToday(params);
      setActiveToday(response.data.count);
    } catch (error: any) {
      console.error("Failed to fetch active today count:", error);
      toast.error("Failed to load active users count", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setActiveTodayLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchUserProgress();
  }, [currentPage, searchDebounced, sortField, sortDirection]);

  // Re-fetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchUserProgress();
    fetchActiveToday();
  }, [filters.groups, filters.dateRange]);

  // Fetch active today count on component mount
  useEffect(() => {
    fetchActiveToday();
  }, []);

  // Handle sorting - Updated to work with all API fields
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        // Reset to default sort
        setSortField(null);
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Format last active time
  const formatLastActiveTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUp className="w-3 h-3 text-gray-400 dark:text-gray-300" />
          <ChevronDown className="w-3 h-3 text-gray-400 dark:text-gray-300 -mt-1" />
        </div>
      );
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-500 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-500 ml-1" />
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchDebounced("");
  };

  // Reset sorting
  const resetSort = () => {
    setSortField(null);
    setSortDirection("desc");
    setCurrentPage(1);
  };

  // Keep existing helper functions
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "B2":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "A2":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "A1":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "B1":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "C1":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
    }
  };

  const getSprinkle = (subscription: string) => {
    const lower = subscription.toLowerCase();
    if (lower.includes("premium")) {
      return <Sparkles className="w-4 h-4 text-yellow-400 ml-1" />;
    }
    if (lower.includes("regular")) {
      return <Sparkles className="w-4 h-4 text-gray-400 ml-1" />;
    }
    return null;
  };

  const getContentBadgeColor = (content: string) => {
    if (!content || content === "-") {
      return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
    }
    switch (content.toLowerCase()) {
      case "learning":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "fun":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };

  // Pagination component - RESPONSIVE
  const PaginationComponent = () => {
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const getMobilePageNumbers = () => {
      const pages = [];

      if (currentPage > 1) {
        pages.push(currentPage - 1);
      }
      pages.push(currentPage);
      if (currentPage < totalPages) {
        pages.push(currentPage + 1);
      }

      return pages.filter((page) => page >= 1 && page <= totalPages);
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        {/* Results info */}
        <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
          {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers}{" "}
          entries
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center order-1 sm:order-2">
          {/* Desktop pagination */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile pagination */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {currentPage > 2 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  1
                </button>
                {currentPage > 3 && (
                  <span className="text-gray-400 px-1">...</span>
                )}
              </>
            )}

            {getMobilePageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className="text-gray-400 px-1">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page info for mobile */}
          <div className="flex sm:hidden items-center ml-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{currentPage}</span>
            <span className="mx-1">/</span>
            <span>{totalPages}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black dark:text-white-dark">
      {/* Page Header - Simplified */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Users Progress</h1>
        <div className="flex items-center gap-4">
          {/* Enhanced Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="form-input ltr:pl-10 rtl:pr-10 ltr:pr-8 rtl:pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort Reset Button */}
          {(sortField !== null || sortDirection !== "desc") && (
            <button
              onClick={resetSort}
              className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              title="Reset to default sort"
            >
              Reset Sort
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={() => {
              toast.info("Export feature coming soon!");
            }}
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          {/* GlobalFilterWidget removed from here */}
        </div>
      </div>

      {/* Active Filters Display */}
      <ActiveFilters className="mb-4" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Users Card */}
        <div className="panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Total Users
              </div>
            </div>
            <div className="flex items-center">
              {loading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              )}
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 ml-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Today Card */}
        <div className="panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {activeToday.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Active Today
              </div>
            </div>
            <div className="flex items-center">
              {activeTodayLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              )}
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learner Table - SEPARATED FROM PAGINATION */}
      <div className="panel p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading user progress...</p>
          </div>
        ) : (
          <>
            {/* Scrollable Table Container */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        LEARNER
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("group")}
                    >
                      <div className="flex items-center">
                        GROUP
                        <SortIcon field="group" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("subscription")}
                    >
                      <div className="flex items-center">
                        SUBSCRIPTION
                        <SortIcon field="subscription" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("level")}
                    >
                      <div className="flex items-center">
                        LEVEL
                        <SortIcon field="level" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("referralCode")}
                    >
                      <div className="flex items-center">
                        REFERRAL
                        <SortIcon field="referralCode" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("logs")}
                    >
                      <div className="flex items-center">
                        LOGS
                        <SortIcon field="logs" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("context")}
                    >
                      <div className="flex items-center">
                        CONTEXT
                        <SortIcon field="context" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("curriculumProgress")}
                    >
                      <div className="flex items-center">
                        CURRICULUM
                        <SortIcon field="curriculumProgress" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("vocabularyProgress")}
                    >
                      <div className="flex items-center">
                        VOCABULARY
                        <SortIcon field="vocabularyProgress" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("grammarProgress")}
                    >
                      <div className="flex items-center">
                        GRAMMAR
                        <SortIcon field="grammarProgress" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      onClick={() => handleSort("lastActiveTime")}
                    >
                      <div className="flex items-center">
                        LAST ACTIVITY
                        <SortIcon field="lastActiveTime" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userProgressData.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white flex items-center">
                              {user.name}
                              {getSprinkle(user.subscription)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">
                        {user.group || "-"}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">
                        <span className="flex items-center">
                          {user.subscription}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelBadgeColor(
                            user.level
                          )}`}
                        >
                          {user.level}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">
                        {user.referralCode}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">
                        {user.logs}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getContentBadgeColor(
                            user.context
                          )}`}
                        >
                          {user.context || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full bg-blue-500`}
                              style={{ width: `${user.curriculumProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {user.curriculumProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full bg-red-500`}
                              style={{ width: `${user.vocabularyProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {user.vocabularyProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full bg-orange-500`}
                              style={{ width: `${user.grammarProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {user.grammarProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">
                        {formatLastActiveTime(user.lastActiveTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No results message */}
            {userProgressData.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No users found</p>
                {searchDebounced && (
                  <p className="text-sm mt-2">
                    Try adjusting your search term or{" "}
                    <button
                      onClick={clearSearch}
                      className="text-blue-500 hover:text-blue-600 underline"
                    >
                      clear search
                    </button>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination - OUTSIDE OF SCROLLABLE CONTAINER */}
      {!loading && userProgressData.length > 0 && <PaginationComponent />}
    </div>
  );
};

export default UserProgress;
