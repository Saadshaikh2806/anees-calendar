/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday, differenceInDays, parse, isAfter } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, UserCog } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Inter, Roboto, Poppins } from 'next/font/google'
import axios from 'axios';
import styles from './scrollbar.module.css';
import ToggleSwitch from '@/components/ToggleSwitch';
import { useNotifications } from '@/hooks/useNotifications';
import { Activity } from '@/types'; // Adjust the import path as needed

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] })
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] })

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

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

  const [showAcademicsCalendar, setShowAcademicsCalendar] = useState(false);
  const [academicActivities, setAcademicActivities] = useState<Activity[]>([]);

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const { checkUpcomingEvents } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // 500ms delay, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  const fetchActivities = useCallback(async () => {
    console.log('Fetching activities');
    setIsLoading(true);
    
    try {
      const [regularResponse, academicResponse] = await Promise.all([
        axios.get(`${API_URL}/activities`),
        axios.get(`${API_URL}/academic-activities`)
      ]);

      console.log('Fetched regular activities:', regularResponse.data);
      console.log('Fetched academic activities:', academicResponse.data);
      
      const regularActivitiesMap = new Map(
        regularResponse.data.map((activity: Activity) => [activity.date, activity] as [string, Activity])
      );
      setUniqueActivities(regularActivitiesMap as Map<string, Activity>);
      setAcademicActivities(academicResponse.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    console.log('Current activities:', activities);
    console.log('Current uniqueActivities:', Array.from(uniqueActivities.entries()));
  }, [activities, uniqueActivities]);

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 0) {
      const today = new Date()
      const results = (showAcademicsCalendar ? academicActivities : Array.from(uniqueActivities.values()))
        .filter(activity => 
          activity.name.toLowerCase().includes(term.toLowerCase()) ||
          activity.description.toLowerCase().includes(term.toLowerCase())
        )
        .sort((a, b) => {
          // First, sort by name
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          
          // If names are the same, sort by date
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
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

    // If the result is an academic activity, ensure the academic calendar is shown
    if (showAcademicsCalendar !== academicActivities.some(a => a.date === result.date)) {
      setShowAcademicsCalendar(!showAcademicsCalendar)
    }
  }

  const handleAddActivity = async (date: string) => {
    const newName = prompt('Enter activity name:');
    const newDescription = prompt('Enter activity description:');

    if (newName && newDescription) {
      const newActivity: Activity = {
        date,
        name: newName,
        description: newDescription
      };

      try {
        const response = await axios.post(`${API_URL}/activities`, newActivity);
        console.log('Activity added:', response.data);
        await fetchActivities(); // Refresh the activities after adding
      } catch (error) {
        console.error('Error adding activity:', error);
        alert('Failed to add activity. Please try again.');
      }
    }
  };

  const handleEditActivity = async (date: string) => {
    const activity = uniqueActivities.get(date);
    const newName = prompt('Enter new activity name:', activity?.name || '');
    const newDescription = prompt('Enter new activity description:', activity?.description || '');

    if (newName && newDescription) {
      const updatedActivity: Activity = {
        date,
        name: newName,
        description: newDescription
      };

      try {
        const response = await axios.put(`${API_URL}/activities/${date}`, updatedActivity);
        console.log('Activity updated:', response.data);
        await fetchActivities(); // Refresh the activities after editing
      } catch (error) {
        console.error('Error updating activity:', error);
        alert('Failed to update activity. Please try again.');
      }
    }
  };

  const handleDeleteActivity = async (date: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`${API_URL}/activities/${date}`);
        console.log('Activity deleted');
        await fetchActivities(); // Refresh the activities after deleting
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity. Please try again.');
      }
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

  const handleAcademicActivity = (date: string, action: 'add' | 'edit') => {
    const activity = academicActivities.find(a => a.date === date);
    const newName = prompt(action === 'add' ? 'Enter academic activity name:' : 'Enter new academic activity name:', activity?.name || '');
    const newDescription = prompt(action === 'add' ? 'Enter academic activity description:' : 'Enter new academic activity description:', activity?.description || '');

    if (newName && newDescription) {
      const updatedActivity: Activity = {
        date,
        name: newName,
        description: newDescription
      };

      const apiAction = action === 'add' ? 'post' : 'put';
      const apiUrl = action === 'add' ? `${API_URL}/academic-activities` : `${API_URL}/academic-activities/${date}`;

      axios[apiAction](apiUrl, updatedActivity)
        .then(response => {
          console.log(`Academic activity ${action}ed:`, response.data);
          setAcademicActivities(prevActivities => {
            const newActivities = prevActivities.filter(a => a.date !== date);
            return [...newActivities, response.data];
          });
          setCalendarKey(prevKey => prevKey + 1);
        })
        .catch(error => {
          console.error(`Error ${action}ing academic activity:`, error);
          alert(`Failed to ${action} academic activity. Please try again.`);
        });
    }
  };

  const handleDeleteAcademicActivity = (date: string) => {
    if (confirm('Are you sure you want to delete this academic activity?')) {
      axios.delete(`${API_URL}/academic-activities/${date}`)
        .then(() => {
          console.log('Academic activity deleted');
          setAcademicActivities(prevActivities => prevActivities.filter(a => a.date !== date));
          setCalendarKey(prevKey => prevKey + 1);
        })
        .catch(error => {
          console.error('Error deleting academic activity:', error);
          alert('Failed to delete academic activity. Please try again.');
        });
    }
  };

  useEffect(() => {
    if (showAcademicsCalendar) {
      console.log('Fetching academic activities');
      setIsLoading(true);
      axios.get(`${API_URL}/academic-activities`)
        .then(response => {
          console.log('Fetched academic activities:', response.data);
          setAcademicActivities(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching academic activities:', error);
          setIsLoading(false);
        });
    }
  }, [showAcademicsCalendar]);

  useEffect(() => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const activities = showAcademicsCalendar
      ? academicActivities.filter(a => a.date === dateString)
      : Array.from(uniqueActivities.values()).filter(a => a.date === dateString);
    setSelectedActivities(activities);
  }, [selectedDate, showAcademicsCalendar, academicActivities, uniqueActivities]);

  useEffect(() => {
    const allActivities = [...Array.from(uniqueActivities.values()), ...academicActivities];
    
    // Check immediately when component mounts
    checkUpcomingEvents(allActivities);

    // Function to schedule the next check at 12 PM
    const scheduleNextCheck = () => {
      const now = new Date();
      const nextNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
      
      // If it's already past noon, schedule for tomorrow
      if (now > nextNoon) {
        nextNoon.setDate(nextNoon.getDate() + 1);
      }
      
      const msUntilNextCheck = nextNoon.getTime() - now.getTime();
      
      return setTimeout(() => {
        checkUpcomingEvents(allActivities);
        // Schedule the next check
        scheduleNextCheck();
      }, msUntilNextCheck);
    };

    // Initial scheduling
    const timeoutId = scheduleNextCheck();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [uniqueActivities, academicActivities, checkUpcomingEvents]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-2 md:p-3 lg:p-4 pt-[calc(0.5rem-7.5px)] md:pt-3 lg:pt-4 ${inter.className}">
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
          className="w-full max-w-6xl mx-auto bg-white rounded-xl overflow-hidden relative z-10 flex flex-col flex-grow"
          variants={fadeInUp}
          transition={pageTransition}
        >
          {/* Header */}
          <motion.header 
            initial="hidden"
            animate="visible"
            variants={fadeInDown} 
            transition={pageTransition} 
            className="bg-white p-1 sm:p-2 lg:p-3 rounded-lg mb-1 sm:mb-2 lg:mb-3 border-b border-gray-200 -mt-2 sm:mt-0" // Added -mt-4 for mobile
          >
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col sm:flex-row items-center mb-2 sm:mb-0"> 
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px] relative -mt-8 sm:-mt-2 md:-mt-6 lg:-mt-10 mb-2 sm:mb-0 sm:mr-4"> 
                  <Image 
                    src="/1.webp" 
                    alt="ANEES Logo" 
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <h1 className={`text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-black ${roboto.className} leading-tight text-center sm:text-left -mt-6 sm:-mt-4 md:-mt-6 lg:-mt-8 mb-0 sm:mb-0 sm:-ml-3 md:-ml-5 lg:-ml-7`}>
                    Anees Defence Career Institute
                  </h1>
                  <h2 className={`text-lg md:text-xl lg:text-2xl font-semibold text-blue-600 mt-0 sm:mt-0`}>
                    <span className={poppins.className}>
                      {showAcademicsCalendar ? "Academics Calendar" : "Daily Activity Calendar"}
                    </span>
                  </h2>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center sm:justify-start space-x-4 w-full sm:w-auto mt-2 sm:mt-0">
                {isAdminLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 text-xs sm:text-sm md:text-base text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full shadow-md"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowAdminModal(true)} 
                    className="px-2 py-1 text-xs sm:text-sm md:text-base text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full shadow-md"
                  >
                    <span className="flex items-center justify-center">
                      <UserCog className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Admin
                    </span>
                  </button>
                )}
                <ToggleSwitch
                  label="Academics Calendar"
                  checked={showAcademicsCalendar}
                  onChange={() => setShowAcademicsCalendar(!showAcademicsCalendar)}
                  size="small"
                />
              </div>
            </div>
          </motion.header>
          
          {/* Main content */}
          <motion.main 
            initial="hidden"
            animate="visible"
            variants={fadeInUp} 
            transition={pageTransition} 
            className="flex-grow p-2 md:p-3 text-gray-800 overflow-hidden flex flex-col mb-2 md:mb-4" // Removed top margin
          >
            <div className="flex items-center justify-end mb-1 md:mb-2">
              <div className="relative w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-7 pr-2 py-1 md:py-1.5 border border-gray-300 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="p-2 md:p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <p className="font-semibold text-xs md:text-sm">{result.name}</p>
                        <p className="text-[10px] md:text-xs text-gray-600">{format(parseISO(result.date), 'MMMM d, yyyy')}</p>
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
                  className="flex-grow bg-white rounded-xl shadow-md p-1 md:p-2 mb-2 md:mb-0 border border-gray-200 overflow-hidden flex flex-col md:h-[calc(80vh-240px)] md:w-[calc(100%-20rem)]"
                >
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <button
                      onClick={() => {
                        setCurrentMonth(subMonths(currentMonth, 1))
                        setCalendarKey(prev => prev + 1)
                      }}
                      className="bg-blue-500 p-1.5 md:p-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </button>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-blue-600">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <button
                      onClick={() => {
                        setCurrentMonth(addMonths(currentMonth, 1))
                        setCalendarKey(prev => prev + 1)
                      }}
                      className="bg-blue-500 p-1.5 md:p-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </button>
                  </div>
                  <div className={`grid grid-cols-7 gap-1 md:gap-2 flex-grow overflow-y-auto pb-2 md:pb-4 ${styles.customScrollbar}`}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="text-center font-semibold text-blue-600 text-xs md:text-sm lg:text-base p-1 md:p-2">
                        {day}
                      </div>
                    ))}
                    {monthDays.map((day) => {
                      const dateString = format(day, 'yyyy-MM-dd');
                      const activities = showAcademicsCalendar
                        ? academicActivities.filter(a => a.date === dateString)
                        : Array.from(uniqueActivities.values()).filter(a => a.date === dateString);
                      const isSelected = isSameDay(day, selectedDate);
                      const isCurrentDay = isToday(day);
                      return (
                        <motion.div
                          key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`}
                          whileHover={{ scale: 1.05 }}
                          className={`p-0.5 md:p-1 m-0.5 md:m-1 rounded-[0.3rem] ${
                            isSameMonth(day, currentMonth) ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-blue-50'
                          } ${
                            isSelected ? 'ring-2 ring-blue-400' : ''
                          } ${
                            isCurrentDay ? 'bg-blue-300' : ''
                          } flex flex-col transition-all relative overflow-hidden h-full min-h-[2.5rem] md:min-h-[3.5rem]`}
                        >
                          <button
                            onClick={() => setSelectedDate(day)}
                            className="flex flex-col h-full w-full text-left"
                          >
                            <span className={`text-xs md:text-sm text-black ${
                              isSelected || isCurrentDay ? 'font-bold' : ''
                            } z-10 relative`}>
                              {format(day, 'd')}
                            </span>
                            {activities.length > 0 && (
                              <div className="mt-auto w-full">
                                {activities.map((activity, index) => (
                                  <p key={index} className="font-medium text-black text-[10px] md:text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap w-full block">
                                    {activity.name}
                                  </p>
                                ))}
                              </div>
                            )}
                          </button>
                          {isAdminLoggedIn && (
                            <div className="absolute top-0 right-0 flex flex-col sm:flex-row">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showAcademicsCalendar
                                    ? handleAcademicActivity(dateString, activities.length > 0 ? 'edit' : 'add')
                                    : activities.length > 0
                                    ? handleEditActivity(dateString)
                                    : handleAddActivity(dateString);
                                }}
                                className="bg-blue-500 text-white text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs md:text-sm p-0.5 xxs:p-1 sm:p-1.5 rounded-tr sm:rounded-tr-none sm:rounded-tl"
                              >
                                {activities.length > 0 ? 'E' : 'A'}
                              </button>
                              {activities.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showAcademicsCalendar
                                      ? handleDeleteAcademicActivity(dateString)
                                      : handleDeleteActivity(dateString);
                                  }}
                                  className="bg-red-500 text-white text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs md:text-sm p-0.5 xxs:p-1 sm:p-1.5 rounded-tr"
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
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full md:w-80 bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-2 md:p-3 flex flex-col border border-gray-200 h-[140px] md:h-[calc(80vh-240px)] mb-4 md:mb-0 overflow-y-auto ${styles.hideScrollbar}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <h3 className="text-sm md:text-base lg:text-lg font-semibold text-black">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </div>
                {selectedActivities.map((activity, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 md:p-3 rounded-xl shadow-md mb-2 md:mb-3">
                    <h4 className="text-sm md:text-base lg:text-lg font-semibold text-black mb-1 md:mb-2 px-2 py-1">{activity.name}</h4>
                    <p className="text-xs md:text-sm text-black px-2 py-1">{activity.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.main>
          
          {/* Footer */}
          <motion.footer variants={fadeInUp} transition={pageTransition} className="bg-white/80 text-gray-600 p-1 border-t border-gray-200 mt-auto rounded-b-xl">
            <div className="text-center text-[10px] md:text-xs">
              <p>&copy; {new Date().getFullYear()} Anees Defence Career Institute. All rights reserved.</p>
              <p className="mt-1">
                Programmed by{' '}
                <a
                  href="https://www.linkedin.com/in/saad-shaikh-5b7774258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" // Replace with Saad's actual LinkedIn profile URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Saad Shaikh
                </a>
              </p>
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
                src="/1.webp" 
                alt="ANEES Logo" 
                width={250}  // Increased from 150
                height={250} // Increased from 150
                className="animate-pulse"
              />
            </motion.div>
          </motion.div>        )}
      </AnimatePresence>

      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-[90%]">
            <h2 className="text-xl font-bold mb-4 text-black">Admin Login</h2>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
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
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors"
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

