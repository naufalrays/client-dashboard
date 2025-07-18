import { useState, useEffect } from "react";
import "flatpickr/dist/flatpickr.css";

import {
  UserCheck,
  Clock3,
  MessagesSquare,
  CheckCircle,
  Trophy,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ActiveFilters } from "../components/GlobalFilter/ActiveFilters";
import { useFilter } from "../contexts/FilterContext";
import {
  dashboardService,
  type DashboardOverviewResponse,
  type RecentActivityItem,
  type TopPerformerItem,
  type ProgressChartItem,
} from "../services/dashboardService";
import { toast } from "react-toastify";
import { FilterButton } from "../components/Filter/FilterButton";

const Dashboard = () => {
  const { filters } = useFilter();

  // API data state
  const [dashboardData, setDashboardData] = useState<
    DashboardOverviewResponse["data"] | null
  >(null);
  const [recentActivities, setRecentActivities] = useState<
    RecentActivityItem[]
  >([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformerItem[]>([]);
  const [progressData, setProgressData] = useState<ProgressChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [topPerformersLoading, setTopPerformersLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  // Recent Activities Pagination State
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const activitiesPerPage = 10; // Default items per page

  // Top Performers Filter
  const [isTopPerformanceFilter, setIsTopPerformanceFilterOpen] =
    useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Pass filters to API call
      const params = {
        groupIds: filters.groups,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await dashboardService.getOverview(params);
      setDashboardData(response.data);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async (page = 1) => {
    try {
      setActivitiesLoading(true);
      const params = {
        page: page,
        limit: activitiesPerPage,
        groupIds: filters.groups.map((g) => Number(g)),
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };

      const response = await dashboardService.getRecentActivity(params);

      // Update state with API response
      setRecentActivities(response.data);
      setActivitiesPage(response.page);
      setActivitiesTotalPages(response.totalPages);
      setActivitiesTotal(response.total);
    } catch (error: any) {
      console.error("Failed to fetch recent activities:", error);
      toast.error("Failed to load recent activities", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      setTopPerformersLoading(true);
      const params = {
        groupIds: filters.groups,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await dashboardService.getTopPerformers(params);
      setTopPerformers(response.data);
    } catch (error: any) {
      console.error("Failed to fetch top performers:", error);
      toast.error("Failed to load top performers", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setTopPerformersLoading(false);
    }
  };

  const fetchProgressChart = async () => {
    try {
      setProgressLoading(true);
      const params = {
        groupIds: filters.groups,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await dashboardService.getProgressChart(params);

      // Sort data by week number for proper chronological order
      const sortedData = response.data.sort((a, b) => {
        const weekA = parseInt(a.week.replace("Week ", ""));
        const weekB = parseInt(b.week.replace("Week ", ""));
        return weekA - weekB;
      });

      setProgressData(sortedData);
    } catch (error: any) {
      console.error("Failed to fetch progress chart:", error);
      toast.error("Failed to load progress chart", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setProgressLoading(false);
    }
  };

  // Fetch all data
  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities(1); // Reset to page 1
    fetchTopPerformers();
    fetchProgressChart();
  }, []);

  // Re-fetch data when filters change
  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities(1); // Reset to page 1 when filters change
    fetchTopPerformers();
    fetchProgressChart();
  }, [filters.groups, filters.dateRange]);

  // Handle pagination
  const handleActivitiesPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= activitiesTotalPages && !activitiesLoading) {
      fetchRecentActivities(newPage);
    }
  };

  // Handle refresh
  const handleRefreshActivities = () => {
    fetchRecentActivities(activitiesPage);
  };

  // Function to get activity icon based on activity type
  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes("conversation")) {
      return <MessagesSquare className="w-5 h-5 text-blue-500" />;
    } else if (
      activity.toLowerCase().includes("assessment") ||
      activity.toLowerCase().includes("test")
    ) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (
      activity.toLowerCase().includes("lesson") ||
      activity.toLowerCase().includes("vocab")
    ) {
      return <CheckCircle className="w-5 h-5 text-purple-500" />;
    } else {
      return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  // Function to get activity color based on activity type
  const getActivityColor = (activity: string) => {
    if (activity.toLowerCase().includes("conversation")) {
      return "bg-blue-50 dark:bg-blue-900/20";
    } else if (
      activity.toLowerCase().includes("assessment") ||
      activity.toLowerCase().includes("test")
    ) {
      return "bg-green-50 dark:bg-green-900/20";
    } else if (
      activity.toLowerCase().includes("lesson") ||
      activity.toLowerCase().includes("vocab")
    ) {
      return "bg-purple-50 dark:bg-purple-900/20";
    } else {
      return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Add this pagination component to Dashboard.tsx, replace the existing pagination section
  const RecentActivityPagination = () => {
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, activitiesPage - delta);
        i <= Math.min(activitiesTotalPages - 1, activitiesPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (activitiesPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (activitiesPage + delta < activitiesTotalPages - 1) {
        rangeWithDots.push("...", activitiesTotalPages);
      } else {
        rangeWithDots.push(activitiesTotalPages);
      }

      return rangeWithDots;
    };

    const getMobilePageNumbers = () => {
      const pages = [];

      // For mobile, show only current page and adjacent pages
      if (activitiesPage > 1) {
        pages.push(activitiesPage - 1);
      }
      pages.push(activitiesPage);
      if (activitiesPage < activitiesTotalPages) {
        pages.push(activitiesPage + 1);
      }

      return pages.filter((page) => page >= 1 && page <= activitiesTotalPages);
    };

    if (activitiesTotalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4">
        {/* Results info */}
        <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          Showing {(activitiesPage - 1) * activitiesPerPage + 1} to{" "}
          {Math.min(activitiesPage * activitiesPerPage, activitiesTotal)} of{" "}
          {activitiesTotal.toLocaleString()} activities
        </div>

        {/* Pagination controls */}
        <div className="order-1 sm:order-2">
          {/* Desktop pagination */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleActivitiesPageChange(activitiesPage - 1)}
              disabled={activitiesPage === 1 || activitiesLoading}
              className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handleActivitiesPageChange(page)
                }
                disabled={page === "..." || activitiesLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  page === activitiesPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : page === "..."
                    ? "text-gray-400 cursor-not-allowed bg-transparent"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handleActivitiesPageChange(activitiesPage + 1)}
              disabled={
                activitiesPage === activitiesTotalPages || activitiesLoading
              }
              className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Mobile pagination - Completely redesigned */}
          <div className="flex sm:hidden items-center justify-center w-full">
            <div className="flex items-center space-x-1">
              {/* Previous button - larger touch target */}
              <button
                onClick={() => handleActivitiesPageChange(activitiesPage - 1)}
                disabled={activitiesPage === 1 || activitiesLoading}
                className="flex items-center justify-center w-9 h-9 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Show first page if not near beginning */}
              {activitiesPage > 3 && (
                <>
                  <button
                    onClick={() => handleActivitiesPageChange(1)}
                    disabled={activitiesLoading}
                    className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                  >
                    1
                  </button>
                  <span className="text-gray-400 px-1 text-sm">...</span>
                </>
              )}

              {/* Current page range - limited for mobile */}
              {getMobilePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handleActivitiesPageChange(page)}
                  disabled={activitiesLoading}
                  className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    page === activitiesPage
                      ? "bg-blue-500 text-white border-blue-500"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Show last page if not near end */}
              {activitiesPage < activitiesTotalPages - 2 && (
                <>
                  <span className="text-gray-400 px-1 text-sm">...</span>
                  <button
                    onClick={() =>
                      handleActivitiesPageChange(activitiesTotalPages)
                    }
                    disabled={activitiesLoading}
                    className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                  >
                    {activitiesTotalPages}
                  </button>
                </>
              )}

              {/* Next button - larger touch target */}
              <button
                onClick={() => handleActivitiesPageChange(activitiesPage + 1)}
                disabled={
                  activitiesPage === activitiesTotalPages || activitiesLoading
                }
                className="flex items-center justify-center w-9 h-9 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile page info - moved below buttons */}
          <div className="flex sm:hidden items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Page </span>
            <span className="font-medium mx-1">{activitiesPage}</span>
            <span> of </span>
            <span className="font-medium">{activitiesTotalPages}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header - Simple title only */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Filter moved to header, so just the title here */}
      </div>

      {/* Active Filters Display */}
      <ActiveFilters className="mb-4" />

      {/* Top Cards - Updated with API data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-black dark:text-white-dark">
        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 mb-2">
                <UserCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-md font-semibold">Active Users</div>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
              {dashboardData?.activeUsers?.toLocaleString() || "0"}
            </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Learners active this month
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800 mb-2">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-md font-semibold">Total Users</div>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
              {dashboardData?.totalUsers?.toLocaleString() || "0"}
            </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Registered accounts
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-800 mb-2">
                <Clock3 className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-md font-semibold">Active Hours</div>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
              {dashboardData?.activeHours || "N/A"}
            </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Peak activity time
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg border border-orange-200 dark:border-orange-800 mb-2">
                <MessagesSquare className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-md font-semibold">Conversation Logs</div>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
              {dashboardData?.conversationLogs?.toLocaleString() || "0"}
            </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Total Interactions
          </div>
        </div>
      </div>

      {/* Top Performers and Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Performers */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg py-1 font-semibold text-gray-800 dark:text-white">
              Top Performers
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex justify-end">
                  <FilterButton
                    isOpen={isTopPerformanceFilter}
                    onClick={() =>
                      setIsTopPerformanceFilterOpen((prev) => !prev)
                    }
                  />
                </div>

                {isTopPerformanceFilter && (
                  <div className="absolute right-0 mt-2 w-18 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800">
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        onClick={() => setIsTopPerformanceFilterOpen(false)}
                      >
                        A1
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        onClick={() => setIsTopPerformanceFilterOpen(false)}
                      >
                        A2
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        onClick={() => setIsTopPerformanceFilterOpen(false)}
                      >
                        B1
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        onClick={() => setIsTopPerformanceFilterOpen(false)}
                      >
                        B2
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {topPerformersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Loading top performers...</p>
            </div>
          ) : topPerformers.length > 0 ? (
            <ul className="space-y-3">
              {topPerformers.map((user) => (
                <li
                  key={user.userId}
                  className="flex items-center justify-between p-4 rounded-md bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700"
                >
                  {/* Kiri: Rank + Nama + Email + Level */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 min-w-8 min-h-8 rounded-full bg-yellow-400 text-white font-bold text-base">
                      {user.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {user.level || "-"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: Progress + Conversation Logs + Trophy */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user.curriculumProgress}%
                      </p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No top performers data available</p>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-800 dark:text-white">
              <h2 className="text-lg font-semibold">Progress Overview</h2>
              <h4 className="text-sm text-gray-600 dark:text-gray-400">
                Average weekly progress of all users
              </h4>
            </div>
          </div>

          <div className="h-64 overflow-x-auto">
            <div style={{ minWidth: progressData.length > 8 ? 700 : "100%" }}>
              {progressLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="ml-3 text-gray-600">Loading chart...</p>
                </div>
              ) : progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressData}>
                    <XAxis
                      dataKey="week"
                      stroke="#888888"
                      className="text-xs dark:text-gray-300"
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, "dataMax + 10"]}
                      stroke="#888888"
                      className="text-xs dark:text-gray-300"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#e5e7eb",
                        borderRadius: "0.375rem",
                        padding: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      itemStyle={{ color: "#1f2937" }}
                      formatter={(value, _) => [
                        `${value}%`,
                        "Average Progress",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageProgress"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No progress data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity with Updated Pagination */}
      <div className="panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activitiesTotal > 0 && (
                <>Latest user activities and interactions</>
              )}
            </p>
          </div>

          <button
            onClick={handleRefreshActivities}
            disabled={activitiesLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${activitiesLoading ? "animate-spin" : ""}`}
            />
            {activitiesLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Activities List - Keep the same structure but separate from pagination */}
        <div className="min-h-[400px]">
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Loading activities...</p>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="space-y-3 min-w-full">
                {recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className={`flex items-start gap-3 p-4 rounded-md transition-colors ${getActivityColor(
                      activity.activity
                    )} border border-gray-100 dark:border-gray-700`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getActivityIcon(activity.activity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 dark:text-gray-100 font-medium">
                            {activity.userName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {activity.activity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              activity.type === "conversation"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                                : activity.type === "assessment"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                            }`}
                          >
                            {activity.type}
                          </span>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{activity.relativeTime}</span>
                        <span>•</span>
                        <span>ID: {activity.id}</span>
                        <span>•</span>
                        <span>User ID: {activity.userId}</span>
                      </div> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No recent activities found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>

        {/* New Pagination Component - Outside of scrollable container */}
        {!activitiesLoading && recentActivities.length > 0 && (
          <RecentActivityPagination />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
