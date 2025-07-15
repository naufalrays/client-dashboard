import React, { useState, useEffect } from "react";
import "flatpickr/dist/flatpickr.css";

import {
  UserCheck,
  Clock3,
  MessagesSquare,
  CheckCircle,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FilterButton } from "../components/Filter/FilterButton";
import { GroupFilterModal } from "../components/Filter/GroupFIlterModal";
import { PeriodFilterModal } from "../components/Filter/PeriodFilterModal";
import { CreateGroupModal } from "../components/Filter/CreateGroupModal";
import {
  dashboardService,
  type DashboardOverviewResponse,
} from "../services/dashboardService";
import { toast } from "react-toastify";

const topPerformers = [
  {
    name: "Sarah",
    email: "sarah@email.com",
    points: 100,
    referral: "SMKN",
    level: "A1",
    position: 1,
  },
  {
    name: "Agus Salim",
    email: "agus.salim@email.com",
    points: 95,
    referral: "SMKN",
    level: "B2",
    position: 2,
  },
  {
    name: "Amanda Putri",
    email: "amandaputri@email.com",
    points: 90,
    referral: "SMKN",
    level: "B1",
    position: 3,
  },
  {
    name: "Asep David",
    email: "asep.david@email.com",
    points: 80,
    referral: "SMKN",
    level: "A2",
    position: 4,
  },
  {
    name: "Lisa",
    email: "lisa@email.com",
    points: 75,
    referral: "SMKN",
    level: "A1",
    position: 5,
  },
];

const progressData = [
  { week: "Week 1", totalLog: 25 },
  { week: "Week 2", totalLog: 50 },
  { week: "Week 3", totalLog: 65 },
  { week: "Week 4", totalLog: 80 },
];

const activities = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    text: "Siska Berhasil menyelesaikan Assessment Test",
    time: "2 hours ago",
    color: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
    text: "John Berhasil menyelesaikan Vocab Lesson 006",
    time: "Yesterday",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  // {
  //   icon: <PlusCircle className="w-5 h-5 text-blue-500" />,
  //   text: 'Enrolled in "Advanced React Patterns" module.',
  //   time: "Yesterday",
  //   color: "bg-blue-50 dark:bg-blue-900/20",
  // },
  // {
  //   icon: <BookOpen className="w-5 h-5 text-purple-500" />,
  //   text: 'Started "Data Structures & Algorithms" lesson.',
  //   time: "2 days ago",
  //   color: "bg-purple-50 dark:bg-purple-900/20",
  // },
  // {
  //   icon: <MessageSquare className="w-5 h-5 text-orange-500" />,
  //   text: 'Replied to a query in "Community Forum".',
  //   time: "3 days ago",
  //   color: "bg-orange-50 dark:bg-orange-900/20",
  // },
];

const schoolGroups = [
  { id: "all", name: "Select All" },
  { id: "smk1", name: "SMKN" },
  { id: "smk2", name: "SMKN" },
  { id: "smk3", name: "SMKN" },
  { id: "smk4", name: "SMKN" },
  { id: "smk5", name: "SMKN" },
  { id: "smk6", name: "SMKN" },
  { id: "smk7", name: "SMKN" },
  { id: "smk8", name: "SMKN" },
  { id: "smk9", name: "SMKN" },
  { id: "smk10", name: "SMKN" },
];

