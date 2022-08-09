import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
