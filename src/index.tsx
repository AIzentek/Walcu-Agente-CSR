import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { 
  generateData, 
  calculateGlobalMetrics, 
  calculateTimelineData, 
  calculateCriteriaDistribution,
  calculateCSRRanking 
} from './data-generator'

const app = new Hono()

// Generar datos una vez al inicializar
const dashboardData = generateData()

// Enable CORS para frontend-backend communication
app.use('/api/*', cors())

// Servir archivos estáticos
app.use('/static/*', serveStatic({ root: './public' }))

// API Endpoints

// Obtener métricas globales
app.get('/api/metrics/global', (c) => {
  const dateRange = Number(c.req.query('days') || '30')
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const filteredSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const metrics = calculateGlobalMetrics(filteredSimulations, dashboardData.csrs)
  
  return c.json({
    ...metrics,
    totalSimulations: filteredSimulations.length,
    dateRange
  })
})

// Obtener datos de evolución temporal
app.get('/api/timeline', (c) => {
  const dateRange = Number(c.req.query('days') || '30')
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const filteredSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const timelineData = calculateTimelineData(filteredSimulations)
  
  return c.json(timelineData)
})

// Obtener distribución por criterios
app.get('/api/criteria/distribution', (c) => {
  const dateRange = Number(c.req.query('days') || '30')
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const filteredSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const distribution = calculateCriteriaDistribution(filteredSimulations, dashboardData.criteria)
  
  return c.json(distribution)
})

// Obtener ranking de CSRs
app.get('/api/csrs/ranking', (c) => {
  const dateRange = Number(c.req.query('days') || '30')
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const filteredSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const ranking = calculateCSRRanking(filteredSimulations, dashboardData.csrs)
  
  return c.json(ranking)
})

