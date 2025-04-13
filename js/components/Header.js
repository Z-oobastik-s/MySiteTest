/**
 * Компонент Header - шапка сайта
 */
import { defineComponent } from '../utils/component.js';

// Создаем компонент с использованием функции defineComponent
const Header = defineComponent({
  // Начальное состояние компонента
  initialState: {
    isScrolled: false
  },
  
  // Метод рендеринга компонента
  render(props) {
    const { title = 'Zoobastiks Minecraft', subtitle = 'Выживание с элементами RPG' } = props;
    
    return `
      <header class="header" id="header">
        <div class="header__background">
          <div class="header__overlay"></div>
          <div class="header__stars"></div>
        </div>
        
        <div class="container">
          <div class="header__content">
            <div class="header__logo-container">
              <img src="icon/logo.png" alt="Zoobastiks Logo" class="header__logo">
              <div class="header__titles">
                <h1 class="header__title">${title}</h1>
                <p class="header__subtitle">${subtitle}</p>
              </div>
            </div>
            
            <div class="header__actions">
              <button type="button" class="btn btn--primary" data-copy-ip>
                <span class="btn__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </span>
                <span>Скопировать IP</span>
              </button>
              
              <button type="button" class="btn btn--secondary" data-toggle-theme>
                <span class="btn__icon" data-theme-icon="dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </span>
                <span class="btn__icon hidden" data-theme-icon="light">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </span>
                <span data-theme-text>Тёмная тема</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  },
  
  // Метод, вызываемый после монтирования компонента в DOM
  onCreate(element) {
    // Ссылка на элемент компонента
    this.element = element;
    
    // Добавляем обработчик прокрутки страницы
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Вызываем обработчик для инициализации состояния
    this.handleScroll();
    
    // Добавляем анимацию для звезд
    this.initStarsAnimation();
  },
  
  // Обработчик события прокрутки
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrolled = scrollTop > 50;
    
    // Обновляем состояние только если оно изменилось
    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled });
      
      // Добавляем или убираем класс для компактного отображения хедера
      if (this.element) {
        this.element.classList.toggle('header--compact', isScrolled);
      }
    }
  },
  
  // Инициализация анимации звезд
  initStarsAnimation() {
    const starsContainer = this.element.querySelector('.header__stars');
    if (!starsContainer) return;
    
    // Создаем звезды
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Рассчитываем случайные позиции и размеры
      const size = Math.random() * 3 + 1; // от 1 до 4px
      const left = Math.random() * 100; // от 0 до 100%
      const top = Math.random() * 100; // от 0 до 100%
      const animationDelay = Math.random() * 3; // от 0 до 3s
      
      // Применяем стили
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      star.style.animationDelay = `${animationDelay}s`;
      
      // Добавляем звезду в контейнер
      starsContainer.appendChild(star);
    }
  },
  
  // Метод для очистки ресурсов при удалении компонента
  onDestroy() {
    // Удаляем обработчик прокрутки
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
});

// Экспортируем компонент
export default Header; 