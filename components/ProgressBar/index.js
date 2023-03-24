const template = document.createElement('template');
template.setAttribute('id', 'progress-bar-template');

template.innerHTML = `<style>
  :host {
    display: block;
  }
  #bar {
    width: 0;
    height: 20px;
    background-color: #2196f3;
  }
  #container {
    width: 100%;
    height: 20px;
    border: 1px solid #ccc;
  }
  #progress-info {
    margin-top: 10px;
    font-size: 14px;
  }
  button {
    margin-top: 30px;
    padding: 5px;
    background-color: #4caf50;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>
<div id="container">
  <div id="bar"></div>
  <div id="progress-info">0%</div>
</div>
<button id="btn">Start/Stop</button>`;

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.bar = this.shadowRoot.querySelector('#bar');
    this.progressInfo = this.shadowRoot.querySelector('#progress-info');
    this.btn = this.shadowRoot.querySelector('#btn');
    this.btn.addEventListener('click', this.toggleAnimation.bind(this));
    this.play = true;
    this.progress = 0;
    this.progressPercentage = 1;
    this.framesPerSecond = 10;
    this.timer = null;
  }

  connectedCallback() {
    requestAnimationFrame(this.animate.bind(this));
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.animationFrame);
  }

  animate() {
    this.timer = setTimeout(() => {
      if (this.progress < 100 && this.play) {
        this.progress += this.progressPercentage;
        this.bar.style.width = `${this.progress}%`;
        this.progressInfo.innerText = `Loading: ${Math.round(this.progress)}%`;
      } else if (this.progress >= 100 && this.play) {
        this.play = false;
        this.disconnectedCallback();
      } else if (!this.progress && this.play) {
        this.bar.style.width = '0';
      }

      if (this.play) {
        this.connectedCallback();
      }
    }, 1000 / this.framesPerSecond);
  }

  toggleAnimation() {
    if (this.play) {
      this.play = false;
      this.disconnectedCallback();
      clearTimeout(this.timer);
    } else {
      this.play = true;
      this.animate();
    }
  }
}

customElements.define('progress-bar', ProgressBar);
