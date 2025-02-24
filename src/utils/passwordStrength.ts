import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export interface PasswordAnalysis {
  score: number; // 0-100
  strength: 'weak' | 'moderate' | 'strong';
  color: string;
  icon: typeof AlertTriangleIcon | typeof CheckCircleIcon | typeof XCircleIcon;
  suggestions: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length < 8) {
    suggestions.push('Use at least 8 characters');
  } else if (password.length >= 12) {
    score += 25;
  } else {
    score += 15;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Include uppercase letters');
  } else {
    score += 20;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    suggestions.push('Include lowercase letters');
  } else {
    score += 20;
  }

  // Numbers check
  if (!/\d/.test(password)) {
    suggestions.push('Include numbers');
  } else {
    score += 20;
  }

  // Special characters check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    suggestions.push('Include special characters');
  } else {
    score += 20;
  }

  // Common patterns check
  const commonPatterns = [
    /^123/, /password/i, /qwerty/i, /abc/i,
    /admin/i, /letmein/i, /welcome/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score -= 20;
    suggestions.push('Avoid common password patterns');
  }

  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    suggestions.push('Avoid repeating characters');
  }

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  // Determine strength
  let strength: 'weak' | 'moderate' | 'strong';
  let color: string;
  let icon;

  if (score < 50) {
    strength = 'weak';
    color = 'text-red-600';
    icon = XCircleIcon;
  } else if (score < 80) {
    strength = 'moderate';
    color = 'text-yellow-600';
    icon = AlertTriangleIcon;
  } else {
    strength = 'strong';
    color = 'text-green-600';
    icon = CheckCircleIcon;
  }

  return {
    score,
    strength,
    color,
    icon,
    suggestions
  };
}