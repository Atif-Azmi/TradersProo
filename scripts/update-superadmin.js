const fs = require('fs');
const file = 'app/(dashboard)/superadmin/SuperAdminClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("case 'TRIAL': return 'bg-amber-100 text-amber-700 border border-amber-200'", "case 'TRIAL': return 'bg-[#E3D094] text-[#4A3F12] border border-[#E3D094]/60 shadow-sm'");
content = content.replace("case 'PAID': return 'bg-emerald-100 text-emerald-700 border border-emerald-200'", "case 'PAID': return 'bg-[#B4E0CA] text-[#1E3121] border border-[#88A993]/40 shadow-sm'");
content = content.replace("case 'EXPIRED': return 'bg-red-100 text-red-700 border border-red-200'", "case 'EXPIRED': return 'bg-[#F0C9C1] text-[#8A2E22] border border-[#F0C9C1]/80 shadow-sm'");
content = content.replace("case 'LOCKED': return 'bg-[#D98A7B] text-[#4A1D14] border border-[#D98A7B]/40'", "case 'LOCKED': return 'bg-[#F0C9C1] text-[#8A2E22] border border-[#F0C9C1]/80 shadow-sm'");
content = content.replace("default: return 'bg-slate-100 text-slate-600'", "default: return 'bg-[#E9E4DE] text-[#3E3B36]'");

content = content.replace("{ label: 'Total Nodes', value: totalUsers, icon: Users, bg: 'bg-[#B4E0CA]/40 text-[#1E3121]' }", "{ label: 'Total Nodes', value: totalUsers, icon: Users, bg: 'bg-[#B4E0CA] text-[#1E3121] shadow-sm' }");
content = content.replace("{ label: 'Active Trial', value: trialUsers, icon: Clock, bg: 'bg-[#E3D094]/40 text-[#4A3F12]' }", "{ label: 'Active Trial', value: trialUsers, icon: Clock, bg: 'bg-[#E3D094] text-[#4A3F12] shadow-sm' }");
content = content.replace("{ label: 'Premium Nodes', value: paidUsers, icon: TrendingUp, bg: 'bg-[#B4E0CA]/40 text-[#1E3121]' }", "{ label: 'Premium Nodes', value: paidUsers, icon: TrendingUp, bg: 'bg-[#B4E0CA] text-[#1E3121] shadow-sm' }");
content = content.replace("{ label: 'Expired/Dead', value: expiredUsers, icon: AlertTriangle, bg: 'bg-[#D98A7B]/40 text-[#4A1D14]' }", "{ label: 'Expired/Dead', value: expiredUsers, icon: AlertTriangle, bg: 'bg-[#F0C9C1] text-[#8A2E22] shadow-sm' }");
content = content.replace("{ label: 'Avg Longevity', value: `${avgDaysLeft}d`, icon: Shield, bg: 'bg-[#B4E0CA]/40 text-[#1E3121]' }", "{ label: 'Avg Longevity', value: `${avgDaysLeft}d`, icon: Shield, bg: 'bg-[#B4E0CA] text-[#1E3121] shadow-sm' }");

content = content.split("hover:bg-[#F2EEE9]/50 dark:hover:bg-[#33322E]/50").join("hover:bg-[#EDE8E2] dark:hover:bg-[#33322E]");
content = content.replace("? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'", "? 'bg-[#B4E0CA] text-[#1E3121] hover:bg-[#9CCDB4] border border-[#88A993]/40 shadow-sm'");
content = content.replace(": 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}", ": 'bg-[#F0C9C1] text-[#8A2E22] hover:bg-[#F0C9C1]/80 border border-[#F0C9C1]/80 shadow-sm'}");

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated SuperAdminClient.tsx');

