// Utility to add cache busting to image URLs
export const addCacheBusting = (imagePath: string): string => {
  if (!imagePath) return imagePath;
  
  // Don't add cache busting to external URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Add timestamp as query parameter to force refresh
  const timestamp = Date.now();
  const separator = imagePath.includes('?') ? '&' : '?';
  return `${imagePath}${separator}_t=${timestamp}`;
};

// Alternative: Use version-based cache busting
export const addVersionCacheBusting = (imagePath: string, version: string = '1.0.0'): string => {
  if (!imagePath) return imagePath;
  
  // Don't add cache busting to external URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const separator = imagePath.includes('?') ? '&' : '?';
  return `${imagePath}${separator}v=${version}`;
};