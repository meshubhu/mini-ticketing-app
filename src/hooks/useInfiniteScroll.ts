import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll({
  enabled = true,
  onLoad,
}: {
  enabled?: boolean;
  onLoad: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [observing, setObserving] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onLoad();
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    obs.observe(el);
    setObserving(true);
    return () => {
      obs.disconnect();
      setObserving(false);
    };
  }, [enabled, onLoad]);

  return ref;
}
