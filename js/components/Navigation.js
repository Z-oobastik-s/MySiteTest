/**
 * Компонент Navigation - главное меню сайта
 */
import { defineComponent } from '../utils/component.js';
import { navigate } from '../utils/router.js';

// Создаем компонент навигации
const Navigation = defineComponent({
  // Начальное состояние компонента
  initialState: {
    isOpen: false,
    activeRoute: window.location.hash || '#home'
  },
  
  // Метод рендеринга компонента
  render(props) {
    const { routes = [] } = props;
    const { isOpen, activeRoute } = this.state;
    
    // Формируем элементы меню на основе переданных маршрутов
    const menuItems = routes.map(route => {
      const isActive = activeRoute === route.path;
      return `
        <li class="nav__item">
          <a href="${route.path}" 
             class="nav__link ${isActive ? 'nav__link--active' : ''}" 
             data-route="${route.path}">
            <span class="nav__icon">${route.icon || ''}</span>
            <span class="nav__text">${route.title}</span>
          </a>
        </li>
      `;
    }).join('');
    
    return `
      <nav class="nav ${isOpen ? 'nav--open' : ''}" id="main-nav">
        <div class="container">
          <div class="nav__container">
            <button type="button" class="nav__toggle" id="nav-toggle" aria-label="Переключить меню">
              <span class="nav__toggle-icon"></span>
            </button>
            
            <ul class="nav__list">
              ${menuItems}
            </ul>
            
            <div class="nav__actions">
              <div class="server-status" data-server-status>
                <span class="server-status__indicator"></span>
                <span class="server-status__text">Проверка статуса...</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  },
  
  // Метод, вызываемый после монтирования компонента в DOM
  onCreate(element) {
    // Сохраняем ссылку на элемент
    this.element = element;
    
    // Добавляем обработчики событий
    this.setupEventListeners();
    
    // Слушаем изменения хэша для обновления активного пункта меню
    window.addEventListener('hashchange', this.handleRouteChange.bind(this));
  },
  
  // Настройка обработчиков событий
  setupEventListeners() {
    // Переключение мобильного меню
    const toggleBtn = this.element.querySelector('#nav-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', this.toggleMenu.bind(this));
    }
    
    // Обработка кликов по ссылкам меню
    const navLinks = this.element.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  },
  
  // Обработчик клика по ссылке
  handleLinkClick(event) {
    const link = event.currentTarget;
    const route = link.getAttribute('data-route');
    
    // Обновляем активный маршрут
    this.setState({ activeRoute: route });
    
    // Закрываем мобильное меню
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
    
    // Используем navigate из router.js для программной навигации
    navigate(route);
    
    // Предотвращаем стандартное поведение ссылки
    event.preventDefault();
  },
  
  // Обработчик изменения маршрута
  handleRouteChange() {
    const newRoute = window.location.hash || '#home';
    
    // Обновляем активный маршрут
    this.setState({ activeRoute: newRoute });
    
    // Обновляем классы активных ссылок
    const navLinks = this.element.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === newRoute) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  },
  
  // Переключение состояния мобильного меню
  toggleMenu() {
    this.setState({ isOpen: !this.state.isOpen });
    
    // Применяем класс к элементу навигации
    this.element.classList.toggle('nav--open', this.state.isOpen);
    
    // Блокируем прокрутку страницы при открытом меню
    document.body.classList.toggle('no-scroll', this.state.isOpen);
  },
  
  // Обработчик клика вне меню
  handleOutsideClick(event) {
    if (this.state.isOpen && this.element && !this.element.contains(event.target)) {
      this.setState({ isOpen: false });
      this.element.classList.remove('nav--open');
      document.body.classList.remove('no-scroll');
    }
  },
  
  // Обновление состояния сервера
  updateServerStatus(status) {
    const statusElement = this.element.querySelector('[data-server-status]');
    if (!statusElement) return;
    
    const indicator = statusElement.querySelector('.server-status__indicator');
    const text = statusElement.querySelector('.server-status__text');
    
    if (status.online) {
      statusElement.classList.add('server-status--online');
      statusElement.classList.remove('server-status--offline');
      indicator.classList.add('server-status__indicator--online');
      text.textContent = `Онлайн: ${status.players.online}/${status.players.max}`;
    } else {
      statusElement.classList.add('server-status--offline');
      statusElement.classList.remove('server-status--online');
      indicator.classList.remove('server-status__indicator--online');
      text.textContent = 'Сервер недоступен';
    }
  },
  
  // Метод для очистки ресурсов при удалении компонента
  onDestroy() {
    window.removeEventListener('hashchange', this.handleRouteChange.bind(this));
    
    // Удаляем обработчик клика вне меню
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
    
    // Убираем блокировку прокрутки, если она была
    document.body.classList.remove('no-scroll');
  }
});

// Экспортируем компонент
export default Navigation; 