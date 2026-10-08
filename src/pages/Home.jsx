import { useSEO } from '../hooks/useSEO'
import Hero from '../sections/Hero'
import AboutIntro from '../sections/AboutIntro'
import Domains from '../sections/Domains'
import CourseExplorer from '../sections/CourseExplorer'
import SoftwareWall from '../sections/SoftwareWall'
import { BlueprintToReality, CivilExperience, MechanicalExperience } from '../sections/Stories'
import { ProjectShowcase, ProjectViewer } from '../sections/Projects'
import { WhyUs, TrainingProcess, CareerPaths, Testimonials, Gallery, Facilities, FAQ } from '../sections/Content'
import ContactCTA from '../sections/Enquiry'
import { site } from '../data/site'

const LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CADD-EXPERTS',
  url: site.url,
  description: 'CADD training institute for Civil and Mechanical engineers.',
}

export default function Home() {
  useSEO({
    title: 'CADD Training Institute — Civil & Mechanical CAD Courses',
    description: 'CADD-EXPERTS: CAD training institute for AutoCAD, Revit, BIM, Civil 3D, STAAD.Pro, ETABS, SolidWorks, CATIA, Creo, NX and ANSYS. Industry-ready Civil and Mechanical engineering design training.',
    path: '/',
    jsonLd: LD,
  })
  return (
    <>
      <Hero />
      <AboutIntro />
      <Domains />
      <CourseExplorer limit={8} />
      <SoftwareWall />
      <BlueprintToReality />
      <CivilExperience />
      <MechanicalExperience />
      <ProjectShowcase limit={6} />
      <ProjectViewer />
      <WhyUs />
      <TrainingProcess />
      <CareerPaths />
      <Testimonials />
      <Gallery limit={8} />
      <Facilities />
      <FAQ limit={6} />
      <ContactCTA />
    </>
  )
}
