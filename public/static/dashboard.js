// Dashboard CSR - Frontend JavaScript
class CSRDashboard {
    constructor() {
        this.activeTab = 'global';
        this.selectedCSR = null;
        this.selectedCriterion = 'conocimiento_producto';
        this.dateRange = 30;
        this.csrs = [];
        this.criteria = [];
        this.charts = {};
        
        this.init();
    }

    async init() {
        await this.loadInitialData();
        this.setupEventListeners();
        this.showTab('global');
    }

    async loadInitialData() {
        try {
            // Cargar CSRs y criterios
            const [csrsResponse, criteriaResponse] = await Promise.all([
                axios.get('/api/csrs'),
                axios.get('/api/criteria')
            ]);
            
            this.csrs = csrsResponse.data;
            this.criteria = criteriaResponse.data;
            
            // Seleccionar primer CSR por defecto (Sergio)
            this.selectedCSR = this.csrs.find(c => c.name === 'Sergio') || this.csrs[0];
            
            // Llenar selectores
            this.populateCSRSelector();
            this.populateCriteriaSelector();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    populateCSRSelector() {
        const selector = document.getElementById('csrSelector');
        if (!selector) return;
        
        selector.innerHTML = '';
        this.csrs.forEach(csr => {
            const option = document.createElement('option');
            option.value = csr.id;
            option.textContent = csr.name;
            option.selected = csr.id === this.selectedCSR.id;
            selector.appendChild(option);
        });
    }

    populateCriteriaSelector() {
        const selector = document.getElementById('criterionSelector');
        if (!selector) return;
        
        selector.innerHTML = '';
        this.criteria.forEach(criterion => {
            const option = document.createElement('option');
            option.value = criterion.key;
            option.textContent = criterion.label;
            option.selected = criterion.key === this.selectedCriterion;
            selector.appendChild(option);
        });
    }

    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.id.replace('tab-', '');
                this.showTab(tabId);
            });
        });

        // Date range selector
        const dateRangeSelector = document.getElementById('dateRange');
        if (dateRangeSelector) {
            dateRangeSelector.addEventListener('change', (e) => {
                this.dateRange = Number(e.target.value);
                this.refreshCurrentView();
            });
        }

        // CSR selector
        const csrSelector = document.getElementById('csrSelector');
        if (csrSelector) {
            csrSelector.addEventListener('change', (e) => {
                this.selectedCSR = this.csrs.find(c => c.id === Number(e.target.value));
                this.loadIndividualView();
            });
        }

        // Criterion selector
        const criterionSelector = document.getElementById('criterionSelector');
        if (criterionSelector) {
            criterionSelector.addEventListener('change', (e) => {
                this.selectedCriterion = e.target.value;
                this.loadCriterionView();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }

    showTab(tabId) {
        this.activeTab = tabId;
        
        // Actualizar tabs UI
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('tab-active');
            btn.classList.add('tab-inactive');
        });
        
        const activeBtn = document.getElementById(`tab-${tabId}`);
        if (activeBtn) {
            activeBtn.classList.remove('tab-inactive');
            activeBtn.classList.add('tab-active');
        }

        // Mostrar/ocultar contenido
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.add('hidden');
        });
        
        const activeView = document.getElementById(`${tabId}-view`);
        if (activeView) {
            activeView.classList.remove('hidden');
        }

        // Cargar datos de la vista
        this.refreshCurrentView();
    }

    refreshCurrentView() {
        switch (this.activeTab) {
            case 'global':
                this.loadGlobalView();
                break;
            case 'individual':
                this.loadIndividualView();
                break;
            case 'criterio':
                this.loadCriterionView();
                break;
        }
    }

    async loadGlobalView() {
        const loading = document.getElementById('global-loading');
        const content = document.getElementById('global-content');
        
        if (loading) loading.classList.remove('hidden');
        if (content) content.classList.add('hidden');

        try {
            const [metricsResponse, timelineResponse, criteriaResponse, rankingResponse] = await Promise.all([
                axios.get(`/api/metrics/global?days=${this.dateRange}`),
                axios.get(`/api/timeline?days=${this.dateRange}`),
                axios.get(`/api/criteria/distribution?days=${this.dateRange}`),
                axios.get(`/api/csrs/ranking?days=${this.dateRange}`)
            ]);

            this.renderGlobalKPIs(metricsResponse.data);
            this.renderTimelineChart(timelineResponse.data);
            this.renderCriteriaChart(criteriaResponse.data);
            this.renderCSRRanking(rankingResponse.data);

            if (loading) loading.classList.add('hidden');
            if (content) content.classList.remove('hidden');
        } catch (error) {
            console.error('Error loading global view:', error);
            if (loading) loading.classList.add('hidden');
        }
    }

    renderGlobalKPIs(metrics) {
        const container = document.getElementById('kpi-cards');
        if (!container) return;

        container.innerHTML = `
            <div class="metric-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-slate-500 font-medium">Tasa de Éxito</p>
                        <p class="text-3xl font-bold text-slate-900 mt-1">${metrics.successRate}%</p>
                        <div class="flex items-center gap-1 mt-2">
                            <i class="fas fa-trending-up text-green-500"></i>
                            <span class="text-sm text-green-600 font-medium">+12% vs mes anterior</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-target text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>
            <div class="metric-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-slate-500 font-medium">Score Promedio</p>
                        <p class="text-3xl font-bold text-slate-900 mt-1">${metrics.avgScore}/10</p>
                        <div class="flex items-center gap-1 mt-2">
                            <i class="fas fa-trending-up text-blue-500"></i>
                            <span class="text-sm text-blue-600 font-medium">+0.4 vs mes anterior</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-award text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>
            <div class="metric-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-slate-500 font-medium">Simulaciones</p>
                        <p class="text-3xl font-bold text-slate-900 mt-1">${metrics.totalSimulations}</p>
                        <div class="flex items-center gap-1 mt-2">
                            <i class="fas fa-trending-up text-purple-500"></i>
                            <span class="text-sm text-purple-600 font-medium">+34 vs mes anterior</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-users text-purple-600 text-xl"></i>
                    </div>
                </div>
            </div>
            <div class="metric-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-slate-500 font-medium">Top CSR del Mes</p>
                        <p class="text-xl font-bold text-slate-900 mt-1">${metrics.topCSR.name}</p>
                        <div class="flex items-center gap-1 mt-2">
                            <span class="text-sm text-amber-600 font-medium">${metrics.topCSR.avg?.toFixed(1)}/10 promedio</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                        🏆
                    </div>
                </div>
            </div>
        `;
    }

    renderTimelineChart(data) {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.charts.timeline) {
            this.charts.timeline.destroy();
        }

        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Score Promedio',
                    data: data.map(d => d.promedio),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    }
                }
            }
        });
    }

    renderCriteriaChart(data) {
        const ctx = document.getElementById('criteriaChart');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.charts.criteria) {
            this.charts.criteria.destroy();
        }

        this.charts.criteria = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        label: 'Success',
                        data: data.map(d => d.success),
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Failure',
                        data: data.map(d => d.failure),
                        backgroundColor: '#ef4444',
                        borderRadius: 4
                    },
                    {
                        label: 'Unknown',
                        data: data.map(d => d.unknown),
                        backgroundColor: '#94a3b8',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }

    renderCSRRanking(data) {
        const container = document.getElementById('csr-ranking');
        if (!container) return;

        container.innerHTML = data.map((csr, idx) => {
            const percentage = (csr.avgScore / 10) * 100;
            let badges = '';
            if (idx === 0) badges = '⭐⭐⭐';
            else if (idx === 1) badges = '⭐⭐';
            else if (idx === 2) badges = '⭐';
            else if (csr.avgScore < 2.5) badges = '⚠️';

            return `
                <div class="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                    <div class="text-2xl font-bold text-slate-400 w-8">${idx + 1}</div>
                    <div class="avatar w-10 h-10" style="background-color: ${csr.color}">
                        ${csr.avatar}
                    </div>
                    <div class="flex-1">
                        <div class="font-semibold text-slate-900">${csr.name}</div>
                        <div class="text-sm text-slate-500">${csr.totalSims} simulaciones</div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-slate-900">${csr.avgScore}</div>
                        <div class="text-xs text-slate-500">de 10.0</div>
                    </div>
                    <div class="w-64">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 bg-slate-200 rounded-full h-2">
                                <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" 
                                     style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    </div>
                    ${badges ? `<div class="text-2xl">${badges}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    async loadIndividualView() {
        if (!this.selectedCSR) return;

        const loading = document.getElementById('individual-loading');
        const content = document.getElementById('individual-content');
        
        if (loading) loading.classList.remove('hidden');
        if (content) content.classList.add('hidden');

        try {
            const response = await axios.get(`/api/csrs/${this.selectedCSR.id}/data?days=${this.dateRange}`);
            const data = response.data;

            this.renderIndividualProfile(data);
            this.renderIndividualTimeline(data.timeline);
            this.renderRadarChart(data.radarData);
            this.renderSimulationsTable(data.simulations);

            if (loading) loading.classList.add('hidden');
            if (content) content.classList.remove('hidden');
        } catch (error) {
            console.error('Error loading individual view:', error);
            if (loading) loading.classList.add('hidden');
        }
    }

    renderIndividualProfile(data) {
        const container = document.getElementById('profile-panel');
        if (!container) return;

        container.innerHTML = `
            <div class="flex items-center gap-6">
                <div class="avatar w-20 h-20 text-3xl border-4 border-white/30" style="background-color: rgba(255,255,255,0.2)">
                    ${data.csr.avatar}
                </div>
                <div class="flex-1">
                    <h2 class="text-3xl font-bold mb-2">${data.csr.name}</h2>
                    <p class="text-indigo-100">${data.csr.email}</p>
                </div>
                <div class="grid grid-cols-3 gap-6 text-center">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div class="text-3xl font-bold">${data.metrics.totalSimulations}</div>
                        <div class="text-sm text-indigo-100">Simulaciones</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div class="text-3xl font-bold">${data.metrics.avgScore}</div>
                        <div class="text-sm text-indigo-100">Score Actual</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div class="text-3xl font-bold">${data.metrics.successRate}%</div>
                        <div class="text-sm text-indigo-100">Tasa Éxito</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderIndividualTimeline(data) {
        const ctx = document.getElementById('individualTimelineChart');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.charts.individualTimeline) {
            this.charts.individualTimeline.destroy();
        }

        this.charts.individualTimeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.sim),
                datasets: [{
                    label: 'Score',
                    data: data.map(d => d.score),
                    borderColor: this.selectedCSR.color,
                    backgroundColor: this.selectedCSR.color + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: this.selectedCSR.color,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    }
                }
            }
        });
    }

    renderRadarChart(data) {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.charts.radar) {
            this.charts.radar.destroy();
        }

        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.map(d => d.criterion),
                datasets: [
                    {
                        label: 'Tu Score',
                        data: data.map(d => d.tuScore),
                        borderColor: this.selectedCSR.color,
                        backgroundColor: this.selectedCSR.color + '40',
                        borderWidth: 2,
                        pointBackgroundColor: this.selectedCSR.color,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Promedio Equipo',
                        data: data.map(d => d.equipoPromedio),
                        borderColor: '#94a3b8',
                        backgroundColor: '#94a3b840',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#94a3b8',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#64748b',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: '#e2e8f0'
                        },
                        angleLines: {
                            color: '#e2e8f0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderSimulationsTable(simulations) {
        const tbody = document.getElementById('simulations-tbody');
        if (!tbody) return;

        const criteriaLabels = ['CP', 'CS', 'MO', 'PE', 'PS'];
        const criteriaNames = ['Conocimiento Producto', 'Confianza Seguridad', 'Manejo Objeciones', 'Persuasión', 'Personalización'];
        
        tbody.innerHTML = simulations.map(sim => {
            const date = new Date(sim.timestamp).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
            
            const duration = `${Math.floor(sim.duration_seconds / 60)}:${(sim.duration_seconds % 60).toString().padStart(2, '0')}`;
            
            const scoreColor = sim.total_score >= 8 ? 'text-green-600' : 
                              sim.total_score >= 6 ? 'text-amber-600' : 'text-red-600';
            
            const statusColor = sim.call_status === 'success' ? 
                'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
            
            const statusText = sim.call_status === 'success' ? 'Exitosa' : 'Fallida';
            
            // Generar criterios badges
            const criteriaBadges = Object.keys(sim.criteria).map((criterion, index) => {
                const result = sim.criteria[criterion].result;
                const badgeColor = result === 'success' ? 'bg-green-100 text-green-700' :
                                  result === 'failure' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700';
                
                return `
                    <div title="${criteriaNames[index]}" 
                         class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold cursor-help ${badgeColor}">
                        ${criteriaLabels[index]}
                    </div>
                `;
            }).join('');

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="py-3 px-4 text-sm text-slate-600">${date}</td>
                    <td class="py-3 px-4 text-sm text-slate-600">${duration}</td>
                    <td class="py-3 px-4">
                        <span class="font-semibold ${scoreColor}">${sim.total_score}</span>
                    </td>
                    <td class="py-3 px-4 text-sm">
                        <div class="flex gap-1">${criteriaBadges}</div>
                    </td>
                    <td class="py-3 px-4">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColor}">
                            ${statusText}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async loadCriterionView() {
        const loading = document.getElementById('criterion-loading');
        const content = document.getElementById('criterion-content');
        
        if (loading) loading.classList.remove('hidden');
        if (content) content.classList.add('hidden');

        try {
            const response = await axios.get(`/api/criteria/${this.selectedCriterion}/ranking?days=${this.dateRange}`);
            const data = response.data;

            this.renderCriterionKPIs(data.metrics);
            this.renderCriterionRankingChart(data.ranking);
            
            // Actualizar título
            const title = document.getElementById('criterion-title');
            if (title) {
                title.textContent = `Ranking - ${data.metrics.criterion}`;
            }

            if (loading) loading.classList.add('hidden');
            if (content) content.classList.remove('hidden');
        } catch (error) {
            console.error('Error loading criterion view:', error);
            if (loading) loading.classList.add('hidden');
        }
    }

    renderCriterionKPIs(metrics) {
        const container = document.getElementById('criterion-kpis');
        if (!container) return;

        container.innerHTML = `
            <div class="metric-card">
                <p class="text-sm text-slate-500 font-medium">Tasa de Éxito</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">${metrics.successRate}%</p>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 font-medium">Top Performer</p>
                <p class="text-xl font-bold text-slate-900 mt-2">${metrics.topPerformer.name}</p>
                <p class="text-sm text-slate-500">${metrics.topPerformer.score}/10</p>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 font-medium">Promedio CSRs</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">${metrics.teamAvg || 0}/10</p>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 font-medium">Total Evaluaciones</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">${metrics.totalEvaluations}</p>
            </div>
        `;
    }

    renderCriterionRankingChart(data) {
        const ctx = document.getElementById('criterionRankingChart');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.charts.criterionRanking) {
            this.charts.criterionRanking.destroy();
        }

        this.charts.criterionRanking = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Score',
                    data: data.map(d => d.score),
                    backgroundColor: data.map(d => d.color),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }

    exportData() {
        // Funcionalidad de exportación
        const dataToExport = {
            activeTab: this.activeTab,
            dateRange: this.dateRange,
            selectedCSR: this.selectedCSR,
            selectedCriterion: this.selectedCriterion,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `csr-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.csrDashboard = new CSRDashboard();
});