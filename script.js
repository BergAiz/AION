// script.js
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Расширенная база знаний бота
const botResponses = {
    'привет': ['Привет! 👋', 'Здравствуйте! 😊', 'Приветствую вас!', 'Привет! Как ваши дела?'],
    'как дела': ['Отлично! Спасибо! ✨', 'Прекрасно! А у вас?', 'Всё замечательно!', 'Хорошо, работаю для вас!'],
    'пока': ['До свидания! 👋', 'Удачи! 🍀', 'Хорошего дня! 🌟', 'Был рад помочь!'],
    'имя': ['Меня зовут Чат-бот 🤖', 'Я ваш виртуальный помощник', 'Я просто бот, но стараюсь помочь!'],
    'помощь': [
        'Я могу ответить на простые вопросы! 💭',
        'Спросите о погоде, времени или просто поздоровайтесь!',
        'Попробуйте: "привет", "как дела", "погода", "время"'
    ],
    'погода': [
        'Сегодня солнечно! ☀️', 
        'Лучше посмотреть в окно :) 🪟',
        'Погода отличная для прогулки! 🌈',
        'На улице прекрасно! 🌤️'
    ],
    'время': [`Сейчас ${new Date().toLocaleTimeString('ru-RU')} ⏰`],
    'спасибо': ['Пожалуйста! 😊', 'Рад был помочь! ✨', 'Всегда к вашим услугам!', 'Обращайтесь! 🙏'],
    'шутка': [
        'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25! 😄',
        'Как называется песня, которую поёт API? JSON-der-ella! 🎵',
        'Почему JavaScript разработчик пошел спать? Потому что у него был async! 💤'
    ],
    'default': [
        'Интересный вопрос! 🤔 Пока я учусь и не знаю ответа на это.',
        'Попробуйте спросить что-то другое! 💭',
        'Я пока только учусь понимать такие вопросы... 📚',
        'Можете задать более простой вопрос? 😊'
    ]
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

    // Имитация задержки ответа
    setTimeout(() => {
        chatMessages.removeChild(loadingDiv);
        const response = getBotResponse(message);
        addMessage(response);
    }, 800 + Math.random() * 800);
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

// Авто-очистка подсказки при фокусе
userInput.addEventListener('focus', () => {
    document.querySelector('.chat-input-container::before')?.style.opacity = '0';
});

userInput.addEventListener('blur', () => {
    document.querySelector('.chat-input-container::before')?.style.opacity = '1';
});
