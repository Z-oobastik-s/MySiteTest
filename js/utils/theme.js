/**
 * Утилиты для управления темой оформления
 * @module utils/theme
 */

// Ключ для хранения выбранной темы в localStorage
const THEME_STORAGE_KEY = 'zoobastiks-theme';

// Доступные темы
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

/**
 * Устанавливает тему оформления
 * @param {string} theme - Название темы ('light', 'dark', 'system')
 */
function setupTheme(theme = 'system') {
    // Проверка на валидную тему
    if (!Object.values(THEMES).includes(theme)) {
        console.warn(`Неизвестная тема: ${theme}. Используем системную тему.`);
        theme = THEMES.SYSTEM;
    }
    
    // Определение итоговой темы (light или dark)
    let actualTheme = theme;
    
    // Если выбрана системная тема, определяем ее на основе предпочтений пользователя
    if (theme === THEMES.SYSTEM) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        actualTheme = prefersDarkScheme ? THEMES.DARK : THEMES.LIGHT;
    }
    
    // Устанавливаем атрибут data-theme на документ
    document.documentElement.setAttribute('data-theme', actualTheme);
    
    // Сохраняем выбор пользователя
    if (theme !== THEMES.SYSTEM) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    
    // Добавляем и удаляем стилевые классы
    if (actualTheme === THEMES.DARK) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
    
    // Обновляем мета-тег theme-color для мобильных браузеров
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    // Устанавливаем цвет в зависимости от темы
    metaThemeColor.content = actualTheme === THEMES.DARK ? '#121212' : '#ffffff';
    
    return actualTheme;
}

/**
 * Переключает текущую тему между светлой и темной
 * @returns {string} Новая тема
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    
    setupTheme(newTheme);
    return newTheme;
}

/**
 * Получает текущую активную тему
 * @returns {string} Текущая тема
 */
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
}

/**
 * Получает сохраненную пользователем тему
 * @returns {string} Сохраненная тема или 'system' если не найдена
 */
function getSavedTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || THEMES.SYSTEM;
}

/**
 * Инициализирует тему при загрузке приложения
 */
function initTheme() {
    // Получаем сохраненную тему
    const savedTheme = getSavedTheme();
    
    // Устанавливаем тему
    setupTheme(savedTheme);
    
    // Настраиваем отслеживание изменений системной темы
    if (savedTheme === THEMES.SYSTEM) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
            setupTheme(newTheme);
        });
    }
}

// Экспортируем функции и константы
export {
    setupTheme,
    toggleTheme,
    getCurrentTheme,
    getSavedTheme,
    initTheme,
    THEMES
}; 