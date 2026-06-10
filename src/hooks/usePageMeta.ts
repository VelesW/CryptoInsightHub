import { useEffect } from "react";

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescEl = document.querySelector('meta[name="description"]');
    const prevDesc = prevDescEl?.getAttribute("content") ?? null;

    document.title = title;
    if (description) {
      let descEl = document.querySelector('meta[name="description"]');
      if (!descEl) {
        descEl = document.createElement("meta");
        descEl.setAttribute("name", "description");
        document.head.appendChild(descEl);
      }
      descEl.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (description && prevDescEl) {
        prevDescEl.setAttribute("content", prevDesc ?? "");
      } else if (description && !prevDescEl) {
        const cur = document.querySelector('meta[name="description"]');
        if (cur) cur.remove();
      }
    };
  }, [title, description]);
}
