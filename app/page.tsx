/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday, differenceInDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, UserCog } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Inter, Roboto } from 'next/font/google'
import axios from 'axios';
import styles from './scrollbar.module.css';

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] })

const activities = [
  { name: 'Science Quiz', description: 'Test your knowledge on various scientific topics with fun quizzes.' },
  { name: 'Creative Writing', description: 'Develop storytelling skills through guided writing prompts.' },
  { name: 'Math Challenge', description: 'Solve engaging mathematical problems and puzzles.' },
  { name: 'Fitness Circuit', description: 'Perform bodyweight exercises to boost physical health.' },
  { name: 'Art Workshop', description: 'Use basic materials like pencils, paper, and colors to express creativity.' },
  { name: 'History Exploration', description: 'Dive into historical events through interactive storytelling.' },
  { name: 'Coding Basics', description: 'Learn basic coding concepts using free online platforms.' },
  { name: 'Environmental Project', description: 'Participate in neighborhood cleanup or simple eco-friendly initiatives.' },
  { name: 'Public Speaking', description: 'Practice communication skills with impromptu speaking activities.' },
  { name: 'Team Building', description: 'Engage in fun group games that require collaboration and leadership.' },
  { name: 'Music Appreciation', description: 'Explore different music genres and their impact using accessible music platforms.' },
  { name: 'Geography Adventure', description: 'Use free online tools to explore countries, cultures, and geography.' },
  { name: 'Debate Club', description: 'Improve critical thinking through structured debates on age-appropriate topics.' },
  { name: 'Science Experiment', description: 'Conduct simple home experiments like vinegar and baking soda reactions.' },
  { name: 'Literature Circle', description: 'Discuss a shared reading of short stories or articles to enhance comprehension.' },
  { name: 'Career Exploration', description: 'Research different career paths and create a vision board for the future.' },
  { name: 'Financial Literacy', description: 'Play interactive financial literacy games to learn budgeting and saving.' },
  { name: 'Mindfulness Session', description: 'Practice mindfulness techniques like breathing exercises or guided meditation.' },
  { name: 'Technology Workshop', description: 'Learn about emerging technologies through discussions and online resources.' },
  { name: 'Cultural Exchange', description: 'Engage in discussions about different cultures with classmates.' },
  { name: 'Drama Club', description: 'Practice acting and improvisation through simple role-playing games.' },
  { name: 'Puzzle Solving', description: 'Work on logic puzzles, riddles, and brain teasers.' },
  { name: 'Foreign Language Basics', description: 'Use free apps to learn basic phrases of a new language.' },
  { name: 'Yoga & Meditation', description: 'Follow online tutorials for simple yoga poses and meditation practices.' },
  { name: 'Chess Club', description: 'Play chess with friends to develop strategic thinking and focus.' },
  { name: 'Journalism Workshop', description: 'Write articles on school events or local news to practice journalism.' },
  { name: 'Community Service Project', description: 'Help with small, local community projects like planting trees or tutoring.' },
  { name: 'Gardening Club', description: 'Learn about basic gardening with small home or school garden projects.' },
  { name: 'Film Analysis', description: 'Watch films on free streaming platforms and discuss themes and techniques.' },
  { name: 'Poetry Writing', description: 'Write original poems inspired by nature, feelings, or events.' },
  { name: 'Nutrition and Healthy Eating', description: 'Discuss and learn about balanced meals and healthy eating habits.' },
  { name: 'Debate Mastery', description: 'Sharpen your debate techniques with quick, thought-provoking debate topics.' },
  { name: 'First Aid Training', description: 'Learn the basics of first aid through instructional videos.' },
  { name: 'Critical Thinking Games', description: 'Engage in thought-provoking problem-solving activities like “what if” scenarios.' },
  { name: 'Time Management Skills', description: 'Use a simple planner or app to learn how to organize and prioritize tasks.' },
  { name: 'Personal Development Workshop', description: 'Set personal goals and work on confidence-building activities.' },
  { name: 'Memory Boosting Games', description: 'Play memory games like recalling lists, matching cards, or mental math.' },
  { name: 'Doodle & Sketch Class', description: 'Practice simple drawing or doodling techniques with paper and pencils.' },
  { name: 'Origami Workshop', description: 'Use basic paper to create origami figures and shapes.' },
  { name: 'Speed Reading', description: 'Learn speed reading techniques by practicing with articles or short stories.' },
  { name: 'Self-Defense Basics', description: 'Learn basic self-defense moves using video tutorials and practice with a friend.' },
  { name: 'Spelling Bee Challenge', description: 'Host a spelling challenge with classmates or friends.' },
  { name: 'Storytelling Through Comics', description: 'Draw basic comic strips to tell creative stories.' },
  { name: 'Speechwriting Workshop', description: 'Write and practice delivering speeches on interesting topics.' },
  { name: 'Map Reading Skills', description: 'Practice reading maps and navigating using free online resources.' },
  { name: 'Civic Engagement', description: 'Participate in discussions about current events and civic responsibilities.' },
  { name: 'Improv Comedy', description: 'Play fun improvisation games with friends to enhance creativity and spontaneity.' },
  { name: 'Social Media Literacy', description: 'Discuss responsible social media usage and its impact on mental health.' },
  { name: 'Ethical Dilemmas', description: 'Discuss and solve simple ethical dilemmas to build critical thinking skills.' },
  { name: 'Self-Care Workshop', description: 'Learn simple self-care techniques like journaling, relaxation, or positive affirmations.' },
  
  // Adding 50 more activities
  { name: 'Journal Writing', description: 'Write personal reflections and observations in a journal to develop self-awareness.' },
  { name: 'Letter Writing', description: 'Write a letter to a friend or family member and practice communication skills.' },
  { name: 'Simple Biology Experiments', description: 'Explore biology with simple experiments like growing plants from seeds.' },
  { name: 'Local History Exploration', description: 'Research interesting historical events from your local community.' },
  { name: 'Current Events Discussion', description: 'Engage in conversations about current events to build awareness of global issues.' },
  { name: 'Peer Tutoring', description: 'Help classmates understand difficult topics through peer tutoring.' },
  { name: 'Riddle Solving', description: 'Challenge yourself and friends with fun and tricky riddles.' },
  { name: 'Personal Budgeting', description: 'Create a basic budget for yourself to learn financial management.' },
  { name: 'Gratitude Journaling', description: 'Write down things you are grateful for to cultivate a positive mindset.' },
  { name: 'Book Review Writing', description: 'Read a book and write a review to practice critical thinking.' },
  { name: 'Virtual Field Trip', description: 'Take a virtual tour of museums or historical landmarks online.' },
  { name: 'Sketching from Nature', description: 'Draw scenes from nature, like plants and trees, in your backyard or park.' },
  { name: 'Positive Affirmations', description: 'Write and practice saying positive affirmations to build self-confidence.' },
  { name: 'Career Interview', description: 'Interview someone about their job to learn more about different careers.' },
  { name: 'Public Speaking Practice', description: 'Practice giving short speeches on topics you enjoy.' },
  { name: 'Local Landmark Exploration', description: 'Research and visit important landmarks in your community.' },
  { name: 'Simple Chemistry Experiments', description: 'Do simple chemistry activities like mixing common household substances.' },
  { name: 'Word Games', description: 'Play word games like Scrabble or Boggle to improve vocabulary.' },
  { name: 'Book Club', description: 'Start a small book club with friends and discuss a book together.' },
  { name: 'Mind Mapping', description: 'Create mind maps to visually organize thoughts and ideas on paper.' },
  { name: 'Neighborhood Exploration Walk', description: 'Take a walk around your neighborhood and document what you observe.' },
  { name: 'Simple Animation Creation', description: 'Use free tools to create simple animations on your computer or phone.' },
  { name: 'Photography Walk', description: 'Take a walk and capture interesting sights with your phone camera.' },
  { name: 'Inspirational Quote Writing', description: 'Write and share inspirational quotes with friends and family.' },
  { name: 'Personal Timeline Creation', description: 'Create a timeline of important events in your life to reflect on your journey.' },
  { name: 'Personal Strengths Assessment', description: 'Reflect on your personal strengths and how you can use them.' },
  { name: 'Simple Handicrafts', description: 'Create simple crafts using materials like paper, string, and glue.' },
  { name: 'Listening Skills Practice', description: 'Practice active listening with a friend to improve communication.' },
  { name: 'Online Educational Games', description: 'Play free online games that challenge your knowledge and skills.' },
  { name: 'Peer Mentoring', description: 'Mentor a younger student to help them with their studies or personal growth.' },
  { name: 'Stress-Relief Techniques', description: 'Learn and practice simple stress-relief techniques like deep breathing.' },
  { name: 'Cartoon Drawing', description: 'Learn to draw simple cartoon characters using tutorials.' },
  { name: 'Basic Robotics', description: 'Learn the basics of robotics through free online tutorials.' },
  { name: 'Interview Role Play', description: 'Practice job interview skills with a partner through role-playing.' },
  { name: 'Group Problem-Solving Games', description: 'Work in groups to solve hypothetical challenges or escape-room type puzzles.' },
  { name: 'Peer-led Discussions', description: 'Host discussions on topics that interest you to build leadership skills.' },
  { name: 'Virtual Collaboration', description: 'Work on a virtual group project using online tools.' },
  { name: 'Graphic Design Basics', description: 'Learn simple graphic design using free software like Canva or GIMP.' },
  { name: 'Photography Competition', description: 'Organize a fun photography competition with friends using phone cameras.' },
  { name: 'Research a Scientific Topic', description: 'Choose a science topic that interests you and research it in depth.' },
  { name: 'Creative Presentation', description: 'Create a presentation on a hobby or passion and share it with friends or family.' },
  { name: 'Public Poll Creation', description: 'Create a simple poll on an interesting topic and gather opinions from classmates.' },
  { name: 'Simple DIY Projects', description: 'Use common household items to create simple Do-It-Yourself projects.' },
  { name: 'Nature Photography', description: 'Capture interesting elements of nature like trees, birds, or the sky.' },
  { name: 'Ethics Case Studies', description: 'Discuss ethical case studies and come up with solutions as a group.' },
  { name: 'Non-verbal Communication Games', description: 'Play games that require communicating without using words.' },
  { name: 'Photo Essay', description: 'Create a photo essay documenting a day in your life.' },
  { name: 'Storytelling from Photos', description: 'Choose a photo and create a backstory or fictional tale about it.' }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -20, filter: "blur(10px)" },
  transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
}



