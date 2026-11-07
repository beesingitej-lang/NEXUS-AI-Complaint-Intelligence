const axios = require('./backend/node_modules/axios');

async function testAll() {
  console.log('--- SYSTEM INTEGRATION TEST ---');
  
  // 1. Test AI Health
  try {
    const aiHealth = await axios.get('http://127.0.0.1:8000/health');
    console.log('✅ AI Service Health:', aiHealth.data.status);
  } catch (e) {
    console.error('❌ AI Service unreachable:', e.message);
  }

  // 2. Test Backend Health
  try {
    const backendHealth = await axios.get('http://127.0.0.1:5000/health');
    console.log('✅ Backend API Health:', backendHealth.data.status);
  } catch (e) {
    console.error('❌ Backend API unreachable:', e.message);
  }

  // 3. Test Admin Login
  let token = '';
  try {
    const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
      email: 'admin@nexus.com',
      password: 'admin123',
    });
    console.log('✅ Admin Login Successful. Role:', loginRes.data.user.role);
    token = loginRes.data.token;
  } catch (e) {
    console.error('❌ Login failed:', e.response?.data?.message || e.message);
  }

  // 4. Test Pre-Analyze Complaint through Backend
  try {
    const analyzeRes = await axios.post(
      'http://127.0.0.1:5000/api/complaints/pre-analyze',
      {
        title: 'Water is leaking in Block C for three days.',
        description: 'Water tap leaking continuously in corridor.',
        location: 'Block C',
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ AI Pre-Analyze Result:');
    console.log('   - Category:', analyzeRes.data.analysis.category);
    console.log('   - Department:', analyzeRes.data.analysis.department);
    console.log('   - Priority:', analyzeRes.data.analysis.priority);
    console.log('   - Score:', analyzeRes.data.analysis.priority_score);
    console.log('   - Has Similar:', analyzeRes.data.analysis.has_similar);
  } catch (e) {
    console.error('❌ Pre-analyze failed:', e.response?.data?.message || e.message);
  }

  // 5. Test Admin AI Insights
  try {
    const insightsRes = await axios.get('http://127.0.0.1:5000/api/admin/ai-insights', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Admin AI Insights:');
    console.log('   - Top Category:', insightsRes.data.insights.mostReportedCategory);
    console.log('   - Top Location:', insightsRes.data.insights.highestComplaintLocation);
  } catch (e) {
    console.error('❌ AI Insights failed:', e.response?.data?.message || e.message);
  }

  console.log('--- TEST COMPLETE ---');
}

testAll();
