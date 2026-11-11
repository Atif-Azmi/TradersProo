const fs = require('fs');
const file = 'app/(dashboard)/dashboard/DashboardClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace card backgrounds with #F2EEE9
content = content.split('bg-[#E9E4DE] dark:bg-[#2A2926]').join('bg-[#F2EEE9] dark:bg-[#2A2926]');

// Replace danger action icon
content = content.replace("? 'bg-[#D98A7B] text-[#4A1D14]'", "? 'bg-[#F0C9C1] text-[#8A2E22]'");

// Replace row hover
content = content.split('hover:bg-[#F2EEE9]/60 dark:hover:bg-[#33322E]/60').join('hover:bg-[#EDE8E2] dark:hover:bg-[#33322E]');

// Replace row dividers
content = content.split('divide-[#CAC8C0]/50 dark:divide-[#45433E]/50').join('divide-[#CAC8C0] dark:divide-[#45433E]');
content = content.split('border-[#CAC8C0]/60 dark:border-[#45433E]/60').join('border-[#CAC8C0] dark:border-[#45433E]');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated DashboardClient.tsx');

