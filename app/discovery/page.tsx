"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const genres = [
  { id: "action", title: "Action & Adventure", color: "bg-soft-coral" },
  { id: "scifi", title: "Sci-Fi & Cyberpunk", color: "bg-deep-purple" },
  { id: "fantasy", title: "High Fantasy", color: "bg-soft-violet" },
];

const mockComics = [
  { id: 1, title: "The Last Arc", cover: "bg-deep-charcoal", price: "$2.99" },
  { id: 2, title: "Neon Drift", cover: "bg-[#3E2723]", price: "$1.99" },
  { id: 3, title: "Echoes", cover: "bg-warm-yellow", price: "$3.50" },
  { id: 4, title: "Void Walker", cover: "bg-muted-mauve", price: "$2.00" },
  { id: 5, title: "Solar Flare", cover: "bg-[#2D4A22]", price: "$4.99" },
  { id: 6, title: "Iron Reign", cover: "bg-soft-coral", price: "$2.99" },
  { id: 7, title: "Chronos", cover: "bg-soft-violet", price: "$1.50" },
  { id: 8, title: "Deep Space", cover: "bg-deep-purple", price: "$3.99" },
];

export default function DiscoveryPage() {
  const router = useRouter();
  const [openCupboard, setOpenCupboard] = useState<string | null>(null);
  const [selectedComic, setSelectedComic] = useState<string | null>(null);
  
  // NEW: Search state to track what the user is typing
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drag-to-scroll state
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const toggleCupboard = (id: string) => {
    // If user is searching, doors are forced open, so clicking them clears the search to close them
    if (searchQuery.trim().length > 0) {
      setSearchQuery("");
      setOpenCupboard(null);
    } else {
      setOpenCupboard(openCupboard === id ? null : id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, genreId: string) => {
    const slider = scrollRefs.current[genreId];
    if (!slider) return;
    
    setIsDragging(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent, genreId: string) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const slider = scrollRefs.current[genreId];
    if (!slider) return;
    
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; 
    slider.scrollLeft = scrollLeft - walk;
  };

  return (
    <main className="min-h-screen bg-ghost-lavender text-deep-charcoal p-8 md:p-16 font-sans pb-24">
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-muted-lavender pb-6 gap-6 md:gap-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-deep-purple drop-shadow-sm tracking-wide">BACKISSUE</h1>
          <p className="text-muted-mauve mt-2 font-medium text-lg">Welcome to the archives. Browse the shelves below.</p>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex-1 md:w-80 relative hidden sm:block">
            {/* NEW: Bound the input to the searchQuery state */}
            <input 
              type="text" 
              placeholder="Search comics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-muted-lavender rounded-full px-6 py-3 text-deep-charcoal placeholder:text-muted-mauve focus:outline-none focus:border-deep-purple focus:shadow-[0_0_15px_rgba(107,63,160,0.15)] transition-all"
            />
          </div>

          <button className="text-muted-mauve hover:text-soft-coral font-bold transition-colors relative flex items-center gap-2">
            Wishlist
            <span className="w-2.5 h-2.5 bg-soft-coral rounded-full shadow-[0_0_8px_rgba(232,99,90,0.6)]"></span>
          </button>
          
          <div 
            onClick={() => router.push("/reader/profile")}
            className="w-14 h-14 bg-deep-charcoal rounded-full border-4 border-soft-lilac shadow-md flex items-center justify-center cursor-pointer hover:border-deep-purple hover:shadow-[0_4px_15px_rgba(107,63,160,0.3)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="text-warm-yellow font-bold text-xl">AK</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {genres.map((genre) => {
          // NEW: Filter the comics based on the search query
          const filteredComics = mockComics.filter((comic) =>
            comic.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // NEW: Auto-open cupboards if the user is typing a search!
          const isActuallyOpen = openCupboard === genre.id || searchQuery.trim().length > 0;

          return (
            <section key={genre.id} className="relative flex flex-col items-center">
              <div 
                className="absolute bottom-0 w-full h-4 rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.3)] z-0"
                style={{ backgroundColor: "#4A2D22", borderBottom: "4px solid #2A1A12" }}
              ></div>

              <div 
                className="relative w-full max-w-5xl h-80 perspective-1000 mb-1 z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                
                {/* 1. The Inside of the Cupboard */}
                <div 
                  className="absolute inset-0 bg-white shadow-[inset_0_10px_30px_rgba(0,0,0,0.15)] rounded-md flex items-center p-6 overflow-hidden select-none z-10"
                  style={{ border: "10px solid #3E2723" }}
                >
                  
                  {/* NEW: Empty state message if no comics match the search */}
                  {filteredComics.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center text-muted-mauve opacity-70">
                      <span className="text-4xl mb-2">📭</span>
                      <p className="font-bold tracking-wider">NO RESULTS FOUND</p>
                    </div>
                  ) : (
                    <div 
                      ref={(el) => { scrollRefs.current[genre.id] = el }}
                      onMouseDown={(e) => handleMouseDown(e, genre.id)}
                      onMouseLeave={handleMouseLeave}
                      onMouseUp={handleMouseUp}
                      onMouseMove={(e) => handleMouseMove(e, genre.id)}
                      className={`flex gap-8 overflow-x-auto w-full h-full items-center pb-4 pt-4 scrollbar-hide px-4 ${isActuallyOpen ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                      {/* Mapping the FILTERED comics instead of mockComics */}
                      {filteredComics.map((comic) => {
                        const uniqueId = `${genre.id}-${comic.id}`;

                        return (
                          <div 
                            key={comic.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDragging) setSelectedComic(uniqueId);
                            }}
                            className={`relative min-w-[150px] md:min-w-[170px] h-full rounded-sm flex flex-col justify-end transition-all duration-300 ease-out origin-bottom 
                              hover:-translate-y-4 hover:-translate-x-1 hover:-rotate-2 hover:shadow-[15px_20px_25px_rgba(0,0,0,0.15)] 
                              shadow-[8px_10px_15px_rgba(0,0,0,0.1)] active:scale-[0.98] 
                              ${selectedComic === uniqueId ? 'ring-4 ring-warm-yellow shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'border border-black/20'}`}
                          >
                            {/* Cover Image / Color */}
                            <div className={`absolute inset-0 rounded-sm ${comic.cover}`}></div>

                            {/* Glossy Lighting Overlay */}
                            <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-black/50 via-white/5 to-white/20 mix-blend-overlay pointer-events-none"></div>
                            
                            {/* Book Spine Highlight */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-white/30 to-transparent pointer-events-none rounded-l-sm"></div>
                            
                            {/* Page Depth */}
                            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-black/40 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/40 pointer-events-none"></div>

                            {/* Solid Paper Label */}
                            <div className="relative z-10 bg-[#F4F1EA] w-full p-2.5 border-t-2 border-black/10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] rounded-b-sm">
                              <span className="text-sm font-bold text-[#2A1A12] truncate block tracking-tight">
                                {comic.title}
                              </span>
                              <div className="flex justify-between items-center mt-1.5">
                                <span className="text-xs font-black text-deep-purple">{comic.price}</span>
                                <span className="text-[11px] text-muted-mauve hover:text-soft-coral transition-colors cursor-pointer pointer-events-auto">♥</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Left Cupboard Door */}
                <div 
                  onClick={() => toggleCupboard(genre.id)}
                  className={`absolute top-0 left-0 w-1/2 h-full origin-left transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer flex items-center justify-center shadow-[5px_0_20px_rgba(0,0,0,0.6)] z-20 hover:brightness-110`}
                  style={{ 
                    transform: isActuallyOpen ? 'rotateY(-115deg)' : 'rotateY(0deg)',
                    backgroundColor: '#4A2D22', 
                    border: '8px solid #2A1A12' 
                  }}
                >
                  <div className="absolute right-4 w-2 h-20 bg-gradient-to-b from-warm-yellow to-yellow-700 rounded-full shadow-[2px_2px_5px_rgba(0,0,0,0.5)] border border-black/50"></div>
                  <div className="absolute inset-4 border-2 border-black/30 rounded-sm pointer-events-none opacity-50"></div>
                </div>

                {/* 3. Right Cupboard Door */}
                <div 
                  onClick={() => toggleCupboard(genre.id)}
                  className={`absolute top-0 right-0 w-1/2 h-full origin-right transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer flex items-center justify-center shadow-[-5px_0_20px_rgba(0,0,0,0.6)] z-20 hover:brightness-110`}
                  style={{ 
                    transform: isActuallyOpen ? 'rotateY(115deg)' : 'rotateY(0deg)',
                    backgroundColor: '#4A2D22', 
                    border: '8px solid #2A1A12' 
                  }}
                >
                  <div className="absolute left-4 w-2 h-20 bg-gradient-to-b from-warm-yellow to-yellow-700 rounded-full shadow-[2px_2px_5px_rgba(0,0,0,0.5)] border border-black/50"></div>
                  <div className="absolute inset-4 border-2 border-black/30 rounded-sm pointer-events-none opacity-50"></div>
                  
                  {/* The Front Plaque */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 -left-1/2 -translate-x-1/2 w-64 py-4 ${genre.color} border-4 shadow-[0_10px_20px_rgba(0,0,0,0.6)] flex items-center justify-center rounded-sm transition-opacity duration-300 pointer-events-none ${isActuallyOpen ? 'opacity-0' : 'opacity-100'}`}
                    style={{ borderColor: "#1a110c" }}
                  >
                     <h2 className="text-2xl text-white font-bold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{genre.title}</h2>
                     <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-[#1a110c] rounded-full"></div>
                     <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#1a110c] rounded-full"></div>
                     <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-[#1a110c] rounded-full"></div>
                     <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-[#1a110c] rounded-full"></div>
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}