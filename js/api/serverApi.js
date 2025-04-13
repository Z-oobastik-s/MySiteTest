/**
 * Серверный API для получения информации о статусе сервера Minecraft
 */
class ServerApi {
    /**
     * Создает экземпляр ServerApi
     * @param {Object} options - Опции API
     * @param {string} options.apiEndpoint - URL API (по умолчанию используется имитация)
     * @param {boolean} options.useSimulatedData - Использовать ли имитированные данные (для демонстрации)
     */
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || null;
        this.useSimulatedData = options.useSimulatedData !== undefined 
            ? options.useSimulatedData 
            : !this.apiEndpoint;
    }
    
    /**
     * Получает статус сервера
     * @param {string} serverAddress - Адрес сервера
     * @param {number} serverPort - Порт сервера
     * @returns {Promise<Object>} - Промис с данными о статусе сервера
     */
    async getServerStatus(serverAddress, serverPort) {
        if (this.useSimulatedData) {
            return this.getSimulatedData(serverAddress, serverPort);
        }
        
        try {
            const response = await fetch(`${this.apiEndpoint}/status?address=${serverAddress}&port=${serverPort}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching server status:', error);
            return {
                status: 'error',
                error: error.message
            };
        }
    }
    
    /**
     * Генерирует имитированные данные о сервере (для демонстрации)
     * @param {string} serverAddress - Адрес сервера
     * @param {number} serverPort - Порт сервера
     * @returns {Promise<Object>} - Промис с имитированными данными
     */
    async getSimulatedData(serverAddress, serverPort) {
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Случайно определяем статус сервера (для демонстрации)
        const random = Math.random();
        
        // Большинство времени (80%) сервер онлайн
        if (random < 0.8) {
            const playerCount = Math.floor(Math.random() * 30);
            const maxPlayers = 100;
            
            // Генерируем список случайных игроков
            const players = [];
            const possiblePlayers = [
                'Steve', 'Alex', 'Notch', 'Herobrine', 'Zoobastik', 
                'Creeper123', 'EnderDragon', 'DiamondMiner', 'PixelWarrior',
                'RedstoneWizard', 'CraftMaster', 'BlockBuilder', 'Survivor',
                'VillagerTrade', 'Observer', 'IronGolem', 'Piglin',
                'NetherExplorer', 'FarmingPro', 'EndermanWalker'
            ];
            
            for (let i = 0; i < playerCount; i++) {
                const randomIndex = Math.floor(Math.random() * possiblePlayers.length);
                players.push(possiblePlayers[randomIndex]);
            }
            
            return {
                status: 'online',
                address: serverAddress,
                port: serverPort,
                players: {
                    online: playerCount,
                    max: maxPlayers,
                    list: players
                },
                version: {
                    name: 'Paper 1.20.4',
                    protocol: 765
                },
                motd: {
                    clean: 'Zoobastiks Minecraft Server - Выживание и приключения!'
                },
                ping: Math.floor(Math.random() * 100) + 20, // 20-120ms
                queryTime: new Date().toISOString()
            };
        } 
        // 10% времени сервер оффлайн
        else if (random < 0.9) {
            return {
                status: 'offline',
                address: serverAddress,
                port: serverPort,
                error: 'Connection refused: no further information',
                queryTime: new Date().toISOString()
            };
        } 
        // 10% времени возникает ошибка запроса
        else {
            return {
                status: 'error',
                address: serverAddress,
                port: serverPort,
                error: 'Failed to resolve hostname',
                queryTime: new Date().toISOString()
            };
        }
    }
}

// Экспортируем класс
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServerApi;
} else {
    window.ServerApi = ServerApi;
} 