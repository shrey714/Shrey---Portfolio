export type ProjectImageSource = {
  visualImageUrl?: string;
  visualImageUrls?: string[];
};

export function getProjectImageUrls(project: ProjectImageSource) {
  return project.visualImageUrls?.length ? project.visualImageUrls : project.visualImageUrl ? [project.visualImageUrl] : [];
}

export function getNextProjectImageIndex(currentIndex: number, direction: -1 | 1, imageCount: number) {
  if (imageCount <= 0) return 0;
  return (currentIndex + direction + imageCount) % imageCount;
}
