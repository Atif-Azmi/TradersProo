const fs = require('fs');
const file = 'components/common/DashboardSkeleton.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.split('bg-[#E9E4DE] dark:bg-[#2A2926]').join('bg-[#F2EEE9] dark:bg-[#2A2926]');
fs.writeFileSync(file, content, 'utf8');
console.log('Updated DashboardSkeleton.tsx');

