/**
 * Утилиты для работы с компонентами веб-приложения
 * @module utils/component
 */

/**
 * Создает HTML-разметку компонента на основе его рендер-функции и опций
 * @param {Function} componentFn - Рендер-функция компонента
 * @param {Object} props - Опции/свойства компонента
 * @returns {string} HTML разметка компонента
 */
function createComponent(componentFn, props = {}) {
    try {
        if (typeof componentFn !== 'function') {
            console.error('Ошибка: componentFn должен быть функцией');
            return '';
        }
        
        return componentFn(props);
    } catch (error) {
        console.error(`Ошибка при создании компонента ${componentFn.name || 'Unknown'}:`, error);
        return `<!-- Ошибка рендеринга компонента: ${error.message} -->`;
    }
}

/**
 * Вставляет компонент в указанный контейнер
 * @param {HTMLElement|string} container - Контейнер или его селектор
 * @param {string} component - HTML разметка компонента
 * @param {string} position - Позиция вставки ('replace', 'append', 'prepend')
 */
function renderComponent(container, component, position = 'replace') {
    try {
        // Получаем ссылку на контейнер по селектору, если передана строка
        const targetContainer = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!targetContainer) {
            console.error(`Контейнер не найден: ${typeof container === 'string' ? container : '[HTMLElement]'}`);
            return;
        }
        
        // Вставляем компонент в зависимости от указанной позиции
        switch (position) {
            case 'replace':
                targetContainer.innerHTML = component;
                break;
            case 'append':
                targetContainer.insertAdjacentHTML('beforeend', component);
                break;
            case 'prepend':
                targetContainer.insertAdjacentHTML('afterbegin', component);
                break;
            default:
                console.warn(`Неизвестная позиция вставки: ${position}, используем 'replace'`);
                targetContainer.innerHTML = component;
        }
    } catch (error) {
        console.error('Ошибка при рендеринге компонента:', error);
    }
}

/**
 * Создает компонент и монтирует его в указанный контейнер
 * @param {Function} componentFn - Рендер-функция компонента
 * @param {Object} props - Опции/свойства компонента
 * @param {HTMLElement|string} container - Контейнер или его селектор
 * @param {string} position - Позиция вставки ('replace', 'append', 'prepend')
 * @returns {string} HTML разметка компонента
 */
function mountComponent(componentFn, props = {}, container, position = 'replace') {
    const component = createComponent(componentFn, props);
    renderComponent(container, component, position);
    return component;
}

/**
 * Создает компонент и добавляет обработчики событий
 * @param {Function} componentFn - Рендер-функция компонента
 * @param {Object} props - Опции/свойства компонента
 * @param {Function} eventHandlerFn - Функция, добавляющая обработчики событий
 * @param {HTMLElement|string} container - Контейнер или его селектор
 * @param {string} position - Позиция вставки ('replace', 'append', 'prepend')
 */
function createAndBindComponent(componentFn, props = {}, eventHandlerFn, container, position = 'replace') {
    // Создаем и монтируем компонент
    mountComponent(componentFn, props, container, position);
    
    // Добавляем обработчики событий, если указана функция
    if (typeof eventHandlerFn === 'function') {
        eventHandlerFn(props);
    }
}

export {
    createComponent,
    renderComponent,
    mountComponent,
    createAndBindComponent
}; 