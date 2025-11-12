import { useEffect, useRef, useState } from 'react';

// Global Map untuk track semua animasi yang sudah berjalan
const globalAnimationState = new Map<string, boolean>();

/**
 * Hook BULLETPROOF untuk animasi yang benar-benar hanya berjalan sekali
 * Menggunakan kombinasi: global state + sessionStorage + ref locks
 */
export function useOnceAnimation(threshold = 0.3, storageKey: string) {
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  
  // Check dari 3 sumber: globalState, sessionStorage, dan ref
  const checkIfAnimated = (): boolean => {
    // Check 1: Global runtime state
    if (globalAnimationState.get(storageKey)) return true;
    
    // Check 2: SessionStorage (untuk persist antar navigation)
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === 'true') {
        globalAnimationState.set(storageKey, true);
        return true;
      }
    }
    
    // Check 3: Ref (untuk prevent race condition)
    if (hasTriggeredRef.current) return true;
    
    return false;
  };
  
  const [hasAnimated, setHasAnimated] = useState(checkIfAnimated);

  useEffect(() => {
    const element = ref.current;
    
    // Early return jika sudah pernah animasi
    if (!element || checkIfAnimated()) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Triple lock check sebelum trigger
          if (entry.isIntersecting && !checkIfAnimated()) {
            // Lock immediately
            hasTriggeredRef.current = true;
            globalAnimationState.set(storageKey, true);
            
            // Save to sessionStorage
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(storageKey, 'true');
            }
            
            // Update state
            setHasAnimated(true);
            
            // Disconnect
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []); // Intentionally empty - only run once

  return { ref, hasAnimated };
}