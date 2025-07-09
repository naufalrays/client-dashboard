import React, { useState } from "react";
import {
  GraduationCap, // Untuk Learning
  Heart, // Untuk Fun
  HelpCircle, // Untuk Unknown
  ClipboardCheck, // Untuk Assessment Test
  Edit3, // Untuk Write Your Email
  Trophy, // Untuk Football (atau icon lain yang cocok)
  Plane, // Untuk Travel (atau icon lain yang cocok)
} from "lucide-react";
import { FilterButton } from "../components/Filter/FilterButton";
import { CreateGroupModal } from "../components/Filter/CreateGroupModal";
import { PeriodFilterModal } from "../components/Filter/PeriodFilterModal";
import { GroupFilterModal } from "../components/Filter/GroupFIlterModal";

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
    name: "Sarah",
    email: "sarahj@email.com",
    count: 342,
  },
  {
    name: "Samuel Johnson",
    email: "samuel.johnson@email.com",
    count: 298,
  },
  {
    name: "Tania Putri",
    email: "tania.putri@email.com",
    count: 276,
  },
];

const topLessonUsers = [
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Asep Rahmat",
    email: "asep.rahmat@email.com",
    count: 89,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Budi Wibowo",
    email: "budi.wibowo@email.com",
    count: 76,
  },
  {
    avatar: "https://i.pravatar.cc/300",
    name: "Putri Sari",
    email: "putri.sari@email.com",
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

// Data untuk Content Usage Distribution (tetap sama)
const contentUsage = [
  { title: "Ask Anything", percentage: 50, color: "bg-blue-500" },
  // { title: "Open-ended queries", percentage: 100, color: "bg-green-500" },
  { title: "Learning Journey", percentage: 50, color: "bg-green-500" },
  // { title: "Structured lessons", percentage: 100, color: "bg-green-500" },
];

const EngagementData = () => {
  // Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Filter
  const [isLearningFilter, setIsLearningFilterOpen] = useState(false);
  // Group Filter Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  // Period Filter Modal
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<Date[]>([]);

  // Create Group Modal
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  // Create Group Modal States
  const [groupName, setGroupName] = useState("");
  const [searchTermCreateGroup, setSearchTermCreateGroup] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Filter users based on search term
  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTermCreateGroup.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTermCreateGroup.toLowerCase())
  );

  const handleGroup = () => {
    setIsGroupModalOpen(true);
    setIsFilterOpen(false);
  };
  const handlePeriodTime = () => {
    setIsPeriodModalOpen(true);
    setIsFilterOpen(false);
  };
  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
    setIsFilterOpen(false);
  };

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
    console.log("Selected groups:", selectedGroups);
    setIsGroupModalOpen(false);
    setIsFilterOpen(false);
  };

  const handleApplyPeriodFilter = () => {
    console.log("Selected date range:", { dateRange });
    setIsPeriodModalOpen(false);
    setIsFilterOpen(false);
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
    setSearchTermCreateGroup("");
    setCurrentPage(1);
    setIsCreateGroupModalOpen(false);

    alert("Group created successfully!");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
      {/* <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Engagement Data
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Are my learners actively using the platform?
        </p>
      </div> */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Engagement Data</h1>
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
                    onClick={handleGroup}
                  >
                    Group
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    onClick={handlePeriodTime}
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

      {/* 3 Kartu Ringkasan Atas - Diubah sesuai permintaan */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Top Log Users
            </h2>
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
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsLearningFilterOpen(false);
                      }}
                    >
                      Learning
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsLearningFilterOpen(false);
                      }}
                    >
                      Fun
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      onClick={() => {
                        setIsLearningFilterOpen(false);
                      }}
                    >
                      Unknown
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-4">
            {topLogUsers.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
                onClick={() => console.log("Clicked:", user.name)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center  text-xl font-bold text-gray-700 dark:text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <span className="text-base font-semibold text-green-600 dark:text-green-400">
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
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
                onClick={() => console.log("Clicked:", user.name)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <span className="text-base font-semibold text-green-600 dark:text-green-400">
                  {user.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
        searchTerm={searchTermCreateGroup}
        onSearchTermChange={setSearchTermCreateGroup}
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
