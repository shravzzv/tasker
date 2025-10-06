'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/signin/api', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

    if (!res.ok) {
      setErrorMsg(data.error)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      {errorMsg && <p>{errorMsg}</p>}

      <input
        type='email'
        placeholder='Email'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type='password'
        placeholder='Password'
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type='submit'>Sign In</button>
    </form>
  )
}
