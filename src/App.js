import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const CMONegotiationCalculator = () => {
  // Main inputs
  const [licensePerEpisode, setLicensePerEpisode] = useState(45000);
  const [numEpisodes] = useState(100);
  const [contractLength, setContractLength] = useState(2);
  
  // Payment schedule
  const [upfrontPercent, setUpfrontPercent] = useState(50);
  const [sixMonthPercent, setSixMonthPercent] = useState(25);
  const [twelveMonthPercent, setTwelveMonthPercent] = useState(25);
  const [eighteenMonthPercent, setEighteenMonthPercent] = useState(0);
  
  // Secret Society
  const [includeSecretSociety, setIncludeSecretSociety] = useState(false);
  const [secretSocietyPrice, setSecretSocietyPrice] = useState(10000);
  
  // BATNA
  const [batnaValue] = useState(2500000);
  
  // Streamers Revenue Forecast
  const [viewershipRange, setViewershipRange] = useState("50-60");
  const [revenuePerTenMillion, setRevenuePerTenMillion] = useState(1000000);
  const [streamersRevenue, setStreamersRevenue] = useState(0);
  const [streamersProfitMargin, setStreamersProfitMargin] = useState(0);
  
  // Calculated values
  const [baseRevenue, setBaseRevenue] = useState(0);
  const [financingCost, setFinancingCost] = useState(0);
  const [revenueAfterFinancing, setRevenueAfterFinancing] = useState(0);
  const [contractAdjustment, setContractAdjustment] = useState(0);
  const [secretSocietyValue, setSecretSocietyValue] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [netValueVsBatna, setNetValueVsBatna] = useState(0);
  
  // For comparison
  const [comparisonData, setComparisonData] = useState([]);
  
  // For payment schedule validation
  const [totalPercent, setTotalPercent] = useState(100);
  const [isValidPaymentSchedule, setIsValidPaymentSchedule] = useState(true);
  
  useEffect(() => {
    // Calculate base revenue
    const calcBaseRevenue = licensePerEpisode * numEpisodes;
    setBaseRevenue(calcBaseRevenue);
    
    // Calculate financing cost
    const upfrontCost = 0;
    const sixMonthCost = (sixMonthPercent / 100) * calcBaseRevenue * 0.2;
    const twelveMonthCost = (twelveMonthPercent / 100) * calcBaseRevenue * 0.35;
    const eighteenMonthCost = (eighteenMonthPercent / 100) * calcBaseRevenue * 0.5;
    const totalFinancingCost = upfrontCost + sixMonthCost + twelveMonthCost + eighteenMonthCost;
    setFinancingCost(totalFinancingCost);
    
    // Calculate revenue after financing
    const calcRevenueAfterFinancing = calcBaseRevenue - totalFinancingCost;
    setRevenueAfterFinancing(calcRevenueAfterFinancing);
    
    // Calculate contract length adjustment
    let adjustment = 0;
    if (contractLength === 1) adjustment = 250000;
    else if (contractLength === 3) adjustment = -250000;
    else if (contractLength === 4) adjustment = -500000;
    setContractAdjustment(adjustment);
    
    // Calculate Secret Society value
    const calcSecretSocietyValue = includeSecretSociety ? secretSocietyPrice * numEpisodes : 0;
    setSecretSocietyValue(calcSecretSocietyValue);
    
    // Calculate net revenue
    const calcNetRevenue = calcRevenueAfterFinancing + adjustment + calcSecretSocietyValue;
    setNetRevenue(calcNetRevenue);
    
    // Calculate net value vs BATNA
    setNetValueVsBatna(calcNetRevenue - batnaValue);
    
    // Calculate Streamers' projected revenue
    let viewershipLow, viewershipHigh;
    switch(viewershipRange) {
      case "20-30":
        viewershipLow = 20;
        viewershipHigh = 30;
        break;
      case "30-40":
        viewershipLow = 30;
        viewershipHigh = 40;
        break;
      case "40-50":
        viewershipLow = 40;
        viewershipHigh = 50;
        break;
      case "50-60":
        viewershipLow = 50;
        viewershipHigh = 60;
        break;
      case "60-70":
        viewershipLow = 60;
        viewershipHigh = 70;
        break;
      default:
        viewershipLow = 50;
        viewershipHigh = 60;
    }
    
    const avgViewership = (viewershipLow + viewershipHigh) / 2;
    const calculatedStreamersRevenue = avgViewership / 10 * revenuePerTenMillion;
    setStreamersRevenue(calculatedStreamersRevenue);
    
    // Calculate Streamers' profit margin
    const streamersProfit = calculatedStreamersRevenue - calcBaseRevenue;
    const profitMargin = (streamersProfit / calculatedStreamersRevenue) * 100;
    setStreamersProfitMargin(profitMargin);
    
    // Update comparison data
    setComparisonData([
      {
        name: 'Current Deal',
        value: calcNetRevenue,
        color: '#8884d8'
      },
      {
        name: 'BATNA',
        value: batnaValue,
        color: '#82ca9d'
      }
    ]);
    
    // Validate payment schedule
    const calcTotalPercent = upfrontPercent + sixMonthPercent + twelveMonthPercent + eighteenMonthPercent;
    setTotalPercent(calcTotalPercent);
    setIsValidPaymentSchedule(calcTotalPercent === 100);
    
  }, [licensePerEpisode, numEpisodes, contractLength, 
     upfrontPercent, sixMonthPercent, twelveMonthPercent, eighteenMonthPercent,
     includeSecretSociety, secretSocietyPrice, batnaValue,
     viewershipRange, revenuePerTenMillion]);

  // Scenario parameters
  const [scenarioName, setScenarioName] = useState('');
  const [savedScenarios, setSavedScenarios] = useState([
    {
      name: 'Minimum Deal',
      licensePerEpisode: 35000,
      contractLength: 2,
      upfrontPercent: 50,
      sixMonthPercent: 25,
      twelveMonthPercent: 25,
      eighteenMonthPercent: 0,
      includeSecretSociety: false,
      secretSocietyPrice: 10000,
      netRevenue: 3025000,
      netValueVsBatna: 525000
    },
    {
      name: 'Target Deal',
      licensePerEpisode: 70000,
      contractLength: 2,
      upfrontPercent: 50,
      sixMonthPercent: 25,
      twelveMonthPercent: 25,
      eighteenMonthPercent: 0,
      includeSecretSociety: true,
      secretSocietyPrice: 15000,
      netRevenue: 7537500,
      netValueVsBatna: 5037500
    }
  ]);
  
  const saveScenario = () => {
    if (!scenarioName) return;
    
    const newScenario = {
      name: scenarioName,
      licensePerEpisode,
      contractLength,
      upfrontPercent,
      sixMonthPercent,
      twelveMonthPercent,
      eighteenMonthPercent,
      includeSecretSociety,
      secretSocietyPrice,
      netRevenue,
      netValueVsBatna
    };
    
    setSavedScenarios([...savedScenarios, newScenario]);
    setScenarioName('');
  };
  
  const loadScenario = (scenario) => {
    setLicensePerEpisode(scenario.licensePerEpisode);
    setContractLength(scenario.contractLength);
    setUpfrontPercent(scenario.upfrontPercent);
    setSixMonthPercent(scenario.sixMonthPercent);
    setTwelveMonthPercent(scenario.twelveMonthPercent);
    setEighteenMonthPercent(scenario.eighteenMonthPercent);
    setIncludeSecretSociety(scenario.includeSecretSociety);
    setSecretSocietyPrice(scenario.secretSocietyPrice);
  };

  // Format number for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Chart data
  const paymentScheduleData = [
    { name: 'Upfront', value: upfrontPercent },
    { name: '6 Months', value: sixMonthPercent },
    { name: '12 Months', value: twelveMonthPercent },
    { name: '18 Months', value: eighteenMonthPercent }
  ];
  
  const revenueBreakdownData = [
    { name: 'Base Revenue', value: baseRevenue },
    { name: 'Financing Cost', value: -financingCost },
    { name: 'Contract Adjustment', value: contractAdjustment },
    { name: 'Secret Society', value: secretSocietyValue }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const scenarioComparisonData = savedScenarios.map(scenario => ({
    name: scenario.name,
    netValue: scenario.netValueVsBatna
  }));

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">CMO Negotiation Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Licensing Fee per Episode:</label>
            <input
              type="number"
              value={licensePerEpisode}
              onChange={(e) => setLicensePerEpisode(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
            />
            <div className="text-xs text-gray-500 mt-1">Min: $35,000, Target: $70,000</div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Contract Length (years):</label>
            <select
              value={contractLength}
              onChange={(e) => setContractLength(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value={1}>1 Year (+$250,000)</option>
              <option value={2}>2 Years (Standard)</option>
              <option value={3}>3 Years (-$250,000)</option>
              <option value={4}>4 Years (-$500,000)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Payment Schedule:</h3>
            <div className={`text-sm ${isValidPaymentSchedule ? 'text-green-600' : 'text-red-600'} mb-2`}>
              Total: {totalPercent}% {isValidPaymentSchedule ? '✓' : '(Must equal 100%)'}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Upfront (%):</label>
                <input
                  type="number"
                  value={upfrontPercent}
                  onChange={(e) => setUpfrontPercent(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">6 months (%):</label>
                <input
                  type="number"
                  value={sixMonthPercent}
                  onChange={(e) => setSixMonthPercent(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">12 months (%):</label>
                <input
                  type="number"
                  value={twelveMonthPercent}
                  onChange={(e) => setTwelveMonthPercent(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">18 months (%):</label>
                <input
                  type="number"
                  value={eighteenMonthPercent}
                  onChange={(e) => setEighteenMonthPercent(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium mb-1">
              <input
                type="checkbox"
                checked={includeSecretSociety}
                onChange={(e) => setIncludeSecretSociety(e.target.checked)}
                className="mr-2"
              />
              Include "The Secret Society"?
            </label>
            
            {includeSecretSociety && (
              <div className="mt-2">
                <label className="block text-sm mb-1">Price per Episode:</label>
                <input
                  type="number"
                  value={secretSocietyPrice}
                  onChange={(e) => setSecretSocietyPrice(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                />
                <div className="text-xs text-gray-500 mt-1">Current offer: $10,000 per episode</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Deal Value</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded">
              <div className="text-sm text-gray-600">Base Revenue:</div>
              <div className="text-lg font-semibold">{formatNumber(baseRevenue)}</div>
            </div>
            
            <div className="p-3 bg-gray-100 rounded">
              <div className="text-sm text-gray-600">Financing Cost:</div>
              <div className="text-lg font-semibold">{formatNumber(financingCost)}</div>
            </div>
            
            <div className="p-3 bg-gray-100 rounded">
              <div className="text-sm text-gray-600">Contract Adjustment:</div>
              <div className="text-lg font-semibold">{formatNumber(contractAdjustment)}</div>
            </div>
            
            <div className="p-3 bg-gray-100 rounded">
              <div className="text-sm text-gray-600">Secret Society Value:</div>
              <div className="text-lg font-semibold">{formatNumber(secretSocietyValue)}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Net Revenue:</div>
              <div className="text-2xl font-bold">{formatNumber(netRevenue)}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className={`p-4 rounded border ${netValueVsBatna >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-sm mb-1 ${netValueVsBatna >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Net Value vs. BATNA ({formatNumber(batnaValue)}):
              </div>
              <div className={`text-2xl font-bold ${netValueVsBatna >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatNumber(netValueVsBatna)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentScheduleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentScheduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Net Revenue vs BATNA</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="value" name="Value">
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Scenario Manager</h2>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Enter scenario name"
            className="flex-grow p-2 border rounded-l"
          />
          <button
            onClick={saveScenario}
            className="bg-blue-600 text-white px-4 py-2 rounded-r"
            disabled={!scenarioName}
          >
            Save Current Scenario
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">Scenario</th>
                <th className="py-2 px-3 text-right">License Fee</th>
                <th className="py-2 px-3 text-center">Years</th>
                <th className="py-2 px-3 text-center">Payment</th>
                <th className="py-2 px-3 text-center">Secret Society</th>
                <th className="py-2 px-3 text-right">Net Revenue</th>
                <th className="py-2 px-3 text-right">vs BATNA</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {savedScenarios.map((scenario, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-3">{scenario.name}</td>
                  <td className="py-2 px-3 text-right">{formatNumber(scenario.licensePerEpisode)}</td>
                  <td className="py-2 px-3 text-center">{scenario.contractLength}</td>
                  <td className="py-2 px-3 text-center">{scenario.upfrontPercent}/{scenario.sixMonthPercent}/{scenario.twelveMonthPercent}/{scenario.eighteenMonthPercent}</td>
                  <td className="py-2 px-3 text-center">{scenario.includeSecretSociety ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-3 text-right">{formatNumber(scenario.netRevenue)}</td>
                  <td className={`py-2 px-3 text-right ${scenario.netValueVsBatna >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(scenario.netValueVsBatna)}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => loadScenario(scenario)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Streamers Revenue Forecast</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Finale Viewership Range (millions):</label>
              <select
                value={viewershipRange}
                onChange={(e) => setViewershipRange(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="20-30">20-30 Million (10% likelihood)</option>
                <option value="30-40">30-40 Million (10% likelihood)</option>
                <option value="40-50">40-50 Million (10% likelihood)</option>
                <option value="50-60">50-60 Million (50% likelihood)</option>
                <option value="60-70">60-70 Million (20% likelihood)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Revenue per 10M Viewers:</label>
              <input
                type="number"
                value={revenuePerTenMillion}
                onChange={(e) => setRevenuePerTenMillion(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="500000"
                max="1500000"
                step="100000"
              />
              <div className="text-xs text-gray-500 mt-1">Range: $500,000 - $1,500,000 per 10M viewers</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Streamers' Projected Revenue:</div>
              <div className="text-2xl font-bold">{formatNumber(streamersRevenue)}</div>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <div className="p-4 bg-green-50 rounded border border-green-200">
                <div className="text-sm text-green-700 mb-1">Your Licensing Fee:</div>
                <div className="text-2xl font-bold">{formatNumber(baseRevenue)}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="p-4 bg-purple-50 rounded border border-purple-200">
                <div className="text-sm text-purple-700 mb-1">Streamers' Profit:</div>
                <div className="text-2xl font-bold">{formatNumber(streamersRevenue - baseRevenue)}</div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
              <div className="text-sm text-yellow-700 mb-1">Streamers' Profit Margin:</div>
              <div className="text-2xl font-bold">{streamersProfitMargin.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Your Revenue', value: baseRevenue },
                { name: 'Streamers Revenue', value: streamersRevenue },
                { name: 'Streamers Profit', value: streamersRevenue - baseRevenue }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="value" name="Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
        
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scenarioComparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="netValue" name="Net Value vs BATNA" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-gray-200 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Quick Reference</h2>
        <ul className="text-sm">
          <li>• BATNA: $2.5 million (VivaVideo offer)</li>
          <li>• Minimum Acceptable: $35,000 per episode</li>
          <li>• Target: $70,000 per episode</li>
          <li>• Payment Timing Costs: 6 months (20%), 12 months (35%), 18 months (50%)</li>
          <li>• Contract Length Impact: +$250K for 1 year, -$250K for 3 years, -$500K for 4 years</li>
          <li>• Viewership Impact: $0.5-1.5M revenue per 10M viewers for Streamers</li>
        </ul>
      </div>
    </div>
  );
};

export default CMONegotiationCalculator;