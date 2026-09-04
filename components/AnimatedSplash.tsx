'use client'

import { useEffect, useState } from 'react'

export default function AnimatedSplash({ onFinish }: { onFinish?: () => void }) {
  const [hide, setHide] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const prog = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(prog)
          return 100
        }
        return Math.min(100, p + Math.random() * 15)
      })
    }, 120)
    const timer = setTimeout(() => {
      setHide(true)
      setTimeout(() => onFinish?.(), 400)
    }, 2200)
    return () => {
      clearTimeout(timer)
      clearInterval(prog)
    }
  }, [onFinish])

  if (hide) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute -inset-6 rounded-full border border-cyan-400/20 animate-spin" />
        <img
          src="/splash-logo.png"
          alt="Alphatekx"
          className="h-32 w-32 rounded-full object-cover bg-black animate-pulse"
        />
      </div>
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold tracking-wider text-white">Alphatekx Stream</h1>
        <p className="mt-2 text-sm tracking-[0.2em] uppercase text-cyan-300/80">Where AI Meets Stream</p>
      </div>
      <div className="absolute bottom-20 left-1/2 h-1 w-64 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
