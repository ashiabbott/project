import React, { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewDocument(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (newDocument) {
      const doc: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setDocuments([...documents, doc]);
      setNewDocument(null);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Document Manager</h2>
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} className="mr-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
      <ul>
        {documents.map(doc => (
          <li key={doc.id} className="mb-2">
            {doc.name} - {doc.type} (Uploaded on {doc.uploadDate})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentManager;
