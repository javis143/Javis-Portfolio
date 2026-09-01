import { useState, useEffect, useRef } from "react";
import { Cpu, RotateCcw, Sun, Wifi, Settings, HelpCircle, Play, Pause } from "lucide-react";

export function SolarTrackerSandbox() {
  const [mode, setMode] = useState<"AUTO" | "MANUAL">("MANUAL");
  const [servoAngle, setServoAngle] = useState<number>(180);
  const [elevation, setElevation] = useState<number>(10);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [wifiConnected, setWifiConnected] = useState<boolean>(false);
  const [sunAngle, setSunAngle] = useState<number>(45); // Sun position in sky
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const trackingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated Hardware Boot Cycle
  useEffect(() => {
    if (isBooting) {
      setBootProgress(0);
      setWifiConnected(false);
      const interval = setInterval(() => {
        setBootProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsBooting(false);
              setWifiConnected(true);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isBooting]);

  // Simulated Auto-Tracking Algorithm
  useEffect(() => {
    if (mode === "AUTO" && isTracking && !isBooting) {
      trackingTimerRef.current = setInterval(() => {
        // In auto-mode, servo tries to match the sun angle
        // Map sun angle (0 to 180) to servo angle with a bit of noise filtering
        setServoAngle((prev) => {
          const target = Math.round(sunAngle);
          const diff = target - prev;
          if (Math.abs(diff) <= 1) return prev;
          
          // Gradually step towards target (simulating motor speed)
          const step = diff > 0 ? 2 : -2;
          return Math.min(180, Math.max(0, prev + step));
        });

        // Error threshold fluctuates slightly based on LDR sensor variance
        setElevation((prev) => {
          const noise = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return Math.min(15, Math.max(0, prev + noise));
        });
      }, 100);
    } else {
      if (trackingTimerRef.current) {
        clearInterval(trackingTimerRef.current);
      }
    }

    return () => {
      if (trackingTimerRef.current) {
        clearInterval(trackingTimerRef.current);
      }
    };
  }, [mode, isTracking, sunAngle, isBooting]);

  // Trigger auto tracking when mode becomes AUTO
  useEffect(() => {
    if (mode === "AUTO") {
      setIsTracking(true);
    } else {
      setIsTracking(false);
    }
  }, [mode]);

  const handleReset = () => {
    setIsBooting(true);
    setServoAngle(180);
    setElevation(10);
    setMode("MANUAL");
    setIsTracking(false);
  };

  // Helper to draw the custom LCD progress bar
  const renderProgressBar = () => {
    const totalBlocks = 16;
    const filledBlocks = Math.round((bootProgress / 100) * totalBlocks);
    return "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-900/45 border border-surface-100 dark:border-surface-800 rounded-3xl p-5 md:p-6 space-y-6 mt-6">
      
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 dark:border-surface-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Cpu className="h-5 w-5" />
            <h4 className="font-black text-sm tracking-tight uppercase">
              Hardware Prototype & LCD Simulator
            </h4>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
            Hands-on simulation replicating Javis's physical ESP32 tracker chassis, LDR sensor array, and 16x2 LCD display.
          </p>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-surface-800 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-extrabold border border-surface-200 dark:border-surface-800 transition-all duration-150 shadow-sm shrink-0 self-start sm:self-center"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset ESP32 Unit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Simulated Hardware Enclosure & 16x2 LCD Panel */}
        <div className="md:col-span-6 space-y-5">
          <div className="relative bg-surface-900 dark:bg-black rounded-2xl border-4 border-surface-800 p-5 shadow-inner">
            {/* Matte Box Overlay texture */}
            <div className="absolute top-2 right-4 flex space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className={`h-1.5 w-1.5 rounded-full ${wifiConnected ? 'bg-green-500' : 'bg-gray-600'}`}></span>
            </div>
            
            <span className="text-[8px] font-black tracking-widest text-gray-500 uppercase block mb-3">
              ESP32 CONTROLLER MAINBOARD
            </span>

            {/* Glowing 16x2 LCD Display (Simulating Javis's actual physical LCD) */}
            <div className="relative overflow-hidden bg-blue-900/90 dark:bg-blue-950/80 rounded-lg p-4 font-mono border-2 border-blue-800 shadow-[0_0_20px_rgba(30,58,138,0.5)] flex flex-col justify-center min-h-[90px]">
              {/* Backlight scanlines */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none"></div>
              
              {isBooting ? (
                <div className="space-y-1.5 text-blue-100 text-xs">
                  <div className="flex items-center justify-between tracking-wide">
                    <span>Connecting WiFi.</span>
                    <Wifi className="h-3 w-3 animate-pulse" />
                  </div>
                  <div className="text-blue-300 font-bold tracking-tight text-sm select-none">
                    {renderProgressBar()}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-blue-100 font-bold text-sm tracking-wide select-none">
                  {/* Line 1: Mode: MANUAL or Mode: AUTO */}
                  <div className="flex justify-between items-center">
                    <span>Mode:{mode}</span>
                    <span className="text-[10px] text-blue-300 flex items-center space-x-1">
                      <Wifi className="h-3 w-3 text-blue-200" />
                      <span>{wifiConnected ? "STABLE" : "DISCONN"}</span>
                    </span>
                  </div>
                  {/* Line 2: S:180 E:10 */}
                  <div className="flex justify-between items-center text-blue-200">
                    <span>S:{servoAngle}°  E:{elevation}</span>
                    <span className="text-[10px] text-blue-400 bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-800/50">
                      RSSI: -58dB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Physical Interface Controls */}
            <div className="mt-5 pt-4 border-t border-surface-800 flex flex-wrap gap-4 items-center justify-between">
              
              {/* Toggle Tracking Mode */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                  Firmware Tracker Mode
                </label>
                <div className="flex bg-surface-800 p-1 rounded-xl border border-surface-700/80">
                  <button
                    onClick={() => setMode("MANUAL")}
                    disabled={isBooting}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-150 ${
                      mode === "MANUAL"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    MANUAL
                  </button>
                  <button
                    onClick={() => setMode("AUTO")}
                    disabled={isBooting}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-150 ${
                      mode === "AUTO"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    AUTO-LOOP
                  </button>
                </div>
              </div>

              {/* Reset LCD Backlight option */}
              <div className="flex space-x-2">
                {mode === "AUTO" && (
                  <button
                    onClick={() => setIsTracking(!isTracking)}
                    disabled={isBooting}
                    className={`p-2 rounded-xl border transition-all duration-150 ${
                      isTracking
                        ? "bg-green-600 border-green-500 text-white shadow-md shadow-green-600/10"
                        : "bg-surface-800 border-surface-700 text-gray-300 hover:text-white"
                    }`}
                    title={isTracking ? "Pause Tracking Loop" : "Start Tracking Loop"}
                  >
                    {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Interactive Calibration Sliders */}
          {!isBooting && (
            <div className="bg-white dark:bg-surface-800 p-4 rounded-2xl border border-surface-100 dark:border-surface-800/80 space-y-4">
              <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Settings className="h-3.5 w-3.5" />
                <span>Simulation Parameter Calibrator</span>
              </span>

              {mode === "MANUAL" ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                      <span>Manual Servo Angle (S)</span>
                      <span className="text-indigo-500 font-extrabold">{servoAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={servoAngle}
                      onChange={(e) => setServoAngle(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-100 dark:bg-surface-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                      <span>Light LDR Error Tolerance (E)</span>
                      <span className="text-indigo-500 font-extrabold">{elevation} LSB</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={elevation}
                      onChange={(e) => setElevation(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-100 dark:bg-surface-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Sun Sky Angle controls when in AUTO-mode to show automatic alignment */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                      <span>Simulated Sun Altitude Position</span>
                      <span className="text-amber-500 font-extrabold flex items-center space-x-1">
                        <Sun className="h-3 w-3 animate-spin-slow" />
                        <span>{sunAngle}°</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="165"
                      value={sunAngle}
                      onChange={(e) => setSunAngle(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-100 dark:bg-surface-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-[8px] text-gray-400 font-bold block mt-1.5 leading-normal">
                      💡 Adjust the slider to reposition the virtual sun. The ESP32's automatic feedback loop will smoothly rotate the servos to track and align with it.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Interactive SVG Rig Simulator */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-800/80 p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-surface-50 dark:border-surface-900/60 pb-3 mb-3">
              <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
                MECHANICAL CHASSIS ROTATION
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase">
                {mode === "AUTO" ? "AUTONOMOUS TRACK" : "MANUAL SERVO SLOW"}
              </span>
            </div>

            {/* Interactive SVG Workspace */}
            <div className="relative bg-surface-50 dark:bg-surface-900 rounded-xl overflow-hidden border border-surface-100 dark:border-surface-800 flex items-center justify-center p-4 min-h-[220px]">
              
              {/* Sky background / grid */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <svg viewBox="0 0 300 220" className="w-full max-w-[280px] h-auto drop-shadow-md">
                {/* Simulated ground line */}
                <line x1="20" y1="180" x2="280" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Custom Cardboard / Support Book Columns (As shown in video) */}
                <rect x="50" y="140" width="30" height="40" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <rect x="55" y="145" width="20" height="30" fill="none" stroke="#64748b" strokeWidth="0.5" />
                
                <rect x="220" y="140" width="30" height="40" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <rect x="225" y="145" width="20" height="30" fill="none" stroke="#64748b" strokeWidth="0.5" />

                <rect x="65" y="100" width="170" height="40" rx="4" fill="#a1a1aa" stroke="#71717a" strokeWidth="1" />
                <text x="150" y="123" fill="#4b5563" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  MECHATRONICS CORE STACK
                </text>

                {/* Central Servo/Stepper Gear Hub */}
                <circle cx="150" cy="100" r="14" fill="#4f46e5" stroke="#3730a3" strokeWidth="1.5" />
                <circle cx="150" cy="100" r="4" fill="#e2e8f0" />
                
                {/* Interactive virtual sun representation */}
                {mode === "AUTO" && (
                  <g transform={`translate(${150 + 95 * Math.cos((sunAngle * Math.PI) / 180 - Math.PI)}, ${100 + 95 * Math.sin((sunAngle * Math.PI) / 180 - Math.PI)})`}>
                    <circle cx="0" cy="0" r="10" className="fill-amber-400 stroke-amber-500 animate-pulse" strokeWidth="1.5" />
                    {/* Sun Rays */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="0"
                        y1="0"
                        x2={16 * Math.cos((angle * Math.PI) / 180)}
                        y2={16 * Math.sin((angle * Math.PI) / 180)}
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>
                )}

                {/* Rotating Solar Panel Assembly */}
                {/* Rotate based on servoAngle (centered at 150, 100) */}
                <g transform={`rotate(${servoAngle - 90}, 150, 100)`}>
                  {/* Metal support arm bracket */}
                  <line x1="150" y1="100" x2="150" y2="40" stroke="#475569" strokeWidth="4" />
                  <rect x="146" y="45" width="8" height="25" fill="#1e293b" />
                  
                  {/* Pivoting Solar PV Panel (represented realistically) */}
                  <g transform="translate(150, 40)">
                    {/* Glass surface frame */}
                    <rect x="-45" y="-6" width="90" height="12" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                    {/* PV grid cells lines */}
                    <line x1="-30" y1="-6" x2="-30" y2="6" stroke="#475569" strokeWidth="0.8" />
                    <line x1="-15" y1="-6" x2="-15" y2="6" stroke="#475569" strokeWidth="0.8" />
                    <line x1="0" y1="-6" x2="0" y2="6" stroke="#475569" strokeWidth="0.8" />
                    <line x1="15" y1="-6" x2="15" y2="6" stroke="#475569" strokeWidth="0.8" />
                    <line x1="30" y1="-6" x2="30" y2="6" stroke="#475569" strokeWidth="0.8" />
                    <line x1="-45" y1="0" x2="45" y2="0" stroke="#475569" strokeWidth="0.8" />
                    
                    {/* Tiny representation of Photodetector LDR array on edges */}
                    <circle cx="-42" cy="-8" r="2.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
                    <circle cx="42" cy="-8" r="2.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
                  </g>
                </g>

                {/* Tracking Ray lines to guide user */}
                {mode === "AUTO" && isTracking && (
                  <line
                    x1="150"
                    y1="40"
                    x2={150 + 95 * Math.cos((sunAngle * Math.PI) / 180 - Math.PI)}
                    y2={100 + 95 * Math.sin((sunAngle * Math.PI) / 180 - Math.PI)}
                    stroke="#fbbf24"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>

            {/* Quick stats feed mimicking active calibration log */}
            <div className="mt-3 bg-surface-50 dark:bg-surface-900/60 p-3 rounded-xl border border-surface-100 dark:border-surface-800/80 text-[10px] font-semibold text-gray-500 space-y-1">
              <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-wider text-[8px] pb-1 border-b border-surface-100 dark:border-surface-800/80 mb-1">
                <span>Hardware Parameter Log</span>
                <span className="text-indigo-400">TELEMETRY SYNCED</span>
              </div>
              <div className="flex justify-between">
                <span>Yaw Motor Load:</span>
                <span className="text-gray-700 dark:text-gray-300 font-extrabold font-mono">0.14 A</span>
              </div>
              <div className="flex justify-between">
                <span>Photodetector Delta:</span>
                <span className="text-gray-700 dark:text-gray-300 font-extrabold font-mono">
                  {mode === "AUTO" ? `${Math.abs(Math.round(servoAngle - sunAngle))} LSB` : "N/A (MANUAL)"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-950/30 p-4 rounded-2xl flex items-start space-x-3.5">
        <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <h5 className="font-extrabold text-gray-900 dark:text-gray-100">
            About the Physical Construction
          </h5>
          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            As demonstrated in Javis's hands-on project tracking videos, the physical prototype sits on structural support layers representing mechatronics stack stabilization. The tracking controller features real-time calibration loops, utilizing standard 16x2 character displays driven by standard non-blocking loops. Wi-Fi telemetry communicates active angles (<code className="text-indigo-500 font-bold font-mono">S:180</code>) and error rates (<code className="text-indigo-500 font-bold font-mono">E:10</code>) dynamically.
          </p>
        </div>
      </div>

    </div>
  );
}
