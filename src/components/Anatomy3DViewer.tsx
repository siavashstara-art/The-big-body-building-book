import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MuscleId } from '../types';

interface Anatomy3DViewerProps {
  selectedMuscle: MuscleId;
  onSelectMuscle: (muscle: MuscleId) => void;
}

interface MusclePartDef {
  id: MuscleId;
  nameFa: string;
  isBackSide?: boolean;
}

export const Anatomy3DViewer: React.FC<Anatomy3DViewerProps> = ({
  selectedMuscle,
  onSelectMuscle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewAngle, setViewAngle] = useState<'front' | 'back' | 'custom'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  // References to keep across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const muscleMeshesRef = useRef<Map<MuscleId, THREE.Mesh[]>>(new Map());
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationYRef = useRef<number>(0);
  const currentRotationYRef = useRef<number>(0);

  // Quick camera view switcher
  const setCameraView = useCallback((angle: 'front' | 'back') => {
    setViewAngle(angle);
    targetRotationYRef.current = angle === 'front' ? 0 : Math.PI;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e1017);
    scene.fog = new THREE.FogExp2(0x0e1017, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.3, 4.2);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x2a3045, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff6b00, 2.0); // Neon orange rim
    rimLight.position.set(-3, 3, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x404860, 0x11131c, 1.0);
    scene.add(fillLight);

    // Ground reflective contact circle
    const groundGeo = new THREE.RingGeometry(0.1, 1.4, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x1a2233,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0.01;
    scene.add(groundMesh);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(4, 16, 0xff5722, 0x1e2433);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 5. Composite Procedural Human Anatomical Mannequin
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 0);
    scene.add(characterGroup);
    characterGroupRef.current = characterGroup;

    // Base body material (Dark charcoal carbon with metallic sheen)
    const baseBodyMat = new THREE.MeshStandardMaterial({
      color: 0x242834,
      roughness: 0.5,
      metalness: 0.25,
    });

    const muscleMap = new Map<MuscleId, THREE.Mesh[]>();

    const createMuscleMesh = (
      geo: THREE.BufferGeometry,
      muscleId: MuscleId,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1]
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x3d4455,
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0x000000,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.scale.set(...scale);
      mesh.userData = { muscleId };
      characterGroup.add(mesh);

      if (!muscleMap.has(muscleId)) {
        muscleMap.set(muscleId, []);
      }
      muscleMap.get(muscleId)!.push(mesh);
      return mesh;
    };

    // --- SKELETAL FOUNDATION ---
    // Head & Neck
    const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, baseBodyMat);
    headMesh.position.set(0, 1.88, 0);
    headMesh.scale.set(0.9, 1.1, 0.95);
    characterGroup.add(headMesh);

    const neckGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.12, 16);
    const neckMesh = new THREE.Mesh(neckGeo, baseBodyMat);
    neckMesh.position.set(0, 1.76, 0);
    characterGroup.add(neckMesh);

    // Ribcage / Inner Torso
    const spineGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 16);
    const spineMesh = new THREE.Mesh(spineGeo, baseBodyMat);
    spineMesh.position.set(0, 1.45, 0);
    characterGroup.add(spineMesh);

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.2, 16);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, baseBodyMat);
    pelvisMesh.position.set(0, 1.1, 0);
    characterGroup.add(pelvisMesh);

    // --- MUSCLE GROUPS (ANATOMICAL SHAPES) ---

    // 1. CHEST (Pectoralis Major - Left & Right)
    const chestGeo = new THREE.BoxGeometry(0.16, 0.18, 0.1);
    createMuscleMesh(chestGeo, 'chest', [-0.09, 1.58, 0.08], [0, 0.1, -0.05]);
    createMuscleMesh(chestGeo, 'chest', [0.09, 1.58, 0.08], [0, -0.1, 0.05]);

    // 2. DELTOIDS / SHOULDERS (Left & Right)
    const shoulderGeo = new THREE.SphereGeometry(0.095, 16, 16);
    createMuscleMesh(shoulderGeo, 'shoulders', [-0.25, 1.66, 0], [0, 0, 0.2], [1, 1.25, 1.1]);
    createMuscleMesh(shoulderGeo, 'shoulders', [0.25, 1.66, 0], [0, 0, -0.2], [1, 1.25, 1.1]);

    // 3. BICEPS (Front Arms)
    const bicepGeo = new THREE.CapsuleGeometry(0.055, 0.14, 12, 16);
    createMuscleMesh(bicepGeo, 'biceps', [-0.26, 1.46, 0.02], [0, 0, 0.1], [1, 1.1, 1.1]);
    createMuscleMesh(bicepGeo, 'biceps', [0.26, 1.46, 0.02], [0, 0, -0.1], [1, 1.1, 1.1]);

    // Forearms (Base limbs)
    const forearmGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.26, 12);
    const forearmLeft = new THREE.Mesh(forearmGeo, baseBodyMat);
    forearmLeft.position.set(-0.28, 1.22, 0.02);
    characterGroup.add(forearmLeft);
    const forearmRight = new THREE.Mesh(forearmGeo, baseBodyMat);
    forearmRight.position.set(0.28, 1.22, 0.02);
    characterGroup.add(forearmRight);

    // 4. TRICEPS (Back Arms)
    const tricepGeo = new THREE.CapsuleGeometry(0.052, 0.15, 12, 16);
    createMuscleMesh(tricepGeo, 'triceps', [-0.26, 1.46, -0.04], [0, 0, 0.1], [1, 1.1, 1]);
    createMuscleMesh(tricepGeo, 'triceps', [0.26, 1.46, -0.04], [0, 0, -0.1], [1, 1.1, 1]);

    // 5. BACK & LATS (Latissimus Dorsi & Upper Traps)
    const latsGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.32, 16, 1, false, 0, Math.PI);
    createMuscleMesh(latsGeo, 'back', [0, 1.54, -0.06], [0, Math.PI, 0], [1.3, 1, 1]);
    const trapsGeo = new THREE.ConeGeometry(0.16, 0.18, 8);
    createMuscleMesh(trapsGeo, 'back', [0, 1.7, -0.04], [Math.PI, 0, 0], [1.2, 1, 0.6]);

    // 6. CORE / ABS (Rectus Abdominis 6-Pack + Obliques)
    const absGeo = new THREE.BoxGeometry(0.14, 0.26, 0.07);
    createMuscleMesh(absGeo, 'core', [0, 1.34, 0.08], [0, 0, 0]);
    const obliquesGeo = new THREE.CapsuleGeometry(0.04, 0.22, 10, 12);
    createMuscleMesh(obliquesGeo, 'core', [-0.11, 1.32, 0.04], [0, 0, -0.15]);
    createMuscleMesh(obliquesGeo, 'core', [0.11, 1.32, 0.04], [0, 0, 0.15]);

    // 7. GLUTES (Gluteus Maximus - Left & Right Back)
    const gluteGeo = new THREE.SphereGeometry(0.11, 16, 16);
    createMuscleMesh(gluteGeo, 'glutes', [-0.09, 1.05, -0.07], [0, 0, 0], [1, 1.1, 1.2]);
    createMuscleMesh(gluteGeo, 'glutes', [0.09, 1.05, -0.07], [0, 0, 0], [1, 1.1, 1.2]);

    // 8. QUADS (Thigh Front - Left & Right)
    const quadGeo = new THREE.CapsuleGeometry(0.085, 0.32, 14, 16);
    createMuscleMesh(quadGeo, 'quads', [-0.12, 0.76, 0.03], [0.05, 0, 0.05]);
    createMuscleMesh(quadGeo, 'quads', [0.12, 0.76, 0.03], [0.05, 0, -0.05]);

    // 9. HAMSTRINGS (Thigh Back - Left & Right)
    const hamGeo = new THREE.CapsuleGeometry(0.075, 0.3, 14, 16);
    createMuscleMesh(hamGeo, 'hamstrings', [-0.12, 0.74, -0.04], [-0.05, 0, 0.05]);
    createMuscleMesh(hamGeo, 'hamstrings', [0.12, 0.74, -0.04], [-0.05, 0, -0.05]);

    // Knee joints (biomechanics pivot sphere)
    const kneeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const kneeLeft = new THREE.Mesh(kneeGeo, baseBodyMat);
    kneeLeft.position.set(-0.12, 0.52, 0);
    characterGroup.add(kneeLeft);
    const kneeRight = new THREE.Mesh(kneeGeo, baseBodyMat);
    kneeRight.position.set(0.12, 0.52, 0);
    characterGroup.add(kneeRight);

    // 10. CALVES (Lower Leg - Gastrocnemius & Soleus)
    const calfGeo = new THREE.CapsuleGeometry(0.065, 0.28, 12, 14);
    createMuscleMesh(calfGeo, 'calves', [-0.12, 0.32, -0.02], [0, 0, 0], [0.95, 1.1, 1.1]);
    createMuscleMesh(calfGeo, 'calves', [0.12, 0.32, -0.02], [0, 0, 0], [0.95, 1.1, 1.1]);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.09, 0.05, 0.18);
    const footLeft = new THREE.Mesh(footGeo, baseBodyMat);
    footLeft.position.set(-0.12, 0.03, 0.04);
    characterGroup.add(footLeft);
    const footRight = new THREE.Mesh(footGeo, baseBodyMat);
    footRight.position.set(0.12, 0.03, 0.04);
    characterGroup.add(footRight);

    muscleMeshesRef.current = muscleMap;

    // 6. Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes: THREE.Mesh[] = [];
      muscleMap.forEach(meshes => allMeshes.push(...meshes));

      const intersects = raycaster.intersectObjects(allMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const clickedMuscleId = hit.userData.muscleId as MuscleId;
        if (clickedMuscleId) {
          onSelectMuscle(clickedMuscleId);
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes: THREE.Mesh[] = [];
      muscleMap.forEach(meshes => allMeshes.push(...meshes));

      const intersects = raycaster.intersectObjects(allMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const mid = hit.userData.muscleId as MuscleId;
        setHoveredMuscle(mid);
        container.style.cursor = 'pointer';
      } else {
        setHoveredMuscle(null);
        container.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // Drag to rotate mannequin
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        targetRotationYRef.current += deltaX * 0.01;
        setViewAngle('custom');
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile gym users
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        touchStartX = e.touches[0].clientX;
        targetRotationYRef.current += deltaX * 0.015;
        setViewAngle('custom');
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    // 7. Render Loop
    let animFrameId = 0;

    const tick = () => {
      // Smooth Damping for rotation
      currentRotationYRef.current = THREE.MathUtils.damp(
        currentRotationYRef.current,
        targetRotationYRef.current,
        12,
        0.016
      );

      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = currentRotationYRef.current;
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);

      // Clean geometry/material resources
      scene.clear();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectMuscle]);

  // Update muscle materials when selectedMuscle or hoveredMuscle changes
  useEffect(() => {
    const muscleMap = muscleMeshesRef.current;
    if (!muscleMap) return;

    muscleMap.forEach((meshes, mid) => {
      const isSelected = mid === selectedMuscle;
      const isHovered = mid === hoveredMuscle;

      meshes.forEach(mesh => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          // Intense Neon Red/Orange Glow as requested in the brief!
          mat.color.setHex(0xff3300);
          mat.emissive.setHex(0xff3d00);
          mat.emissiveIntensity = 0.85;
          mat.roughness = 0.2;
        } else if (isHovered) {
          // Golden/Amber Hover State
          mat.color.setHex(0xff8f00);
          mat.emissive.setHex(0xff8f00);
          mat.emissiveIntensity = 0.45;
          mat.roughness = 0.3;
        } else {
          // Standard dark anatomical muscle tone
          mat.color.setHex(0x353c4d);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.45;
        }
      });
    });

    // Auto rotate camera to back if selecting back, glutes, or hamstrings
    if (selectedMuscle === 'back' || selectedMuscle === 'glutes' || selectedMuscle === 'hamstrings') {
      if (viewAngle !== 'back' && viewAngle !== 'custom') {
        setCameraView('back');
      }
    } else if (selectedMuscle === 'chest' || selectedMuscle === 'core' || selectedMuscle === 'quads') {
      if (viewAngle !== 'front' && viewAngle !== 'custom') {
        setCameraView('front');
      }
    }
  }, [selectedMuscle, hoveredMuscle, setCameraView, viewAngle]);

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl bg-[#0b0d14] border border-[#232838] overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Top minimal spec title & active muscle label */}
      <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-[#121520]/90 backdrop-blur-sm border border-[#2b3245] px-4 py-2 rounded-xl pointer-events-auto shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d00] animate-none inline-block"></span>
            <span className="text-xs text-neutral-400 font-medium">عضله فعال:</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {getMuscleFaName(selectedMuscle)}
            </span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-[#121520]/90 backdrop-blur-sm border border-[#2b3245] p-1 rounded-xl pointer-events-auto">
          <button
            onClick={() => setCameraView('front')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewAngle === 'front'
                ? 'bg-[#ff5722] text-white shadow-md'
                : 'text-neutral-300 hover:text-white hover:bg-[#1f2434]'
            }`}
          >
            نمای قدامی (جلو)
          </button>
          <button
            onClick={() => setCameraView('back')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewAngle === 'back'
                ? 'bg-[#ff5722] text-white shadow-md'
                : 'text-neutral-300 hover:text-white hover:bg-[#1f2434]'
            }`}
          >
            نمای خلفی (پشت)
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Unified Bottom Control Dock (Three.js skill compliant) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-xl bg-[#121522]/95 border border-[#2d354a] rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-neutral-300 gap-2 overflow-x-auto py-1">
          <span className="text-[#ff9800] font-semibold whitespace-nowrap">راهنما:</span>
          <span className="whitespace-nowrap">لمس هر عضله در مدل ۳بعدی = گشایش حرکات بیومکانیک</span>
          <span className="text-neutral-500">|</span>
          <span className="whitespace-nowrap text-neutral-400">درگ ماوس یا لمس جهت چرخش ۳۶۰ درجه</span>
        </div>
      </div>
    </div>
  );
};

function getMuscleFaName(id: MuscleId): string {
  switch (id) {
    case 'chest': return 'سینه (Pectoralis)';
    case 'back': return 'پشت و زیربغل (Lats)';
    case 'shoulders': return 'سرشانه و دلتوئید (Delts)';
    case 'biceps': return 'جلو بازو (Biceps)';
    case 'triceps': return 'پشت بازو (Triceps)';
    case 'quads': return 'چهارسر ران (Quads)';
    case 'hamstrings': return 'همسترینگ (Hamstrings)';
    case 'glutes': return 'سرینی (Glutes)';
    case 'core': return 'میان‌تنه و شکم (Core)';
    case 'calves': return 'ساق پا (Calves)';
    default: return id;
  }
}
