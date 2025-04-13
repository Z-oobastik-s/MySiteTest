/**
 * ServerStatus - компонент для отображения текущего статуса Minecraft сервера
 * @version 1.0.0
 */
class ServerStatus {
    /**
     * Создает экземпляр компонента ServerStatus
     * @param {Object} options - Опции компонента
     * @param {string} options.selector - CSS селектор для контейнера
     * @param {string} options.serverAddress - Адрес сервера Minecraft
     * @param {number} options.serverPort - Порт сервера (по умолчанию 25565)
     * @param {boolean} options.autoRefresh - Автоматически обновлять статус каждые X секунд
     * @param {number} options.refreshInterval - Интервал обновления в секундах (по умолчанию 60)
     */
    constructor(options) {
        if (!options || !options.selector || !options.serverAddress) {
            throw new Error('Необходимо указать selector и serverAddress');
        }
        
        // Инициализация свойств
        this.selector = options.selector;
        this.serverAddress = options.serverAddress;
        this.serverPort = options.serverPort || 25565;
        this.autoRefresh = options.autoRefresh || false;
        this.refreshInterval = (options.refreshInterval || 60) * 1000;
        
        // Получаем контейнер
        this.container = document.querySelector(this.selector);
        if (!this.container) {
            throw new Error(`Контейнер с селектором ${this.selector} не найден`);
        }
        
        // Создаем экземпляр API
        this.api = new ServerApi(options.apiOptions);
        
        // Инициализируем таймер обновления
        this.refreshTimer = null;
        
        // Рендерим начальное состояние и запускаем получение данных
        this.render();
        this.fetchStatus();
    }
    
    /**
     * Получает статус сервера
     */
    async fetchStatus() {
        // Устанавливаем статус загрузки
        this.setStatus('loading');
        
        try {
            // Получаем данные о статусе сервера
            const data = await this.api.getServerStatus(this.serverAddress, this.serverPort);
            
            // Обновляем UI в зависимости от полученного статуса
            if (data.status === 'online') {
                this.updateOnlineStatus(data);
            } else if (data.status === 'offline') {
                this.updateOfflineStatus(data);
            } else {
                this.updateErrorStatus(data);
            }
            
            // Обновляем время последнего запроса
            this.updateLastRefreshTime();
            
            // Запускаем автообновление, если оно включено
            this.setupAutoRefresh();
        } catch (error) {
            console.error('Ошибка при получении статуса сервера:', error);
            this.updateErrorStatus({ error: error.message });
        }
    }
    
    /**
     * Устанавливает класс статуса для контейнера
     * @param {string} status - Статус (online, offline, loading, error)
     */
    setStatus(status) {
        // Удаляем предыдущие классы статусов
        this.container.classList.remove('server-status--online', 'server-status--offline', 
            'server-status--loading', 'server-status--error');
        
        // Добавляем новый класс статуса
        this.container.classList.add(`server-status--${status}`);
        
        // Обновляем иконку в зависимости от статуса
        const iconElement = this.container.querySelector('.server-status__header-icon');
        if (iconElement) {
            let iconClass = '';
            switch (status) {
                case 'online':
                    iconClass = 'fas fa-check-circle';
                    break;
                case 'offline':
                    iconClass = 'fas fa-times-circle';
                    break;
                case 'loading':
                    iconClass = 'fas fa-spinner server-status__spin';
                    break;
                case 'error':
                    iconClass = 'fas fa-exclamation-triangle';
                    break;
            }
            
            // Очищаем предыдущие классы иконок
            iconElement.className = 'server-status__header-icon';
            
            // Добавляем новый класс иконки
            if (iconClass) {
                iconElement.className += ' ' + iconClass;
            }
        }
    }
    
