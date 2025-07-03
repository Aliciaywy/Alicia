/**
 * Mental Health Tips & Mindfulness App
 * Student Wellness Platform
 * 
 * Features:
 * - Rules-based AI suggestion engine
 * - Mood tracking with local storage
 * - Bookmark/favorite functionality
 * - Dynamic tip loading and filtering
 * - Responsive interactions
 */

// App state
const AppState = {
    tips: [],
    currentMood: null,
    favorites: JSON.parse(localStorage.getItem('wellness-favorites') || '[]'),
    moodHistory: JSON.parse(localStorage.getItem('wellness-mood-history') || '[]'),
    currentFilter: 'all'
};

// DOM elements
const elements = {
    tipsContainer: document.getElementById('tipsContainer'),
    favoritesContainer: document.getElementById('favoritesContainer'),
    moodFeedback: document.getElementById('moodFeedback'),
    toast: document.getElementById('toast'),
    navToggle: document.querySelector('.nav-toggle'),
    nav: document.querySelector('.nav')
};

/**
 * AI-POWERED SUGGESTION ENGINE
 * Rules-based system that recommends tips based on:
 * - Current mood
 * - Time of day
 * - Day of week
 * - Historical mood patterns
 */
class WellnessAI {
    static getTipRecommendations(mood, timeOfDay, dayOfWeek) {
        const recommendations = {
            weights: {},
            categories: []
        };

        // Mood-based recommendations
        switch (mood) {
            case 'stressed':
                recommendations.categories = ['breathing', 'time-management'];
                recommendations.weights = { 'breathing': 0.4, 'time-management': 0.3, 'affirmations': 0.3 };
                break;
            case 'anxious':
                recommendations.categories = ['breathing', 'affirmations'];
                recommendations.weights = { 'breathing': 0.5, 'affirmations': 0.4, 'mood-boosters': 0.1 };
                break;
            case 'neutral':
                recommendations.categories = ['time-management', 'mood-boosters'];
                recommendations.weights = { 'mood-boosters': 0.3, 'time-management': 0.3, 'affirmations': 0.2, 'breathing': 0.2 };
                break;
            case 'happy':
                recommendations.categories = ['mood-boosters', 'affirmations'];
                recommendations.weights = { 'mood-boosters': 0.4, 'affirmations': 0.3, 'time-management': 0.3 };
                break;
            case 'energetic':
                recommendations.categories = ['time-management', 'mood-boosters'];
                recommendations.weights = { 'time-management': 0.4, 'mood-boosters': 0.4, 'breathing': 0.2 };
                break;
            default:
                recommendations.weights = { 'breathing': 0.25, 'time-management': 0.25, 'affirmations': 0.25, 'mood-boosters': 0.25 };
        }

        // Time-based adjustments
        if (timeOfDay === 'morning') {
            recommendations.weights['affirmations'] = (recommendations.weights['affirmations'] || 0) + 0.1;
            recommendations.weights['time-management'] = (recommendations.weights['time-management'] || 0) + 0.1;
        } else if (timeOfDay === 'evening') {
            recommendations.weights['breathing'] = (recommendations.weights['breathing'] || 0) + 0.1;
        }

        // Day-based adjustments (Monday blues, Friday energy, etc.)
        if (dayOfWeek === 'monday') {
            recommendations.weights['affirmations'] = (recommendations.weights['affirmations'] || 0) + 0.05;
        } else if (dayOfWeek === 'friday') {
            recommendations.weights['mood-boosters'] = (recommendations.weights['mood-boosters'] || 0) + 0.05;
        }

        return recommendations;
    }

    static sortTipsByAI(tips, recommendations) {
        return tips.sort((a, b) => {
            const weightA = recommendations.weights[a.category] || 0;
            const weightB = recommendations.weights[b.category] || 0;
            
            // Add randomness to prevent always showing the same tips
            const randomFactorA = Math.random() * 0.1;
            const randomFactorB = Math.random() * 0.1;
            
            return (weightB + randomFactorB) - (weightA + randomFactorA);
        });
    }

    static getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    static getDayOfWeek() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }
}

/**
 * MOOD TRACKING SYSTEM
 */
