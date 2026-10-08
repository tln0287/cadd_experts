import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { site, courses, batches, experienceLevels } from '../data/site'
import { Magnetic, Reveal } from '../components/ui'
import { WhatsAppIcon } from '../components/Layout'

const EMPTY = { name: '', phone: '', email: '', branch: '', course: '', experience: '', batch: '', message: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!/^[+\d][\d\s-]{8,15}$/.test(v.phone.trim())) e.phone = 'Please enter a valid mobile number.'
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email address.'
  if (!v.branch) e.branch = 'Please choose your engineering branch.'
  return e
}

function Field({ id, label, error, required, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {error && <span className="field__error" id={`${id}-err`} role="alert">{error}</span>}
    </div>
  )
}

/**
 * Enquiry / enrollment form.
 * Sends to `site.formEndpoint` if configured, otherwise opens a prefilled
 * WhatsApp chat so no enquiry is lost.
 */
export function EnquiryForm({ intent: initialIntent = 'call' }) {
  const [params] = useSearchParams()
  const [v, setV] = useState(() => ({ ...EMPTY, course: params.get('course') || '' }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [intent, setIntent] = useState(initialIntent)

  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }))
  const filtered = courses.filter((c) => !v.branch || v.branch === 'Other' || c.domain === v.branch.toLowerCase())

  const submit = async (e, chosen) => {
    e.preventDefault()
    const which = chosen || intent
    setIntent(which)
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    setStatus('sending')
    const payload = { ...v, intent: which === 'enroll' ? 'Enroll Now' : 'Request a Call', submittedAt: new Date().toISOString() }
    try {
      if (site.formEndpoint) {
        const r = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        if (!r.ok) throw new Error('Request failed')
      } else {
        const text = [
          `Hello CADD-EXPERTS, I'd like to ${which === 'enroll' ? 'enroll' : 'request a call back'}.`,
          `Name: ${v.name}`, `Mobile: ${v.phone}`, v.email && `Email: ${v.email}`, `Branch: ${v.branch}`,
          v.course && `Course: ${v.course}`, v.experience && `Experience: ${v.experience}`, v.batch && `Batch: ${v.batch}`,
          v.message && `Message: ${v.message}`,
        ].filter(Boolean).join('\n')
        window.open(`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      }
      setStatus('done')
      setV(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__grid">
        <Field id="name" label="Full Name" required error={errors.name}>
          <input id="name" autoComplete="name" value={v.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
        </Field>
        <Field id="phone" label="Mobile Number" required error={errors.phone}>
          <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : undefined} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
        </Field>
        <Field id="branch" label="Engineering Branch" required error={errors.branch}>
          <select id="branch" value={v.branch} onChange={set('branch')} aria-invalid={!!errors.branch} aria-describedby={errors.branch ? 'branch-err' : undefined}>
            <option value="">Select branch</option>
            <option>Civil</option>
            <option>Mechanical</option>
            <option>Other</option>
          </select>
        </Field>
        <Field id="course" label="Course Interested In">
          <select id="course" value={v.course} onChange={set('course')}>
            <option value="">Select course</option>
            {filtered.map((c) => <option key={c.slug}>{c.name}</option>)}
            <option>Not sure yet — need guidance</option>
          </select>
        </Field>
        <Field id="experience" label="Experience Level">
          <select id="experience" value={v.experience} onChange={set('experience')}>
            <option value="">Select level</option>
            {experienceLevels.map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field id="batch" label="Preferred Batch">
          <select id="batch" value={v.batch} onChange={set('batch')}>
            <option value="">Select batch</option>
            {batches.map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field id="message" label="Message">
          <textarea id="message" rows={4} value={v.message} onChange={set('message')} />
        </Field>
      </div>
      <div className="form__actions">
        <Magnetic type="button" variant="ghost" onClick={(e) => submit(e, 'call')} disabled={status === 'sending'}>Request a Call</Magnetic>
        <Magnetic type="button" variant="accent" arrow onClick={(e) => submit(e, 'enroll')} disabled={status === 'sending'}>Enroll Now</Magnetic>
      </div>
      <AnimatePresence>
        {status === 'done' && (
          <motion.p className="form__ok" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            Thank you — your {intent === 'enroll' ? 'enrollment request' : 'call-back request'} is on its way. A counsellor will contact you shortly.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p className="form__err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Something went wrong. Please call us on {site.contact.phone} or message us on WhatsApp.
          </motion.p>
        )}
      </AnimatePresence>
      <p className="form__note">By submitting you agree to be contacted about CADD-EXPERTS courses. We never share your details.</p>
    </form>
  )
}

export function ContactDetails({ map = true }) {
  const c = site.contact
  return (
    <div className="contact-info">
      <ul className="contact-list">
        <li><span className="mono label">Phone</span><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>
        <li><span className="mono label">Email</span><a href={`mailto:${c.email}`}>{c.email}</a></li>
        <li><span className="mono label">Location</span><span>{c.address}</span></li>
        <li><span className="mono label">Hours</span><span>{c.hours}</span></li>
      </ul>
      <a className="wa-btn" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon /> Chat on WhatsApp
      </a>
      {map && (
        <div className="map frame-corners">
          <iframe
            title="CADD-EXPERTS location on Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}

export default function ContactCTA({ headingLevel = 'h2' }) {
  const H = headingLevel
  return (
    <section className="section cta" aria-labelledby="cta-title" id="enquire">
      <div className="cta__bg" aria-hidden="true" />
      <div className="container cta__grid">
        <div>
          <Reveal><p className="eyebrow"><span className="eyebrow__tick" />Contact / Enrollment</p></Reveal>
          <Reveal delay={0.08}><H className="cta__title" id="cta-title">Ready to Design <em>Your Future?</em></H></Reveal>
          <Reveal delay={0.16}><p className="lead">Start your journey from engineering fundamentals to professional CAD expertise.</p></Reveal>
          <Reveal delay={0.24}><ContactDetails /></Reveal>
        </div>
        <Reveal delay={0.1} className="cta__form frame-corners">
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  )
}
