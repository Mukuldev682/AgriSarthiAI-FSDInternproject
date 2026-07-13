require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const requireAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisarthi';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import Models
const User = require('./models/User');
const Crop = require('./models/Crop');
const ChatMessage = require('./models/ChatMessage');

// Rate Limiter for Authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS Config
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
        }
        if (user) {
          user.googleId = profile.id;
          if (!user.name) user.name = profile.displayName;
          await user.save();
        } else {
          const randomPassword = Math.random().toString(36).slice(-10);
          user = await User.create({
            name: profile.displayName || 'Google User',
            email: email || `${profile.id}@google.placeholder`,
            googleId: profile.id,
            password: randomPassword
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Configure GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
    callbackURL: '/api/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value || profile._json?.email;
        if (email) {
          user = await User.findOne({ email });
        }
        if (user) {
          user.githubId = profile.id;
          if (!user.name) user.name = profile.displayName || profile.username;
          await user.save();
        } else {
          const randomPassword = Math.random().toString(36).slice(-10);
          user = await User.create({
            name: profile.displayName || profile.username || 'GitHub User',
            email: email || `${profile.id}@github.placeholder`,
            githubId: profile.id,
            password: randomPassword
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Zod Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().length(10, 'Phone number must be 10 digits').optional().or(z.literal(''))
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Seed initial data if database is empty
const seedDatabase = async () => {
  try {
    // Check if crops exist
    const cropCount = await Crop.countDocuments();
    if (cropCount === 0) {
      await Crop.insertMany([
        {
          name: 'Wheat',
          nameHindi: 'गेहूं',
          emoji: '🌾',
          season: 'Rabi',
          description: 'Major cereal crop grown in winter season',
          diseases: ['Rust', 'Karnal Bunt', 'Loose Smut']
        },
        {
          name: 'Rice',
          nameHindi: 'धान',
          emoji: '🌾',
          season: 'Kharif',
          description: 'Staple food crop grown in monsoon season',
          diseases: ['Blast', 'Brown Spot', 'Sheath Blight']
        },
        {
          name: 'Tomato',
          nameHindi: 'टमाटर',
          emoji: '🍅',
          season: 'Both',
          description: 'Popular vegetable crop',
          diseases: ['Early Blight', 'Late Blight', 'Leaf Curl']
        },
        {
          name: 'Potato',
          nameHindi: 'आलू',
          emoji: '🥔',
          season: 'Rabi',
          description: 'Tuber crop, major food source',
          diseases: ['Late Blight', 'Early Blight', 'Black Scurf']
        },
        {
          name: 'Mustard',
          nameHindi: 'सरसों',
          emoji: '🌼',
          season: 'Rabi',
          description: 'Oilseed crop',
          diseases: ['Alternaria Blight', 'White Rust', 'Powdery Mildew']
        },
        {
          name: 'Maize',
          nameHindi: 'मक्का',
          emoji: '🌽',
          season: 'Kharif',
          description: 'Cereal crop with multiple uses',
          diseases: ['Northern Leaf Blight', 'Gray Leaf Spot', 'Common Rust']
        }
      ]);
      console.log('🌱 Seeded initial crops data');
    }

    // Check if default user exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        name: 'Ramesh Kumar',
        phone: '9876543210',
        email: 'ramesh@agrisarthi.com',
        password: 'password123'
      });
      console.log('👤 Created default user');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Call seed function after connection
mongoose.connection.once('open', () => {
  seedDatabase();
});

// ==================== AUTH ENDPOINTS ====================

// POST /api/auth/register - Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    // Input validation
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors.map(err => err.message).join(', ')
      });
    }

    const { name, email, password, phone } = validation.data;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check duplicate phone if provided
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }
    }

    // Create user (pre-save hook hashes the password)
    const newUser = await User.create({
      name,
      email,
      password,
      phone: phone || undefined
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/auth/login - Login user
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    // Input validation
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors.map(err => err.message).join(', ')
      });
    }

    const { email, password } = validation.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'agrisarthi_super_secure_jwt_secret_key_123!',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ==================== OAUTH ENDPOINTS ====================

