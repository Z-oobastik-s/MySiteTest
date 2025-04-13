/**
 * Zoobastiks Minecraft Server - Основной JavaScript файл
 * Версия: 1.0.0
 * 2025
 */

// Импорт утилит и вспомогательных функций
import { createComponent, renderComponent, mountComponent } from './utils/component.js';
import { createRouter } from './utils/router.js';
import { fetchAPI, getServerStatus } from './utils/api.js';
import { showNotification, hideNotification } from './utils/notifications.js';
import { setupTheme } from './utils/theme.js';

// Импорт компонентов
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Navigation from './components/Navigation.js';
import HomePage from './components/HomePage.js';
import ServerStatus from './components/ServerStatus.js';
import FeatureList from './components/FeatureList.js';
import GallerySection from './components/GallerySection.js';
import NewsWidget from './components/NewsWidget.js';

// Константы приложения
const APP_CONFIG = {
  serverAddress: 'zoobastiks.20tps.name',
  apiEndpoint: 'https://api.zoobastiks.ru',
  socials: {
    discord: 'https://discord.gg/vEaCqQ7kXN',
    telegram: 'https://t.me/ReZoobastik'
  },
  routes: {
    home: '/',
    wiki: '/wiki',
    voting: '/voting',
    commands: '/commands',
    rules: '/rules',
    news: '/news',
    help: '/help',
    plugins: '/plugins',
    map: '/map'
  }
};

// Состояние приложения (для использования в различных компонентах)
const appState = {
  isLoading: true,
  serverStatus: {
    online: false,
    playerCount: 0,
    maxPlayers: 0,
    version: '1.12.2 - 1.21.4'
  },
  theme: 'dark',
  currentUser: null,
  isAdmin: false,
  notifications: []
};

// Инициализация приложения
async function initApp() {
  console.log('Инициализация приложения Zoobastiks...');
  
  // Инициализация контейнера приложения
  const app = document.getElementById('app');
  if (!app) {
    console.error('Не найден контейнер приложения (#app)');
    return;
  }

  // Установка темы
  setupTheme(appState.theme);
  
  // Получение статуса сервера
  try {
    const serverStatus = await getServerStatus(APP_CONFIG.serverAddress);
    appState.serverStatus = serverStatus;
    console.log('Статус сервера:', serverStatus);
  } catch (error) {
    console.error('Ошибка при получении статуса сервера:', error);
    appState.serverStatus.online = false;
  }

  // Создание компонентов страницы
  const header = createComponent(Header, { title: 'Zoobastiks Minecraft', subtitle: 'Выживание с элементами RPG' });
  const navigation = createComponent(Navigation, { routes: APP_CONFIG.routes, socials: APP_CONFIG.socials });
  const serverStatusWidget = createComponent(ServerStatus, { status: appState.serverStatus, serverIp: APP_CONFIG.serverAddress });
  const footer = createComponent(Footer, { 
    copyrightYear: new Date().getFullYear(),
    socials: APP_CONFIG.socials
  });

  // Создание маршрутизатора для SPA
  const router = createRouter({
    container: app,
    routes: {
      '/': async () => {
        const homePage = createComponent(HomePage);
        const features = createComponent(FeatureList);
        const gallery = createComponent(GallerySection);
        const news = createComponent(NewsWidget, { limit: 3 });
        
        return `
          <div class="home-page">
            ${homePage}
            ${serverStatusWidget}
            ${features}
            ${gallery}
            ${news}
          </div>
        `;
      },
      '/admin': async () => {
        if (!appState.isAdmin) {
          showNotification({
            type: 'error',
            title: 'Доступ запрещен',
            message: 'У вас нет прав для доступа к админ-панели'
          });
          
          window.location.hash = '#/';
          return '';
        }
        
        // Динамическая загрузка админ-панели
        const { default: AdminPanel } = await import('./admin/AdminPanel.js');
        const adminPanel = createComponent(AdminPanel);
        
        return adminPanel;
      }
    },
    fallback: () => {
      return `
        <div class="error-page container">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемая страница не существует.</p>
          <a href="#/" class="btn btn--primary mt-md">На главную</a>
        </div>
      `;
    }
  });

  // Собираем основную структуру приложения
  app.innerHTML = `
    <div class="app-wrapper">
      ${header}
      ${navigation}
      <main class="main">
        <div class="page-content" id="router-view"></div>
      </main>
      ${footer}
    </div>
  `;

  // Инициализация маршрутизатора
  router.init();
  
  // Обработчики событий
  setupEventListeners();

  // Скрываем лоадер и показываем содержимое приложения
  appState.isLoading = false;
  window.dispatchEvent(new CustomEvent('componentsLoaded'));
  
  console.log('Приложение Zoobastiks успешно инициализировано');
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Копирование IP адреса сервера
  document.addEventListener('click', (event) => {
    if (event.target.matches('[data-copy-ip]') || event.target.closest('[data-copy-ip]')) {
      const serverIp = APP_CONFIG.serverAddress;
      navigator.clipboard.writeText(serverIp)
        .then(() => {
          showNotification({
            type: 'success',
            title: 'IP адрес скопирован',
            message: `Адрес ${serverIp} скопирован в буфер обмена`
          });
        })
        .catch(err => {
          console.error('Ошибка при копировании IP:', err);
          showNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось скопировать IP адрес'
          });
        });
    }
  });

  // Переключение темы
  document.addEventListener('click', (event) => {
    if (event.target.matches('[data-toggle-theme]')) {
      appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
      setupTheme(appState.theme);
      
      showNotification({
        type: 'info',
        title: 'Тема изменена',
        message: `Тема оформления изменена на ${appState.theme === 'dark' ? 'тёмную' : 'светлую'}`
      });
    }
  });
  
  // Прокрутка вверх
  document.addEventListener('click', (event) => {
    if (event.target.matches('[data-scroll-top]')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Запуск приложения при полной загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспорт для использования в других модулях
export { appState, APP_CONFIG }; 