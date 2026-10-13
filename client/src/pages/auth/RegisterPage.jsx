import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const strength = (pw) => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', 'bg-red-400', 'bg-gray-400', 'bg-gray-600', 'bg-black']

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const pw_strength = strength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password)
      toast.success(`Welcome to OMASTRA, ${user.name.split(' ')[0]}!`)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-6">
            <span className="font-display text-3xl font-bold text-black tracking-tight">OMASTRA</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-black tracking-tight">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join OMASTRA — Power Within.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Your name"
              autoComplete="name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`input-field ${errors.email ? 'border-red-400' : ''}`}
              placeholder="you@email.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className={`flex-1 h-1 rounded-full ${n <= pw_strength ? STRENGTH_COLORS[pw_strength] : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">{STRENGTH_LABELS[pw_strength]}</p>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className={`input-field pr-10 ${errors.confirm ? 'border-red-400' : ''}`}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
              {form.confirm && form.confirm === form.password && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              )}
            </div>
            {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-black hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


