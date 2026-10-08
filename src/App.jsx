import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const P = (name) => lazy(() => import('./pages/Pages').then((m) => ({ default: m[name] })))
const About = P('About')
const Courses = P('Courses')
const Civil = P('Civil')
const Mechanical = P('Mechanical')
const Software = P('Software')
const Projects = P('Projects')
const ProjectDetail = P('ProjectDetail')
const GalleryPage = P('GalleryPage')
const Careers = P('Careers')
const TestimonialsPage = P('TestimonialsPage')
const FAQPage = P('FAQPage')
const Contact = P('Contact')
const Enroll = P('Enroll')
const Legal = P('Legal')
const NotFound = P('NotFound')

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<Courses />} />
          <Route path="civil-engineering" element={<Civil />} />
          <Route path="mechanical-engineering" element={<Mechanical />} />
          <Route path="software" element={<Software />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="careers" element={<Careers />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="enroll" element={<Enroll />} />
          <Route path="privacy" element={<Legal kind="privacy" />} />
          <Route path="terms" element={<Legal kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
