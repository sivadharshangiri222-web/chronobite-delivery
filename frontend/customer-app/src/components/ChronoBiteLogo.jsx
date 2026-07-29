import React from 'react';
import { motion } from 'framer-motion';

export const ChronoBiteLogo = ({
  animated = false,
  width = 240,
  className = ''
}) => {
  const brandColor = '#E87722';

  // SVG viewBox setup: 320 x 180
  return (
    <div className={`inline-block select-none ${className}`} style={{ width: width }}>
      <svg
        viewBox="0 0 340 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        {/* ========================================================
            LINE 1: "chrono"
            - c (x=10)
            - h (x=42)
            - r (x=78)
            - o (1st clock o, cx=122, cy=46)
            - n (x=152)
            - o (2nd clock o, cx=194, cy=46) + Top Gear (cx=216, cy=24)
        ======================================================== */}
        <g id="chrono-group">
          {/* 'c' */}
          <path
            d="M 34 34 C 20 34 12 44 12 56 C 12 68 20 78 34 78 C 42 78 46 73 48 70"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* 'h' */}
          <path
            d="M 54 22 L 54 78 M 54 48 C 60 38 72 38 76 48 L 76 78"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'r' */}
          <path
            d="M 88 40 L 88 78 M 88 52 C 94 40 104 40 108 44"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* FIRST 'o' (Clock Face 1: cx=128, cy=58) */}
          <circle
            cx="128"
            cy="58"
            r="18"
            stroke={brandColor}
            strokeWidth="10"
          />
          {/* Clock Hands 1 */}
          <g transform="translate(128, 58)">
            {/* Hour hand fixed at 12 o'clock */}
            <line x1="0" y1="0" x2="0" y2="-9" stroke={brandColor} strokeWidth="3" strokeLinecap="round" />
            {/* Minute hand */}
            {animated ? (
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="-12"
                stroke={brandColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={{ rotate: 270 }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
                style={{ originX: '0px', originY: '0px' }}
              />
            ) : (
              <line x1="0" y1="0" x2="-9" y2="0" stroke={brandColor} strokeWidth="3.5" strokeLinecap="round" />
            )}
            <circle cx="0" cy="0" r="2.5" fill={brandColor} />
          </g>

          {/* 'n' */}
          <path
            d="M 158 40 L 158 78 M 158 50 C 164 40 176 40 180 48 L 180 78"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* SECOND 'o' (Clock Face 2: cx=208, cy=58) */}
          <circle
            cx="208"
            cy="58"
            r="18"
            stroke={brandColor}
            strokeWidth="10"
          />
          {/* Clock Hands 2 */}
          <g transform="translate(208, 58)">
            <line x1="0" y1="0" x2="0" y2="-9" stroke={brandColor} strokeWidth="3" strokeLinecap="round" />
            {animated ? (
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="-12"
                stroke={brandColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                transition={{ delay: 1.4, duration: 0.6, ease: 'easeInOut' }}
                style={{ originX: '0px', originY: '0px' }}
              />
            ) : (
              <line x1="0" y1="0" x2="0" y2="9" stroke={brandColor} strokeWidth="3.5" strokeLinecap="round" />
            )}
            <circle cx="0" cy="0" r="2.5" fill={brandColor} />
          </g>

          {/* TOP GEAR (Attached top-right of 2nd 'o': cx=232, cy=34) */}
          {animated ? (
            <motion.g
              transform="translate(232, 34)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{
                opacity: { delay: 0.3, duration: 0.3 },
                rotate: { repeat: Infinity, duration: 4, ease: 'linear' }
              }}
              style={{ originX: '232px', originY: '34px' }}
            >
              <circle cx="0" cy="0" r="10" stroke={brandColor} strokeWidth="3" fill="none" />
              <circle cx="0" cy="0" r="4" fill={brandColor} />
              {/* Gear Teeth */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <rect
                  key={i}
                  x="-2"
                  y="-14"
                  width="4"
                  height="4"
                  rx="1"
                  fill={brandColor}
                  transform={`rotate(${angle})`}
                />
              ))}
            </motion.g>
          ) : (
            <g transform="translate(232, 34)">
              <circle cx="0" cy="0" r="10" stroke={brandColor} strokeWidth="3" fill="none" />
              <circle cx="0" cy="0" r="4" fill={brandColor} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <rect key={i} x="-2" y="-14" width="4" height="4" rx="1" fill={brandColor} transform={`rotate(${angle})`} />
              ))}
            </g>
          )}
        </g>

        {/* ========================================================
            LINE 2: "bite"
            - b (cx=142, cy=128) with Bite Mark cutout
            - i (x=172)
            - t (x=190)
            - e (x=214) + Bottom-Right Gear (cx=240, cy=144)
        ======================================================== */}
        <g id="bite-group">
          {/* 'b' with bite mark */}
          <path
            d="M 126 92 L 126 148 M 126 128 C 126 112 144 110 152 122 C 158 132 152 148 136 148 C 128 148 126 142 126 142"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'i' */}
          <path
            d="M 172 110 L 172 148"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="172" cy="98" r="5.5" fill={brandColor} />

          {/* 't' */}
          <path
            d="M 194 96 L 194 142 C 194 148 200 148 204 146 M 186 112 L 202 112"
            stroke={brandColor}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'e' */}
          <path
            d="M 234 130 C 234 116 216 114 216 130 C 216 146 234 146 234 140 M 216 130 L 234 130"
            stroke={brandColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* BOTTOM-RIGHT GEAR (Attached near 'e': cx=246, cy=146) */}
          {animated ? (
            <motion.g
              transform="translate(246, 146)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: -360 }}
              transition={{
                opacity: { delay: 1.2, duration: 0.3 },
                rotate: { repeat: Infinity, duration: 3, ease: 'linear' }
              }}
              style={{ originX: '246px', originY: '146px' }}
            >
              <circle cx="0" cy="0" r="8" stroke={brandColor} strokeWidth="2.5" fill="none" />
              <circle cx="0" cy="0" r="3" fill={brandColor} />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <rect
                  key={i}
                  x="-1.5"
                  y="-11"
                  width="3"
                  height="3"
                  rx="1"
                  fill={brandColor}
                  transform={`rotate(${angle})`}
                />
              ))}
            </motion.g>
          ) : (
            <g transform="translate(246, 146)">
              <circle cx="0" cy="0" r="8" stroke={brandColor} strokeWidth="2.5" fill="none" />
              <circle cx="0" cy="0" r="3" fill={brandColor} />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <rect key={i} x="-1.5" y="-11" width="3" height="3" rx="1" fill={brandColor} transform={`rotate(${angle})`} />
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default ChronoBiteLogo;
