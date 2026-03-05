export function getBadgePagePath(username: string): string {
  return `/u/${username}/badge`;
}

export function getBadgeImagePath(username: string): string {
  return `/u/${username}/badge/image`;
}
