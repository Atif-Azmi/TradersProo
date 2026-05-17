import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service role client — bypasses RLS to manage all business nodes
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await adminSupabase
    .from('tp_superadmin_users_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}

export async function PATCH(request: Request) {
  const { user_id, new_trial_days } = await request.json()

  if (!user_id || new_trial_days === undefined) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const daysInt = parseInt(new_trial_days)
  const targetExpiry = new Date()
  targetExpiry.setDate(targetExpiry.getDate() + daysInt)

  const { error } = await adminSupabase
    .from('tp_profile')
    .update({ 
      plan_expiry: targetExpiry.toISOString()
    })
    .eq('id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ result: { success: true } })
}

export async function POST(request: Request) {
  const { user_id, action } = await request.json()

  const { error } = await adminSupabase
    .from('tp_profile')
    .update({ is_locked: action === 'lock' })
    .eq('id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
