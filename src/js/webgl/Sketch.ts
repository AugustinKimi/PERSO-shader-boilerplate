import {
  BufferGeometry,
  Material,
  ShaderMaterial,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PlaneGeometry,
  ACESFilmicToneMapping,
  Vector2,
} from "three";
import fragmentShader from "./shaders/fragment.glsl?raw";
import vertexShader from "./shaders/vertex.glsl?raw";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";

class Sketch {
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  scene: Scene;
  geometry: PlaneGeometry;
  material: ShaderMaterial;
  mesh: Mesh<BufferGeometry, Material>;
  controls: OrbitControls;
  debug: Pane;

  constructor() {
    this.init();
  }

  init() {
    this.createCamera();
    this.createScene();
    this.createRenderer();
    this.createControls();
    this.createObject();
    this.createLights();
    this.createDebug();
    this.initEvents();
    requestAnimationFrame(this.loop);
  }

  destroy() {
    this.removeEvents();
  }

  initEvents() {
    window.addEventListener("resize", this.handleResize, false);
  }

  removeEvents() {
    window.removeEventListener("resize", this.handleResize, false);
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  createCamera() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createScene() {
    this.scene = new Scene();
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    document.body.appendChild(this.renderer.domElement);
  }

  createObject() {
    this.geometry = new PlaneGeometry(2, 2, 64, 64);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new Vector2(0) },
        uMouseStrength: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createLights() {}

  createDebug() {
    this.debug = new Pane();
    this.debug.addBinding(this.material.uniforms.uProgress, "value", {
      min: 0,
      max: 1,
      step: 0.01,
    });
    this.debug.addBinding(this.material.uniforms.uMouseStrength, "value", {
      min: 0,
      max: 1,
      step: 0.01,
    });
    this.debug.addBinding(this.material.uniforms.uMouse, "value", {
      x: {
        min: -1,
        max: 1,
        step: 0.01,
      },
      y: {
        min: -1,
        max: 1,
        step: 0.01,
      },
    });
  }

  loop = () => {
    this.material.uniforms.uTime.value += 0.05;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame(this.loop);
  };
}

export default Sketch;
