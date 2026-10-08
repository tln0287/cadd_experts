/**
 * CADD-EXPERTS content configuration.
 * ------------------------------------------------------------------
 * This file is the single source of truth for site content. It can be
 * edited by hand or replaced by a headless CMS (Sanity, Strapi, etc.)
 * that returns the same shapes.
 *
 * Items marked `TODO` are placeholders that must be replaced with
 * real institute details before launch.
 */

export const site = {
  name: 'CADD-EXPERTS',
  tagline: 'Design the Future. Engineer the World.',
  altTagline: 'Where Engineering Meets Digital Design.',
  statement: 'Advanced CAD Training for Civil & Mechanical Engineers',
  url: 'https://www.cadd-experts.com', // TODO: production domain
  // TODO: replace all contact details with the institute's real details
  contact: {
    phone: '+91 98765 43210',
    whatsapp: '919876543210', // international format, digits only
    email: 'info@cadd-experts.example',
    address: '123 Engineering Avenue, Your City, India',
    mapQuery: 'India',
    hours: 'Mon – Sat · 9:00 AM – 7:00 PM',
  },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
    linkedin: 'https://linkedin.com/',
  },
  // Optional: POST enquiries as JSON to this URL (Formspree, a serverless
  // function, a CRM webhook…). When empty, the form hands off to WhatsApp.
  formEndpoint: '',
}

