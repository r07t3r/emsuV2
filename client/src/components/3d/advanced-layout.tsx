import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Advanced3DLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'floating' | 'depth' | 'morphing' | 'holographic';
  animationStyle?: 'smooth' | 'bounce' | 'elastic' | 'magnetic';
}

export function Advanced3DLayout({ 
  children, 
  className, 
  variant = 'floating',
  animationStyle = 'smooth'
}: Advanced3DLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const variants = {
    floating: {
      initial: { y: 0, rotateX: 0, rotateY: 0, scale: 1 },
      hover: { 
        y: -10, 
        rotateX: mousePosition.y * 0.5,
        rotateY: mousePosition.x * 0.5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }
    },
    depth: {
      initial: { z: 0, rotateX: 0, rotateY: 0 },
      hover: {
        z: 50,
        rotateX: mousePosition.y * 0.3,
        rotateY: mousePosition.x * 0.3,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }
    },
    morphing: {
      initial: { 
        borderRadius: '12px',
        scale: 1,
        rotateX: 0,
        rotateY: 0
      },
      hover: {
        borderRadius: '24px',
        scale: 1.05,
        rotateX: mousePosition.y * 0.4,
        rotateY: mousePosition.x * 0.4,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      }
    },
    holographic: {
      initial: { 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      hover: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
        boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        rotateX: mousePosition.y * 0.2,
        rotateY: mousePosition.x * 0.2,
        transition: { type: "spring", stiffness: 150, damping: 25 }
      }
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative transform-gpu perspective-1000",
        variant === 'holographic' && "backdrop-blur-sm border border-white/20",
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      initial={currentVariant.initial}
      animate={isHovered ? currentVariant.hover : currentVariant.initial}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={currentVariant.hover}
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Content wrapper with 3D transforms */}
      <motion.div
        className="relative z-10"
        animate={{
          rotateX: isHovered ? mousePosition.y * 0.1 : 0,
          rotateY: isHovered ? mousePosition.x * 0.1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Interactive glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-xl"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Enhanced 3D Card Component
export function Enhanced3DCard({ 
  children, 
  className, 
  glowColor = 'blue',
  ...props 
}: any) {
  const [isHovered, setIsHovered] = useState(false);
  
  const glowColors = {
    blue: 'shadow-blue-500/20',
    purple: 'shadow-purple-500/20',
    green: 'shadow-green-500/20',
    orange: 'shadow-orange-500/20',
    pink: 'shadow-pink-500/20'
  };

  return (
    <Advanced3DLayout variant="floating" animationStyle="smooth">
      <Card 
        className={cn(
          "transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10",
          "border border-white/20 dark:border-white/10",
          isHovered && `shadow-2xl ${glowColors[glowColor]}`,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <CardContent className="relative">
          {children}
        </CardContent>
      </Card>
    </Advanced3DLayout>
  );
}

// Floating Action Button with 3D effects
export function Floating3DButton({ 
  children, 
  onClick, 
  className,
  variant = 'primary'
}: any) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    warning: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    secondary: 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
  };

  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 rounded-xl text-white font-medium shadow-lg",
        "transform-gpu transition-all duration-300",
        "hover:shadow-2xl hover:scale-105",
        variants[variant],
        className
      )}
      onClick={onClick}
      whileHover={{ 
        y: -2, 
        rotateX: 5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
            "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}