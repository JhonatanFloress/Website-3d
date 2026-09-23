import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { applyIllustratedStyle } from './toon.js';
const world=document.querySelector('.world');
const host=document.querySelector('#model');
const status=document.querySelector('#model-status');
export async function initModel(){
 host.hidden=false;
 status.textContent="CARGANDO MODELO 3D…";
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
 renderer.setClearColor(0,0); renderer.toneMapping=THREE.NoToneMapping;
 host.append(renderer.domElement);
 const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(36,1,.01,100);
 scene.add(new THREE.HemisphereLight(0xffffff,0x999999,0.7));
 const light=new THREE.DirectionalLight(0xffffff,1.65);light.position.set(-3,5,4);scene.add(light);
 const gltf=await new GLTFLoader().loadAsync('/models/sequence-white.glb');
 const model=gltf.scene;
 const illustration=applyIllustratedStyle(model,renderer);
 const mixer=new THREE.AnimationMixer(model);
 const clip=gltf.animations[0];
 if(!clip)throw new Error('La secuencia no contiene animación');
 const action=mixer.clipAction(clip).setLoop(THREE.LoopRepeat,Infinity).play();
 // Frame the entire baked timeline, including root motion and the fall.
 const box=new THREE.Box3();
 for(let step=0;step<=48;step++){
  mixer.setTime(clip.duration*step/49);model.updateMatrixWorld(true);
  model.traverse(object=>{if(object.isMesh){if(object.isSkinnedMesh){object.skeleton.update();object.computeBoundingBox();box.union(object.boundingBox.clone().applyMatrix4(object.matrixWorld))}else{object.geometry.computeBoundingBox();box.union(object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld))}}});
 }
 mixer.setTime(0);
 const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());
 const scale=3/Math.max(size.x,size.y,size.z);
 const normalized=new THREE.Group();normalized.add(model);normalized.position.copy(center).multiplyScalar(-scale);normalized.scale.setScalar(scale);
 const pivot=new THREE.Group();pivot.add(normalized);scene.add(pivot);
 // Larger framing with a slight sideways tilt and three-quarter turn.
 pivot.rotation.z=THREE.MathUtils.degToRad(-10);
 pivot.rotation.y=THREE.MathUtils.degToRad(18);
 const sphere={radius:size.length()*scale/2};
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;const fov=Math.min(THREE.MathUtils.degToRad(camera.fov),2*Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));camera.position.set(0,0,sphere.radius/Math.sin(fov/2)*0.75);camera.updateProjectionMatrix()}
 new ResizeObserver(resize).observe(host);resize();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let targetX=0,targetY=0,last=performance.now();
 world.addEventListener('pointermove',e=>{const r=world.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*.35;targetY=((e.clientY-r.top)/r.height-.5)*.2});
 world.addEventListener('pointerleave',()=>{targetX=targetY=0});
 let rotation=0;
 renderer.setAnimationLoop(time=>{const dt=Math.min((time-last)/1000,.05);last=time;if(!document.hidden&&!world.classList.contains('paused')&&!reduced.matches){mixer.update(dt);if(!gltf.animations.length)rotation+=dt*.14;pivot.rotation.y=THREE.MathUtils.degToRad(18)+rotation+targetX;pivot.rotation.x=THREE.MathUtils.lerp(pivot.rotation.x,targetY,.04)}if(!document.hidden)illustration.render(scene,camera)});
 world.classList.add('model-loaded');status.textContent='SECUENCIA COMPLETA / 12.1 s';
 renderer.domElement.addEventListener('webglcontextlost',()=>{world.classList.remove('model-loaded');status.textContent='RECARGA PARA VER EL 3D'});
}
