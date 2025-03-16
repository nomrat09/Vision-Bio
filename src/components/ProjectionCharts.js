import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);


const ProjectionCharts = ({ currentMetrics, projectedMetrics, timeframe }) => {
  // Generate years array for x-axis
  const years = Array.from({ length: timeframe + 1 }, (_, i) => `Year ${i}`);
 
  // Economic impact chart data
  const economicImpactData = {
    labels: years,
    datasets: [
      {
        label: 'Jobs Created',
        data: [currentMetrics.jobs, ...projectedMetrics.jobs],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };
 
  // Company formation chart data
  const companyFormationData = {
    labels: years,
    datasets: [
      {
        label: 'Number of Companies',
        data: [currentMetrics.companies, ...projectedMetrics.companies],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };
 
  // Investment attraction timeline data
  const investmentTimelineData = {
    labels: years,
    datasets: [
      {
        label: 'Cumulative Funding (Crores ₹)',
        data: [currentMetrics.funding, ...projectedMetrics.funding],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      }
    ]
  };
 
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Projected Growth',
      },
    },
  };
 
  return (
    <div className="charts-container">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="chart-card p-3 border rounded h-100">
            <h5>Job Creation</h5>
            <Bar data={economicImpactData} options={chartOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-card p-3 border rounded h-100">
            <h5>Company Formation</h5>
            <Bar data={companyFormationData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="chart-card p-3 border rounded">
            <h5>Investment Attraction Timeline</h5>
            <Line data={investmentTimelineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProjectionCharts;
