"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, AlertCircle } from "lucide-react";

// Modal Context definition
interface WaitlistModalContextType {
  isOpen: boolean;
  prefilledEmail: string;
  openModal: (email?: string) => void;
  closeModal: () => void;
}

const WaitlistModalContext = createContext<WaitlistModalContextType | undefined>(
  undefined
);

export function WaitlistModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  const openModal = (email?: string) => {
    if (email && typeof email === "string") {
      setPrefilledEmail(email);
    } else {
      setPrefilledEmail("");
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefilledEmail("");
  };

  return (
    <WaitlistModalContext.Provider value={{ isOpen, prefilledEmail, openModal, closeModal }}>
      {children}
    </WaitlistModalContext.Provider>
  );
}

export function useWaitlistModal() {
  const context = useContext(WaitlistModalContext);
  if (!context) {
    throw new Error(
      "useWaitlistModal must be used within a WaitlistModalProvider"
    );
  }
  return context;
}

const INTERESTS = [
  { id: "peer", label: "Peer-to-Peer Learning" },
  { id: "ai", label: "AI Study Assistant" },
  { id: "communities", label: "Learning Communities" },
  { id: "personalized", label: "Personalized Learning" },
  { id: "global", label: "Global Student Network" },
];

export default function WaitlistModal() {
  const { isOpen, closeModal, prefilledEmail } = useWaitlistModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [collegeYear, setCollegeYear] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [message, setMessage] = useState("");
  
  // Validation / submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (prefilledEmail) {
        setEmail(prefilledEmail);
      }
    }
  }, [isOpen, prefilledEmail]);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Reset form helper
  const handleReset = () => {
    setName("");
    setEmail("");
    setUserType("");
    setCollegeYear("");
    setUniversity("");
    setSelectedInterest("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setEmailWarning(false);
  };

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Auto-focus name field or modal container on open
      const firstInput = modalRef.current?.querySelector(
        'input, select, textarea, button, [tabindex="0"]'
      ) as HTMLElement;
      if (firstInput) {
        // Delay slightly for transition animation
        setTimeout(() => {
          firstInput.focus();
        }, 100);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeModal();
          handleReset();
          return;
        }

        if (e.key === "Tab") {
          if (!modalRef.current) return;

          // Find all focusable elements inside the modal
          const focusableSelector =
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
          const focusableElements = Array.from(
            modalRef.current.querySelectorAll(focusableSelector)
          ) as HTMLElement[];

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        
        // Restore focus to trigger element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, closeModal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // ── Client-side validation ────────────────────────────────────────────
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!userType) {
      newErrors.userType = "Please select your role";
    }

    if (userType === "Student" || userType === "Mentor") {
      if (!collegeYear) {
        newErrors.collegeYear = "Please select your college year";
      }
    }

    if (userType === "Student" || userType === "Mentor" || userType === "Teacher") {
      if (!university) {
        newErrors.university = "Please select your university";
      }
    }

    if (!selectedInterest) {
      newErrors.selectedInterest = "Please select what excites you most";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ── Submit to API ─────────────────────────────────────────────────────
    setIsSubmitting(true);

    const selectedInterestLabel =
      INTERESTS.find((i) => i.id === selectedInterest)?.label ?? selectedInterest;

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          userType,
          collegeYear,
          university,
          interest: selectedInterest,
          interestLabel: selectedInterestLabel,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Server returned an error — show inline error banner
        setSubmitError(
          result.error ??
            "Something went wrong. Please try again in a moment."
        );
        setIsSubmitting(false);
        return;
      }

      // ── Submission saved ───────────────────────────────────────────────
      if (result.emailError) {
        // Data saved but email notification failed
        setEmailWarning(true);
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    handleReset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0A2540]/30 backdrop-blur-md cursor-default"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-lg bg-white rounded-[24px] border border-slate-100 shadow-[0_24px_64px_rgba(10,37,64,0.18)] overflow-hidden z-10 flex flex-col my-8"
          >
            {/* Sapphire top border accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0077FF] via-[#3399ff] to-[#0077FF]" />

            {/* Top Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full text-[#8A94A6] hover:text-[#0A2540] hover:bg-[#EAF4FF] transition-all duration-200"
            >
              <X size={18} />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto max-h-[82vh] p-6 sm:p-8">
              {!isSubmitted ? (
                <>
                  {/* Title and Intro */}
                  <div className="mb-6 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-2.5"
                      style={{ background: "#EAF4FF", border: "1px solid rgba(0,119,255,0.20)", color: "#0077FF" }}>
                      ✨ Become an Early Member
                    </span>
                    <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight leading-tight mb-2">
                      Help us build the future of collaborative learning.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      Join our early community and tell us what excites you most.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Name input */}
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-[#0077FF]">*</span>
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border ${
                          errors.name
                            ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                            : "border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)]"
                        } placeholder:text-slate-300 focus:outline-none`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Email input */}
                    <div>
                      <label htmlFor="email-input" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-[#0077FF]">*</span>
                      </label>
                      <input
                        id="email-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border ${
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                            : "border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)]"
                        } placeholder:text-slate-300 focus:outline-none`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    {/* Dropdown */}
                    <div>
                      <label htmlFor="role-select" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                        You are a... <span className="text-[#0077FF]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="role-select"
                          value={userType}
                          onChange={(e) => {
                            setUserType(e.target.value);
                            setCollegeYear("");
                            setUniversity("");
                            if (errors.userType) setErrors({ ...errors, userType: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border appearance-none cursor-pointer ${
                            errors.userType
                              ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                              : "border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)]"
                          } placeholder:text-slate-300 focus:outline-none`}
                        >
                          <option value="" disabled hidden>Select your role</option>
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Mentor">Mentor</option>
                          <option value="Parent">Parent</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.userType && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.userType}</p>
                      )}
                    </div>

                    {/* College Year select */}
                    {(userType === "Student" || userType === "Mentor") && (
                      <div>
                        <label htmlFor="college-year-select" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                          College Year <span className="text-[#0077FF]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="college-year-select"
                            value={collegeYear}
                            onChange={(e) => {
                              setCollegeYear(e.target.value);
                              if (errors.collegeYear) setErrors({ ...errors, collegeYear: "" });
                            }}
                            className={`w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border appearance-none cursor-pointer ${
                              errors.collegeYear
                                ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                                : "border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)]"
                            } placeholder:text-slate-300 focus:outline-none`}
                          >
                            <option value="" disabled hidden>Select your year</option>
                            {userType === "Mentor" ? (
                              <>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                              </>
                            ) : (
                              <>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="Other">Other</option>
                              </>
                            )}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.collegeYear && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.collegeYear}</p>
                        )}
                      </div>
                    )}

                    {/* University select */}
                    {(userType === "Student" || userType === "Mentor" || userType === "Teacher") && (
                      <div>
                        <label htmlFor="university-select" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                          University <span className="text-[#0077FF]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="university-select"
                            value={university}
                            onChange={(e) => {
                              setUniversity(e.target.value);
                              if (errors.university) setErrors({ ...errors, university: "" });
                            }}
                            className={`w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border appearance-none cursor-pointer ${
                              errors.university
                                ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                                : "border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)]"
                            } placeholder:text-slate-300 focus:outline-none`}
                          >
                            <option value="" disabled hidden>Select your university</option>
                            <option value="GSFC University">GSFC University</option>
                            <option value="Other University">Other University</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.university && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.university}</p>
                        )}
                      </div>
                    )}

                    {/* Interest Selectable Cards */}
                    <div>
                      <span className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-2">
                        What excites you the most? <span className="text-[#0077FF]">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {INTERESTS.map((interest) => {
                          const isSelected = selectedInterest === interest.id;
                          return (
                            <button
                              key={interest.id}
                              type="button"
                              onClick={() => {
                                setSelectedInterest(interest.id);
                                if (errors.selectedInterest) {
                                  setErrors({ ...errors, selectedInterest: "" });
                                }
                              }}
                              className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-medium transition-all duration-200 ${
                                isSelected
                                  ? "border-[#0077FF] bg-[#EAF4FF] text-[#0077FF] shadow-[0_2px_12px_rgba(0,119,255,0.08)]"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <span>{interest.label}</span>
                              {isSelected && (
                                <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-[#0077FF] text-white p-0.5">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {errors.selectedInterest && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.selectedInterest}</p>
                      )}
                    </div>

                    {/* Message textarea */}
                    <div>
                      <label htmlFor="message-textarea" className="block text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-1.5">
                        Optional Message
                      </label>
                      <textarea
                        id="message-textarea"
                        placeholder="Tell us what you hope to see in OneJourney..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#0A2540] bg-white transition-all duration-200 border border-slate-200 focus:border-[#0077FF] focus:shadow-[0_0_0_3px_rgba(0,119,255,0.12)] placeholder:text-slate-300 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Server-side error banner */}
                    {submitError && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 font-medium">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-500" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Form actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-full sm:w-1/2 px-5 py-3 rounded-xl text-sm font-semibold text-[#0A2540] bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-1/2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                          boxShadow: "0 4px 16px rgba(0,119,255,0.30)",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          "Join the Waitlist"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-16 h-16 bg-[#EAF4FF] rounded-full flex items-center justify-center mb-6 text-[#0077FF]">
                    <Check size={36} strokeWidth={2.5} />
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3.5"
                    style={{ background: "#EAF4FF", border: "1px solid rgba(0,119,255,0.20)", color: "#0077FF" }}>
                    🎉 Thank You!
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight leading-tight mb-4">
                    You&apos;re now part of the OneJourney Early Community.
                  </h2>
                  
                  <p className="text-sm text-slate-500 mb-5 max-w-sm">
                    We&apos;ll keep you updated about platform news, events, and features.
                  </p>

                  {/* Soft warning if email notification failed */}
                  {emailWarning && (
                    <div className="w-full max-w-sm flex items-start gap-2.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-700 font-medium mb-5 text-left">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        Your submission was received and saved! We couldn&apos;t send the admin notification email, but you are officially on the waitlist.
                      </span>
                    </div>
                  )}

                  <div className="w-full max-w-sm bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left mb-8">
                    <p className="text-xs font-semibold text-[#0A2540] uppercase tracking-wider mb-3">
                      We&apos;ll keep you updated about:
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                      {[
                        "Platform development",
                        "Beta launch",
                        "New features",
                        "Community events",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-[#EAF4FF] text-[#0077FF] flex items-center justify-center flex-shrink-0">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full max-w-xs px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                      boxShadow: "0 4px 16px rgba(0,119,255,0.30)",
                    }}
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}