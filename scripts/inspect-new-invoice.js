const fs = require('fs');
const file = 'app/(dashboard)/sales/new/NewInvoiceClient.tsx';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('bg-[#E9E4DE]') || l.includes('tp-card') || l.includes('bg-') || l.includes('border-[#')) {
      console.log((idx+1) + ': ' + l.trim());
    }
  });
} else {
  console.log('File does not exist');
}

