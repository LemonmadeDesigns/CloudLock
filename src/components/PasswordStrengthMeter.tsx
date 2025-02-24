import React from 'react';
import { analyzePassword, PasswordAnalysis } from '../utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const analysis = analyzePassword(password);
  const Icon = analysis.icon;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${analysis.color}`} />
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                analysis.strength === 'weak'
                  ? 'bg-red-500'
                  : analysis.strength === 'moderate'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
        </div>
        <span className={`text-sm font-medium ${analysis.color} capitalize`}>
          {analysis.strength}
        </span>
      </div>
      {analysis.suggestions.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center gap-1">
              <span>•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}