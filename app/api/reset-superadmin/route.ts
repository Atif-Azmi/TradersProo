import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const email = 'superadmin@trader.in';
  const newPassword = 'superadmin123';

  try {
    // 1. List users to find the correct ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      // 2. Update existing user's password
      const { error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: newPassword }
      );
      if (error) throw error;
      return NextResponse.json({ 
        success: true, 
        message: `Password for ${email} has been reset to '${newPassword}'` 
      });
    } else {
      // 3. Create the user if not exists
      const { error } = await supabase.auth.admin.createUser({
        email,
        password: newPassword,
        email_confirm: true
      });
      if (error) throw error;
      return NextResponse.json({ 
        success: true, 
        message: `Superadmin user ${email} created successfully with password '${newPassword}'` 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
