const fs = require('fs');
const file = 'app/(dashboard)/subscription/SubscriptionClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('bg-slate-100 rounded-full h-2', 'bg-[#CAC8C0] dark:bg-[#45433E] rounded-full h-2');
content = content.replace("isElite ? 'bg-emerald-500' : 'bg-[#B4E0CA]'", "isElite ? 'bg-[#3F6B52]' : 'bg-[#B4E0CA]'");

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated SubscriptionClient.tsx');

