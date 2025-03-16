export const regions = [
    {
      id: 'bangalore',
      name: 'Bangalore',
      center: [12.9716, 77.5946],
      zoom: 11,
      existingAssets: [
        { type: 'university', name: 'Indian Institute of Science', location: [13.0219, 77.5671], strength: 9 },
        { type: 'researchCenter', name: 'Centre for Cellular & Molecular Platforms', location: [13.0692, 77.5776], strength: 8 },
        { type: 'bioPark', name: 'Bangalore Helix Biotech Park', location: [13.0637, 77.5855], strength: 7 },
        { type: 'company', name: 'Biocon', location: [12.9782, 77.6409], strength: 9 },
        { type: 'company', name: 'Strides Pharma', location: [12.9141, 77.6501], strength: 7 },
      ],
      currentMetrics: {
        companies: 85,
        jobs: 25000,
        funding: 450, // in Crores INR
        patents: 120
      }
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad',
      center: [17.3850, 78.4867],
      zoom: 11,
      existingAssets: [
        { type: 'university', name: 'University of Hyderabad', location: [17.4606, 78.3492], strength: 8 },
        { type: 'researchCenter', name: 'CSIR-CCMB', location: [17.4239, 78.5540], strength: 9 },
        { type: 'bioPark', name: 'Genome Valley', location: [17.5845, 78.4501], strength: 9 },
        { type: 'company', name: 'Dr. Reddy\'s Laboratories', location: [17.4932, 78.3913], strength: 8 },
        { type: 'company', name: 'Bharat Biotech', location: [17.4472, 78.4376], strength: 7 },
      ],
      currentMetrics: {
        companies: 100,
        jobs: 30000,
        funding: 500, // in Crores INR
        patents: 150
      }
    }
  ];
 
  // Modeling parameters (simplified for hackathon)
  export const modelParameters = {
    infrastructure: {
      jobMultiplier: 10, // Each crore invested creates 10 jobs
      companyFormationRate: 0.05, // 5% chance of new company per crore
      patentMultiplier: 0.02 // 2% increase in patents per crore
    },
    workforce: {
      jobMultiplier: 15, // Each crore invested creates 15 jobs
      retentionRate: 0.02, // 2% increase in talent retention per crore
      productivityGain: 0.03 // 3% increase in productivity per crore
    },
    incentives: {
      attractionMultiplier: 0.08, // 8% increase in external investment per crore
      jobMultiplier: 5, // Each crore creates 5 jobs
      companyFormationRate: 0.1 // 10% chance of new company per crore
    },
    research: {
      patentMultiplier: 0.1, // 10% increase in patents per crore
      spinoffRate: 0.02, // 2% chance of university spinoff per crore
      fundingMultiplier: 0.2 // 20% increase in external research funding
    }
  };
