// Get the API base URL
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
};

// Get the full API URL
export const getApiUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove leading /api if path already starts with /api
  if (path.startsWith('/api')) {
    return `${baseUrl.replace('/api', '')}${path}`;
  }
  // If path doesn't start with /, add it
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

// Convert relative image path to full URL
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If it's a relative path, prepend the server base URL
  const baseUrl = getApiBaseUrl();
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${normalizedPath}`;
};

export const authHeaders = (token: string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const uploadImage = async (file: File, token: string): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const apiUrl = getApiUrl('/api/upload/image');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      const imagePath = data.url || data.imageUrl || null;
      // Convert relative path to full URL if needed
      if (imagePath && !imagePath.startsWith('http')) {
        return getImageUrl(imagePath);
      }
      return imagePath;
    }
    return null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

