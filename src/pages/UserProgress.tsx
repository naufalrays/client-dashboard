import { useState, useEffect } from "react";
import { Search, Download, TrendingUp } from "lucide-react"; // Menggunakan ikon Lucide React
// import Dropdown from "../components/Dropdown"; // Asumsi Anda punya komponen Dropdown ini

// --- Dummy Data ---
// Data untuk Avatars (Anda bisa menggantinya dengan URL gambar asli)
const avatarUrls = {
  sarah: "https://i.pravatar.cc/300",
  michael: "https://i.pravatar.cc/300",
  emma: "https://i.pravatar.cc/300",
  david: "https://i.pravatar.cc/300",
  lisa: "https://i.pravatar.cc/300",
};

// Data untuk tabel
const learnersData = [
  {
    id: 1,
    avatar: avatarUrls.sarah,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    level: "B2",
    referral: "SMKMITRA",
    logs: 690,
    curriculumProgress: 85,
    vocabularyProgress: 78,
    grammarProgress: 92,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    avatar: avatarUrls.michael,
    name: "Michael Rodriguez",
    email: "m.rodriguez@email.com",
    level: "A2",
    referral: "SMKMITRA",
    logs: 658,
    curriculumProgress: 64,
    vocabularyProgress: 71,
    grammarProgress: 58,
    lastActivity: "5 hours ago",
  },
  {
    id: 3,
    avatar: avatarUrls.emma,
    name: "Emma Thompson",
    email: "emma.t@email.com",
    level: "A1",
    referral: "01BEKASI",
    logs: 587,
    curriculumProgress: 32,
    vocabularyProgress: 45,
    grammarProgress: 28,
    lastActivity: "1 day ago",
  },
  {
    id: 4,
    avatar: avatarUrls.david,
    name: "David Kim",
    email: "david.kim@email.com",
    level: "B1",
    referral: "ANANDA",
    logs: 570,
    curriculumProgress: 91,
    vocabularyProgress: 89,
    grammarProgress: 87,
    lastActivity: "30 minutes ago",
  },
  {
    id: 5,
    avatar: avatarUrls.lisa,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    level: "A2",
    referral: "1CIKBAR",
    logs: 478,
    curriculumProgress: 56,
    vocabularyProgress: 68,
    grammarProgress: 75,
    lastActivity: "1 hour ago",
  },
];

const UserProgress = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLearners, setFilteredLearners] = useState(learnersData);

  useEffect(() => {
    setFilteredLearners(
      learnersData.filter(
        (learner) =>
          learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          learner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          learner.referral.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Helper untuk mendapatkan warna progress bar
  const getProgressBarColor = (progress: number) => {
    if (progress > 80) return "bg-green-500";
    if (progress > 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  // Helper untuk mendapatkan warna badge level
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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
    }
  };

  return (
    <div className="text-black dark:text-white-dark">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Users' Progress</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search learners..."
              className="form-input ltr:pl-10 rtl:pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="panel flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-3xl font-bold">89</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Active Today
            </div>
          </div>
        </div>
        <div className="badge bg-green-500/30 text-green-500">+8%</div>
      </div>

      {/* Learner Table */}
      <div className="panel overflow-x-auto">
        <table className="table-auto w-full whitespace-nowrap">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-semibold">LEARNER</th>
              <th className="p-4 font-semibold">LEVEL</th>
              <th className="p-4 font-semibold">REFERRAL</th>
              <th className="p-4 font-semibold">LOGS</th>
              <th className="p-4 font-semibold">CURRICULUM</th>
              <th className="p-4 font-semibold">VOCABULARY</th>
              <th className="p-4 font-semibold">GRAMMAR</th>
              <th className="p-4 font-semibold">LAST ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {filteredLearners.map((learner) => (
              <tr
                key={learner.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={learner.avatar}
                      alt={learner.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {learner.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {learner.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelBadgeColor(
                      learner.level
                    )}`}
                  >
                    {learner.level}
                  </span>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-200">
                  {learner.referral}
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-200">
                  {learner.logs}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getProgressBarColor(
                          learner.curriculumProgress
                        )}`}
                        style={{ width: `${learner.curriculumProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {learner.curriculumProgress}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getProgressBarColor(
                          learner.vocabularyProgress
                        )}`}
                        style={{ width: `${learner.vocabularyProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {learner.vocabularyProgress}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getProgressBarColor(
                          learner.grammarProgress
                        )}`}
                        style={{ width: `${learner.grammarProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {learner.grammarProgress}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-200">
                  {learner.lastActivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProgress;
