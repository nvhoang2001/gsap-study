import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import SplitType from "split-type";
import * as dat from "dat.gui";
import Lenis from "lenis";

import "./style.css";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

let ring;
let contactRotation = false;

const scene = new THREE.Scene();
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};
const canvas = document.querySelector("canvas.webgl");
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const light = new THREE.DirectionalLight("lightblue", 10);

const gui = new dat.GUI();

gui.hide();

function toggleWireframe(model, isWireframe, opacity) {
	model.traverse((child) => {
		if (child.isMesh && child.material) {
			child.material.wireframe = isWireframe;
			child.material.opacity = opacity;
			child.material.transparent = true;
		}
	});
}

function initThreeJs() {
	const loader = new GLTFLoader();

	// loader.load("/ring/scene.gltf", (gltf) => {
	// 	scene.add(gltf.scene);
	// 	// renderer.render(scene, camera);
	// });

	loader.load("ring.glb", (gltf) => {
		ring = gltf.scene;
		ring.position.set(0, 0, 0);
		ring.scale.set(0.5, 0.5, 0.5);

		scene.add(ring);

		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: "section.details",
				start: "top bottom",
				end: "bottom top",
				scrub: true,
			},
			defaults: {
				ease: "power3.out",
				duration: 3,
			},
		});

		timeline
			.to(ring.position, {
				z: 4.5,
				y: -0.34,
			})
			.to(
				ring.rotation,
				{
					z: 1,
				},
				"<",
			);

		const contactTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: "section.contact",
				start: "top 80%",
				end: "bottom center",
				scrub: true,
				onEnter() {
					toggleWireframe(ring, true, 0.1);
					contactRotation = true;
				},
				onEnterBack() {
					toggleWireframe(ring, true, 0.1);
					contactRotation = true;
				},
				onLeaveBack() {
					toggleWireframe(ring, false, 1);
				},
				onLeave() {
					toggleWireframe(ring, false, 1);
				},
			},
		});

		contactTimeline.to(ring.position, {
			z: 0.3,
			x: 0.4,
			y: -0.23,
		});

		const ringFolder = gui.addFolder("Ring");

		ringFolder.add(ring.position, "x", -3, 3, 0.01).name("Position x");
		ringFolder.add(ring.position, "y", -3, 3, 0.01).name("Position y");
		ringFolder.add(ring.position, "z", -3, 3, 0.01).name("Position z");
		ringFolder.add(ring.rotation, "x", -3, 3, 0.01).name("Rotation x");
		ringFolder.add(ring.rotation, "y", -3, 3, 0.01).name("Rotation y");
		ringFolder.add(ring.rotation, "z", -3, 3, 0.01).name("Rotation z");
		ringFolder.add(ring.scale, "x", -3, 3, 0.01).name("Scale x");
		ringFolder.add(ring.scale, "y", -3, 3, 0.01).name("Scale y");
		ringFolder.add(ring.scale, "z", -3, 3, 0.01).name("Scale z");
	});
	light.position.z = 8;
	scene.add(light);
	camera.position.set(0, 0, 2);
	scene.add(camera);

	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// renderer.render(scene, camera);
	window.addEventListener("resize", () => {
		size.width = window.innerWidth;
		size.height = window.innerHeight;

		camera.aspect = size.width / size.height;
		camera.updateProjectionMatrix();

		renderer.setSize(size.width, size.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});
}

function animateWords() {
	const words = ["Romance", "Rings", "Relationships"];
	let currentIndex = 0;
	let splitType;
	const textEl = document.querySelector(".primary-h1 span");

	function updateText() {
		textEl.textContent = words[currentIndex];
		splitType = new SplitType(textEl, { types: "chars" });
		animateChars(splitType.chars);
		currentIndex = (currentIndex + 1) % words.length;
	}

	function animateChars(chars) {
		gsap.from(chars, {
			yPercent: 100,
			stagger: 0.03,
			duration: 1.5,
			ease: "power4.out",
			onComplete() {
				if (splitType) {
					splitType.revert();
				}
			},
		});
	}

	setInterval(updateText, 3000);
}

