import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'
import { PlantStoreProvider } from '../src/lib/PlantStoreContext'
import { ModalProvider } from '../src/lib/ModalContext'
import LayoutContent from './layout-content'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sporelia - Plant Collection Tracker',
  description: 'Track and manage your beautiful plant collection with Sporelia',
  keywords: ['plants', 'collection', 'tracker', 'gardening', 'houseplants'],
  authors: [{ name: 'Sporelia Team' }],
  openGraph: {
    title: 'Sporelia - Plant Collection Tracker',
    description: 'Track and manage your beautiful plant collection',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} font-body text-text-primary bg-canvas leading-airy`}>
        <PlantStoreProvider>
          <ModalProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </ModalProvider>
        </PlantStoreProvider>
      </body>
    </html>
  )
}
