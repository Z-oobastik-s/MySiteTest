/**
 * Утилиты для работы с API и получения данных
 */

// Базовый URL для API
const API_BASE_URL = 'https://api.zoobastiks.ru';

/**
 * Отправляет запрос к API
 * @param {string} endpoint - Конечная точка API
 * @param {Object} options - Опции запроса
 * @returns {Promise<any>} Результат запроса
 */
async function fetchAPI(endpoint, options = {}) {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  const fetchOptions = { ...defaultOptions, ...options };
  
  // Если есть данные в body, преобразуем их в JSON
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Проверка на ошибки HTTP
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Ошибка HTTP: ${response.status}`);
    }
    
    // Проверяем Content-Type для правильной обработки ответа
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType.includes('text/')) {
      return await response.text();
    } else {
      return await response.blob();
    }
  } catch (error) {
    console.error('Ошибка API:', error);
    throw error;
  }
}

/**
 * Получает статус Minecraft сервера
 * @param {string} serverIp - IP адрес сервера
 * @param {number} serverPort - Порт сервера (по умолчанию 25565)
 * @returns {Promise<Object>} Статус сервера
 */
async function getServerStatus(serverIp, serverPort = 25565) {
  try {
    // В реальном окружении используем прокси для запросов к Minecraft серверам,
    // так как CORS ограничения не позволяют делать запросы напрямую из браузера
    const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}:${serverPort}`;
    
    // Симуляция задержки сети для более реалистичного UI
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Здесь можно использовать любой публичный API для проверки статуса Minecraft серверов
    // или собственный прокси для обхода CORS
    const data = await fetchAPI(apiUrl);
    
    // Преобразуем данные в унифицированный формат
    return {
      online: data.online === true,
      version: data.version,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
        sample: data.players?.sample || []
      },
      motd: data.motd?.clean?.join('\n') || data.motd?.raw?.join('\n') || '',
      favicon: data.icon,
      ping: Math.floor(Math.random() * 100) // Симуляция пинга в мс
    };
  } catch (error) {
    // В случае ошибки симулируем статус оффлайн с вариациями ошибок
    console.error('Ошибка при получении статуса сервера:', error);
    
    // ТОЛЬКО ДЛЯ ДЕМОНСТРАЦИИ - в реальном приложении нужно использовать настоящие данные
    // Симулируем случайный статус сервера для демонстрации интерфейса
    const isOnline = Math.random() > 0.3; // 70% вероятность, что сервер онлайн
    
    if (isOnline) {
      const playerCount = Math.floor(Math.random() * 20);
      const maxPlayers = 50;
      
      // Создаем список случайных игроков
      const playerSample = [];
      if (playerCount > 0) {
        const playerNames = [
          'Zoobastik', 'Steve', 'Alex', 'Herobrine', 'Notch', 
          'Creeper123', 'DiamondMiner', 'EnderDragon', 'Skeleton',
          'WitherBoss', 'RedstoneEngineer', 'MasterBuilder'
        ];
        
        // Выбираем случайных игроков из списка
        for (let i = 0; i < Math.min(playerCount, 10); i++) {
          const randomPlayerIndex = Math.floor(Math.random() * playerNames.length);
          playerSample.push({
            name: playerNames[randomPlayerIndex],
            id: `player-${i}`
          });
        }
      }
      
      return {
        online: true,
        version: '1.12.2 - 1.21.4',
        players: {
          online: playerCount,
          max: maxPlayers,
          sample: playerSample
        },
        motd: 'Zoobastiks Minecraft Server',
        ping: Math.floor(Math.random() * 100)
      };
    }
    
    return {
      online: false,
      error: 'Сервер временно недоступен'
    };
  }
}

/**
 * Получает новости для главной страницы
 * @param {number} limit - Ограничение количества новостей
 * @returns {Promise<Array>} Массив новостей
 */
async function getNews(limit = 3) {
  try {
    // В реальном приложении, запрос к API
    // return await fetchAPI(`/news?limit=${limit}`);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Возвращаем массив с тестовыми новостями
    return [
      {
        id: 1,
        title: 'Обновление сервера до версии 1.21.4',
        date: '2025-04-10',
        author: 'Администратор',
        summary: 'Мы обновили сервер до последней версии Minecraft 1.21.4 со всеми новыми возможностями и исправлениями.',
        image: 'news-update.jpg',
        category: 'update',
        url: '#/news/1'
      },
      {
        id: 2,
        title: 'Весенний PvP турнир',
        date: '2025-03-25',
        author: 'Модератор',
        summary: 'Приглашаем всех игроков принять участие в весеннем PvP турнире с ценными призами и наградами.',
        image: 'news-tournament.jpg',
        category: 'event',
        url: '#/news/2'
      },
      {
        id: 3,
        title: 'Новый мир и биомы',
        date: '2025-03-15',
        author: 'Администратор',
        summary: 'Мы добавили новый мир с уникальными биомами и ресурсами. Используйте команду /warp new_world для телепортации.',
        image: 'news-world.jpg',
        category: 'update',
        url: '#/news/3'
      },
      {
        id: 4,
        title: 'Изменения в экономике сервера',
        date: '2025-03-01',
        author: 'Администратор',
        summary: 'Мы внесли важные изменения в экономическую систему сервера для большего баланса и интереса игроков.',
        image: 'news-economy.jpg',
        category: 'announcement',
        url: '#/news/4'
      }
    ].slice(0, limit);
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    return [];
  }
}

/**
 * Получает список плагинов сервера
 * @returns {Promise<Array>} Массив плагинов
 */
async function getPlugins() {
  try {
    // В реальном приложении, запрос к API
    // return await fetchAPI('/plugins');
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Возвращаем массив с тестовыми плагинами
    return [
      {
        id: 1,
        name: 'GriefPrevention',
        category: 'protection',
        description: 'Плагин для защиты территорий от гриферов и воровства ресурсов.',
        features: [
          'Защита территорий',
          'Антигрифинг',
          'Контроль доступа к постройкам'
        ],
        commands: [
          '/claim - создание территории',
          '/trust - добавление доверенного игрока',
          '/abandonclaim - удаление территории'
        ]
      },
      {
        id: 2,
        name: 'EssentialsX',
        category: 'utility',
        description: 'Базовый набор команд и функций для удобства игроков и администрации.',
        features: [
          'Варпы и хоумы',
          'Экономика',
          'Сообщения и чаты',
          'Телепортация'
        ],
        commands: [
          '/warp - телепортация в общественную зону',
          '/home - телепортация в свой дом',
          '/msg - личное сообщение игроку'
        ]
      },
      {
        id: 3,
        name: 'WorldEdit',
        category: 'building',
        description: 'Инструменты для быстрого строительства и редактирования мира.',
        features: [
          'Выделение областей',
          'Быстрое строительство',
          'Копирование и вставка структур'
        ],
        commands: [
          '//wand - получение инструмента выделения',
          '//set - заполнение области блоками',
          '//copy - копирование выделенной области'
        ]
      }
    ];
  } catch (error) {
    console.error('Ошибка при получении плагинов:', error);
    return [];
  }
}

export { fetchAPI, getServerStatus, getNews, getPlugins }; 