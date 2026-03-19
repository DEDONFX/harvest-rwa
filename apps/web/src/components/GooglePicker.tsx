"use client";

import { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";

const MOCK_ACCOUNTS = [
  {
    id: "alex",
    name: "Alex Johnson",
    email: "alex.johnson@gmail.com",
    avatar: "AJ",
    color: "bg-blue-600",
  },
  {
    id: "aj2",
    name: "Alex J.",
    email: "alexj.work@gmail.com",
    avatar: "A",
    color: "bg-green-600",
  },
];

type Stage = "pick" | "authorising" | "done";

interface GooglePickerProps {
  onSuccess: (name: string, email: string) => void;
  onClose: () => void;
  intent?: "signin" | "signup";
}

export default function GooglePicker({ onSuccess, onClose, intent }: GooglePickerProps) {
  const [stage, setStage] = useState<Stage>("pick");
  const [selected, setSelected] = useState<(typeof MOCK_ACCOUNTS)[0] | null>(null);

  const handleSelect = (account: (typeof MOCK_ACCOUNTS)[0]) => {
    setSelected(account);
    setStage("authorising");
    setTimeout(() => {
      setStage("done");
      // Give the "done" UI a moment to show, then hand off
      setTimeout(() => onSuccess(account.name, account.email), 800);
    }, 1600);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Picker card — intentionally white/light like real Google */}
      <div className="w-[360px] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ background: "#fff", color: "#202124" }}>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-[#e0e0e0]">
          {/* Google logo (SVG inline for authenticity) */}
          <svg className="mx-auto mb-4" width="75" height="24" viewBox="0 0 75 24">
            <path d="M30.2 12.3c0-.8-.1-1.6-.2-2.4H15.4v4.6h8.4c-.4 2-1.5 3.7-3.2 4.8v4h5.1c3-2.7 4.5-6.7 4.5-11z" fill="#4285F4"/>
            <path d="M15.4 24c4.2 0 7.8-1.4 10.4-3.8l-5.1-4c-1.4.9-3.1 1.5-5.3 1.5-4.1 0-7.5-2.7-8.7-6.4H.5v4.1C3 21.3 8.9 24 15.4 24z" fill="#34A853"/>
            <path d="M6.7 14.3c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9V4.4H.5C-.2 6-.5 7.9-.5 9.9s.3 3.9 1 5.5l6.2-1.1z" fill="#FBBC05"/>
            <path d="M15.4 4.8c2.3 0 4.4.8 6 2.4l4.5-4.5C23.2 1.2 19.6-.1 15.4-.1 8.9-.1 3 2.7.5 7.3l6.2 4.1c1.2-3.7 4.6-6.6 8.7-6.6z" fill="#EA4335"/>
            <text x="38" y="18" fontFamily="Product Sans, Arial, sans-serif" fontSize="16" fontWeight="500" fill="#202124">oogle</text>
          </svg>

          {stage === "pick" && (
            <>
              <h2 className="text-[18px] font-normal mb-1" style={{ fontFamily: "Google Sans, Roboto, sans-serif" }}>
                Sign in
              </h2>
              <p className="text-sm text-[#5f6368]">
                to continue to <span className="font-medium text-[#202124]">Harvest.rwa</span>
              </p>
            </>
          )}

          {(stage === "authorising" || stage === "done") && selected && (
            <>
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-full ${selected.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}>
                {selected.avatar}
              </div>
              <p className="text-[16px] font-medium">{selected.name}</p>
              <p className="text-sm text-[#5f6368]">{selected.email}</p>
            </>
          )}
        </div>

        {/* Body */}
        <div className="px-2 py-2">
          {stage === "pick" && (
            <>
              <p className="px-4 py-2 text-xs text-[#5f6368]">Choose an account</p>
              {MOCK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSelect(acc)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f1f3f4] transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-full ${acc.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#202124] truncate">{acc.name}</p>
                    <p className="text-xs text-[#5f6368] truncate">{acc.email}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#5f6368] shrink-0" />
                </button>
              ))}

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f1f3f4] transition-colors text-left">
                <div className="w-10 h-10 rounded-full border-2 border-[#dadce0] flex items-center justify-center shrink-0">
                  <span className="text-[#5f6368] text-lg">+</span>
                </div>
                <p className="text-sm text-[#202124]">Use another account</p>
              </button>
            </>
          )}

          {stage === "authorising" && (
            <div className="py-8 text-center">
              {/* Google spinner */}
              <div className="w-10 h-10 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-[#e0e0e0]" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#4285F4] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-sm text-[#5f6368]">Signing you in…</p>
            </div>
          )}

          {stage === "done" && (
            <div className="py-8 text-center">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[#34A853] flex items-center justify-center">
                <Check size={20} className="text-white" />
              </div>
              <p className="text-sm text-[#202124] font-medium">Signed in successfully</p>
              <p className="text-xs text-[#5f6368] mt-1">Redirecting to Harvest.rwa…</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {stage === "pick" && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#e0e0e0]">
            <div className="flex gap-3 text-xs text-[#5f6368]">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
            <button
              onClick={onClose}
              className="text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
