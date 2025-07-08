import {
  UserCheck,
  ChartLine,
  Clock3,
  MessagesSquare, // Renamed from MessageSquare for consistency in import list
  CheckCircle,
  PlusCircle,
  BookOpen,
  MessageSquare, // Kept this for activity data, ensure you only use one for consistency
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const topPerformers = [
  { name: "Sarah Chen", points: 2847, position: 1 },
  { name: "Mike Johnson", points: 2534, position: 2 },
  { name: "Emma Wilson", points: 2291, position: 3 },
  { name: "David Brown", points: 2156, position: 4 },
  { name: "Lisa Garcia", points: 1987, position: 5 },
];

const progressData = [
  { week: "Week 1", completion: 25 },
  { week: "Week 2", completion: 50 },
  { week: "Week 3", completion: 65 },
  { week: "Week 4", completion: 80 },
];

// Dummy data for example purposes.
// In a real application, you'd fetch this from your state or an API.
const activities = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    text: 'Completed "Introduction to JavaScript" course.',
    time: "2 hours ago",
    color: "bg-green-50 dark:bg-green-900/20", // Light green background, darker green in dark mode
  },
  {
    icon: <PlusCircle className="w-5 h-5 text-blue-500" />,
    text: 'Enrolled in "Advanced React Patterns" module.',
    time: "Yesterday",
    color: "bg-blue-50 dark:bg-blue-900/20", // Light blue background, darker blue in dark mode
  },
  {
    icon: <BookOpen className="w-5 h-5 text-purple-500" />,
    text: 'Started "Data Structures & Algorithms" lesson.',
    time: "2 days ago",
    color: "bg-purple-50 dark:bg-purple-900/20", // Light purple background, darker purple in dark mode
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-orange-500" />,
    text: 'Replied to a query in "Community Forum".',
    time: "3 days ago",
    color: "bg-orange-50 dark:bg-orange-900/20", // Light orange background, darker orange in dark mode
  },
];

const Dashboard = () => {
  return (
    <div>
      {/* Top Cards (Active Users, Average Progress, Total Learning Hours, Conversation Logs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-black dark:text-white-dark">
        {/* Active Users Card */}
        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 mb-2">
                <UserCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-md font-semibold">Active Users</div>
            </div>
            <div className="badge bg-green-500/30 text-green-500">+ 2.35%</div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 12,345 </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Last Month 11,900
          </div>
        </div>

        {/* Average Progress Card */}
        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800 mb-2">
                <ChartLine className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-md font-semibold">Average Progress</div>
            </div>
            <div className="badge bg-green-500/30 text-green-500">+ 1.8%</div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 78.5% </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Last Month 76.7%
          </div>
        </div>

        {/* Total Learning Hours Card */}
        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-800 mb-2">
                <Clock3 className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-md font-semibold">Total Learning Hours</div>
            </div>
            <div className="badge bg-red-500/30 text-red-500">- 0.5%</div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 5,678 </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Last Month 5,705
          </div>
        </div>

        {/* Conversation Logs Card */}
        <div className="panel">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg border border-orange-200 dark:border-orange-800 mb-2">
                <MessagesSquare className="w-6 h-6 text-orange-500" />{" "}
                {/* Using MessagesSquare */}
              </div>
              <div className="text-md font-semibold">Conversation Logs</div>
            </div>
            <div className="badge bg-green-500/30 text-green-500">+ 3.1%</div>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 9,876 </div>
          </div>
          <div className="flex items-center font-semibold mt-1">
            Last Month 9,578
          </div>
        </div>
      </div>

      {/* Top Performers and Progress Overview - This section remains as a two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {" "}
        {/* Added mb-6 for spacing below this grid */}
        {/* Top Performers */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Performers
          </h2>
          <ul className="space-y-3">
            {topPerformers.map((user, index) => (
              <li
                key={user.name}
                className={`flex items-center justify-between p-3 rounded-md ${
                  index === 0
                    ? "bg-yellow-50 border border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
                    : "bg-gray-50 dark:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    {user.position}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100">
                    {user.name}
                  </span>
                </div>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {user.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Progress Overview */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Progress Overview
          </h2>
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
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity - Now full screen */}
      <div className="panel">
        {" "}
        {/* This panel now stands alone for full width */}
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
    </div>
  );
};

export default Dashboard;
