import { useEffect } from 'react'
import { site } from '../data/site'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Per-page title, description, canonical and optional JSON-LD. */
export function useSEO({ title, description, path = '', jsonLd }) {
  useEffect(() => {
    const full = title ? `${title} | CADD-EXPERTS` : `CADD-EXPERTS | ${site.tagline}`
    document.title = full
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:url', site.url + path)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = site.url + path

    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.page = 'true'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, path, jsonLd])
}
