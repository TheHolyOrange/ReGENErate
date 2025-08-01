// server.js
const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');

//MongoDb connection
const MONGO_URI = 'mongodb://localhost:27017/reGENErate';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Enable JSON parsing for incoming requests
app.use(express.json());

// POST endpoint to receive GPS data
// app.post('/user', (req, res) => {
//   const {UserName, ActionChosen, TimeStamp} = req.body;
//   console.log('recieved user data', {UserName, ActionChosen, TimeStamp});
//   res.status(200).json({ message: 'User Data recieved' });
// });

// Start server
app.listen(port, () => {
  console.log(`🚀 Express server listening at http://localhost:${port}`);
});

const EcoAction = require('./models/EcoAction');
const User = require('./models/User');

app.post('/logAction', async (req, res) => {
  const { userId, actionId, actionName, geneType, points, photoUrl } = req.body;

  try {
    const newAction = new EcoAction({
      userId,
      actionId,
      actionName,
      geneType,
      points,
      photoUrl
    });

    await newAction.save();

    // Optionally update score and streak
    await User.findByIdAndUpdate(userId, {
      $inc: { score: points, streak: points > 0 ? 1 : -1 }
    });

    res.status(200).json({ message: 'Action logged successfully' });
  } catch (error) {
    console.error('❌ Error logging action:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//THIS IS TEMPORARY FOR DUMMY DATA

// app.get('/initUser', async (req, res) => {
//   const user = new User({
//     email: 'test@example.com',
//     username: 'Test1',
//     passwordHash: 'hashedvalue123'
//   });

//   await user.save();
//   res.json({ message: 'User created', userId: user._id });
// });