class MoodTracker {
    static saveMood(mood) {
        const moodEntry = {
            mood: mood,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };

        AppState.moodHistory.push(moodEntry);
        AppState.currentMood = mood;
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        AppState.moodHistory = AppState.moodHistory.filter(entry => 
            new Date(entry.timestamp) > thirtyDaysAgo
        );

        localStorage.setItem('wellness-mood-history', JSON.stringify(AppState.moodHistory));
        
        return moodEntry;
    }

    static getTodaysMood() {
        const today = new Date().toDateString();
        return AppState.moodHistory.find(entry => entry.date === today);
    }

    static getMoodStats() {
        const last7Days = AppState.moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate > weekAgo;
        });

        const moodCounts = {};
        last7Days.forEach(entry => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });

        return { last7Days, moodCounts };
    }
}

/**
 * FAVORITES SYSTEM
 */
class FavoritesManager {
    static addFavorite(tipId) {
        if (!AppState.favorites.includes(tipId)) {
            AppState.favorites.push(tipId);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    static removeFavorite(tipId) {
        const index = AppState.favorites.indexOf(tipId);
        if (index > -1) {
            AppState.favorites.splice(index, 1);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    static toggleFavorite(tipId) {
        if (AppState.favorites.includes(tipId)) {
            this.removeFavorite(tipId);
            return false;
        } else {
            this.addFavorite(tipId);
            return true;
        }
    }

    static isFavorite(tipId) {
        return AppState.favorites.includes(tipId);
    }

    static saveFavorites() {
        localStorage.setItem('wellness-favorites', JSON.stringify(AppState.favorites));
    }

    static getFavoriteTips() {
        return AppState.tips.filter(tip => AppState.favorites.includes(tip.id));
    }
}

/**
 * UI UTILITIES
 */
class UIUtils {
    static showToast(message, type = 'success') {
        const toast = elements.toast;
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    static createTipCard(tip, showCategory = true) {
        const isFavorited = FavoritesManager.isFavorite(tip.id);
        
        return `
            <div class="tip-card" data-category="${tip.category}" data-tip-id="${tip.id}">
                <div class="tip-header">
                    ${showCategory ? `<span class="tip-category">${tip.category.replace('-', ' ')}</span>` : ''}
                    <button class="tip-favorite ${isFavorited ? 'favorited' : ''}" 
                            onclick="toggleFavorite('${tip.id}')"
                            aria-label="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFavorited ? '⭐' : '☆'}
                    </button>
                </div>
                <h3 class="tip-title">${tip.title}</h3>
                <p class="tip-description">${tip.description}</p>
                ${tip.duration ? `<p class="tip-duration">Duration: ${tip.duration}</p>` : ''}
            </div>
        `;
    }

    static scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * APP INITIALIZATION
 */
async function initializeApp() {
    try {
        // Load tips data
        await loadTips();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize UI
        renderTips();
        renderFavorites();
        
        // Check for today's mood
        const todaysMood = MoodTracker.getTodaysMood();
        if (todaysMood) {
            AppState.currentMood = todaysMood.mood;
            updateMoodUI(todaysMood.mood);
        }
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        UIUtils.showToast('Failed to load wellness tips. Please refresh the page.', 'error');
    }
}

/**
 * LOAD TIPS DATA
 */
async function loadTips() {
    try {
        const response = await fetch('data/tips.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        AppState.tips = data.tips;
    } catch (error) {
        console.error('Error loading tips:', error);
        // Fallback to embedded tips if JSON fails to load
        AppState.tips = getFallbackTips();
    }
}

/**
 * RENDER FUNCTIONS
 */
function renderTips(filteredTips = null) {
    const tipsToRender = filteredTips || AppState.tips;
    
    if (tipsToRender.length === 0) {
        elements.tipsContainer.innerHTML = '<div class="empty-state"><p>No tips found for the selected category.</p></div>';
        return;
    }

    // Apply AI recommendations if we have a current mood
    let sortedTips = tipsToRender;
    if (AppState.currentMood) {
        const recommendations = WellnessAI.getTipRecommendations(
            AppState.currentMood,
            WellnessAI.getTimeOfDay(),
            WellnessAI.getDayOfWeek()
        );
        sortedTips = WellnessAI.sortTipsByAI(tipsToRender, recommendations);
    }

    elements.tipsContainer.innerHTML = sortedTips
        .map(tip => UIUtils.createTipCard(tip))
        .join('');
}

function renderFavorites() {
    const favoriteTips = FavoritesManager.getFavoriteTips();
    
    if (favoriteTips.length === 0) {
        elements.favoritesContainer.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon" aria-hidden="true">⭐</span>
                <p>No favorites yet. Start by bookmarking tips that resonate with you!</p>
            </div>
        `;
        return;
    }

    elements.favoritesContainer.innerHTML = favoriteTips
        .map(tip => UIUtils.createTipCard(tip, false))
        .join('');
}

/**
 * EVENT LISTENERS
 */
function setupEventListeners() {
    // Mobile navigation toggle
    if (elements.navToggle && elements.nav) {
        elements.navToggle.addEventListener('click', () => {
            elements.nav.classList.toggle('active');
            const isExpanded = elements.nav.classList.contains('active');
            elements.navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => handleMoodSelection(btn.dataset.mood));
    });

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => handleCategoryFilter(btn.dataset.category));
    });

    // Toast close button
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            elements.toast.classList.remove('show');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            UIUtils.scrollToSection(targetId);
        });
    });
}

/**
 * EVENT HANDLERS
 */
function handleMoodSelection(mood) {
    // Update UI
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');

    // Save mood
    MoodTracker.saveMood(mood);
    AppState.currentMood = mood;

    // Show feedback
    updateMoodUI(mood);

    // Re-render tips with AI recommendations
    const filteredTips = AppState.currentFilter === 'all' 
        ? AppState.tips 
        : AppState.tips.filter(tip => tip.category === AppState.currentFilter);
    
    renderTips(filteredTips);

    // Show success message
    UIUtils.showToast(`Mood recorded: ${mood}. Tips personalized for you!`);
}

function updateMoodUI(mood) {
    const feedback = elements.moodFeedback;
    const moodMessages = {
        stressed: "I understand you're feeling stressed. Let's find some calming techniques to help you relax.",
        anxious: "Anxiety can be challenging. Here are some grounding exercises to help you feel more centered.",
        neutral: "Great! Let's explore some tips to boost your mood and energy.",
        happy: "Wonderful! Let's keep that positive energy flowing with some uplifting activities.",
        energetic: "Amazing energy! Here are some productive ways to channel that enthusiasm."
    };

    feedback.textContent = moodMessages[mood] || "Let's find the perfect wellness tips for you!";
    feedback.classList.add('show');
}

function handleCategoryFilter(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    AppState.currentFilter = category;

    // Filter and render tips
    const filteredTips = category === 'all' 
        ? AppState.tips 
        : AppState.tips.filter(tip => tip.category === category);
    
    renderTips(filteredTips);
}

function toggleFavorite(tipId) {
    const isNowFavorited = FavoritesManager.toggleFavorite(tipId);
    
    // Update all favorite buttons for this tip
    document.querySelectorAll(`[data-tip-id="${tipId}"] .tip-favorite`).forEach(btn => {
        btn.classList.toggle('favorited', isNowFavorited);
        btn.textContent = isNowFavorited ? '⭐' : '☆';
        btn.setAttribute('aria-label', isNowFavorited ? 'Remove from favorites' : 'Add to favorites');
    });

    // Re-render favorites section
    renderFavorites();

    // Show feedback
    UIUtils.showToast(
        isNowFavorited ? 'Added to favorites!' : 'Removed from favorites!',
        isNowFavorited ? 'success' : 'info'
    );
}

// Global functions for HTML onclick handlers
window.scrollToSection = UIUtils.scrollToSection;
window.toggleFavorite = toggleFavorite;

/**
 * FALLBACK TIPS DATA
 * Used if the JSON file fails to load
 */
function getFallbackTips() {
    return [
        {
            id: "breathing-001",
            category: "breathing",
            title: "4-7-8 Breathing Technique",
            description: "Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. This technique helps activate your body's relaxation response.",
            duration: "2-3 minutes"
        },
        {
            id: "time-001",
            category: "time-management",
            title: "Pomodoro Study Sessions",
            description: "Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.",
            duration: "25 minutes"
        },
        {
            id: "affirmation-001",
            category: "affirmations",
            title: "Morning Confidence Boost",
            description: "Start your day by saying: 'I am capable, I am prepared, and I will succeed in my studies today.'",
            duration: "1 minute"
        },
        {
            id: "mood-001",
            category: "mood-boosters",
            title: "Gratitude Practice",
            description: "Write down three things you're grateful for today. Focus on small, specific moments that brought you joy.",
            duration: "5 minutes"
        }
    ];
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
