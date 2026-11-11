/**
 * TradersPro Canonical Design Tokens (Single Source of Truth)
 *
 * Consumed by:
 * 1. React Web & Landing Page (via CSS variables in globals.css)
 * 2. Mobile App (React Native theme)
 * 3. Node.js & PDF/Bill Generation (RGB values for jsPDF & email HTML)
 */

export const palette = {
  light: {
    primary: '#B4E0CA',
    primaryPressed: '#9CCDB4',
    primaryStrong: '#88A993',
    onPrimary: '#1E3121',
    background: '#E0DCD6',
    surface: '#E9E4DE',
    surfaceRaised: '#F2EEE9',
    border: '#CAC8C0',
    ink: '#3E3B36',
    inkSecondary: '#7A756F',
    disabled: '#A09B94',
    success: '#B4E0CA',
    onSuccess: '#1E3121',
    warning: '#E3D094',
    onWarning: '#4A3F12',
    danger: '#D98A7B',
    onDanger: '#4A1D14',
    info: '#9DB8C9',
    onInfo: '#1F3441',
    focusRing: 'rgba(180, 224, 202, 0.6)',
    focusRingBorder: '#88A993',
  },
  dark: {
    primary: '#B4E0CA',
    primaryPressed: '#9CCDB4',
    primaryStrong: '#88A993',
    onPrimary: '#1E3121',
    background: '#1F1E1B',
    surface: '#2A2926',
    surfaceRaised: '#33322E',
    border: '#45433E',
    ink: '#EDE9E3',
    inkSecondary: '#A8A39B',
    disabled: '#5E5A54',
    success: '#B4E0CA',
    onSuccess: '#1E3121',
    warning: '#E3D094',
    onWarning: '#4A3F12',
    danger: '#D98A7B',
    onDanger: '#4A1D14',
    info: '#9DB8C9',
    onInfo: '#1F3441',
    focusRing: 'rgba(180, 224, 202, 0.4)',
    focusRingBorder: '#88A993',
  },
} as const;

/**
 * Exact RGB tuples for Node.js PDF & canvas rendering (jsPDF / autoTable)
 */
export const pdfTokens = {
  primary: [180, 224, 202] as [number, number, number],         // #B4E0CA (Mint Accent)
  primaryStrong: [136, 169, 147] as [number, number, number],   // #88A993
  onPrimary: [30, 49, 33] as [number, number, number],          // #1E3121 (Dark Green Text)
  background: [224, 220, 214] as [number, number, number],      // #E0DCD6 (Warm Stone)
  surface: [233, 228, 222] as [number, number, number],         // #E9E4DE
  surfaceRaised: [242, 238, 233] as [number, number, number],   // #F2EEE9
  border: [202, 200, 192] as [number, number, number],          // #CAC8C0
  ink: [62, 59, 54] as [number, number, number],                // #3E3B36 (Dark Warm Charcoal)
  inkSecondary: [122, 117, 111] as [number, number, number],    // #7A756F
  white: [255, 255, 255] as [number, number, number],
  warning: [227, 208, 148] as [number, number, number],         // #E3D094
  onWarning: [74, 63, 18] as [number, number, number],          // #4A3F12
  danger: [217, 138, 123] as [number, number, number],          // #D98A7B
  onDanger: [74, 29, 20] as [number, number, number],           // #4A1D14
};

export const curves = {
  pill: '9999px',
  card: '20px',
  cardLarge: '24px',
  sheet: '28px',
  small: '12px',
};

export const shadows = {
  warmCard: '0 8px 24px -4px rgba(62, 59, 54, 0.08)',
  warmRaised: '0 12px 32px -6px rgba(62, 59, 54, 0.12)',
  warmPill: '0 4px 16px -2px rgba(62, 59, 54, 0.10)',
};

