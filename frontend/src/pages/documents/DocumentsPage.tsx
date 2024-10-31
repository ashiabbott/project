import React from 'react';
import DocumentManager from '../../components/Documents/DocumentManager';

const DocumentsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Document Management
      </h1>
      <DocumentManager />
    </div>
  );
};

export default DocumentsPage;
