import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Compass,
} from "lucide-react";

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    strengths: "",
    mbti: "",
    enneagram: "",
    hollandCode: "",
    values: [],
    currentHobbies: [],
    futureHobbies: "",
    skills: "",
  });

  const totalSteps = 3;

  // Available options
  const mbtiTypes = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

  const enneagramTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const hollandCodes = [
    {
      code: "R",
      name: "Realistic",
      description: "Practical, hands-on, mechanical",
    },
    {
      code: "I",
      name: "Investigative",
      description: "Analytical, intellectual, scientific",
    },
    {
      code: "A",
      name: "Artistic",
      description: "Creative, intuitive, expressive",
    },
    { code: "S", name: "Social", description: "Helpful, teaching, healing" },
    {
      code: "E",
      name: "Enterprising",
      description: "Persuasive, leading, ambitious",
    },
    {
      code: "C",
      name: "Conventional",
      description: "Detail-oriented, organized, precise",
    },
  ];

  const valueOptions = [
    "Achievement",
    "Adventure",
    "Authenticity",
    "Authority",
    "Autonomy",
    "Balance",
    "Beauty",
    "Challenge",
    "Community",
    "Competency",
    "Competition",
    "Creativity",
    "Economic Security",
    "Fame",
    "Family",
    "Freedom",
    "Friendship",
    "Fun",
    "Growth",
    "Health",
    "Helping Others",
    "Honesty",
    "Independence",
    "Influence",
    "Innovation",
    "Integrity",
    "Knowledge",
    "Leadership",
    "Learning",
    "Loyalty",
    "Money",
    "Peace",
    "Recognition",
    "Relationships",
    "Religion",
    "Reputation",
    "Security",
    "Service",
    "Spirituality",
    "Stability",
    "Success",
    "Tradition",
    "Travel",
    "Variety",
    "Wealth",
    "Wisdom",
  ];

  const hobbyOptions = [
    // Creative
    "Photography",
    "Drawing",
    "Painting",
    "Writing",
    "Music",
    "Dance",
    "Crafts",
    "Design",
    // Social
    "Volunteering",
    "Team Sports",
    "Networking",
    "Social Media",
    "Community Events",
    // Cognitive
    "Reading",
    "Puzzles",
    "Learning Languages",
    "Research",
    "Strategy Games",
    // Wellness
    "Yoga",
    "Meditation",
    "Running",
    "Fitness",
    "Nutrition",
    "Mental Health",
    // Tech
    "Programming",
    "Gaming",
    "Tech Reviews",
    "Building PCs",
    "Digital Art",
    // Maker
    "Woodworking",
    "Cooking",
    "Gardening",
    "DIY Projects",
    "Crafting",
    // Outdoors
    "Hiking",
    "Camping",
    "Rock Climbing",
    "Cycling",
    "Nature Photography",
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Generate session ID for anonymous users
    const sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("lifeEngineerSession", sessionId);
    localStorage.setItem("lifeEngineerAssessment", JSON.stringify(payload));

    // Redirect to results
    window.location.href = "/results";
  };

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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              {currentStep} of {totalSteps}
            </span>
            <div className="w-32 bg-[#F3F4F6] dark:bg-[#374151] rounded-full h-2">
              <div
                className="bg-[#FACC15] rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step Content */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-8 md:p-12">
          {/* Step 1: CliftonStrengths */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                Your CliftonStrengths
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                Paste your top 5 or full 34 CliftonStrengths results below.
                Don't have them?
                <a
                  href="https://www.gallup.com/cliftonstrengths/"
                  target="_blank"
                  className="text-[#FACC15] hover:underline ml-1"
                >
                  Take the assessment
                </a>
              </p>

              <textarea
                value={formData.strengths}
                onChange={(e) => updateFormData("strengths", e.target.value)}
                placeholder="e.g., Strategic, Achiever, Learner, Input, Intellection..."
                className="w-full h-48 p-4 border border-[#D1D5DB] dark:border-[#4B5563] rounded-xl bg-white dark:bg-[#2D3748] text-black dark:text-white resize-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-colors"
              />
            </div>
          )}

          {/* Step 2: MBTI & Enneagram */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                Personality Types
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                Select your MBTI and Enneagram types if you know them.
              </p>

              <div className="space-y-8">
                {/* MBTI */}
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                    MBTI Type
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {mbtiTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateFormData("mbti", type)}
                        className={`p-3 rounded-lg border transition-all duration-150 ${
                          formData.mbti === type
                            ? "bg-[#FACC15] border-[#FACC15] text-black"
                            : "bg-white dark:bg-[#2D3748] border-[#D1D5DB] dark:border-[#4B5563] text-black dark:text-white hover:border-[#FACC15]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enneagram */}
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                    Enneagram Type
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                    {enneagramTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateFormData("enneagram", type)}
                        className={`p-3 rounded-lg border transition-all duration-150 ${
                          formData.enneagram === type
                            ? "bg-[#FACC15] border-[#FACC15] text-black"
                            : "bg-white dark:bg-[#2D3748] border-[#D1D5DB] dark:border-[#4B5563] text-black dark:text-white hover:border-[#FACC15]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Holland Code */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                Holland Code (RIASEC)
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                Select up to 3 codes that best describe your interests and work
                preferences.
              </p>

              <div className="grid gap-4">
                {hollandCodes.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      const currentCodes = formData.hollandCode
                        .split("")
                        .filter(Boolean);
                      if (currentCodes.includes(item.code)) {
                        // Remove if already selected
                        const newCodes = currentCodes
                          .filter((code) => code !== item.code)
                          .join("");
                        updateFormData("hollandCode", newCodes);
                      } else if (currentCodes.length < 3) {
                        // Add if under 3 selections
                        updateFormData(
                          "hollandCode",
                          formData.hollandCode + item.code,
                        );
                      }
                    }}
                    className={`p-6 rounded-xl border transition-all duration-150 text-left ${
                      formData.hollandCode.includes(item.code)
                        ? "bg-[#FACC15] bg-opacity-20 border-[#FACC15] text-black dark:text-white"
                        : "bg-white dark:bg-[#2D3748] border-[#D1D5DB] dark:border-[#4B5563] text-black dark:text-white hover:border-[#FACC15]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FACC15] rounded-lg flex items-center justify-center text-black font-bold text-xl">
                        {item.code}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Values */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                Your Core Values
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                Select the values that are most important to you in work and
                life.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {valueOptions.map((value) => (
                  <button
                    key={value}
                    onClick={() => toggleArrayValue("values", value)}
                    className={`p-3 rounded-lg border transition-all duration-150 text-sm ${
                      formData.values.includes(value)
                        ? "bg-[#FACC15] border-[#FACC15] text-black"
                        : "bg-white dark:bg-[#2D3748] border-[#D1D5DB] dark:border-[#4B5563] text-black dark:text-white hover:border-[#FACC15]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Current Hobbies */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                Current Hobbies & Interests
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                Select your current hobbies and activities you enjoy.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hobbyOptions.map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => toggleArrayValue("currentHobbies", hobby)}
                    className={`p-3 rounded-lg border transition-all duration-150 text-sm ${
                      formData.currentHobbies.includes(hobby)
                        ? "bg-[#FACC15] border-[#FACC15] text-black"
                        : "bg-white dark:bg-[#2D3748] border-[#D1D5DB] dark:border-[#4B5563] text-black dark:text-white hover:border-[#FACC15]"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Future Interests & Skills */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold text-black dark:text-white mb-4">
                  Future Interests & Skills
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-8">
                  Tell us about what you'd like to explore and your current
                  skills.
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-black dark:text-white mb-3">
                  Hobbies or activities you want to try
                </label>
                <textarea
                  value={formData.futureHobbies}
                  onChange={(e) =>
                    updateFormData("futureHobbies", e.target.value)
                  }
                  placeholder="e.g., pottery, rock climbing, learning guitar, coding..."
                  className="w-full h-32 p-4 border border-[#D1D5DB] dark:border-[#4B5563] rounded-xl bg-white dark:bg-[#2D3748] text-black dark:text-white resize-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-black dark:text-white mb-3">
                  Skills, talents, and areas of expertise
                </label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => updateFormData("skills", e.target.value)}
                  placeholder="e.g., project management, public speaking, data analysis, creative writing..."
                  className="w-full h-32 p-4 border border-[#D1D5DB] dark:border-[#4B5563] rounded-xl bg-white dark:bg-[#2D3748] text-black dark:text-white resize-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-colors"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-150 ${
                currentStep === 1
                  ? "text-[#9CA3AF] cursor-not-allowed"
                  : "text-black dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#374151]"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-8 py-3 rounded-full transition-all duration-150 font-medium"
              >
                Generate My Profile
                <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#FACC15] hover:bg-[#F59E0B] text-black px-6 py-3 rounded-full transition-all duration-150 font-medium"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