    /**
     * Обновляет UI для статуса "онлайн"
     * @param {Object} data - Данные о статусе сервера
     */
    updateOnlineStatus(data) {
        // Устанавливаем статус
        this.setStatus('online');
        
        // Обновляем данные о количестве игроков
        const playerCountElement = this.container.querySelector('.server-status__player-count');
        if (playerCountElement && data.players) {
            playerCountElement.textContent = `${data.players.online}/${data.players.max}`;
        }
        
        // Обновляем пинг
        const pingElement = this.container.querySelector('.server-status__ping');
        if (pingElement && data.ping !== undefined) {
            pingElement.textContent = `${data.ping} мс`;
        }
        
        // Обновляем версию сервера
        const versionElement = this.container.querySelector('.server-status__version-value');
        if (versionElement && data.version) {
            versionElement.textContent = data.version.name;
        }
        
        // Обновляем список игроков
        this.updatePlayerList(data.players);
    }
    
    /**
     * Обновляет UI для статуса "оффлайн"
     * @param {Object} data - Данные о статусе сервера
     */
    updateOfflineStatus(data) {
        this.setStatus('offline');
        
        // Обновляем сообщение об ошибке
        const errorMessageElement = this.container.querySelector('.server-status__error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = data.error || 'Сервер временно недоступен';
            errorMessageElement.style.display = 'block';
        }
        
        // Скрываем блок информации об игроках
        const playerInfoElement = this.container.querySelector('.server-status__player-info');
        if (playerInfoElement) {
            playerInfoElement.style.display = 'none';
        }
    }
    
    /**
     * Обновляет UI для статуса "ошибка"
     * @param {Object} data - Данные об ошибке
     */
    updateErrorStatus(data) {
        this.setStatus('error');
        
        // Обновляем сообщение об ошибке
        const errorMessageElement = this.container.querySelector('.server-status__error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = data.error || 'Произошла ошибка при получении статуса сервера';
            errorMessageElement.style.display = 'block';
        }
        
        // Скрываем блок информации об игроках
        const playerInfoElement = this.container.querySelector('.server-status__player-info');
        if (playerInfoElement) {
            playerInfoElement.style.display = 'none';
        }
    }
    
