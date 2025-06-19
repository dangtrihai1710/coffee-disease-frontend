// File: src/components/prediction/SymptomSelector.jsx
'use client';

import { EyeIcon } from '@heroicons/react/24/outline';

const SymptomSelector = ({ symptoms, selectedSymptoms, onSymptomToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <EyeIcon className="h-6 w-6 text-green-600" />
        Triệu chứng quan sát được
        <span className="text-sm font-normal text-gray-500">(tùy chọn)</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {symptoms.map((symptom) => (
          <label
            key={symptom.id}
            className={`
              flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all
              ${selectedSymptoms.includes(symptom.id)
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }
            `}
          >
            <input
              type="checkbox"
              checked={selectedSymptoms.includes(symptom.id)}
              onChange={() => onSymptomToggle(symptom.id)}
              className="mt-1 h-4 w-4 text-green-600 rounded focus:ring-green-500"
            />
            <div>
              <p className="font-medium text-gray-900">{symptom.name}</p>
              <p className="text-sm text-gray-600">{symptom.description}</p>
            </div>
          </label>
        ))}
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Đã chọn {selectedSymptoms.length} triệu chứng. Thông tin này sẽ giúp AI phân tích chính xác hơn.
          </p>
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;