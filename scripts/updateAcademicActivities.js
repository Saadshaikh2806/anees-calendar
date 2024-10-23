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

const activities = 
[
  {
    "name": "IOQM",
    "date": "2023-09-08",
    "description": "Exam for students from 8TH TO 12TH standard"
  },
  {
    "name": "Agniveer Vayu",
    "date": "2023-10-18",
    "description": "Exam for 10+2 students"
  },
  {
    "name": "BSc Data science",
    "date": "2023-10-27",
    "description": "Exam for 12TH PLUS students"
  },
  {
    "name": "NSEA (Astronomy)",
    "date": "2023-11-23",
    "description": "Exam for 11th & 12th students"
  },
  {
    "name": "NSEP (Physics)",
    "date": "2023-11-24",
    "description": "Exam for 11th & 12th students"
  },
  {
    "name": "NSEC (Chemistry)",
    "date": "2023-11-24",
    "description": "Exam for 11th & 12th students"
  },
  {
    "name": "NSEB (Biology)",
    "date": "2023-11-24",
    "description": "Exam for 11th & 12th students"
  },
  {
    "name": "NSEJS (Junior Science)",
    "date": "2023-11-24",
    "description": "Exam for 8th to 10th students"
  },
  {
    "name": "RIMC",
    "date": "2023-12-01",
    "description": "Exam for students appearing or cleared 7th Std"
  },
  {
    "name": "CLAT (LAW)",
    "date": "2023-12-01",
    "description": "Exam for 12th students any stream"
  },
  {
    "name": "SLAT (SYMBIOSIS LAW)",
    "date": "2023-12-13",
    "description": "Exam for 12th students"
  },
  {
    "name": "JNV 6TH",
    "date": "2024-01-18",
    "description": "Exam for students appearing or cleared 5th Std"
  },
  {
    "name": "UCEED (DESIGN)",
    "date": "2024-01-19",
    "description": "Exam for 12th students"
  },
  {
    "name": "UPSC GEO SCIENTIST",
    "date": "2024-02-09",
    "description": "Exam for MASTERS students"
  },
  {
    "name": "HOMI BHABHA",
    "date": "2023-11-19",
    "description": "Exam for 6th or 9th std students"
  },
  {
    "name": "NASA TRAINING PROGRAM",
    "date": "2023-10-22",
    "description": "Exam for 6TH - 12TH students"
  },
  {
    "name": "SSC CGL",
    "date": "2023-09-25",
    "description": "Exam details not fully specified in the image"
  },
  {
    "name": "Reserve Bank of India Recruitment of Officers in Grade 'B' (DR) 2024",
    "date": "2024-10-19",
    "description": "Phase II, Graduation with 60% marks, Age Limit: 21-30 Yrs"
  },
  {
    "name": "Institute of Banking Personnel Selection (IBPS) Common Recruitment Process for Recruitment of Probationary Officers/Management Trainees in Participating Banks",
    "date": "2024-10-19",
    "description": "Online Exam - Preliminary (Day 1), Graduation in any discipline from a recognised University or equivalent, Age Limit: 20-30 Yrs"
  },
  {
    "name": "Institute of Banking Personnel Selection (IBPS) Common Recruitment Process for Recruitment of Probationary Officers/Management Trainees in Participating Banks",
    "date": "2024-10-20",
    "description": "Online Exam - Preliminary (Day 2), Graduation in any discipline from a recognised University or equivalent, Age Limit: 20-30 Yrs"
  },
  {
    "name": "Institute of Banking Personnel Selection (IBPS) Common Recruitment Process for Recruitment of Probationary Officers/Management Trainees in Participating Banks",
    "date": "2024-11-30",
    "description": "Main, Graduation in any discipline from a recognised University or equivalent, Age Limit: 20-30 Yrs"
  },
  {
    "name": "Staff Selection Commission Combined Hindi Translators Examination 2024",
    "date": "2024-10-01",
    "description": "Day 1, Varies, Max. 30 Yrs"
  },
  {
    "name": "Staff Selection Commission Combined Hindi Translators Examination 2024",
    "date": "2024-11-30",
    "description": "Day 2, Varies, Max. 30 Yrs"
  },
  {
    "name": "CAT 2024 Common Admission Test conducted by Indian Institutes of Management",
    "date": "2024-11-24",
    "description": "Computer Based (in three sessions), Graduation from a recognised University"
  },
  {
    "name": "CLAT 2025 Common Law Admission Test",
    "date": "2024-12-01",
    "description": "12th Standard Pass with 45% Marks"
  },
  {
    "name": "Staff Selection Commission Stenographer Grade 'C' & 'D' Exam 2024",
    "date": "2024-12-10",
    "description": "Day 1, 12th Standard Pass, Varies"
  },
  {
    "name": "Staff Selection Commission Stenographer Grade 'C' & 'D' Exam 2024",
    "date": "2024-12-11",
    "description": "Day 2, 12th Standard Pass, Varies"
  },
  {
    "name": "Staff Selection Commission Constable (GD) in CAPFs, SSF and Rifleman (GD) in Assam Rifles and Sepoy in Narcotics Control Bureau Exam 2025",
    "date": "2025-01-01",
    "description": "Computer Based (Day 1), Matriculation or 10th Class Exam from a recognised Board/University, Age Limit: 18-23 Yrs"
  },
  {
    "name": "Staff Selection Commission Constable (GD) in CAPFs, SSF and Rifleman (GD) in Assam Rifles and Sepoy in Narcotics Control Bureau Exam 2025",
    "date": "2025-02-28",
    "description": "Computer Based (Last Day), Matriculation or 10th Class Exam from a recognised Board/University, Age Limit: 18-23 Yrs"
  },
  {
    "name": "GATE 2025 Graduate Aptitude Test in Engineering",
    "date": "2025-02-01",
    "description": "Computer Based Test (Day 1), Graduate in Engineering/Technology etc, Varies"
  },
  {
    "name": "GATE 2025 Graduate Aptitude Test in Engineering",
    "date": "2025-02-02",
    "description": "Computer Based Test (Day 2), Graduate in Engineering/Technology etc, Varies"
  },
  {
    "name": "GATE 2025 Graduate Aptitude Test in Engineering",
    "date": "2025-02-15",
    "description": "Computer Based Test (Day 3), Graduate in Engineering/Technology etc, Varies"
  },
  {
    "name": "GATE 2025 Graduate Aptitude Test in Engineering",
    "date": "2025-02-16",
    "description": "Computer Based Test (Day 4), Graduate in Engineering/Technology etc, Varies"
  },
  {
    "name": "Union Public Service Commission Civil Services Examination, 2025",
    "date": "2025-02-09",
    "description": "Preliminary, Degree/Diploma (Engg.), M.Sc., Master's Degree (Relevant Disciplines), Age Limit: 21-30 Yrs"
  },
  {
    "name": "Union Public Service Commission Civil Services Examination, 2025",
    "date": "2025-06-22",
    "description": "Main, Degree/Diploma (Engg.), M.Sc., Master's Degree (Relevant Disciplines), Age Limit: 21-30 Yrs"
  },
  {
    "name": "Union Public Service Commission Combined Geo-Scientist Examination, 2025",
    "date": "2025-02-09",
    "description": "Stage-I, Varies, Age Limit: 21-32 Yrs"
  },
  {
    "name": "Union Public Service Commission Combined Geo-Scientist Examination, 2025",
    "date": "2025-06-21",
    "description": "Stage-II (Day 1), Varies, Age Limit: 21-32 Yrs"
  },
  {
    "name": "Union Public Service Commission Combined Geo-Scientist Examination, 2025",
    "date": "2025-06-22",
    "description": "Stage-II (Day 2), Varies, Age Limit: 21-32 Yrs"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-01-11",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "Combined Geo-Scientist (Preliminary) Examination, 2025",
    "date": "2025-02-09",
    "description": "Duration: 1 DAY, Notification Date: 04.09.2024, Last Date for Applications: 24.09.2024"
  },
  {
    "name": "Engineering Services (Preliminary) Examination, 2025",
    "date": "2025-02-09",
    "description": "Duration: 1 DAY, Notification Date: 18.09.2024, Last Date for Applications: 08.10.2024"
  },
  {
    "name": "CBI (DSP) LDCE",
    "date": "2025-03-08",
    "description": "Duration: 2 DAYS, Notification Date: 27.11.2024, Last Date for Applications: 17.12.2024"
  },
  {
    "name": "CISF AC(EXE) LDCE-2025",
    "date": "2025-03-09",
    "description": "Duration: 1 DAY, Notification Date: 04.12.2024, Last Date for Applications: 24.12.2024"
  },
  {
    "name": "NDA & NA Examination (I), 2025",
    "date": "2025-04-13",
    "description": "Duration: 1 DAY, Notification Date: 11.12.2024, Last Date for Applications: 31.12.2024"
  },
  {
    "name": "CDS Examination (I), 2025",
    "date": "2025-04-13",
    "description": "Duration: 1 DAY, Notification Date: 11.12.2024, Last Date for Applications: 31.12.2024"
  },
  {
    "name": "Civil Services (Preliminary) Examination, 2025",
    "date": "2025-05-25",
    "description": "Duration: 1 DAY, Notification Date: 22.01.2025, Last Date for Applications: 11.02.2025"
  },
  {
    "name": "Indian Forest Service (Preliminary) Examination, 2025 through CSE",
    "date": "2025-05-25",
    "description": "Duration: 1 DAY, Notification Date: 22.01.2025, Last Date for Applications: 11.02.2025"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-06-14",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "I.E.S./I.S.S. Examination, 2025",
    "date": "2025-06-20",
    "description": "Duration: 3 DAYS, Notification Date: 12.02.2025, Last Date for Applications: 04.03.2025"
  },
  {
    "name": "Combined Geo-Scientist (Main) Examination, 2025",
    "date": "2025-06-21",
    "description": "Duration: 3 DAYS"
  },
  {
    "name": "Engineering Services (Main) Examination, 2025",
    "date": "2025-06-22",
    "description": "Duration: 1 DAY"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-07-05",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "Combined Medical Services Examination, 2025",
    "date": "2025-07-20",
    "description": "Duration: 1 DAY, Notification Date: 19.02.2025, Last Date for Applications: 11.03.2025"
  },
  {
    "name": "Central Armed Police Forces (ACs) Examination, 2025",
    "date": "2025-08-03",
    "description": "Duration: 1 DAY, Notification Date: 05.03.2025, Last Date for Applications: 25.03.2025"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-08-09",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "Civil Services (Main) Examination, 2025",
    "date": "2025-09-23",
    "description": "Duration: 5 DAYS"
  },
  {
    "name": "N.D.A. & N.A. Examination (II), 2025",
    "date": "2025-09-14",
    "description": "Duration: 1 DAY, Notification Date: 28.05.2025, Last Date for Applications: 17.06.2025"
  },
  {
    "name": "C.D.S. Examination (II), 2025",
    "date": "2025-09-14",
    "description": "Duration: 1 DAY, Notification Date: 28.05.2025, Last Date for Applications: 17.06.2025"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-10-04",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-11-01",
    "description": "Duration: 2 DAYS"
  },
  {
    "name": "Indian Forest Service (Main) Examination, 2025",
    "date": "2025-11-16",
    "description": "Duration: 7 DAYS"
  },
  {
    "name": "S.O./Steno (GD-B/GD-I) LDCE",
    "date": "2025-12-13",
    "description": "Duration: 2 DAYS, Notification Date: 17.09.2025, Last Date for Applications: 07.10.2025"
  },
  {
    "name": "Reserved for UPSC RT/ Examination",
    "date": "2025-12-20",
    "description": "Duration: 2 DAYS"
  }
]

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

async function updateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Ensure the compound index exists
    await AcademicActivity.collection.createIndex({ date: 1, name: 1 }, { unique: true });
    console.log('Ensured compound index on date and name fields');

    for (const activity of activities) {
      try {
        const result = await AcademicActivity.findOneAndUpdate(
          { date: activity.date, name: activity.name },
          activity,
          { upsert: true, new: true }
        );
        console.log(`Upserted activity: ${result.name} on ${result.date}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Skipped duplicate activity: ${activity.name} on ${activity.date}`);
        } else {
          throw err;
        }
      }
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