const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

interface Activity {
  date: string;
  name: string;
  description: string;
}
//----
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/.netlify/functions/api';
console.log('API_URL:', API_URL);

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Activity[]>([])
  const [calendarKey, setCalendarKey] = useState(0)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const [uniqueActivities, setUniqueActivities] = useState<Map<string, Activity>>(new Map());
  const [activities, setActivities] = useState<Activity[]>([]);

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const selectedActivity = uniqueActivities.get(format(selectedDate, 'yyyy-MM-dd'))

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // 500ms delay, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Fetching activities from:', API_URL);
    setIsLoading(true);
    console.log('Fetching activities from:', `${API_URL}/activities`);
    axios.get(`${API_URL}/activities`)
      .then(response => {
        console.log('Fetched activities:', response.data);
        if (response.data.length === 0) {
          console.log('No activities found, initializing default activities');
          const defaultActivities = generateDefaultActivities();
          axios.post(`${API_URL}/activities/initialize`, defaultActivities)
            .then(() => {
              console.log('Default activities initialized');
              setUniqueActivities(new Map(defaultActivities.map(a => [a.date, a])));
              setActivities(defaultActivities);
            })
            .catch(error => console.error('Error initializing activities:', error));
        } else {
          console.log('Setting activities from API response');
          const activityMap = new Map(
            response.data.map((a: Activity) => [a.date, a])
          ) as Map<string, Activity>;
          setUniqueActivities(activityMap);
          setActivities(response.data);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        setIsLoading(false);
      });
  }, []); // Empty dependency array

  useEffect(() => {
    console.log('Current activities:', activities);
    console.log('Current uniqueActivities:', Array.from(uniqueActivities.entries()));
  }, [activities, uniqueActivities]);

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 0) {
      const today = new Date()
      const results = Array.from(uniqueActivities.values())
        .filter(activity => 
          activity.name.toLowerCase().includes(term.toLowerCase()) ||
          activity.description.toLowerCase().includes(term.toLowerCase())
        )
        .sort((a, b) => {
          const diffA = Math.abs(differenceInDays(parseISO(a.date), today))
          const diffB = Math.abs(differenceInDays(parseISO(b.date), today))
          return diffA - diffB
        })
        .slice(0, 5) // Limit to 5 results
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSearchResultClick = (result: Activity) => {
    const resultDate = parseISO(result.date)
    setSelectedDate(resultDate)
    setCurrentMonth(startOfMonth(resultDate))
    setCalendarKey(prev => prev + 1) // Trigger re-render for animation
    setSearchTerm('')
    setSearchResults([])
  }

  const handleEditActivity = (date: string) => {
    const activity = uniqueActivities.get(date);
    const newName = prompt('Enter new activity name:', activity?.name);
    const newDescription = prompt('Enter new activity description:', activity?.description);

    if (newName && newDescription) {
      axios.put(`${API_URL}/activities/${date}`, { name: newName, description: newDescription })
        .then(response => {
          console.log('Activity updated:', response.data);
          const updatedActivity: Activity = response.data;
          setUniqueActivities(prevActivities => {
            const newActivities = new Map(prevActivities);
            newActivities.set(date, updatedActivity);
            return newActivities as Map<string, Activity>;
          });
          setActivities(prevActivities => 
            prevActivities.map(a => a.date === date ? updatedActivity : a)
          );
          setCalendarKey(prevKey => prevKey + 1);
        })
        .catch(error => {
          console.error('Error updating activity:', error);
          alert('Failed to update activity. Please try again.');
        });
    }
  };

  const handleDeleteActivity = (date: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      axios.delete(`${API_URL}/activities/${date}`)
        .then(() => {
          console.log('Activity deleted');
          setUniqueActivities(prevActivities => {
            const newActivities = new Map(prevActivities);
            newActivities.delete(date);
            return newActivities as Map<string, Activity>;
          });
          setActivities(prevActivities => prevActivities.filter(a => a.date !== date));
          setCalendarKey(prevKey => prevKey + 1);
        })
        .catch(error => {
          console.error('Error deleting activity:', error);
          alert('Failed to delete activity. Please try again.');
        });
    }
  };

  const handleLogout = () => {
    // Save activities to local storage
    localStorage.setItem('activities', JSON.stringify(Array.from(uniqueActivities.entries())));
    
    // Reset admin state
    setIsAdminLoggedIn(false);
    
    // Optionally, you might want to reset other admin-related states here
    
    alert('Logged out successfully. Activities have been saved.');
  };

  console.log('isAdminLoggedIn:', isAdminLoggedIn);

  return (
    <div className={`h-screen flex flex-col bg-white p-2 md:p-3 lg:p-4 ${inter.className}`}>
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0.3 }}
        animate={{ 
          filter: showContent ? "blur(0px)" : "blur(10px)",
          opacity: showContent ? 1 : 0.3
        }}
        transition={{ duration: 0.5 }}
        className="flex-grow relative overflow-hidden flex flex-col"
      >
        <motion.div 
          className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 flex flex-col flex-grow"
          variants={fadeInUp}
          transition={pageTransition}
        >
          {/* Header */}
          <motion.header variants={fadeInUp} transition={pageTransition} className="bg-gray-100 text-gray-800 pt-1 pb-2 px-4 border-b border-gray-200 relative shadow-sm">
            <div className="absolute top-1 right-2 text-xs text-gray-600">
              Brought to you by{' '}
              <a
                href="https://www.instagram.com/saad__shaikh___/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Saad Shaikh
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden flex-shrink-0 relative mb-1">
                <Image 
                  src="/1.png" 
                  alt="ANEES Logo" 
                  width={500}
                  height={500}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="-mt-16"> {/* Changed from -mt-20 to -mt-16 */}
                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 ${roboto.className}`}>ANEES Defence Career Institute</h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-700">Empowering young minds for a brighter future</p>
              </div>
            </div>
            <div className="absolute top-1 left-2 flex items-center">
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full shadow-md"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <button onClick={() => setShowAdminModal(true)} className="text-gray-600 hover:text-blue-600 transition-colors">
                  <UserCog className="h-6 w-6" />
                </button>
              )}
            </div>
          </motion.header>
          
          {/* Main content */}
          <motion.main variants={fadeInUp} transition={pageTransition} className="flex-grow p-2 md:p-3 text-gray-800 overflow-hidden flex flex-col shadow-inner mb-4"> {/* Added mb-4 here */}
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h2 className={`text-lg md:text-xl lg:text-2xl font-semibold text-blue-600 ${roboto.className}`}>Daily Activity Calendar</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 pr-2 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <p className="font-semibold">{result.name}</p>
                        <p className="text-sm text-gray-600">{format(parseISO(result.date), 'MMMM d, yyyy')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 flex-grow overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={calendarKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow bg-white rounded-xl shadow-md p-2 md:p-3 mb-3 md:mb-0 border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => {
                        setCurrentMonth(subMonths(currentMonth, 1))
                        setCalendarKey(prev => prev + 1)
                      }}
                      className="bg-blue-500 p-1 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-blue-600">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <button
                      onClick={() => {
                        setCurrentMonth(addMonths(currentMonth, 1))
                        setCalendarKey(prev => prev + 1)
                      }}
                      className="bg-blue-500 p-1 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className={`grid grid-cols-7 gap-1 md:gap-2 flex-grow overflow-y-auto pb-4 ${styles.customScrollbar}`}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="text-center font-semibold text-blue-600 text-xs md:text-sm">
                        {day}
                      </div>
                    ))}
                    {monthDays.map((day) => {
                      const dateString = format(day, 'yyyy-MM-dd');
                      const activity = uniqueActivities.get(dateString);
                      console.log(`Date: ${dateString}, Activity:`, activity);
                      const isSelected = isSameDay(day, selectedDate);
                      const isCurrentDay = isToday(day);
                      return (
                        <motion.div
                          key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`}
                          whileHover={{ scale: 1.05 }}
                          className={`p-1 rounded-[0.3rem] ${
                            isSameMonth(day, currentMonth) ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gray-50'
                          } ${
                            isSelected ? 'ring-2 ring-blue-400' : ''
                          } ${
                            isCurrentDay ? 'bg-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''
                          } flex flex-col transition-all relative overflow-hidden h-full min-h-[3rem] md:min-h-[4rem]`}
                        >
                          <button
                            onClick={() => setSelectedDate(day)}
                            className="flex flex-col h-full w-full text-left"
                          >
                            <span className={`text-xs md:text-sm ${
                              isSameMonth(day, currentMonth) ? 'text-black' : 'text-gray-400'
                            } ${
                              isSelected || isCurrentDay ? 'font-bold' : ''
                            } z-10 relative`}>
                              {format(day, 'd')}
                            </span>
                            {activity && (
                              <div className="mt-auto w-full">
                                <p className="font-medium text-black text-[0.6rem] md:text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap w-full block">
                                  {activity.name}
                                </p>
                              </div>
                            )}
                          </button>
                          {isAdminLoggedIn && (
                            <div className="absolute top-0 right-0 flex md:flex-row flex-col">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditActivity(dateString);
                                }}
                                className="bg-blue-500 text-white text-[0.5rem] md:text-xs p-0.5 md:p-1 rounded-tl md:rounded-tr-none"
                              >
                                {activity ? 'E' : 'A'}
                              </button>
                              {activity && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteActivity(dateString);
                                  }}
                                  className="bg-red-500 text-white text-[0.5rem] md:text-xs p-0.5 md:p-1 rounded-tr"
                                >
                                  D
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {selectedActivity && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full md:w-80 lg:w-96 bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-3 md:p-4 flex flex-col border border-gray-200 h-[180px] md:h-full"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-black">
                      {format(parseISO(selectedActivity.date), 'MMMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="bg-white/80 p-3 md:p-4 rounded-lg shadow-md flex-grow overflow-y-auto">
                    <h4 className="text-base md:text-lg lg:text-xl font-semibold text-black mb-2 md:mb-3">{selectedActivity.name}</h4>
                    <p className="text-sm md:text-base text-black">{selectedActivity.description}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.main>
          
          {/* Footer */}
          <motion.footer variants={fadeInUp} transition={pageTransition} className="bg-white/80 text-gray-600 p-1 md:p-2 border-t border-gray-200 shadow-md mt-auto"> {/* Added mt-auto here */}
            <div className="text-center text-xs">
              <p>&copy; {new Date().getFullYear()} ANEES Defence Career Institute. All rights reserved.</p>
            </div>
          </motion.footer>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {(isLoading || !showContent) && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <Image 
                src="/1.png" 
                alt="ANEES Logo" 
                width={250}  // Increased from 150
                height={250} // Increased from 150
                className="animate-pulse"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Admin Login</h2>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (adminPassword === 'admin123') { // Replace with actual secure password
                    setIsAdminLoggedIn(true)
                    setShowAdminModal(false)
                    setAdminPassword('')
                  } else {
                    alert('Incorrect password')
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Login
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function generateDefaultActivities(): Activity[] {
  const defaultActivities: Activity[] = [];
  const activities = [
    { name: 'Read a book', description: 'Spend 30 minutes reading' },
    { name: 'Exercise', description: '30 minutes of physical activity' },
    { name: 'Learn something new', description: 'Study a new topic for 1 hour' },
    // Add more default activities as needed
  ];

  for (let i = 0; i < 366; i++) {
    const date = new Date(2024, 0, i + 1);
    const dateString = format(date, 'yyyy-MM-dd');
    const activity = activities[i % activities.length];
    defaultActivities.push({ ...activity, date: dateString });
  }
  return defaultActivities;
}

console.log('API function loaded');