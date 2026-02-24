import { supabase, supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ClientRedirect from './client-redirect'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('long_url, click_count')
      .eq('short_code', shortCode)
      .single()

    if (error || !url) {
      notFound()
    }

    // Get headers for click tracking
    const headersList = await headers()
    const referrer = headersList.get('referer') || null
    const userAgent = headersList.get('user-agent') || null
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    // Record click in clicks table (use admin client for server-side writes)
    await supabaseAdmin
      .from('clicks')
      .insert([
        {
          short_code: shortCode,
          referrer,
          user_agent: userAgent,
          ip
        }
      ])

    // Increment click count (use admin client for server-side writes)
    await supabaseAdmin
      .from('urls')
      .update({ click_count: (url.click_count || 0) + 1 })
      .eq('short_code', shortCode)

    // Try server-side redirect first
    redirect(url.long_url)
  } catch (error) {
    // If server redirect fails, try client-side redirect
    const { data: url } = await supabase
      .from('urls')
      .select('long_url')
      .eq('short_code', shortCode)
      .single()
    
    if (url) {
      return <ClientRedirect url={url.long_url} />
    }
    
    notFound()
  }
}