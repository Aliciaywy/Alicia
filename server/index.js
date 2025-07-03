/**
 * Mental Health Tips & Mindfulness Server
 * Optional Node.js + Express backend for serving tips and future API endpoints
 * 
 * Features:
 * - Serves static files
 * - API endpoint for tips
 * - CORS support for development
 * - Future extensibility for mood logging and user data
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes

/**
 * GET /api/tips
 * Returns all wellness tips with optional filtering
 */
app.get('/api/tips', async (req, res) => {
    try {
        const { category, mood, limit } = req.query;
        
        // Read tips from JSON file
        const tipsData = await fs.readFile(path.join(__dirname, '../data/tips.json'), 'utf8');
        const data = JSON.parse(tipsData);
        let tips = data.tips;

        // Apply filters
        if (category && category !== 'all') {
            tips = tips.filter(tip => tip.category === category);
        }

        // Apply AI-based mood filtering (future enhancement)
        if (mood) {
            tips = applyMoodBasedFiltering(tips, mood);
        }

        // Limit results
        if (limit) {
            tips = tips.slice(0, parseInt(limit));
        }

        res.json({
            success: true,
            data: {
                tips,
                total: tips.length,
                categories: data.categories
            }
        });
    } catch (error) {
        console.error('Error fetching tips:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tips'
        });
    }
});

/**
 * GET /api/tips/:id
 * Returns a specific tip by ID
 */
app.get('/api/tips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const tipsData = await fs.readFile(path.join(__dirname, '../data/tips.json'), 'utf8');
        const data = JSON.parse(tipsData);
        
        const tip = data.tips.find(tip => tip.id === id);
        
        if (!tip) {
            return res.status(404).json({
                success: false,
                error: 'Tip not found'
            });
        }

        res.json({
            success: true,
            data: tip
        });
    } catch (error) {
        console.error('Error fetching tip:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tip'
        });
    }
});

/**
 * POST /api/mood
 * Log user's mood (future enhancement - would require user authentication)
 */
app.post('/api/mood', (req, res) => {
    try {
        const { mood, timestamp } = req.body;
        
        // Validate mood
        const validMoods = ['stressed', 'anxious', 'neutral', 'happy', 'energetic'];
        if (!validMoods.includes(mood)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid mood value'
            });
        }

        // For now, just return success
        // In a real implementation, this would save to a database
        res.json({
            success: true,
            message: 'Mood logged successfully',
            data: {
                mood,
                timestamp: timestamp || new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error logging mood:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log mood'
        });
    }
});

/**
 * GET /api/recommendations
 * Get personalized tip recommendations based on mood and context
 */
app.get('/api/recommendations', async (req, res) => {
    try {
        const { mood, timeOfDay, dayOfWeek } = req.query;
        
        const tipsData = await fs.readFile(path.join(__dirname, '../data/tips.json'), 'utf8');
        const data = JSON.parse(tipsData);
        
        // Apply AI-based recommendations
        const recommendations = getAIRecommendations(data.tips, mood, timeOfDay, dayOfWeek);
        
        res.json({
            success: true,
            data: {
                recommendations,
                total: recommendations.length,
                context: {
                    mood,
                    timeOfDay,
                    dayOfWeek
                }
            }
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recommendations'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Mental Health Tips API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

/**
 * Helper Functions
 */

function applyMoodBasedFiltering(tips, mood) {
    // Simple mood-based filtering logic
    const moodCategories = {
        'stressed': ['breathing', 'time-management'],
        'anxious': ['breathing', 'affirmations'],
        'neutral': ['mood-boosters', 'time-management'],
        'happy': ['mood-boosters', 'affirmations'],
        'energetic': ['time-management', 'mood-boosters']
    };

    const preferredCategories = moodCategories[mood] || [];
    
    if (preferredCategories.length === 0) {
        return tips;
    }

    // Prioritize tips from preferred categories
    const prioritizedTips = tips.filter(tip => preferredCategories.includes(tip.category));
    const otherTips = tips.filter(tip => !preferredCategories.includes(tip.category));
    
    return [...prioritizedTips, ...otherTips];
}

function getAIRecommendations(tips, mood, timeOfDay, dayOfWeek) {
    // Enhanced AI recommendation logic
    let recommendations = tips;
    
    // Apply mood-based filtering
    if (mood) {
        recommendations = applyMoodBasedFiltering(recommendations, mood);
    }
    
    // Apply time-based adjustments
    if (timeOfDay === 'morning') {
        // Prioritize affirmations and time management in the morning
        recommendations = recommendations.sort((a, b) => {
            if (a.category === 'affirmations' || a.category === 'time-management') return -1;
            if (b.category === 'affirmations' || b.category === 'time-management') return 1;
            return 0;
        });
    } else if (timeOfDay === 'evening') {
        // Prioritize breathing and mood boosters in the evening
        recommendations = recommendations.sort((a, b) => {
            if (a.category === 'breathing' || a.category === 'mood-boosters') return -1;
            if (b.category === 'breathing' || b.category === 'mood-boosters') return 1;
            return 0;
        });
    }
    
    // Limit to top 6 recommendations
    return recommendations.slice(0, 6);
}

// Start the server
app.listen(PORT, () => {
    console.log(`🧘 Mental Health Tips & Mindfulness Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the app`);
    console.log(`🔌 API endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;
