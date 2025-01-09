const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const LoggedUser = require("./loggedUsers");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/mkdocs", express.static(path.join(__dirname, "mkdocs")));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/formData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Predefined users data
const predefinedUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123", // Store plaintext password or hash it (see next section for hashing)
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password456", // Same here
  },
];

// Insert predefined users if they don't already exist
predefinedUsers.forEach(async (user) => {
  const existingUser = await LoggedUser.findOne({ email: user.email });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password with 10 salt rounds
    const newUser = new LoggedUser({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(`Added new user: ${user.name}`);
  }
});

//Sign up route for user to sign up
app.post("/signup", async (req, res) => {
  const { name, email, password, status = "user" } = req.body;

  try {
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Validate password
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      )
    ) {
      return res
        .status(400)
        .send(
          "Password must be at least 6 characters long and include letters, numbers, and special characters."
        );
    }

    // Check if the email already exists
    const existingUser = await LoggedUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    // Determine the user's status based on the email domain
    let status = "user"; // Default status
    const emailDomain = email.split("@")[1]; // Extract the domain

    if (emailDomain === "ee.iitb.ac.in") {
      status = "professor";
    } else if (emailDomain === "iitb.ac.in") {
      status = "user";
    } else {
      return res.status(400).send("You are not eligible for signup.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new LoggedUser({
      name,
      email,
      password: hashedPassword,
      status,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).send("Signup successful");
  } catch (error) {
    console.error("Error during signup:", error.message || error);
    res.status(500).send("Server error. Please try again later.");
  }
});

// POST route for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await LoggedUser.findOne({ email });

    if (!user) {
      return res.status(400).send("Email or password is incorrect");
    }

    // Debug: Check the user object
    console.log("User fetched from DB:", user);

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Email or password is incorrect");
    }

    // Send the user data including status as JSON
    res.status(200).json({ status: user.status });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Create a Schema and Model for contact form
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});
const Form = mongoose.model("Form", formSchema);

// API Endpoint to Save Data
app.post("/submit", async (req, res) => {
  try {
    const formData = new Form(req.body);
    await formData.save();
    res.status(200).send("Data saved successfully!");
  } catch (error) {
    res.status(500).send("Error saving data.");
  }
});




// FROM HERE THE CODE FOR SUBMITTING THE VIDEO AND FETCHING VIDEOS STARTS 

// Video Schema
const videoSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  url: String, // For YouTube URL
  videoFile: String, // For uploaded video file
});

const Video = mongoose.model('Video', videoSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Let Multer use the file's directory
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage });

// Middlewares
app.use(cors()); // Enable CORS for frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve uploaded videos

app.post('/api/add-video', upload.single('videoFile'), async (req, res) => {
  try {

    console.log('Request body:', req.body); // Log form data except file
    console.log('Uploaded file details:', req.file); // Log file details


    const { title, subtitle, description, url } = req.body;
    let videoFile = null;

    // Check if the video is uploaded from a file
    if (req.file) {
      videoFile = `/uploads/${req.file.filename}`;
    }

    // Ensure that either 'url' or 'videoFile' is provided, but not both
    if (url && videoFile) {
      return res.status(400).send({ error: 'Cannot provide both YouTube link and video file.' });
    }

    const newVideo = new Video({
      title,
      subtitle,
      description,
      url: url || null, 
  videoFile: videoFile || null,
    });

    await newVideo.save();
    res.status(200).send('Video uploaded successfully!');
  } catch (err) {
    res.status(500).send('Error uploading video.');
  }
});


// Fetch all videos route
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find(); // Fetch all videos from MongoDB
    res.json(videos); // Return videos as JSON
  } catch (err) {
    res.status(500).send('Error fetching videos.');
  }
});


// Start the Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
