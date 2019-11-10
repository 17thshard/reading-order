<script>
export default {
  name: 'Tooltip',
  abstract: true,
  props: {
    text: String,
    options: Object,
    popperOptions: Object,
    followMouse: {
      type: Boolean,
      default: () => false,
    },
    disabled: Boolean,
  },
  render() {
    try {
      this.$slots.default[0].data.directives = this.$slots.default[0].data.directives || [];
      if (!this.disabled) {
        this.$slots.default[0].data.directives.push({
          name: 'tooltip',
          value: {
            content: this.text,
            ...this.options,
            popperOptions: { ...(this.popperOptions || {}), onCreate: this.onPopperCreate },
          },
        });
      }
      return this.$slots.default[0];
    } catch (e) {
      throw new Error('Tooltip can only render one, and exactly one child component.');
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.followMouse) {
        this.$slots.default[0].elm.addEventListener('mouseover', this.onMouseOver);
      }
    });
  },
  updated() {
    this.setupPopper();
    this.$nextTick(() => {
      const child = this.$slots.default[0].elm;
      if (this.followMouse) {
        child.addEventListener('mouseover', this.onMouseOver);
      } else {
        child.removeEventListener('mouseover', this.onMouseOver);
      }
    });
  },
  methods: {
    onPopperCreate({ instance }) {
      this.popper = instance;
      if (this.referenceElement === undefined) {
        this.referenceElement = instance.reference;
      }
      this.setupPopper();
    },
    setupPopper() {
      if (this.popper === undefined) {
        return;
      }

      if (this.followMouse) {
        this.popper.reference = {
          getBoundingClientRect: () => ({
            top: this.mousePos.pageY,
            right: this.mousePos.pageX,
            bottom: this.mousePos.pageY,
            left: this.mousePos.pageX,
            width: 0,
            height: 0,
          }),
          clientWidth: 0,
          clientHeight: 0,
        };
      } else {
        this.popper.reference = this.referenceElement;
      }
      this.popper.update();
    },
    onMouseOver({ pageX, pageY }) {
      this.mousePos = { pageX, pageY };
      if (this.popper) {
        this.popper.scheduleUpdate();
      }
    },
  },
};
</script>

<style lang="scss">
.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: rgba(0, 0, 0, 0.7);
    color: #b4b4b4;
    border-radius: 0.25rem;
    padding: 0.5rem;
    max-width: 20rem;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>
