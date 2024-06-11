import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as dat from "dat.gui";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/decoder/");
loader.setDRACOLoader(dracoLoader);

gsap.registerPlugin(ScrollTrigger);

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const pointLight = new THREE.PointLight(0xffffff, 0.75);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);
scene.add(ambientLight);

let jewel = null;

loader.load("./spaceship.gltf", (gltf) => {
	jewel = gltf.scene;
	scene.add(gltf.scene);
	jewel.position.x = 1.75;
	jewel.rotation.x = 1.25;
	jewel.rotation.y = -1.53;
	jewel.scale.set(0.2, 0.2, 0.2);

	const spaceshipFolder = gui.addFolder("Spaceship");
	spaceshipFolder.add(jewel.position, "x", -7, 7, 0.01).name("Position X");
	spaceshipFolder.add(jewel.position, "y", -7, 7, 0.01).name("Position Y");
	spaceshipFolder.add(jewel.position, "z", -7, 7, 0.01).name("Position Z");

	spaceshipFolder.add(jewel.rotation, "x", -7, 7, 0.01).name("Rotation X");
	spaceshipFolder.add(jewel.rotation, "y", -7, 7, 0.01).name("Rotation Y");
	spaceshipFolder.add(jewel.rotation, "z", -7, 7, 0.01).name("Rotation Z");

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: "section.animate",
			start: "top bottom",
			end: "bottom center",
			markers: true,
			scrub: true,
		},
	});

	timeline.to(jewel.position, {
		x: -2,
	});

	timeline.to(
		jewel.rotation,
		{
			x: 1.5,
			y: 1.8,
		},
		"<",
	);
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const baseY = 0;
const amplitude = 0.1;
const frequency = 2;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	if (jewel) {
		const time = performance.now() * 0.001;
		jewel.position.y = baseY + Math.sin(time * frequency) * amplitude;
	}

	// // Update Orbital Controls
	// controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
const lenis = new Lenis();
function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
