import React from "react";
import {
  GraduationCap, // Untuk Learning
  Heart, // Untuk Fun
  HelpCircle, // Untuk Unknown
  ClipboardCheck, // Untuk Assessment Test
  Edit3, // Untuk Write Your Email
  Trophy, // Untuk Football (atau icon lain yang cocok)
  Plane, // Untuk Travel (atau icon lain yang cocok)
} from "lucide-react";

// --- Dummy Data ---

// Data untuk 3 kartu ringkasan atas (dengan latar belakang warna solid -100)
const engagementSummary = [
  {
    title: "Learning",
    percentage: 68,
    description: "Learning-related activity",
    icon: <GraduationCap className="w-5 h-5" />,
    // Ganti gradient menjadi backgroundColor
    backgroundColor: "bg-emerald-100", // Warna solid emerald-100
    textColor: "text-emerald-700", // Warna teks lebih lembut
  },
  {
    title: "Fun",
    percentage: 24,
    description: "Casual interactions",
    icon: <Heart className="w-5 h-5" />,
    // Ganti gradient menjadi backgroundColor
    backgroundColor: "bg-violet-100", // Warna solid violet-100
    textColor: "text-violet-700", // Warna teks lebih lembut
  },
  {
    title: "Unknown",
    percentage: 8,
    description: "Unclear logs",
    icon: <HelpCircle className="w-5 h-5" />,
    // Ganti gradient menjadi backgroundColor
    backgroundColor: "bg-orange-100", // Warna solid orange-100
    textColor: "text-orange-700", // Warna teks lebih lembut
  },
];

// Data untuk Top Log Users dan Top Lesson Users (tetap sama)
const topLogUsers = [
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Sarah Johnson",
    email: "sarahj@email.com",
    count: 342,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Mike Chen",
    email: "mikec@email.com",
    count: 298,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Emma Davis",
    email: "emmad@email.com",
    count: 276,
  },
];

const topLessonUsers = [
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Alex Rodriguez",
    email: "alexr@email.com",
    count: 89,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Lisa Wang",
    email: "lisaw@email.com",
    count: 76,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "David Kim",
    email: "davidk@email.com",
    count: 72,
  },
];

// Data untuk Popular Content (tetap sama)
const popularContent = [
  {
    icon: <ClipboardCheck className="w-5 h-5 text-blue-500" />,
    title: "Assessment Test",
    views: "1,247 views",
  },
  {
    icon: <Edit3 className="w-5 h-5 text-green-500" />,
    title: "Write Your Email",
    views: "982 views",
  },
  {
    icon: <Trophy className="w-5 h-5 text-orange-500" />,
    title: "Football",
    views: "756 views",
  },
  {
    icon: <Plane className="w-5 h-5 text-purple-500" />,
    title: "Travel",
    views: "689 views",
  },
];

// Data untuk Content Usage Distribution (tetap sama)
const contentUsage = [
  { title: "Ask Anything", percentage: 50, color: "bg-blue-500" },
  { title: "Open-ended queries", percentage: 100, color: "bg-green-500" },
  { title: "Learning Journey", percentage: 50, color: "bg-green-500" },
  { title: "Structured lessons", percentage: 100, color: "bg-green-500" },
];

const EngagementData = () => {
  // Helper untuk progress bar horizontal sederhana (tetap sama)
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

  return (
    <div className="text-black dark:text-white-dark">
      {/* Header Utama */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Engagement Data
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Are my learners actively using the platform?
        </p>
      </div>
      {/* 3 Kartu Ringkasan Atas - Diubah sesuai permintaan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {engagementSummary.map((item, index) => (
          <div
            key={index}
            // Menggunakan backgroundColor solid
            className={`panel ${item.backgroundColor}`}
          >
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
            <div className="flex items-center font-semibold mt-3 text-gray-700 dark:text-gray-400">
              {item.description}
            </div>
          </div>
        ))}
      </div>
      {/* Top Log Users & Top Lesson Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Log Users */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Log Users
          </h2>
          <ul className="space-y-4">
            {topLogUsers.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-500">
                  {user.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Lesson Users */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Lesson Users
          </h2>
          <ul className="space-y-4">
            {topLessonUsers.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-500">
                  {user.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Popular Content & Content Usage Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Content */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Popular Content
          </h2>
          <ul className="space-y-4">
            {popularContent.map((content, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {content.icon}
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {content.title}
                  </div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  {content.views}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Usage Distribution */}
        <div className="panel">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Content Usage Distribution
          </h2>
          <ul className="space-y-4">
            {contentUsage.map((item, index) => (
              <li key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-200">
                    {item.title}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.percentage}%
                  </span>
                </div>
                <ProgressBar percentage={item.percentage} color={item.color} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EngagementData;