// Google OAuth
app.get('/api/auth/google', (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.includes('dummy')) {
    // Serve mock consent screen
    res.send(`
      <html>
      <head>
        <title>Sign in - Google Accounts</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full border border-gray-200">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold flex items-center justify-center gap-2" style="font-family: 'Baloo 2', cursive;">
              <span class="text-3xl">🌾</span> AgriSarthi AI
            </h1>
            <p class="text-gray-500 text-sm mt-2 font-semibold">Sign in with Google</p>
          </div>
          <div class="mb-6 bg-green-50 p-4 rounded-xl text-xs border border-green-200 text-green-800 leading-relaxed">
            <strong>AgriSarthi AI</strong> wants to access your Google account profile and email address.
          </div>
          <button id="agree-google" onclick="window.location.href='/api/auth/google/mock-callback'" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 transform hover:scale-[1.02]">
            Agree & Continue as Ramesh Kumar
          </button>
          <button onclick="window.location.href='http://localhost:3000/login'" class="w-full mt-3 bg-transparent text-gray-400 hover:text-gray-600 hover:underline py-2 text-xs font-semibold">
            Cancel
          </button>
        </div>
      </body>
      </html>
    `);
  } else {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }
});

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'agrisarthi_super_secure_jwt_secret_key_123!',
      { expiresIn: '7d' }
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${token}&userId=${req.user._id}&userName=${encodeURIComponent(req.user.name)}`);
  }
);

app.get('/api/auth/google/mock-callback', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'ramesh@agrisarthi.com' });
    if (!user) {
      user = await User.create({
        name: 'Ramesh Kumar',
        email: 'ramesh@agrisarthi.com',
        googleId: 'mock-google-id',
        password: 'password123'
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'agrisarthi_super_secure_jwt_secret_key_123!',
      { expiresIn: '7d' }
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${token}&userId=${user._id}&userName=${encodeURIComponent(user.name)}`);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GitHub OAuth
app.get('/api/auth/github', (req, res, next) => {
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID.includes('dummy')) {
    // Serve mock consent screen
    res.send(`
      <html>
      <head>
        <title>Authorize AgriSarthi - GitHub</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full border border-gray-200">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold flex items-center justify-center gap-2" style="font-family: 'Baloo 2', cursive;">
              <svg class="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub Authorization
            </h1>
            <p class="text-gray-500 text-sm mt-2 font-semibold">Authorize AgriSarthi AI</p>
          </div>
          <div class="mb-6 bg-gray-55 p-4 rounded-xl text-xs border border-gray-200 text-gray-700 leading-relaxed">
            <strong>AgriSarthi AI</strong> requests access to your public profile and email address.
          </div>
          <button id="agree-github" onclick="window.location.href='/api/auth/github/mock-callback'" class="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 transform hover:scale-[1.02]">
            Authorize mukuldev682
          </button>
          <button onclick="window.location.href='http://localhost:3000/login'" class="w-full mt-3 bg-transparent text-gray-400 hover:text-gray-600 hover:underline py-2 text-xs font-semibold">
            Cancel
          </button>
        </div>
      </body>
      </html>
    `);
  } else {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }
});

