/**
 * ServerStatusWidget - компонент для отображения статуса сервера Minecraft на главной странице
 * @module components/ServerStatusWidget
 */

import { getServerStatus } from '../utils/api.js';
import { showNotification } from '../utils/notifications.js';

/**
 * Создает компонент статуса сервера
 * @param {Object} props - Параметры компонента
 * @param {string} props.serverAddress - IP адрес сервера
 * @param {number} props.refreshInterval - Интервал автообновления в секундах (по умолчанию 60)
 * @returns {string} HTML разметка компонента
 */
function ServerStatusWidget(props = {}) {
    const serverAddress = props.serverAddress || 'zoobastiks.20tps.name';
    const refreshInterval = props.refreshInterval || 60;
    
    // Уникальный ID для компонента
    const componentId = 'server-status-' + Math.random().toString(36).substring(2, 9);
    
    // Разметка компонента
    return `
        <div class="server-status server-status--loading" id="${componentId}">
            <div class="server-status__header">
                <i class="server-status__header-icon fas fa-server"></i>
                <h3 class="server-status__header-title">Статус сервера</h3>
                <button class="server-status__refresh-btn" data-refresh title="Обновить статус">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            
            <div class="server-status__content">
                <div class="server-status__server-info">
                    <div class="server-status__row">
                        <span class="server-status__label">Адрес:</span>
                        <div class="server-status__value-container">
                            <span class="server-status__value server-status__address">
                                ${serverAddress}
                            </span>
                            <button class="server-status__copy-btn" data-copy-ip title="Скопировать IP">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="server-status__row">
                        <span class="server-status__label">Статус:</span>
                        <span class="server-status__value server-status__status-value">
                            <span class="server-status__indicator"></span>
                            <span class="server-status__status-text">Проверка...</span>
                        </span>
                    </div>
                    
                    <div class="server-status__row">
                        <span class="server-status__label">Версия:</span>
                        <span class="server-status__value server-status__version-value">--</span>
                    </div>
                    
                    <div class="server-status__row">
                        <span class="server-status__label">Игроки:</span>
                        <span class="server-status__value server-status__player-count">0/0</span>
                    </div>
                </div>
                
                <div class="server-status__player-info" style="display: none;">
                    <h4 class="server-status__subtitle">Сейчас на сервере:</h4>
                    <div class="server-status__player-list"></div>
                </div>
                
                <div class="server-status__error-message" style="display: none;">
                    Сервер временно недоступен
                </div>
                
                <div class="server-status__footer">
                    <span class="server-status__last-refresh">
                        Последнее обновление: --:--:--
                    </span>
                </div>
            </div>
            
            <div class="server-status__notification">
                IP скопирован в буфер обмена
            </div>
        </div>
    `;
}

/**
 * Инициализирует компонент после его добавления в DOM
 * @param {string} containerId - ID контейнера компонента
 * @param {Object} props - Параметры компонента
 */
