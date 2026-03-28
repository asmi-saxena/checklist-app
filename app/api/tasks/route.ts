import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TABLE = 'tasks'

export async function GET(request: NextRequest) {
  const listId = request.nextUrl.searchParams.get('listId')
  if (!listId) {
    return NextResponse.json({ error: 'Missing listId' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, completed, date')
    .eq('listId', listId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tasks: data || [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const listId = body.listId
  const tasks = body.tasks

  if (!listId || !Array.isArray(tasks)) {
    return NextResponse.json({ error: 'Missing listId or invalid tasks payload' }, { status: 400 })
  }

  const payload = tasks.map((task: any) => ({
    id: String(task.id),
    listId: String(listId),
    title: String(task.title),
    completed: Boolean(task.completed),
    date: task.date ? String(task.date) : null,
  }))

  const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'id' })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const listId = request.nextUrl.searchParams.get('listId')
  if (!listId) {
    return NextResponse.json({ error: 'Missing listId' }, { status: 400 })
  }

  const { error } = await supabase.from(TABLE).delete().eq('listId', listId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
