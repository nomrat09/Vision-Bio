import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RegionMap from './components/RegionMap.js';
import PolicyControls from './components/PolicyControls.js';
import ProjectionCharts from './components/ProjectionCharts.js';
import { regions, modelParameters } from './data/sampleData.js';


function App() {
  // State
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [budget, setBudget] = useState(100); // 100 Crores
  const [allocations, setAllocations] = useState({
    infrastructure: 30,
    workforce: 25,
    incentives: 25,
    research: 20
  });
  const [policies, setPolicies] = useState({
    expedited_permits: false,
    international_partnerships: false,
    public_private_hubs: false,
    incubator_network: false
  });
  const [timeframe, setTimeframe] = useState(10); // 10 years
  const [projectedMetrics, setProjectedMetrics] = useState({
    jobs: [],
    companies: [],
    funding: [],
    patents: []
  });
  const [growthProjection, setGrowthProjection] = useState(null);
 
  // Calculate projections whenever inputs change
  useEffect(() => {
    calculateProjections();
  }, [selectedRegion, allocations, policies, timeframe]);
 
  // Simple projection calculation (for hackathon purposes)
  const calculateProjections = () => {
    const { currentMetrics } = selectedRegion;
    let jobs = [];
    let companies = [];
    let funding = [];
    let patents = [];
   
    // Policy impact multipliers (simplified)
    const policyMultipliers = {
      expedited_permits: policies.expedited_permits ? 1.1 : 1,
      international_partnerships: policies.international_partnerships ? 1.15 : 1,
      public_private_hubs: policies.public_private_hubs ? 1.2 : 1,
      incubator_network: policies.incubator_network ? 1.25 : 1
    };
   
    // Calculate combined policy multiplier
    const combinedPolicyMultiplier = Object.values(policyMultipliers).reduce((mult, val) => mult * val, 1);
   
    // Calculate yearly projections
    let currentJobs = currentMetrics.jobs;
    let currentCompanies = currentMetrics.companies || 100;
    let currentFunding = currentMetrics.funding;
    let currentPatents = currentMetrics.patents;
   
    // Initialize growth variables outside the loop
    let jobGrowth = 0;
    let companyGrowth = 0;
    let fundingGrowth = 0;
    let patentGrowth = 0;
   
    for (let year = 1; year <= timeframe; year++) {
      // Calculate yearly growth based on allocations and policies
      jobGrowth = (
        allocations.infrastructure * modelParameters.infrastructure.jobMultiplier +
        allocations.workforce * modelParameters.workforce.jobMultiplier +
        allocations.incentives * modelParameters.incentives.jobMultiplier
      ) * combinedPolicyMultiplier;
     
      // FIXED: Use percentage growth rate instead of multiplying by currentCompanies
      // This prevents exponential growth leading to millions of companies
      const companyGrowthRate = (
        allocations.infrastructure * modelParameters.infrastructure.companyFormationRate * 0.01 +
        allocations.incentives * modelParameters.incentives.companyFormationRate * 0.01 +
        allocations.research * modelParameters.research.spinoffRate * 0.01
      ) * combinedPolicyMultiplier;
      
      // Apply a reasonable growth rate capped at 30% per year maximum
      companyGrowth = currentCompanies * Math.min(companyGrowthRate, 0.3);
     
      fundingGrowth = (
        allocations.incentives * modelParameters.incentives.attractionMultiplier +
        allocations.research * modelParameters.research.fundingMultiplier
      ) * currentFunding * combinedPolicyMultiplier * 0.1; // Reduced multiplier to prevent excessive growth
     
      patentGrowth = (
        allocations.infrastructure * modelParameters.infrastructure.patentMultiplier +
        allocations.research * modelParameters.research.patentMultiplier
      ) * currentPatents * combinedPolicyMultiplier * 0.1; // Reduced multiplier to prevent excessive growth
     
      // Update current values
      currentJobs += jobGrowth;
      currentCompanies += companyGrowth;
      currentFunding += fundingGrowth;
      currentPatents += patentGrowth;
     
      // Add to projection arrays
      jobs.push(Math.round(currentJobs));
      companies.push(Math.round(currentCompanies));
      funding.push(Math.round(currentFunding));
      patents.push(Math.round(currentPatents));
    }
   
    // Update projected metrics
    setProjectedMetrics({ jobs, companies, funding, patents });
   
    // Generate growth hotspots for the map (simplified)
    const hotspots = selectedRegion.existingAssets.map(asset => {
      // Calculate growth intensity based on asset type and allocations
      let intensity = asset.strength / 10; // Base on existing strength
     
      // Adjust based on allocation focus
      if (asset.type === 'university' && allocations.research > 20) {
        intensity *= 1.5;
      } else if (asset.type === 'company' && allocations.incentives > 20) {
        intensity *= 1.3;
      } else if ((asset.type === 'researchCenter' || asset.type === 'bioPark') &&
                allocations.infrastructure > 20) {
        intensity *= 1.4;
      }
     
      // Apply policy effects
      intensity *= combinedPolicyMultiplier;
     
      // FIXED: Cap the number of companies per hotspot to a reasonable value
      // and ensure even distribution across hotspots
      return {
        location: asset.location,
        intensity: intensity,
        jobs: Math.round(intensity * jobGrowth / selectedRegion.existingAssets.length),
        companies: Math.min(
          Math.round(intensity * companyGrowth / selectedRegion.existingAssets.length),
          Math.round(currentCompanies * 0.2) // Cap at 20% of total companies per hotspot
        )
      };
    });
   
    setGrowthProjection({ hotspots });
  };
 
  return (
    <div className="App">
      <header className="bg-primary text-white p-4">
        <div className="container">
          <h1>Biotech Growth Simulator</h1>
        </div>
      </header>
     
      <main className="container py-4">
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Region Selection</h3>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={selectedRegion.id}
                    onChange={(e) => setSelectedRegion(regions.find(r => r.id === e.target.value))}
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="card-body">
                <RegionMap
                  selectedRegion={selectedRegion}
                  growthProjection={growthProjection}
                />
              </div>
            </div>
          </div>
        </div>
       
        <div className="row">
          <div className="col-md-4">
            <PolicyControls
              budget={budget}
              setBudget={setBudget}
              allocations={allocations}
              setAllocations={setAllocations}
              policies={policies}
              setPolicies={setPolicies}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          </div>
          <div className="col-md-8">
            <ProjectionCharts
              currentMetrics={selectedRegion.currentMetrics}
              projectedMetrics={projectedMetrics}
              timeframe={timeframe}
            />
          </div>
        </div>
      </main>
     
      <footer className="bg-light p-3 text-center">
        <div className="container">
          <p className="mb-0">Biotech Growth Simulator - MEGA Hacks-25</p>
        </div>
      </footer>
    </div>
  );
}


export default App;