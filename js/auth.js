// AION - Модуль аутентификации
class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.initAuthForm();
    }

    loadUsers() {
        return JSON.parse(localStorage.getItem('aion_users')) || [];
    }

    saveUsers() {
        localStorage.setItem('aion_users', JSON.stringify(this.users));
    }

    initAuthForm() {
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
    }

    handleRegistration() {
        const formData = new FormData(document.getElementById('auth-form'));
        
        const userData = {
            id: Date.now().toString(),
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            email: formData.get('email'),
            password: formData.get('password'),
            bio: document.getElementById('bio').value || 'Новый пользователь AION',
            photos: [],
            subscription: 'free',
            createdAt: new Date().toISOString(),
            likesToday: 0,
            lastLikeReset: new Date().toISOString(),
            likesReceivedToday: 0,
            lastReceivedReset: new Date().toISOString()
        };

        // Валидация
        if (userData.age < 18) {
            this.showError('Минимальный возраст - 18 лет');
            return;
        }

        if (userData.name.length < 2) {
            this.showError('Имя должно содержать минимум 2 символа');
            return;
        }

        // Проверка email
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            this.showError('Пользователь с таким email уже существует');
            return;
        }

        // Модерация био
        const moderationResult = this.moderateText(userData.bio);
        if (!moderationResult.isClean) {
            this.showError(`Недопустимое описание: ${moderationResult.warning}`);
            return;
        }

        // Регистрация
        this.register(userData);
    }

    moderateText(text) {
        const bannedWords = ['оскорбление', 'спам', 'реклама', 'мошенничество'];
        const foundViolations = bannedWords.filter(word => 
            text.toLowerCase().includes(word)
        );

        return {
            isClean: foundViolations.length === 0,
            violations: foundViolations,
            warning: foundViolations.length > 0 ? 
                `Обнаружены запрещенные слова: ${foundViolations.join(', ')}` : null
        };
    }

    register(userData) {
        this.users.push(userData);
        this.saveUsers();
        
        // Автоматический вход
        aionApp.setCurrentUser(userData);
        
        console.log('✅ Пользователь зарегистрирован:', userData.name);
        
        // Показываем главный экран
        aionApp.showScreen('main-screen');
        
        // Инициализируем карточки
        if (window.cardsManager) {
            cardsManager.init(userData);
        }
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            aionApp.setCurrentUser(user);
            return user;
        }
        return null;
    }

    showError(message) {
        // Удаляем старые ошибки
        const oldError = document.querySelector('.auth-error');
        if (oldError) oldError.remove();

        // Создаем сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.innerHTML = `❌ ${message}`;
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            padding: 12px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
        `;

        const form = document.getElementById('auth-form');
        form.parentNode.insertBefore(errorDiv, form);
    }
}

// Глобальный экземпляр менеджера аутентификации
const authManager = new AuthManager();
