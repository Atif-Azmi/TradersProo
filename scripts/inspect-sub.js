const fs = require('fs');
const file = 'app/(dashboard)/subscription/SubscriptionClient.tsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('bg-[#') || l.includes('tp-card') || l.includes('bg-') || l.includes('border-[#')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

