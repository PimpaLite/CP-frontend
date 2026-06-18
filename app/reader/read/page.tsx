"use client";

import { useState, useEffect, TouchEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// The mock database of comics to match what's on the Discovery Page
const comicDatabase: Record<string, { title: string, pages: { id: number, text: string, image: string }[] }> = {
  "1": { title: "The Last Arc", pages: [] },
  "2": { 
    title: "Neon Drift", 
    pages: [
      // Using forced portrait dimensions (800x1200) so they look like real comic pages!
      { id: 1, text: "", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&h=1200&auto=format&fit=crop" },
      { id: 2, text: "", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&h=1200&auto=format&fit=crop" },
      { id: 3, text: "", image: "https://images.unsplash.com/photo-1563242445-66795f76cc78?q=80&w=800&h=1200&auto=format&fit=crop" },
      { id: 4, text: "", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800&h=1200&auto=format&fit=crop" },
    ] 
  },
  "3": { title: "Echoes", pages: [] },
};

// Fallback pages if a comic isn't set up in our dummy database yet
const defaultPages = [
  { id: 1, text: "COVER", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&h=1200&auto=format&fit=crop" },
  { id: 2, text: "PAGE 1", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&h=1200&auto=format&fit=crop" },
];

function ReaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Grab the exact comic ID you clicked from the URL
  const comicId = searchParams.get("id") || "2"; 
  const currentComic = comicDatabase[comicId] || { title: "Unknown Issue", pages: defaultPages };
  const pages = currentComic.pages.length > 0 ? currentComic.pages : defaultPages;

  const [currentPage, setCurrentPage] = useState(0);
  const [showUI, setShowUI] = useState(true);
  
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showUI) {
      timeout = setTimeout(() => {
        setShowUI(false);
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [showUI, currentPage]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
      setShowUI(true); 
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setShowUI(true);
    }
  };

  const toggleUI = () => {
    setShowUI((prev) => !prev);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextPage();
    if (isRightSwipe) prevPage();
  };

  return (
    <main 
      className="fixed inset-0 w-full h-full bg-[#ECE8F5] overflow-hidden flex flex-col items-center justify-center select-none font-sans"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* TOP CINEMATIC BAR */}
      <div 
        className={`absolute top-0 left-0 w-full px-8 pt-10 pb-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-50 flex items-start justify-between transition-all duration-700 ease-in-out ${showUI ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'}`}
      >
        <button 
          onClick={() => router.back()} 
          className="group text-white/80 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors flex items-center gap-3 drop-shadow-lg"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Exit Issue
        </button>
        
        {/* Dynamic Title based on what you clicked! */}
        <h2 className="text-white/90 font-black tracking-[0.2em] uppercase text-sm drop-shadow-lg mt-1">
          {currentComic.title}
        </h2>
        
        <div className="w-[100px]"></div> 
      </div>


      {/* THE COMIC CANVAS */}
      <div className="relative w-full max-w-3xl aspect-[2/3] h-[100vh] md:h-[85vh] shadow-2xl md:rounded-xl overflow-hidden bg-black">
        
        {/* The sliding track */}
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page) => (
            <div key={page.id} className="w-full h-full shrink-0 relative flex items-center justify-center bg-deep-charcoal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={page.image} 
                alt={`Page ${page.id}`} 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
              {/* Only show text if the image doesn't load or if it's explicitly set */}
              {page.text && (
                <span className="relative z-10 text-white/80 text-4xl font-black tracking-[0.3em] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] pointer-events-none">
                  {page.text}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* INVISIBLE CLICK ZONES */}
        <div className="absolute inset-0 flex z-40">
          <div onClick={prevPage} className="w-1/3 h-full cursor-w-resize" title="Previous Page"></div>
          <div onClick={toggleUI} className="w-1/3 h-full cursor-pointer" title="Toggle Menu"></div>
          <div onClick={nextPage} className="w-1/3 h-full cursor-e-resize" title="Next Page"></div>
        </div>

      </div>


      {/* BOTTOM FLOATING PROGRESS PILL */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-all duration-700 ease-out ${showUI ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <div className="backdrop-blur-xl bg-black/60 border border-white/10 px-8 py-4 rounded-full flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          
          <span className="text-white/70 text-xs font-bold tracking-widest uppercase min-w-[60px] text-right">
            {currentPage === 0 ? "Cover" : `Pg ${currentPage}`}
          </span>
          
          <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-warm-yellow rounded-full shadow-[0_0_12px_rgba(255,215,0,0.6)] transition-all duration-500 ease-out"
              style={{ width: `${(currentPage / (pages.length - 1 || 1)) * 100}%` }}
            ></div>
          </div>

          <span className="text-white/40 text-xs font-bold tracking-widest min-w-[60px] text-left">
            {pages.length - 1}
          </span>

        </div>
      </div>

    </main>
  );
}

// Next.js requires components using useSearchParams to be wrapped in a Suspense boundary
export default function ComicReaderWrapper() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#ECE8F5] flex items-center justify-center">Loading Issue...</div>}>
      <ReaderContent />
    </Suspense>
  );
}