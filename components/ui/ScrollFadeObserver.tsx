"use client";

import { useEffect } from "react";

// Intersection Observer — macht alle Elemente mit .scroll-fade sichtbar beim Einrollen
export function ScrollFadeObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Nur einmal animieren
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-fade");
    elements.forEach((el) => observer.observe(el));

    // MutationObserver für dynamisch hinzugefügte Elemente
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            const fadeEls = node.querySelectorAll(".scroll-fade");
            fadeEls.forEach((el) => observer.observe(el));
            if (node.classList?.contains("scroll-fade")) {
              observer.observe(node);
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
