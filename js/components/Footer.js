/**
 * Компонент Footer - нижняя часть сайта
 */
import { defineComponent } from '../utils/component.js';

const Footer = defineComponent({
  // Метод рендеринга компонента
  render() {
    const currentYear = new Date().getFullYear();
    
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__content">
            <div class="footer__info">
              <div class="footer__logo">
                <img src="images/logo.png" alt="Zoobastiks Logo" width="40" height="40">
                <span>Zoobastiks</span>
              </div>
              <p class="footer__description">
                Увлекательный мир Minecraft с уникальными возможностями и дружелюбным комьюнити
              </p>
            </div>
            
            <div class="footer__links">
              <div class="footer__column">
                <h3 class="footer__column-title">Сервер</h3>
                <ul class="footer__list">
                  <li><a href="#rules" class="footer__link">Правила</a></li>
                  <li><a href="#commands" class="footer__link">Команды</a></li>
                  <li><a href="#plugins" class="footer__link">Плагины</a></li>
                  <li><a href="#voting" class="footer__link">Голосование</a></li>
                </ul>
              </div>
              
              <div class="footer__column">
                <h3 class="footer__column-title">Помощь</h3>
                <ul class="footer__list">
                  <li><a href="#help" class="footer__link">Помощь игрокам</a></li>
                  <li><a href="#wiki" class="footer__link">Wiki</a></li>
                  <li><a href="#faq" class="footer__link">Часто задаваемые вопросы</a></li>
                </ul>
              </div>
              
              <div class="footer__column">
                <h3 class="footer__column-title">Сообщество</h3>
                <ul class="footer__list footer__list--social">
                  <li>
                    <a href="#" class="footer__social-link" target="_blank" rel="noopener" aria-label="Discord">
                      <svg class="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="footer__social-link" target="_blank" rel="noopener" aria-label="Telegram">
                      <svg class="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="footer__social-link" target="_blank" rel="noopener" aria-label="VK">
                      <svg class="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.694-1.254.694-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.983 4 8.52c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.847 2.59 2.268 4.863 2.861 4.863.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.56 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.373-.491.712-.491h1.744c.526 0 .644.27.526.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="footer__bottom">
            <p class="footer__copyright">
              © ${currentYear} <a href="#" class="footer__link footer__link--brand">Zoobastiks</a>. Все права защищены.
            </p>
            <p class="footer__legal">
              Minecraft является торговой маркой Mojang Studios. Мы не связаны с Mojang AB.
            </p>
          </div>
        </div>
      </footer>
    `;
  },
  
  // Метод, вызываемый после монтирования компонента в DOM
  onCreate(element) {
    // Сохраняем ссылку на элемент
    this.element = element;
    
    // Добавляем обработчики событий для ссылок в футере
    const footerLinks = element.querySelectorAll('.footer__link');
    footerLinks.forEach(link => {
      // Исключаем внешние ссылки (которые не начинаются с #)
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', this.handleLinkClick);
      }
    });
  },
  
  // Обработчик клика по ссылке в футере
  handleLinkClick(event) {
    const href = event.currentTarget.getAttribute('href');
    
    // Если это хэш-ссылка, используем её для навигации
    if (href.startsWith('#')) {
      // Плавно прокручиваем к секции, если она на текущей странице
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },
  
  // Метод для очистки ресурсов при удалении компонента
  onDestroy() {
    // Удаляем обработчики событий, если они были добавлены
    const footerLinks = this.element.querySelectorAll('.footer__link');
    footerLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.removeEventListener('click', this.handleLinkClick);
      }
    });
  }
});

// Экспортируем компонент
export default Footer; 