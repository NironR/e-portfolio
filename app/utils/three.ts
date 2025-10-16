import { Cache, TextureLoader } from 'three';

// Enable caching for all loaders (guard for SSR)
if (typeof window !== 'undefined') {
    Cache.enabled = true;
}

// Lazy, client-only loaders to avoid SSR import issues with three/examples/*
let _gltfLoader: any | null = null;
let _textureLoader: TextureLoader | null = null;

export async function getModelLoader() {
    if (typeof window === 'undefined') {
        throw new Error('getModelLoader can only be used in the browser');
    }
    if (_gltfLoader) return _gltfLoader;

    const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    _gltfLoader = gltfLoader;
    return _gltfLoader;
}

export function getTextureLoader() {
    if (typeof window === 'undefined') {
        throw new Error('getTextureLoader can only be used in the browser');
    }
    if (_textureLoader) return _textureLoader;
    _textureLoader = new TextureLoader();
    return _textureLoader;
}

/**
 * Clean up a scene's materials and geometry
 */
export const cleanScene = scene => {
    scene?.traverse(object => {
        if (!object.isMesh) return;

        object.geometry.dispose();

        if (object.material.isMaterial) {
            cleanMaterial(object.material);
        } else {
            for (const material of object.material) {
                cleanMaterial(material);
            }
        }
    });
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = material => {
    material.dispose();

    for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
            value.dispose();

            // Close GLTF bitmap textures
            value.source?.data?.close?.();
        }
    }
};

/**
 * Clean up and dispose of a renderer
 */
export const cleanRenderer = renderer => {
    renderer.dispose();
    renderer = null;
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = lights => {
    for (const light of lights) {
        light.parent.remove(light);
    }
};

/**
 * Get child by name
 */
export const getChild = (name, object) => {
    let node;

    object.traverse(child => {
        if (child.name === name) {
            node = child;
        }
    });

    return node;
};
