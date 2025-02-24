import { useState, useEffect } from 'react';
import { FolderIcon, ShareIcon, HistoryIcon, AlertCircleIcon } from 'lucide-react';
import { getCategories, getDuplicates, mergeDuplicates } from '../utils/passwordManagement';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['password_categories']['Row'];
type Duplicate = {
  id: string;
  original_id: string;
  duplicate_id: string;
  similarity_score: number;
  passwords: {
    title: string;
    username: string;
    url?: string;
  };
};

export function PasswordManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [duplicates, setDuplicates] = useState<Duplicate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDuplicates, setShowDuplicates] = useState(false);

  useEffect(() => {
    loadCategories();
    loadDuplicates();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDuplicates = async () => {
    try {
      const data = await getDuplicates();
      setDuplicates(data as Duplicate[]);
    } catch (error) {
      console.error('Error loading duplicates:', error);
    }
  };

  const handleMergeDuplicates = async (originalId: string, duplicateId: string) => {
    try {
      await mergeDuplicates(originalId, duplicateId);
      loadDuplicates();
    } catch (error) {
      console.error('Error merging duplicates:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <FolderIcon className="w-6 h-6 text-blue-600 mb-2" />
              <span className="block text-sm font-medium text-gray-900">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Duplicates Section */}
      {duplicates.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Duplicate Entries ({duplicates.length})
            </h2>
            <button
              onClick={() => setShowDuplicates(!showDuplicates)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showDuplicates ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showDuplicates && (
            <div className="space-y-4">
              {duplicates.map((duplicate) => (
                <div
                  key={duplicate.id}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {duplicate.passwords.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {duplicate.passwords.username}
                      </p>
                      {duplicate.passwords.url && (
                        <p className="text-sm text-gray-500">{duplicate.passwords.url}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMergeDuplicates(duplicate.original_id, duplicate.duplicate_id)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Merge
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700">
                        Keep Both
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Management Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
          <ShareIcon className="w-6 h-6 text-blue-600 mb-2" />
          <span className="block font-medium text-gray-900">Share Passwords</span>
          <span className="text-sm text-gray-500">
            Securely share credentials
          </span>
        </button>

        <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
          <HistoryIcon className="w-6 h-6 text-blue-600 mb-2" />
          <span className="block font-medium text-gray-900">Password History</span>
          <span className="text-sm text-gray-500">
            View and restore versions
          </span>
        </button>

        <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
          <AlertCircleIcon className="w-6 h-6 text-blue-600 mb-2" />
          <span className="block font-medium text-gray-900">Cleanup Wizard</span>
          <span className="text-sm text-gray-500">
            Remove outdated entries
          </span>
        </button>
      </div>
    </div>
  );
}