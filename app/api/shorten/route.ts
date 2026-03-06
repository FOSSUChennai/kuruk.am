import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateAnalyticsToken(): string {
  // Generate 12 random bytes and convert to base36 alphanumeric (0-9, a-z)
  return randomBytes(9).toString('hex').slice(0, 16)
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { longUrl, customAlias, enableAnalytics } = await request.json()

    if (!longUrl || !isValidUrl(longUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    let shortCode = customAlias

    if (customAlias) {
      const { data: existingAlias } = await supabase
        .from('urls')
        .select('short_code')
        .eq('short_code', customAlias)
        .single()

      if (existingAlias) {
        return NextResponse.json(
          { error: 'Custom alias already exists' },
          { status: 400 }
        )
      }
    } else {
      let isUnique = false
      while (!isUnique) {
        shortCode = generateShortCode()
        const { data: existingCode } = await supabase
          .from('urls')
          .select('short_code')
          .eq('short_code', shortCode)
          .single()

        if (!existingCode) {
          isUnique = true
        }
      }
    }

    // Generate analytics token if enabled
    const analyticsToken = enableAnalytics ? generateAnalyticsToken() : null

    // Use admin client for server-side writes
    const { data, error } = await supabaseAdmin
      .from('urls')
      .insert([
        {
          long_url: longUrl,
          short_code: shortCode!,
          custom_alias: customAlias || null,
          click_count: 0,
          analytics_token: analyticsToken
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create short URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kuruk.am'}/${shortCode}`,
      shortCode: shortCode!,
      analyticsToken: analyticsToken,
      analyticsUrl: analyticsToken ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kuruk.am'}/a/${analyticsToken}` : null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}