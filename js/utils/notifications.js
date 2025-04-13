/**
 * Модуль для работы с всплывающими уведомлениями
 * @module utils/notifications
 */

/**
 * Отображает всплывающее уведомление
 * @param {Object} options - Опции уведомления
 * @param {string} options.type - Тип уведомления: success, error, warning, info
 * @param {string} options.title - Заголовок уведомления
 * @param {string} options.message - Текст уведомления
 * @param {number} options.duration - Длительность показа в миллисекундах (по умолчанию 5000)
 * @returns {HTMLElement} Созданный элемент уведомления
 */
function showNotification(options) {
    // Проверка обязательных параметров
    if (!options || !options.message) {
        console.error('Для уведомления требуется указать message');
        return null;
    }
    
    // Установка параметров по умолчанию
    const type = options.type || 'info';
    const title = options.title || '';
    const message = options.message;
    const duration = options.duration || 5000;
    
    // Получаем контейнер для уведомлений
    let container = document.getElementById('notification-container');
    
    // Создаем контейнер, если он не существует
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Добавляем иконку в зависимости от типа
    let iconClass = '';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            iconClass = 'fas fa-info-circle';
            break;
    }
    
    // Формируем содержимое уведомления
    notification.innerHTML = `
        <div class="notification__icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification__content">
            ${title ? `<h4 class="notification__title">${title}</h4>` : ''}
            <p class="notification__message">${message}</p>
        </div>
        <button class="notification__close" aria-label="Закрыть">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Добавляем уведомление в контейнер
    container.appendChild(notification);
    
    // Добавляем анимацию появления (после добавления в DOM)
    setTimeout(() => {
        notification.classList.add('notification--visible');
    }, 10);
    
    // Настраиваем обработчик для закрытия уведомления
    const closeButton = notification.querySelector('.notification__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    // Автоматическое скрытие через указанное время
    const timeoutId = setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    // Сохраняем ID таймера для возможной отмены
    notification.dataset.timeoutId = timeoutId;
    
    // Приостанавливаем автоматическое скрытие при наведении мыши
    notification.addEventListener('mouseenter', () => {
        if (notification.dataset.timeoutId) {
            clearTimeout(parseInt(notification.dataset.timeoutId));
        }
    });
    
    // Возобновляем автоматическое скрытие при уходе мыши
    notification.addEventListener('mouseleave', () => {
        const newTimeoutId = setTimeout(() => {
            hideNotification(notification);
        }, duration / 2); // Сокращаем время до половины при возобновлении
        notification.dataset.timeoutId = newTimeoutId;
    });
    
    return notification;
}

/**
 * Скрывает уведомление
 * @param {HTMLElement} notification - Элемент уведомления
 */
function hideNotification(notification) {
    if (!notification) return;
    
    // Отменяем таймер автоматического скрытия
    if (notification.dataset.timeoutId) {
        clearTimeout(parseInt(notification.dataset.timeoutId));
    }
    
    // Начинаем анимацию скрытия
    notification.classList.remove('notification--visible');
    notification.classList.add('notification--hiding');
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300); // Время должно соответствовать CSS анимации
}

/**
 * Скрывает все уведомления
 */
function hideAllNotifications() {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notifications = container.querySelectorAll('.notification');
    notifications.forEach(notification => {
        hideNotification(notification);
    });
}

export { showNotification, hideNotification, hideAllNotifications }; 