export type ProjectImageSource = {
  visualImageUrls?: string[];
};

export function getProjectImageUrls(project: ProjectImageSource) {
  return project.visualImageUrls ?? [];
}
