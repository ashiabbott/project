import React from 'react';

interface Category {
  name: string;
  budget: number;
  spent: number;
}

const CategoryBreakdown: React.FC = () => {
  // TODO: Fetch real data from API
  const categories: Category[] = [
    { name: 'Housing', budget: 1500, spent: 1450 },
    { name: 'Food', budget: 500, spent: 480 },
    { name: 'Transportation', budget: 300, spent: 250 },
    { name: 'Entertainment', budget: 200, spent: 180 },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Category Breakdown
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {categories.map(category => (
            <li key={category.name} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {category.name}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${category.spent} / ${category.budget}
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${(category.spent / category.budget) * 100}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
