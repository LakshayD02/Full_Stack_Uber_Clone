import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const [mode, setMode] = useState('user') // 'user' or 'captain'

  return (
    <div className='min-h-screen bg-black text-white font-sans'>

      {/* ── HEADER ── */}
      <header className='fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10'>
        <span className='text-2xl font-black tracking-tight text-white'>Ride<span className='text-blue-400'>X</span></span>
        <nav className='hidden md:flex items-center gap-6 text-sm text-gray-300'>
          <a href='#features' className='hover:text-white transition-colors'>Features</a>
          <a href='#safety' className='hover:text-white transition-colors'>Safety</a>
          <a href='#footer' className='hover:text-white transition-colors'>Company</a>
        </nav>
        <div className='flex items-center gap-3'>
          {/* Mode Toggle */}
          <div className='flex items-center bg-white/10 rounded-full p-1 border border-white/20'>
            <button
              onClick={() => setMode('user')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'user' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Rider
            </button>
            <button
              onClick={() => setMode('captain')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'captain' ? 'bg-yellow-400 text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Captain
            </button>
          </div>
          <Link
            to={mode === 'user' ? '/login' : '/captain-login'}
            className='text-sm font-medium hover:text-gray-300 transition-colors'
          >
            Log in
          </Link>
          <Link
            to={mode === 'user' ? '/signup' : '/captain-signup'}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${mode === 'captain' ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className='relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden'
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black'></div>

        <div className='relative z-10 max-w-3xl mx-auto'>
          {mode === 'user' ? (
            <>
              <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-gray-300'>
                <span className='h-2 w-2 bg-green-400 rounded-full animate-pulse'></span>
                Available in your city
              </div>
              <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
                Go anywhere,<br />
                <span className='bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                  anytime.
                </span>
              </h1>
              <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto'>
                Request a ride, hop in, and go. RideX makes transportation
                across cities easier, faster, and safer than ever.
              </p>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <Link
                  to='/signup'
                  className='bg-white text-black font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  Get Started — it's free
                </Link>
                <Link
                  to='/login'
                  className='border border-white/30 text-white font-medium px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-all duration-300'
                >
                  Sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className='inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur border border-yellow-400/40 rounded-full px-4 py-2 mb-6 text-sm text-yellow-300'>
                <span className='h-2 w-2 bg-yellow-400 rounded-full animate-pulse'></span>
                Earn on your schedule
              </div>
              <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
                Drive with<br />
                <span className='bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
                  RideX.
                </span>
              </h1>
              <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto'>
                Become a captain and earn money on your own terms. Set your hours,
                choose your rides, and be your own boss.
              </p>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <Link
                  to='/captain-signup'
                  className='bg-yellow-400 text-black font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/30'
                >
                  Start Driving Today
                </Link>
                <Link
                  to='/captain-login'
                  className='border border-white/30 text-white font-medium px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-all duration-300'
                >
                  Captain Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Scroll hint */}
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs animate-bounce'>
          <span>Scroll to explore</span>
          <i className="ri-arrow-down-line text-lg"></i>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id='features' className='py-24 px-6 bg-black'>
        <div className='max-w-5xl mx-auto'>
          <h2 className='text-3xl md:text-5xl font-black text-center mb-4'>
            Why choose <span className='text-blue-400'>RideX?</span>
          </h2>
          <p className='text-center text-gray-400 mb-16 max-w-xl mx-auto'>
            Every ride is designed to be safe, affordable, and on time.
          </p>

          <div className='grid md:grid-cols-3 gap-6'>
            {[
              {
                icon: 'ri-flashlight-fill',
                color: 'from-blue-500 to-indigo-600',
                title: 'Lightning Fast',
                desc: 'Drivers near you get matched in seconds. Average wait time under 5 minutes.'
              },
              {
                icon: 'ri-shield-check-fill',
                color: 'from-green-500 to-emerald-600',
                title: 'Always Safe',
                desc: 'Real-time GPS tracking, verified drivers, and 24/7 emergency support.'
              },
              {
                icon: 'ri-money-rupee-circle-fill',
                color: 'from-yellow-500 to-orange-500',
                title: 'Best Fares',
                desc: 'Upfront pricing with no surge surprises. Choose from RideX Go, Moto, or Auto.'
              }
            ].map((f, i) => (
              <div
                key={i}
                className='group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2'
              >
                <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${f.color} items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${f.icon} text-2xl text-white`}></i>
                </div>
                <h3 className='text-xl font-bold mb-3'>{f.title}</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY SECTION ── */}
      <section id='safety' className='py-24 px-6 bg-zinc-950'>
        <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16'>
          <div className='flex-1'>
            <span className='text-green-400 text-sm font-semibold uppercase tracking-wider'>Safety first</span>
            <h2 className='text-3xl md:text-5xl font-black mt-3 mb-6'>Your safety is our <span className='text-green-400'>priority</span></h2>
            <p className='text-gray-400 mb-8 leading-relaxed'>
              Every captain is background verified. Your trip is tracked in real-time and shared with emergency contacts if needed. Our 24/7 safety team is always just a tap away.
            </p>
            <ul className='space-y-4'>
              {['OTP-verified ride start', 'Live GPS tracking', '24/7 emergency support', 'Verified captain profiles'].map((item, i) => (
                <li key={i} className='flex items-center gap-3 text-gray-300'>
                  <span className='h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0'>
                    <i className="ri-check-line text-green-400 text-xs"></i>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className='flex-1 flex justify-center'>
            <div className='relative w-64 h-64'>
              <div className='absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full animate-pulse'></div>
              <div className='absolute inset-6 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-full'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <i className="ri-shield-check-fill text-8xl text-green-400"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className='py-20 px-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-y border-white/10'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {[
            { value: '10M+', label: 'Rides completed' },
            { value: '500K+', label: 'Active captains' },
            { value: '100+', label: 'Cities covered' },
            { value: '4.9★', label: 'Average rating' },
          ].map((s, i) => (
            <div key={i}>
              <div className='text-3xl md:text-4xl font-black text-white mb-2'>{s.value}</div>
              <div className='text-sm text-gray-400'>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id='footer' className='bg-black border-t border-white/10 py-16 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between gap-12 mb-12'>
            <div className='max-w-xs'>
              <span className='text-2xl font-black tracking-tight text-white block mb-4'>Ride<span className='text-blue-400'>X</span></span>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Making transportation as reliable as running water, everywhere, for everyone.
              </p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-8 text-sm'>
              <div>
                <h4 className='font-semibold mb-4 text-white'>Company</h4>
                <ul className='space-y-2 text-gray-400'>
                  <li><a href='#' className='hover:text-white transition-colors'>About Us</a></li>
                  <li><a href='#' className='hover:text-white transition-colors'>Careers</a></li>
                  <li><a href='#' className='hover:text-white transition-colors'>Press</a></li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-4 text-white'>Products</h4>
                <ul className='space-y-2 text-gray-400'>
                  <li><Link to='/signup' className='hover:text-white transition-colors'>Ride</Link></li>
                  <li><Link to='/captain-signup' className='hover:text-white transition-colors'>Drive</Link></li>
                  <li><a href='#' className='hover:text-white transition-colors'>Business</a></li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-4 text-white'>Support</h4>
                <ul className='space-y-2 text-gray-400'>
                  <li><a href='#' className='hover:text-white transition-colors'>Help Center</a></li>
                  <li><a href='#' className='hover:text-white transition-colors'>Safety</a></li>
                  <li><a href='#' className='hover:text-white transition-colors'>Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className='border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-gray-500 text-sm'>© 2025 RideX. All rights reserved.</p>
            <div className='flex gap-4'>
              {['ri-twitter-fill', 'ri-instagram-fill', 'ri-linkedin-fill', 'ri-github-fill'].map((icon, i) => (
                <a key={i} href='#' className='h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'>
                  <i className={`${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Start