'use client'

import { useState, useEffect } from 'react'
import { signOut, isDemoMode, getUserRole, AuthUser, AdminRole } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  user: AuthUser | null
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [userRole, setUserRole] = useState<AdminRole | null>(null)
  const demoMode = isDemoMode()

  useEffect(() => {
    if (user?.id) {
      getUserRole(user.id).then(setUserRole)
    }
  }, [user?.id])

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {demoMode && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Modalità Demo
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  {user?.name || 'Admin'}
                  {userRole && (
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      userRole === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userRole === 'admin' ? 'Admin' : 'Sub-Admin'}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Esci
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}