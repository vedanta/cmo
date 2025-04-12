import React, { useState, useEffect } from 'react';

function App() {
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

  // Simplified visual for payment schedule (text-based)
  const renderPaymentSchedule = () => {
    const payments = [
      { name: 'Upfront', value: upfrontPercent },
      { name: '6 Months', value: sixMonthPercent },
      { name: '12 Months', value: twelveMonthPercent },
      { name: '18 Months', value: eighteenMonthPercent }
    ].filter(p => p.value > 0);
    
    return (
      <div>
        <h3 style={{ marginBottom: '10px' }}>Payment Distribution:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {payments.map((p, i) => (
            <li key={i} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{p.name}:</span>
              <span><b>{p.value}%</b></span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Simplified bar representation for comparison
  const renderComparisonBars = () => {
    const maxValue = Math.max(...comparisonData.map(d => d.value));
    return (
      <div>
        {comparisonData.map((item, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div>{item.name}</div>
              <div>{formatNumber(item.value)}</div>
            </div>
            <div style={{ 
              height: '20px', 
              width: '100%', 
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // CSS-in-JS styles
  const styles = {
    container: {
      backgroundColor: '#f3f4f6',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
      gap: '24px'
    },
    card: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    hint: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    valueDisplay: {
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '4px',
      marginBottom: '10px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280'
    },
    statValue: {
      fontSize: '18px',
      fontWeight: '600'
    },
    blueBox: {
      padding: '16px',
      backgroundColor: '#eff6ff',
      borderRadius: '4px',
      border: '1px solid #bfdbfe',
      marginBottom: '16px'
    },
    blueText: {
      color: '#1e40af'
    },
    greenBox: {
      padding: '16px',
      backgroundColor: '#f0fdf4',
      borderRadius: '4px',
      border: '1px solid #bbf7d0',
      marginBottom: '16px'
    },
    greenText: {
      color: '#166534'
    },
    redBox: {
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderRadius: '4px',
      border: '1px solid #fecaca',
      marginBottom: '16px'
    },
    redText: {
      color: '#b91c1c'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    },
    buttonGray: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      padding: '4px 8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '8px 12px',
      backgroundColor: '#f3f4f6'
    },
    tableCell: {
      padding: '8px 12px',
      borderTop: '1px solid #e5e7eb'
    },
    flexRow: {
      display: 'flex'
    },
    flexGrow: {
      flexGrow: 1
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CMO Negotiation Calculator</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Input Parameters</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Licensing Fee per Episode:</label>
            <input
              type="number"
              value={licensePerEpisode}
              onChange={(e) => setLicensePerEpisode(Number(e.target.value))}
              style={styles.input}
              min="0"
            />
            <div style={styles.hint}>Min: $35,000, Target: $70,000</div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Contract Length (years):</label>
            <select
              value={contractLength}
              onChange={(e) => setContractLength(Number(e.target.value))}
              style={styles.input}
            >
              <option value={1}>1 Year (+$250,000)</option>
              <option value={2}>2 Years (Standard)</option>
              <option value={3}>3 Years (-$250,000)</option>
              <option value={4}>4 Years (-$500,000)</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <h3 style={{ fontWeight: 'medium', marginBottom: '8px' }}>Payment Schedule:</h3>
            <div style={{ 
              fontSize: '14px', 
              color: isValidPaymentSchedule ? '#16a34a' : '#dc2626',
              marginBottom: '8px'
            }}>
              Total: {totalPercent}% {isValidPaymentSchedule ? '✓' : '(Must equal 100%)'}
            </div>
            
            <div style={styles.formRow}>
              <div>
                <label style={styles.label}>Upfront (%):</label>
                <input
                  type="number"
                  value={upfrontPercent}
                  onChange={(e) => setUpfrontPercent(Number(e.target.value))}
                  style={styles.input}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label style={styles.label}>6 months (%):</label>
                <input
                  type="number"
                  value={sixMonthPercent}
                  onChange={(e) => setSixMonthPercent(Number(e.target.value))}
                  style={styles.input}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label style={styles.label}>12 months (%):</label>
                <input
                  type="number"
                  value={twelveMonthPercent}
                  onChange={(e) => setTwelveMonthPercent(Number(e.target.value))}
                  style={styles.input}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label style={styles.label}>18 months (%):</label>
                <input
                  type="number"
                  value={eighteenMonthPercent}
                  onChange={(e) => setEighteenMonthPercent(Number(e.target.value))}
                  style={styles.input}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              <input
                type="checkbox"
                checked={includeSecretSociety}
                onChange={(e) => setIncludeSecretSociety(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Include "The Secret Society"?
            </label>
            
            {includeSecretSociety && (
              <div style={{ marginTop: '8px' }}>
                <label style={styles.label}>Price per Episode:</label>
                <input
                  type="number"
                  value={secretSocietyPrice}
                  onChange={(e) => setSecretSocietyPrice(Number(e.target.value))}
                  style={styles.input}
                  min="0"
                />
                <div style={styles.hint}>Current offer: $10,000 per episode</div>
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Deal Value</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={styles.valueDisplay}>
              <div style={styles.statLabel}>Base Revenue:</div>
              <div style={styles.statValue}>{formatNumber(baseRevenue)}</div>
            </div>
            
            <div style={styles.valueDisplay}>
              <div style={styles.statLabel}>Financing Cost:</div>
              <div style={styles.statValue}>{formatNumber(financingCost)}</div>
            </div>
            
            <div style={styles.valueDisplay}>
              <div style={styles.statLabel}>Contract Adjustment:</div>
              <div style={styles.statValue}>{formatNumber(contractAdjustment)}</div>
            </div>
            
            <div style={styles.valueDisplay}>
              <div style={styles.statLabel}>Secret Society Value:</div>
              <div style={styles.statValue}>{formatNumber(secretSocietyValue)}</div>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={styles.blueBox}>
              <div style={{ ...styles.statLabel, ...styles.blueText, marginBottom: '4px' }}>Net Revenue:</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatNumber(netRevenue)}</div>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={netValueVsBatna >= 0 ? styles.greenBox : styles.redBox}>
              <div style={{ 
                ...styles.statLabel, 
                color: netValueVsBatna >= 0 ? styles.greenText.color : styles.redText.color,
                marginBottom: '4px'
              }}>
                Net Value vs. BATNA ({formatNumber(batnaValue)}):
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: netValueVsBatna >= 0 ? styles.greenText.color : styles.redText.color
              }}>
                {formatNumber(netValueVsBatna)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Payment Schedule</h2>
          {renderPaymentSchedule()}
        </div>
        
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Net Revenue vs BATNA</h2>
          {renderComparisonBars()}
        </div>
      </div>
      
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Scenario Manager</h2>
        
        <div style={{ ...styles.flexRow, marginBottom: '16px' }}>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Enter scenario name"
            style={{ ...styles.input, borderRadius: '4px 0 0 4px' }}
            className={styles.flexGrow}
          />
          <button
            onClick={saveScenario}
            style={{ ...styles.button, borderRadius: '0 4px 4px 0' }}
            disabled={!scenarioName}
          >
            Save Current Scenario
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Scenario</th>
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>License Fee</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Years</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Payment</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Secret Society</th>
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Net Revenue</th>
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>vs BATNA</th>
                <th style={styles.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {savedScenarios.map((scenario, index) => (
                <tr key={index}>
                  <td style={styles.tableCell}>{scenario.name}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'right' }}>{formatNumber(scenario.licensePerEpisode)}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>{scenario.contractLength}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    {scenario.upfrontPercent}/{scenario.sixMonthPercent}/{scenario.twelveMonthPercent}/{scenario.eighteenMonthPercent}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>{scenario.includeSecretSociety ? 'Yes' : 'No'}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'right' }}>{formatNumber(scenario.netRevenue)}</td>
                  <td style={{ 
                    ...styles.tableCell, 
                    textAlign: 'right', 
                    color: scenario.netValueVsBatna >= 0 ? styles.greenText.color : styles.redText.color 
                  }}>
                    {formatNumber(scenario.netValueVsBatna)}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => loadScenario(scenario)}
                      style={styles.buttonGray}
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
      
      <div style={{ ...styles.card, marginTop: '24px' }}>
        <h2 style={styles.subtitle}>Streamers Revenue Forecast</h2>
        
        <div style={{ ...styles.grid, marginBottom: '16px' }}>
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Finale Viewership Range (millions):</label>
              <select
                value={viewershipRange}
                onChange={(e) => setViewershipRange(e.target.value)}
                style={styles.input}
              >
                <option value="20-30">20-30 Million (10% likelihood)</option>
                <option value="30-40">30-40 Million (10% likelihood)</option>
                <option value="40-50">40-50 Million (10% likelihood)</option>
                <option value="50-60">50-60 Million (50% likelihood)</option>
                <option value="60-70">60-70 Million (20% likelihood)</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Revenue per 10M Viewers:</label>
              <input
                type="number"
                value={revenuePerTenMillion}
                onChange={(e) => setRevenuePerTenMillion(Number(e.target.value))}
                style={styles.input}
                min="500000"
                max="1500000"
                step="100000"
              />
              <div style={styles.hint}>Range: $500,000 - $1,500,000 per 10M viewers</div>
            </div>
            
            <div style={styles.blueBox}>
              <div style={{ ...styles.statLabel, ...styles.blueText, marginBottom: '4px' }}>Streamers' Projected Revenue:</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatNumber(streamersRevenue)}</div>
            </div>
          </div>
          
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={styles.greenBox}>
                <div style={{ ...styles.statLabel, color: styles.greenText.color, marginBottom: '4px' }}>Your Licensing Fee:</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatNumber(baseRevenue)}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f5f3ff', 
                borderRadius: '4px', 
                border: '1px solid #ddd6fe',
                marginBottom: '16px'
              }}>
                <div style={{ ...styles.statLabel, color: '#6d28d9', marginBottom: '4px' }}>Streamers' Profit:</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatNumber(streamersRevenue - baseRevenue)}</div>
              </div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef9c3', 
              borderRadius: '4px', 
              border: '1px solid #fef08a'
            }}>
              <div style={{ ...styles.statLabel, color: '#854d0e', marginBottom: '4px' }}>Streamers' Profit Margin:</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{streamersProfitMargin.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Revenue Comparison:</h3>
          {renderComparisonBars([
            { name: 'Your Revenue', value: baseRevenue, color: '#8884d8' },
            { name: 'Streamers Revenue', value: streamersRevenue, color: '#82ca9d' },
            { name: 'Streamers Profit', value: streamersRevenue - baseRevenue, color: '#ffc658' }
          ])}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '24px', 
        backgroundColor: '#e5e7eb',
        padding: '16px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>Quick Reference</h2>
        <ul style={{ fontSize: '14px', listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '4px' }}>• BATNA: $2.5 million (VivaVideo offer)</li>
          <li style={{ marginBottom: '4px' }}>• Minimum Acceptable: $35,000 per episode</li>
          <li style={{ marginBottom: '4px' }}>• Target: $70,000 per episode</li>
          <li style={{ marginBottom: '4px' }}>• Payment Timing Costs: 6 months (20%), 12 months (35%), 18 months (50%)</li>
          <li style={{ marginBottom: '4px' }}>• Contract Length Impact: +$250K for 1 year, -$250K for 3 years, -$500K for 4 years</li>
          <li style={{ marginBottom: '4px' }}>• Viewership Impact: $0.5-1.5M revenue per 10M viewers for Streamers</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
