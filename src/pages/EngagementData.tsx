import React, { useState, useEffect } from "react";
import { GraduationCap, Heart, HelpCircle } from "lucide-react";
import { ActiveFilters } from "../components/GlobalFilter/ActiveFilters";
import { useFilter } from "../contexts/FilterContext";
import {
  engagementService,
  type LearningContextResponse,
  type TopLogUsersResponse,
  type TopLessonUsersResponse,
  type PopularContentResponse,
  type UsageDistributionResponse,
} from "../services/engagementService";
import { toast } from "react-toastify";
import { FilterButton } from "../components/Filter/FilterButton";

const EngagementData = () => {
  const { filters } = useFilter();

  // API data state
  const [learningContextData, setLearningContextData] =
    useState<LearningContextResponse | null>(null);
  const [topLogUsersData, setTopLogUsersData] =
    useState<TopLogUsersResponse | null>(null);
  const [topLessonUsersData, setTopLessonUsersData] =
    useState<TopLessonUsersResponse | null>(null);
  const [popularContentData, setPopularContentData] =
    useState<PopularContentResponse | null>(null);
  const [usageDistributionData, setUsageDistributionData] =
    useState<UsageDistributionResponse | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [topLogUsersLoading, setTopLogUsersLoading] = useState(true);
  const [topLessonUsersLoading, setTopLessonUsersLoading] = useState(true);
  const [popularContentLoading, setPopularContentLoading] = useState(true);
  const [usageDistributionLoading, setUsageDistributionLoading] =
    useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Local filter states
  const [isLearningFilter, setIsLearningFilterOpen] = useState(false);
  const [selectedLogCategory, setSelectedLogCategory] = useState<
    "ALL" | "LEARNING" | "FUN" | "UNKNOWN"
  >("ALL");

  // Fetch learning context data
  const fetchLearningContext = async () => {
    try {
      setLoading(true);
      const params = {
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await engagementService.getLearningContext(params);
      setLearningContextData(response);
      setLastUpdated(response.metadata.last_updated);
    } catch (error: any) {
      console.error("Failed to fetch learning context:", error);
      toast.error("Failed to load engagement data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch top log users data
  const fetchTopLogUsers = async (
    category: "ALL" | "LEARNING" | "FUN" | "UNKNOWN" = "ALL"
  ) => {
    try {
      setTopLogUsersLoading(true);
      const params = {
        category: category,
        limit: 10,
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await engagementService.getTopLogUsers(params);
      setTopLogUsersData(response);
    } catch (error: any) {
      console.error("Failed to fetch top log users:", error);
      toast.error("Failed to load top log users data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setTopLogUsersLoading(false);
    }
  };

  // Fetch top lesson users data
  const fetchTopLessonUsers = async () => {
    try {
      setTopLessonUsersLoading(true);
      const params = {
        limit: 10,
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await engagementService.getTopLessonUsers(params);
      setTopLessonUsersData(response);
    } catch (error: any) {
      console.error("Failed to fetch top lesson users:", error);
      toast.error("Failed to load top lesson users data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setTopLessonUsersLoading(false);
    }
  };

  // Fetch popular content data
  const fetchPopularContent = async () => {
    try {
      setPopularContentLoading(true);
      const params = {
        limit: 10,
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await engagementService.getPopularContent(params);
      setPopularContentData(response);
    } catch (error: any) {
      console.error("Failed to fetch popular content:", error);
      toast.error("Failed to load popular content data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setPopularContentLoading(false);
    }
  };

  // Fetch usage distribution data
  const fetchUsageDistribution = async () => {
    try {
      setUsageDistributionLoading(true);
      const params = {
        groupIds: filters.groups.length > 0 ? filters.groups : undefined,
        startDate: filters.dateRange[0]?.toISOString(),
        endDate: filters.dateRange[1]?.toISOString(),
      };
      const response = await engagementService.getUsageDistribution(params);
      setUsageDistributionData(response);
    } catch (error: any) {
      console.error("Failed to fetch usage distribution:", error);
      toast.error("Failed to load usage distribution data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUsageDistributionLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLearningContext();
    fetchTopLogUsers();
    fetchTopLessonUsers();
    fetchPopularContent();
    fetchUsageDistribution();
  }, []);

  // Re-fetch data when filters change
  useEffect(() => {
    fetchLearningContext();
    fetchTopLogUsers(selectedLogCategory);
    fetchTopLessonUsers();
    fetchPopularContent();
    fetchUsageDistribution();
  }, [filters.groups, filters.dateRange]);

  // Fetch top log users when category changes
  useEffect(() => {
    fetchTopLogUsers(selectedLogCategory);
  }, [selectedLogCategory]);

  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get level badge color
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

  // Handle category filter for Top Log Users
  const handleLogCategoryFilter = (
    category: "ALL" | "LEARNING" | "FUN" | "UNKNOWN"
  ) => {
    setSelectedLogCategory(category);
    setIsLearningFilterOpen(false);
  };

  // Generate engagement summary from API data
  const getEngagementSummary = () => {
    if (!learningContextData) {
      return [
        {
          title: "Learning",
          percentage: 0,
          count: 0,
          users: 0,
          description: "Learning-related activity",
          icon: <GraduationCap className="w-5 h-5" />,
          backgroundColor: "bg-emerald-100",
          textColor: "text-emerald-700",
        },
        {
          title: "Fun",
          percentage: 0,
          count: 0,
          users: 0,
          description: "Casual interactions",
          icon: <Heart className="w-5 h-5" />,
          backgroundColor: "bg-violet-100",
          textColor: "text-violet-700",
        },
        {
          title: "Unknown",
          percentage: 0,
          count: 0,
          users: 0,
          description: "Unclear logs",
          icon: <HelpCircle className="w-5 h-5" />,
          backgroundColor: "bg-orange-100",
          textColor: "text-orange-700",
        },
      ];
    }

    const { data } = learningContextData;
    return [
      {
        title: "Learning",
        percentage: Math.round(data.learning.percentage),
        count: data.learning.count,
        users: data.learning.users,
        description: "Learning-related activity",
        icon: <GraduationCap className="w-5 h-5" />,
        backgroundColor: "bg-emerald-100",
        textColor: "text-emerald-700",
      },
      {
        title: "Fun",
        percentage: Math.round(data.fun.percentage),
        count: data.fun.count,
        users: data.fun.users,
        description: "Casual interactions",
        icon: <Heart className="w-5 h-5" />,
        backgroundColor: "bg-violet-100",
        textColor: "text-violet-700",
      },
      {
        title: "Unknown",
        percentage: Math.round(data.unknown.percentage),
        count: data.unknown.count,
        users: data.unknown.users,
        description: "Unclear logs",
        icon: <HelpCircle className="w-5 h-5" />,
        backgroundColor: "bg-orange-100",
        textColor: "text-orange-700",
      },
    ];
  };

  // Generate usage distribution data for progress bars
  const getUsageDistributionData = () => {
    if (!usageDistributionData) {
      return [
        {
          title: "Ask Anything",
          percentage: 0,
          color: "bg-blue-500",
          count: 0,
          users: 0,
        },
        {
          title: "Learning Journey",
          percentage: 0,
          color: "bg-green-500",
          count: 0,
          users: 0,
        },
      ];
    }

    const { data } = usageDistributionData;
    return [
      {
        title: "Ask Anything",
        percentage: Math.round(data.ask_anything.percentage),
        color: "bg-blue-500",
        count: data.ask_anything.log_count,
        users: data.ask_anything.users,
      },
      {
        title: "Learning Journey",
        percentage: Math.round(data.learning_journey.percentage),
        color: "bg-green-500",
        count: data.learning_journey.log_count,
        users: data.learning_journey.users,
      },
    ];
  };

  // Helper untuk progress bar horizontal sederhana
  const ProgressBar = ({
    percentage,
    color,
  }: {
    percentage: number;
    color: string;
  }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  const engagementSummary = getEngagementSummary();
  const usageDistribution = getUsageDistributionData();

  return (
    <div className="text-black dark:text-white-dark">
      {/* Header Utama - Simplified */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Engagement Data</h1>
          {!loading && lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchLearningContext();
              fetchTopLogUsers(selectedLogCategory);
              fetchTopLessonUsers();
              fetchPopularContent();
              fetchUsageDistribution();
            }}
            disabled={
              loading ||
              topLogUsersLoading ||
              topLessonUsersLoading ||
              popularContentLoading ||
              usageDistributionLoading
            }
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ||
            topLogUsersLoading ||
            topLessonUsersLoading ||
            popularContentLoading ||
            usageDistributionLoading
              ? "..."
              : "↻"}
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      <ActiveFilters className="mt-4 mb-4" />

      {/* 3 Kartu Ringkasan Atas - Updated with API data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {loading
          ? // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="panel bg-gray-100 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center mt-3">
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center font-semibold mt-3">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          : engagementSummary.map((item, index) => (
              <div key={index} className={`panel ${item.backgroundColor}`}>
                <div className="flex justify-between">
                  <div className="ltr:mr-1 rtl:ml-1 text-lg font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </div>
                  {React.cloneElement(item.icon, {
                    className: `${item.icon.props.className} ${item.textColor}`,
                  })}
                </div>
                <div className="flex items-center mt-3">
                  <div
                    className={`text-3xl font-bold ltr:mr-3 rtl:ml-3 ${item.textColor}`}
                  >
                    {item.percentage}%
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <div className="flex items-center font-semibold text-gray-700 dark:text-gray-400">
                    {item.description}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-500 mt-1">
                    <span>{item.count.toLocaleString()} logs</span>
                    <span>{item.users.toLocaleString()} users</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Summary Stats */}
      {/* {!loading && learningContextData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="panel bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {learningContextData.metadata.total_logs.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Conversation Logs
                </div>
              </div>
            </div>
          </div>
          <div className="panel bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {learningContextData.metadata.total_users.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Total Active Users
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Top Log Users & Top Lesson Users - WITH SCROLLABLE CONTAINERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Log Users - Updated with API data and scrollable */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg py-1 font-semibold text-gray-800 dark:text-white">
                Top Log Users
              </h2>
              {topLogUsersData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Category: {topLogUsersData.data.category_filter} •{" "}
                  {topLogUsersData.data.total_users} users
                </p>
              )}
            </div>
            <div className="relative">
              <div className="flex justify-end">
                <FilterButton
                  isOpen={isLearningFilter}
                  onClick={() => setIsLearningFilterOpen((prev) => !prev)}
                />
              </div>

              {isLearningFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800">
                  <div className="py-1">
                    <button
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 ${
                        selectedLogCategory === "ALL"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => handleLogCategoryFilter("ALL")}
                    >
                      All Categories
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 ${
                        selectedLogCategory === "LEARNING"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => handleLogCategoryFilter("LEARNING")}
                    >
                      Learning
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 ${
                        selectedLogCategory === "FUN"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => handleLogCategoryFilter("FUN")}
                    >
                      Fun
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 ${
                        selectedLogCategory === "UNKNOWN"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => handleLogCategoryFilter("UNKNOWN")}
                    >
                      Unknown
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Log Users List - SCROLLABLE CONTAINER */}
          <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
            {topLogUsersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-100 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 w-32 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : topLogUsersData && topLogUsersData.data.users.length > 0 ? (
              <ul className="space-y-4">
                {topLogUsersData.data.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
                    onClick={() => console.log("Clicked user:", user.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white">
                        {user.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {user.name}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelBadgeColor(
                              user.level
                            )}`}
                          >
                            {user.level}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-48">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-base font-semibold text-green-600 dark:text-green-400">
                      {user.log_count.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No top log users found</p>
                <p className="text-sm mt-2">Category: {selectedLogCategory}</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Lesson Users - Updated with API data and scrollable */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg py-1 font-semibold text-gray-800 dark:text-white">
                Top Lesson Users
              </h2>
              {topLessonUsersData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total activities • {topLessonUsersData.data.total_users} users
                </p>
              )}
            </div>
          </div>

          {/* Top Lesson Users List - SCROLLABLE CONTAINER */}
          <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
            {topLogUsersLoading && topLessonUsersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-100 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 w-32 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : topLessonUsersData &&
              topLessonUsersData.data.users.length > 0 ? (
              <ul className="space-y-4">
                {topLessonUsersData.data.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
                    onClick={() =>
                      console.log("Clicked lesson user:", user.name)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white">
                        {user.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {user.name}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelBadgeColor(
                              user.level
                            )}`}
                          >
                            {user.level}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-48">
                          {user.email}
                        </div>
                        {/* <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Vocab: {user.vocab_activities} • Grammar:{" "}
                          {user.grammar_activities}
                        </div> */}
                      </div>
                    </div>
                    <span className="text-base font-semibold text-green-600 dark:text-green-400">
                      {user.total_activities.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No top lesson users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Content & Content Usage Distribution - Updated with API data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Content - Updated with API data */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Popular Content
              </h2>
              {popularContentData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {popularContentData.data.total_content} content items
                </p>
              )}
            </div>
          </div>

          {/* Popular Content List */}
          {popularContentLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : popularContentData &&
            popularContentData.data.content.length > 0 ? (
            <ul className="space-y-4">
              {popularContentData.data.content.map((content) => (
                <li
                  key={content.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded transition"
                  onClick={() => console.log("Clicked content:", content.title)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                      {content.rank}
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {content.title}
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {content.views.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No popular content found</p>
            </div>
          )}
        </div>

        {/* Content Usage Distribution - Updated with API data */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Content Usage Distribution
              </h2>
              {usageDistributionData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {usageDistributionData.metadata.total_logs.toLocaleString()}{" "}
                  total logs •{" "}
                  {usageDistributionData.metadata.total_users.toLocaleString()}{" "}
                  users
                </p>
              )}
            </div>
          </div>

          {/* Usage Distribution List */}
          {usageDistributionLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="h-full bg-gray-300 rounded-full w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : usageDistribution.length > 0 ? (
            <ul className="space-y-4">
              {usageDistribution.map((item, index) => (
                <li key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 dark:text-gray-200">
                      {item.title}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.percentage}%
                    </span>
                  </div>
                  <ProgressBar
                    percentage={item.percentage}
                    color={item.color}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{item.count.toLocaleString()} logs</span>
                    <span>{item.users.toLocaleString()} users</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No usage distribution data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementData;
