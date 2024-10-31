import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFileSelect(e.target.files);
  };

  return (
    <div
      className="p-4 border-dashed border-2 rounded cursor-pointer text-center dark:border-gray-600"
      onClick={() => fileInput.current?.click()}
    >
      <p className="text-gray-700 dark:text-gray-300">
        Click or drag files to upload
      </p>
      <input
        type="file"
        onChange={handleFileInput}
        ref={fileInput}
        className="hidden"
        accept={accept}
      />
    </div>
  );
};

export default FileUpload;
