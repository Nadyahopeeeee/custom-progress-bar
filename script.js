class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      document.importNode(document.querySelector('#progress-bar-template').content, true),
    );
    this.bar = this.shadowRoot.querySelector('#bar');
    this.progressInfo = this.shadowRoot.querySelector('#progress-info');
    this.btn = this.shadowRoot.querySelector('#btn');
    this.btn.addEventListener('click', this.toggleAnimation.bind(this));
    this.play = true;
    this.speed = 1;
    this.progress = 0;
    this.framesPerSecond = 10;
  }

  connectedCallback() {
    requestAnimationFrame(this.animate.bind(this));
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.animationFrame);
  }

  animate() {
    setTimeout(() => {
      if (this.progress < 100 && this.play) {
        this.progress += this.speed;
        this.bar.style.width = `${this.progress}%`;
        this.progressInfo.innerText = `Loading: ${Math.round(this.progress)}%`;
      } else if (this.progress >= 100 && this.play) {
        this.play = false;
        this.disconnectedCallback();
      } else if (!this.progress && this.play) {
        this.bar.style.width = '0';
      }

      if (this.play) {
        requestAnimationFrame(this.animate.bind(this));
      }
    }, 1000 / this.framesPerSecond);
  }

  toggleAnimation() {
    if (this.play) {
      this.play = false;
      cancelAnimationFrame(this.animationFrame);
    } else {
      this.play = true;
      this.animate();
    }
  }
}

customElements.define('progress-bar', ProgressBar);