// Sample users data
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    level: "A1",
    referral: "REF001",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    level: "A2",
    referral: "REF002",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    level: "B1",
    referral: "REF003",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@example.com",
    level: "B2",
    referral: "REF004",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    level: "C1",
    referral: "REF005",
  },
  {
    id: 6,
    name: "Diana Davis",
    email: "diana.davis@example.com",
    level: "A1",
    referral: "REF006",
  },
  {
    id: 7,
    name: "Eva Miller",
    email: "eva.miller@example.com",
    level: "A2",
    referral: "REF007",
  },
  {
    id: 8,
    name: "Frank Garcia",
    email: "frank.garcia@example.com",
    level: "B1",
    referral: "REF008",
  },
  {
    id: 9,
    name: "Grace Lee",
    email: "grace.lee@example.com",
    level: "B2",
    referral: "REF009",
  },
  {
    id: 10,
    name: "Henry Martinez",
    email: "henry.martinez@example.com",
    level: "C1",
    referral: "REF010",
  },
  {
    id: 11,
    name: "Ivy Thompson",
    email: "ivy.thompson@example.com",
    level: "A1",
    referral: "REF011",
  },
  {
    id: 12,
    name: "Jack Anderson",
    email: "jack.anderson@example.com",
    level: "A2",
    referral: "REF012",
  },
  {
    id: 13,
    name: "Kelly White",
    email: "kelly.white@example.com",
    level: "B1",
    referral: "REF013",
  },
  {
    id: 14,
    name: "Leo Rodriguez",
    email: "leo.rodriguez@example.com",
    level: "B2",
    referral: "REF014",
  },
  {
    id: 15,
    name: "Maya Patel",
    email: "maya.patel@example.com",
    level: "C1",
    referral: "REF015",
  },
];

