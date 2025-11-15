import { useEffect, useState } from 'react'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [attending, setAttending] = useState(null)
  const [guests, setGuests] = useState(1)
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const fetchComments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/comments`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setComments(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name.trim() || !message.trim()) {
      setError('Please provide your name and a message')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${baseUrl}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, attending, guests, phone })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to send message')
      }
      await res.json()
      setSuccess('Thank you! Your message has been sent.')
      setName('')
      setMessage('')
      setAttending(null)
      setGuests(1)
      setPhone('')
      fetchComments()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
      {/* Header / Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-sm tracking-widest text-rose-500 mb-3">We are getting married</p>
          <h1 className="text-5xl sm:text-6xl font-serif text-gray-800">
            Alex & Taylor
          </h1>
          <p className="mt-4 text-gray-700 text-lg">Saturday, June 21, 2025 • 4:00 PM</p>
          <p className="text-gray-600">The Botanical Garden, 123 Blossom Ave</p>
          <div className="mt-8 flex justify-center gap-3">
            <a href="#rsvp" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-md shadow">
              RSVP & Leave a Message
            </a>
            <a href="#guestbook" className="bg-white/80 backdrop-blur border border-rose-200 text-rose-700 px-6 py-3 rounded-md shadow">
              View Guestbook
            </a>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Ceremony</h3>
          <p className="text-gray-600 mt-2">Starts at 4:00 PM in the Rose Pavilion.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Reception</h3>
          <p className="text-gray-600 mt-2">Dinner and dancing to follow at 6:00 PM.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Dress Code</h3>
          <p className="text-gray-600 mt-2">Garden formal. Pastel colors encouraged.</p>
        </div>
      </section>

      {/* RSVP / Comment Form */}
      <section id="rsvp" className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">RSVP & Leave Your Wishes</h2>
          {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm">{success}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Leave your wishes for the couple" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attending</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="attending" checked={attending === true} onChange={() => setAttending(true)} />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="attending" checked={attending === false} onChange={() => setAttending(false)} />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <input type="number" min={0} max={20} value={guests} onChange={(e) => setGuests(parseInt(e.target.value || '0'))} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="For coordination" />
            </div>
            <button disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold py-2 rounded transition-colors">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Guestbook */}
      <section id="guestbook" className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Guestbook</h2>
        {loading ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-600">No messages yet. Be the first to leave a note!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  {c.attending !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full ${c.attending ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {c.attending ? 'Attending' : 'Not attending'}{c.guests ? ` • ${c.guests}` : ''}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-line">{c.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        Made with love • If you are an organizer, set GOOGLE_APPS_SCRIPT_URL in backend to forward messages to Google Sheets.
      </footer>
    </div>
  )
}

export default App
