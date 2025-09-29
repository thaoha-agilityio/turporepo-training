export const isStandalone = window.matchMedia(
  '(display-mode: standalone)',
).matches;

export const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
