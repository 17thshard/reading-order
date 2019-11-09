export function mod(a, b) {
  return ((a % b) + b) % b;
}

export function normalizeAngle(angle) {
  return mod(angle, 360);
}

export function angleDifference(a, b) {
  return mod(b - a + 180, 360) - 180;
}

export function quadrant(angle) {
  return Math.floor(angle / 90);
}
