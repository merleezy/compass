import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  // Close on Escape key. This handler is on `document`, so `e` is the DOM
  // KeyboardEvent — not React's synthetic one.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Stop clicks inside the card from closing the modal */}
      <div
        className="w-full max-w-md animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
