import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useFilter } from "../../contexts/FilterContext";
import { groupsService, type Group } from "../../services/groupsService";

interface ActiveFiltersProps {
  className?: string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  className = "",
}) => {
  const { filters, removeGroupFilter, removeDateFilter, clearFilters } =
    useFilter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Fetch groups to get real names
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const response = await groupsService.getGroups();
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups for active filters:", error);
      } finally {
        setGroupsLoading(false);
      }
    };

    if (filters.groups.length > 0) {
      fetchGroups();
    }
  }, [filters.groups]);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get group name by ID
  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id.toString() === groupId);
    return group ? group.name : `Group ${groupId}`;
  };

  // Don't render if no active filters
  if (!filters.isActive) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Active Filters Label */}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Active filters:
      </span>

      {/* Group Filters */}
      {filters.groups.map((groupId) => (
        <span
          key={groupId}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
        >
          {groupsLoading ? "Loading..." : getGroupName(groupId)}
          <button
            onClick={() => removeGroupFilter(groupId)}
            className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Date Range Filter */}
      {filters.dateRange.length === 2 && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          {`${formatDate(filters.dateRange[0])} - ${formatDate(
            filters.dateRange[1]
          )}`}
          <button
            onClick={removeDateFilter}
            className="hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70 transition-colors"
      >
        Clear all
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
