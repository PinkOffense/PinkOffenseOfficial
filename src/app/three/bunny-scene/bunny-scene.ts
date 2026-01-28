import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  signal,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-bunny-scene',
  imports: [],
  templateUrl: './bunny-scene.html',
  styleUrl: './bunny-scene.scss'
})
export class BunnyScene implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private model: THREE.Group | null = null;
  private animationId: number = 0;
  private clock = new THREE.Clock();

  loading = signal(true);
  loadingProgress = signal(0);
  error = signal<string | null>(null);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScene();
      this.loadModel();
      this.animate();
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
      cancelAnimationFrame(this.animationId);
      this.renderer?.dispose();
      this.controls?.dispose();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0.2, 1.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.5;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI / 1.8;

    // Lighting
    this.setupLighting();

    // Particles
    this.createParticles();
  }

  private setupLighting(): void {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Main pink spotlight from front-right
    const pinkLight = new THREE.SpotLight(0xff2d75, 3);
    pinkLight.position.set(2, 2, 2);
    pinkLight.angle = Math.PI / 4;
    pinkLight.penumbra = 0.5;
    this.scene.add(pinkLight);

    // Cyan rim light from left
    const cyanLight = new THREE.PointLight(0x00f0ff, 2);
    cyanLight.position.set(-2, 1, 0);
    this.scene.add(cyanLight);

    // Purple fill light from back
    const purpleLight = new THREE.PointLight(0xb14aed, 1.5);
    purpleLight.position.set(0, -1, -2);
    this.scene.add(purpleLight);

    // Soft white key light from top
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(0, 3, 1);
    this.scene.add(keyLight);
  }

  private createParticles(): void {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const pink = new THREE.Color(0xff2d75);
    const cyan = new THREE.Color(0x00f0ff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const color = Math.random() > 0.5 ? pink : cyan;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.name = 'particles';
    this.scene.add(particles);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();

    loader.load(
      'assets/models/cyberpunk+bunny+3d+model.glb',
      (gltf) => {
        this.model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.2 / maxDim;
        this.model.scale.setScalar(scale);

        this.model.position.x = -center.x * scale;
        this.model.position.y = -center.y * scale;
        this.model.position.z = -center.z * scale;

        // Enhance materials
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1;
              mat.needsUpdate = true;
            }
          }
        });

        this.scene.add(this.model);
        this.loading.set(false);
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          this.loadingProgress.set(percent);
        }
      },
      (err) => {
        console.error('Error loading model:', err);
        this.error.set('Failed to load 3D model');
        this.loading.set(false);
      }
    );
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Animate particles
    const particles = this.scene.getObjectByName('particles') as THREE.Points;
    if (particles) {
      particles.rotation.y += delta * 0.1;
      particles.rotation.x += delta * 0.05;
    }

    // Subtle model hover effect
    if (this.model) {
      this.model.position.y += Math.sin(this.clock.getElapsedTime() * 2) * 0.0005;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
