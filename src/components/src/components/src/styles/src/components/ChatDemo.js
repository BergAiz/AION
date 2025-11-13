// AION - Демо-чат для тестирования AI-помощника
class ChatDemo {
    constructor() {
        this.isVisible = false;
        this.messages = [];
        this.currentPartner = null;
    }

    // Создание интерфейса чата
    create() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = this.getChatHTML();
        
        this.addEventListeners(chatContainer);
        return chatContainer;
    }

    // HTML для чата
    getChatHTML() {
        return `
            <div class="chat-header">
                <div class="chat-partner">
                    <div class="partner-avatar">${this.currentPartner?.name?.charAt(0) || '👤'}</div>
                    <div class="partner-info">
                        <div class="partner-name">${this.currentPartner?.name || 'Анна'}</div>
                        <div class="partner-status">online</div>
                    </div>
                </div>
                <button class="close-chat">×</button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                ${this.getMessagesHTML()}
            </div>
            
            <div class="chat-input-container">
                <div class="ai-suggestion-area" id="aiSuggestionArea" style="display: none;"></div>
                <div class="input-wrapper">
                    <textarea 
                        id="chatInput" 
                        class="chat-input" 
                        placeholder="Напишите сообщение..." 
                        rows="2"
                    ></textarea>
                    <button class="btn-send" id="sendMessage">➤</button>
                    <button class="btn-ai-help" id="aiHelp" title="AI помощь">🤖</button>
                </div>
                <div class="chat-hint">
                    Нажмите 🤖 для AI-подсказки или Enter для отправки
                </div>
            </div>
        `;
    }

    // HTML для сообщений
    getMessagesHTML() {
        if (this.messages.length === 0) {
            return `
                <div class="welcome-message">
                    <div class="welcome-icon">💬</div>
                    <div class="welcome-text">
                        <h4>Начните общение!</h4>
                        <p>AI-помощник предложит улучшения для ваших сообщений</p>
                    </div>
                </div>
            `;
        }

        return this.messages.map(msg => `
            <div class="message ${msg.type}">
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `).join('');
    }

    // Добавление обработчиков событий
    addEventListeners(container) {
        // Закрытие чата
        container.querySelector('.close-chat').addEventListener('click', () => {
            this.hide();
        });

        // Отправка сообщения
        container.querySelector('#sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        // Отправка по Enter
        container.querySelector('#chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Запрос AI-помощи
        container.querySelector('#aiHelp').addEventListener('click', () => {
            this.requestAIHelp();
        });

        // Сохраняем ссылку на поле ввода для AI
        window.currentChatInput = container.querySelector('#chatInput');
    }

    // Отправка сообщения
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Добавляем сообщение пользователя
        this.addMessage(message, 'outgoing');
        input.value = '';

        // Скрываем AI-подсказку если была
        this.hideAISuggestion();

        // Имитация ответа партнера
        setTimeout(() => {
            this.generatePartnerResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    // Добавление сообщения в чат
    addMessage(content, type) {
        const message = {
            id: Date.now().toString(),
            content: content,
            type: type,
            time: this.getCurrentTime()
        };

        this.messages.push(message);
        this.updateMessagesDisplay();

        // Автоскролл к последнему сообщению
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Обновление отображения сообщений
    updateMessagesDisplay() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = this.getMessagesHTML();
    }

    // Запрос AI-помощи
    async requestAIHelp() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) {
            this.showAISuggestion('Напишите что-нибудь, чтобы получить AI-подсказку!');
            return;
        }

        // Показываем индикатор загрузки
        this.showAILoading();

        // Генерация AI-подсказки
        const suggestion = await aiAssistant.generateSuggestion(message, {
            context: 'dating_chat',
            partner: this.currentPartner
        });

        // Скрываем индикатор загрузки
        this.hideAILoading();

        if (suggestion) {
            this.showAISuggestion(suggestion);
        }
    }

    // Показать AI-подсказку
    showAISuggestion(suggestion) {
        const suggestionArea = document.getElementById('aiSuggestionArea');
        
        if (typeof suggestion === 'string') {
            // Простое текстовое уведомление
            suggestionArea.innerHTML = `
                <div class="simple-suggestion">
                    <span class="ai-icon">🤖</span>
                    <span>${suggestion}</span>
                </div>
            `;
        } else {
            // Полноценная AI-подсказка
            const suggestionUI = aiAssistant.createSuggestionUI(suggestion);
            suggestionArea.innerHTML = '';
            suggestionArea.appendChild(suggestionUI);
        }
        
        suggestionArea.style.display = 'block';
    }

    // Скрыть AI-подсказку
    hideAISuggestion() {
        const suggestionArea = document.getElementById('aiSuggestionArea');
        suggestionArea.style.display = 'none';
    }

    // Показать индикатор загрузки AI
    showAILoading() {
        const suggestionArea = document.getElementById('aiSuggestionArea');
        suggestionArea.innerHTML = `
            <div class="ai-loading">
                <div class="loading-spinner"></div>
                <span>AI анализирует сообщение...</span>
            </div>
        `;
        suggestionArea.style.display = 'block';
    }

    // Скрыть индикатор загрузки AI
    hideAILoading() {
        // Уже обрабатывается в showAISuggestion
    }

    // Генерация ответа партнера
    generatePartnerResponse(userMessage) {
        const responses = [
            "Привет! Отличное сообщение 😊",
            "Интересно, расскажи подробнее!",
            "Здорово! А что тебе еще нравится?",
            "Спасибо за сообщение! Я тоже это люблю",
            "Классно! Давай продолжим общение",
            "Хорошо написано! Чувствуется твой стиль"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(response, 'incoming');
    }

    // Получение текущего времени
    getCurrentTime() {
        return new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Показать чат
    show(partner = null) {
        this.currentPartner = partner || {
            id: 1,
            name: "Анна",
            age: 25
        };

        const chatContainer = document.querySelector('.chat-container') || this.create();
        if (!document.querySelector('.chat-container')) {
            document.body.appendChild(chatContainer);
        }

        chatContainer.style.display = 'flex';
        this.isVisible = true;

        // Фокус на поле ввода
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 100);
    }

    // Скрыть чат
    hide() {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
        this.isVisible = false;
        window.currentChatInput = null;
    }

    // Переключение видимости чата
    toggle(partner = null) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(partner);
        }
    }
}

// Глобальный экземпляр демо-чата
const chatDemo = new ChatDemo();
