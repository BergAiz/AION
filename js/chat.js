// AION - Модуль чата
class ChatManager {
    constructor() {
        this.messages = [];
        this.currentPartner = null;
    }

    openChat(partner) {
        this.currentPartner = partner;
        this.messages = [];
        
        // Обновляем информацию о партнере
        const partnerName = document.getElementById('chat-partner-name');
        if (partnerName) {
            partnerName.textContent = partner.name;
        }
        
        // Очищаем сообщения
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        // Добавляем приветственное сообщение
        this.addMessage({
            id: Date.now().toString(),
            content: `Привет! Рада познакомиться! 😊`,
            type: 'incoming',
            time: this.getCurrentTime()
        });

        console.log('💬 Чат открыт с:', partner.name);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        messageDiv.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const content = input.value.trim();
        
        if (!content) return;

        // Сообщение пользователя
        this.addMessage({
            id: Date.now().toString(),
            content: content,
            type: 'outgoing',
            time: this.getCurrentTime()
        });

        input.value = '';

        // Ответ партнера (имитация)
        setTimeout(() => {
            this.generatePartnerResponse(content);
        }, 1000 + Math.random() * 2000);
    }

    generatePartnerResponse(userMessage) {
        const responses = [
            "Интересно! Расскажи подробнее 😊",
            "Здорово! А что тебе еще нравится?",
            "Спасибо за сообщение! Я тоже это люблю",
            "Классно! Давай продолжим общение",
            "Хорошо написано! Чувствуется твой стиль",
            "Приятно с тобой общаться! 🥰"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        this.addMessage({
            id: Date.now().toString(),
            content: response,
            type: 'incoming',
            time: this.getCurrentTime()
        });
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Глобальные функции для чата
function sendMessage() {
    if (window.chatManager) {
        chatManager.sendMessage();
    }
}

// Глобальный экземпляр менеджера чата
const chatManager = new ChatManager();

// Обработчик Enter в поле ввода
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
