import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Users,
  Laptop,
  Mountain,
  Languages,
  Dumbbell,
  Check
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: "Study",
    name: "Study & Academic",
    icon: <BookOpen className="w-6 h-6" />,
    color: "#003366"
  },
  {
    id: "Social",
    name: "Social Events",
    icon: <Users className="w-6 h-6" />,
    color: "#FF8C00"
  },
  {
    id: "Tech",
    name: "Tech & Innovation",
    icon: <Laptop className="w-6 h-6" />,
    color: "#003366"
  },
  {
    id: "Outdoor",
    name: "Outdoor Activities",
    icon: <Mountain className="w-6 h-6" />,
    color: "#28A745"
  },
  {
    id: "Language",
    name: "Language Exchange",
    icon: <Languages className="w-6 h-6" />,
    color: "#003366"
  },
  {
    id: "Sports",
    name: "Sports & Fitness",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "#28A745"
  },
];

export function OnboardingFlow() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Save preferences to localStorage
      localStorage.setItem("favoriteCategories", JSON.stringify(selectedCategories));
      localStorage.setItem("onboardingComplete", "true");
      navigate("/app");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingComplete", "true");
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: step === 1 ? "#FF8C00" : "#003366",
            }}
          />
          <div
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: step === 2 ? "#FF8C00" : "#E5E7EB",
            }}
          />
        </div>

        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
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

        {/* Content */}
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2" style={{ color: "#003366" }}>
                What are you interested in?
              </h1>
              <p className="text-gray-600 text-sm">
                Select your favorite event types to get personalized recommendations
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className="relative p-6 rounded-xl border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected ? "#FF8C00" : "#E5E7EB",
                      backgroundColor: isSelected ? "#FFF5E6" : "white",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#FF8C00" }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className="mb-3"
                      style={{ color: isSelected ? category.color : "#6B7280" }}
                    >
                      {category.icon}
                    </div>
                    <h3
                      className="text-sm"
                      style={{ color: isSelected ? category.color : "#111827" }}
                    >
                      {category.name}
                    </h3>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2" style={{ color: "#003366" }}>
                You're all set! 🎉
              </h1>
              <p className="text-gray-600 text-sm">
                We'll show you events matching your interests
              </p>
            </div>

            {/* Selected Categories Summary */}
            {selectedCategories.length > 0 && (
              <div className="mb-8 p-6 rounded-xl bg-gray-50">
                <h3 className="text-sm mb-3" style={{ color: "#003366" }}>
                  Your Interests:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((catId) => {
                    const category = categories.find((c) => c.id === catId);
                    if (!category) return null;
                    return (
                      <div
                        key={catId}
                        className="px-4 py-2 rounded-full text-sm text-white"
                        style={{ backgroundColor: "#FF8C00" }}
                      >
                        {category.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid gap-4 mb-8">
              <div className="p-4 rounded-xl border-2 border-gray-200 flex gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFF5E6" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF8C00"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm mb-1" style={{ color: "#003366" }}>
                    Discover Events Near You
                  </h4>
                  <p className="text-xs text-gray-600">
                    Find events happening around unibz and NOI Techpark
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-gray-200 flex gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#E6F4EA" }}
                >
                  <Users className="w-5 h-5" style={{ color: "#28A745" }} />
                </div>
                <div>
                  <h4 className="text-sm mb-1" style={{ color: "#003366" }}>
                    Connect with Students
                  </h4>
                  <p className="text-xs text-gray-600">
                    Meet people who share your interests and hobbies
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-4 rounded-xl text-base transition-all border-2"
            style={{
              color: "#003366",
              borderColor: "#E5E7EB",
              backgroundColor: "white",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            disabled={step === 1 && selectedCategories.length === 0}
            className="flex-1 py-4 rounded-xl text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#FF8C00" }}
            onMouseOver={(e) => {
              if (!(step === 1 && selectedCategories.length === 0)) {
                e.currentTarget.style.backgroundColor = "#E67E00";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#FF8C00";
            }}
          >
            {step === 1 ? "Continue" : "Start Exploring"}
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            You can always change your preferences in settings
          </p>
        </div>
      </div>
    </div>
  );
}