const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Create Group Modal States
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Top Performers Filter
  const [isTopPerformanceFilter, setIsTopPerformanceFilterOpen] =
    useState(false);

  // Applied filters state
  const [appliedGroups, setAppliedGroups] = useState<string[]>([]);
  const [appliedDateRange, setAppliedDateRange] = useState<Date[]>([]);

  // API data state
  const [dashboardData, setDashboardData] = useState<
    DashboardOverviewResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
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

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter users based on search term
  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleGroupSelection = (groupId: string) => {
    if (groupId === "all") {
      if (selectedGroups.length === schoolGroups.length - 1) {
        setSelectedGroups([]);
      } else {
        setSelectedGroups(schoolGroups.slice(1).map((group) => group.id));
      }
    } else {
      setSelectedGroups((prev) => {
        if (prev.includes(groupId)) {
          return prev.filter((id) => id !== groupId);
        } else {
          return [...prev, groupId];
        }
      });
    }
  };

  const handleApplyGroupFilter = () => {
    setAppliedGroups(selectedGroups); // Pindahkan ke applied state saat user klik Apply
    setIsGroupModalOpen(false);
    setIsFilterOpen(false);
  };

  const handleApplyPeriodFilter = () => {
    setAppliedDateRange(dateRange); // Pindahkan ke applied state saat user klik Apply
    setIsPeriodModalOpen(false);
    setIsFilterOpen(false);
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
    setIsFilterOpen(false);
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle Excel file upload logic here
      console.log("Uploaded file:", file);
      // You would typically parse the Excel file here
      alert(
        "File uploaded successfully! (Implementation needed for Excel parsing)"
      );
    }
  };

  const handleCreateGroupSubmit = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    const selectedUsersData = sampleUsers.filter((user) =>
      selectedUsers.includes(user.id)
    );
    console.log("Creating group:", {
      name: groupName,
      users: selectedUsersData,
    });

    // Reset form
    setGroupName("");
    setSelectedUsers([]);
    setSearchTerm("");
    setCurrentPage(1);
    setIsCreateGroupModalOpen(false);

    alert("Group created successfully!");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tambahkan format helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle remove filter
  const handleRemoveGroup = (groupId: string) => {
    setAppliedGroups((prev) => prev.filter((id) => id !== groupId));
    setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  };

  const handleRemovePeriod = () => {
    setAppliedDateRange([]);
    setDateRange([]);
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
          <div className="relative">
            <div className="flex justify-end">
              <FilterButton
                isOpen={isFilterOpen}
                onClick={() => setIsFilterOpen((prev) => !prev)}
              />
            </div>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    onClick={() => {
                      setIsGroupModalOpen(true);
                      setIsFilterOpen(false);
                    }}
                  >
                    Group
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    onClick={() => {
                      setIsPeriodModalOpen(true);
                      setIsFilterOpen(false);
                    }}
                  >
                    Period Time
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    onClick={handleCreateGroup}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Info */}
      {/* {dashboardData?.metadata && (
        <div className="mt-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Period:</span>{" "}
            {dashboardData.metadata.period} •
            <span className="font-medium ml-2">Groups:</span>{" "}
            {dashboardData.metadata.groupsIncluded.join(", ")}
          </p>
        </div>
      )} */}

      {/* Active Filters */}
      {(appliedGroups.length > 0 || appliedDateRange.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {appliedGroups.map((groupId) => {
            const group = schoolGroups.find((g) => g.id === groupId);
            if (!group) return null;

            return (
              <span
                key={groupId}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              >
                {group.name}
                <button
                  onClick={() => handleRemoveGroup(groupId)}
                  className="hover:text-indigo-900 dark:hover:text-indigo-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {appliedDateRange.length === 2 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {`${formatDate(appliedDateRange[0])} - ${formatDate(
                appliedDateRange[1]
              )}`}
              <button
                onClick={handleRemovePeriod}
                className="hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Top Cards - Updated with API data */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-black dark:text-white-dark">
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
        <div className="panel">
          {/* <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Performers
          </h2> */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg py-1 font-semibold text-gray-800 dark:text-white">
              June Top Performers
            </h2>
            <div className="relative">
              <div className="flex justify-end">
                <FilterButton
                  isOpen={isTopPerformanceFilter}
                  onClick={() => setIsTopPerformanceFilterOpen((prev) => !prev)}
                />
              </div>

              {isTopPerformanceFilter && (
                <div className="absolute right-0 mt-2 w-18 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsTopPerformanceFilterOpen(false);
                      }}
                    >
                      A1
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsTopPerformanceFilterOpen(false);
                      }}
                    >
                      A2
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsTopPerformanceFilterOpen(false);
                      }}
                    >
                      B1
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsTopPerformanceFilterOpen(false);
                      }}
                    >
                      B2
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-3">
            {topPerformers.map((user) => (
              <li
                key={user.email}
                className="flex items-center justify-between p-4 rounded-md bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700"
              >
                {/* Kiri: No + Nama + Email + Level */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-bold">
                    {user.position}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {user.level}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Kanan: Persen + Referral + Trophy */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user.points}%
                    </p>
                    <p className="text-xs text-gray-800 dark:text-white">
                      {user.referral}
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="text-gray-800 dark:text-white mb-6">
            <h2 className="text-lg font-semibold">Progress Overview</h2>
            <h4 className="">Total weekly logs of all users</h4>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis
                  dataKey="week"
                  stroke="#888888"
                  className="text-xs dark:text-gray-300"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
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
                  formatter={(value, _) => [`${value}`, "Total Log"]}
                />
                <Line
                  type="monotone"
                  dataKey="totalLog"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="panel">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-3">
          {activities.map((activity, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-md ${activity.color}`}
            >
              <div className="mt-1">{activity.icon}</div>
              <div>
                <p className="text-gray-800 dark:text-gray-100">
                  {activity.text}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {activity.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Group Selection Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <GroupFilterModal
            open={isGroupModalOpen}
            onClose={() => setIsGroupModalOpen(false)}
            schoolGroups={schoolGroups}
            selectedGroups={selectedGroups}
            onChange={handleGroupSelection}
            onApply={handleApplyGroupFilter}
          />
        </div>
      )}

      {/* Period Selection Modal */}
      {isPeriodModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <PeriodFilterModal
            open={isPeriodModalOpen}
            onClose={() => setIsPeriodModalOpen(false)}
            dateRange={dateRange}
            onChange={(dates) => {
              if (dates.length === 2) setDateRange(dates);
            }}
            onApply={handleApplyPeriodFilter}
          />
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={handleCreateGroupSubmit}
        groupName={groupName}
        onGroupNameChange={setGroupName}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        handleFileUpload={handleFileUpload}
        currentUsers={currentUsers}
        selectedUsers={selectedUsers}
        handleUserSelection={handleUserSelection}
        handleSelectAllUsers={handleSelectAllUsers}
        indexOfFirstUser={indexOfFirstUser}
        indexOfLastUser={indexOfLastUser}
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