export const stats = [
  { value: 10, suffix: '+', label: 'Years of Expertise' },
  { value: 1000, suffix: '+', label: 'Students Trained' },
  { value: 20, suffix: '+', label: 'Industry Tools' },
  { value: 50, suffix: '+', label: 'Engineering Projects' },
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/civil-engineering', label: 'Civil', long: 'Civil Engineering' },
  { to: '/mechanical-engineering', label: 'Mechanical', long: 'Mechanical Engineering' },
  { to: '/software', label: 'Software', long: 'Software Training' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* `icon` maps to a glyph in components/Glyph.jsx                      */
/* ------------------------------------------------------------------ */
const c = (domain, slug, name, icon, desc, duration, level, software, careers, category) => ({
  domain, slug, name, icon, desc, duration, level, software, careers, category,
})

export const courses = [
  c('civil', 'autocad-civil', 'AutoCAD Civil', 'plan', 'Precise 2D drafting of plans, sections, elevations and working drawings to industry standards.', '6 weeks', 'Beginner', ['AutoCAD'], ['CAD Draughtsman', 'Civil CAD Engineer'], 'Architecture'),
  c('civil', 'revit-architecture', 'Revit Architecture', 'building', 'Parametric building modelling, families, sheets and photoreal presentation from a single BIM model.', '8 weeks', 'Intermediate', ['Revit'], ['Revit Engineer', 'BIM Modeler'], 'Architecture'),
  c('civil', 'revit-structure', 'Revit Structure', 'frame', 'Model columns, beams, foundations and rebar, and coordinate structure with architecture.', '8 weeks', 'Intermediate', ['Revit'], ['Structural BIM Modeler', 'Revit Engineer'], 'Structural Engineering'),
  c('civil', 'civil-3d', 'Civil 3D', 'road', 'Surfaces, alignments, corridors, grading and pipe networks for roads and land development.', '8 weeks', 'Intermediate', ['Civil 3D'], ['Highway Design Engineer', 'Infrastructure Designer'], 'Infrastructure'),
  c('civil', 'staad-pro', 'STAAD.Pro', 'truss', 'Analyse and design RCC and steel structures under dead, live, wind and seismic load cases.', '6 weeks', 'Intermediate', ['STAAD.Pro'], ['Structural Designer', 'Design Engineer'], 'Structural Engineering'),
  c('civil', 'etabs', 'ETABS', 'tower', 'Building-focused analysis and design of multi-storey RCC frames, shear walls and diaphragms.', '6 weeks', 'Advanced', ['ETABS'], ['Structural Designer', 'High-rise Design Engineer'], 'Structural Engineering'),
  c('civil', 'sketchup', 'SketchUp', 'iso', 'Fast concept massing, interior and exterior models, and visualisation-ready scenes.', '4 weeks', 'Beginner', ['SketchUp'], ['3D Visualiser', 'Architectural Modeler'], 'Architecture'),
  c('civil', 'navisworks', 'Navisworks', 'clash', 'Federate models, run clash detection and build 4D construction simulations.', '4 weeks', 'Advanced', ['Navisworks'], ['BIM Coordinator', 'BIM Engineer'], 'BIM'),
  c('civil', 'bim', 'BIM Professional', 'layers', 'End-to-end BIM workflow: modelling, coordination, documentation and LOD standards.', '16 weeks', 'Intermediate → Advanced', ['Revit', 'Navisworks', 'AutoCAD'], ['BIM Engineer', 'BIM Coordinator', 'BIM Modeler'], 'BIM'),
  c('civil', 'quantity-surveying', 'Quantity Surveying', 'calc', 'Take-offs, BOQs, rate analysis and estimation from drawings and BIM models.', '6 weeks', 'Beginner', ['Excel', 'Revit', 'AutoCAD'], ['Quantity Surveyor', 'Billing Engineer'], 'Quantity Surveying'),
  c('civil', 'structural-design', 'Structural Design', 'beam', 'RCC and steel member design to code, from load calculation to detailed drawings.', '10 weeks', 'Advanced', ['STAAD.Pro', 'ETABS', 'AutoCAD'], ['Structural Designer', 'Civil Design Engineer'], 'Structural Engineering'),
  c('civil', 'construction-planning', 'Construction Planning', 'gantt', 'Scheduling, resource planning and project control for construction sites.', '6 weeks', 'Intermediate', ['MS Project', 'Primavera P6'], ['Planning Engineer', 'Site Engineer'], 'Construction'),

  c('mechanical', 'autocad-mechanical', 'AutoCAD Mechanical', 'plan', 'Mechanical drafting, standard parts, BOMs and production-ready 2D drawings.', '6 weeks', 'Beginner', ['AutoCAD Mechanical'], ['CAD Engineer', 'Mechanical Draughtsman'], 'Mechanical Design'),
  c('mechanical', 'solidworks', 'SolidWorks', 'gear', 'Parametric parts, assemblies, sheet metal, weldments and detailed drawings.', '8 weeks', 'Beginner → Intermediate', ['SolidWorks'], ['Design Engineer', 'Product Designer'], 'Mechanical Design'),
  c('mechanical', 'catia', 'CATIA', 'car', 'Part design, generative surfacing and assemblies used across automotive and aerospace.', '10 weeks', 'Intermediate', ['CATIA V5'], ['Automotive Designer', 'Design Engineer'], 'Automotive Design'),
  c('mechanical', 'creo', 'Creo', 'bracket', 'Robust parametric modelling, assemblies and drawings in PTC Creo Parametric.', '8 weeks', 'Intermediate', ['Creo Parametric'], ['Mechanical Design Engineer', 'CAD Engineer'], 'Mechanical Design'),
  c('mechanical', 'inventor', 'Autodesk Inventor', 'shaft', 'Part, assembly and drawing workflows with frame generator and design accelerators.', '6 weeks', 'Beginner', ['Inventor'], ['Machine Designer', 'CAD Engineer'], 'Mechanical Design'),
  c('mechanical', 'nx-cad', 'NX CAD', 'turbine', 'Synchronous and parametric modelling for complex products and tooling.', '8 weeks', 'Advanced', ['Siemens NX'], ['Product Design Engineer', 'Tooling Engineer'], 'Product Design'),
  c('mechanical', 'ansys', 'ANSYS', 'mesh', 'Meshing, static structural, thermal and modal analysis to validate designs.', '8 weeks', 'Advanced', ['ANSYS Workbench'], ['CAE Engineer', 'Simulation Engineer'], 'CAE / Simulation'),
  c('mechanical', 'gdt', 'GD&T', 'tolerance', 'Datums, feature control frames and tolerance stack-ups per ASME Y14.5.', '3 weeks', 'Intermediate', ['Drawing standards'], ['Quality Engineer', 'Design Engineer'], 'Mechanical Design'),
  c('mechanical', '3d-modeling', '3D Modeling', 'iso', 'Solid and surface modelling fundamentals that transfer across every CAD platform.', '6 weeks', 'Beginner', ['SolidWorks', 'Fusion 360'], ['3D Modeler', 'CAD Engineer'], 'Product Design'),
  c('mechanical', 'product-design', 'Product Design', 'product', 'Concept to manufacturable product: ergonomics, plastics, DFM and rendering.', '10 weeks', 'Intermediate', ['SolidWorks', 'KeyShot', 'CATIA'], ['Product Designer', 'Industrial Designer'], 'Product Design'),
  c('mechanical', 'machine-design', 'Machine Design', 'gearbox', 'Design shafts, gears, bearings and mechanisms with calculation-backed decisions.', '8 weeks', 'Advanced', ['SolidWorks', 'Inventor'], ['Machine Design Engineer', 'Mechanical Design Engineer'], 'Mechanical Design'),
  c('mechanical', 'cnc-manufacturing', 'CNC / Manufacturing Design', 'cnc', 'CAM toolpaths, G-code basics, fixtures and design for manufacturing.', '6 weeks', 'Intermediate', ['Mastercam', 'Fusion 360 CAM'], ['Manufacturing Engineer', 'CNC Programmer'], 'CNC'),
]

export const civilCategories = ['Architecture', 'Structural Engineering', 'BIM', 'Infrastructure', 'Construction', 'Quantity Surveying']
export const mechanicalCategories = ['Mechanical Design', 'Product Design', 'Automotive Design', 'Manufacturing', 'CAE / Simulation', 'CNC']

/* ------------------------------------------------------------------ */
/* Software ecosystem                                                  */
/* ------------------------------------------------------------------ */
export const software = [
  { name: 'AutoCAD', short: 'ACAD', domain: 'both', art: 'plan', desc: 'The industry baseline for precise 2D drafting and documentation.' },
  { name: 'Revit', short: 'RVT', domain: 'civil', art: 'building', desc: 'BIM authoring for architecture, structure and MEP in one model.' },
  { name: 'Civil 3D', short: 'C3D', domain: 'civil', art: 'bridge', desc: 'Roads, grading, corridors and pipe networks for infrastructure.' },
  { name: 'STAAD.Pro', short: 'STD', domain: 'civil', art: 'truss', desc: 'Structural analysis and design for any frame, any material.' },
  { name: 'ETABS', short: 'ETB', domain: 'civil', art: 'building', desc: 'Purpose-built analysis and design for multi-storey buildings.' },
  { name: 'SolidWorks', short: 'SW', domain: 'mechanical', art: 'gear', desc: 'Parametric solid modelling for parts, assemblies and drawings.' },
  { name: 'CATIA', short: 'CAT', domain: 'mechanical', art: 'piston', desc: 'High-end surfacing and design for automotive and aerospace.' },
  { name: 'Creo', short: 'CRE', domain: 'mechanical', art: 'iso', desc: 'Scalable parametric and direct modelling from PTC.' },
  { name: 'NX', short: 'NX', domain: 'mechanical', art: 'gear', desc: 'Integrated CAD/CAM/CAE for complex product development.' },
  { name: 'Inventor', short: 'INV', domain: 'mechanical', art: 'section', desc: 'Mechanical design, simulation and documentation by Autodesk.' },
  { name: 'ANSYS', short: 'ANS', domain: 'mechanical', art: 'section', desc: 'Finite element simulation for structural, thermal and fluid problems.' },
  { name: 'SketchUp', short: 'SKP', domain: 'civil', art: 'iso', desc: 'Intuitive 3D massing and visual storytelling for spaces.' },
  { name: 'Navisworks', short: 'NWD', domain: 'civil', art: 'plan', desc: 'Model federation, clash detection and 4D construction sequencing.' },
]

/* ------------------------------------------------------------------ */
/* Projects — `model` selects the interactive 3D model (building|gearbox) */
/* `art` selects the generated technical drawing                         */
/* ------------------------------------------------------------------ */
export const projects = [
  {
    slug: 'residential-building', domain: 'civil', title: 'Residential Building', art: 'building', model: 'building',
    summary: 'G+5 residential block designed, analysed and documented in a full BIM workflow.',
    problem: 'Deliver a code-compliant, cost-efficient residential frame on a constrained urban plot with coordinated drawings for construction.',
    process: ['Architectural planning and space programming in AutoCAD', 'BIM model in Revit with structural grid and family library', 'Frame analysis for gravity and seismic loads in ETABS', 'Coordination and clash review in Navisworks'],
    software: ['AutoCAD', 'Revit', 'ETABS', 'Navisworks'],
    output: 'Complete GFC drawing set, BOQ and a coordinated BIM model.',
  },
  {
    slug: 'commercial-building', domain: 'civil', title: 'Commercial Building', art: 'section', model: 'building',
    summary: 'Open-plan commercial floor plates with long-span beams and a glazed façade.',
    problem: 'Maximise column-free floor area while controlling beam depth and deflection.',
    process: ['Grid optimisation studies', 'Long-span beam design in STAAD.Pro', 'Façade modelling in Revit', 'Section and elevation documentation'],
    software: ['Revit', 'STAAD.Pro', 'AutoCAD'],
    output: 'Structural design report, framing plans and façade elevations.',
  },
  {
    slug: 'structural-design', domain: 'civil', title: 'Structural Design', art: 'truss', model: 'building',
    summary: 'Steel portal and truss design for an industrial shed.',
    problem: 'Design a lightweight steel roof system for wind-governed loading.',
    process: ['Load calculation per code', 'Truss and portal modelling in STAAD.Pro', 'Member and connection design', 'Fabrication drawings'],
    software: ['STAAD.Pro', 'AutoCAD'],
    output: 'Analysis model, design calculations and fabrication drawings.',
  },
  {
    slug: 'bridge', domain: 'civil', title: 'Bridge', art: 'bridge', model: 'building',
    summary: 'Concept-to-detail study of a multi-span road bridge.',
    problem: 'Span a river crossing with an economical superstructure and clear navigation height.',
    process: ['Alignment and profile in Civil 3D', 'Girder and pier modelling', 'Moving-load analysis', 'General arrangement drawings'],
    software: ['Civil 3D', 'STAAD.Pro', 'AutoCAD'],
    output: 'GA drawings, analysis summary and 3D visualisation.',
  },
  {
    slug: 'infrastructure-project', domain: 'civil', title: 'Infrastructure Project', art: 'plan', model: 'building',
    summary: 'Road corridor and drainage design for a township layout.',
    problem: 'Design road geometry and stormwater networks over undulating terrain.',
    process: ['Surface creation from survey data', 'Alignment, profile and corridor modelling', 'Pipe network design', 'Quantity take-off'],
    software: ['Civil 3D', 'AutoCAD'],
    output: 'Plan & profile sheets, cross-sections and earthwork quantities.',
  },
  {
    slug: 'bim-project', domain: 'civil', title: 'BIM Project', art: 'iso', model: 'building',
    summary: 'Multi-discipline federated model with clash-free coordination.',
    problem: 'Resolve architecture, structure and MEP conflicts before construction.',
    process: ['Discipline models in Revit', 'Federation in Navisworks', 'Clash detection and resolution', '4D sequencing'],
    software: ['Revit', 'Navisworks'],
    output: 'Clash reports, coordinated model and 4D simulation.',
  },
  {
    slug: 'automotive-component', domain: 'mechanical', title: 'Automotive Component', art: 'piston', model: 'gearbox',
    summary: 'Piston and connecting-rod assembly modelled and validated.',
    problem: 'Reduce reciprocating mass without compromising fatigue strength.',
    process: ['Surface and solid modelling in CATIA', 'Assembly constraints and motion', 'Static and fatigue checks in ANSYS', 'Detailed drawings with GD&T'],
    software: ['CATIA', 'ANSYS'],
    output: 'Validated 3D assembly and production drawings.',
  },
  {
    slug: 'machine-assembly', domain: 'mechanical', title: 'Machine Assembly', art: 'gear', model: 'gearbox',
    summary: 'Special-purpose machine assembly with a full bill of materials.',
    problem: 'Design a compact indexing mechanism with standard purchased parts.',
    process: ['Concept layout', 'Part and assembly modelling in SolidWorks', 'Interference and motion study', 'BOM and assembly drawings'],
    software: ['SolidWorks', 'AutoCAD Mechanical'],
    output: 'Assembly model, exploded views and BOM.',
  },
  {
    slug: 'industrial-equipment', domain: 'mechanical', title: 'Industrial Equipment', art: 'section', model: 'gearbox',
    summary: 'Pressure-rated equipment frame and enclosure.',
    problem: 'Design a rigid frame that resists vibration from rotating machinery.',
    process: ['Weldment frame modelling', 'Modal analysis in ANSYS', 'Sheet-metal enclosure', 'Fabrication documentation'],
    software: ['SolidWorks', 'ANSYS'],
    output: 'Frame and enclosure models with fabrication drawings.',
  },
  {
    slug: 'product-design', domain: 'mechanical', title: 'Product Design', art: 'iso', model: 'gearbox',
    summary: 'Consumer product from sketch to manufacturable plastic parts.',
    problem: 'Translate an industrial design concept into moulded parts.',
    process: ['Concept surfacing', 'Draft, ribs and wall-thickness design', 'Assembly and snap fits', 'Rendering'],
    software: ['SolidWorks', 'KeyShot'],
    output: 'Moulding-ready CAD and marketing renders.',
  },
  {
    slug: 'gearbox', domain: 'mechanical', title: 'Gearbox', art: 'gear', model: 'gearbox',
    summary: 'Single-stage spur gear reducer: calculation, modelling and drawings.',
    problem: 'Achieve a 2:1 reduction with safe gear and shaft stresses.',
    process: ['Gear and shaft calculations', 'Parametric gear modelling', 'Bearing selection', 'Section views and GD&T'],
    software: ['Creo', 'Inventor', 'ANSYS'],
    output: 'Full gearbox model, sectional GA drawing and design report.',
  },
  {
    slug: 'mechanical-system', domain: 'mechanical', title: 'Mechanical System', art: 'piston', model: 'gearbox',
    summary: 'Conveyor drive system integrating motor, reducer and rollers.',
    problem: 'Select and integrate drive components for a continuous-duty conveyor.',
    process: ['Load and power calculation', 'Layout and component selection', 'Assembly modelling in NX', 'Documentation'],
    software: ['NX', 'AutoCAD Mechanical'],
    output: 'System layout, assembly model and specifications.',
  },
]

/* ------------------------------------------------------------------ */
export const whyUs = [
  { icon: 'industry', title: 'Industry-Oriented Training', text: 'Learn skills relevant to real engineering projects.' },
  { icon: 'project', title: 'Practical Projects', text: 'Work on real-world engineering design scenarios.' },
  { icon: 'software', title: 'Professional Software', text: 'Training on widely used CAD / BIM / CAE platforms.' },
  { icon: 'mentor', title: 'Expert Mentors', text: 'Learn from experienced engineering professionals.' },
  { icon: 'hands', title: 'Hands-On Learning', text: 'Focus on practical implementation rather than theory alone.' },
  { icon: 'career', title: 'Career Focus', text: 'Build an industry-ready engineering portfolio.' },
]

export const process = [
  { n: '01', title: 'Learn', text: 'Understand engineering fundamentals.' },
  { n: '02', title: 'Model', text: 'Create professional CAD models.' },
  { n: '03', title: 'Analyze', text: 'Apply engineering analysis.' },
  { n: '04', title: 'Design', text: 'Develop complete engineering projects.' },
  { n: '05', title: 'Document', text: 'Prepare professional drawings and documentation.' },
  { n: '06', title: 'Build Your Portfolio', text: 'Showcase your work to employers.' },
]

export const careers = {
  civil: ['CAD Engineer', 'BIM Engineer', 'Structural Designer', 'Civil Design Engineer', 'Revit Engineer', 'Quantity Surveyor', 'BIM Modeler'],
  mechanical: ['CAD Engineer', 'Mechanical Design Engineer', 'Product Designer', 'Design Engineer', 'Automotive Designer', 'Manufacturing Engineer', 'CAE Engineer'],
}

// TODO: SAMPLE testimonials for layout only. Replace with real, consented
// student testimonials (and photos) before publishing.
export const testimonials = [
  { name: 'Student Name', course: 'BIM Professional', discipline: 'Civil', initials: 'SN', text: 'The project-based approach meant I finished the course with a coordinated Revit model in my portfolio, not just a certificate.' },
  { name: 'Student Name', course: 'SolidWorks', discipline: 'Mechanical', initials: 'SN', text: 'Moving from sketches to full assemblies and drawings in a few weeks gave me the confidence to take on design tasks at work.' },
  { name: 'Student Name', course: 'STAAD.Pro + ETABS', discipline: 'Civil', initials: 'SN', text: 'Mentors explained why the software gives the result it does. That understanding of analysis is what interviewers asked about.' },
  { name: 'Student Name', course: 'CATIA', discipline: 'Mechanical', initials: 'SN', text: 'Surface modelling finally made sense. The automotive component project is now the centrepiece of my portfolio.' },
  { name: 'Student Name', course: 'Civil 3D', discipline: 'Civil', initials: 'SN', text: 'Weekend batches let me keep my job while learning road and drainage design on real survey data.' },
]

// `image` may be set to a URL (ideally .avif/.webp). Without it, a generated
// technical drawing (`art`) is shown.
export const gallery = [
  { cat: 'Civil', title: 'Residential elevation', art: 'building', tall: true },
  { cat: 'Mechanical', title: 'Spur gear detail', art: 'gear' },
  { cat: 'CAD', title: 'Ground floor plan', art: 'plan' },
  { cat: 'Projects', title: 'Bridge GA drawing', art: 'bridge', wide: true },
  { cat: 'Mechanical', title: 'Piston assembly', art: 'piston', tall: true },
  { cat: 'Civil', title: 'Roof truss', art: 'truss' },
  { cat: 'CAD', title: 'Isometric block study', art: 'iso' },
  { cat: 'Training', title: 'Section analysis session', art: 'section' },
  { cat: 'Students', title: 'Student BIM model', art: 'building' },
  { cat: 'Projects', title: 'Gearbox layout', art: 'gear', wide: true },
  { cat: 'Training', title: 'Drafting workshop', art: 'plan', tall: true },
  { cat: 'Students', title: 'Capstone: steel frame', art: 'truss' },
]
export const galleryCategories = ['All', 'Civil', 'Mechanical', 'CAD', 'Projects', 'Training', 'Students']

// TODO: add real facility photographs via `image`.
export const facilities = [
  { title: 'CAD Lab', text: 'Workstation-class machines with licensed CAD / BIM / CAE software.', art: 'iso' },
  { title: 'Computer Lab', text: 'Dedicated practice systems for self-paced modelling and revision.', art: 'plan' },
  { title: 'Training Rooms', text: 'Projector-equipped classrooms built for live demonstrations.', art: 'section' },
  { title: 'Engineering Models', text: 'Physical models and components to connect CAD with reality.', art: 'gear' },
  { title: 'Student Projects', text: 'A growing library of portfolio projects from past batches.', art: 'building' },
  { title: 'Faculty / Trainer Area', text: 'One-to-one mentoring and doubt-clearing with trainers.', art: 'truss' },
]

export const faqs = [
  { q: 'Who can join CADD-EXPERTS?', a: 'Engineering students, diploma holders, graduates, working professionals and anyone aspiring to a career in civil or mechanical design.' },
  { q: 'Do I need prior CAD experience?', a: 'No. Beginner programs start from fundamentals. Advanced programs list their prerequisites, and our counsellors will help you choose the right entry point.' },
  { q: 'Which software will I learn?', a: 'Depending on your track: AutoCAD, Revit, Civil 3D, STAAD.Pro, ETABS, SketchUp, Navisworks, SolidWorks, CATIA, Creo, NX, Inventor, ANSYS and more.' },
  { q: 'Do you provide certificates?', a: 'Yes. You receive a CADD-EXPERTS course completion certificate after finishing the course and its project work.' },
  { q: 'Are courses available for Civil students?', a: 'Yes — architecture, structural, BIM, infrastructure, construction planning and quantity surveying programs.' },
  { q: 'Are courses available for Mechanical students?', a: 'Yes — mechanical design, product design, automotive design, CAE / simulation, GD&T and CNC / manufacturing programs.' },
  { q: 'Are weekend batches available?', a: 'Yes. Weekday, weekend and fast-track batches are offered, subject to availability.' },
  { q: 'Do you provide project training?', a: 'Every program includes hands-on projects modelled on real engineering scenarios, which become part of your portfolio.' },
  { q: 'Do you provide career guidance?', a: 'Yes — portfolio reviews, resume guidance and interview preparation focused on design roles.' },
  { q: 'Can working professionals join?', a: 'Absolutely. Weekend and evening batches are designed around working schedules.' },
  { q: 'What is the course duration?', a: 'Individual software courses typically run 3–10 weeks; professional programs such as BIM run around 16 weeks.' },
  { q: 'How do I enroll?', a: 'Fill in the enquiry form, call us or message us on WhatsApp. A counsellor will help you pick a course and batch.' },
]

export const batches = ['Weekday — Morning', 'Weekday — Evening', 'Weekend', 'Fast-track', 'Online']
export const experienceLevels = ['Student', 'Fresher / Graduate', 'Working Professional (0–3 yrs)', 'Working Professional (3+ yrs)']