function initServerStatusWidget(containerId, props = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const serverAddress = props.serverAddress || 'zoobastiks.20tps.name';
    let refreshTimer = null;
    
    // Обновление статуса сервера
    async function updateServerStatus() {
        try {
            // Получаем статус через API
            const statusData = await getServerStatus(serverAddress);
            updateUI(statusData);
        } catch (error) {
            console.error('Ошибка при получении статуса сервера:', error);
            updateErrorUI(error.message);
        }
        
        updateLastRefreshTime();
    }
    
    // Обновление интерфейса при успешном получении данных
    function updateUI(data) {
        // Удаляем классы состояния
        container.classList.remove('server-status--loading', 'server-status--error', 'server-status--offline');
        
        // Проверяем статус
        if (data.online) {
            container.classList.add('server-status--online');
            
            // Обновляем текст статуса
            const statusText = container.querySelector('.server-status__status-text');
            if (statusText) statusText.textContent = 'Онлайн';
            
            // Обновляем данные о версии
            const versionElement = container.querySelector('.server-status__version-value');
            if (versionElement) versionElement.textContent = data.version || '1.12.2 - 1.21.4';
            
            // Обновляем количество игроков
            const playerCountElement = container.querySelector('.server-status__player-count');
            if (playerCountElement) {
                playerCountElement.textContent = `${data.players?.online || 0}/${data.players?.max || 0}`;
            }
            
            // Обновляем список игроков
            updatePlayerList(data.players?.sample || []);
            
            // Показываем информацию об игроках
            const playerInfo = container.querySelector('.server-status__player-info');
            if (playerInfo) playerInfo.style.display = 'block';
            
            // Скрываем сообщение об ошибке
            const errorMessage = container.querySelector('.server-status__error-message');
            if (errorMessage) errorMessage.style.display = 'none';
        } else {
            updateOfflineUI();
        }
    }
    
    // Обновление интерфейса при отсутствии соединения с сервером
    function updateOfflineUI() {
        // Устанавливаем класс offline
        container.classList.remove('server-status--loading', 'server-status--online', 'server-status--error');
        container.classList.add('server-status--offline');
        
        // Обновляем текст статуса
        const statusText = container.querySelector('.server-status__status-text');
        if (statusText) statusText.textContent = 'Оффлайн';
        
        // Скрываем информацию об игроках
        const playerInfo = container.querySelector('.server-status__player-info');
        if (playerInfo) playerInfo.style.display = 'none';
        
        // Показываем сообщение об ошибке
        const errorMessage = container.querySelector('.server-status__error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Сервер временно недоступен';
            errorMessage.style.display = 'block';
        }
    }
    
    // Обновление интерфейса при ошибке
    function updateErrorUI(errorText) {
        // Устанавливаем класс error
        container.classList.remove('server-status--loading', 'server-status--online', 'server-status--offline');
        container.classList.add('server-status--error');
        
        // Обновляем текст статуса
        const statusText = container.querySelector('.server-status__status-text');
        if (statusText) statusText.textContent = 'Ошибка';
        
        // Скрываем информацию об игроках
        const playerInfo = container.querySelector('.server-status__player-info');
        if (playerInfo) playerInfo.style.display = 'none';
        
        // Показываем сообщение об ошибке
        const errorMessage = container.querySelector('.server-status__error-message');
        if (errorMessage) {
            errorMessage.textContent = errorText || 'Произошла ошибка при получении статуса сервера';
            errorMessage.style.display = 'block';
        }
    }
    
    // Обновление списка игроков
    function updatePlayerList(players) {
        const playerList = container.querySelector('.server-status__player-list');
        if (!playerList) return;
        
        // Очищаем текущий список
        playerList.innerHTML = '';
        
        // Если нет игроков или пустой массив
        if (!players || players.length === 0) {
            playerList.innerHTML = '<div class="server-status__empty-list">Нет игроков в сети</div>';
            return;
        }
        
        // Добавляем игроков в список
        players.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'server-status__player-item';
            
            const playerAvatar = document.createElement('div');
            playerAvatar.className = 'server-status__player-avatar';
            playerAvatar.innerHTML = '<i class="fas fa-user"></i>';
            
            const playerName = document.createElement('div');
            playerName.className = 'server-status__player-name';
            playerName.textContent = player.name || player;
            
            playerItem.appendChild(playerAvatar);
            playerItem.appendChild(playerName);
            playerList.appendChild(playerItem);
        });
    }
    
    // Обновление времени последнего обновления
    function updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const lastRefreshElement = container.querySelector('.server-status__last-refresh');
        if (lastRefreshElement) {
            lastRefreshElement.textContent = `Последнее обновление: ${timeString}`;
        }
    }
    
    // Показать уведомление о копировании
    function showCopyNotification() {
        const notification = container.querySelector('.server-status__notification');
        if (!notification) return;
        
        notification.classList.add('server-status__notification--visible');
        
        setTimeout(() => {
            notification.classList.remove('server-status__notification--visible');
        }, 2000);
    }
    
    // Настройка автообновления
    function setupAutoRefresh() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
        
        if (props.refreshInterval !== 0) {
            const interval = (props.refreshInterval || 60) * 1000;
            refreshTimer = setInterval(updateServerStatus, interval);
        }
    }
    
    // Обработчики событий
    function setupEventListeners() {
        // Копирование IP-адреса
        const copyButton = container.querySelector('.server-status__copy-btn');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(serverAddress)
                    .then(() => {
                        showCopyNotification();
                        showNotification({
                            type: 'success',
                            title: 'IP адрес скопирован',
                            message: `Адрес ${serverAddress} скопирован в буфер обмена`
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
            });
        }
        
        // Обновление по кнопке
        const refreshButton = container.querySelector('.server-status__refresh-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                // Добавляем класс анимации
                const icon = refreshButton.querySelector('i');
                if (icon) {
                    icon.classList.add('server-status__spin');
                    setTimeout(() => {
                        icon.classList.remove('server-status__spin');
                    }, 1000);
                }
                
                // Запускаем обновление
                container.classList.add('server-status--loading');
                updateServerStatus();
            });
        }
    }
    
    // Очистка при удалении компонента
    function cleanup() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
    }
    
    // Инициализация
    setupEventListeners();
    updateServerStatus();
    setupAutoRefresh();
    
    // Возвращаем функцию очистки для возможного использования
    return cleanup;
}

export default ServerStatusWidget;
export { initServerStatusWidget }; 