class SectorCard extends HTMLElement {
    static get observedAttributes() {
        return ['image', 'title', 'description', 'icon'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    getIconSvg(iconName) {
        const icons = {
            'unlock': '<path d="M17 11H7a5 5 0 0 0-5 5v4h20v-4a5 5 0 0 0-5-5zm-5-7a3 3 0 0 1 3 3v4H9