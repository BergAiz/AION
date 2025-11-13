// script.js
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// База знаний бота
const botResponses = {
    'привет': ['Привет!', 'Здравствуйте!', 'Приветствую!'],
    'как дела': ['Отлично!', 'Прекрасно, спасибо!', 'Всё хорошо!'],
    'пока': ['До свидания!', 'Удачи!', 'Хорошего дня!'],
    'имя': ['Меня зовут Чат-бот', 'Я ваш виртуальный помощник'],
    'помощь': ['Я могу ответить на простые вопросы. Спросите о погоде, времени или просто поздоровайтесь!'],
    'погода': ['Сегодня солнечно!', 'Лучше посмотреть в окно :)', 'Погода отличная!'],
    'время': [`Сейчас ${new Date().toLocaleTimeString()}`],
    'default': ['Интересный вопрос!', 'Пока не знаю ответа на это', 'Можете спросить что-то другое?']
};

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, responses] of Object.entries(botResponses)) {
        if (lowerMessage.includes(key)) {
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex];
        }
    }
    
    const defaultResponses = botResponses.default;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, true);
    userInput.value = '';

    // Индикатор загрузки
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.textContent = 'Печатает...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        chatMessages.removeChild(loadingDiv);
        const response = getBotResponse(message);
        addMessage(response);
    }, 1000 + Math.random() * 1000);
}

// Обработчики событий
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Фокус на поле ввода при загрузке
document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();
});
