// AION - Сервис управления пользователями и модерацией
class UserService {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.violations = this.loadViolations();
    }

    // Загрузка пользователей из localStorage
    loadUsers() {
        const stored = localStorage.getItem('aion_users');
        return stored ? JSON.parse(stored) : [];
    }

    // Загрузка нарушений из localStorage
    loadViolations() {
        const stored = localStorage.getItem('aion_violations');
        return stored ? JSON.parse(stored) : {};
    }

    // Сохранение пользователей
    saveUsers() {
        localStorage.setItem('aion_users', JSON.stringify(this.users));
    }

    // Сохранение нарушений
    saveViolations() {
        localStorage.setItem('aion_violations', JSON.stringify(this.violations));
    }

    // Регистрация нового пользователя
    register(userData) {
        const user = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password, // В реальном приложении хэшировать!
            name: userData.name,
            age: userData.age,
            bio: userData.bio,
            photos: [],
            subscription: 'free',
            createdAt: new Date().toISOString(),
            likesToday: 0,
            lastLikeReset: new Date().toISOString()
        };

        this.users.push(user);
        this.saveUsers();
        this.login(user.email, userData.password);
        
        return user;
    }

    // Вход пользователя
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.resetDailyLikesIfNeeded();
            localStorage.setItem('aion_current_user', JSON.stringify(user));
            return user;
        }
        return null;
    }

    // Выход пользователя
    logout() {
        this.currentUser = null;
        localStorage.removeItem('aion_current_user');
    }

    // Получение текущего пользователя
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('aion_current_user');
            this.currentUser = stored ? JSON.parse(stored) : null;
        }
        return this.currentUser;
    }

    // Сброс дневных лайков если прошел день
    resetDailyLikesIfNeeded() {
        if (!this.currentUser) return;

        const lastReset = new Date(this.currentUser.lastLikeReset);
        const now = new Date();
        const diffDays = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) {
            this.currentUser.likesToday = 0;
            this.currentUser.lastLikeReset = now.toISOString();
            this.saveUsers();
        }
    }

    // Проверка лимита лайков (50 в день)
    canLike() {
        if (!this.currentUser) return false;
        this.resetDailyLikesIfNeeded();
        return this.currentUser.likesToday < 50;
    }

    // Увеличение счетчика лайков
    incrementLikes() {
        if (this.currentUser) {
            this.currentUser.likesToday++;
            this.saveUsers();
        }
    }

    // AI-модерация текста (заглушка - в реальности Yandex GPT API)
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

    // Добавление нарушения пользователю
    addViolation(userId, reason) {
        if (!this.violations[userId]) {
            this.violations[userId] = [];
        }

        const violation = {
            id: Date.now().toString(),
            reason: reason,
            date: new Date().toISOString(),
            severity: 'warning' // warning, temp_ban, permanent_ban
        };

        this.violations[userId].push(violation);
        this.saveViolations();

        // Автоматическая блокировка при множественных нарушениях
        const userViolations = this.violations[userId];
        if (userViolations.length >= 3) {
            this.banUser(userId, 'Автоматический бан за множественные нарушения');
        }

        return violation;
    }

    // Бан пользователя
    banUser(userId, reason) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.banned = true;
            user.banReason = reason;
            user.bannedAt = new Date().toISOString();
            this.saveUsers();

            // Если забанен текущий пользователь - разлогиниваем
            if (this.currentUser && this.currentUser.id === userId) {
                this.logout();
            }
        }
    }

    // Проверка забанен ли пользователь
    isUserBanned(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? user.banned : false;
    }

    // Получение пользователя по ID
    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    // Обновление профиля пользователя
    updateProfile(userId, updates) {
        const user = this.getUserById(userId);
        if (user) {
            Object.assign(user, updates);
            this.saveUsers();
            return user;
        }
        return null;
    }
}

// Глобальный экземпляр сервиса
const userService = new UserService();