// Obtener datos individuales de un CSR específico
app.get('/api/csrs/:id/data', (c) => {
  const csrId = Number(c.req.param('id'))
  const dateRange = Number(c.req.query('days') || '30')
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const csr = dashboardData.csrs.find(c => c.id === csrId)
  if (!csr) {
    return c.json({ error: 'CSR not found' }, 404)
  }
  
  const csrSimulations = dashboardData.simulations
    .filter(s => s.csr_id === csrId && new Date(s.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  // Timeline individual (últimas 20 simulaciones)
  const timeline = csrSimulations.slice(0, 20).reverse().map((sim, idx) => ({
    sim: `#${idx + 1}`,
    score: sim.total_score,
    fecha: new Date(sim.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }))
  
  // Radar data - promedio por criterio vs promedio del equipo
  const allSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const radarData = dashboardData.criteria.map(criterion => {
    const criterionSims = csrSimulations.map(s => s.criteria[criterion].score_normalized)
    const avgScore = criterionSims.length > 0 ? 
      criterionSims.reduce((a, b) => a + b, 0) / criterionSims.length : 0
    
    const allCriterionSims = allSimulations.map(s => s.criteria[criterion].score_normalized)
    const teamAvg = allCriterionSims.reduce((a, b) => a + b, 0) / allCriterionSims.length
    
    return {
      criterion: criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      tuScore: parseFloat(avgScore.toFixed(1)),
      equipoPromedio: parseFloat(teamAvg.toFixed(1))
    }
  })
  
  // Métricas del CSR
  const avgScore = csrSimulations.length > 0 ? 
    csrSimulations.reduce((sum, s) => sum + s.total_score, 0) / csrSimulations.length : 0
  const successRate = csrSimulations.length > 0 ? 
    csrSimulations.filter(s => s.call_status === 'success').length / csrSimulations.length * 100 : 0
  
  return c.json({
    csr,
    timeline,
    radarData,
    simulations: csrSimulations.slice(0, 10), // Últimas 10 para la tabla
    metrics: {
      totalSimulations: csrSimulations.length,
      avgScore: parseFloat(avgScore.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(1))
    }
  })
})

// Obtener datos por criterio específico
app.get('/api/criteria/:criterion/ranking', (c) => {
  const criterion = c.req.param('criterion')
  const dateRange = Number(c.req.query('days') || '30')
  
  if (!dashboardData.criteria.includes(criterion)) {
    return c.json({ error: 'Criterion not found' }, 404)
  }
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - dateRange)
  
  const filteredSimulations = dashboardData.simulations.filter(
    s => new Date(s.timestamp) >= cutoffDate
  )
  
  const ranking = dashboardData.csrs.map(csr => {
    const csrSims = filteredSimulations.filter(s => s.csr_id === csr.id)
    const scores = csrSims.map(s => s.criteria[criterion].score_normalized)
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    
    return {
      name: csr.name,
      score: parseFloat(avgScore.toFixed(1)),
      color: csr.color,
      id: csr.id
    }
  }).sort((a, b) => b.score - a.score)
  
  const teamAvg = ranking.reduce((sum, r) => sum + r.score, 0) / ranking.length
  
  // Calcular métricas del criterio
  const criterionResults = filteredSimulations.map(s => s.criteria[criterion].result)
  const successRate = (criterionResults.filter(r => r === 'success').length / criterionResults.length * 100).toFixed(0)
  const totalEvaluations = criterionResults.length
  
  return c.json({
    ranking,
    teamAvg: parseFloat(teamAvg.toFixed(1)),
    metrics: {
      successRate: Number(successRate),
      totalEvaluations,
      topPerformer: ranking[0],
      criterion: criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  })
})

// Obtener lista de CSRs
app.get('/api/csrs', (c) => {
  return c.json(dashboardData.csrs)
})

// Obtener lista de criterios
app.get('/api/criteria', (c) => {
  const criteriaWithLabels = dashboardData.criteria.map(c => ({
    key: c,
    label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))
  
  return c.json(criteriaWithLabels)
})

// Página principal del dashboard
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard CSR - Learning Heroes</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <link href="/static/style.css" rel="stylesheet">
        <style>
          /* Estilos adicionales para el dashboard */
          .tab-active {
            border-bottom-color: #6366f1;
            color: #6366f1;
          }
          .tab-inactive {
            border-bottom-color: transparent;
            color: #64748b;
          }
          .tab-inactive:hover {
            color: #475569;
          }
          
          .metric-card {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          
          .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
          }
          
          .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            border-radius: 50%;
          }
        </style>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <!-- Header -->
        <div class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900">Dashboard de Performance CSR</h1>
                        <p class="text-sm text-slate-500 mt-1">Learning Heroes - Sistema de Evaluación de Simulaciones</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <select id="dateRange" class="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="7">Últimos 7 días</option>
                            <option value="30" selected>Últimos 30 días</option>
                            <option value="60">Últimos 60 días</option>
                            <option value="90">Últimos 90 días</option>
                        </select>
                        <button id="exportBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                            <i class="fas fa-download"></i>
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6">
                <div class="flex gap-6">
                    <button id="tab-global" class="tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors tab-active">
                        🏠 Vista Global
                    </button>
                    <button id="tab-individual" class="tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors tab-inactive">
                        👤 Individual
                    </button>
                    <button id="tab-criterio" class="tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors tab-inactive">
                        📈 Por Criterio
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-6 py-6">
            <!-- Vista Global -->
            <div id="global-view" class="view-content">
                <div id="global-loading" class="flex justify-center items-center h-64">
                    <div class="loading"></div>
                    <span class="ml-2 text-slate-600">Cargando métricas globales...</span>
                </div>
                <div id="global-content" class="space-y-6 hidden">
                    <!-- KPIs -->
                    <div class="grid grid-cols-4 gap-4" id="kpi-cards">
                        <!-- Los KPIs se cargarán dinámicamente -->
                    </div>
                    
                    <!-- Gráficos principales -->
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Evolución temporal -->
                        <div class="metric-card">
                            <h3 class="text-lg font-semibold text-slate-900 mb-4">Evolución del Equipo</h3>
                            <div class="chart-container">
                                <canvas id="timelineChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Distribución por criterio -->
                        <div class="metric-card">
                            <h3 class="text-lg font-semibold text-slate-900 mb-4">Éxito por Criterio (Equipo)</h3>
                            <div class="chart-container">
                                <canvas id="criteriaChart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ranking de CSRs -->
                    <div class="metric-card">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Ranking de CSRs</h3>
                        <div id="csr-ranking" class="space-y-3">
                            <!-- El ranking se cargará dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vista Individual -->
            <div id="individual-view" class="view-content hidden">
                <div class="space-y-6">
                    <!-- Selector de CSR -->
                    <div class="metric-card">
                        <label class="block text-sm font-medium text-slate-700 mb-2">Seleccionar CSR</label>
                        <select id="csrSelector" class="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <!-- Las opciones se cargarán dinámicamente -->
                        </select>
                    </div>
                    
                    <div id="individual-loading" class="flex justify-center items-center h-32">
                        <div class="loading"></div>
                        <span class="ml-2 text-slate-600">Cargando datos individuales...</span>
                    </div>
                    
                    <div id="individual-content" class="space-y-6 hidden">
                        <!-- Panel de perfil -->
                        <div id="profile-panel" class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 shadow-lg text-white">
                            <!-- Se cargará dinámicamente -->
                        </div>
                        
                        <!-- Gráficos individuales -->
                        <div class="grid grid-cols-2 gap-6">
                            <div class="metric-card">
                                <h3 class="text-lg font-semibold text-slate-900 mb-4">Evolución de Performance</h3>
                                <div class="chart-container">
                                    <canvas id="individualTimelineChart"></canvas>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h3 class="text-lg font-semibold text-slate-900 mb-4">Radar de Competencias</h3>
                                <div class="chart-container">
                                    <canvas id="radarChart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tabla de simulaciones -->
                        <div class="metric-card">
                            <h3 class="text-lg font-semibold text-slate-900 mb-4">Últimas Simulaciones</h3>
                            <div class="overflow-x-auto">
                                <table id="simulations-table" class="w-full">
                                    <thead>
                                        <tr class="border-b border-slate-200">
                                            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fecha</th>
                                            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Duración</th>
                                            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Score</th>
                                            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Criterios</th>
                                            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="simulations-tbody">
                                        <!-- Se cargará dinámicamente -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vista por Criterio -->
            <div id="criterio-view" class="view-content hidden">
                <div class="space-y-6">
                    <!-- Selector de criterio -->
                    <div class="metric-card">
                        <label class="block text-sm font-medium text-slate-700 mb-2">Seleccionar Criterio de Evaluación</label>
                        <select id="criterionSelector" class="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <!-- Las opciones se cargarán dinámicamente -->
                        </select>
                    </div>
                    
                    <div id="criterion-loading" class="flex justify-center items-center h-32">
                        <div class="loading"></div>
                        <span class="ml-2 text-slate-600">Cargando datos por criterio...</span>
                    </div>
                    
                    <div id="criterion-content" class="space-y-6 hidden">
                        <!-- KPIs del criterio -->
                        <div class="grid grid-cols-4 gap-4" id="criterion-kpis">
                            <!-- Se cargarán dinámicamente -->
                        </div>
                        
                        <!-- Ranking por criterio -->
                        <div class="metric-card">
                            <h3 id="criterion-title" class="text-lg font-semibold text-slate-900 mb-4">Ranking por Criterio</h3>
                            <div class="chart-container">
                                <canvas id="criterionRankingChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/dashboard.js"></script>
    </body>
    </html>
  `)
})

export default app