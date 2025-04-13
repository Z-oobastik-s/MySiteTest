/**
 * Простой роутер для SPA (Single Page Application)
 * @module utils/router
 */

/**
 * Создает экземпляр роутера
 * @param {Object} options - Опции роутера
 * @param {HTMLElement|string} options.container - Элемент или селектор для вставки контента
 * @param {Object} options.routes - Объект с маршрутами и обработчиками
 * @param {Function} options.fallback - Функция для обработки несуществующих маршрутов
 * @param {boolean} options.useHash - Использовать ли hash-роутинг (по умолчанию true)
 * @returns {Object} Инстанс роутера с методами
 */
function createRouter(options = {}) {
    if (!options.container) {
        console.error('Router: не указан контейнер');
        return null;
    }
    
    if (!options.routes || Object.keys(options.routes).length === 0) {
        console.warn('Router: не указаны маршруты');
    }
    
    const container = typeof options.container === 'string' 
        ? document.querySelector(options.container) 
        : options.container;
    
    if (!container) {
        console.error(`Router: контейнер не найден: ${typeof options.container === 'string' ? options.container : '[HTMLElement]'}`);
        return null;
    }
    
    const routes = options.routes || {};
    const fallback = options.fallback || (() => '<div>Страница не найдена</div>');
    const useHash = options.useHash !== undefined ? options.useHash : true;
    
    // Текущий роут
    let currentRoute = '';
    
    /**
     * Обрабатывает изменение маршрута
     * @param {string} route - Новый маршрут
     */
    async function handleRoute(route) {
        // Убираем hash-символ и trailing слэш
        route = route.replace(/^#?\/?/, '/').replace(/\/$/, '') || '/';
        
        // Если роут не изменился, не обрабатываем его повторно
        if (route === currentRoute) return;
        
        // Обновляем текущий роут
        currentRoute = route;
        
        // Проверяем, есть ли такой маршрут
        if (routes[route]) {
            try {
                // Вызываем обработчик маршрута
                const content = await routes[route]();
                container.innerHTML = content;
                
                // Прокручиваем страницу наверх
                window.scrollTo(0, 0);
            } catch (error) {
                console.error(`Router: ошибка при обработке маршрута ${route}:`, error);
                container.innerHTML = fallback();
            }
        } else {
            // Обрабатываем несуществующий маршрут
            container.innerHTML = fallback();
        }
    }
    
    /**
     * Обрабатывает изменение хэша в URL
     */
    function handleHashChange() {
        const hash = window.location.hash || '#/';
        handleRoute(hash);
    }
    
    /**
     * Обрабатывает изменение URL при использовании History API
     * @param {Event} event - Событие popstate
     */
    function handleHistoryChange(event) {
        const path = window.location.pathname;
        handleRoute(path);
    }
    
    /**
     * Инициализирует роутер
     */
    function init() {
        if (useHash) {
            // Слушаем изменение хэша
            window.addEventListener('hashchange', handleHashChange);
            
            // Обрабатываем начальный хэш
            handleHashChange();
        } else {
            // Слушаем изменение истории
            window.addEventListener('popstate', handleHistoryChange);
            
            // Обрабатываем начальный путь
            handleHistoryChange();
            
            // Перехватываем клики по ссылкам
            document.addEventListener('click', (event) => {
                // Проверяем, что это клик по ссылке
                let link = event.target;
                while (link && link.tagName !== 'A') {
                    link = link.parentNode;
                }
                
                if (!link) return;
                
                // Проверяем, что это внутренняя ссылка
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#') || href.includes('mailto:') || href.includes('tel:')) {
                    return;
                }
                
                // Отменяем стандартное поведение
                event.preventDefault();
                
                // Изменяем URL и обрабатываем новый маршрут
                window.history.pushState(null, '', href);
                handleHistoryChange();
            });
        }
    }
    
    /**
     * Перенаправляет на указанный маршрут
     * @param {string} route - Новый маршрут
     */
    function navigate(route) {
        if (useHash) {
            window.location.hash = route.startsWith('#') ? route : `#${route}`;
        } else {
            window.history.pushState(null, '', route);
            handleHistoryChange();
        }
    }
    
    /**
     * Уничтожает роутер, удаляя слушатели событий
     */
    function destroy() {
        if (useHash) {
            window.removeEventListener('hashchange', handleHashChange);
        } else {
            window.removeEventListener('popstate', handleHistoryChange);
        }
    }
    
    // Возвращаем публичные методы роутера
    return {
        init,
        navigate,
        destroy,
        getCurrentRoute: () => currentRoute
    };
}

export { createRouter }; 