const fs = require('fs');
const file = 'app/(dashboard)/settings/SettingsClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('bg-[#E9E4DE] dark:bg-[#2A2926]', 'bg-[#F2EEE9] dark:bg-[#2A2926]');
content = content.replace('border-b border-slate-100', 'border-b border-[#CAC8C0] dark:border-[#45433E]');
content = content.split('border border-slate-200 rounded-lg').join('border border-[#CAC8C0] dark:border-[#45433E] rounded-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3]');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated SettingsClient.tsx');

