const fs = require('fs');
const file = 'app/(dashboard)/sales/new/NewInvoiceClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('bg-[#E9E4DE] dark:bg-[#2A2926] rounded-[28px]', 'bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[28px]');
content = content.split('bg-[#E9E4DE] dark:bg-[#2A2926] text-[#3E3B36]').join('bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36]');
content = content.replace('bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-600 shadow-xl shadow-green-100', 'tp-button-primary text-xs uppercase tracking-widest');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated NewInvoiceClient.tsx');

