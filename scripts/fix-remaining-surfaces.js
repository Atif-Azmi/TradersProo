const fs = require('fs');

// 1. Fix app/(dashboard)/advances/AdvancesClient.tsx
let adv = fs.readFileSync('app/(dashboard)/advances/AdvancesClient.tsx', 'utf8');
adv = adv.replace('divide-y divide-[#CAC8C0]/50 dark:divide-[#45433E]/50 bg-[#E9E4DE] dark:bg-[#2A2926]', 'divide-y divide-[#CAC8C0] dark:divide-[#45433E] bg-[#F2EEE9] dark:bg-[#2A2926]');
fs.writeFileSync('app/(dashboard)/advances/AdvancesClient.tsx', adv, 'utf8');
console.log('✓ Fixed AdvancesClient.tsx mobile container');

// 2. Fix app/page.tsx
let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.split('w-full bg-[#E9E4DE] dark:bg-[#2A2926]').join('w-full bg-[#F2EEE9] dark:bg-[#2A2926]');
page = page.split('-left-12 bg-[#E9E4DE] dark:bg-[#2A2926]').join('-left-12 bg-[#F2EEE9] dark:bg-[#2A2926]');
fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('✓ Fixed app/page.tsx');

// 3. Fix app/shared-bill/[id]/page.tsx
let bill = fs.readFileSync('app/shared-bill/[id]/page.tsx', 'utf8');
bill = bill.split('bg-[#E9E4DE] dark:bg-[#2A2926]').join('bg-[#F2EEE9] dark:bg-[#2A2926]');
fs.writeFileSync('app/shared-bill/[id]/page.tsx', bill, 'utf8');
console.log('✓ Fixed shared-bill/[id]/page.tsx');

// 4. Fix components/Navbar.tsx
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
nav = nav.replace('bg-[#E9E4DE] dark:bg-[#2A2926]', 'bg-[#F2EEE9] dark:bg-[#2A2926]');
fs.writeFileSync('components/Navbar.tsx', nav, 'utf8');
console.log('✓ Fixed Navbar.tsx');

// 5. Fix tailwind.config.ts
let tw = fs.readFileSync('tailwind.config.ts', 'utf8');
tw = tw.split('var(--surface, #E9E4DE)').join('var(--surface, #F2EEE9)');
fs.writeFileSync('tailwind.config.ts', tw, 'utf8');
console.log('✓ Fixed tailwind.config.ts');

