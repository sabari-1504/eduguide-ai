import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, BookOpen, ExternalLink } from 'lucide-react';

interface College {
  id: number;
  name: string;
  district: string;
  type: string;
  lat: number;
  lng: number;
  established: number;
  courses: number;
  website?: string;
  pincode?: string;
  review?: string;
}

interface CollegeCardProps {
  college: College;
  isSelected: boolean;
  onClick: () => void;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college, isSelected, onClick }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'government':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'private':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'aided':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
            {college.name}
          </h3>
          {college.website && (
            <ExternalLink 
              className="h-4 w-4 text-gray-400 hover:text-blue-600 flex-shrink-0" 
              onClick={(e) => {
                e.stopPropagation();
                window.open(college.website, '_blank');
              }}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{college.district}</span>
          </div>
          {college.pincode && (
            <div className="flex items-center text-xs text-gray-600">
              <span className="ml-4">Pincode: {college.pincode}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>Est. {college.established}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{college.courses}+ Courses</span>
          </div>
          {college.review && (
            <div className="flex items-center text-xs text-gray-600">
              <span className="ml-4">Review: {college.review}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <Badge 
            variant="secondary" 
            className={`text-xs ${getTypeColor(college.type)}`}
          >
            {college.type}
          </Badge>
          {isSelected && (
            <Badge variant="default" className="text-xs bg-blue-600">
              Selected
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
