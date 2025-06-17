// File: src/components/charts/DiseaseDistribution.jsx
'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DiseaseDistribution = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Phân bố loại bệnh
        </h2>
// File: src/components/charts/DiseaseDistribution.jsx (tiếp tục)
       <div className="h-64 flex items-center justify-center text-gray-500">
         Chưa có dữ liệu
       </div>
     </div>
   );
 }

 const colors = [
   '#ef4444', // red - Cercospora
   '#22c55e', // green - Healthy  
   '#f59e0b', // amber - Miner
   '#8b5cf6', // violet - Phoma
   '#06b6d4'  // cyan - Rust
 ];

 const chartData = {
   labels: data.map(item => item.disease),
   datasets: [
     {
       data: data.map(item => item.count),
       backgroundColor: colors.slice(0, data.length),
       borderColor: colors.slice(0, data.length).map(color => color),
       borderWidth: 2,
     },
   ],
 };

 const options = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
     legend: {
       position: 'bottom',
       labels: {
         padding: 20,
         usePointStyle: true,
       }
     },
     tooltip: {
       callbacks: {
         label: function(context) {
           const total = context.dataset.data.reduce((a, b) => a + b, 0);
           const percentage = ((context.parsed / total) * 100).toFixed(1);
           return `${context.label}: ${context.parsed} (${percentage}%)`;
         }
       }
     }
   },
 };

 return (
   <div className="bg-white rounded-lg shadow-sm p-6">
     <h2 className="text-lg font-semibold text-gray-900 mb-4">
       Phân bố loại bệnh
     </h2>
     <div className="h-64">
       <Doughnut data={chartData} options={options} />
     </div>
     
     {/* Statistics */}
     <div className="mt-4 space-y-2">
       {data.map((item, index) => (
         <div key={index} className="flex items-center justify-between text-sm">
           <div className="flex items-center space-x-2">
             <div 
               className="w-3 h-3 rounded-full"
               style={{ backgroundColor: colors[index] }}
             />
             <span className="text-gray-700">{item.disease}</span>
           </div>
           <div className="text-right">
             <span className="font-medium">{item.count}</span>
             <span className="text-gray-500 ml-1">
               ({((item.avgConfidence || 0) * 100).toFixed(1)}%)
             </span>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
};

export default DiseaseDistribution;