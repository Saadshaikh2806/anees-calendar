const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Updated schema to match the regular activities
const academicActivitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

// Create a compound index on date and name to ensure uniqueness
academicActivitySchema.index({ date: 1, name: 1 }, { unique: true });

const AcademicActivity = mongoose.model('AcademicActivity', academicActivitySchema);

const activities = [
    {
      "name": "Combined Geo-Scientist (Preliminary)",
      "date": "2025-02-09",
      "description": "Preliminary examination for Geo-Scientist positions"
    },
    {
      "name": "Engineering Services (Preliminary)",
      "date": "2025-02-09",
      "description": "Preliminary examination for Engineering Services"
    },
    {
      "name": "CBI (DSP) LDCE",
      "date": "2025-03-08",
      "description": "Departmental Competitive Examination for CBI"
    },
    {
      "name": "CISF AC(EXE) LDCE-2025",
      "date": "2025-03-09",
      "description": "Central Industrial Security Force Assistant Commandant Executive LDCE"
    },
    {
      "name": "NDA & NA Examination (I)",
      "date": "2025-04-13",
      "description": "National Defence Academy & Naval Academy First Examination"
    },
    {
      "name": "Civil Services (Preliminary)",
      "date": "2025-05-25",
      "description": "UPSC Civil Services Preliminary Examination"
    },
    {
      "name": "IFS/ISS Examination",
      "date": "2025-06-20",
      "description": "Indian Forest Service/Indian Statistical Service Examination"
    },
    {
      "name": "Engineering Services (Main)",
      "date": "2025-06-22",
      "description": "Main examination for Engineering Services"
    },
    {
      "name": "Combined Medical Services",
      "date": "2025-07-20",
      "description": "Examination for Medical Services"
    },
    {
      "name": "Central Armed Police Forces (AC)",
      "date": "2025-08-03",
      "description": "Assistant Commandant Examination"
    },
    {
      "name": "Civil Services (Main)",
      "date": "2025-09-13",
      "description": "UPSC Civil Services Main Examination"
    },
    {
      "name": "NDA & NA Examination (II)",
      "date": "2025-09-14",
      "description": "National Defence Academy & Naval Academy Second Examination"
    },
    {
      "name": "CDS Examination (II)",
      "date": "2025-09-14",
      "description": "Combined Defence Services Examination II"
    },
    {
      "name": "Indian Forest Service (Main)",
      "date": "2025-11-16",
      "description": "Main examination for Indian Forest Service"
    },
    {
      "name": "SO/Steno (GD-B/GD-I) LDCE",
      "date": "2025-12-13",
      "description": "Section Officer/Stenographer Grade B/Grade I LDCE"
    },
    {
      "name": "RBI Grade 'B' (DR)",
      "date": "2024-10-19",
      "description": "Reserve Bank of India Officers in Grade 'B'"
    },
    {
      "name": "IBPS PO/MT",
      "date": "2024-10-19",
      "description": "Institute of Banking Personnel Selection for Probationary Officers/Management Trainees"
    },
    {
      "name": "SSC Hindi Translators",
      "date": "2024-10-01",
      "description": "Staff Selection Commission Combined Hindi Translators Examination"
    },
    {
      "name": "CAT 2024",
      "date": "2024-11-24",
      "description": "Common Admission Test for Indian Institutes of Management"
    },
    {
      "name": "CLAT 2025",
      "date": "2024-12-01",
      "description": "Common Law Admission Test"
    },
    {
      "name": "SSC Stenographer",
      "date": "2024-12-10",
      "description": "Staff Selection Commission Stenographer Grade 'C' & 'D'"
    },
    {
      "name": "SSC Constable (GD)",
      "date": "2025-01-01",
      "description": "Staff Selection Commission Constable (GD) in CAPFs, SSF and Rifleman (GD)"
    },
    {
      "name": "GATE 2025",
      "date": "2025-02-01",
      "description": "Graduate Aptitude Test in Engineering"
    },
    {
      "name": "UPSC Engineering Services",
      "date": "2025-02-09",
      "description": "Union Public Service Commission Engineering Services Examination"
    }
  ]

async function updateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Drop the existing collection to start fresh
    await AcademicActivity.collection.drop();
    console.log('Dropped existing AcademicActivity collection');

    // Create the new compound index
    await AcademicActivity.collection.createIndex({ date: 1, name: 1 }, { unique: true });
    console.log('Created new compound index on date and name fields');

    for (const activity of activities) {
      const result = await AcademicActivity.create(activity);
      console.log(`Inserted activity: ${result.name} on ${result.date}`);
    }

    console.log('Database update completed');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateDatabase();
