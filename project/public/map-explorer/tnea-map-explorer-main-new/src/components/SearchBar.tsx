import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { College } from '@/data/types';

interface SearchBarProps {
  colleges: College[];
  onFilteredColleges: (colleges: College[]) => void;
  onCollegeSelect?: (college: College) => void;
  districts: string[];
  value?: string;
  onValueChange?: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  colleges, 
  onFilteredColleges, 
  onCollegeSelect,
  districts,
  value,
  onValueChange
}) => {
  const [searchName, setSearchName] = useState(value || '');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredCount, setFilteredCount] = useState(colleges.length);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<College[]>([]);

  const allDistricts = Array.from(new Set(colleges.map(c => c.district))).sort();

  useEffect(() => {
    if (typeof value === 'string' && value !== searchName) {
      setSearchName(value);
    }
  }, [value]);

  useEffect(() => {
    let filtered = colleges;

    // Filter by college name
    if (searchName.trim()) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchName.toLowerCase())
      );
      // Update suggestions for dropdown
      setSearchSuggestions(filtered.slice(0, 8)); // Show top 8 suggestions
    } else {
      setSearchSuggestions([]);
    }

    // Filter by district
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(college => college.district === selectedDistrict);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(college => {
        const type = (college.type || '').toLowerCase();
        if (selectedType === 'Autonomous') return type.includes('autonomous');
        if (selectedType === 'Government') return type.includes('government');
        if (selectedType === 'Aided') return type.includes('aided');
        return type.includes('private');
      });
    }

    setFilteredCount(filtered.length);
    onFilteredColleges(filtered);

    // Select the college if exactly one match (auto-select)
    if (filtered.length === 1 && onCollegeSelect) {
      onCollegeSelect(filtered[0]);
    } else if (onCollegeSelect && !searchName.trim()) {
      // Only deselect if the search box is empty
      onCollegeSelect(undefined);
    }
  }, [searchName, selectedDistrict, selectedType, colleges, onFilteredColleges, onCollegeSelect]);

  const handleCollegeSelect = (college: College) => {
    setSearchName(college.name);
    setShowSuggestions(false);
    if (onCollegeSelect) {
      onCollegeSelect(college);
    }
  };

  const clearFilters = () => {
    setSearchName('');
    setSelectedDistrict('all');
    setSelectedType('all');
  };

  const hasActiveFilters = searchName.trim() || selectedDistrict !== 'all' || selectedType !== 'all';

  const handleSuggestionSelect = (college) => {
    setSearchName(college.name);
    setShowSuggestions(false);
    // Clear other filters to ensure the college shows up
    setSelectedDistrict('all');
    setSelectedType('all');
    // Immediately select the college for instant map update
    if (onCollegeSelect) onCollegeSelect(college);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2 w-full">
      {/* Large College Name Search */}
      <div className="relative flex-1 max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for a college..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
            if (onValueChange) onValueChange(e.target.value);
            const value = e.target.value;
            if (!value.trim() && onCollegeSelect) {
              onCollegeSelect(undefined);
            } else if (value.trim()) {
              const filtered = colleges.filter(college =>
                college.name.toLowerCase().includes(value.toLowerCase())
              );
              if (filtered.length === 1 && onCollegeSelect) {
                onCollegeSelect(filtered[0]);
              }
            }
          }}
          onFocus={() => setShowSuggestions(searchName.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchSuggestions.length === 1) {
              handleSuggestionSelect(searchSuggestions[0]);
            }
          }}
          className="pl-10 pr-8 py-2 rounded-md border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow w-full transition-all duration-200 placeholder-gray-400 font-semibold"
          style={{ minWidth: '180px' }}
        />
        {/* Clear Button */}
        {searchName && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
            onClick={() => {
              setSearchName('');
              setSelectedDistrict('all');
              setSelectedType('all');
              setShowSuggestions(false);
              if (onValueChange) onValueChange('');
            }}
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 min-w-[180px] w-full overflow-y-auto">
            {searchSuggestions.map((college) => (
              <div
                key={college.id}
                className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                onClick={() => handleSuggestionSelect(college)}
                title={college.name}
              >
                <span className="truncate font-medium text-gray-800 flex-1 text-base" style={{ maxWidth: 120 }}>{college.name}</span>
                <span className="truncate text-xs text-gray-500" style={{ maxWidth: 80 }}>{college.district}</span>
              </div>
            ))}
          </div>
        )}
        {/* Show message if no college found */}
        {showSuggestions && searchSuggestions.length === 0 && searchName.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] w-full p-2 text-gray-500 text-sm">
            No college found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
