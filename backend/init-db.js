const connectDB = require('./config/database');
const Quiz = require('./models/Quiz');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
    try {
        await connectDB();
        
        // Check if data already exists
        const existingQuizzes = await Quiz.countDocuments();
        if (existingQuizzes > 0) {
            console.log('Database already initialized');
            return;
        }

        // Load quiz data from JSON
        const quizDataPath = path.join(__dirname, '../frontend/assets/data/quiz-data.json');
        if (fs.existsSync(quizDataPath)) {
            const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));
            
            for (const quiz of quizData.quizzes) {
                await Quiz.create(quiz);
            }
            console.log('Quiz data migrated successfully');
        }

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

module.exports = initializeDatabase;