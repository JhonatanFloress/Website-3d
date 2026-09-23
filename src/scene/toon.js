import * as THREE from 'three';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

// Three discrete light bands and ink silhouettes, including skinned meshes.
export function applyIllustratedStyle(model, renderer) {
  const ramp = new THREE.DataTexture(new Uint8Array([95, 175, 255]), 3, 1, THREE.RedFormat);
  ramp.minFilter = THREE.NearestFilter;
  ramp.magFilter = THREE.NearestFilter;
  ramp.generateMipmaps = false;
  ramp.needsUpdate = true;
  const materials = new Map();

  function convert(original) {
    if (materials.has(original)) return materials.get(original);
    const material = new THREE.MeshToonMaterial({
      color: 0xffffff,
      map: null,
      gradientMap: ramp,
      side: THREE.DoubleSide,
      transparent: original.transparent,
      opacity: original.opacity,
    });
    material.name = original.name;
    material.userData.outlineParameters = {
      thickness: 0.0014,
      color: new THREE.Color('#737783').toArray(),
    };
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `float pearlRim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 3.0);
         outgoingLight = mix(outgoingLight, vec3(1.0), pearlRim * 0.4);
         #include <opaque_fragment>`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         float paper = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453);
         gl_FragColor.rgb *= 0.975 + 0.025 * paper;`
      );
    };
    material.customProgramCacheKey = () => 'molar-white-pearl-v2';
    materials.set(original, material);
    return material;
  }

  model.traverse((object) => {
    if (!object.isMesh) return;
    object.material = Array.isArray(object.material)
      ? object.material.map(convert)
      : convert(object.material);
  });
  for (const original of materials.keys()) original.dispose();
  return new OutlineEffect(renderer, { defaultThickness: 0.0014 });
}