function initRenderLoop() {
	const clock = new THREE.Clock();

	const tick = () => {
		const elapsedTime = clock.getElapsedTime();

		if (ring) {
			if (!contactRotation) {
				ring.rotation.y = 0.5 * elapsedTime;
				ring.rotation.x = 0;
				ring.rotation.z = 0;
			} else {
				ring.rotation.y = 0;
				ring.rotation.x = 0.2 * elapsedTime;
				ring.rotation.z = 0.2 * elapsedTime;
			}
		}

		// Update Orbital Controls
		// controls.update()

		// Render
		renderer.render(scene, camera);

		// Call tick again on the next frame
		window.requestAnimationFrame(tick);
	};

	tick();
}

function inspectionSectionSetup() {
	const inspectionTimeline = gsap.timeline({
		scrollTrigger: {
			trigger: ".inspection",
			start: "top bottom",
			end: "bottom top",
			scrub: true,
		},
	});

	inspectionTimeline
		.to(".inspection h2", {
			y: -100,
		})
		.to(
			".ring-bg",
			{
				y: -50,
				height: 300,
			},
			"< ",
		);

	gsap.to(".marquee h3", {
		scrollTrigger: {
			trigger: ".marquee h3",
			start: "top 80%",
			end: "bottom top",
			scrub: true,
		},
		x: 300,
	});
}

function setupSmoothScroll() {
	const lenis = new Lenis();
	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);
}

function sliderInit() {
	const matchMedia = gsap.matchMedia();

	matchMedia.add("(min-width: 768px)", () => {
		const slider = document.querySelector(".slider");
		const sliderSections = gsap.utils.toArray(".slider .slide");

		const sliderTimeline = gsap.timeline({
			defaults: {
				ease: "none",
			},
			scrollTrigger: {
				trigger: slider,
				pin: true,
				scrub: 1,
				end: () => `+=${slider.offsetWidth}`,
			},
		});

		sliderTimeline
			.to(slider, {
				xPercent: -(2 / 3) * 100,
			})
			.to(
				".progress",
				{
					width: "100%",
				},
				"<",
			);

		sliderSections.forEach((section, index) => {
			const textEl = section.querySelector(".slide-p");
			console.log("section", section);
			const slideText = new SplitType(textEl, { types: "chars" });

			sliderTimeline.from(slideText.chars, {
				scrollTrigger: {
					trigger: textEl,
					start: "top bottom",
					end: "bottom center",
					containerAnimation: sliderTimeline,
					scrub: true,
				},
				opacity: 0,
				y: 10,
				stagger: 0.03,
			});
		});
	});
}

function contactSectionSetup() {
	gsap.set("h4, .inner-contact span", {
		yPercent: 100,
	});

	gsap.set(".inner-contact p", {
		opacity: 0,
	});

	const contactTimeline = gsap.timeline({
		scrollTrigger: {
			trigger: ".inner-contact",
			start: "-20% center",
			end: "10% 40%",
			scrub: true,
		},
	});

	contactTimeline
		.to(".line-top, .line-bottom", {
			width: "100%",
		})
		.to("h4, .inner-contact span", {
			yPercent: 0,
		})
		.to(".inner-contact p", {
			opacity: 1,
		});
}

function preloadFile(url) {
	return new Promise((resolve, reject) => {
		const fileType = url.split(".").pop().toLowerCase();

		if (["jpg", "png", "gif"].includes(fileType)) {
			const img = new Image();

			img.src = url;
			img.onload = resolve;
			img.onerror = reject;
		} else if (["mp4", "webm"].includes(fileType)) {
			const video = document.createElement("video");

			video.src = url;
			video.onloadeddata = resolve;
			video.onerror = reject;
		} else {
			fetch(url)
				.then((response) => response.blob())
				.then(resolve, reject);
		}
	});
}

function preloadFiles(urls) {
	Promise.all(urls.map(preloadFile))
		.then(() => {
			console.log("All files preloaded");
			document.querySelector(".loading-screen").classList.add("hide-loader");
		})
		.catch((error) => {
			console.log("Preload files failed", error);
		});
}

preloadFiles([
	"ring.glb",
	"images/rings.jpg",
	"images/slide1.jpg",
	"images/slide2.jpg",
	"images/slide3.jpg",
	"hands.mp4",
]);
document.addEventListener("DOMContentLoaded", () => {
	initThreeJs();
	initRenderLoop();
	animateWords();
	inspectionSectionSetup();
	sliderInit();
	contactSectionSetup();
	setupSmoothScroll();
});
