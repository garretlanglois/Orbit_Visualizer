import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Earth Geometry
const geometry = new THREE.SphereGeometry(2, 32, 32);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/earth_flipped.jpeg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//Satellite Geometry
const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const dot = new THREE.Mesh(dotGeometry, dotMaterial);
scene.add(dot);

//Line Geometry
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const lineGeometry = new THREE.BufferGeometry();
const maxPoints = 1000;
var positions = new Float32Array(maxPoints * 3);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

var line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

const orbitRadius = 2.2;

camera.position.z = 7;

function updateLine(dotPosition, index) {
  positions[index * 3] = dotPosition.x;
  positions[index * 3 + 1] = dotPosition.y;
  positions[index * 3 + 2] = dotPosition.z;

  lineGeometry.attributes.position.needsUpdate = true;
}

var pointIndex = 0;

var orbitStarted = false;

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.003;

  const time = Date.now() * 0.001;
  dot.position.x = Math.cos(time) * orbitRadius;
  dot.position.z = Math.sin(time) * orbitRadius;
  dot.position.y = Math.sin(time) * orbitRadius* 0.5;

  if (!orbitStarted && time > 2) {
    orbitStarted = true;
  }

  //Dot position and line tracing
  if (orbitStarted) {
    if (pointIndex < maxPoints) {
      
      updateLine(dot.position, pointIndex++);
      lineGeometry.setDrawRange(0, pointIndex);
    
    }
  }

  renderer.render(scene, camera);
}

animate();