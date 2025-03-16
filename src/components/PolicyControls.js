import React from 'react';
import { Form } from 'react-bootstrap';


const PolicyControls = ({ budget, allocations, setAllocations, policies, setPolicies, timeframe, setTimeframe }) => {
  // Handle allocation changes
  const handleAllocationChange = (category, value) => {
    const newAllocations = { ...allocations, [category]: value };
   
    // Ensure total doesn't exceed budget
    const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
    if (total > budget) {
      // Proportionally reduce other allocations
      const excess = total - budget;
      const categories = Object.keys(newAllocations).filter(cat => cat !== category);
     
      categories.forEach(cat => {
        const reduction = (newAllocations[cat] / (total - newAllocations[category])) * excess;
        newAllocations[cat] = Math.max(0, newAllocations[cat] - reduction);
      });
    }
   
    setAllocations(newAllocations);
  };


  // Handle policy toggle changes
  const handlePolicyChange = (policyId) => {
    setPolicies({
      ...policies,
      [policyId]: !policies[policyId]
    });
  };
 
  return (
    <div className="policy-controls p-3 border rounded">
      <h4>Budget Allocation (₹{budget} Crores)</h4>
      <div className="mb-4">
        {Object.keys(allocations).map(category => (
          <div key={category} className="mb-3">
            <Form.Label className="d-flex justify-content-between">
              <span className="text-capitalize">{category}</span>
              <span>₹{allocations[category]} Cr</span>
            </Form.Label>
            <Form.Range
              min={0}
              max={budget}
              step={1}
              value={allocations[category]}
              onChange={(e) => handleAllocationChange(category, parseInt(e.target.value))}
            />
          </div>
        ))}
       
        <div className="d-flex justify-content-between">
          <span>Total Allocated:</span>
          <span>₹{Object.values(allocations).reduce((sum, val) => sum + val, 0)} Cr</span>
        </div>
      </div>
     
      <h4>Policy Toggles</h4>
      <div className="mb-4">
        {Object.keys(policies).map(policyId => (
          <Form.Check
            key={policyId}
            type="switch"
            id={`policy-${policyId}`}
            label={policyId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            checked={policies[policyId]}
            onChange={() => handlePolicyChange(policyId)}
            className="mb-2"
          />
        ))}
      </div>
     
      <h4>Timeframe</h4>
      <div className="mb-3">
        <Form.Check
          inline
          type="radio"
          name="timeframe"
          id="timeframe-5"
          label="5 Years"
          checked={timeframe === 5}
          onChange={() => setTimeframe(5)}
        />
        <Form.Check
          inline
          type="radio"
          name="timeframe"
          id="timeframe-10"
          label="10 Years"
          checked={timeframe === 10}
          onChange={() => setTimeframe(10)}
        />
        <Form.Check
          inline
          type="radio"
          name="timeframe"
          id="timeframe-20"
          label="20 Years"
          checked={timeframe === 20}
          onChange={() => setTimeframe(20)}
        />
      </div>
    </div>
  );
};


export default PolicyControls;
