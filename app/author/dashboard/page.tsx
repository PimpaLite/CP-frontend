"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Expanded Mock Data
const authorData = {
  name: "Akshat Kashyap",
  handle: "@akshat_creates",
  avatar: "bg-[#1a110c]",
  analytics: { sales: 342, readers: 1205, rating: 4.8 },
  published: [
    { id: 1, title: "The Last Arc", cover: "bg-deep-charcoal", sales: 150 },
    { id: 2, title: "Neon Drift", cover: "bg-[#3E2723]", sales: 192 },
    { id: 3, title: "Echoes", cover: "bg-warm-yellow", sales: 84 },
    { id: 4, title: "Void Walker", cover: "bg-muted-mauve", sales: 310 },
    { id: 5, title: "Solar Flare", cover: "bg-[#2D4A22]", sales: 12 },
    { id: 6, title: "Iron Reign", cover: "bg-soft-coral", sales: 405 },
  ],
  reviews: [
    { id: 1, user: "ComicFan99", text: "The haptic feedback in chapter 2 blew my mind!", rating: 5 },
    { id: 2, user: "ReaderX", text: "Amazing art style. Waiting for the next issue.", rating: 4 },
  ]
};

export default function AuthorDashboard() {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  // Drag-to-scroll physics state for the Published Issues row
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push("/discovery"); 
    }, 500); 
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <main className="fixed inset-0 z-50 bg-black/80 flex flex-col pt-[10vh] overflow-hidden font-sans">
      
      {/* THE SLIDING DRAWER */}
      <div className={`w-full flex-1 bg-ghost-lavender rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ${isClosing ? 'animate-slide-down-drawer' : 'animate-slide-up-drawer'}`}>
        
        {/* Drawer Handle & Header */}
        <div className="w-full shrink-0 flex flex-col items-center pt-4 pb-4 border-b-2 border-muted-lavender/50 bg-ghost-lavender z-10">
          <div className="w-16 h-1.5 bg-muted-mauve/40 rounded-full mb-6 cursor-pointer hover:bg-muted-mauve transition-colors" onClick={handleClose}></div>
          <div className="w-full px-8 md:px-16 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-deep-purple">Creator Studio</h1>
            <button onClick={handleClose} className="text-muted-mauve hover:text-deep-charcoal font-bold transition-colors">
              Close Workspace
            </button>
          </div>
        </div>

        {/* WORKSPACE CONTENT - INTERNAL SCROLLBAR 
            THE FIX: Added `min-h-0` to this relative flex-1 wrapper.
            This prevents it from stretching infinitely and forces the mouse wheel scrollbar to appear!
        */}
        <div className="relative flex-1 min-h-0 w-full">
          <div className="absolute inset-0 overflow-y-auto p-6 md:p-10">
            
            <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
              
              {/* Top Row: Profile & Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-white border-2 border-soft-lilac rounded-2xl p-6 shadow-sm flex items-center gap-4">
                  <div className={`w-16 h-16 md:w-20 md:h-20 ${authorData.avatar} rounded-full border-4 border-ghost-lavender shadow-inner flex items-center justify-center shrink-0`}>
                     <span className="text-warm-yellow font-bold text-xl md:text-2xl">AK</span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-deep-charcoal">{authorData.name}</h2>
                    <p className="text-sm md:text-base text-muted-mauve font-medium">{authorData.handle}</p>
                  </div>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-soft-lilac rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-muted-mauve text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Total Sales</span>
                    <span className="text-2xl md:text-3xl font-bold text-deep-purple">{authorData.analytics.sales}</span>
                  </div>
                  <div className="bg-white border-2 border-soft-lilac rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-muted-mauve text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Active Readers</span>
                    <span className="text-2xl md:text-3xl font-bold text-deep-purple">{authorData.analytics.readers}</span>
                  </div>
                  <div className="bg-white border-2 border-soft-lilac rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-muted-mauve text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Avg Rating</span>
                    <span className="text-2xl md:text-3xl font-bold text-warm-yellow drop-shadow-sm">{authorData.analytics.rating} ★</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Upload CTA & Published Collection */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-deep-charcoal">Published Issues</h3>
                  <button 
                    onClick={() => router.push("/author/upload")}
                    className="bg-deep-purple hover:bg-[#4A2880] text-white px-5 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-[0_5px_15px_rgba(107,63,160,0.3)] hover:shadow-[0_8px_20px_rgba(107,63,160,0.5)] transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    <span className="text-xl">+</span> Upload New
                  </button>
                </div>
                
                <div 
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className={`flex gap-4 md:gap-6 overflow-x-auto w-full pb-4 pt-2 scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                >
                  {authorData.published.map((comic) => (
                    <div 
                      key={comic.id} 
                      className="min-w-[140px] md:min-w-[160px] shrink-0 group bg-white border-2 border-soft-lilac rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow pointer-events-auto"
                    >
                      <div className={`w-full aspect-[2/3] ${comic.cover} rounded-lg shadow-inner mb-3 border border-black/10 group-hover:scale-[1.02] transition-transform duration-250 pointer-events-none`}></div>
                      <h4 className="font-bold text-deep-charcoal truncate pointer-events-none">{comic.title}</h4>
                      <p className="text-xs md:text-sm text-muted-mauve pointer-events-none">{comic.sales} Copies</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Reader Reviews */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-deep-charcoal mb-2">Recent Reader Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {authorData.reviews.map((review) => (
                    <div key={review.id} className="bg-white/60 border-l-4 border-soft-coral p-4 md:p-5 rounded-r-xl shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-deep-charcoal">{review.user}</span>
                        <span className="text-warm-yellow font-bold">{Array(review.rating).fill('★').join('')}</span>
                      </div>
                      <p className="text-sm md:text-base text-deep-charcoal/80 italic">&quot;{review.text}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}