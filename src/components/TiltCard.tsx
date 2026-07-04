import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function TiltCard({ children, className = '', id }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for X & Y tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform coordinates to degree rotation values
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]); // Tilt angle on horizontal axis
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]); // Tilt angle on vertical axis

  // Spring settings for hyper-smooth lag-free feedback
  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position inside the card from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    // Reset rotations elegantly on leave
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative group ${className}`}
    >
      {/* 3D Inner Layer Depth Effect */}
      <div 
        style={{ transform: 'translateZ(20px)' }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
