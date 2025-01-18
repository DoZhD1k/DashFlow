import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export const GsapCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // При первой загрузке анимируем блок, вылетающий снизу
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md"
    >
      Привет, я GsapCard!
    </div>
  );
};
