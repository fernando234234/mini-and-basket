'use client'

import { useState, useEffect } from 'react'
import { 
  getCurrentUser, 
  getUserRole, 
  getAdminUsers, 
  inviteAdmin, 
  updateAdminRole, 
  removeAdminUser,
  isDemoMode,
  AdminUser,
  AdminRole 
} from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('subadmin')
  const [inviting, setInviting] = useState(false)

  const demoMode = isDemoMode()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/admin')
        return
      }

      setCurrentUserId(user.id)

      const role = await getUserRole(user.id)
      setCurrentUserRole(role)

      if (role !== 'admin') {
        setError('Solo gli admin possono accedere a questa pagina')
        setLoading(false)
        return
      }

      const { users: adminUsers, error: fetchError } = await getAdminUsers(user.id)
      if (fetchError) {
        setError(fetchError)
      } else {
        setUsers(adminUsers || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Errore durante il caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !inviteEmail.trim()) return

    setInviting(true)
    setError(null)

    const { success, error: inviteError } = await inviteAdmin(
      inviteEmail.trim(),
      inviteRole,
      currentUserId
    )

    if (inviteError) {
      setError(inviteError)
    } else if (success) {
      setSuccessMessage(`Invito inviato a ${inviteEmail}`)
      setInviteEmail('')
      setInviteRole('subadmin')
      setShowInviteForm(false)
      loadData() // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    }

    setInviting(false)
  }

  const handleRoleChange = async (adminUserId: string, newRole: AdminRole) => {
    if (!currentUserId) return

    setError(null)
    const { success, error: updateError } = await updateAdminRole(adminUserId, newRole, currentUserId)

    if (updateError) {
      setError(updateError)
    } else if (success) {
      setSuccessMessage('Ruolo aggiornato con successo')
      loadData()
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handleRemove = async (adminUserId: string, email: string) => {
    if (!currentUserId) return
    
    if (!confirm(`Sei sicuro di voler rimuovere ${email} dagli admin?`)) {
      return
    }

    setError(null)
    const { success, error: removeError } = await removeAdminUser(adminUserId, currentUserId)

    if (removeError) {
      setError(removeError)
    } else if (success) {
      setSuccessMessage('Utente rimosso con successo')
      loadData()
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (currentUserRole !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-semibold text-red-800 mb-2">Accesso Negato</h2>
        <p className="text-red-600">Solo gli admin possono accedere a questa pagina.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Utenti Admin</h1>
          <p className="text-gray-500">Gestisci gli accessi amministrativi al sistema</p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="px-4 py-2 bg-brand-green text-white font-medium rounded-lg hover:bg-brand-green/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Invita Admin
        </button>
      </div>

      {/* Demo Mode Warning */}
      {demoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-amber-800">Modalità Demo</p>
            <p className="text-sm text-amber-700">Le modifiche non verranno salvate. Configura Supabase per abilitare la gestione utenti reale.</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invita Nuovo Admin</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="nuovo.admin@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Ruolo
                </label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="subadmin">Sub-Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="px-4 py-2 bg-brand-green text-white font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {inviting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Invia Invito
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Nota:</strong> L'utente dovrà essere creato nel pannello Supabase. Questa funzione crea l'entry nel database admin_users.
            </p>
          </form>
        </div>
      )}

      {/* Role Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Informazioni sui Ruoli</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium">Admin</span>
            <span className="text-blue-700">Accesso completo: può gestire utenti, visualizzare tutte le iscrizioni e modificare le impostazioni.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium">Sub-Admin</span>
            <span className="text-blue-700">Accesso limitato: può visualizzare e gestire le iscrizioni, ma non può gestire altri utenti admin.</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Utenti Admin ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Creazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nessun utente admin trovato.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrentUser = user.user_id === currentUserId
                  
                  return (
                    <tr key={user.id} className={isCurrentUser ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center text-white font-medium">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {user.email}
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                                  Tu
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCurrentUser ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Sub-Admin'}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                            className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="admin">Admin</option>
                            <option value="subadmin">Sub-Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.user_id ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            Attivo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                            In attesa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleRemove(user.id, user.email)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Rimuovi
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Sicurezza
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Le registrazioni pubbliche sono disabilitate - solo utenti invitati possono accedere</li>
          <li>• Gli admin possono gestire altri admin, i sub-admin no</li>
          <li>• Non è possibile rimuovere il proprio account admin</li>
          <li>• Tutte le azioni sono registrate nel database</li>
        </ul>
      </div>
    </div>
  )
}