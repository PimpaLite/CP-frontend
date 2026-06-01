"use client";

import { useState, useRef, MouseEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

type ToolType = "rumble" | "pulse" | "snap";

interface HapticZone {
  id: string;
  tool: ToolType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function UploadStudio() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<ToolType>("rumble");
  const [zones, setZones] = useState<HapticZone[]>([]);
  
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'success'>('idle');
  
  // State to hold the uploaded comic page image data
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [visualPulse, setVisualPulse] = useState<string | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  const tools = {
    rumble: { name: "Rumble", desc: "Heavy sustained vibration", color: "border-soft-coral bg-soft-coral/20" },
    pulse: { name: "Pulse", desc: "Heartbeat sensation", color: "border-deep-purple bg-deep-purple/20" },
    snap: { name: "Snap", desc: "Sharp, quick click", color: "border-warm-yellow bg-warm-yellow/20" }
  };

  const triggerHaptic = (tool: ToolType) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      if (tool === "rumble") navigator.vibrate([200, 50, 200, 50, 200]);
      if (tool === "pulse") navigator.vibrate([50, 100, 50]);
      if (tool === "snap") navigator.vibrate([30]);
    }
    
    setVisualPulse(tool);
    setTimeout(() => setVisualPulse(null), 150);
  };

  const handleToolSelect = (key: ToolType) => {
    setSelectedTool(key);
    triggerHaptic(key);
  };

  const handlePublish = () => {
    setPublishState('publishing');
    
    setTimeout(() => {
      setPublishState('success');
      setTimeout(() => {
        router.push("/author/dashboard");
      }, 1000);
    }, 1500);
  };

  // THE FIX: The most stable image reader approach. No input clearing, no object URLs.
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setZones([]); 
      }
    };
    reader.readAsDataURL(file);
  };

  const loadDemoImage = () => {
    setUploadedImage("demo");
    setZones([]);
  };

  const removeZone = (idToRemove: string) => {
    setZones(zones.filter(zone => zone.id !== idToRemove));
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsDrawing(true);
    setCurrentBox({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setCurrentBox({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      w: Math.abs(currentX - startPos.x),
      h: Math.abs(currentY - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentBox && currentBox.w > 10 && currentBox.h > 10) {
      setZones([...zones, { 
        id: Math.random().toString(36).substring(7),
        tool: selectedTool,
        ...currentBox 
      }]);
      triggerHaptic(selectedTool); 
    }
    setIsDrawing(false);
    setCurrentBox(null);
  };

  const undoLastZone = () => setZones(zones.slice(0, -1));

  return (
    <main className="min-h-screen bg-ghost-lavender text-deep-charcoal flex flex-col font-sans">
      
      <header className="relative z-[999] h-20 bg-white border-b-2 border-muted-lavender flex items-center justify-between px-8 shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/author/dashboard")} className="text-muted-mauve hover:text-deep-charcoal font-bold transition-colors">
            ← Back to Studio
          </button>
          <div className="h-8 w-px bg-muted-lavender"></div>
          <h1 className="text-2xl font-bold text-deep-purple drop-shadow-sm">Haptic Mapping Engine</h1>
        </div>
        
        <button 
          onClick={handlePublish}
          disabled={publishState !== 'idle' || !uploadedImage}
          className={`pointer-events-auto relative z-[1000] text-white px-8 py-2.5 rounded-xl font-bold transition-all transform flex items-center gap-2 
            ${publishState === 'success' ? 'bg-[#2D4A22] shadow-[0_5px_15px_rgba(45,74,34,0.3)] hover:-translate-y-0' 
            : 'bg-deep-purple hover:bg-[#4A2880] shadow-[0_5px_15px_rgba(107,63,160,0.3)] hover:-translate-y-1'} 
            disabled:opacity-80 disabled:cursor-not-allowed`}
        >
          {publishState === 'publishing' && (
            <>
              <span className="w-3 h-3 rounded-full bg-soft-coral animate-pulse"></span>
              Publishing...
            </>
          )}
          {publishState === 'success' && (
            <>
              <span>✓</span>
              Published!
            </>
          )}
          {publishState === 'idle' && "Publish Issue"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-0">
        
        <aside className="w-72 bg-white border-r-2 border-muted-lavender p-6 flex flex-col gap-6 shadow-md z-10 shrink-0">
          <div>
            <h2 className="font-bold text-deep-charcoal mb-4 uppercase tracking-wider text-sm">Haptic Tools</h2>
            <div className="flex flex-col gap-3">
              {(Object.keys(tools) as ToolType[]).map((key) => (
                <button 
                  key={key}
                  onClick={() => handleToolSelect(key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all 
                    ${selectedTool === key ? 'border-deep-purple bg-soft-lilac shadow-sm' : 'border-muted-lavender hover:border-soft-violet bg-white'}
                    ${visualPulse === key ? 'scale-95 brightness-90' : 'scale-100'} 
                  `}
                >
                  <div className="font-bold text-deep-charcoal capitalize">{tools[key].name}</div>
                  <div className="text-xs text-muted-mauve mt-1">{tools[key].desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
             <button onClick={undoLastZone} disabled={zones.length === 0} className="w-full py-3 bg-muted-lavender/30 hover:bg-muted-lavender text-deep-charcoal font-bold rounded-xl transition-colors disabled:opacity-50">
               Undo Last Zone
             </button>
          </div>
        </aside>

        <section className="flex-1 bg-muted-lavender/20 p-6 md:p-12 overflow-y-auto flex justify-center">
          
          <div className="flex flex-col gap-4 max-w-5xl w-full">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-bold text-deep-charcoal text-lg">Page 1</h3>
                <p className="text-sm text-muted-mauve">
                  {uploadedImage ? "Click and drag over panels to map haptics." : "Upload a comic page to begin mapping."}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {uploadedImage && (
                  <label className="text-sm font-bold text-soft-coral hover:text-red-700 cursor-pointer transition-colors relative flex items-center gap-1">
                    Replace Page
                    {/* Proper hidden input, triggered by the surrounding label */}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
                <span className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-muted-lavender shadow-sm">
                  {zones.length} Zones Mapped
                </span>
              </div>
            </div>

            {!uploadedImage ? (
              
              <div className="w-full aspect-[2/3] border-4 border-dashed border-muted-lavender bg-white/50 rounded-xl flex flex-col items-center justify-center p-8 transition-colors">
                <div className="w-24 h-24 bg-ghost-lavender rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-white">
                   <span className="text-4xl text-deep-purple">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-deep-charcoal mb-2">Upload Comic Page</h3>
                <p className="text-muted-mauve mb-8 text-center max-w-sm">Select a high-resolution PNG or JPG file. Recommended aspect ratio is 2:3.</p>
                
                <div className="flex gap-4">
                  <label className="bg-deep-purple hover:bg-[#4A2880] text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_5px_15px_rgba(107,63,160,0.3)] cursor-pointer transition-transform hover:-translate-y-1 inline-flex items-center justify-center">
                    Browse Files
                    {/* Proper hidden input, triggered by the surrounding label */}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  
                  <button 
                    onClick={loadDemoImage}
                    className="bg-white border-2 border-muted-lavender hover:border-deep-purple text-deep-charcoal px-8 py-3.5 rounded-xl font-bold transition-all hover:shadow-md"
                  >
                    Use Demo Page
                  </button>
                </div>
              </div>

            ) : (

              <div className={`relative w-full aspect-[2/3] bg-white border-2 border-muted-lavender shadow-xl rounded-sm overflow-hidden transition-transform ${visualPulse ? 'scale-[0.99] filter brightness-95' : 'scale-100'}`}>
                 
                 {uploadedImage === 'demo' ? (
                    <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(135deg, #1E1A2E 0%, #3E2723 100%)' }}></div>
                 ) : (
                    /* THE FIX: Standard <img> tag that securely handles the base64 string */
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={uploadedImage} 
                      alt="Comic Canvas" 
                      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
                    />
                 )}

                 <div 
                   className="absolute inset-0 z-40 cursor-crosshair"
                   onMouseDown={handleMouseDown}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
                 ></div>

                 {zones.map((zone) => (
                   <div 
                     key={zone.id}
                     className={`absolute border-2 ${tools[zone.tool].color} backdrop-blur-[1px] rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] transition-all pointer-events-none z-30`}
                     style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
                   >
                     <span className="absolute -top-6 left-0 text-xs font-bold text-white px-2 py-0.5 rounded-t-sm shadow-sm capitalize pointer-events-none" style={{ backgroundColor: zone.tool === 'rumble' ? '#E8635A' : zone.tool === 'pulse' ? '#6B3FA0' : '#FFD700' }}>
                       {zone.tool}
                     </span>
                     
                     <button
                        onMouseDown={(e) => e.stopPropagation()} 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeZone(zone.id);
                        }}
                        className="pointer-events-auto absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-soft-coral text-soft-coral rounded-full flex flex-col items-center justify-center hover:bg-soft-coral hover:text-white transition-colors shadow-md"
                        title="Delete Zone"
                      >
                        <span className="text-[10px] font-bold leading-none -mt-[1px]">✕</span>
                      </button>
                   </div>
                 ))}

                 {isDrawing && currentBox && (
                   <div 
                     className={`absolute border-2 border-dashed ${tools[selectedTool].color} rounded-sm pointer-events-none bg-black/10 z-50`}
                     style={{ left: currentBox.x, top: currentBox.y, width: currentBox.w, height: currentBox.h }}
                   />
                 )}
              </div>
            )}
          </div>
          
        </section>
      </div>
    </main>
  );
}