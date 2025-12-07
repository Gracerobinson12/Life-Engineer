import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUpWithCredentials } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/profile",
        redirect: true,
      });
    } catch (err) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-inter">
      <div className="w-full max-w-[440px]">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <div className="text-4xl font-bold text-[#F59E0B]">Life Engineer</div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#FCD34D] rounded-[12px] p-8 shadow-lg">
          <h1 className="text-[28px] font-bold text-[#1F2937] mb-2 text-center">
            Create your account
          </h1>
          <p className="text-[16px] text-[#6B7280] mb-8 text-center">
            Get started with your free account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-[14px] font-medium text-[#1F2937] mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[48px] px-4 bg-white border-2 border-[#FEF3C7] rounded-[8px] text-[15px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-[14px] font-medium text-[#1F2937] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[48px] px-4 bg-white border-2 border-[#FEF3C7] rounded-[8px] text-[15px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
                placeholder="At least 8 characters"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[14px] font-medium text-[#1F2937] mb-2"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-[48px] px-4 bg-white border-2 border-[#FEF3C7] rounded-[8px] text-[15px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
                placeholder="Re-enter your password"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-[8px] text-[15px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 hover:opacity-90 active:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-[#FCD34D]"></div>
            <span className="text-[13px] text-[#9CA3AF]">OR</span>
            <div className="flex-1 h-[1px] bg-[#FCD34D]"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-[14px] text-[#6B7280]">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#F59E0B] font-semibold hover:text-[#D97706] transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

