import ScrollStory from './ScrollStory'
import Scene3D from '../components/Scene3D'
import { Magnetic } from '../components/ui'
import { civilCategories, mechanicalCategories } from '../data/site'

const REALITY_STEPS = [
  { name: '2D Concept', text: 'STEP 01 — The engineering drawing appears: floor plan, structural grid and design intent.' },
  { name: '3D Modeling', text: 'STEP 02 — The drawing is extruded into a parametric 3D model: columns, beams and slabs.' },
  { name: 'Engineering Analysis', text: 'STEP 03 — Loads are applied and members are coloured by demand — interior columns carry the most.' },
  { name: 'Documentation', text: 'STEP 04 — Elevations, dimensions and annotations become the technical drawing set.' },
  { name: 'Real-World Engineering', text: 'STEP 05 — The model becomes a realistic, buildable structure.' },
]

export function BlueprintToReality() {
  return (
    <ScrollStory
      id="blueprint-to-reality"
      labelledBy="reality-title"
      eyebrow="From Blueprint to Reality"
      title={<>From Idea to <em>Engineering Reality.</em></>}
      steps={REALITY_STEPS}
      vhPerStep={80}
      renderScene={(s) => <Scene3D kind="reality" stage={s} fallback={['plan', 'iso', 'section', 'building', 'building'][s]} />}
    />
  )
}

const CIVIL_TEXT = [
  'Spaces are planned in 2D — walls, openings and circulation.',
  'Gridlines set out every column and define the structural rhythm.',
  'Columns rise from footings at each grid intersection.',
  'Beams frame between columns, floor by floor.',
  'Slabs drop into place to complete each storey.',
  'Mechanical, electrical and plumbing risers and ducts are coordinated in the model.',
  'Elevations are extracted directly from the BIM model.',
  'A live section cut reveals the building’s internal structure and services.',
  'The coordinated model becomes a final architectural visualisation.',
]
const CIVIL_NAMES = ['Floor Plan', 'Structural Grid', 'Columns', 'Beams', 'Slabs', 'MEP', 'Elevation', 'Section', 'Final Visualization']

export function CivilExperience() {
  return (
    <ScrollStory
      id="civil-experience"
      labelledBy="civil-exp-title"
      eyebrow="Civil Engineering Experience"
      title={<>Build a Structure, <em>Layer by Layer.</em></>}
      steps={CIVIL_NAMES.map((n, i) => ({ name: n, text: CIVIL_TEXT[i] }))}
      vhPerStep={55}
      renderScene={(s) => <Scene3D kind="civil" stage={s} fallback={s < 2 ? 'plan' : s === 7 ? 'section' : 'building'} />}
      footer={
        <div className="story__foot">
          <ul className="pill-list">{civilCategories.map((c) => <li key={c}>{c}</li>)}</ul>
          <Magnetic to="/civil-engineering" variant="primary" arrow>Explore Civil Engineering Programs</Magnetic>
        </div>
      }
    />
  )
}

const MECH_NAMES = ['Individual Components', 'Assembly', 'Exploded View', 'Technical Drawing', 'Dimensions', 'Section View', 'Final Rendered Component']
const MECH_TEXT = [
  'Every part — housing, shafts, gears, bearings and fasteners — is modelled on its own.',
  'Mates and constraints bring the parts together into a working gearbox.',
  'An exploded view shows how the assembly goes together.',
  'The model generates an orthographic technical drawing.',
  'Critical dimensions and the gear centre distance are annotated.',
  'A section cut exposes the gears, shafts and bearings inside.',
  'Materials and lighting turn CAD into a final rendered component.',
]

export function MechanicalExperience() {
  return (
    <ScrollStory
      id="mechanical-experience"
      labelledBy="mech-exp-title"
      side="right"
      eyebrow="Mechanical Engineering Experience"
      title={<>Engineer Every <em>Moving Part.</em></>}
      steps={MECH_NAMES.map((n, i) => ({ name: n, text: MECH_TEXT[i] }))}
      vhPerStep={60}
      renderScene={(s) => <Scene3D kind="mech" stage={s} fallback={s === 5 ? 'section' : s === 3 || s === 4 ? 'gear' : 'piston'} />}
      footer={
        <div className="story__foot">
          <ul className="pill-list">{mechanicalCategories.map((c) => <li key={c}>{c}</li>)}</ul>
          <Magnetic to="/mechanical-engineering" variant="primary" arrow>Explore Mechanical Programs</Magnetic>
        </div>
      }
    />
  )
}
