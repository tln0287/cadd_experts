import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { pointer } from './kit'

/**
 * Damps the camera toward `position` / `lookAt`, adds subtle mouse parallax
 * and an optional slow orbit.
 */
export default function CameraRig({ position, lookAt = [0, 0, 0], parallax = 0.4, orbit = 0, speed = 2, fit = true }) {
  const { size } = useThree()
  // pull the camera back on tall/narrow canvases so models stay in frame
  const aspect = size.width / size.height
  const fitK = fit && aspect < 1.25 ? Math.min(2, 1.25 / aspect) : 1
  const look = useRef(new THREE.Vector3(...lookAt))
  const tmp = useRef(new THREE.Vector3())
  const tgtLook = useRef(new THREE.Vector3())
  const target = useRef({ position, lookAt })
  target.current = { position, lookAt }

  useFrame(({ camera, clock }, dt) => {
    const [lx, ly, lz] = target.current.lookAt
    const [x, y, z] = target.current.position.map((v, i) => [lx, ly, lz][i] + (v - [lx, ly, lz][i]) * fitK)
    let px = x
    let pz = z
    if (orbit) {
      const a = clock.elapsedTime * orbit
      const r = Math.hypot(x, z)
      const a0 = Math.atan2(x, z)
      px = Math.sin(a0 + a) * r
      pz = Math.cos(a0 + a) * r
    }
    tmp.current.set(px + pointer.x * parallax, y + pointer.y * parallax * 0.6, pz)
    const k = 1 - Math.exp(-speed * dt)
    camera.position.lerp(tmp.current, k)
    tgtLook.current.set(...target.current.lookAt)
    look.current.lerp(tgtLook.current, k)
    camera.lookAt(look.current)
  })
  return null
}
