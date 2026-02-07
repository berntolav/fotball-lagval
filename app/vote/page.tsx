'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Player = {
  id: string
  first_name: string
  last_name: string
}

function VoteContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [noPreference, setNoPreference] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Ugyldig lenke')
      setLoading(false)
      return
    }

    fetchPlayerData()
  }, [token])

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`/api/player?token=${token}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noko gjekk gale')
        setLoading(false)
        return
      }

      setCurrentPlayer(data.player)
      setAvailablePlayers(data.availablePlayers)
      setLoading(false)
    } catch (err) {
      setError('Kunne ikkje laste data')
      setLoading(false)
    }
  }

  const togglePlayer = (playerId: string) => {
    if (noPreference) return

    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId)
      } else if (prev.length < 3) {
        return [...prev, playerId]
      }
      return prev
    })
  }

  const handleNoPreferenceToggle = () => {
    setNoPreference(!noPreference)
    if (!noPreference) {
      setSelectedPlayers([])
    }
  }

  const handleSubmit = async () => {
    if (!noPreference && selectedPlayers.length === 0) {
      alert('Vel minst ein spelar, eller vel "Veit ikkje"')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          choices: selectedPlayers,
          noPreference,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Kunne ikkje sende inn svaret')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      alert('Noko gjekk gale. Prøv igjen.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lastar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-block bg-red-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Takk!</h2>
          <p className="text-gray-600">Svaret ditt er registrert.</p>
        </div>
      </div>
    )
  }

  const getPlayerName = (player: Player) => {
    return player.last_name 
      ? `${player.first_name} ${player.last_name}`.trim()
      : player.first_name
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hei {currentPlayer?.first_name}! ⚽
          </h1>
          <p className="text-gray-600">
            Vel opptil 3 medspelare du vil spele med på laget.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-start space-x-3 mb-6">
            <input
              type="checkbox"
              id="noPreference"
              checked={noPreference}
              onChange={handleNoPreferenceToggle}
              className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="noPreference" className="flex-1 cursor-pointer">
              <span className="font-semibold text-gray-900 block">Veit ikkje / Det er det same</span>
              <span className="text-sm text-gray-600">Kryss av her viss du ikkje har preferansar</span>
            </label>
          </div>

          {!noPreference && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Valde: {selectedPlayers.length} av 3
                </span>
                {selectedPlayers.length > 0 && (
                  <button
                    onClick={() => setSelectedPlayers([])}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Nullstill
                  </button>
                )}
              </div>

              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {availablePlayers.map((player, index) => {
                  const isSelected = selectedPlayers.includes(player.id)
                  const selectionNumber = selectedPlayers.indexOf(player.id) + 1

                  return (
                    <button
                      key={player.id}
                      onClick={() => togglePlayer(player.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {getPlayerName(player)}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm font-bold">
                            {selectionNumber}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={submitting || (!noPreference && selectedPlayers.length === 0)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                submitting || (!noPreference && selectedPlayers.length === 0)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:scale-95'
              }`}
            >
              {submitting ? 'Sender inn...' : 'Send inn val'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lastar...</p>
        </div>
      </div>
    }>
      <VoteContent />
    </Suspense>
  )
}
