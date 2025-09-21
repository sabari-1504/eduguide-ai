import React from 'react';
import { motion } from 'framer-motion';
import { ConvAICharacter } from '../types/convai';

interface CharacterSelectorProps {
  characters: ConvAICharacter[];
  currentCharacter: ConvAICharacter | null;
  onCharacterSelect: (characterId: string) => void;
  disabled?: boolean;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  currentCharacter,
  onCharacterSelect,
  disabled = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Your AI Assistant</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {characters.map((character) => (
          <motion.button
            key={character.id}
            onClick={() => !disabled && onCharacterSelect(character.id)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              currentCharacter?.id === character.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{character.avatar}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {character.name}
                  {currentCharacter?.id === character.id && (
                    <span className="ml-2 text-blue-600 text-sm">✓ Active</span>
                  )}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {character.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {character.expertise?.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {character.expertise && character.expertise.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{character.expertise.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;