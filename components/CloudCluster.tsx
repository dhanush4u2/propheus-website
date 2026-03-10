'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CloudCluster = ({
    width = 400,
    height = 250,
    y = '20%',
    speed = 40,
    delay = 0,
    opacity = 0.9,
    scale = 1,
    seed = 1,
    shadowX = 20,
    shadowY = 30,
    zIndex = 10,
}: {
    width?: number;
    height?: number;
    y?: string;
    speed?: number;
    delay?: number;
    opacity?: number;
    scale?: number;
    seed?: number;
    shadowX?: number;
    shadowY?: number;
    zIndex?: number;
}) => {
    const baseFreqX = (0.007 / scale).toFixed(4);
    const baseFreqY = (0.011 / scale).toFixed(4);

    return (
        <motion.div
            className="absolute left-0 flex items-center justify-center pointer-events-none"
            style={{
                width,
                height,
                top: y,
                zIndex,
                opacity,
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
            }}
            initial={{ x: '-150%' }}
            animate={{ x: '100vw' }}
            transition={{
                repeat: Infinity,
                duration: speed,
                delay,
                ease: 'linear',
            }}
        >
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <filter id={`cloud-filter-${seed}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`${baseFreqX} ${baseFreqY}`}
                            numOctaves="6"
                            seed={seed}
                            result="noise"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="
                                1 0 0 0 1
                                0 1 0 0 1
                                0 0 1 0 1
                                0 0 0 7 -3
                            "
                            in="noise"
                            result="coloredNoise"
                        />
                        <feDropShadow
                            dx={shadowX}
                            dy={shadowY}
                            stdDeviation="15"
                            floodColor="#000814"
                            floodOpacity="0.6"
                            result="shadow"
                        />
                    </filter>
                </defs>
            </svg>

            <div
                className="w-full h-full"
                style={{ filter: `url(#cloud-filter-${seed})` }}
            />
        </motion.div>
    );
};
