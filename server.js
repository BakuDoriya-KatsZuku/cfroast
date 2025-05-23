require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// API endpoint to handle the roasting
app.post('/api/roast', async (req, res) => {
    try {
        const { handle } = req.body;
        
        if (!handle) {
            return res.status(400).json({ error: 'Handle is required' });
        }

        // Fetch data from Codeforces API
        const [userData, ratingData, statusData] = await Promise.all([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`).then(res => res.json()),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`).then(res => res.json()),
            fetch(`https://codeforces.com/api/user.status?handle=${handle}`).then(res => res.json())
        ]);

        if (userData.status === 'FAILED') {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate the roast prompt
        const prompt = generatePrompt(userData, ratingData, statusData);
        
        // Get roast from Gemini
        const roast = await getRoastFromGemini(prompt);
        
        res.json({ roast });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate roast' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function generatePrompt(mainData, ratingData, statusData) {
    let prompt = "Roast this codeforces user based on their profile and performance: in a sarcastic yet condescending tone. \n";
    prompt += `User ${mainData.result[0].handle} has a rating of ${mainData.result[0].rating} as a ${mainData.result[0].rank}, and contribution of ${mainData.result[0].contribution}, with ${mainData.result[0].friendOfCount} friends and has solved ${statusData.result.length} problems. \n`;
    prompt += `Their contest performance: \n`;
    
    for (let i = 0; i < ratingData.result.length; i++) {
        prompt += `Contest ${ratingData.result[i].contestId}: ${ratingData.result[i].newRating} (was ${ratingData.result[i].oldRating}) \n`;
    }
    
    prompt += `Their submissions (by rating): \n`;
    const ratingDict = {};
    const correctDict = {};
    
    for (let i = 0; i < statusData.result.length; i++) {
        const rating = statusData.result[i].problem.rating;
        if (rating in ratingDict) {
            ratingDict[rating]++;
        } else {
            ratingDict[rating] = 1;
        }
        
        if (statusData.result[i].verdict === "OK") {
            if (rating in correctDict) {
                correctDict[rating]++;
            } else {
                correctDict[rating] = 1;
            }
        }
    }
    
    for (const [key, value] of Object.entries(ratingDict)) {
        prompt += `Rating ${key}: ${value} submissions \n`;
    }
    
    prompt += `Their correct submissions (by rating): \n`;
    for (const [key, value] of Object.entries(correctDict)) {
        prompt += `Rating ${key}: ${value} correct submissions \n`;
    }
    
    return prompt;
}

async function getRoastFromGemini(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating roast:', error);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 