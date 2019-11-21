import Vue from 'vue';

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

export function anyComponent(node, f) {
  if (!(node instanceof Vue)) {
    // eslint-disable-next-line no-underscore-dangle
    const component = node.__vue__;

    if (component) {
      return anyComponent(component, f);
    }

    if (node.parentNode) {
      return anyComponent(node.parentNode, f);
    }

    return false;
  }

  if (f(node)) {
    return true;
  }

  if (node.$parent === undefined) {
    return false;
  }

  return anyComponent(node.$parent, f);
}
