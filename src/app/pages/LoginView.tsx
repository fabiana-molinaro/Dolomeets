import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, ArrowRight, Camera, X, Mail, CreditCard } from "lucide-react";

type AuthMethod = "email" | "studentCard";

export function LoginView() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      setStudentCard(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setStudentCard(null);
    setPreview(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === "email") {
      if (!email || !password) {
        alert("Please enter both email and password");
        return;
      }

      // Basic email validation
      if (!email.includes("@")) {
        alert("Please enter a valid email address");
        return;
      }
    } else {
      if (!studentCard) {
        alert("Please upload your student card");
        return;
      }
    }

    setIsLoading(true);

    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      // Check if user has completed onboarding
      const onboardingComplete = localStorage.getItem("onboardingComplete");
      if (onboardingComplete === "true") {
        navigate("/app");
      } else {
        navigate("/onboarding");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#003366" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-3xl mb-2" style={{ color: "#003366" }}>
            Welcome to Dolomeets
          </h1>
          <p className="text-gray-600 text-sm">
            {authMethod === "email"
              ? "Sign in to your account"
              : "Verify your unibz student status"}
          </p>
        </div>

        {/* Auth Method Toggle */}
        <div className="mb-8 bg-gray-100 rounded-xl p-1 flex">
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className="flex-1 py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: authMethod === "email" ? "#003366" : "transparent",
              color: authMethod === "email" ? "white" : "#003366",
            }}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("studentCard")}
            className="flex-1 py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: authMethod === "studentCard" ? "#003366" : "transparent",
              color: authMethod === "studentCard" ? "white" : "#003366",
            }}
          >
            <CreditCard className="w-4 h-4" />
            Student Card
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {authMethod === "email" ? (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2"
                  style={{ color: "#003366" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@unibz.it"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#003366] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm mb-2"
                  style={{ color: "#003366" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#003366] focus:outline-none transition-colors"
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="studentCard"
                className="block text-sm mb-3"
                style={{ color: "#003366" }}
              >
                Upload Student Card Photo
              </label>

              {/* Upload Area */}
              {!preview ? (
                <label
                  htmlFor="studentCard"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#003366] hover:bg-gray-50 transition-all"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#F0F4FF" }}
                  >
                    <Camera className="w-8 h-8" style={{ color: "#003366" }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#003366" }}>
                    Take or upload a photo
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    id="studentCard"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={preview}
                    alt="Student card preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isLoading ||
              (authMethod === "email" ? !email || !password : !studentCard)
            }
            className="w-full py-4 rounded-xl text-white text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#003366" }}
            onMouseOver={(e) => {
              const isDisabled =
                isLoading ||
                (authMethod === "email" ? !email || !password : !studentCard);
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = "#002244";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#003366";
            }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {authMethod === "email" ? "Signing in..." : "Verifying..."}
                </span>
              </>
            ) : (
              <>
                {authMethod === "email" ? (
                  <ArrowRight className="w-5 h-5" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>
                  {authMethod === "email" ? "Sign In" : "Verify & Continue"}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {authMethod === "email"
              ? "Your data is protected and never shared with third parties"
              : "Your student card photo is used only for verification purposes"}
          </p>
        </div>
      </div>
    </div>
  );
}