app.get('/api/auth/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'agrisarthi_super_secure_jwt_secret_key_123!',
      { expiresIn: '7d' }
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${token}&userId=${req.user._id}&userName=${encodeURIComponent(req.user.name)}`);
  }
);

app.get('/api/auth/github/mock-callback', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'ramesh@agrisarthi.com' });
    if (!user) {
      user = await User.create({
        name: 'Ramesh Kumar',
        email: 'ramesh@agrisarthi.com',
        githubId: 'mock-github-id',
        password: 'password123'
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'agrisarthi_super_secure_jwt_secret_key_123!',
      { expiresIn: '7d' }
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${token}&userId=${user._id}&userName=${encodeURIComponent(user.name)}`);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me - Get current logged-in user profile
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID (Legacy compat)
app.get('/api/users/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ==================== CROP ENDPOINTS ====================

// GET /api/crops - List all crops
app.get('/api/crops', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/crops/:id - Get single crop by ID
app.get('/api/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/crops/search - Search crops by name or season
app.get('/api/crops/search', async (req, res) => {
  try {
    const { q, season } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { nameHindi: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (season) {
      query.season = season;
    }

    const crops = await Crop.find(query);

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/crops - Add new crop (admin only)
app.post('/api/crops', requireAuth, async (req, res) => {
  try {
    const { name, nameHindi, emoji, season, description, diseases } = req.body;

    // Validation
    if (!name || !season) {
      return res.status(400).json({
        success: false,
        message: 'Name and season are required'
      });
    }

    const newCrop = await Crop.create({
      name,
      nameHindi: nameHindi || '',
      emoji: emoji || '🌾',
      season,
      description: description || '',
      diseases: diseases || []
    });

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: newCrop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// PUT /api/crops/:id - Update a crop
app.put('/api/crops/:id', requireAuth, async (req, res) => {
  try {
    const { name, nameHindi, emoji, season, description, diseases } = req.body;

    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      {
        name,
        nameHindi,
        emoji,
        season,
        description,
        diseases
      },
      { new: true, runValidators: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: updatedCrop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DELETE /api/crops/:id - Delete a crop
app.delete('/api/crops/:id', requireAuth, async (req, res) => {
  try {
    const deletedCrop = await Crop.findByIdAndDelete(req.params.id);

    if (!deletedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ==================== CHAT ENDPOINTS ====================

// GET /api/chat/messages - Get chat messages for a user
app.get('/api/chat/messages', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userMessages = await ChatMessage.find({ userId }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: userMessages.length,
      data: userMessages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/chat/messages - Send a chat message
app.post('/api/chat/messages', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, text } = req.body;

    // Validation
    if (!role || !text) {
      return res.status(400).json({
        success: false,
        message: 'Role and text are required'
      });
    }

    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "user" or "assistant"'
      });
    }

    const newMessage = await ChatMessage.create({
      userId,
      role,
      text
    });

    // Generate AI response for user messages using Groq
    if (role === 'user') {
      // Get conversation history for context
      const userHistory = await ChatMessage.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10);

      const conversation = userHistory.reverse().map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // System prompt for AgriSarthi
      const systemPrompt = `You are AgriSarthi, an AI agricultural assistant for farmers in Uttarakhand, India. 
      - Provide practical, actionable advice on crop diseases, pests, fertilizers, and irrigation
      - Respond in Hindi if the user asks in Hindi, otherwise respond in English
      - Be concise and farmer-friendly
      - Focus on organic and sustainable farming practices when possible
      - If unsure, suggest consulting a local agricultural expert
      - Use emojis to make responses friendly and engaging
      - Format responses clearly with bullet points when listing multiple items`;

      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversation
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 1024,
        });

        const aiResponseText = chatCompletion.choices[0]?.message?.content || 
          'मैं आपकी मदद करने में असमर्थ हूँ। कृपया बाद में पुनः प्रयास करें।';

        await ChatMessage.create({
          userId,
          role: 'assistant',
          text: aiResponseText
        });

      } catch (groqError) {
        console.error('Groq API Error:', groqError.message);
        // Fallback response if Groq API fails
        await ChatMessage.create({
          userId,
          role: 'assistant',
          text: '⚠️ AI service is currently unavailable. Please try again later or contact support.'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DELETE /api/chat/messages/:id - Delete a chat message
app.delete('/api/chat/messages/:id', requireAuth, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own messages.'
      });
    }

    await ChatMessage.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ==================== HEALTH CHECK ====================

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriSarthi API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgriSarthi API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
