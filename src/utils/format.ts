/** 9.5 -> "9 hr 30 min", 11 -> "11 hr" */
export function formatRuntime(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  if (minutes === 0) return `${whole} hr`;
  if (whole === 0) return `${minutes} min`;
  return `${whole} hr ${minutes} min`;
}
