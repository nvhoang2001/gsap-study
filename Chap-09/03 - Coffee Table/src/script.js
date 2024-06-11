import "./style.css";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as dat from "dat.gui";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";

const spittedTitle = new SplitType(".main h1");
const spittedSubTitle = new SplitType(".main p");
const content = document.querySelector(".content");
console.log("content", content);
gsap.from(spittedTitle.chars, {
	yPercent: 150,
	stagger: 0.1,
	ease: "back.out(4)",
	duration: 1,
});

gsap.from(spittedSubTitle.words, {
	yPercent: 100,
	ease: "power2.out",
	duration: 1,
	delay: 0.5,
});

gsap.from(".content h3", {
	y: 200,
	opacity: 0,
	duration: 1,
	ease: "power4.inOut",
	scrollTrigger: {
		trigger: content,
		start: "top center",
		end: "bottom bottom",
		markers: true,
	},
});

const fbxLoader = new FBXLoader();

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
gui.addFolder("");

fbxLoader.load("./coffe-table.fbx", (data) => {
	jewel = data;

	scene.add(data);

	data.scale.set(0.005, 0.005, 0.005);

	const modelFolder = gui.addFolder("Model");
	modelFolder.add(data.position, "x", -3, 3, 0.01).name("Position X");
	modelFolder.add(data.position, "y", -3, 3, 0.01).name("Position Y");
	modelFolder.add(data.position, "z", -3, 3, 0.01).name("Position Z");

	modelFolder.add(data.scale, "x", 0.005, 0.1, 0.005).name("Scale X");
	modelFolder.add(data.scale, "y", 0.005, 0.1, 0.005).name("Scale Y");
	modelFolder.add(data.scale, "z", 0.005, 0.1, 0.005).name("Scale Z");

	modelFolder.add(data.rotation, "x", -4, 4, 0.1).name("Rotation X");
	modelFolder.add(data.rotation, "y", -4, 4, 0.1).name("Rotation Y");
	modelFolder.add(data.rotation, "z", -4, 4, 0.1).name("Rotation Z");

	data.position.y = -1;
	data.rotation.x = 0.2;

	const timeline = gsap.timeline();

	timeline.from(data.position, {
		y: -3,
		duration: 1,
		ease: "power3.inOut",
	});

	timeline.from(
		data.scale,
		{
			x: 0.02,
			y: 0.02,
			z: 0.02,
			duration: 1,
			ease: "power3.inOut",
		},
		"<",
	);
	const section = document.querySelector("section");
	const scrollTimeline = gsap.timeline({
		scrollTrigger: {
			trigger: section,
			markers: false,
			start: "top top",
			end: "80% top",
			scrub: 1,
			toggleActions: "start none none reverse",
		},
	});

	scrollTimeline.to(data.rotation, {
		x: Math.PI / 2.05,
		ease: "none",
	});

	scrollTimeline.to(
		data.scale,
		{
			x: 0.03,
			z: 0.03,
		},
		"<",
	);

	scrollTimeline.to(
		data.position,
		{
			x: 0.2,
			y: 0.2,
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	// if (jewel) {
	// 	jewel.rotation.y = elapsedTime * Math.PI * 0.5;
	// }

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
