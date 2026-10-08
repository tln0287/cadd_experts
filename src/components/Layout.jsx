import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { nav, site } from '../data/site'
import { useLenis, getLenis } from '../hooks/useLenis'
import { usePrefersReducedMotion } from '../hooks/useDevice'
import { Magnetic } from './ui'

export function Logo({ compact }) {
  return (
    <Link to="/" className="logo" aria-label="CADD-EXPERTS home">
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="9" />
        <path d="M10 30V10h14" className="logo__a" />
        <path d="M10 30l12-9" className="logo__b" />
        <circle cx="28" cy="26" r="5" className="logo__c" />
      </svg>
      {!compact && (
        <span className="logo__word">
          CADD<span>-</span>EXPERTS
        </span>
      )}
    </Link>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const l = getLenis()
    if (l) open ? l.stop() : l.start()
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner">
        <Logo />
        <nav className="nav__links" aria-label="Primary">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="nav__link" title={n.long}>
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && <motion.span layoutId="nav-active" className="nav__active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="nav__cta">
          <Magnetic to="/enroll" variant="accent" className="btn--sm">Enroll Now</Magnetic>
          <button className={`burger ${open ? 'is-open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__grid" aria-hidden="true" />
            <nav className="menu__links" aria-label="Mobile">
              {nav.map((n, i) => (
                <motion.div key={n.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}>
                  <NavLink to={n.to} end={n.to === '/'} className="menu__link">
                    <span className="menu__n">{String(i + 1).padStart(2, '0')}</span>
                    {n.long || n.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="menu__foot">
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const cols = [
    { h: 'Company', l: [['About', '/about'], ['Careers', '/careers'], ['Testimonials', '/testimonials'], ['FAQ', '/faq'], ['Contact', '/contact']] },
    { h: 'Courses', l: [['All Courses', '/courses'], ['Civil Engineering', '/civil-engineering'], ['Mechanical Engineering', '/mechanical-engineering'], ['Software Training', '/software'], ['Enroll', '/enroll']] },
    { h: 'Explore', l: [['Projects', '/projects'], ['Gallery', '/gallery'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']] },
  ]
  const socials = [
    ['Instagram', site.social.instagram, 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'],
    ['Facebook', site.social.facebook, 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z'],
    ['YouTube', site.social.youtube, 'M22 8.5a3 3 0 0 0-2-2C18 6 12 6 12 6s-6 0-8 .5a3 3 0 0 0-2 2A31 31 0 0 0 1.5 12 31 31 0 0 0 2 15.5a3 3 0 0 0 2 2c2 .5 8 .5 8 .5s6 0 8-.5a3 3 0 0 0 2-2 31 31 0 0 0 .5-3.5 31 31 0 0 0-.5-3.5zM10 15V9l5 3z'],
    ['LinkedIn', site.social.linkedin, 'M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2 9h4v12H2zM9 9h4v2c.6-1 2-2.2 4-2.2 4 0 5 2.6 5 6V21h-4v-5.5c0-1.5-.3-3-2.2-3S13 14 13 15.5V21H9z'],
  ]
  return (
    <footer className="footer">
      <div className="footer__grid" aria-hidden="true" />
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tag">{site.tagline}</p>
          <p className="footer__copy">{site.statement}. Professional training in CAD, BIM and CAE for students, graduates and working engineers.</p>
          <div className="footer__social">
            {socials.map(([name, url, d]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="footer__col">
            <h2>{c.h}</h2>
            <ul>{c.l.map(([t, to]) => <li key={to}><Link to={to}>{t}</Link></li>)}</ul>
          </div>
        ))}
        <div className="footer__col">
          <h2>Contact</h2>
          <ul>
            <li><a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a></li>
            <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            <li>{site.contact.address}</li>
            <li>{site.contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} CADD-EXPERTS. All rights reserved.</span>
        <span className="mono">DWG NO. CE-0001 · REV A · ALL DIMENSIONS IN MM</span>
      </div>
      <div className="footer__giant" aria-hidden="true">CADD-EXPERTS</div>
    </footer>
  )
}

function MobileCTA() {
  return (
    <div className="mobile-cta">
      <Link to="/enroll" className="mobile-cta__main">Enquire Now</Link>
      <a className="mobile-cta__wa" href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon />
      </a>
    </div>
  )
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
    </svg>
  )
}

export default function Layout() {
  const reduced = usePrefersReducedMotion()
  useLenis(!reduced)
  const { pathname } = useLocation()
  useEffect(() => {
    const l = getLenis()
    if (l) l.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="page-loader" role="status" aria-label="Loading"><span /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileCTA />
      <a className="wa-float" href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with CADD-EXPERTS on WhatsApp">
        <WhatsAppIcon />
      </a>
    </>
  )
}
