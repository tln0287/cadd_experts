import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { site, courses, software, projects, faqs, civilCategories, mechanicalCategories } from '../data/site'
import { PageHero, Reveal, SectionHead, Magnetic, Tilt } from '../components/ui'
import Scene3D from '../components/Scene3D'
import BlueprintArt from '../components/BlueprintArt'
import AboutIntro, { Stats } from '../sections/AboutIntro'
import CourseExplorer from '../sections/CourseExplorer'
import SoftwareWall from '../sections/SoftwareWall'
import { CivilExperience, MechanicalExperience, BlueprintToReality } from '../sections/Stories'
import { ProjectShowcase, ProjectViewer, ProjectCard } from '../sections/Projects'
import { WhyUs, TrainingProcess, CareerPaths, Testimonials, Gallery, Facilities, FAQ } from '../sections/Content'
import ContactCTA, { EnquiryForm, ContactDetails } from '../sections/Enquiry'
import Glyph from '../components/Glyph'

const provider = { '@type': 'Organization', name: 'CADD-EXPERTS', sameAs: site.url }
const courseLD = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: list.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: `${c.name} Training`,
      description: c.desc,
      provider,
      educationalLevel: c.level,
      timeRequired: c.duration,
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: ['Onsite', 'Online'] },
    },
  })),
})

