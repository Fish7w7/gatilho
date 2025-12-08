import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gatilho - Alertas Inteligentes para Ações',
  description: 'Alertas de preço, variação percentual e volume para ações da B3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
