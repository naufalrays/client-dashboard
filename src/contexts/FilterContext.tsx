import React, { createContext, useContext, useState, useEffect } from "react";

export interface FilterState {
  groups: string[];
  dateRange: Date[];
  isActive: boolean;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  applyGroupFilter: (groups: string[]) => void;
  applyDateFilter: (dateRange: Date[]) => void;
  removeGroupFilter: (groupId: string) => void;
  removeDateFilter: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFiltersState] = useState<FilterState>({
    groups: [],
    dateRange: [],
    isActive: false,
  });

  // Update isActive when filters change
  useEffect(() => {
    const isActive =
      filters.groups.length > 0 || filters.dateRange.length === 2;
    if (filters.isActive !== isActive) {
      setFiltersState((prev) => ({ ...prev, isActive }));
    }
  }, [filters.groups, filters.dateRange]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFiltersState({
      groups: [],
      dateRange: [],
      isActive: false,
    });
  };

  const applyGroupFilter = (groups: string[]) => {
    setFiltersState((prev) => ({ ...prev, groups }));
  };

  const applyDateFilter = (dateRange: Date[]) => {
    setFiltersState((prev) => ({ ...prev, dateRange }));
  };

  const removeGroupFilter = (groupId: string) => {
    setFiltersState((prev) => ({
      ...prev,
      groups: prev.groups.filter((id) => id !== groupId),
    }));
  };

  const removeDateFilter = () => {
    setFiltersState((prev) => ({ ...prev, dateRange: [] }));
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        applyGroupFilter,
        applyDateFilter,
        removeGroupFilter,
        removeDateFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
