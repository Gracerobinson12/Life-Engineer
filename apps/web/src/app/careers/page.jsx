import { useState, useEffect } from "react";
import {
  ArrowRight,
  Compass,
  Briefcase,
  DollarSign,
  Zap,
  TrendingUp,
  Plus,
  BookmarkPlus,
} from "lucide-react";

export default function CareersPage() {
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const sessionId = localStorage.getItem("lifeEngineerSession");
        if (!sessionId) {
          window.location.href = "/assessment";
          return;
        }

        // Check if careers already exist
        const existingCareers = await fetch("/api/get-careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (existingCareers.ok) {
          const result = await existingCareers.json();
          if (result.careers && result.careers.length > 0) {
            setCareers(result.careers);
            setLoading(false);
            return;
          }
        }

        // Generate new careers if none exist
        const response = await fetch("/api/generate-careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate career recommendations");
        }

        const data = await response.json();
        setCareers(data.careers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching careers:", err);
        setError("Unable to load career recommendations. Please try again.");
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const addToTryList = async (careerId) => {
    try {
      const sessionId = localStorage.getItem("lifeEngineerSession");
      const response = await fetch("/api/add-to-try-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          sourceId: careerId,
          type: "career",
        }),
      });

      if (response.ok) {
        // Show success feedback
        alert("Added to your Try List!");
      }
    } catch (err) {
      console.error("Error adding to try list:", err);
    }
  };

  // Get unique categories for filtering
  const categories = [
    "All",
    ...new Set(careers.map((career) => career.category)),
  ];
  const filteredCareers =
    selectedCategory === "All"
      ? careers
      : careers.filter((career) => career.category === selectedCategory);

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
            <Briefcase className="w-8 h-8 text-[#92400E]" />
          </div>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Finding Your Perfect Careers...
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-md">
            We're analyzing your profile to find careers that match your
            strengths and interests.
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
            Back to Results
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#E9FF59] rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#5B5B5B]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
                Career Recommendations
              </h1>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg">
                Careers tailored to your unique archetype and strengths
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  selectedCategory === category
                    ? "bg-[#FACC15] text-black"
                    : "bg-[#F3F4F6] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Career Cards Grid */}
        <section className="grid lg:grid-cols-2 gap-8">
          {filteredCareers.map((career, index) => (
            <div
              key={career.id || index}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-8 hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {career.career_title}
                    </h3>
                    <span className="px-2 py-1 bg-[#E9FF59] bg-opacity-20 text-[#5B5B5B] dark:text-[#FACC15] text-xs rounded-full">
                      {career.category}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {career.income_range}
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {career.energy_level} Energy
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToTryList(career.id)}
                  className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#374151] rounded-lg transition-colors"
                  title="Add to Try List"
                >
                  <BookmarkPlus className="w-5 h-5 text-[#6B7280] dark:text-[#9CA3AF]" />
                </button>
              </div>

              {/* Why It Matches */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-black dark:text-white mb-2 uppercase tracking-wide">
                  Why This Matches You
                </h4>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {career.reason}
                </p>
              </div>

              {/* Day-to-Day Tasks */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-black dark:text-white mb-2 uppercase tracking-wide">
                  What You'd Do Daily
                </h4>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {career.example_tasks}
                </p>
              </div>

              {/* Growth Potential */}
              <div className="flex items-start gap-3 p-4 bg-[#F8F9FA] dark:bg-[#2D3748] rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#FACC15] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white mb-1">
                    Growth Potential
                  </h4>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {career.growth_potential ||
                      "Growth opportunities available in this field."}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-[#4B5563]">
                <button
                  onClick={() => addToTryList(career.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black py-3 px-6 rounded-xl font-medium transition-all duration-150"
                >
                  <Plus className="w-5 h-5" />
                  Add to Try List
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4">
            Ready to explore more?
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8 max-w-2xl mx-auto">
            Check out hobby recommendations and build your personalized try list
            to start taking action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/hobbies"
              className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-8 py-4 rounded-full transition-all duration-150 font-medium text-lg"
            >
              Discover Hobbies
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/try-list"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#2D3748] border border-[#FACC15] text-black dark:text-white hover:bg-[#FACC15] hover:text-black px-8 py-4 rounded-full transition-all duration-150 font-medium text-lg"
            >
              View Try List
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
