import { animate, useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport } from '~/hooks';
import {
  createRef,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  CSSProperties,
  RefObject,
} from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  Texture,
} from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';
import { resolveSrcFromSrcSet } from '~/utils/image';
import { classes, cssProps, numToMs } from '~/utils/styles';
import {
  cleanRenderer,
  cleanScene,
  getModelLoader,
  removeLights,
  getTextureLoader,
} from '~/utils/three';
import { ModelAnimationType } from './device-models';
import { throttle } from '~/utils/throttle';
import styles from './model.module.css';

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
} as const;

const rotationSpringConfig = {
  stiffness: 40,
  damping: 20,
  mass: 1.4,
  restSpeed: 0.001,
};

interface ModelData {
  position: { x: number; y: number; z: number };
  url: string;
  texture: {
    srcSet: string;
    placeholder: string;
    sizes: string;
  };
  animation?: (typeof ModelAnimationType)[keyof typeof ModelAnimationType];
}

interface ModelProps {
  models: ModelData[];
  show?: boolean;
  showDelay?: number;
  cameraPosition?: { x: number; y: number; z: number };
  style?: CSSProperties;
  className?: string;
  onLoad?: () => void;
  alt?: string;
}

export const Model = ({
  models,
  show = true,
  showDelay = 0,
  cameraPosition = { x: 0, y: 0, z: 8 },
  style,
  className,
  onLoad,
  alt,
  ...rest
}: ModelProps) => {
  const [loaded, setLoaded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const camera = useRef<PerspectiveCamera>();
  const modelGroup = useRef<Group>(new Group());
  const scene = useRef<Scene>(new Scene());
  const renderer = useRef<WebGLRenderer>();
  const shadowGroup = useRef<Group>(new Group());
  const renderTarget = useRef<WebGLRenderTarget>();
  const renderTargetBlur = useRef<WebGLRenderTarget>();
  const shadowCamera = useRef<OrthographicCamera>();
  const depthMaterial = useRef<MeshDepthMaterial>();
  const horizontalBlurMaterial = useRef<ShaderMaterial>();
  const verticalBlurMaterial = useRef<ShaderMaterial>();
  const plane = useRef<Mesh>();
  const lights = useRef<Array<AmbientLight | DirectionalLight>>([]);
  const blurPlane = useRef<Mesh>();
  const fillPlane = useRef<Mesh>();
  
  const isInViewport = useInViewport(container, false, { threshold: 0.2 });
  const reduceMotion = useReducedMotion();
  const rotationX = useSpring(0, rotationSpringConfig);
  const rotationY = useSpring(0, rotationSpringConfig);

  useEffect(() => {
    if (!container.current || !canvas.current) return;

    const { clientWidth, clientHeight } = container.current;

    renderer.current = new WebGLRenderer({
      canvas: canvas.current,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });

    renderer.current.setPixelRatio(2);
    renderer.current.setSize(clientWidth, clientHeight);
    renderer.current.outputColorSpace = SRGBColorSpace;

    camera.current = new PerspectiveCamera(36, clientWidth / clientHeight, 0.1, 100);
    camera.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    scene.current.add(modelGroup.current);

    // Lighting
    const ambientLight = new AmbientLight(0xffffff, 1.2);
    const keyLight = new DirectionalLight(0xffffff, 1.1);
    const fillLight = new DirectionalLight(0xffffff, 0.8);

    fillLight.position.set(-6, 2, 2);
    keyLight.position.set(0.5, 0, 0.866);
    lights.current = [ambientLight, keyLight, fillLight];
    lights.current.forEach(light => scene.current.add(light));

    scene.current.add(shadowGroup.current);
    shadowGroup.current.position.set(0, 0, -0.8);
    shadowGroup.current.rotateX(Math.PI / 2);

    const renderTargetSize = 512;
    const planeWidth = 8;
    const planeHeight = 8;
    const cameraHeight = 1.5;
    const shadowOpacity = 0.8;
    const shadowDarkness = 3;

    renderTarget.current = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    renderTarget.current.texture.generateMipmaps = false;

    renderTargetBlur.current = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    renderTargetBlur.current.texture.generateMipmaps = false;

    const planeGeometry = new PlaneGeometry(planeWidth, planeHeight).rotateX(Math.PI / 2);

    const planeMaterial = new MeshBasicMaterial({
      map: renderTarget.current.texture,
      opacity: shadowOpacity,
      transparent: true,
    });

    plane.current = new Mesh(planeGeometry, planeMaterial);
    plane.current.scale.y = -1;
    shadowGroup.current.add(plane.current);

    blurPlane.current = new Mesh(planeGeometry);
    blurPlane.current.visible = false;
    shadowGroup.current.add(blurPlane.current);

    const fillMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    });

    fillPlane.current = new Mesh(planeGeometry, fillMaterial);
    fillPlane.current.rotateX(Math.PI);
    fillPlane.current.position.y -= 0.00001;
    shadowGroup.current.add(fillPlane.current);

    shadowCamera.current = new OrthographicCamera(
      -planeWidth / 2,
      planeWidth / 2,
      planeHeight / 2,
      -planeHeight / 2,
      0,
      cameraHeight
    );
    shadowCamera.current.rotation.x = Math.PI / 2;
    shadowGroup.current.add(shadowCamera.current);

    depthMaterial.current = new MeshDepthMaterial();
    depthMaterial.current.userData.darkness = { value: shadowDarkness };
    depthMaterial.current.onBeforeCompile = shader => {
      const currentDepthMaterial = depthMaterial.current;
      if (!currentDepthMaterial) return;

      shader.uniforms.darkness = currentDepthMaterial.userData.darkness;
      shader.fragmentShader = `
        uniform float darkness;
        ${shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        )}
      `;
    };
    depthMaterial.current.depthTest = false;
    depthMaterial.current.depthWrite = false;

    horizontalBlurMaterial.current = new ShaderMaterial(HorizontalBlurShader);
    horizontalBlurMaterial.current.depthTest = false;

    verticalBlurMaterial.current = new ShaderMaterial(VerticalBlurShader);
    verticalBlurMaterial.current.depthTest = false;

    const renderFrameFn = () => renderFrame();
    const unsubscribeX = rotationX.on('change', renderFrameFn);
    const unsubscribeY = rotationY.on('change', renderFrameFn);

    return () => {
      renderTarget.current?.dispose();
      renderTargetBlur.current?.dispose();
      removeLights(lights.current);
      cleanScene(scene.current);
      if (renderer.current) cleanRenderer(renderer.current);
      unsubscribeX();
      unsubscribeY();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurShadow = useCallback((amount: number) => {
    if (!renderer.current || !blurPlane.current || !shadowCamera.current || !renderTarget.current || !renderTargetBlur.current || !horizontalBlurMaterial.current || !verticalBlurMaterial.current) return;

    blurPlane.current.visible = true;

    blurPlane.current.material = horizontalBlurMaterial.current;
    if (horizontalBlurMaterial.current.uniforms.tDiffuse) {
        horizontalBlurMaterial.current.uniforms.tDiffuse.value = renderTarget.current.texture;
    }
    horizontalBlurMaterial.current.uniforms.h.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTargetBlur.current);
    renderer.current.render(blurPlane.current, shadowCamera.current);

    blurPlane.current.material = verticalBlurMaterial.current;
    if (verticalBlurMaterial.current.uniforms.tDiffuse) {
        verticalBlurMaterial.current.uniforms.tDiffuse.value = renderTargetBlur.current.texture;
    }
    verticalBlurMaterial.current.uniforms.v.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTarget.current);
    renderer.current.render(blurPlane.current, shadowCamera.current);

    blurPlane.current.visible = false;
  }, []);

  const renderFrame = useCallback(() => {
    if (!renderer.current || !scene.current || !camera.current || !shadowCamera.current || !renderTarget.current || !modelGroup.current || !depthMaterial.current) return;

    const blurAmount = 5;
    const initialBackground = scene.current.background;
    scene.current.background = null;
    scene.current.overrideMaterial = depthMaterial.current;

    renderer.current.setRenderTarget(renderTarget.current);
    renderer.current.render(scene.current, shadowCamera.current);

    scene.current.overrideMaterial = null;

    blurShadow(blurAmount);
    blurShadow(blurAmount * 0.4);

    renderer.current.setRenderTarget(null);
    scene.current.background = initialBackground;

    modelGroup.current.rotation.x = rotationX.get();
    modelGroup.current.rotation.y = rotationY.get();

    renderer.current.render(scene.current, camera.current);
  }, [blurShadow, rotationX, rotationY]);

  useEffect(() => {
    const onMouseMove = throttle((event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const position = {
        x: (event.clientX - innerWidth / 2) / innerWidth,
        y: (event.clientY - innerHeight / 2) / innerHeight,
      };

      rotationY.set(position.x / 2);
      rotationX.set(position.y / 2);
    }, 100);

    if (isInViewport && !reduceMotion) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  useEffect(() => {
    const handleResize = () => {
      if (!container.current || !renderer.current || !camera.current) return;

      const { clientWidth, clientHeight } = container.current;

      renderer.current.setSize(clientWidth, clientHeight);
      camera.current.aspect = clientWidth / clientHeight;
      camera.current.updateProjectionMatrix();

      renderFrame();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <div
      className={classes(styles.model, className)}
      data-loaded={loaded}
      style={cssProps({ delay: numToMs(showDelay) }, style)}
      ref={container}
      role="img"
      aria-label={alt}
      {...rest}
    >
      <canvas className={styles.canvas} ref={canvas} />
      {models.map((model, index) => (
        <Device
          key={JSON.stringify(model.position)}
          renderer={renderer}
          modelGroup={modelGroup}
          show={show}
          showDelay={showDelay}
          renderFrame={renderFrame}
          index={index}
          setLoaded={setLoaded}
          onLoad={onLoad}
          model={model}
        />
      ))}
    </div>
  );
};

interface DeviceProps {
  renderer: RefObject<WebGLRenderer | undefined>;
  model: ModelData;
  modelGroup: RefObject<Group>;
  renderFrame: () => void;
  index: number;
  showDelay: number;
  setLoaded: (loaded: boolean) => void;
  onLoad?: () => void;
  show: boolean;
}

const Device = ({
  renderer,
  model,
  modelGroup,
  renderFrame,
  index,
  showDelay,
  setLoaded,
  onLoad,
  show,
}: DeviceProps) => {
  const [loadDevice, setLoadDevice] = useState<{ start: () => Promise<any> }>();
  const reduceMotion = useReducedMotion();
  const placeholderScreen = useRef<Mesh>();

  useEffect(() => {
    const applyScreenTexture = async (texture: Texture, node: Mesh) => {
      if (!renderer.current) return;
      
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;
      texture.anisotropy = renderer.current.capabilities.getMaxAnisotropy();
      texture.generateMipmaps = false;

      await renderer.current.initTexture(texture);

      if (node.material instanceof MeshBasicMaterial) {
          node.material.color = new Color(0xffffff);
          node.material.transparent = true;
          node.material.map = texture;
      }
    };

    const load = async () => {
      const { texture, position, url } = model;
      let loadFullResTexture: () => Promise<void> = async () => {};
      let playAnimation: () => void = () => {};

      const textureLoader = getTextureLoader();
      const modelLoader = await getModelLoader();
      const [placeholder, gltf] = await Promise.all([
        textureLoader.loadAsync(texture.placeholder),
        modelLoader.loadAsync(url) as Promise<GLTF>,
      ]);

      if (modelGroup.current) {
          modelGroup.current.add(gltf.scene);
      }

      const screenNodes: Mesh[] = [];
      gltf.scene.traverse((node: Object3D) => {
        if (node instanceof Mesh && node.material) {
          node.material = (node.material as MeshBasicMaterial).clone();
          (node.material as MeshBasicMaterial).color = new Color(0x1f2025);
        }

        if (node.name === MeshType.Screen && node instanceof Mesh) {
          placeholderScreen.current = node.clone();
          placeholderScreen.current.material = (node.material as MeshBasicMaterial).clone();
          node.parent?.add(placeholderScreen.current);
          (placeholderScreen.current.material as MeshBasicMaterial).opacity = 1;
          placeholderScreen.current.position.z += 0.001;

          applyScreenTexture(placeholder, placeholderScreen.current);
          screenNodes.push(node);
        }
      });

      loadFullResTexture = async () => {
        const image = await resolveSrcFromSrcSet(texture);
        const fullSize = await textureLoader.loadAsync(image);
        
        for (const node of screenNodes) {
            await applyScreenTexture(fullSize, node);
        }

        animate(1, 0, {
          onUpdate: value => {
            if (placeholderScreen.current?.material instanceof MeshBasicMaterial) {
                placeholderScreen.current.material.opacity = value;
            }
            renderFrame();
          },
        });
      };

      const targetPosition = new Vector3(position.x, position.y, position.z);

      if (reduceMotion) {
        gltf.scene.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      }

      if (model.animation === ModelAnimationType.SpringUp) {
        playAnimation = () => {
          const startPosition = new Vector3(
            targetPosition.x,
            targetPosition.y - 1,
            targetPosition.z
          );

          gltf.scene.position.set(startPosition.x, startPosition.y, startPosition.z);

          animate(startPosition.y, targetPosition.y, {
            type: 'spring',
            delay: (300 * index + showDelay) / 1000,
            stiffness: 60,
            damping: 20,
            mass: 1,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              gltf.scene.position.y = value;
              renderFrame();
            },
          });
        };
      }

      if (model.animation === ModelAnimationType.LaptopOpen) {
        playAnimation = () => {
          const frameNode = gltf.scene.children.find(
            (node: Object3D) => node.name === MeshType.Frame
          );
          if (!frameNode) return;
          
          const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0);
          const endRotation = new Vector3(0, 0, 0);

          gltf.scene.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
          frameNode.rotation.set(startRotation.x, startRotation.y, startRotation.z);

          animate(startRotation.x, endRotation.x, {
            type: 'spring',
            delay: (300 * index + showDelay + 300) / 1000,
            stiffness: 80,
            damping: 20,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              frameNode.rotation.x = value;
              renderFrame();
            },
          });
        };
      }

      return { loadFullResTexture, playAnimation };
    };

    setLoadDevice({ start: load });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadDevice || !show) return;
    let animation: { stop: () => void };

    const onModelLoad = async () => {
      const { loadFullResTexture, playAnimation } = await loadDevice.start();

      setLoaded(true);
      onLoad?.();

      if (!reduceMotion) {
        animation = playAnimation();
      }

      await loadFullResTexture();

      if (reduceMotion) {
        renderFrame();
      }
    };

    startTransition(() => {
      onModelLoad();
    });

    return () => {
      animation?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDevice, show]);

  return null;
};

export default Model;