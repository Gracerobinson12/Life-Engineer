import { useState, useEffect } from "react";
import {
  ArrowRight,
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Trophy,
} from "lucide-react";

export default function TryListPage() {
  const [loading, setLoading] = useState(true);
  const [tryListItems, setTryListItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const fetchTryList = async () => {
      try {
        const sessionId = localStorage.getItem("lifeEngineerSession");
        if (!sessionId) {
          window.location.href = "/assessment";
          return;
        }

        // Fetch try list items
        const response = await fetch("/api/get-try-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch try list");
        }

        const data = await response.json();
        setTryListItems(data.items);

        // Fetch user progress
        const progressResponse = await fetch("/api/get-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserProgress(progressData.progress);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching try list:", err);
        setError("Unable to load your try list. Please try again.");
        setLoading(false);
      }
    };

    fetchTryList();
  }, []);

  const toggleComplete = async (itemId, isCompleted) => {
    try {
      const sessionId = localStorage.getItem("lifeEngineerSession");
      const response = await fetch("/api/toggle-try-list-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          itemId,
          isCompleted: !isCompleted,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update the item in our state
        setTryListItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  is_completed: !isCompleted,
                  completed_at: !isCompleted ? new Date().toISOString() : null,
                }
              : item,
          ),
        );

        // Update progress
        if (result.progress) {
          setUserProgress(result.progress);
        }

        // Show XP notification if completed
        if (!isCompleted && result.xpGained) {
          alert(`🎉 You earned ${result.xpGained} XP!`);
        }
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  // Filter items
  const completedItems = tryListItems.filter((item) => item.is_completed);
  const pendingItems = tryListItems.filter((item) => !item.is_completed);

  const filteredItems =
    selectedFilter === "All"
      ? tryListItems
      : selectedFilter === "Completed"
        ? completedItems
        : pendingItems;

  const getDurationColor = (duration) => {
    if (duration?.includes("15-30"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (duration?.includes("1-2"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (duration?.includes("Weekend"))
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse"
            style={{
              background:
                "radial-gradient(circle, #FFF6C3 0%, #FACC15 50%, #F59E0B 100%)",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
            }}
          >
            <Trophy className="w-8 h-8 text-[#92400E]" />
          </div>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Loading Your Try List...
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-md">
            Getting your personalized micro-experiments ready.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8 max-w-md">
            {error}
          </p>
          <a
            href="/careers"
            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
          >
            Explore Careers
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#121212]"
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#E9E9E9] dark:border-[#333333]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, #FFF6C3 0%, #FACC15 50%, #F59E0B 100%)",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
              }}
            >
              <Compass className="w-4 h-4 text-[#92400E]" />
            </div>
            <h1 className="text-lg font-bold text-black dark:text-white">
              Life Engineer+
            </h1>
          </div>

          <nav className="flex items-center gap-4">
            <a
              href="/results"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              Your Archetype
            </a>
            <a
              href="/careers"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              Career Suggestions
            </a>
            <a
              href="/hobbies"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              Hobby Suggestions
            </a>
            <a
              href="/dashboard"
              className="bg-[#FACC15] hover:bg-[#F59E0B] text-black px-4 py-2 rounded-full transition-all duration-150 font-medium text-sm"
            >
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C8E8FF] rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
                  Your Try List
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg">
                  Micro-experiments to explore your interests
                </p>
              </div>
            </div>

            {/* Progress Summary */}
            {userProgress && (
              <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-[#E6E6E6] dark:border-[#333333] text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#FACC15]" />
                  <span className="text-2xl font-bold text-black dark:text-white">
                    {userProgress.total_xp}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                  Total XP
                </p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] text-center">
              <div className="text-2xl font-bold text-[#FACC15] mb-2">
                {tryListItems.length}
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Total Items
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {completedItems.length}
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Completed
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {pendingItems.length}
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Pending
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3">
            {["All", "Pending", "Completed"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  selectedFilter === filter
                    ? "bg-[#FACC15] text-black"
                    : "bg-[#F3F4F6] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563]"
                }`}
              >
                {filter} (
                {filter === "All"
                  ? tryListItems.length
                  : filter === "Pending"
                    ? pendingItems.length
                    : completedItems.length}
                )
              </button>
            ))}
          </div>
        </section>

        {/* Try List Items */}
        <section>
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-[#D1D5DB] mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                {selectedFilter === "All"
                  ? "No items yet"
                  : `No ${selectedFilter.toLowerCase()} items`}
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8">
                {selectedFilter === "All"
                  ? "Start by exploring careers or hobbies to build your try list."
                  : `You don't have any ${selectedFilter.toLowerCase()} items yet.`}
              </p>
              <a
                href="/careers"
                className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
              >
                Explore Careers
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#1E1E1E] rounded-xl border p-6 transition-all duration-200 ${
                    item.is_completed
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900 dark:bg-opacity-20"
                      : "border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => toggleComplete(item.id, item.is_completed)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                        item.is_completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-[#D1D5DB] dark:border-[#6B7280] hover:border-[#FACC15]"
                      }`}
                    >
                      {item.is_completed && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              item.is_completed
                                ? "text-green-800 dark:text-green-200 line-through"
                                : "text-black dark:text-white"
                            }`}
                          >
                            {item.title}
                          </h3>

                          {/* Tags */}
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${getDurationColor(item.duration)}`}
                            >
                              <Clock className="w-3 h-3 inline mr-1" />
                              {item.duration}
                            </span>
                            <span className="px-2 py-1 bg-[#FACC15] bg-opacity-20 text-[#5B5B5B] dark:text-[#FACC15] text-xs rounded-full">
                              {item.item_type}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                              <Zap className="w-3 h-3 inline mr-1" />
                              {item.xp_value} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        className={`leading-relaxed ${
                          item.is_completed
                            ? "text-green-700 dark:text-green-300"
                            : "text-[#6B7280] dark:text-[#9CA3AF]"
                        }`}
                      >
                        {item.description}
                      </p>

                      {item.completed_at && (
                        <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                          ✅ Completed{" "}
                          {new Date(item.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
