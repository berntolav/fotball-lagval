'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState<{
    supabaseConfigured: boolean
    databaseConnected: boolean
    playersCount: number
    sampleToken: string | null
    error: string | null
  }>({
    supabaseConfigured: false,
    databaseConnected: false,
    playersCount: 0,
    sampleToken: null,
    error: null,
  })

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Sjekk om Supabase er konfigurert
      const supabaseConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      if (!supabaseConfigured) {
        setStatus({
          supabaseConfigured: false,
          databaseConnected: false,
          playersCount: 0,
          sampleToken: null,
          error: 'Supabase environment variables er ikkje satt. Legg til NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY i Vercel.',
        })
        return
      }

      // Test database-tilkopling ved å hente spelare
      const { data: players, error } = await supabase
        .from('players')
        .select('id, first_name, invite_token')
        .limit(1)

      if (error) {
        setStatus({
          supabaseConfigured: true,
          databaseConnected: false,
          playersCount: 0,
          sampleToken: null,
          error: `Database feil: ${error.message}. Sjekk at du har køyrt supabase-setup.sql i Supabase SQL Editor.`,
        })
        return
      }

      // Hent totalt antal spelare
      const { count } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })

      setStatus({
        supabaseConfigured: true,
        databaseConnected: true,
        playersCount: count || 0,
        sampleToken: players && players.length > 0 ? players[0].invite_token : null,
        error: null,
      })
    } catch (err: any) {
      setStatus({
        supabaseConfigured: false,
        databaseConnected: false,
        playersCount: 0,
        sampleToken: null,
        error: `Generell feil: ${err.message}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Oppsett Test
          </h1>

          <div className="space-y-4">
            {/* Supabase Config */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {status.supabaseConfigured ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Supabase Konfigurasjon</h3>
                <p className="text-sm text-gray-600">
                  {status.supabaseConfigured
                    ? 'Environment variables er satt riktig'
                    : 'Environment variables manglar'}
                </p>
              </div>
            </div>

            {/* Database Connection */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {status.databaseConnected ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Database Tilkopling</h3>
                <p className="text-sm text-gray-600">
                  {status.databaseConnected
                    ? 'Kan kommunisere med databasen'
                    : 'Kan ikkje nå databasen'}
                </p>
              </div>
            </div>

            {/* Players Count */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {status.playersCount > 0 ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Spelare i Database</h3>
                <p className="text-sm text-gray-600">
                  {status.playersCount > 0
                    ? `${status.playersCount} spelare funne`
                    : 'Ingen spelare funne - køyr supabase-setup.sql'}
                </p>
              </div>
            </div>

            {/* Error */}
            {status.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Feil:</h3>
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            )}

            {/* Sample Token */}
            {status.sampleToken && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">✅ Alt OK! Test-lenke:</h3>
                <div className="bg-white rounded p-2 border border-green-300 break-all text-sm">
                  {`${window.location.origin}/vote?token=${status.sampleToken}`}
                </div>
                <a
                  href={`/vote?token=${status.sampleToken}`}
                  className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Test denne lenka
                </a>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Neste steg:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Opprett Supabase-prosjekt på supabase.com</li>
                <li>Køyr supabase-setup.sql i Supabase SQL Editor</li>
                <li>Legg til Environment Variables i Vercel:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </li>
                <li>Redeploy applikasjonen i Vercel</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
