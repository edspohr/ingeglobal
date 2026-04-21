import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const ROBOT_IMAGE_SRC = "/robot-minero.png";

const MiningRobotAvatar = ({
  size = 64,
  showNotificationDot = false,
  className = "",
}) => {
  const eyeControls = useAnimationControls();
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const blinkLoop = async () => {
      while (!cancelled) {
        const wait = 3500 + Math.random() * 3000;
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, wait);
        });
        if (cancelled) return;
        try {
          await eyeControls.start({
            scaleY: [1, 0.1, 1],
            transition: { duration: 0.15, times: [0, 0.5, 1] },
          });
        } catch {
          // Animation interrupted on unmount — safe to ignore
        }
      }
    };

    blinkLoop();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [eyeControls]);

  const dimension = `${size}px`;

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: dimension, height: dimension }}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-yellow-600 border-2 border-brand-gold/40 shadow-[0_0_18px_rgba(212,162,78,0.45)]"
        style={{ width: dimension, height: dimension }}
      >
        {imageOk ? (
          <img
            src={ROBOT_IMAGE_SRC}
            alt="Robot minero"
            className="w-full h-full object-cover"
            onError={() => setImageOk(false)}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black font-bold select-none">
            <span style={{ fontSize: size * 0.5 }} role="img" aria-label="robot">
              🤖
            </span>
          </div>
        )}

        {/* Headlamp glow pulse — centered on the helmet lamp (~50% x, ~22% y, r ~12%) */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: `${size * 0.22}px`,
            left: "50%",
            width: `${Math.max(8, size * 0.24)}px`,
            height: `${Math.max(8, size * 0.24)}px`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, #FFD87A 0%, #D4A24E 60%, rgba(212,162,78,0) 100%)",
            filter: "blur(1px)",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Eye blink overlays — two circles covering the robot's blue eyes
            (centers at ~33%/~67% x, ~48% y, radius ~11%) */}
        <motion.div
          className="absolute pointer-events-none flex justify-between"
          style={{
            top: `${size * 0.37}px`,
            left: `${size * 0.22}px`,
            width: `${size * 0.56}px`,
            height: `${size * 0.22}px`,
            transformOrigin: "center",
          }}
          animate={eyeControls}
          initial={{ scaleY: 1 }}
        >
          <span
            className="block rounded-full"
            style={{
              width: `${size * 0.22}px`,
              height: "100%",
              background:
                "radial-gradient(circle, rgba(96,165,250,0.40) 0%, #2A1810 78%)",
            }}
          />
          <span
            className="block rounded-full"
            style={{
              width: `${size * 0.22}px`,
              height: "100%",
              background:
                "radial-gradient(circle, rgba(96,165,250,0.40) 0%, #2A1810 78%)",
            }}
          />
        </motion.div>
      </div>

      {showNotificationDot && (
        <span
          className="absolute flex"
          style={{
            top: `-${Math.max(2, size * 0.04)}px`,
            right: `-${Math.max(2, size * 0.04)}px`,
            width: `${Math.max(10, size * 0.22)}px`,
            height: `${Math.max(10, size * 0.22)}px`,
          }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex w-full h-full rounded-full bg-red-500 border-2 border-brand-gold"></span>
        </span>
      )}
    </motion.div>
  );
};

export default MiningRobotAvatar;
