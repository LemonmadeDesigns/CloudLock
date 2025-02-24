import React from 'react';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import { getBrandGradient, getBrandTextColor, getBrandHoverColor } from '../utils/brandColors';

interface PasswordCardProps {
  entry: {
    id: string;
    title: string;
    username: string;
    url?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onOpenUrl?: () => void;
}

export function PasswordCard({ entry, onEdit, onDelete, onOpenUrl }: PasswordCardProps) {
  const gradientClasses = getBrandGradient(entry.url);
  const textColor = getBrandTextColor(entry.url);
  const hoverColor = getBrandHoverColor(entry.url);

  return (
    <div className={`mb-4 bg-gradient-to-r ${gradientClasses} rounded-lg shadow-lg overflow-hidden`}>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className={`text-lg font-medium ${textColor}`}>{entry.title}</h3>
            <p className={`${textColor} opacity-80`}>{entry.username}</p>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
            <div>
              {entry.url && (
                <button
                  onClick={onOpenUrl}
                  className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  Open Site
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-8">
              <button
                onClick={onEdit}
                className={`p-2 ${textColor} ${hoverColor} transition-colors duration-200`}
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onDelete}
                className={`p-2 ${textColor} ${hoverColor} transition-colors duration-200`}
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}