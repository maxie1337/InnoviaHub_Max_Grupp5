import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClose, MdHistory } from 'react-icons/md';

interface SearchBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onToggle }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('admin-recent-searches', JSON.stringify(newRecentSearches));
      
      // Perform search
      console.log('Searching for:', query);
      setQuery('');
      onToggle();
    }
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    // Perform search
    console.log('Searching for:', search);
    onToggle();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('admin-recent-searches');
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        <MdSearch className="w-4 h-4 mr-3" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-400 rounded">
          ⌘K
        </kbd>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-25"
              onClick={onToggle}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Search Input */}
              <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users, bookings, resources..."
                    className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Search Results / Recent Searches */}
              <div className="max-h-64 overflow-y-auto">
                {query ? (
                  // Search Results
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Search results for "{query}"
                    </div>
                    {/* TODO: Implement actual search results */}
                    <div className="mt-2 text-sm text-gray-400">
                      No results found
                    </div>
                  </div>
                ) : (
                  // Recent Searches
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MdHistory className="w-4 h-4 mr-2" />
                        Recent Searches
                      </div>
                      {recentSearches.length > 0 && (
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {recentSearches.length > 0 ? (
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearch(search)}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                          >
                            <MdHistory className="w-4 h-4 mr-3 text-gray-400" />
                            {search}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        No recent searches
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search Shortcuts */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Search shortcuts:
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    users:name
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    bookings:date
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    resources:type
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;




