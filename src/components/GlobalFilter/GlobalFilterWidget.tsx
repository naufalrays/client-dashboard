import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { FilterButton } from "../Filter/FilterButton";
import { GroupFilterModal } from "../Filter/GroupFIlterModal";
import { PeriodFilterModal } from "../Filter/PeriodFilterModal";
import { CreateGroupModal } from "../Filter/CreateGroupModal";
import { useFilter } from "../../contexts/FilterContext";
import {
  groupsService,
  type AvailableUser,
  type Group,
} from "../../services/groupsService";
import { toast } from "react-toastify";

interface GlobalFilterWidgetProps {
  className?: string;
  showCreateGroup?: boolean;
  compact?: boolean;
}

export const GlobalFilterWidget: React.FC<GlobalFilterWidgetProps> = ({
  className = "",
  showCreateGroup = true,
  compact = false,
}) => {
  const { filters, applyGroupFilter, applyDateFilter } = useFilter();

  // API Data State
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);

  // Modal states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Local states for modals
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    filters.groups
  );
  const [dateRange, setDateRange] = useState<Date[]>(filters.dateRange);

  // Create Group Modal states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchTermCreateGroup, setSearchTermCreateGroup] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [importedEmails, setImportedEmails] = useState<string[]>([]);
  const [importedEmailList, setImportedEmailList] = useState<
    Array<{
      email: string;
      status: "pending" | "validating" | "valid" | "invalid";
      userId?: number;
    }>
  >([]);

  // Transform available users for CreateGroupModal
  const transformedCurrentUsers = useMemo(() => {
    return availableUsers.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User", // Handle null names
      email: user.email,
      level: undefined, // This endpoint doesn't provide level
      userReferral: user.userReferral ?? undefined,
    }));
  }, [availableUsers]);

  // Update search handler to reset page and refetch
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTermCreateGroup(term);
    setCurrentPage(1); // Reset to first page when searching
    // fetchAvailableUsers will be called by useEffect
  }, []);

  // Fetch groups from API
  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      const response = await groupsService.getGroups();
      setGroups(response.data);
    } catch (error: any) {
      console.error("Failed to fetch groups:", error);
      toast.error("Failed to load groups", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setGroupsLoading(false);
    }
  };

  // Update validateEmails to use the service and handle the correct response format
  const validateEmails = useCallback(async (emails: string[]) => {
    try {
      const response = await groupsService.validateEmails(emails);

      if (response.code === 200) {
        return response;
      } else {
        throw new Error(response.message || "Validation failed");
      }
    } catch (error: any) {
      console.error("Email validation error:", error);
      toast.error(`Email validation failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }, []);

  // Fetch available users with proper server-side pagination
  const fetchAvailableUsers = useCallback(
    async (page: number = 1, search: string = "") => {
      try {
        setUsersLoading(true);

        const params = {
          page,
          limit: usersPerPage,
          ...(search.trim() && { search: search.trim() }),
        };

        const response = await groupsService.getAvailableUsers(params);

        if (response.code === 200) {
          setAvailableUsers(response.data);
          setUsersTotal(response.total);
          setUsersTotalPages(response.totalPages);
        } else {
          throw new Error(response.message || "Failed to fetch users");
        }
      } catch (error: any) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users", {
          position: "top-right",
          autoClose: 3000,
        });
        // Set empty state on error
        setAvailableUsers([]);
        setUsersTotal(0);
        setUsersTotalPages(0);
      } finally {
        setUsersLoading(false);
      }
    },
    [usersPerPage]
  );

  // Load users when create group modal opens or when search/page changes
  useEffect(() => {
    if (isCreateGroupModalOpen) {
      const timeoutId = setTimeout(() => {
        fetchAvailableUsers(currentPage, searchTermCreateGroup);
      }, 300); // Add debounce for search

      return () => clearTimeout(timeoutId);
    }
  }, [
    isCreateGroupModalOpen,
    currentPage,
    searchTermCreateGroup,
    fetchAvailableUsers,
  ]);

  // Sync selected groups with filter context
  useEffect(() => {
    setSelectedGroups(filters.groups);
  }, [filters.groups]);

  // Sync date range with filter context
  useEffect(() => {
    setDateRange(filters.dateRange);
  }, [filters.dateRange]);

  // Transform groups for dropdown - Add "Select All" option
  const getGroupOptions = () => {
    const allOption = {
      id: "all",
      name: "Select All",
      description: "Select all available groups",
    };
    const groupOptions = groups.map((group) => ({
      id: group.id.toString(),
      name: group.name,
      description: group.description,
    }));

    return [allOption, ...groupOptions];
  };

  const handleGroupSelection = (groupId: string) => {
    if (groupId === "all") {
      if (selectedGroups.length === groups.length) {
        setSelectedGroups([]);
      } else {
        setSelectedGroups(groups.map((group) => group.id.toString()));
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
    applyGroupFilter(selectedGroups);
    setIsGroupModalOpen(false);
    setIsFilterOpen(false);
  };

  const handleApplyPeriodFilter = () => {
    applyDateFilter(dateRange);
    setIsPeriodModalOpen(false);
    setIsFilterOpen(false);
  };

  // Updated to fetch groups when group filter button is clicked
  const handleGroupFilterClick = async () => {
    // Fetch groups only if we haven't fetched them yet or if they're empty
    if (groups.length === 0 && !groupsLoading) {
      await fetchGroups();
    }
    setIsGroupModalOpen(true);
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
    const currentUserIds = availableUsers.map((user) => user.id);
    const allSelected = currentUserIds.every((id) =>
      selectedUsers.includes(id)
    );

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !currentUserIds.includes(id))
      );
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...currentUserIds])]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file);
      toast.info(
        "File upload feature coming soon! Please select users manually for now.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // Update the handleCreateGroupSubmit function
  const handleCreateGroupSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check if we have users to add
    let userIdsToAdd: number[] = [];

    if (importedEmailList.length > 0) {
      // If using imported emails, get ONLY valid user IDs automatically
      const validEmails = importedEmailList.filter((e) => e.status === "valid");
      userIdsToAdd = validEmails
        .map((email) => email.userId)
        .filter((id): id is number => id !== undefined);

      if (userIdsToAdd.length === 0) {
        toast.error(
          "No valid users found in imported emails. Please validate emails or import different ones.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        return;
      }
    } else {
      // If using manual selection
      userIdsToAdd = selectedUsers;

      if (userIdsToAdd.length === 0) {
        toast.error("Please select at least one user for the group", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      setCreateGroupLoading(true);

      // Format request body according to API specification
      const requestBody = {
        groups: [
          {
            name: groupName.trim(),
            description: groupDescription.trim() || undefined,
            userIds: userIdsToAdd,
          },
        ],
      };

      console.log("Creating group with data:", requestBody);

      const response = await groupsService.createGroup(requestBody);

      if (response.code === 201) {
        const createdGroupName = groupName.trim(); // Store before reset

        // Reset form
        setGroupName("");
        setGroupDescription("");
        setSelectedUsers([]);
        setSearchTermCreateGroup("");
        setCurrentPage(1);
        setImportedEmails([]);
        setImportedEmailList([]); // Reset imported email list
        setIsCreateGroupModalOpen(false);

        // Refresh groups list to include the new group
        await fetchGroups();

        // Show success toast with details
        const method =
          importedEmailList.length > 0 ? "imported emails" : "manual selection";
        toast.success(
          `Group "${createdGroupName}" created successfully with ${userIdsToAdd.length} user(s) from ${method}!`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        throw new Error(response.message || "Failed to create group");
      }
    } catch (error: any) {
      console.error("Failed to create group:", error);
      toast.error(
        `Failed to create group: ${error.message || "Please try again."}`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setCreateGroupLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetchAvailableUsers will be called by useEffect when currentPage changes
  };

  // Reset modal states when closing
  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
    setGroupName("");
    setGroupDescription("");
    setSelectedUsers([]);
    setSearchTermCreateGroup("");
    setCurrentPage(1);
    setImportedEmails([]);
    setImportedEmailList([]); // Add this line
  };

  // Get portal container
  const getPortalContainer = () => {
    return document.getElementById("modal-portal") || document.body;
  };

  return (
    <div className={`${className}`}>
      {/* Filter Button - stays in header */}
      <div className="relative">
        <FilterButton
          isOpen={isFilterOpen}
          onClick={() => setIsFilterOpen((prev) => !prev)}
        />

        {isFilterOpen && (
          <div
            className={`absolute ${
              compact ? "right-0" : "right-0"
            } mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-800`}
          >
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100 disabled:opacity-50"
                onClick={handleGroupFilterClick}
                disabled={groupsLoading}
              >
                {groupsLoading ? "Loading Groups..." : "Group Filter"}
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                onClick={() => {
                  setIsPeriodModalOpen(true);
                  setIsFilterOpen(false);
                }}
              >
                Date Range
              </button>
              {showCreateGroup && (
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals rendered via Portal */}
      {isGroupModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
              onClick={() => setIsGroupModalOpen(false)}
            />
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <GroupFilterModal
                open={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                schoolGroups={getGroupOptions()}
                selectedGroups={selectedGroups}
                onChange={handleGroupSelection}
                onApply={handleApplyGroupFilter}
                loading={groupsLoading}
              />
            </div>
          </div>,
          getPortalContainer()
        )}

      {isPeriodModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
              onClick={() => setIsPeriodModalOpen(false)}
            />
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
          </div>,
          getPortalContainer()
        )}

      {showCreateGroup &&
        isCreateGroupModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
              onClick={handleCloseCreateGroupModal}
            />
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <CreateGroupModal
                open={isCreateGroupModalOpen}
                onClose={handleCloseCreateGroupModal}
                onSubmit={handleCreateGroupSubmit}
                groupName={groupName}
                onGroupNameChange={setGroupName}
                groupDescription={groupDescription}
                onGroupDescriptionChange={setGroupDescription}
                searchTerm={searchTermCreateGroup}
                onSearchTermChange={handleSearchTermChange}
                handleFileUpload={handleFileUpload}
                currentUsers={transformedCurrentUsers}
                selectedUsers={selectedUsers}
                handleUserSelection={handleUserSelection}
                handleSelectAllUsers={handleSelectAllUsers}
                indexOfFirstUser={(currentPage - 1) * usersPerPage}
                indexOfLastUser={Math.min(
                  currentPage * usersPerPage,
                  usersTotal
                )}
                filteredUsers={transformedCurrentUsers}
                currentPage={currentPage}
                totalPages={usersTotalPages}
                handlePageChange={handlePageChange}
                loading={usersLoading}
                createLoading={createGroupLoading}
                importedEmails={importedEmails}
                onImportedEmailsChange={setImportedEmails}
                onValidateEmails={validateEmails}
                usersTotal={usersTotal}
                importedEmailList={importedEmailList}
                onImportedEmailListChange={setImportedEmailList}
              />
            </div>
          </div>,
          getPortalContainer()
        )}
    </div>
  );
};
