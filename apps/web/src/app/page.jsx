import { useState } from "react";
import { ArrowRight, Compass, Brain, Target, Lightbulb } from "lucide-react";

export default function HomePage() {
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, #FFF6C3 0%, #FACC15 50%, #F59E0B 100%)",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
              }}
            >
              <Compass className="w-5 h-5 text-[#92400E]" />
            </div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              Life Engineer+
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/login"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
          >
              Login
          </a>
            <a
              href="#features"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[#6E6E6E] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="/assessment"
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full hover:bg-[#111] dark:hover:bg-[#F0F0F0] transition-all duration-150 font-medium"
            >
              Start Discovery
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="pt-20 pb-32 px-6"
        style={{
          background:
            "radial-gradient(circle at top right, #F0F9FF 0%, #E0F2FE 30%, transparent 70%)",
        }}
      >
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(circle at top right, #1E293B 0%, #0F172A 30%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#F1F1F4] dark:border-[#333333] rounded-[40px] p-16 md:p-8">
            {/* Intro eyebrow */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-xl" aria-hidden="true">
                🎯
              </span>
              <p className="text-[#7B7B7B] dark:text-[#A0A0A0] text-[15px] font-normal">
                Discover your unique path through science-backed assessments…
              </p>
            </div>

            {/* Main headline */}
            <h1
              className="text-black dark:text-white font-normal leading-[1.05] mb-8"
              style={{
                fontSize: "clamp(36px, 6vw, 68px)",
              }}
            >
              Find the work and hobbies
              <br />
              you were wired for
            </h1>

            {/* Description */}
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg max-w-2xl mb-12 leading-relaxed">
              Combine your CliftonStrengths, MBTI, Enneagram, and more to
              discover your personalized archetype and get tailored career and
              hobby recommendations.
            </p>

            {/* CTA Button */}
            <a
              href="/assessment"
              className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full hover:bg-[#111] dark:hover:bg-[#F0F0F0] transition-all duration-150 font-medium text-lg group"
              style={{
                boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
              }}
            >
              Start Discovery
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-medium text-black dark:text-white mb-4">
            Your complete self-discovery toolkit
          </h2>
          <p className="text-center text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-16 max-w-3xl mx-auto">
            We combine multiple proven frameworks to create your unique
            archetype and path forward.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Assessment Integration */}
            <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-colors">
              <div className="w-12 h-12 bg-[#E9FF59] rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Multi-Framework Assessment
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Combines CliftonStrengths, MBTI, Enneagram, Holland Codes, and
                values to create your complete profile.
              </p>
            </div>

            {/* Personalized Archetype */}
            <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-colors">
              <div className="w-12 h-12 bg-[#E4C8FF] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Personalized Archetype
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Get a unique archetype name and detailed insights about your
                work style, motivators, and ideal environments.
              </p>
            </div>

            {/* Try List */}
            <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl border border-[#E6E6E6] dark:border-[#333333] hover:border-[#CFCFCF] dark:hover:border-[#505050] transition-colors md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#C8E8FF] rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-[#5B5B5B]" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Actionable Try List
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Get micro-experiments and tasks tailored to your interests.
                Build momentum with bite-sized challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-[#FAFAFA] dark:bg-[#0F0F0F]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-black dark:text-white mb-16">
            Simple 3-step process
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Take Assessment
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Input your personality test results, values, current hobbies,
                and interests in our comprehensive form.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Get Your Archetype
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Discover your personalized archetype with detailed insights
                about your work style and motivations.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Explore & Try
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Browse tailored career and hobby recommendations, then build
                your personalized try list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24 px-6"
        style={{
          background:
            "radial-gradient(circle at bottom left, #FFFCE8 0%, #F7F4D1 30%, transparent 70%)",
        }}
      >
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(circle at bottom left, #2A2A1A 0%, #1E1E1E 30%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-black dark:text-white mb-6">
            Ready to discover your path?
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-12 max-w-2xl mx-auto">
            Join thousands who have found clarity about their career and hobby
            directions through our personalized approach.
          </p>

          <a
            href="/assessment"
            className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full hover:bg-[#111] dark:hover:bg-[#F0F0F0] transition-all duration-150 font-medium text-lg group"
            style={{
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            }}
          >
            Start Your Discovery Journey
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </div>
  );
}
