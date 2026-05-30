"use client";

import { useState } from "react";

// Mock data for our cupboards and comics
const genres = [
  { id: "action", title: "Action & Adventure", color: "bg-soft-coral" },
  { id: "scifi", title: "Sci-Fi & Cyberpunk", color: "bg-deep-purple" },
  { id: "fantasy", title: "High Fantasy", color: "bg-soft-violet" },
];

const mockComics = [
  { id: 1, title: "The Last Arc", cover: "bg-deep-charcoal" },
  { id: 2, title: "Neon Drift", cover: "bg-[#3E2723]" },
  { id: 3, title: "Echoes", cover: "bg-warm-yellow" },
  { id: 4, title: "Void Walker", cover: "bg-muted-mauve" },
  { id: 5, title: "Solar Flare", cover: "bg-[#2D4A22]" },
];

export default function DiscoveryPage() {
  const [openCupboard, setOpenCupboard] = useState<string | null>(null);
  const [selectedComic, setSelectedComic] = useState<number | null>(null);

  const toggleCupboard = (id: string) => {
    setOpenCupboard(openCupboard === id ? null : id);
  };

  return (
    /* The foundational Ghost Lavender background for the interior [cite: 51] */
    <main className="min-h-screen bg-ghost-lavender text-deep-charcoal p-8 md:p-16 font-sans">
      
      {/* Header section */}
      <header className="mb-12 flex justify-between items-end border-b-2 border-muted-lavender pb-6">
        <div>
          <h1 className="text-5xl font-bold text-deep-purple drop-shadow-sm">BACKISSUE</h1>
          <p className="text-muted-mauve mt-2 font-medium">Welcome to the archives. Browse the shelves below.</p>
        </div>
        <div className="w-12 h-12 bg-soft-lilac rounded-full border-2 border-deep-purple shadow-sm flex items-center justify-center cursor-pointer hover:bg-muted-lavender transition-colors">
          <span className="text-deep-purple font-bold">Profile</span>
        </div>
      </header>

      {/* Shelves Container */}
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {genres.map((genre) => {
          const isOpen = openCupboard === genre.id;

          return (
            <section key={genre.id} className="relative flex flex-col items-center">
              
              {/* Wooden Shelf Base */}
              <div className="absolute bottom-0 w-full h-4 bg-[#5D4037] border-b-4 border-[#3E2723] rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.2)] z-0"></div>

              {/* The 3D Cupboard Container [cite: 144] */}
              <div className="relative w-full max-w-4xl h-80 perspective-1000 mb-1 z-10">
                
                {/* 1. The Inside of the Cupboard (Revealed when doors open) */}
                <div className="absolute inset-0 bg-[#2A1A12] border-8 border-[#3E2723] shadow-inner rounded-md flex items-center p-6 overflow-hidden">
                  
                  {/* Horizontal swipeable row [cite: 148-151] */}
                  <div className="flex gap-6 overflow-x-auto w-full h-full items-center snap-x pb-4 scrollbar-hide">
                    
                    {mockComics.map((comic) => (
                      /* Strict Card Interactions applied here: 
                        - Lift with shadow (250ms) [cite: 74-75]
                        - Scale 0.98x and Soft Violet border on active click [cite: 76-77] 
                      */
                      <div 
                        key={comic.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComic(comic.id);
                        }}
                        className={`min-w-[140px] md:min-w-[160px] h-full ${comic.cover} rounded-lg snap-center flex flex-col justify-end p-3 cursor-pointer border-2 border-black/50 shadow-md transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(107,63,160,0.5)] active:scale-[0.98] active:border-soft-violet ${selectedComic === comic.id ? 'ring-4 ring-warm-yellow' : ''}`}
                      >
                        <div className="bg-white/90 backdrop-blur-sm w-full py-2 px-1 rounded-sm text-center">
                          <span className="text-xs font-bold text-deep-charcoal truncate block">
                            {comic.title}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                </div>

                {/* 2. Left Cupboard Door (Swings open) */}
                <div 
                  onClick={() => toggleCupboard(genre.id)}
                  className={`absolute top-0 left-0 w-1/2 h-full bg-[#5D4037] border-8 border-[#3E2723] origin-left transition-transform duration-700 ease-in-out cursor-pointer flex items-center justify-center shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-20 hover:brightness-110`}
                  style={{ transform: isOpen ? 'rotateY(-110deg)' : 'rotateY(0deg)' }}
                >
                  {/* Brass Handle */}
                  <div className="absolute right-4 w-2 h-16 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full shadow-md border border-black/50"></div>
                </div>

                {/* 3. Right Cupboard Door (Swings open) */}
                <div 
                  onClick={() => toggleCupboard(genre.id)}
                  className={`absolute top-0 right-0 w-1/2 h-full bg-[#5D4037] border-8 border-[#3E2723] origin-right transition-transform duration-700 ease-in-out cursor-pointer flex items-center justify-center shadow-[-2px_0_10px_rgba(0,0,0,0.5)] z-20 hover:brightness-110`}
                  style={{ transform: isOpen ? 'rotateY(110deg)' : 'rotateY(0deg)' }}
                >
                  {/* Brass Handle */}
                  <div className="absolute left-4 w-2 h-16 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full shadow-md border border-black/50"></div>
                  
                  {/* Genre Label Plaque (Only visible when closed) */}
                  <div className={`absolute top-1/2 -translate-y-1/2 -left-1/2 -translate-x-1/2 w-48 py-3 ${genre.color} border-4 border-[#3E2723] shadow-lg flex items-center justify-center rounded-sm transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                     <h2 className="text-xl text-white font-bold tracking-wider drop-shadow-md">{genre.title}</h2>
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