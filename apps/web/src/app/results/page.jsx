import { useState, useEffect } from "react";
import {
  ArrowRight,
  Compass,
  Star,
  MapPin,
  Zap,
  Heart,
  Brain,
  Target,
} from "lucide-react";

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [archetype, setArchetype] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateProfile = async () => {
      try {
        // Get session data
        const sessionId = localStorage.getItem("lifeEngineerSession");
        const assessmentDataStr = localStorage.getItem(
          "lifeEngineerAssessment",
        );

        if (!sessionId || !assessmentDataStr) {
          window.location.href = "/assessment";
          return;
        }

        const data = JSON.parse(assessmentDataStr);
        setAssessmentData(data);

        // Send to backend for processing
        const response = await fetch("/api/generate-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate profile");
        }

        const result = await response.json();
        setArchetype(result.archetype);
        setLoading(false);
      } catch (err) {
        console.error("Error generating profile:", err);
        setError("Unable to generate your profile. Please try again.");
        setLoading(false);
      }
    };

    generateProfile();
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
            <Compass className="w-8 h-8 text-[#92400E]" />
          </div>
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Generating Your Archetype...
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-md">
            We're analyzing your personality assessments and creating your
            personalized profile.
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
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
          >
            Try Again
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
        {/* Hero Section - Archetype Introduction */}
        <section className="mb-16">
          <div
            className="bg-white dark:bg-[#1E1E1E] rounded-[40px] border border-[#F1F1F4] dark:border-[#333333] p-16 md:p-12 text-center"
            style={{
              background:
                "radial-gradient(circle at center, #FFF6C3 0%, #FACC15 20%, transparent 70%), white",
            }}
          >
            <div
              className="absolute inset-0 hidden dark:block rounded-[40px]"
              style={{
                background:
                  "radial-gradient(circle at center, #2A2A1A 0%, #1E1E1E 20%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-6 h-6 text-[#F59E0B]" />
                <span className="text-[#7B7B7B] dark:text-[#A0A0A0] text-lg font-medium">
                  Your Personal Archetype
                </span>
                <Star className="w-6 h-6 text-[#F59E0B]" />
              </div>

              <h1
                className="text-black dark:text-white font-semibold leading-tight mb-6"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                }}
              >
                {archetype?.archetype_name || "The Adaptive Explorer"}
              </h1>

              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xl max-w-3xl mx-auto leading-relaxed">
                {archetype?.description ||
                  "Your archetype is being generated..."}
              </p>
            </div>
          </div>
        </section>

        {/* Core Insights Grid */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Work Style */}
          <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#E9FF59] rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Work Style
              </h3>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-lg">
              {archetype?.work_style ||
                "Your work style preferences are being analyzed..."}
            </p>
          </div>

          {/* Ideal Environments */}
          <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#E4C8FF] rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Ideal Environments
              </h3>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-lg">
              {archetype?.ideal_environments ||
                "Your ideal work environments are being determined..."}
            </p>
          </div>

          {/* Motivators */}
          <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#C8E8FF] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                What Motivates You
              </h3>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-lg">
              {archetype?.motivators ||
                "Your key motivators are being identified..."}
            </p>
          </div>

          {/* Stressors */}
          <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FFB3B3] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Potential Stressors
              </h3>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-lg">
              {archetype?.stressors || "Understanding your stress triggers..."}
            </p>
          </div>
        </section>

        {/* Strengths Interpretation */}
        {archetype?.strengths_interpretation && (
          <section className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333] mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Your Strengths In Action
              </h3>
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-lg">
              {archetype.strengths_interpretation}
            </p>
          </section>
        )}

        {/* Action Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-6">
            Ready to explore your path?
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-12 max-w-2xl mx-auto">
            Now that you know your archetype, discover careers and hobbies that
            align with who you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/careers"
              className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-8 py-4 rounded-full transition-all duration-150 font-medium text-lg"
            >
              Explore Careers
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/hobbies"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#2D3748] border border-[#FACC15] text-black dark:text-white hover:bg-[#FACC15] hover:text-black px-8 py-4 rounded-full transition-all duration-150 font-medium text-lg"
            >
              Discover Hobbies
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
