class GeniaFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                :host {
                    display: block;
                }
                
                footer {
                    background: #0A1128;
                    color: white;
                    padding: 4rem 0 2rem;
                    border-top: 1px solid rgba(212, 175, 55, 0.2);
                }
                
                .container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                    margin-bottom: 3rem;
                }
                
                @media (min-width: 768px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (min-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                    }
                }
                
                .brand-section h3 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .brand-section p {
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    max-width: 300px;
                }
                
                .location {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #D4AF37;
                    font-size: 0.9rem;
                }
                
                .location svg {
                    width: 16px;
                    height: 16px;
                }
                
                .column h4 {
                    color: #D4AF37;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .column ul {
                    list-style: none;
                }
                
                .column li {
                    margin-bottom: 0.75rem;
                }
                
                .column a {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 0.95rem;
                }
                
                .column a:hover {
                    color: #D4AF37;
                }
                
                .bottom-bar {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                    justify-content: space-between;
                }
                
                @media (min-width: 768px) {
                    .bottom-bar {
                        flex-direction: row;
                    }
                }
                
                .copyright {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.9rem;
                }
                
                .socials {
                    display: flex;
                    gap: 1rem;
                }
                
                .socials a {
                    width: 40px;
                    height: 40px;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #D4AF37;
                    transition: all 0.3s ease;
                }
                
                .socials a:hover {
                    background: #D4AF37;
                    color: #0A1128;
                    transform: translateY(-2px);
                }
                
                .socials svg {
                    width: 18px;
                    height: 18px;
                }
                
                .logo-icon {
                    width: 32px;
                    height: 32px;
                    position: relative;
                    display: inline-block;
                }
                
                .logo-g {
                    position: absolute;
                    inset: 0;
                    border: 3px solid #D4AF37;
                    border-radius: 50%;
                    border-right-color: transparent;
                    border-bottom-color: transparent;
                    transform: rotate(-45deg);
                }
                
                .logo-wave {
                    position: absolute;
                    bottom: 8px;
                    right: 4px;
                    width: 12px;
                    height: 12px;
                }
                
                .logo-wave::before,
                .logo-wave::after {
                    content: '';
                    position: absolute;
                    border: 2px solid #00D9FF;
                    border-radius: 50%;
                    border-left-color: transparent;
                    border-top-color: transparent;
                }
                
                .logo-wave::before {
                    width: 12px;
                    height: 12px;
                    transform: rotate(45deg);
                }
                
                .logo-wave::after {
                    width: 8px;
                    height: 8px;
                    top: 2px;
                    left: 2px;
                    transform: rotate(45deg);
                }
            </style>
            
            <footer>
                <div class="container">
                    <div class="footer-grid">
                        <div class="brand-section">
                            <h3>
                                <div class="logo-icon">
                                    <div class="logo-g"></div>
                                    <div class="logo-wave"></div>
                                </div>
                                GENIA
                            </h3>
                            <p>Solutions d'intelligence vocale haut de gamme pour professionnels exigeants. Excellence technologique basée à Strasbourg.</p>
                            <div class="location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Strasbourg, France
                            </div>
                        </div>
                        
                        <div class="column">
                            <h4>Solutions</h4>
                            <ul>
                                <li><a href="#secteurs">Serrurerie</a></li>
                                <li><a href="#secteurs">Coiffure</a></li>
                                <li><a href="#secteurs">Dentaire</a></li>
                                <li><a href="#secteurs">Restauration</a></li>
                                <li><a href="#secteurs">Immobilier</a></li>
                            </ul>
                        </div>
                        
                        <div class="column">
                            <h4>Ressources</h4>
                            <ul>
                                <li><a href="#">Documentation API</a></li>
                                <li><a href="#">Centre d'aide</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Cas clients</a></li>
                            </ul>
                        </div>
                        
                        <div class="column">
                            <h4>Entreprise</h4>
                            <ul>
                                <li><a href="#">À propos</a></li>
                                <li><a href="#">Carrières</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Mentions légales</a></li>
                                <li><a href="#">Confidentialité</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="bottom-bar">
                        <div class="copyright">© 2024 Genia Consulting. Tous droits réservés.</div>
                        <div class="socials">
                            <a href="#" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                            <a href="#" aria-label="Email">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('genia-footer', GeniaFooter);