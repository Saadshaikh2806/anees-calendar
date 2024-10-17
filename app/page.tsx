'use client'
import React, { useState, useMemo } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Meteors } from '@/components/ui/MeteorEffect'
import { motion } from 'framer-motion'
import Image from 'next/image'

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

function generateUniqueActivities() {
  const activityMap = new Map()

  for (let i = 0; i < 366; i++) {
    const date = new Date(2024, 0, i + 1)
    const dateString = format(date, 'yyyy-MM-dd')
    const activity = activities[i % activities.length] // Cycle through activities
    activityMap.set(dateString, { ...activity, date: dateString })
  }

  return activityMap
}

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const uniqueActivities = useMemo(() => generateUniqueActivities(), [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const selectedActivity = uniqueActivities.get(format(selectedDate, 'yyyy-MM-dd'))

  return (
    <div className="h-screen flex flex-col bg-black p-2 md:p-3 lg:p-4">
      <div className="flex-grow relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={70} />
        </div>
        <motion.div 
          className="w-full max-w-6xl mx-auto bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col flex-grow"
          initial={{ boxShadow: '0 0 0 0 rgba(147, 51, 234, 0)' }}
          animate={{ boxShadow: '0 0 30px 10px rgba(147, 51, 234, 0.5)' }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <header className="bg-gray-800/80 text-white py-4 px-4 border-b border-purple-500/30">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 relative mb-3">
                <Image 
                  src="/1.png" 
                  alt="ANEES Logo" 
                  layout="fill"
                  objectFit="cover"
                  className="invert"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">ANEES Defence Career Institute</h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-200 mt-1">Empowering young minds for a brighter future</p>
              </div>
            </div>
          </header>
          <main className="flex-grow p-2 md:p-3 text-white overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Daily Activity Calendar</h2>
              <span className="text-xs md:text-sm text-gray-400">
                Brought to you by{' '}
                <a
                  href="https://www.instagram.com/saad__shaikh___/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Saad Shaikh
                </a>
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 flex-grow overflow-hidden">
              <div className="flex-grow bg-gray-800/70 rounded-xl shadow-lg p-2 md:p-3 mb-3 md:mb-0 border border-purple-500/30 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="bg-purple-600 p-1 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <h3 className="text-sm md:text-base lg:text-lg font-bold text-purple-300">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="bg-purple-600 p-1 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 flex-grow">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-400 text-xs md:text-sm">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((day) => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const activity = uniqueActivities.get(dateString);
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    return (
                      <motion.div
                        key={day.toISOString()}
                        whileHover={{ scale: 1.05 }}
                        className={`p-1 rounded-[0.3rem] ${
                          isSameMonth(day, currentMonth) ? 'bg-gray-700' : 'bg-gray-800'
                        } ${
                          isSelected ? 'ring-2 ring-purple-500' : ''
                        } ${
                          isCurrentDay ? 'bg-purple-600' : ''
                        } flex flex-col transition-all relative overflow-hidden h-full`}
                      >
                        <button
                          onClick={() => setSelectedDate(day)}
                          className="flex flex-col h-full w-full text-left"
                        >
                          <span className={`text-xs md:text-sm ${
                            isSameMonth(day, currentMonth) ? 'text-gray-100' : 'text-gray-400'
                          } ${
                            isSelected || isCurrentDay ? 'font-bold' : ''
                          } z-10 relative`}>
                            {format(day, 'd')}
                          </span>
                          {activity && (
                            <div className="mt-auto w-full">
                              <p className="font-medium text-purple-200 text-[0.6rem] md:text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap w-full block">
                                {activity.name}
                              </p>
                            </div>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {selectedActivity && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full md:w-80 lg:w-96 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 flex flex-col border border-purple-500/30 h-[180px] md:h-full"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                      {format(parseISO(selectedActivity.date), 'MMMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="bg-gray-700/80 p-3 md:p-4 rounded-lg shadow-inner flex-grow overflow-y-auto">
                    <h4 className="text-base md:text-lg lg:text-xl font-semibold text-purple-300 mb-2 md:mb-3">{selectedActivity.name}</h4>
                    <p className="text-sm md:text-base text-gray-200">{selectedActivity.description}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
          <footer className="bg-gray-800/80 text-gray-400 p-2 md:p-3 border-t border-purple-500/30">
            <div className="text-center text-xs">
              <p>&copy; {new Date().getFullYear()} ANEES Defence Career Institute. All rights reserved.</p>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}
