function dist(a, b) {
  const dX = b.x - a.x;
  const dY = b.y - a.y;
  return dX * dX + dY * dY;
}

export default {
  install(Vue) {
    Vue.directive('closable', {
      bind(element, binding) {
        let multiTouch = false;
        let touchStartPosition = null;

        element.handleOutsideTouchStart = (e) => {
          multiTouch = e.touches.length > 1;
          touchStartPosition = { x: e.touches[0].screenX, y: e.touches[0].screenY };
        };
        element.handleOutsideClick = (e) => {
          let pos;
          if (e.touches) {
            pos = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
          } else {
            pos = { x: e.screenX, y: e.screenY };
          }

          if (multiTouch || (touchStartPosition !== null && dist(pos, touchStartPosition) > 100)) {
            return;
          }

          e.stopPropagation();
          const { handler, exclude } = binding.value;

          const clickedOnExcludedEl = (exclude || (() => false))(e.target);
          if (!element.contains(e.target) && !clickedOnExcludedEl) {
            handler();
          }
        };

        document.addEventListener('click', element.handleOutsideClick);
        document.addEventListener('touchstart', element.handleOutsideTouchStart);
        document.addEventListener('touchend', element.handleOutsideClick);
      },
      unbind(element) {
        document.removeEventListener('click', element.handleOutsideClick);
        document.removeEventListener('touchstart', element.handleOutsideTouchStart);
        document.removeEventListener('touchend', element.handleOutsideClick);
      },
    });
  },
};
