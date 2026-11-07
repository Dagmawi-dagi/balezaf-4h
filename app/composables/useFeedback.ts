export const frontEndErrorFeedback = () => {
  return {
    success: (message: string) => {
      if (typeof window !== 'undefined') {
        console.log('Success:', message)
        const toast = document.createElement('div')
        toast.className =
          'fixed bottom-5 right-5 z-[300] rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all duration-300'
        toast.innerText = message
        document.body.appendChild(toast)
        setTimeout(() => {
          toast.style.opacity = '0'
          setTimeout(() => toast.remove(), 300)
        }, 3000)
      }
    },
    err: (err: any) => {
      const msg =
        err?.data?.statusMessage ||
        err?.data?.message ||
        err?.message ||
        'An error occurred'
      if (typeof window !== 'undefined') {
        console.error('Error:', err)
        const toast = document.createElement('div')
        toast.className =
          'fixed bottom-5 right-5 z-[300] rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all duration-300'
        toast.innerText = msg
        document.body.appendChild(toast)
        setTimeout(() => {
          toast.style.opacity = '0'
          setTimeout(() => toast.remove(), 300)
        }, 3500)
      }
    },
  }
}