    /**
     * Обновляет список игроков
     * @param {Object} playersData - Данные об игроках
     */
    updatePlayerList(playersData) {
        if (!playersData || !playersData.list) return;
        
        const playerListElement = this.container.querySelector('.server-status__player-list');
        if (!playerListElement) return;
        
        // Очищаем текущий список
        playerListElement.innerHTML = '';
        
        // Создаем элементы списка для каждого игрока
        playersData.list.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'server-status__player-item';
            
            // Аватар игрока (можно добавить реальные аватары через API)
            const playerAvatar = document.createElement('div');
            playerAvatar.className = 'server-status__player-avatar';
            playerAvatar.innerHTML = '<i class="fas fa-user"></i>';
            
            // Имя игрока
            const playerName = document.createElement('div');
            playerName.className = 'server-status__player-name';
            playerName.textContent = player;
            
            // Добавляем элементы
            playerItem.appendChild(playerAvatar);
            playerItem.appendChild(playerName);
            playerListElement.appendChild(playerItem);
        });
        
        // Отображаем блок информации об игроках
        const playerInfoElement = this.container.querySelector('.server-status__player-info');
        if (playerInfoElement) {
            playerInfoElement.style.display = 'block';
        }
        
        // Скрываем сообщение об ошибке
        const errorMessageElement = this.container.querySelector('.server-status__error-message');
        if (errorMessageElement) {
            errorMessageElement.style.display = 'none';
        }
    }
    
    /**
     * Обновляет время последнего обновления
     */
    updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const lastRefreshElement = this.container.querySelector('.server-status__last-refresh');
        if (lastRefreshElement) {
            lastRefreshElement.textContent = `Последнее обновление: ${timeString}`;
        }
    }
    
    /**
     * Настраивает автообновление, если оно включено
     */
    setupAutoRefresh() {
        // Сбрасываем предыдущий таймер, если он был установлен
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        
        // Устанавливаем новый таймер, если автообновление включено
        if (this.autoRefresh) {
            this.refreshTimer = setTimeout(() => {
                this.fetchStatus();
            }, this.refreshInterval);
        }
    }
    
    /**
     * Запускает ручное обновление статуса
     */
    refresh() {
        // Сбрасываем таймер автообновления, если он был установлен
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        
        // Запускаем получение статуса
        this.fetchStatus();
    }
    
    /**
     * Рендерит HTML структуру компонента
     */
    render() {
        // Шаблон HTML компонента
        const template = `
            <div class="server-status server-status--loading">
                <div class="server-status__header">
                    <div class="server-status__header-icon fas fa-spinner server-status__spin"></div>
                    <h3 class="server-status__title">Статус сервера</h3>
                    <div class="server-status__actions">
                        <button class="server-status__refresh-btn" title="Обновить статус">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="server-status__content">
                    <div class="server-status__server-address">
                        <span class="server-status__label">Адрес:</span>
                        <span class="server-status__value">${this.serverAddress}:${this.serverPort}</span>
                        <button class="server-status__copy-btn" title="Скопировать адрес">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div class="server-status__player-info">
                        <div class="server-status__stats">
                            <div class="server-status__stat">
                                <span class="server-status__label">Игроки:</span>
                                <span class="server-status__player-count">0/0</span>
                            </div>
                            <div class="server-status__stat">
                                <span class="server-status__label">Пинг:</span>
                                <span class="server-status__ping">0 мс</span>
                            </div>
                        </div>
                        
                        <div class="server-status__player-list-container">
                            <h4 class="server-status__player-list-title">Игроки онлайн</h4>
                            <div class="server-status__player-list"></div>
                        </div>
                    </div>
                    
                    <div class="server-status__error-message" style="display: none;">
                        Загрузка статуса сервера...
                    </div>
                    
                    <div class="server-status__server-version">
                        <span class="server-status__label">Версия:</span>
                        <span class="server-status__version-value">Загрузка...</span>
                    </div>
                    
                    <div class="server-status__footer">
                        <span class="server-status__last-refresh">Последнее обновление: -</span>
                    </div>
                </div>
            </div>
        `;
        
        // Устанавливаем HTML в контейнер
        this.container.innerHTML = template;
        
        // Добавляем обработчики событий
        this.bindEvents();
    }
    
    /**
     * Привязывает обработчики событий
     */
    bindEvents() {
        // Обработчик для кнопки обновления
        const refreshBtn = this.container.querySelector('.server-status__refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        // Обработчик для копирования адреса сервера
        const copyBtn = this.container.querySelector('.server-status__copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const serverAddress = `${this.serverAddress}:${this.serverPort}`;
                
                // Используем API буфера обмена для копирования
                navigator.clipboard.writeText(serverAddress)
                    .then(() => {
                        // Показываем уведомление об успешном копировании
                        this.showCopyNotification('Адрес сервера скопирован!');
                    })
                    .catch(err => {
                        console.error('Ошибка при копировании: ', err);
                    });
            });
        }
    }
    
    /**
     * Показывает уведомление о копировании
     * @param {string} message - Сообщение для отображения
     */
    showCopyNotification(message) {
        // Проверяем, существует ли уже уведомление
        let notification = document.querySelector('.server-status__notification');
        
        // Если нет, создаем новое
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'server-status__notification';
            document.body.appendChild(notification);
        }
        
        // Устанавливаем сообщение и показываем уведомление
        notification.textContent = message;
        notification.classList.add('server-status__notification--visible');
        
        // Скрываем уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('server-status__notification--visible');
        }, 3000);
    }
    
    /**
     * Удаляет компонент и освобождает ресурсы
     */
    destroy() {
        // Отменяем таймер автообновления
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        
        // Удаляем обработчики событий
        const refreshBtn = this.container.querySelector('.server-status__refresh-btn');
        if (refreshBtn) {
            refreshBtn.removeEventListener('click', () => this.refresh());
        }
        
        const copyBtn = this.container.querySelector('.server-status__copy-btn');
        if (copyBtn) {
            copyBtn.removeEventListener('click', () => {});
        }
        
        // Очищаем содержимое контейнера
        this.container.innerHTML = '';
    }
}

// Экспортируем компонент
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServerStatus;
} else {
    window.ServerStatus = ServerStatus;
} 