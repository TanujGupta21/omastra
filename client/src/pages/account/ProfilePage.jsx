import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})
  const [pwErrors, setPwErrors] = useState({})

  const profileMutation = useMutation({
    mutationFn: () => api.put('/api/v1/users/profile', profileForm),
    onSuccess: async ({ data }) => {
      await updateProfile(data.data || profileForm)
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not update profile'),
  })

  const pwMutation = useMutation({
    mutationFn: () => api.put('/api/v1/users/change-password', {
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    }),
    onSuccess: () => {
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not change password'),
  })

  const validateProfile = () => {
    const e = {}
    if (!profileForm.name.trim()) e.name = 'Name is required'
    setProfileErrors(e)
    return !Object.keys(e).length
  }

  const validatePw = () => {
    const e = {}
    if (!pwForm.currentPassword) e.currentPassword = 'Required'
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) e.newPassword = 'At least 8 characters'
    if (pwForm.newPassword !== pwForm.confirm) e.confirm = 'Passwords do not match'
    setPwErrors(e)
    return !Object.keys(e).length
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <h1 className="text-3xl font-display uppercase tracking-wide text-black">Profile Settings</h1>

      {/* Profile info */}
      <div className="card p-6">
        <h2 className="font-semibold text-black mb-5">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className={`input-field ${profileErrors.name ? 'border-red-400' : ''}`}
            />
            {profileErrors.name && <p className="text-red-400 text-xs mt-1">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Email</label>
            <input value={user?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="input-field"
              placeholder="10-digit mobile"
            />
          </div>
          <button
            onClick={() => { if (validateProfile()) profileMutation.mutate() }}
            disabled={profileMutation.isPending}
            className="px-6 py-2.5 bg-black text-white font-semibold text-sm rounded-lg hover:bg-black-hover transition-colors disabled:opacity-60 shadow-md shadow-black/10"
          >
            {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h2 className="font-semibold text-black mb-5">Change Password</h2>
        <div className="space-y-4">
          {[
            { k: 'currentPassword', label: 'Current Password' },
            { k: 'newPassword', label: 'New Password' },
            { k: 'confirm', label: 'Confirm New Password' },
          ].map(({ k, label }) => (
            <div key={k}>
              <label className="block text-sm font-medium text-black mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pwForm[k]}
                  onChange={e => setPwForm({ ...pwForm, [k]: e.target.value })}
                  className={`input-field pr-10 ${pwErrors[k] ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                />
                {k === 'newPassword' && (
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {pwErrors[k] && <p className="text-red-400 text-xs mt-1">{pwErrors[k]}</p>}
            </div>
          ))}
          <button
            onClick={() => { if (validatePw()) pwMutation.mutate() }}
            disabled={pwMutation.isPending}
            className="px-6 py-2.5 bg-black text-white font-semibold text-sm rounded-lg hover:bg-black-hover transition-colors disabled:opacity-60 shadow-md shadow-black/10"
          >
            {pwMutation.isPending ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <p className="text-sm text-gray-500">
          Account created: <span className="text-black">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Role: <span className="text-black capitalize">{user?.role}</span>
        </p>
      </div>
    </div>
  )
}



