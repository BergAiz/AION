// AION - AI-помощник для переписки
class AIAssistant {
    constructor() {
        this.isEnabled = true;
        this.suggestions = [];
        this.userStyle = this.loadUserStyle();
    }

    // Загрузка стиля пользователя из localStorage
    loadUserStyle() {
        const stored = localStorage.getItem('aion_ai_style');
        return stored ? JSON.parse(stored) : {
            tone: 'friendly',
            humorLevel: 'medium',
            formality: 'casual'
        };
    }

    // Сохранение стиля пользователя
    saveUserStyle() {
        localStorage.setItem('aion_ai_style', JSON.stringify(this.userStyle));
    }

    // Генерация AI-подсказки для сообщения
    async generateSuggestion(originalMessage, context = {}) {
        if (!this.isEnabled) return null;

        // Заглушка для Yandex GPT API (в реальности будет API вызов)
        const mockSuggestions = [
            "Как насчет начать с более оригинального приветствия?",
            "Можно добавить вопрос о хобби для поддержания диалога",
            "Попробуйте быть более конкретным в своих интересах",
            "Отличное начало! Может, добавить немного юмора?",
            "Спросите о планах на выходные для продолжения беседы"
        ];

        // Анализ сообщения
        const analysis = this.analyzeMessage(originalMessage);
        
        // Генерация подсказки на основе анализа
        const suggestion = {
            id: Date.now().toString(),
            original: originalMessage,
            improved: this.improveMessage(originalMessage, analysis),
            reason: mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)],
            confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
            analysis: analysis
        };

        this.suggestions.push(suggestion);
        return suggestion;
    }

    // Анализ сообщения
    analyzeMessage(message) {
        const analysis = {
            length: message.length,
            hasQuestion: /[?]/.test(message),
            hasGreeting: /(привет|здравствуй|добрый|hi|hello)/i.test(message),
            emotion: this.detectEmotion(message),
            complexity: this.calculateComplexity(message),
            clicheScore: this.detectCliches(message)
        };

        return analysis;
    }

    // Обнаружение эмоционального тона
    detectEmotion(message) {
        const positiveWords = ['отлично', 'прекрасно', 'замечательно', 'рад', 'счастлив'];
        const negativeWords = ['плохо', 'грустно', 'устал', 'разочарован'];
        
        let score = 0;
        const words = message.toLowerCase().split(' ');
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score++;
            if (negativeWords.includes(word)) score--;
        });

        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }

    // Расчет сложности сообщения
    calculateComplexity(message) {
        const words = message.split(' ');
        const longWords = words.filter(word => word.length > 6).length;
        return longWords / words.length;
    }

    // Обнаружение клише
    detectCliches(message) {
        const cliches = [
            'как дела',
            'чем занимаешься',
            'как настроение',
            'что нового',
            'привет как ты'
        ];

        const lowerMessage = message.toLowerCase();
        return cliches.filter(cliche => lowerMessage.includes(cliche)).length;
    }

    // Улучшение сообщения
    improveMessage(original, analysis) {
        let improved = original;

        // Добавление вопроса если его нет
        if (!analysis.hasQuestion && analysis.length < 50) {
            const questions = [
                'А ты чем увлекаешься?',
                'Как прошел твой день?',
                'Есть планы на выходные?',
                'Что любишь смотреть в свободное время?'
            ];
            improved += ' ' + questions[Math.floor(Math.random() * questions.length)];
        }

        // Упрощение если слишком сложно
        if (analysis.complexity > 0.3) {
            improved = this.simplifyText(improved);
        }

        // Добавление эмоций если нейтрально
        if (analysis.emotion === 'neutral' && analysis.clicheScore > 0) {
            improved = this.addEmotion(improved);
        }

        return improved;
    }

    // Упрощение текста
    simplifyText(text) {
        // Простая замена сложных слов на более простые
        const replacements = {
            'занимаешься': 'делаешь',
            'увлекаешься': 'нравится',
            'интересуешься': 'любишь'
        };

        let simplified = text;
        Object.keys(replacements).forEach(complex => {
            simplified = simplified.replace(new RegExp(complex, 'gi'), replacements[complex]);
        });

        return simplified;
    }

    // Добавление эмоций
    addEmotion(text) {
        const emotions = [
            ' 😊',
            ' 🎉',
            ' ✨',
            ' 💫'
        ];
        return text + emotions[Math.floor(Math.random() * emotions.length)];
    }

    // Создание UI подсказки
    createSuggestionUI(suggestion) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'ai-suggestion';
        suggestionDiv.innerHTML = `
            <div class="suggestion-header">
                <span class="ai-badge">🤖 AI</span>
                <span class="suggestion-confidence">${Math.round(suggestion.confidence * 100)}%</span>
                <button class="close-suggestion">×</button>
            </div>
            <div class="suggestion-reason">${suggestion.reason}</div>
            <div class="suggestion-comparison">
                <div class="original-message">
                    <strong>Было:</strong> "${suggestion.original}"
                </div>
                <div class="improved-message">
                    <strong>Можно:</strong> "${suggestion.improved}"
                </div>
            </div>
            <div class="suggestion-actions">
                <button class="btn-use-suggestion" data-suggestion="${suggestion.improved}">
                    Использовать
                </button>
                <button class="btn-dismiss">Отклонить</button>
            </div>
        `;

        this.addSuggestionListeners(suggestionDiv, suggestion);
        return suggestionDiv;
    }

    // Добавление обработчиков для подсказки
    addSuggestionListeners(suggestionDiv, suggestion) {
        // Закрытие подсказки
        suggestionDiv.querySelector('.close-suggestion').addEventListener('click', () => {
            suggestionDiv.remove();
        });

        // Использование предложения
        suggestionDiv.querySelector('.btn-use-suggestion').addEventListener('click', () => {
            this.onSuggestionUsed(suggestion);
            suggestionDiv.remove();
        });

        // Отклонение предложения
        suggestionDiv.querySelector('.btn-dismiss').addEventListener('click', () => {
            this.onSuggestionDismissed(suggestion);
            suggestionDiv.remove();
        });
    }

    // Обработка использования подсказки
    onSuggestionUsed(suggestion) {
        console.log('✅ AI suggestion used:', suggestion.improved);
        // Здесь будет логика подстановки текста в поле ввода
        if (window.currentChatInput) {
            window.currentChatInput.value = suggestion.improved;
        }
    }

    // Обработка отклонения подсказки
    onSuggestionDismissed(suggestion) {
        console.log('❌ AI suggestion dismissed');
    }

    // Включение/выключение AI
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    // Обновление стиля пользователя
    updateStyle(newStyle) {
        this.userStyle = { ...this.userStyle, ...newStyle };
        this.saveUserStyle();
    }
}

// Глобальный экземпляр AI-помощника
const aiAssistant = new AIAssistant();
