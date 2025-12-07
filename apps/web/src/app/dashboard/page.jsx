import { useState, useEffect } from "react";
import {
  ArrowRight,
  Compass,
  Star,
  Trophy,
  Zap,
  Calendar,
  Target,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sessionId = localStorage.getItem("lifeEngineerSession");
        if (!sessionId) {
          window.location.href = "/assessment";
          return;
        }

        // Fetch comprehensive dashboard data
        const response = await fetch("/api/get-dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Unable to load your dashboard. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            <Star className="w-8 h-8 text-[#92400E]" />
          </div>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Loading Your Dashboard...
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-md">
            Preparing your personalized overview.
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
            href="/results"
            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
          >
            View Results
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  const { archetype, progress, recentTasks, stats } = dashboardData;

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
              href="/try-list"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              Try List
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-2">
                  Welcome back!
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg">
                  You are{" "}
                  <span className="font-semibold text-[#FACC15]">
                    {archetype?.archetype_name || "The Explorer"}
                  </span>
                </p>
              </div>
            </div>

            {archetype?.description && (
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-6">
                {archetype.description}
              </p>
            )}

            <a
              href="/results"
              className="inline-flex items-center gap-2 text-[#FACC15] hover:text-[#F59E0B] font-medium transition-colors"
            >
              View Full Archetype
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            Your Progress
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Total XP */}
            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#E9FF59] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#5B5B5B]" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {progress?.total_xp || 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                Total XP
              </h3>
            </div>

            {/* Tasks Completed */}
            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#C8E8FF] rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#5B5B5B]" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {progress?.tasks_completed || 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                Tasks Completed
              </h3>
            </div>

            {/* Current Streak */}
            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#FFB3B3] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#5B5B5B]" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {progress?.streak_days || 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                Day Streak
              </h3>
            </div>

            {/* Try List Items */}
            <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#E4C8FF] rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#5B5B5B]" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {stats?.tryListCount || 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                Try List Items
              </h3>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Recent Activity
            </h2>
            <a
              href="/try-list"
              className="inline-flex items-center gap-2 text-[#FACC15] hover:text-[#F59E0B] font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {recentTasks && recentTasks.length > 0 ? (
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div
                  key={task.id || index}
                  className={`bg-white dark:bg-[#1E1E1E] rounded-xl border p-6 ${
                    task.is_completed
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900 dark:bg-opacity-20"
                      : "border-[#E6E6E6] dark:border-[#333333]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        task.is_completed
                          ? "bg-green-500 text-white"
                          : "bg-[#F3F4F6] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF]"
                      }`}
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Target className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-1 ${
                          task.is_completed
                            ? "text-green-800 dark:text-green-200 line-through"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                        <span>{task.duration}</span>
                        <span>•</span>
                        <span>{task.xp_value} XP</span>
                        {task.completed_at && (
                          <>
                            <span>•</span>
                            <span>
                              Completed{" "}
                              {new Date(task.completed_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-12 text-center">
              <Trophy className="w-16 h-16 text-[#D1D5DB] mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                No activities yet
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">
                Start exploring careers and hobbies to build your try list.
              </p>
              <a
                href="/careers"
                className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/careers"
              className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-[#E9FF59] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Explore Careers
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                Discover careers that match your strengths and interests
              </p>
            </a>

            <a
              href="/hobbies"
              className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-[#E4C8FF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Find Hobbies
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                Get hobby recommendations tailored to your personality
              </p>
            </a>

            <a
              href="/try-list"
              className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-[#C8E8FF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Try List
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                Complete micro-experiments to explore your interests
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
