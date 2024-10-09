const express = require('express'); const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS package
const Init = require('./models/Init'); // Adjust the path as necessary
const User = require('./models/User');
const path = require('path');
const app = express();



app.use(express.json());
app.use(cors()); // Allow all domains by default

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/instagram').then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log('MongoDB connection error: ', err);
});


app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'instagram.ico'))
})

// Endpoint to check initialization and update if necessary
app.get('/init', async (req, res) => {
  try {
    // Find the initialization document
    const initDoc = await Init.findOne();

    if (!initDoc) {
      return res.status(404).json({ error: 'Initialization document not found', status: 404 });
    }

    // Check if isTrue is true
    if (initDoc.isTrue) {
      // Update isTrue to false
      initDoc.isTrue = false;
      await initDoc.save(); // Save the changes

      // Return true indicating successful initialization and update
      return res.json({ message: 'Initialized and updated to false', initState: true });
    } else {
      // If it's already false, return false
      return res.json({ message: 'Already initialized to false', initState: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});

// Endpoint to set 'isTrue' to true
app.put('/init/set-true', async (req, res) => {
  try {
    // Find the initialization document
    const initDoc = await Init.findOne();

    if (!initDoc) {
      return res.status(404).json({ error: 'Initialization document not found', status: 404 });
    }

    // Set isTrue to true
    initDoc.isTrue = true;
    await initDoc.save(); // Save the changes

    // Return a response indicating the update was successful
    return res.json({ message: 'Initialization state set to true', initState: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});


// Endpoint to update 'follows_back' and 'visited' properties by username
app.put('/user/username/:username/update-status', async (req, res) => {
  const { follows_back, visited } = req.body;

  try {
    // Find and update the user by username, allowing partial updates
    const user = await User.findOneAndUpdate(
      { username: req.params.username }, // Find by username
      {
        follows_back,
        visited
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found', status: 404 });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});


// Endpoint to update only 'visiting' property by username
app.put('/user/username/:username/visiting', async (req, res) => {
  const { visiting } = req.body;

  // Log the incoming request
  console.log(`Received request to update visiting status for user: ${req.params.username}`);

  try {
    // Ensure the 'visiting' property is passed in the request body
    if (visiting === undefined) {
      console.log('Error: Visiting property is required');
      return res.status(400).json({ error: 'Visiting property is required', status: 400 });
    }

    // Find and update the 'visiting' property of the user by username
    const user = await User.findOneAndUpdate(
      { username: req.params.username }, // Find by username
      { visiting }, // Update the visiting field
      { new: true } // Return the updated document
    );

    if (!user) {
      console.log(`Error: User not found with username: ${req.params.username}`);
      return res.status(404).json({ error: 'User not found', status: 404 });
    }

    // Log the updated user
    console.log(`Successfully updated visiting status for user: ${user.username}`, user);
    res.json(user);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});


app.post('/user/add', async (req, res) => {
  const { username, href, fullName, profilePicture } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists', status: 400 });
    }

    // Create a new user
    const newUser = new User({
      username,
      href,
      name:fullName,
      profilePicture,
      follows_back: false,  // Default value
      visited: false        // Default value
    });
    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Return the saved user object
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});


// Endpoint to get a user where 'visited' is false, limit 1
app.get('/user/unvisited', async (req, res) => {
  try {
    // Find one user where 'visited' is false
    const user = await User.findOne({
      $or: [
        { visited: false },
        { visited: { $exists: false } } // Check if the 'visited' field doesn't exist
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'No unvisited user found', status: 404 });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});

// Endpoint to get a user where 'visiting' is true and 'visited' is false
app.get('/user/visiting-unvisited', async (req, res) => {
  try {
    // Attempt to find a user where 'visiting' is true and 'visited' is false
    let user = await User.findOne({
      visiting: true,
      $or: [
        { visited: false },
        { visited: { $exists: false } } // If 'visited' field doesn't exist, treat as false
      ]
    });

    // If no user found, try to get any unvisited user for the initial case
    if (!user) {
      user = await User.findOne({
        $or: [
          { visited: false },
          { visited: { $exists: false } } // Check if the 'visited' field doesn't exist
        ]
      });
    }

    // If still no user found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'No user found currently being visited and unvisited', status: 404 });
    }

    // Return the found user
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message, status: 500 });
  }
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀  Server is running on port: ${PORT}`);
  console.log(`👉  Visit: http://localhost:${PORT}`);
  console.log('==========================================');
});