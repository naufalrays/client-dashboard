import { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FilterButton } from "../components/Filter/FilterButton";
import { GroupFilterModal } from "../components/Filter/GroupFIlterModal";
import { PeriodFilterModal } from "../components/Filter/PeriodFilterModal";
import { CreateGroupModal } from "../components/Filter/CreateGroupModal";

// --- Dummy Data ---
const learnersData = [
  {
    id: 1,
    name: "Sarah",
    email: "sarah@email.com",
    level: "B2",
    referral: "SMKN",
    logs: 690,
    curriculumProgress: 85,
    vocabularyProgress: 78,
    grammarProgress: 92,
    lastActivity: "2 hours ago",
    group: ["XII IPA 1", "English Club"],
    subscription: "Premium Month",
    content: "Learning",
  },
  {
    id: 2,
    name: "Abdul Purnomo",
    email: "abdulpurnomo@email.com",
    level: "A2",
    referral: "SMKN",
    logs: 658,
    curriculumProgress: 64,
    vocabularyProgress: 71,
    grammarProgress: 58,
    lastActivity: "5 hours ago",
    group: [],
    subscription: "Regular-2",
    content: "Fun",
  },
  {
    id: 3,
    name: "Amanda Putri",
    email: "amandaputri@email.com",
    level: "A1",
    referral: "SMKN",
    logs: 587,
    curriculumProgress: 32,
    vocabularyProgress: 45,
    grammarProgress: 28,
    lastActivity: "1 day ago",
    group: ["Remedial"],
    subscription: "Regular-2",
    content: "Unknown",
  },
  {
    id: 4,
    name: "Tania Putri",
    email: "taniaputri@email.com",
    level: "B1",
    referral: "SMKN",
    logs: 570,
    curriculumProgress: 91,
    vocabularyProgress: 89,
    grammarProgress: 87,
    lastActivity: "30 minutes ago",
    group: ["XII IPA 2"],
    subscription: "Regular",
    content: "Learning",
  },
  {
    id: 5,
    name: "Lisa",
    email: "lisa@email.com",
    level: "A2",
    referral: "SMKN",
    logs: 478,
    curriculumProgress: 56,
    vocabularyProgress: 68,
    grammarProgress: 75,
    lastActivity: "1 hour ago",
    group: [],
    subscription: "Regular-1",
    content: "Fun",
  },
  // Adding more dummy data for pagination demonstration
  {
    id: 6,
    name: "Marsel",
    email: "marsel@email.com",
    level: "B1",
    referral: "SMKN",
    logs: 445,
    curriculumProgress: 72,
    vocabularyProgress: 65,
    grammarProgress: 80,
    lastActivity: "3 hours ago",
    group: ["XII IPA 1"],
    subscription: "Premium Month",
    content: "Learning",
  },
  {
    id: 7,
    name: "Anna",
    email: "anna@email.com",
    level: "A1",
    referral: "SMKN",
    logs: 321,
    curriculumProgress: 25,
    vocabularyProgress: 30,
    grammarProgress: 18,
    lastActivity: "2 days ago",
    group: ["Remedial"],
    subscription: "Regular-1",
    content: "Unknown",
  },
  {
    id: 8,
    name: "Adhitya Pratama",
    email: "adhitya.pratama@email.com",
    level: "B2",
    referral: "SMKN",
    logs: 756,
    curriculumProgress: 88,
    vocabularyProgress: 92,
    grammarProgress: 85,
    lastActivity: "1 hour ago",
    group: ["XII IPA 2", "English Club"],
    subscription: "Premium Month",
    content: "Learning",
  },
  {
    id: 9,
    name: "Putri",
    email: "putri@email.com",
    level: "A2",
    referral: "SMKN",
    logs: 512,
    curriculumProgress: 58,
    vocabularyProgress: 63,
    grammarProgress: 55,
    lastActivity: "4 hours ago",
    group: [],
    subscription: "Regular-1",
    content: "Fun",
  },
  {
    id: 10,
    name: "Asep Sunandar",
    email: "asep.sunandar@email.com",
    level: "B1",
    referral: "SMKN",
    logs: 634,
    curriculumProgress: 75,
    vocabularyProgress: 82,
    grammarProgress: 70,
    lastActivity: "6 hours ago",
    group: ["XII IPA 1"],
    subscription: "Regular",
    content: "Learning",
  },
  {
    id: 11,
    name: "Agus Salim",
    email: "agus.salim@email.com",
    level: "A1",
    referral: "SMKN",
    logs: 289,
    curriculumProgress: 15,
    vocabularyProgress: 22,
    grammarProgress: 12,
    lastActivity: "1 day ago",
    group: ["Remedial"],
    subscription: "Regular-2",
    content: "Unknown",
  },
  {
    id: 12,
    name: "Tommy",
    email: "tommy@email.com",
    level: "B2",
    referral: "SMKN",
    logs: 823,
    curriculumProgress: 95,
    vocabularyProgress: 88,
    grammarProgress: 91,
    lastActivity: "30 minutes ago",
    group: ["XII IPA 2", "English Club"],
    subscription: "Premium Month",
    content: "Learning",
  },
];

