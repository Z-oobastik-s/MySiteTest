/**
 * Главный JavaScript файл
 */

import { ServerStatus } from './components/ServerStatus.js';

// DOM загружен
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация компонента статуса сервера
  const serverStatusContainer = document.getElementById('server-status-container');
  if (serverStatusContainer) {
    const serverStatus = new ServerStatus(serverStatusContainer);
    serverStatus.init();
  }

  // Инициализация мобильного меню
  initMobileMenu();
  
  // Инициализация кнопки прокрутки вверх
  initScrollToTopButton();
});

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Закрытие меню при клике по ссылке
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }
}

/**
 * Инициализация кнопки прокрутки вверх
 */
function initScrollToTopButton() {
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  if (scrollToTopBtn) {
    // Показывать кнопку, когда пользователь прокручивает страницу вниз
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    // Плавная прокрутка вверх при клике на кнопку
    scrollToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
} 