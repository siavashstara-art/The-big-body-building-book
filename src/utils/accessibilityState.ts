// Accessibility & ADHD Focus Mode state management and DOM application

export interface AccessibilitySettings {
  fontSizePx: number; // 12 to 28
  isHighContrast: boolean;
  isAdhdFocusMode: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSizePx: 16,
  isHighContrast: false,
  isAdhdFocusMode: false,
};

export function getSavedAccessibilitySettings(): AccessibilitySettings {
  try {
    const saved = localStorage.getItem('able_city_accessibility');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem('able_city_accessibility', JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function applyAccessibilityToDOM(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  
  // 1. Font size adjustment
  root.style.setProperty('--app-font-size', `${settings.fontSizePx}px`);
  
  // 2. High Contrast mode toggle
  if (settings.isHighContrast) {
    document.body.classList.add('high-contrast-mode');
  } else {
    document.body.classList.remove('high-contrast-mode');
  }

  // 3. ADHD Focus mode toggle
  if (settings.isAdhdFocusMode) {
    document.body.classList.add('adhd-focused');
  } else {
    document.body.classList.remove('adhd-focused');
  }
}
