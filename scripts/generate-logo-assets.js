const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Define SVG strings
const markOnlySvg = (bgColor, checkColor) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="${bgColor}"/>
  <path d="M256 96C336 96 392 120 392 192C392 312 312 396 256 424C200 396 120 312 120 192C120 120 176 96 256 96Z" fill="${checkColor === '#FFFFFF' ? '#1E3121' : '#B4E0CA'}"/>
  <path d="M196 248L240 292L324 196" stroke="${checkColor}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`.trim();

const horizontalLogoSvg = (variant) => {
  // variants: 'light' | 'dark' | 'mono'
  let tradersColor = '#3E3B36';
  let proColor = '#3F6B52';
  let shieldFill = '#B4E0CA';
  let checkColor = '#1E3121';

  if (variant === 'dark') {
    tradersColor = '#EDE9E3';
    proColor = '#B4E0CA';
    shieldFill = '#B4E0CA';
    checkColor = '#1E3121';
  } else if (variant === 'mono') {
    tradersColor = '#1E3121';
    proColor = '#1E3121';
    shieldFill = '#1E3121';
    checkColor = '#FFFFFF';
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48" fill="none">
  <!-- Shield Badge Mark -->
  <g transform="translate(4, 4)">
    <rect width="40" height="40" rx="20" fill="${shieldFill}"/>
    <path d="M20 9C25.5 9 29.5 10.8 29.5 16C29.5 24.5 24 30.5 20 32.5C16 30.5 10.5 24.5 10.5 16C10.5 10.8 14.5 9 20 9Z" fill="${shieldFill}"/>
    <path d="M15 20.5L18.5 24L25.5 16.5" stroke="${checkColor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- Wordmark -->
  <text x="56" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" font-size="24" font-weight="900" letter-spacing="-0.5px">
    <tspan fill="${tradersColor}">Traders</tspan><tspan fill="${proColor}">Pro</tspan>
  </text>
</svg>
`.trim();
};

const ogImageSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#E0DCD6"/>
  
  <!-- Subtle decorative warm card behind -->
  <rect x="80" y="80" width="1040" height="470" rx="32" fill="#F2EEE9" stroke="#CAC8C0" stroke-width="2"/>
  
  <!-- Centered Logo Mark -->
  <g transform="translate(540, 150)">
    <rect width="120" height="120" rx="60" fill="#B4E0CA"/>
    <path d="M60 28C76 28 88 34 88 50C88 76 72 94 60 100C48 94 32 76 32 50C32 34 44 28 60 28Z" fill="#B4E0CA"/>
    <path d="M46 62L56 72L76 50" stroke="#1E3121" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Title -->
  <text x="600" y="340" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" font-size="56" font-weight="900" letter-spacing="-1px">
    <tspan fill="#3E3B36">Traders</tspan><tspan fill="#3F6B52">Pro</tspan>
  </text>

  <!-- Tagline -->
  <text x="600" y="395" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" font-size="22" font-weight="700" fill="#7A756F" letter-spacing="2px">
    HARDWARE BUSINESS MANAGEMENT
  </text>
  
  <text x="600" y="440" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" font-size="18" font-weight="600" fill="#3E3B36">
    Inventory • Invoicing • Ledger • WhatsApp Reminders
  </text>
</svg>
`.trim();

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 1. Write the 3 SVG variants
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), horizontalLogoSvg('light'), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-dark.svg'), horizontalLogoSvg('dark'), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-mono.svg'), horizontalLogoSvg('mono'), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), markOnlySvg('#B4E0CA', '#1E3121'), 'utf8');
  console.log('✓ Created logo.svg, logo-dark.svg, logo-mono.svg, logo-mark.svg');

  // 2. Export Raster PNGs & ICO using sharp
  const markSvgBuffer = Buffer.from(markOnlySvg('#E0DCD6', '#1E3121'));
  const appIconSvgBuffer = Buffer.from(markOnlySvg('#B4E0CA', '#1E3121'));
  const ogSvgBuffer = Buffer.from(ogImageSvg());
  const logoLightBuffer = Buffer.from(horizontalLogoSvg('light'));
  const logoDarkBuffer = Buffer.from(horizontalLogoSvg('dark'));

  // 512x512 PWA Icon
  await sharp(appIconSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('✓ Generated icon-512x512.png');

  // 192x192 PWA Icon
  await sharp(appIconSvgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('✓ Generated icon-192x192.png');

  // 180x180 Apple Touch Icon
  await sharp(appIconSvgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-icon.png'));
  console.log('✓ Generated apple-icon.png');

  // 48x48 icon.png
  await sharp(appIconSvgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('✓ Generated icon.png');

  // 32x32 favicon.png & favicon.ico
  const fav32 = await sharp(appIconSvgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fav32);
  console.log('✓ Generated favicon.ico (32x32 PNG container)');

  // 1200x630 OG Share Image
  await sharp(ogSvgBuffer)
    .resize(1200, 630)
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('✓ Generated og-image.jpg');

  // Horizontal Logo PNGs
  await sharp(logoLightBuffer)
    .resize(480, 96)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  await sharp(logoDarkBuffer)
    .resize(480, 96)
    .png()
    .toFile(path.join(publicDir, 'logo-dark.png'));
  console.log('✓ Generated logo.png & logo-dark.png');

  console.log('\nAll logo assets successfully rebuilt and exported!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