// Sample users data
const sampleUsers = [
  {
    id: 1,
    name: "Putri Sari",
    email: "putri.sari@example.com",
    level: "A1",
    referral: "REF001",
  },
  {
    id: 2,
    name: "Agus Salim",
    email: "agus.salim@example.com",
    level: "A2",
    referral: "REF002",
  },
  {
    id: 3,
    name: "Amanda Grace",
    email: "amanda.grace@example.com",
    level: "B1",
    referral: "REF003",
  },
  {
    id: 4,
    name: "Brian Hanif",
    email: "brian.hanif@example.com",
    level: "B2",
    referral: "REF004",
  },
  {
    id: 5,
    name: "Asep Rizky",
    email: "asep.rizky@example.com",
    level: "C1",
    referral: "REF005",
  },
  {
    id: 6,
    name: "Ahmad Firdaus",
    email: "ahmad.firdaus@example.com",
    level: "A1",
    referral: "REF006",
  },
  {
    id: 7,
    name: "Budi Supriyanto",
    email: "budi.supriyanto@example.com",
    level: "A2",
    referral: "REF007",
  },
  {
    id: 8,
    name: "Larasati",
    email: "larasati@example.com",
    level: "B1",
    referral: "REF008",
  },
  {
    id: 9,
    name: "Hendra Pratama",
    email: "hendra.pratama@example.com",
    level: "B2",
    referral: "REF009",
  },
  {
    id: 10,
    name: "Johan Henry",
    email: "johan.henry@example.com",
    level: "C1",
    referral: "REF010",
  },
  {
    id: 11,
    name: "Jorgy amat",
    email: "jorgy.amat@example.com",
    level: "A1",
    referral: "REF011",
  },
  {
    id: 12,
    name: "Gilang Sulistio",
    email: "gilang.sulistio@example.com",
    level: "A2",
    referral: "REF012",
  },
  {
    id: 13,
    name: "Salsabila Putri",
    email: "salsabila.putri@example.com",
    level: "B1",
    referral: "REF013",
  },
  {
    id: 14,
    name: "James Leo Rodriguez",
    email: "leo.rodriguez@example.com",
    level: "B2",
    referral: "REF014",
  },
  {
    id: 15,
    name: "Maya Elizabeth Patel",
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

const UserProgress = () => {
  // Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Pagination for learners table
  const [learnerCurrentPage, setLearnerCurrentPage] = useState(1);
  const [learnersPerPage] = useState(5);

  // Search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLearners, setFilteredLearners] = useState(learnersData);

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

  // Pagination logic for learners
  const handleLearnerPageChange = (page: number) => {
    setLearnerCurrentPage(page);
  };

  // Pagination logic for create group modal
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination logic for learners table
  const indexOfLastLearner = learnerCurrentPage * learnersPerPage;
  const indexOfFirstLearner = indexOfLastLearner - learnersPerPage;
  const currentLearners = filteredLearners.slice(
    indexOfFirstLearner,
    indexOfLastLearner
  );
  const totalLearnerPages = Math.ceil(
    filteredLearners.length / learnersPerPage
  );

  useEffect(() => {
    const filtered = learnersData.filter(
      (learner) =>
        learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.referral.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLearners(filtered);
    setLearnerCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  const getProgressBarColor = (progress: number) => {
    if (progress > 80) return "bg-green-500";
    if (progress > 50) return "bg-blue-500";
    return "bg-orange-500";
  };

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

  const getSprinkle = (subscription: string) => {
    const lower = subscription.toLowerCase();
    if (lower.startsWith("premium")) {
      return <Sparkles className="w-4 h-4 text-yellow-400 ml-1" />;
    }
    if (lower.startsWith("regular-")) {
      return <Sparkles className="w-4 h-4 text-gray-400 ml-1" />;
    }
    return null;
  };

  const getContentBadgeColor = (content: string) => {
    switch (content.toLowerCase()) {
      case "learning":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "fun":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "unknown":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };

  // Pagination component
  const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
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

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstLearner + 1} to{" "}
          {Math.min(indexOfLastLearner, filteredLearners.length)} of{" "}
          {filteredLearners.length} entries
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black dark:text-white-dark">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Users Progress</h1>
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

      {/* Summary Card */}
      <div className="panel flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold">89</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Active Today
            </div>
          </div>
        </div>
      </div>

      {/* Learner Table */}
      <div className="panel overflow-x-auto">
        <table className="table-auto w-full whitespace-nowrap">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-semibold">LEARNER</th>
              <th className="p-4 font-semibold">GROUP</th>
              <th className="p-4 font-semibold">SUBSCRIPTION</th>
              <th className="p-4 font-semibold">LEVEL</th>
              <th className="p-4 font-semibold">REFERRAL</th>
              <th className="p-4 font-semibold">LOGS</th>
              <th className="p-4 font-semibold">CONTENT</th>
              <th className="p-4 font-semibold">CURRICULUM</th>
              <th className="p-4 font-semibold">VOCABULARY</th>
              <th className="p-4 font-semibold">GRAMMAR</th>
              <th className="p-4 font-semibold">LAST ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {currentLearners.map((learner) => (
              <tr
                key={learner.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white flex items-center">
                        {learner.name}
                        {getSprinkle(learner.subscription)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {learner.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-200">
                  {learner.group.length > 0 ? learner.group.join(", ") : "-"}
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-200">
                  <span className="flex items-center">
                    {learner.subscription}
                  </span>
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
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getContentBadgeColor(
                      learner.content
                    )}`}
                  >
                    {learner.content}
                  </span>
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

        {/* Pagination */}
        <PaginationComponent
          currentPage={learnerCurrentPage}
          totalPages={totalLearnerPages}
          onPageChange={handleLearnerPageChange}
        />
      </div>
    </div>
  );
};

export default UserProgress;
