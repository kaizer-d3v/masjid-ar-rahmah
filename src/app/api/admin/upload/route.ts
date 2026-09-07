import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/content'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Send multipart form field "file"' }, { status: 400 })
  }
  try {
    const url = await uploadImage(file)
    return NextResponse.json({ url })
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 500 })
  }
}
