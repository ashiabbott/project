// src/components/Transactions/CategorySelector.tsx

import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { FaSpinner } from 'react-icons/fa';
import debounce from 'lodash.debounce';

// Define the shape of a Category
export interface Category {
  id: number;
  name: string;
}

// Define the props for the CategorySelector component
interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onChange: (category: Category) => void;
  placeholder?: string;
  allowCreate?: boolean;
  onCreateCategory?: (name: string) => Promise<void>;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onChange,
  placeholder = 'Select a category',
  allowCreate = false,
  onCreateCategory,
}) => {
  const [query, setQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Remove duplicate categories by name
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter(category => {
      const duplicate = seen.has(category.name.toLowerCase());
      seen.add(category.name.toLowerCase());
      return !duplicate;
    });
  }, [categories]);

  // Debounced search input to optimize performance
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, 300),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetQuery(event.target.value);
  };

  // Filter categories based on query
  const filteredCategories = useMemo(() => {
    if (query === '') {
      return uniqueCategories;
    }
    const lowercasedQuery = query.toLowerCase().replace(/\s+/g, '');
    return uniqueCategories.filter(category =>
      category.name.toLowerCase().replace(/\s+/g, '').includes(lowercasedQuery)
    );
  }, [query, uniqueCategories]);

  // Handler for creating a new category
  const handleCreateCategory = async () => {
    if (onCreateCategory && query.trim() !== '') {
      setIsCreating(true);
      try {
        await onCreateCategory(query.trim());
        setQuery('');
      } catch (error) {
        // Handle error appropriately (e.g., show notification)
        console.error('Error creating category:', error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <Combobox value={selectedCategory} onChange={onChange}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-0"
            displayValue={(category: Category | null) =>
              category ? category.name : ''
            }
            onChange={handleInputChange}
            placeholder={placeholder}
            aria-label="Select Category"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400 dark:text-gray-300"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredCategories.length === 0 && query !== '' && !allowCreate ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                Nothing found.
              </div>
            ) : (
              <>
                {filteredCategories.map(category => (
                  <Combobox.Option
                    key={category.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-900 dark:text-white'
                      }`
                    }
                    value={category}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {category.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))}

                {/* Option to create a new category */}
                {allowCreate &&
                  query.trim() !== '' &&
                  !uniqueCategories.some(
                    cat => cat.name.toLowerCase() === query.toLowerCase()
                  ) && (
                    <Combobox.Option
                      value={{ id: Date.now(), name: query.trim() }}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ active }) => (
                        <>
                          <span
                            className={`block truncate ${active ? 'font-medium' : 'font-normal'}`}
                          >
                            Create "{query.trim()}"
                          </span>
                          {active && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  )}

                {isCreating && (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300 flex items-center">
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    Creating category...
                  </div>
                )}
              </>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default React.memo(CategorySelector);
