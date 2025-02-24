// Brand color utilities for password entries
export const getBrandGradient = (url: string | undefined): string => {
  if (!url) return 'from-gray-600 to-gray-700';
  
  const domain = url.toLowerCase();
  
  if (domain.includes('amazon.com')) return 'from-orange-500 to-yellow-500';
  if (domain.includes('google.com')) return 'from-blue-500 to-green-500';
  if (domain.includes('microsoft.com')) return 'from-blue-600 to-cyan-500';
  if (domain.includes('apple.com')) return 'from-gray-800 to-gray-900';
  if (domain.includes('facebook.com')) return 'from-blue-600 to-blue-700';
  if (domain.includes('twitter.com')) return 'from-blue-400 to-blue-500';
  if (domain.includes('instagram.com')) return 'from-purple-500 via-pink-500 to-orange-500';
  if (domain.includes('netflix.com')) return 'from-red-600 to-red-700';
  if (domain.includes('spotify.com')) return 'from-green-600 to-green-700';
  if (domain.includes('github.com')) return 'from-gray-700 to-gray-800';
  
  // Default gradient for other sites
  return 'from-indigo-500 to-purple-500';
};

export const getBrandTextColor = (url: string | undefined): string => {
  if (!url) return 'text-gray-100';
  
  const domain = url.toLowerCase();
  if (domain.includes('apple.com')) return 'text-gray-100';
  
  return 'text-white';
};

export const getBrandHoverColor = (url: string | undefined): string => {
  if (!url) return 'hover:text-gray-200';
  
  const domain = url.toLowerCase();
  if (domain.includes('amazon.com')) return 'hover:text-orange-200';
  if (domain.includes('apple.com')) return 'hover:text-gray-300';
  
  return 'hover:text-blue-200';
};