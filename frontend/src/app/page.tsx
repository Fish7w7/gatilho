import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-lg">
          Gatilho
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Alertas inteligentes para ações da B3
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Entrar
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition border-2 border-white/30 shadow-lg"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  )
}
