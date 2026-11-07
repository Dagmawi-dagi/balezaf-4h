import { ref } from 'vue'

export interface UserState {
  userId: string
  email: string
  role: string
  fullName: string
}

export function useAuth() {
  const user = useState<UserState | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)
  const initialized = useState<boolean>('auth_initialized', () => false)

  async function fetchUser() {
    loading.value = true
    try {
      const res: any = await $fetch('/api/auth/me')
      if (res && res.success && res.user) {
        user.value = {
          userId: res.user.id,
          email: res.user.email,
          role: res.user.role,
          fullName: res.user.fullName,
        }
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function login(email: string, password: string):Promise<{ success: boolean; error?: string }> {
    loading.value = true
    try {
      const res: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      if (res && res.success && res.user) {
        user.value = res.user
        return { success: true }
      }
      return { success: false, error: 'Login failed' }
    } catch (err: any) {
      const msg = err?.data?.statusMessage || err?.data?.message || err?.message || 'Login failed'
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    } finally {
      user.value = null
    }
  }

  return {
    user,
    loading,
    initialized,
    fetchUser,
    login,
    logout,
  }
}
