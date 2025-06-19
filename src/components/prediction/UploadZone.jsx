// File: src/components/prediction/UploadZone.jsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UploadZone = ({ onFileSelect, selectedFile, preview, onRemove }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Xử lý file bị reject
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        toast.error('File quá lớn. Kích thước tối đa là 10MB');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        toast.error('Định dạng file không hỗ trợ. Chỉ chấp nhận JPG, PNG');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      toast.success('Đã chọn ảnh thành công!');
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PhotoIcon className="h-6 w-6 text-blue-600" />
        Tải lên ảnh lá cà phê
      </h2>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all relative
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{selectedFile?.name}</p>
              <p>{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh hoặc click để chọn'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hỗ trợ JPG, PNG • Tối đa 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadZone;