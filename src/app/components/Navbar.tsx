'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  name: string
  href: string
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Data', href: '/data' },
  { name: 'Admin', href: '/admin' },
]

const Navbar: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-xl z-50">
      <div className="absolute inset-0 bg-gray-900/60"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 relative">
        <Link href="/" className="flex items-center group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
            Onboarding
          </h1>
        </Link>

        <div className="flex space-x-1">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
