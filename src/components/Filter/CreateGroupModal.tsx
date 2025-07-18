import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  FileText,
  Check,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  groupName: string;
  onGroupNameChange: (name: string) => void;
  groupDescription: string;
  onGroupDescriptionChange: (description: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentUsers: Array<{
    id: number;
    name: string;
    email: string;
    level?: string;
    userReferral?: string;
  }>;
  selectedUsers: number[];
  handleUserSelection: (userId: number) => void;
  handleSelectAllUsers: () => void;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  filteredUsers: Array<{
    id: number;
    name: string;
    email: string;
    level?: string;
    userReferral?: string;
  }>;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  loading?: boolean;
  createLoading?: boolean;
  importedEmails?: string[];
  onImportedEmailsChange?: (emails: string[]) => void;
  onValidateEmails?: (emails: string[]) => Promise<any>;
  usersTotal?: number;
  // Add these new props
  importedEmailList?: Array<{
    email: string;
    status: "pending" | "validating" | "valid" | "invalid";
    userId?: number;
  }>;
  onImportedEmailListChange?: (
    list: Array<{
      email: string;
      status: "pending" | "validating" | "valid" | "invalid";
      userId?: number;
    }>
  ) => void;
}

interface ImportedEmail {
  email: string;
  status: "pending" | "validating" | "valid" | "invalid";
  userId?: number;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  open,
  onClose,
  onSubmit,
  groupName,
  onGroupNameChange,
  groupDescription,
  onGroupDescriptionChange,
  searchTerm,
  onSearchTermChange,
  currentUsers,
  selectedUsers,
  handleUserSelection,
  handleSelectAllUsers,
  indexOfFirstUser,
  indexOfLastUser,
  currentPage,
  totalPages,
  handlePageChange,
  loading = false,
  createLoading = false,
  onImportedEmailsChange,
  onValidateEmails,
  usersTotal = 0,
  importedEmailList = [],
  onImportedEmailListChange,
}) => {
  // Add missing state declarations
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isValidating, setIsValidating] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false); // Track if current emails have been validated

  // Update the setImportedEmailList calls to use the prop callback
  const handleSetImportedEmailList = (
    newList: Array<{
      email: string;
      status: "pending" | "validating" | "valid" | "invalid";
      userId?: number;
    }>
  ) => {
    if (onImportedEmailListChange) {
      onImportedEmailListChange(newList);
    }
  };

  // Download Excel template with better error handling
  const downloadExcelTemplate = useCallback(async () => {
    try {
      // Check if file exists first
      const response = await fetch("/example-data.xlsx", { method: "HEAD" });

      if (!response.ok) {
        throw new Error("Template file not found");
      }

      // Create download link
      const link = document.createElement("a");
      link.href = "/example-data.xlsx";
      link.download = "email_import_template.xlsx";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Error downloading template file. Please contact support.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, []);

  // Handle Excel file upload and parsing
  const handleExcelUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get Sheet 2 (index 1)
          const sheetNames = workbook.SheetNames;
          if (sheetNames.length < 2) {
            toast.error(
              "Excel file must have at least 2 sheets. Please use the provided template.",
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
            return;
          }

          const sheet2Name = sheetNames[1]; // Second sheet
          const worksheet = workbook.Sheets[sheet2Name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Extract emails from row 2 onwards (ignoring header row)
          const emails: string[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row[0] && typeof row[0] === "string") {
              const email = row[0].trim();
              if (email && isValidEmail(email)) {
                emails.push(email);
              }
            }
          }

          if (emails.length > 0) {
            console.log("Extracted emails from Excel:", emails);

            // Set imported emails in parent state
            const emailList = emails.map((email) => ({
              email,
              status: "pending" as const,
            }));

            handleSetImportedEmailList(emailList);
            setHasBeenValidated(false); // Reset validation status for new emails

            // Also update parent component if callback provided
            if (onImportedEmailsChange) {
              onImportedEmailsChange(emails);
            }

            toast.success(
              `Successfully imported ${emails.length} email(s) from Excel file. Please validate emails before creating group.`,
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          } else {
            toast.error(
              "No valid emails found in the Excel file. Please check the format.",
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          toast.error(
            "Error reading Excel file. Please make sure it's a valid .xlsx file.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        }
      };

      reader.readAsArrayBuffer(file);
      event.target.value = "";
    },
    [onImportedEmailsChange, handleSetImportedEmailList]
  );

  // Validate imported emails - only allow once per import
  const validateImportedEmails = useCallback(async () => {
    if (importedEmailList.length === 0) {
      toast.error("No emails to validate", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (hasBeenValidated) {
      toast.info(
        "Emails have already been validated. Please import new emails to validate again.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    if (!onValidateEmails) {
      toast.error("Email validation is not available", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsValidating(true);

    // Set all emails to validating status
    handleSetImportedEmailList(
      importedEmailList.map((item) => ({
        ...item,
        status: "validating" as const,
      }))
    );

    try {
      const emails = importedEmailList.map((item) => item.email);
      const response = await onValidateEmails(emails);

      if (response.code === 200) {
        const { found, notFound } = response.data;

        // Update email list with validation results
        handleSetImportedEmailList(
          importedEmailList.map((item) => {
            const foundUser = found.find(
              (user: any) => user.email === item.email
            );
            if (foundUser) {
              return {
                ...item,
                status: "valid" as const,
                userId: foundUser.id,
              };
            } else if (notFound.includes(item.email)) {
              return {
                ...item,
                status: "invalid" as const,
              };
            }
            return item;
          })
        );

        setHasBeenValidated(true); // Mark as validated

        const validCount = found.length;
        const invalidCount = notFound.length;

        if (validCount > 0) {
          toast.success(
            `Validation complete! Valid emails: ${validCount}, Invalid emails: ${invalidCount}.`,
            {
              position: "top-right",
              autoClose: 7000,
            }
          );
        } else {
          toast.warning(
            "Validation complete! No valid emails found. Please check your email list or import different emails.",
            {
              position: "top-right",
              autoClose: 7000,
            }
          );
        }
      } else {
        throw new Error(response.message || "Validation failed");
      }
    } catch (error) {
      console.error("Error validating emails:", error);
      toast.error("Error validating emails. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });

      // Reset status back to pending
      handleSetImportedEmailList(
        importedEmailList.map((item) => ({
          ...item,
          status: "pending" as const,
        }))
      );
    } finally {
      setIsValidating(false);
    }
  }, [
    importedEmailList,
    onValidateEmails,
    handleSetImportedEmailList,
    hasBeenValidated,
  ]);

  // Clear imported emails
  const clearImportedEmails = useCallback(() => {
    handleSetImportedEmailList([]);
    setHasBeenValidated(false); // Reset validation status
    if (onImportedEmailsChange) {
      onImportedEmailsChange([]);
    }
  }, [onImportedEmailsChange, handleSetImportedEmailList]);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Get status icon and color for imported emails
  const getEmailStatusDisplay = (status: ImportedEmail["status"]) => {
    switch (status) {
      case "pending":
        return { icon: "⏳", color: "text-gray-500", bg: "bg-gray-100" };
      case "validating":
        return { icon: "🔄", color: "text-blue-500", bg: "bg-blue-100" };
      case "valid":
        return { icon: "✅", color: "text-green-500", bg: "bg-green-100" };
      case "invalid":
        return { icon: "❌", color: "text-red-500", bg: "bg-red-100" };
      default:
        return { icon: "⏳", color: "text-gray-500", bg: "bg-gray-100" };
    }
  };

  // Check if we can create group - Updated logic
  const canCreateGroup = () => {
    const hasGroupName = groupName.trim().length > 0;

    if (importedEmailList.length > 0) {
      // If using imported emails, check if we have valid emails after validation
      const validEmails = importedEmailList.filter((e) => e.status === "valid");
      return hasGroupName && hasBeenValidated && validEmails.length > 0;
    } else {
      // If using manual selection, check if we have selected users
      return hasGroupName && selectedUsers.length > 0;
    }
  };

  // Get validation button state
  const getValidationButtonState = () => {
    if (importedEmailList.length === 0) {
      return { disabled: true, text: "No emails to validate" };
    }
    if (isValidating) {
      return { disabled: true, text: "Validating..." };
    }
    if (hasBeenValidated) {
      return { disabled: true, text: "Already validated" };
    }
    return { disabled: false, text: "Validate Emails" };
  };

  // Reset validation status when modal opens
  useEffect(() => {
    if (open && importedEmailList.length === 0) {
      setHasBeenValidated(false);
    }
  }, [open, importedEmailList.length]);

  // Memoize the search submit handler
  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      onSearchTermChange(localSearchTerm);
    },
    [localSearchTerm, onSearchTermChange]
  );

  // Memoize the local search input handler
  const handleLocalSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchTerm(e.target.value);
    },
    []
  );

  // Handle Enter key press for search
  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm("");
    onSearchTermChange("");
  }, [onSearchTermChange]);

  // Sync local search with prop when modal opens or search term changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  if (!open) return null;

  const validationButtonState = getValidationButtonState();

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Responsive positioning */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-2 sm:p-4 text-center">
        <div className="relative bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto dark:bg-gray-900 transform transition-all border border-gray-200 dark:border-gray-700 my-2 sm:my-4">
          {/* Compact Header - Responsive height */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="p-1 sm:p-1.5 bg-white/20 rounded-md backdrop-blur-sm flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="ps-4 text-left min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
                    Create New Group
                  </h3>
                  <p className="text-indigo-100 text-xs hidden sm:block">
                    Organize your users into groups
                  </p>
                </div>
              </div>

              {/* Close Button - Added X icon */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white flex-shrink-0 ml-2"
                disabled={createLoading}
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Main Content - Dynamic height */}
          <div className="flex flex-col lg:flex-row max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-160px)]">
            {/* Left Column - Compact on mobile */}
            <div
              className={`${
                importedEmailList.length > 0 ? "lg:w-1/3" : "lg:w-1/3"
              } border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto`}
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Group Details Section - Compact */}
                <div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Group Details
                    </h4>
                  </div>

                  <div className="text-left space-y-2.5 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Group Name *
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => onGroupNameChange(e.target.value)}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-xs sm:text-sm"
                        placeholder="Enter group name..."
                        disabled={createLoading}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={groupDescription}
                        onChange={(e) =>
                          onGroupDescriptionChange(e.target.value)
                        }
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all resize-none text-xs sm:text-sm"
                        rows={2}
                        placeholder="Describe the purpose..."
                        disabled={createLoading}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Users Summary - Compact */}
                <div className="bg-white dark:bg-gray-700 rounded-md sm:rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                      {importedEmailList.length > 0
                        ? "Valid Users"
                        : "Selected Users"}
                    </h5>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300">
                      {importedEmailList.length > 0
                        ? importedEmailList.filter((e) => e.status === "valid")
                            .length
                        : selectedUsers.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {importedEmailList.length > 0
                      ? importedEmailList.filter((e) => e.status === "valid")
                          .length === 0
                        ? "No valid users yet"
                        : `${
                            importedEmailList.filter(
                              (e) => e.status === "valid"
                            ).length
                          } valid user(s)`
                      : selectedUsers.length === 0
                      ? "No users selected"
                      : `${selectedUsers.length} user(s) selected`}
                  </p>
                </div>

                {/* Excel Import Section - Compact */}
                <div className="bg-white dark:bg-gray-700 rounded-md sm:rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-xs sm:text-sm">
                    Excel Import
                  </h5>

                  {/* Download Template Button - Compact */}
                  <button
                    onClick={downloadExcelTemplate}
                    className="w-full mb-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50 text-xs sm:text-sm"
                    disabled={createLoading}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Download Template</span>
                  </button>

                  {/* Upload Area - Compact */}
                  <input
                    type="file"
                    id="create-group-excel-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    disabled={createLoading}
                  />
                  <label
                    htmlFor="create-group-excel-upload"
                    className="flex items-center justify-center w-full px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          Upload Excel
                        </span>
                      </p>
                    </div>
                  </label>

                  {/* Imported Summary - Compact */}
                  {importedEmailList.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        📧 {importedEmailList.length} emails
                      </p>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Valid:{" "}
                        {
                          importedEmailList.filter((e) => e.status === "valid")
                            .length
                        }{" "}
                        • Invalid:{" "}
                        {
                          importedEmailList.filter(
                            (e) => e.status === "invalid"
                          ).length
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Import Button - Compact */}
                {importedEmailList.length > 0 && (
                  <button
                    onClick={clearImportedEmails}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 transition-colors text-xs sm:text-sm"
                  >
                    Clear Import & Select Manually
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Dynamic content */}
            {importedEmailList.length > 0 ? (
              /* Imported Emails Management - Updated */
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Imported Emails ({importedEmailList.length})
                    </h4>
                    {hasBeenValidated && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓ Validated
                      </span>
                    )}
                  </div>

                  {/* Validation Controls - Updated */}
                  <div className="mb-3">
                    <button
                      onClick={validateImportedEmails}
                      disabled={validationButtonState.disabled || createLoading}
                      className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-white rounded-md transition-colors flex items-center justify-center space-x-1.5 text-xs sm:text-sm ${
                        validationButtonState.disabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : hasBeenValidated
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isValidating ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : hasBeenValidated ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      <span>{validationButtonState.text}</span>
                    </button>

                    {/* Validation Instructions */}
                    {!hasBeenValidated && importedEmailList.length > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
                        Please validate emails before creating the group
                      </p>
                    )}
                  </div>

                  {/* Status Summary - Show only after validation */}
                  {hasBeenValidated && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-center">
                        <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                          {
                            importedEmailList.filter(
                              (e) => e.status === "valid"
                            ).length
                          }
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Valid (will be added)
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md text-center">
                        <div className="text-sm sm:text-lg font-bold text-red-600 dark:text-red-400">
                          {
                            importedEmailList.filter(
                              (e) => e.status === "invalid"
                            ).length
                          }
                        </div>
                        <div className="text-xs text-red-700 dark:text-red-300">
                          Invalid (ignored)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warning if no valid emails after validation */}
                  {hasBeenValidated &&
                    importedEmailList.filter((e) => e.status === "valid")
                      .length === 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                        <p className="text-xs text-red-700 dark:text-red-300 text-center">
                          ⚠️ No valid emails found. Group cannot be created with
                          current emails.
                        </p>
                      </div>
                    )}
                </div>

                {/* Emails List - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {importedEmailList.map((item, index) => {
                      const statusDisplay = getEmailStatusDisplay(item.status);
                      return (
                        <div
                          key={index}
                          className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.email}
                              </div>
                              {item.userId && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {item.userId}
                                </div>
                              )}
                              {item.status === "invalid" && (
                                <div className="text-xs text-red-500">
                                  Will not be added to group
                                </div>
                              )}
                              {item.status === "valid" && (
                                <div className="text-xs text-green-600">
                                  Will be added to group
                                </div>
                              )}
                            </div>
                            <div
                              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${statusDisplay.bg} ${statusDisplay.color}`}
                            >
                              <span>{statusDisplay.icon}</span>
                              <span className="capitalize font-medium hidden sm:inline">
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* User Selection - same as before */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search Header - Compact */}
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-1.5">
                      <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <span>Select Users</span>
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {loading
                        ? "Loading..."
                        : `${currentUsers.length}/${usersTotal}`}
                    </div>
                  </div>

                  {/* Search Form - Compact */}
                  <form onSubmit={handleSearchSubmit} className="space-y-2">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={localSearchTerm}
                          onChange={handleLocalSearchChange}
                          onKeyPress={handleSearchKeyPress}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-xs sm:text-sm"
                          placeholder="Search users..."
                          disabled={loading || createLoading}
                          autoComplete="off"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || createLoading}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors text-xs sm:text-sm"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                        ) : (
                          <Search className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {(localSearchTerm || searchTerm) && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          disabled={loading || createLoading}
                          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors text-xs sm:text-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {searchTerm && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {loading
                          ? "Searching..."
                          : `Results for "${searchTerm}"`}
                      </div>
                    )}
                  </form>
                </div>

                {/* User List - Scrollable */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Loading...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <label className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                currentUsers.length > 0 &&
                                currentUsers.every((user) =>
                                  selectedUsers.includes(user.id)
                                )
                              }
                              onChange={handleSelectAllUsers}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                              disabled={createLoading}
                            />
                            <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Select all
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedUsers.length} selected
                          </span>
                        </label>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0">
                        {currentUsers.length === 0 ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {searchTerm
                                  ? "No users found"
                                  : "No users available"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentUsers.map((user) => (
                              <label
                                key={user.id}
                                className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleUserSelection(user.id)}
                                  className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                  disabled={createLoading}
                                />
                                <div className="ml-2.5 text-left sm:ml-3 flex-1 min-w-0">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                  </div>
                                </div>
                                {selectedUsers.includes(user.id) && (
                                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 ml-2" />
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Compact Pagination */}
                      {totalPages > 1 && (
                        <div className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                          <div className="text-xs text-gray-700 dark:text-gray-300">
                            {indexOfFirstUser + 1}-
                            {Math.min(indexOfLastUser, usersTotal)} of{" "}
                            {usersTotal}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1 || createLoading}
                              className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs text-gray-700 dark:text-gray-300 px-2">
                              {currentPage}/{totalPages}
                            </span>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={
                                currentPage === totalPages || createLoading
                              }
                              className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Compact Footer */}
          <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg sm:rounded-b-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {groupName.trim() ? (
                  importedEmailList.length > 0 ? (
                    hasBeenValidated ? (
                      importedEmailList.filter((e) => e.status === "valid")
                        .length > 0 ? (
                        <span className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          Ready to create "{groupName}" with{" "}
                          {
                            importedEmailList.filter(
                              (e) => e.status === "valid"
                            ).length
                          }{" "}
                          user(s)
                        </span>
                      ) : (
                        <span className="text-red-500">
                          No valid users to add to group
                        </span>
                      )
                    ) : (
                      <span className="text-amber-600">
                        Please validate emails first
                      </span>
                    )
                  ) : selectedUsers.length > 0 ? (
                    <span className="flex items-center">
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                      Ready to create "{groupName}" with {selectedUsers.length}{" "}
                      user(s)
                    </span>
                  ) : (
                    "Please select users for the group"
                  )
                ) : (
                  "Enter a group name to continue"
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                  onClick={onClose}
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1.5 shadow-md"
                  onClick={onSubmit}
                  disabled={!canCreateGroup() || createLoading}
                >
                  {createLoading && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  <span>{createLoading ? "Creating..." : "Create Group"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
