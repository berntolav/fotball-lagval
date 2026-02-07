export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lagval - Fotball
            </h1>
            <p className="text-gray-600">
              Vel kven du vil spele med på laget ditt
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-2">Korleis det fungerer:</p>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Du vil få ein unik lenke via SMS</li>
                <li>Klikk på lenka for å opne valet ditt</li>
                <li>Vel opptil 3 medspelare du vil spele med</li>
                <li>Du kan berre svare éin gong</li>
              </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-green-800">
                <li>Du kan velje 1, 2 eller 3 spelare</li>
                <li>Viss du ikkje veit, kan du velje "Veit ikkje"</li>
                <li>Alle val er anonyme</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            Har du spørsmål? Ta kontakt med lagledaren din.
          </div>
        </div>
      </div>
    </main>
  )
}
