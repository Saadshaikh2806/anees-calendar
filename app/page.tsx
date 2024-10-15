'use client'
import React, { useState, useMemo } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Shield } from 'lucide-react'

const activities = [
  { name: 'Science Quiz', description: 'Test your knowledge on various scientific topics.' },
  { name: 'Creative Writing', description: 'Develop your storytelling skills through guided writing prompts.' },
  { name: 'Math Challenge', description: 'Solve engaging mathematical problems and puzzles.' },
  { name: 'Fitness Circuit', description: 'Complete a series of age-appropriate exercises to boost physical health.' },
  { name: 'Art Workshop', description: 'Express yourself through different art mediums and techniques.' },
  { name: 'History Exploration', description: 'Dive into fascinating historical events and figures.' },
  { name: 'Coding Basics', description: 'Learn fundamental coding concepts through interactive exercises.' },
  { name: 'Environmental Project', description: 'Participate in eco-friendly initiatives and learn about sustainability.' },
  { name: 'Public Speaking', description: 'Practice communication skills through fun speaking activities.' },
  { name: 'Team Building', description: 'Engage in group activities to enhance collaboration and leadership.' },
  { name: 'Music Appreciation', description: 'Explore different music genres and their cultural significance.' },
  { name: 'Geography Adventure', description: 'Embark on a virtual tour of world geography and cultures.' },
  { name: 'Debate Club', description: 'Develop critical thinking skills through structured debates.' },
  { name: 'Science Experiment', description: 'Conduct hands-on experiments to learn about scientific principles.' },
  { name: 'Literature Circle', description: 'Discuss age-appropriate books and enhance reading comprehension.' },
  { name: 'Career Exploration', description: 'Learn about various career paths and their requirements.' },
  { name: 'Financial Literacy', description: 'Understand basic financial concepts through interactive games.' },
  { name: 'Mindfulness Session', description: 'Practice mindfulness techniques to improve focus and reduce stress.' },
  { name: 'Technology Workshop', description: 'Explore emerging technologies and their impact on society.' },
  { name: 'Cultural Exchange', description: 'Learn about different cultures through virtual exchanges.' },
]

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

export default function Home()  {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const uniqueActivities = useMemo(() => generateUniqueActivities(), [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const selectedActivity = uniqueActivities.get(format(selectedDate, 'yyyy-MM-dd'))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 p-6">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-indigo-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full">
              <Shield className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ANEES Defence Career Institute</h1>
              <p className="mt-1 text-indigo-200">Empowering young minds for a brighter future</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-4">
            
            {/* Removed About and Contact tabs */}
          </nav>
        </header>
        <main className="p-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Daily Activity Calendar</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                >
                  <ChevronLeft className="h-6 w-6 text-indigo-600" />
                </button>
                <h3 className="text-xl font-semibold text-indigo-800">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                >
                  <ChevronRight className="h-6 w-6 text-indigo-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-indigo-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 rounded-lg text-center ${
                      isSameMonth(day, currentMonth)
                        ? 'hover:bg-indigo-100 transition-colors duration-200'
                        : 'text-gray-400'
                    } ${
                      isSameDay(day, selectedDate)
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg shadow-md p-6">
              {selectedActivity ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <CalendarIcon className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-indigo-800">
                      {format(parseISO(selectedActivity.date), 'MMMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <h4 className="text-lg font-semibold text-indigo-600 mb-2">{selectedActivity.name}</h4>
                    <p className="text-gray-700">{selectedActivity.description}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">Select a date to view the activity</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="bg-indigo-800 text-white p-4 mt-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} ANEES Defence Career Institute. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