/* ABOUT ================================================================ */
export function About() {
  useSEO({ title: 'About Us', description: 'About CADD-EXPERTS — professional CAD, BIM and CAE training for Civil and Mechanical engineering students, graduates and working professionals.', path: '/about' })
  return (
    <>
      <PageHero eyebrow="About Us" title={<>We Train Engineers to <em>Think in 3D.</em></>} intro="CADD-EXPERTS is an engineering design and CAD training institute where students learn, engineers design, ideas become models and models become real-world engineering." code="ABT-01" />
      <AboutIntro more={false} />
      <section className="section">
        <div className="container mv-grid">
          {[
            ['Mission', 'To make every learner industry-ready through hands-on training on professional CAD, BIM and CAE platforms, grounded in real engineering practice.'],
            ['Vision', 'To be the most trusted bridge between engineering education and the design office — for Civil and Mechanical engineers alike.'],
            ['Approach', 'Show engineering, don’t just talk about it: every concept is modelled, analysed and documented the way it is in industry.'],
          ].map(([h, t], i) => (
            <Reveal key={h} delay={i * 0.08} className="mv-card">
              <span className="mono label">{String(i + 1).padStart(2, '0')}</span>
              <h2>{h}</h2>
              <p>{t}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <WhyUs />
      <TrainingProcess />
      <Facilities />
      <ContactCTA />
    </>
  )
}

/* COURSES ============================================================== */
export function Courses() {
  useSEO({ title: 'CAD Courses — Civil & Mechanical', description: 'CAD courses for Civil and Mechanical engineers: AutoCAD, Revit Architecture, Revit Structure, Civil 3D, STAAD.Pro, ETABS, BIM, SolidWorks, CATIA, Creo, Inventor, NX, ANSYS, GD&T and more.', path: '/courses', jsonLd: courseLD(courses) })
  return (
    <>
      <PageHero eyebrow="Courses" title={<>CAD Courses for <em>Civil &amp; Mechanical</em> Engineers</>} intro={`${courses.length} industry-aligned programs across CAD, BIM, structural analysis, CAE and manufacturing. Filter by domain or search for a tool.`} code="CRS-01" />
      <CourseExplorer search title="Find Your Program" eyebrow="All Programs" />
      <TrainingProcess />
      <ContactCTA />
    </>
  )
}

/* DOMAIN PAGES ========================================================= */
function DomainPage({ domain }) {
  const civil = domain === 'civil'
  const list = courses.filter((c) => c.domain === domain)
  useSEO({
    title: civil ? 'Civil Engineering CAD & BIM Training' : 'Mechanical Engineering Design Training',
    description: civil
      ? 'Civil engineering software training: AutoCAD Civil, Revit, Civil 3D, STAAD.Pro, ETABS, BIM, Navisworks, quantity surveying and construction planning.'
      : 'Mechanical engineering design training: SolidWorks, CATIA, Creo, Inventor, NX CAD, ANSYS, GD&T, product design, machine design and CNC.',
    path: civil ? '/civil-engineering' : '/mechanical-engineering',
    jsonLd: courseLD(list),
  })
  const cats = civil ? civilCategories : mechanicalCategories
  return (
    <>
      <PageHero
        eyebrow={civil ? 'Civil Engineering' : 'Mechanical Engineering'}
        title={civil ? <>Transform Ideas Into <em>Structures.</em></> : <>Design Machines That <em>Move the World.</em></>}
        intro={civil
          ? 'Advanced CAD, BIM, structural and infrastructure design — from floor plans to fully coordinated, analysed building models.'
          : 'Design, model, analyse and visualise complex mechanical components with professional CAD and CAE tools.'}
        code={civil ? 'CIV-01' : 'MEC-01'}
      >
        <div className="page-hero__scene frame-corners">
          <Scene3D kind="domain" domain={civil ? 'civil' : 'mechanical'} active fallback={civil ? 'building' : 'gear'} />
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Program Categories" title={civil ? 'Six Ways Into Civil Design' : 'Six Ways Into Mechanical Design'} />
          <div className="cat-grid">
            {cats.map((c, i) => (
              <Reveal key={c} delay={i * 0.05}>
                <Tilt className="cat-card">
                  <span className="mono label">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{c}</h3>
                  <p>{list.filter((x) => x.category === c).map((x) => x.name).join(' · ') || 'Integrated across programs'}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {civil ? <CivilExperience /> : <MechanicalExperience />}
      <CourseExplorer domain={domain} showTabs={false} title={civil ? 'Civil Engineering Courses' : 'Mechanical Engineering Courses'} eyebrow="Courses" />
      <ProjectShowcase domain={domain} />
      <ProjectViewer initialModel={civil ? 'building' : 'gearbox'} lockModel />
      <CareerPaths />
      <ContactCTA />
    </>
  )
}
export const Civil = () => <DomainPage domain="civil" />
export const Mechanical = () => <DomainPage domain="mechanical" />

/* SOFTWARE ============================================================= */
export function Software() {
  useSEO({ title: 'CAD Software Training', description: 'Professional CAD / BIM / CAE software training: AutoCAD, Revit, Civil 3D, STAAD.Pro, ETABS, SolidWorks, CATIA, Creo, NX, Inventor, ANSYS, SketchUp and Navisworks.', path: '/software' })
  return (
    <>
      <PageHero eyebrow="Software Training" title={<>One Institute. <em>The Whole Toolchain.</em></>} intro="From drafting to BIM coordination, structural analysis, parametric CAD and simulation — learn the software that runs modern engineering." code="SW-01" />
      <SoftwareWall title="The Software Ecosystem" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Platform Guide" title="What Each Tool Does — and Which Course Teaches It" />
          <div className="sw-table">
            {software.map((s, i) => {
              const related = courses.filter((c) => c.software.some((x) => x.toLowerCase().includes(s.name.toLowerCase().split(' ')[0].split('.')[0])))
              return (
                <Reveal key={s.name} delay={(i % 4) * 0.04} className="sw-row">
                  <div className="sw-row__art"><BlueprintArt variant={s.art} title={s.name} animate={false} /></div>
                  <div className="sw-row__body">
                    <span className="mono label">{s.domain === 'both' ? 'CIVIL · MECHANICAL' : s.domain.toUpperCase()}</span>
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                  </div>
                  <ul className="tags sw-row__courses">{related.map((c) => <li key={c.slug}>{c.name}</li>)}</ul>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  )
}

/* PROJECTS ============================================================= */
export function Projects() {
  useSEO({ title: 'Engineering Projects', description: 'Civil and Mechanical engineering project case studies by CADD-EXPERTS students: buildings, bridges, BIM, gearboxes, automotive components and product design.', path: '/projects' })
  return (
    <>
      <PageHero eyebrow="Projects" title={<>Engineering Work, <em>Not Exercises.</em></>} intro="Every program ends in a portfolio project modelled on a real engineering brief. Explore the case studies." code="PRJ-01" />
      <ProjectShowcase headingLevel="h2" title="All Case Studies" />
      <ProjectViewer />
      <BlueprintToReality />
      <ContactCTA />
    </>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const p = projects.find((x) => x.slug === slug)
  const ld = useMemo(() => p && ({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.summary,
    creator: provider,
    keywords: p.software.join(', '),
  }), [p])
  useSEO({ title: p ? `${p.title} — Case Study` : 'Project', description: p?.summary, path: `/projects/${slug}`, jsonLd: ld })
  if (!p) return <Navigate to="/projects" replace />
  const others = projects.filter((x) => x.domain === p.domain && x.slug !== p.slug).slice(0, 3)
  const idx = projects.indexOf(p)
  return (
    <>
      <PageHero eyebrow={`Case Study · ${p.domain === 'civil' ? 'Civil' : 'Mechanical'}`} title={p.title} intro={p.summary} code={`PRJ-${String(idx + 1).padStart(2, '0')}`}>
        <div className="page-hero__scene frame-corners"><BlueprintArt variant={p.art} title={p.title} /></div>
      </PageHero>
      <section className="section case">
        <div className="container case__grid">
          <nav className="case__toc" aria-label="Case study sections">
            {['Overview', 'Problem', 'Design Process', 'Software Used', '3D Model', 'Technical Drawings', 'Final Output'].map((t, i) => (
              <a key={t} href={`#cs-${i}`}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{t}</a>
            ))}
          </nav>
          <div className="case__body">
            <Reveal as="section" className="case__block" ><h2 id="cs-0">Project Overview</h2><p className="lead">{p.summary}</p></Reveal>
            <Reveal as="section" className="case__block"><h2 id="cs-1">Problem</h2><p>{p.problem}</p></Reveal>
            <Reveal as="section" className="case__block">
              <h2 id="cs-2">Design Process</h2>
              <ol className="case__steps">{p.process.map((s, i) => <li key={s}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}</ol>
            </Reveal>
            <Reveal as="section" className="case__block"><h2 id="cs-3">Software Used</h2><ul className="tags tags--lg">{p.software.map((s) => <li key={s}>{s}</li>)}</ul></Reveal>
          </div>
        </div>
      </section>
      <div id="cs-4" />
      <ProjectViewer initialModel={p.model} lockModel title="3D Model" />
      <section className="section">
        <div className="container">
          <h2 className="section-title" id="cs-5">Technical Drawings</h2>
          <div className="drawings">
            {[p.art, p.model === 'building' ? 'plan' : 'section', p.model === 'building' ? 'section' : 'iso'].map((a, i) => (
              <Reveal key={a + i} delay={i * 0.08} className="drawing"><BlueprintArt variant={a} title={`${p.title} · sheet ${i + 1}`} /></Reveal>
            ))}
          </div>
          <Reveal className="case__block case__final">
            <h2 id="cs-6">Final Output</h2>
            <p className="lead">{p.output}</p>
          </Reveal>
        </div>
      </section>
      {others.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="More Projects" title="Related Case Studies" />
            <div className="project-grid">{others.map((o, i) => <ProjectCard key={o.slug} p={o} i={i + 1} />)}</div>
          </div>
        </section>
      )}
      <ContactCTA />
    </>
  )
}

/* GALLERY ============================================================== */
export function GalleryPage() {
  useSEO({ title: 'Gallery', description: 'Gallery of CADD-EXPERTS student work, engineering drawings, CAD models, training sessions and facilities.', path: '/gallery' })
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>Drawings, Models <em>&amp; Moments.</em></>} intro="Student projects, technical drawings, training sessions and life inside the lab." code="GAL-01" />
      <Gallery headingLevel="h2" />
      <Facilities />
    </>
  )
}

/* CAREERS ============================================================== */
export function Careers() {
  useSEO({ title: 'Careers in CAD, BIM & Design Engineering', description: 'Career paths after CAD training: CAD Engineer, BIM Engineer, Structural Designer, Mechanical Design Engineer, Product Designer, CAE Engineer and more.', path: '/careers' })
  return (
    <>
      <PageHero eyebrow="Careers" title={<>Turn CAD Skills <em>Into a Career.</em></>} intro="Design roles exist in every engineering sector. We help you choose a path, build the skills and present a portfolio employers can evaluate." code="CAR-01" />
      <CareerPaths headingLevel="h2" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Career Support" title="How We Help You Get Hired" />
          <div className="why-grid">
            {[
              ['project', 'Portfolio Reviews', 'Mentors review your project work and help you present it professionally.'],
              ['calc', 'Resume Guidance', 'Highlight the software, standards and deliverables that matter for design roles.'],
              ['mentor', 'Interview Preparation', 'Practise technical questions and software tests used in design interviews.'],
            ].map(([ic, h, t]) => (
              <Reveal key={h}><Tilt className="why-card"><span className="why-card__icon"><Glyph name={ic} size={46} /></span><h3>{h}</h3><p>{t}</p></Tilt></Reveal>
            ))}
          </div>
        </div>
      </section>
      <TrainingProcess />
      <ContactCTA />
    </>
  )
}

/* TESTIMONIALS ========================================================= */
export function TestimonialsPage() {
  useSEO({ title: 'Student Testimonials', description: 'What CADD-EXPERTS students say about our Civil and Mechanical CAD training programs.', path: '/testimonials' })
  return (
    <>
      <PageHero eyebrow="Testimonials" title={<>Engineers in <em>Their Own Words.</em></>} intro="Hear from students and professionals who trained with CADD-EXPERTS." code="TST-01" />
      <Testimonials />
      <section className="section"><div className="container"><Stats /></div></section>
      <ContactCTA />
    </>
  )
}

/* FAQ ================================================================== */
const faqLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}
export function FAQPage() {
  useSEO({ title: 'FAQ', description: 'Frequently asked questions about CADD-EXPERTS CAD courses: eligibility, software, certificates, batches, duration and enrollment.', path: '/faq', jsonLd: faqLD })
  return (
    <>
      <PageHero eyebrow="FAQ" title={<>Frequently Asked <em>Questions.</em></>} intro="Who can join, which software you’ll learn, batches, certificates and enrollment." code="FAQ-01" />
      <FAQ />
      <ContactCTA />
    </>
  )
}

/* CONTACT ============================================================== */
export function Contact() {
  useSEO({
    title: 'Contact',
    description: 'Contact CADD-EXPERTS for CAD, BIM and engineering design training. Call, email, WhatsApp or visit our institute.',
    path: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'CADD-EXPERTS',
      telephone: site.contact.phone,
      email: site.contact.email,
      address: { '@type': 'PostalAddress', streetAddress: site.contact.address, addressCountry: 'IN' },
      openingHours: 'Mo-Sa 09:00-19:00',
      url: site.url,
    },
  })
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s Talk <em>Engineering.</em></>} intro="Questions about courses, batches or careers? Our counsellors are ready to help." code="CNT-01" />
      <section className="section">
        <div className="container cta__grid">
          <div><ContactDetails /></div>
          <div className="cta__form frame-corners">
            <h2 className="form-title">Send an Enquiry</h2>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}

/* ENROLL =============================================================== */
export function Enroll() {
  useSEO({ title: 'Enquiry & Enrollment', description: 'Enroll at CADD-EXPERTS or request a call back. Choose your branch, course, experience level and preferred batch.', path: '/enroll' })
  return (
    <>
      <PageHero eyebrow="Enquiry / Enrollment" title={<>Ready to Design <em>Your Future?</em></>} intro="Start your journey from engineering fundamentals to professional CAD expertise. Fill in the form and a counsellor will reach out." code="ENR-01" />
      <section className="section">
        <div className="container enroll__grid">
          <div className="cta__form frame-corners">
            <h2 className="form-title">Enrollment Form</h2>
            <EnquiryForm intent="enroll" />
          </div>
          <aside className="enroll__aside">
            <h2 className="form-title">What Happens Next</h2>
            <ol className="case__steps">
              <li><span className="mono">01</span>A counsellor calls you within one working day.</li>
              <li><span className="mono">02</span>We recommend a course and batch for your goals.</li>
              <li><span className="mono">03</span>Attend a demo session at the lab or online.</li>
              <li><span className="mono">04</span>Confirm your seat and start building.</li>
            </ol>
            <ContactDetails map={false} />
          </aside>
        </div>
      </section>
      <FAQ limit={5} />
    </>
  )
}

/* LEGAL + 404 ========================================================== */
export function Legal({ kind }) {
  const privacy = kind === 'privacy'
  useSEO({ title: privacy ? 'Privacy Policy' : 'Terms & Conditions', path: privacy ? '/privacy' : '/terms' })
  return (
    <>
      <PageHero eyebrow="Legal" title={privacy ? 'Privacy Policy' : 'Terms & Conditions'} code="LGL-01" />
      <section className="section">
        <div className="container prose">
          {privacy ? (
            <>
              <p>CADD-EXPERTS collects the details you submit through our enquiry forms (name, phone, email and course preferences) solely to respond to your enquiry and to provide information about our courses.</p>
              <p>We do not sell or share your personal information with third parties for marketing. You may ask us to update or delete your details at any time by contacting <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</p>
              <p className="muted">This is a template. Please have the final policy reviewed for your jurisdiction before launch.</p>
            </>
          ) : (
            <>
              <p>Course content, schedules and fees are subject to change. Enrollment is confirmed on receipt of the applicable fee. Certificates are issued on completion of course requirements and project work.</p>
              <p>Software trademarks belong to their respective owners. CADD-EXPERTS provides training and is not affiliated with software vendors unless stated.</p>
              <p className="muted">This is a template. Please have the final terms reviewed before launch.</p>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export function NotFound() {
  useSEO({ title: 'Page Not Found' })
  return (
    <section className="section notfound">
      <div className="container">
        <p className="mono label">ERROR 404 · REFERENCE NOT FOUND</p>
        <h1 className="page-title">This drawing <em>doesn&apos;t exist.</em></h1>
        <p className="lead">The sheet you&apos;re looking for may have been moved or superseded.</p>
        <Magnetic to="/" variant="accent" arrow>Back to Home</Magnetic>
        <p style={{ marginTop: 24 }}><Link to="/courses" className="link-arrow">Browse courses →</Link></p>
      </div>
    </section>
  )
}
