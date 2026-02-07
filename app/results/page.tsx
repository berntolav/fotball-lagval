'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Player = {
  id: string
  first_name: string
  last_name: string
}

type ResponseWithNames = {
  id: string
  voter_name: string
  choice_1_name: string | null
  choice_2_name: string | null
  choice_3_name: string | null
  no_preference: boolean
  submitted_at: string
}

type PopularityStats = {
  player_name: string
  times_chosen: number
  percentage: number
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<ResponseWithNames[]>([])
  const [popularity, setPopularity] = useState<PopularityStats[]>([])
  const [stats, setStats] = useState({
    total: 0,
    noPreference: 0,
    withChoices: 0,
  })

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      // Hent alle responsar
      const { data: responsesData, error: responsesError } = await supabase
        .from('responses')
        .select(`
          id,
          player_id,
          choice_1,
          choice_2,
          choice_3,
          no_preference,
          submitted_at
        `)
        .order('submitted_at', { ascending: false })

      if (responsesError) throw responsesError

      // Hent alle spelare
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, first_name, last_name')

      if (playersError) throw playersError

      // Lag eit map for rask oppslag
      const playersMap = new Map<string, Player>()
      playersData?.forEach((p) => {
        playersMap.set(p.id, p)
      })

      // Kombiner data
      const responsesWithNames: ResponseWithNames[] = responsesData?.map((r) => {
        const voter = playersMap.get(r.player_id)
        const choice1 = r.choice_1 ? playersMap.get(r.choice_1) : null
        const choice2 = r.choice_2 ? playersMap.get(r.choice_2) : null
        const choice3 = r.choice_3 ? playersMap.get(r.choice_3) : null

        return {
          id: r.id,
          voter_name: getPlayerName(voter),
          choice_1_name: choice1 ? getPlayerName(choice1) : null,
          choice_2_name: choice2 ? getPlayerName(choice2) : null,
          choice_3_name: choice3 ? getPlayerName(choice3) : null,
          no_preference: r.no_preference,
          submitted_at: r.submitted_at,
        }
      }) || []

      setResponses(responsesWithNames)

      // Berekn statistikk
      const total = responsesWithNames.length
      const noPreference = responsesWithNames.filter((r) => r.no_preference).length
      setStats({
        total,
        noPreference,
        withChoices: total - noPreference,
      })

      // Berekn popularitet
      calculatePopularity(responsesData || [], playersMap)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching results:', error)
      setLoading(false)
    }
  }

  const calculatePopularity = (responsesData: any[], playersMap: Map<string, Player>) => {
    const choiceCounts = new Map<string, number>()

    responsesData.forEach((r) => {
      if (!r.no_preference) {
        if (r.choice_1) choiceCounts.set(r.choice_1, (choiceCounts.get(r.choice_1) || 0) + 1)
        if (r.choice_2) choiceCounts.set(r.choice_2, (choiceCounts.get(r.choice_2) || 0) + 1)
        if (r.choice_3) choiceCounts.set(r.choice_3, (choiceCounts.get(r.choice_3) || 0) + 1)
      }
    })

    const totalChoices = responsesData.filter((r) => !r.no_preference).length

    const popularityArray: PopularityStats[] = Array.from(choiceCounts.entries())
      .map(([playerId, count]) => {
        const player = playersMap.get(playerId)
        return {
          player_name: player ? getPlayerName(player) : 'Ukjent',
          times_chosen: count,
          percentage: totalChoices > 0 ? Math.round((count / totalChoices) * 100 * 10) / 10 : 0,
        }
      })
      .sort((a, b) => b.times_chosen - a.times_chosen)

    setPopularity(popularityArray)
  }

  const getPlayerName = (player?: Player | null) => {
    if (!player) return 'Ukjent'
    return player.last_name ? `${player.first_name} ${player.last_name}`.trim() : player.first_name
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('nb-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lastar resultat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Lagval - Resultat</h1>
          <p className="text-gray-600">Oversikt over alle svar</p>
        </div>

        {/* Statistikk */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Totalt svar</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{stats.withChoices}</div>
              <div className="text-sm text-gray-600 mt-1">Med val</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-600">{stats.noPreference}</div>
              <div className="text-sm text-gray-600 mt-1">Veit ikkje</div>
            </div>
          </div>
        </div>

        {/* Popularitetsanalyse */}
        {popularity.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⭐ Mest valde spelare</h2>
            <div className="space-y-2">
              {popularity.slice(0, 10).map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 text-center font-bold text-gray-500">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{stat.player_name}</span>
                      <span className="text-sm text-gray-600">
                        {stat.times_chosen} gonger ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(stat.percentage * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alle svar */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Alle svar</h2>
          {responses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Ingen svar enno</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{response.voter_name}</h3>
                      <p className="text-xs text-gray-500">{formatDate(response.submitted_at)}</p>
                    </div>
                    {response.no_preference && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        Veit ikkje
                      </span>
                    )}
                  </div>
                  {!response.no_preference && (
                    <div className="flex flex-wrap gap-2">
                      {response.choice_1_name && (
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                          1. {response.choice_1_name}
                        </span>
                      )}
                      {response.choice_2_name && (
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          2. {response.choice_2_name}
                        </span>
                      )}
                      {response.choice_3_name && (
                        <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                          3. {response.choice_3_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eksport-knapp */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const csv = generateCSV()
              downloadCSV(csv, 'lagval-resultat.csv')
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            📥 Last ned som CSV
          </button>
        </div>
      </div>
    </div>
  )

  function generateCSV() {
    const headers = ['Spelar', 'Val 1', 'Val 2', 'Val 3', 'Veit ikkje', 'Dato']
    const rows = responses.map((r) => [
      r.voter_name,
      r.choice_1_name || '-',
      r.choice_2_name || '-',
      r.choice_3_name || '-',
      r.no_preference ? 'Ja' : 'Nei',
      formatDate(r.submitted_at),
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    return csvContent
  }

  function downloadCSV(csv: string, filename: string) {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
