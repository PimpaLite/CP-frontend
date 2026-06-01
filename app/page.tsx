"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const StarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-warm-yellow drop-shadow-[0_0_8px_#FFD700] ${className}`}>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-warm-yellow drop-shadow-[0_0_8px_#FFD700] ${className}`}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function OpeningPage() {
  const [step, setStep] = useState(0); 
  const [selectedRole, setSelectedRole] = useState<"reader" | "author" | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  const router = useRouter(); 

  // Initial zoom out timer
  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 3200); 
    return () => clearTimeout(timer);
  }, []);

  // FIXED ROUTING LOGIC: Transports you to the correct page after the door swings open
  useEffect(() => {
    if (step === 4) {
      const transitionTimer = setTimeout(() => {
        if (selectedRole === "author") {
          router.push("/author/dashboard");
        } else {
          router.push("/discovery");
        }
      }, 1000); 
      return () => clearTimeout(transitionTimer);
    }
  }, [step, router, selectedRole]);

  const handleRoleSelection = (role: "reader" | "author") => {
    setSelectedRole(role);
    setStep(3); 
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); 
    console.log(`Authenticating ${selectedRole} via ${authMode}... unlocking door.`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-deep-charcoal">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(90deg,#1a110c_0px,#1a110c_38px,#241710_38px,#241710_40px)] bg-[length:40px_100%]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,48,34,0.6)_0%,_rgba(30,26,46,0.9)_100%)]"></div>

      <div className="absolute inset-0 flex items-center justify-center scale-[0.80] md:scale-[0.85] pointer-events-none z-10">
        
        {/* --- THE DETAILED STOREFRONT --- */}
        <div className={`relative flex flex-col items-center justify-center origin-center w-full pointer-events-auto ${step === 0 ? 'animate-zoom-out' : 'scale-100 opacity-100'}`}>
          
          <div className="absolute inset-x-0 bottom-0 top-1/4 opacity-20 bg-[linear-gradient(180deg,transparent_0px,transparent_18px,#000_19px,#000_20px)] bg-[length:100%_20px] pointer-events-none"></div>

          {/* 1. The Signboard */}
          <div className="relative z-30 px-12 py-6 md:px-20 md:py-8 bg-gradient-to-b from-[#3E2723] to-[#1E110C] border-[6px] border-[#5D4037] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] transform-gpu rotate-x-2 w-11/12 max-w-5xl flex items-center justify-center">
            <div className="absolute inset-2 border-2 border-warm-yellow/10 rounded-lg pointer-events-none"></div>
            
            <StarIcon className="absolute top-4 left-6 w-6 h-6 animate-pulse" />
            <StarIcon className="absolute bottom-4 left-16 w-4 h-4 animate-pulse delay-150" />
            <BookIcon className="absolute top-4 right-6 w-10 h-10 transform rotate-12" />
            <StarIcon className="absolute bottom-6 right-20 w-3 h-3 animate-pulse delay-300" />

            <h1 className="text-5xl md:text-7xl text-warm-yellow tracking-widest text-center relative z-10" style={{ textShadow: "0 4px 10px rgba(0,0,0,0.9), 0 0 20px rgba(255,215,0,0.6)" }}>
              BACKISSUE
            </h1>
          </div>

          {/* 2. The Scalloped Awning */}
          <div className="relative z-20 w-11/12 max-w-5xl h-12 md:h-16 flex shadow-[0_15px_30px_rgba(0,0,0,0.8)] -mt-2">
            {[...Array(14)].map((_, i) => (
                <div key={i} className={`flex-1 h-full rounded-b-full border-b-4 border-black/30 shadow-inner ${i % 2 === 0 ? 'bg-deep-purple' : 'bg-muted-lavender'}`} />
            ))}
          </div>

          {/* 3. String Lights */}
          <div className="relative z-10 w-10/12 max-w-4xl h-4 flex justify-around -mt-2">
            {[...Array(11)].map((_, i) => (
                <div key={i} className="w-2 h-2 md:w-3 md:h-3 bg-warm-yellow rounded-full shadow-[0_0_10px_#FFD700,0_0_20px_#FFD700]" />
            ))}
          </div>

          {/* 4. Windows, Door, Bench, and Plants */}
          <div className="relative z-0 w-11/12 max-w-5xl h-72 md:h-96 border-t-8 border-[#2A1A12] bg-gradient-to-t from-[#0a0604] to-[#1E110C] flex justify-between px-2 md:px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] mt-2">
            
            {/* Left Plant */}
            <div className="absolute -left-6 md:-left-12 bottom-0 w-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#2D4A22] rounded-full absolute -top-8 -left-2 shadow-inner border border-black/30"></div>
              <div className="w-10 h-10 bg-[#3A5F2B] rounded-full absolute -top-10 right-0 shadow-inner border border-black/30"></div>
              <div className="w-10 h-12 bg-[#A0522D] border-t-4 border-[#8B4513] rounded-b-lg shadow-[inset_-5px_0_10px_rgba(0,0,0,0.5)] z-10"></div>
            </div>

            {/* --- LEFT WINDOW --- */}
            <div className="relative w-[38%] h-full border-x-[10px] border-[#1a110c] bg-white/5 flex flex-col justify-end pb-2 px-2 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,215,0,0.15),_transparent)] pointer-events-none"></div>
              
              <div className="absolute top-0 inset-x-0 flex justify-around">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] ${i % 2 === 0 ? 'border-t-soft-coral' : 'border-t-soft-violet'} opacity-80 shadow-md`}></div>
                ))}
              </div>

              <div className="flex justify-around items-end h-20 opacity-90 z-10 relative px-2 mb-1">
                  <div className="w-[22%] h-full bg-soft-coral rounded-sm border border-black/50 shadow-md flex flex-col pt-1 items-center"><div className="w-2/3 h-1 bg-black/30"></div></div>
                  <div className="w-[22%] h-[85%] bg-white rounded-sm border border-black/50 shadow-md transform rotate-3 flex flex-col pt-1 items-center"><div className="w-2/3 h-1 bg-black/30"></div></div>
                  <div className="w-[22%] h-[95%] bg-muted-lavender rounded-sm border border-black/50 shadow-md flex flex-col pt-1 items-center"><div className="w-2/3 h-1 bg-black/30"></div></div>
                  <div className="w-[22%] h-full bg-warm-yellow rounded-sm border border-black/50 shadow-md transform -rotate-2 flex flex-col pt-1 items-center"><div className="w-2/3 h-1 bg-black/30"></div></div>
              </div>
              <div className="w-full h-3 bg-[#3E2723] border-b-2 border-black/50 mb-4 z-10 relative shadow-[0_5px_10px_rgba(0,0,0,0.5)]"></div>

              <div className="flex justify-around items-end h-24 opacity-90 z-10 relative px-1">
                  <div className="w-[30%] h-full bg-white rounded-sm border border-black/50 shadow-md p-1"><div className="w-full h-full bg-deep-purple flex items-center justify-center"><StarIcon className="w-4 h-4 text-white"/></div></div>
                  <div className="w-[30%] h-[90%] bg-white rounded-sm border border-black/50 shadow-md transform -rotate-2 p-1"><div className="w-full h-full bg-soft-coral flex flex-col pt-1"><div className="w-3/4 h-1 bg-black/20 mx-auto"></div></div></div>
                  <div className="w-[30%] h-[95%] bg-white rounded-sm border border-black/50 shadow-md p-1"><div className="w-full h-full bg-muted-lavender flex items-center justify-center border border-black/10"></div></div>
              </div>
              <div className="w-full h-3 bg-[#3E2723] border-b-2 border-black/50 mt-1 z-10 relative shadow-[0_5px_10px_rgba(0,0,0,0.5)]"></div>
            </div>
            
            {/* Wooden Bench */}
            <div className="absolute left-[8%] bottom-0 w-[26%] h-14 z-20 flex flex-col justify-end items-center pointer-events-none">
              <div className="absolute bottom-6 left-4 flex flex-col items-center z-30">
                  <div className="w-10 h-2 bg-soft-violet border border-black/80 rounded-sm transform rotate-2"></div>
                  <div className="w-12 h-2.5 bg-warm-yellow border border-black/80 rounded-sm"></div>
                  <div className="w-11 h-2 bg-white border border-black/80 rounded-sm transform -rotate-1"></div>
              </div>
              <div className="absolute bottom-6 right-2 flex items-end z-30">
                  <div className="w-3 h-10 bg-soft-coral border border-black/80 rounded-sm transform -rotate-6"></div>
                  <div className="w-3 h-12 bg-deep-purple border border-black/80 rounded-sm transform -rotate-2"></div>
              </div>
              <div className="w-full h-3 bg-[#5D4037] border-y border-[#3E2723] shadow-[0_5px_10px_rgba(0,0,0,0.5)]"></div>
              <div className="w-5/6 flex justify-between">
                  <div className="w-2 h-10 bg-[#2A1A12] border-x border-[#1a110c]"></div>
                  <div className="w-2 h-10 bg-[#2A1A12] border-x border-[#1a110c]"></div>
              </div>
            </div>

            {/* --- CENTER DOOR --- */}
            <div className="relative w-[24%] h-full border-x-[12px] border-t-[12px] border-[#1a110c] bg-[#0a0604] perspective-1000 shadow-inner overflow-visible z-10">
              
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.3)_0%,_rgba(0,0,0,0.9)_100%)] flex items-center justify-center">
                   <div className="text-warm-yellow/80 font-bold tracking-[0.3em] text-lg text-center drop-shadow-[0_0_10px_#FFD700]">
                     ENTERING<br/>STORE
                   </div>
                </div>
              </div>

              <div 
                onClick={() => step === 1 && setStep(2)}
                className={`absolute inset-0 bg-gradient-to-b from-[#3E2723] to-[#241710] flex flex-col items-center justify-start pt-4 transition-all duration-1000 ease-in-out origin-left border-r border-[#1a110c] ${step === 1 ? 'cursor-pointer hover:brightness-125 group shadow-[0_0_30px_rgba(107,63,160,0.3)]' : ''}`}
                style={{ 
                  transform: step === 4 ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="grid grid-cols-2 gap-2 w-3/4 mb-4">
                    <div className="h-10 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                    <div className="h-10 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-3/4 mb-4">
                    <div className="h-20 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                    <div className="h-20 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-3/4 relative">
                    <div className="h-16 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                    <div className="h-16 border-4 border-[#1a110c] bg-black/10 rounded-sm shadow-inner"></div>
                </div>

                <div className="absolute bottom-6 w-16 h-3 bg-gradient-to-r from-yellow-700 via-warm-yellow to-yellow-700 border border-black/60 rounded-sm shadow-md flex items-center justify-center">
                  <div className="w-12 h-1 bg-black/80 rounded-full"></div>
                </div>

                <div className="absolute left-2 md:left-3 top-[55%] flex flex-col items-center gap-1">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-warm-yellow to-yellow-700 shadow-md border border-black/80"></div>
                </div>

                <div className={`absolute right-1 md:right-2 top-[52%] -translate-y-1/2 w-6 h-16 md:w-8 md:h-20 bg-[#1E1A2E] border-2 border-deep-purple rounded-md flex flex-col items-center justify-evenly transition-all duration-300 shadow-[2px_2px_10px_rgba(0,0,0,0.8)] ${step === 1 ? 'group-hover:shadow-[0_0_15px_#9B59B6]' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-[#4ade80] shadow-[0_0_15px_#4ade80]' : step >= 2 ? 'bg-warm-yellow shadow-[0_0_10px_#FFD700]' : 'bg-soft-coral shadow-[0_0_10px_#E8635A] animate-pulse'}`}></div>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-colors ${step >= 4 ? 'bg-[#4ade80]/50' : 'bg-white/20'}`}></div>
                      ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-warm-yellow text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap pointer-events-none border border-warm-yellow/30 shadow-2xl">
                      Click Lock to Enter
                    </div>
                )}
              </div>
            </div>

            {/* --- RIGHT WINDOW --- */}
            <div className="relative w-[38%] h-full border-x-[10px] border-[#1a110c] bg-white/5 shadow-inner overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,215,0,0.25),_transparent)] pointer-events-none z-0"></div>
              
              <div className="absolute top-0 inset-x-0 flex justify-around z-10">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] ${i % 2 === 0 ? 'border-t-muted-lavender' : 'border-t-warm-yellow'} opacity-80 shadow-md`}></div>
                ))}
              </div>

              <div className="absolute top-0 right-4 w-10 flex flex-col items-center z-10 opacity-90">
                 <div className="w-1 h-6 bg-black/40"></div>
                 <div className="w-6 h-4 bg-[#8B4513] rounded-b-md"></div>
                 <div className="flex gap-1 -mt-1">
                    <div className="w-1 h-12 bg-[#2D4A22] rounded-full shadow-sm"></div>
                    <div className="w-1 h-16 bg-[#3A5F2B] rounded-full shadow-sm"></div>
                    <div className="w-1 h-8 bg-[#2D4A22] rounded-full shadow-sm"></div>
                 </div>
              </div>

              <div className="absolute top-6 left-8 w-12 h-16 border-2 border-[#1a110c] bg-soft-violet shadow-inner flex flex-col items-center justify-center opacity-80 z-0">
                <div className="w-8 h-8 bg-white/20 rounded-full mb-1"></div>
                <div className="w-8 h-1 bg-white/40"></div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end opacity-40 z-0">
                  <div className="w-full h-1/4 border-b-2 border-black/50"></div>
                  <div className="w-full h-1/4 border-b-2 border-black/50"></div>
                  <div className="w-full h-1/4 border-b-2 border-black/50"></div>
              </div>
              
              <div className="absolute bottom-2 left-4 flex gap-4 items-end z-10">
                 <div className="flex flex-col items-center relative">
                    <div className="absolute top-4 w-24 h-24 bg-gradient-to-b from-warm-yellow/30 to-transparent pointer-events-none -ml-4 rotate-12 origin-top"></div>
                    <div className="w-6 h-3 bg-soft-coral rounded-t-full shadow-[0_-2px_10px_rgba(232,99,90,0.8)] border border-black/30 z-10"></div>
                    <div className="w-1 h-6 bg-warm-yellow border-x border-black/20"></div>
                    <div className="w-8 h-1 bg-[#1a110c] rounded-full"></div>
                 </div>
                 <div className="flex flex-col items-center mb-1">
                    <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse -translate-y-1 rotate-12"></div>
                    <div className="w-4 h-5 bg-white rounded-sm border border-black/30 shadow-md"></div>
                 </div>
              </div>

              <div className="absolute bottom-2 right-4 md:right-8 w-24 h-32 flex flex-col items-center justify-end z-20">
                  <div className="relative w-10 h-12 mb-1 z-10">
                      <div className="absolute inset-0 bg-[#0a0604] rounded-t-full rounded-b-md"></div>
                      <div className="absolute right-1 top-2 w-8 h-8 bg-[#1a110c] rounded-full"></div>
                      <div className="absolute right-2 bottom-0 w-6 h-6 bg-[#0a0604] rounded-b-full"></div>
                  </div>
                  <div className="w-20 h-16 bg-[#1a110c] rounded-t-[2rem] rounded-bl-md shadow-inner flex items-center justify-start pl-2">
                      <div className="w-8 h-3 bg-[#0a0604] rounded-full rotate-45 transform origin-left mt-2"></div>
                  </div>
                  <div className="absolute bottom-8 -left-2 w-10 h-6 bg-warm-yellow/90 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.6)] rotate-[-15deg] flex items-center justify-center">
                      <div className="w-px h-full bg-black/30"></div>
                  </div>
              </div>

              <div className="w-full h-3 bg-[#3E2723] border-t-2 border-black/50 mt-auto z-10 relative shadow-[0_-5px_10px_rgba(0,0,0,0.3)]"></div>
            </div>

            {/* Right Plant */}
            <div className="absolute -right-6 md:-right-12 bottom-0 w-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#3A5F2B] rounded-full absolute -top-8 -right-1 shadow-inner border border-black/30 z-10"></div>
              <div className="w-12 h-12 bg-[#2D4A22] rounded-full absolute -top-12 left-0 shadow-inner border border-black/30"></div>
              <div className="w-10 h-12 bg-[#A0522D] border-t-4 border-[#8B4513] rounded-b-lg shadow-[inset_-5px_0_10px_rgba(0,0,0,0.5)] z-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE DYNAMIC LOCK PANEL --- */}
      {step >= 2 && (
        <div className={`absolute z-40 transition-all duration-700 ease-in-out ${step === 4 ? 'opacity-0 translate-y-20 scale-90 pointer-events-none' : 'animate-fade-in-up'}`}>
          <div className="bg-ghost-lavender/95 backdrop-blur-xl border-2 border-soft-lilac p-8 md:p-10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-80 md:w-96 ring-1 ring-white/50 relative">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-ghost-lavender/95 border-b-2 border-r-2 border-soft-lilac rotate-45"></div>

            {/* STATE 2: ROLE SELECTION */}
            {step === 2 && (
              <div className="flex flex-col items-center animate-fade-in-up">
                <h2 className="text-3xl text-deep-charcoal mb-2 font-bold drop-shadow-sm">Identify</h2>
                <p className="text-muted-mauve mb-8 text-sm font-medium">Select your role to proceed.</p>
                <div className="flex flex-col gap-4 w-full">
                  <button onClick={() => handleRoleSelection("reader")} className="group relative w-full py-4 bg-[#A68A78] hover:bg-[#8D7362] border-2 border-[#8A6A55] hover:border-deep-purple text-deep-charcoal font-bold text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-inner hover:shadow-[0_10px_20px_rgba(107,63,160,0.2)] flex items-center justify-center gap-3">
                    <span className="w-4 h-4 rounded-sm border-2 border-deep-charcoal group-hover:bg-deep-purple group-hover:border-deep-purple transition-colors"></span>
                    I am a Reader
                  </button>
                  <button onClick={() => handleRoleSelection("author")} className="group relative w-full py-4 bg-[#A68A78] hover:bg-[#8D7362] border-2 border-[#8A6A55] hover:border-deep-purple text-deep-charcoal font-bold text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-inner hover:shadow-[0_10px_20px_rgba(107,63,160,0.2)] flex items-center justify-center gap-3">
                    <span className="w-4 h-4 rounded-sm border-2 border-deep-charcoal group-hover:bg-deep-purple group-hover:border-deep-purple transition-colors"></span>
                    I am an Author
                  </button>
                </div>
              </div>
            )}

            {/* STATE 3: LOGIN / REGISTER FORM */}
            {step === 3 && (
              <div className="flex flex-col items-center animate-fade-in-up">
                <div className="w-full flex justify-between items-center mb-6">
                  <button onClick={() => setStep(2)} className="text-muted-mauve hover:text-deep-charcoal transition-colors text-sm font-medium flex items-center gap-1">
                    ← Back
                  </button>
                  <span className="text-deep-charcoal text-xs font-bold uppercase tracking-wider bg-warm-yellow px-3 py-1 rounded-full shadow-sm">
                    {selectedRole}
                  </span>
                </div>
                
                <h2 className="text-3xl text-deep-charcoal mb-2 font-bold drop-shadow-sm">
                  {authMode === "login" ? "Welcome Back" : "Join the Club"}
                </h2>
                
                <form onSubmit={handleAuthSubmit} className="w-full flex flex-col gap-4 mt-6">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    className="w-full bg-[#A68A78]/30 border-2 border-[#A68A78] text-deep-charcoal placeholder:text-deep-charcoal/60 px-4 py-3 rounded-xl focus:outline-none focus:border-deep-purple focus:ring-1 focus:ring-deep-purple transition-all"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    className="w-full bg-[#A68A78]/30 border-2 border-[#A68A78] text-deep-charcoal placeholder:text-deep-charcoal/60 px-4 py-3 rounded-xl focus:outline-none focus:border-deep-purple focus:ring-1 focus:ring-deep-purple transition-all"
                  />
                  <button type="submit" className="w-full mt-2 py-4 bg-deep-purple hover:bg-[#4A2880] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_5px_15px_rgba(107,63,160,0.3)] hover:shadow-[0_10px_25px_rgba(107,63,160,0.5)]">
                    {authMode === "login" ? "Unlock Door" : "Create Key"}
                  </button>
                </form>

                <button 
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="mt-6 text-muted-mauve hover:text-deep-purple text-sm transition-colors font-medium"
                >
                  {authMode === "login" ? "Need an account? Register." : "Already have a key? Login."}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}