import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Sliders, Image as ImageIcon, CheckCircle, ShieldAlert } from 'lucide-react';

export default function PhotoResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preset, setPreset] = useState('upsc-passport');
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(450);
  const [quality, setQuality] = useState(0.8);
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const presets = [
    { id: 'upsc-passport', name: 'UPSC Passport Photo (350 x 450 px)', w: 350, h: 450, desc: 'Ideal for IAS/IPS online upload. Range: 20KB - 300KB.' },
    { id: 'ssc-signature', name: 'SSC Signature Upload (140 x 60 px)', w: 140, h: 60, desc: 'Ideal for signature. Range: 10KB - 20KB.' },
    { id: 'sbi-clerk', name: 'SBI Central Recruiting Photo (230 x 200 px)', w: 230, h: 200, desc: 'Recommended bank photo standard. Range: 20KB - 50KB.' },
    { id: 'custom', name: 'Custom Dimensions', w: 300, h: 300, desc: 'Configure custom widths and heights.' }
  ];

  useEffect(() => {
    const selected = presets.find(p => p.id === preset);
    if (selected && preset !== 'custom') {
      setWidth(selected.w);
      setHeight(selected.h);
    }
  }, [preset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setSuccess(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render on canvas whenever properties modify
  useEffect(() => {
    if (!imageSrc) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      
      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw rounded/clipped rectangle
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Calculate source aspect ratio & offsets
      const imgWidth = img.width;
      const imgHeight = img.height;
      const scale = zoom * Math.max(width / imgWidth, height / imgHeight);

      const dWidth = imgWidth * scale;
      const dHeight = imgHeight * scale;
      const dx = (width - dWidth) / 2 + posX;
      const dy = (height - dHeight) / 2 + posY;

      ctx.drawImage(img, dx, dy, dWidth, dHeight);

      // Estimate real size
      canvas.toBlob((blob) => {
        if (blob) {
          setEstimatedSize(Math.round(blob.size / 1024));
        }
      }, 'image/jpeg', quality);
    };
  }, [imageSrc, width, height, zoom, posX, posY, quality]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setTimeout(() => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // Clean file name
          link.download = `career_box_photo_${width}x${height}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setSuccess(true);
        }
        setIsProcessing(false);
      }, 'image/jpeg', quality);
    }, 600);
  };

  return (
    <div id="photo-resizer" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gradient-to-tr from-orange-400 via-white to-emerald-500 rounded-lg text-slate-800 border border-slate-100">
          <ImageIcon className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Career Box Student Photo & Signature Resizer</h2>
          <p className="text-xs text-slate-500">Completely offline client-side compressor to fit portal dimensions & KB restrictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workspace Canvas / Upload Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center border border-slate-150 rounded-xl p-5 bg-slate-50 min-h-[350px]">
          {imageSrc ? (
            <div className="flex flex-col items-center gap-4">
              <div 
                className="overflow-hidden bg-white border border-slate-350 shadow-md rounded-lg flex items-center justify-center p-1"
                style={{ width: `${Math.min(width, 320) + 8}px`, height: `${(Math.min(width, 320) / width) * height + 8}px` }}
              >
                <canvas 
                  ref={canvasRef} 
                  width={width} 
                  height={height}
                  className="max-w-full max-h-full border border-slate-100 shadow-inner"
                />
              </div>

              {estimatedSize !== null && (
                <div className="flex items-center gap-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full font-mono shadow-sm">
                  <span>Size: <strong>{estimatedSize} KB</strong></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-300">{width}x{height} px</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Select candidate photo or signature</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-5">Supports JPG, JPEG, and PNG files under 10MB.</p>
              <label className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg inline-block cursor-pointer shadow-sm transition-all">
                Choose Image File
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Configuration Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Official Standards Presets
              </label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 cursor-pointer text-slate-800"
              >
                {presets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                {presets.find(p => p.id === preset)?.desc}
              </p>
            </div>

            {preset === 'custom' && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1">
                    Width (px)
                  </label>
                  <input 
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1">
                    Height (px)
                  </label>
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50"
                  />
                </div>
              </div>
            )}

            {imageSrc && (
              <div className="space-y-3.5 border-t border-slate-100 pt-4 animate-fade-in">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Visual Alignment Controls
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>Crop Zoom</span>
                    <span className="font-mono">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                      <span>Shift X ({posX}px)</span>
                    </div>
                    <input 
                      type="range"
                      min="-150"
                      max="150"
                      value={posX}
                      onChange={(e) => setPosX(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                      <span>Shift Y ({posY}px)</span>
                    </div>
                    <input 
                      type="range"
                      min="-100"
                      max="100"
                      value={posY}
                      onChange={(e) => setPosY(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>JPEG Quality (KB Compression)</span>
                    <span className="font-mono">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1">
                    Adjusting quality down is the number-one way to fit within the portals' strict maximum byte constraints.
                  </p>
                </div>
              </div>
            )}
          </div>

          {imageSrc && (
            <div className="mt-6 space-y-3">
              <button 
                onClick={downloadImage}
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-medium text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Save Resized Image
              </button>

              {success && (
                <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-bounce-short">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Success! Photo is successfully processed & downloaded offline. Ready to fill on portal!</span>
                </div>
              )}

              <div className="flex items-start gap-2 text-slate-400 text-[10px] leading-snug">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-350 flex-shrink-0 mt-0.5" />
                <span>Our Career Box resizer operates completely in your local browser sandbox. Your personal photo & credential documents are never uploaded to any cloud storage.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
