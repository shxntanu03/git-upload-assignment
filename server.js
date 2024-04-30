// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Student Model
const Student = mongoose.model('Student', {
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_marks: Number
});

// Middleware
app.use(bodyParser.json());

// Routes

// Create a Database called student
app.post('/createDB', async (req, res) => {
  try {
    await Student.createCollection();
    res.status(200).json({ message: 'Database created successfully' });
  } catch (error) {
    console.error('Error creating database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a collection called studentmarks
app.post('/createCollection', async (req, res) => {
  try {
    res.status(200).json({ message: 'Collection created successfully' });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Insert array of documents in above Collection
app.post('/insertDocuments', async (req, res) => {
  try {
    const students = req.body;
    await Student.insertMany(students);
    res.status(201).json({ message: 'Documents inserted successfully' });
  } catch (error) {
    console.error('Error inserting documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Display total count of documents
app.get('/totalCount', async (req, res) => {
  try {
    const totalCount = await Student.countDocuments();
    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error getting total count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List all the documents
app.get('/listAll', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error listing all documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List the names of students who got more than 20 marks in DSBDA Subject
app.get('/moreThan20DSBDA', async (req, res) => {
  try {
    const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, 'Name');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error listing students with more than 20 marks in DSBDA:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update the marks of specified students by 10
app.put('/updateMarks', async (req, res) => {
  try {
    await Student.updateMany({}, { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } });
    res.status(200).json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List the names who got more than 25 marks in all subjects
app.get('/moreThan25AllSubjects', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $gt: 25 },
      CC_Marks: { $gt: 25 },
      DSBDA_Marks: { $gt: 25 },
      CNS_Marks: { $gt: 25 },
      AI_marks: { $gt: 25 }
    }, 'Name');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error listing high scorers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List the names who got less than 40 in both Maths and Science
app.get('/lessThan40MathsScience', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $lt: 40 },
      CC_Marks: { $lt: 40 }
    }, 'Name');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error listing weak students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove specified student document from collection
app.delete('/removeStudent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Display the Students data in Browser in tabular format
app.get('/tabularFormat', async (req, res) => {
  try {
    const students = await Student.find({}, 'Name Roll_No WAD_Marks DSBDA_Marks CNS_Marks CC_Marks AI_marks');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error getting students data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
