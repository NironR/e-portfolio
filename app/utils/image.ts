interface ImageSource {
  src?: string;
  srcSet?: string;
  sizes?: string;
}

/**
 * Use the browser's image loading to load an image and
 * grab the `src` it chooses from a `srcSet`
 */
export async function loadImageFromSrcSet({ 
  src, 
  srcSet, 
  sizes 
}: ImageSource): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!src && !srcSet) {
        throw new Error('No image src or srcSet provided');
      }

      let tempImage: HTMLImageElement | null = new Image();

      if (src) {
        tempImage.src = src;
      }

      if (srcSet) {
        tempImage.srcset = srcSet;
      }

      if (sizes) {
        tempImage.sizes = sizes;
      }

      const onLoad = () => {
        if (tempImage) {
          tempImage.removeEventListener('load', onLoad);
          const source = tempImage.currentSrc;
          tempImage = null;
          resolve(source);
        }
      };

      tempImage.addEventListener('load', onLoad);
    } catch (error) {
      reject(`Error loading ${srcSet}: ${error}`);
    }
  });
}

/**
 * Generates a transparent png of a given width and height
 */
export async function generateImage(width: number = 1, height: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Video thumbnail failed to load'));
        return;
      }
      const image = URL.createObjectURL(blob);
      canvas.remove();
      resolve(image);
    });
  });
}

/**
 * Use native html image `srcSet` resolution for non-html images
 */
export async function resolveSrcFromSrcSet({ 
  srcSet, 
  sizes 
}: Required<Pick<ImageSource, 'srcSet' | 'sizes'>>): Promise<string> {
  const sources = await Promise.all(
    srcSet.split(', ').map(async (srcString) => {
      const [src, widthStr] = srcString.split(' ');
      const size = Number(widthStr.replace('w', ''));
      const image = await generateImage(size);
      return { src, image, width: widthStr };
    })
  );

  const fakeSrcSet = sources.map(({ image, width }) => `${image} ${width}`).join(', ');
  const fakeSrc = await loadImageFromSrcSet({ srcSet: fakeSrcSet, sizes });

  const output = sources.find((src) => src.image === fakeSrc);
  return output ? output.src : '';
}