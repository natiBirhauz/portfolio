"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LangContext";

interface Metrics {
  ping: number;
  fps: number;
  loadTime: number;
}

export default function PerformanceMetrics() {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    ping: 0,
    fps: 0,
    loadTime: 0,
  });

  // Calculate FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Calculate ping (using performance API)
  useEffect(() => {
    const measurePing = async () => {
      try {
        const start = performance.now();
        // Ping the current domain
        await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
        const end = performance.now();
        setMetrics(prev => ({ ...prev, ping: Math.round(end - start) }));
      } catch {
        setMetrics(prev => ({ ...prev, ping: -1 }));
      }
    };

    measurePing();
    const interval = setInterval(measurePing, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Get page load time
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));
    }
  }, []);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value === -1) return "text-gray-400";
    if (value < thresholds[0]) return "text-emerald-500";
    if (value < thresholds[1]) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(255,255,255,0.6)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Gradient top stripe */}
            <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-violet-500 to-cyan-500" />
            
            <div className="px-5 py-4 min-w-[240px]">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="animate-pulse">●</span>
                Real-time Metrics
              </h3>

              <div className="space-y-2">
                {/* Ping */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Latency</span>
                  <span className={`text-sm font-bold ${getStatusColor(metrics.ping, [100, 300])}`}>
                    {metrics.ping === -1 ? "---" : `${metrics.ping}ms`}
                  </span>
                </div>

                {/* FPS */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">FPS</span>
                  <span className={`text-sm font-bold ${getStatusColor(61 - metrics.fps, [6, 16])}`}>
                    {metrics.fps}
                  </span>
                </div>

                {/* Load Time */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Load Time</span>
                  <span className={`text-sm font-bold ${getStatusColor(metrics.loadTime, [2000, 4000])}`}>
                    {metrics.loadTime === 0 ? "---" : `${(metrics.loadTime / 1000).toFixed(2)}s`}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-3 text-[10px] font-medium">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-gray-500">Good</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-gray-500">Fair</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-500">Poor</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-lg flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-all"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #059669, #0891b2)"
            : "rgba(255,255,255,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isOpen ? "none" : "1.5px solid rgba(255,255,255,0.6)",
          color: isOpen ? "white" : "#059669",
          boxShadow: isOpen
            ? "0 8px 24px rgba(5,150,105,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        aria-label="Toggle performance metrics"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="hidden sm:inline">
          {isOpen ? t.metrics.close : t.metrics.open}
        </span>
      </motion.button>
    </div>
  );
}
