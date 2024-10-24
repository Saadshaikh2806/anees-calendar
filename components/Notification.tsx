import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

interface NotificationProps {
  regularActivities: string;
  academicActivities: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ regularActivities, academicActivities, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 bg-white text-black p-4 rounded-xl shadow-lg max-w-md mx-auto z-50 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 0.5, delay: 0.3, repeat: 2 }}
              >
                <Bell size={24} className="mr-3 text-blue-500" />
              </motion.div>
              <h3 className="text-lg font-bold text-blue-600">New Notifications</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>
          <div className="space-y-2 text-sm">
            <NotificationItem title="Upcoming Activity" content={regularActivities} />
            <NotificationItem title="Upcoming Competative Exam" content={academicActivities} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationItem: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-blue-50 p-3 rounded-lg">
    <p className="font-semibold text-blue-700 mb-1">{title}:</p>
    <p className="text-gray-700">{content || 'None'}</p>
  </div>
);

export default Notification;
