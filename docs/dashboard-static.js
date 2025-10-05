// Dashboard CSR - Versión Estática para GitHub Pages
class CSRDashboardStatic {
    constructor() {
        this.activeTab = 'global';
        this.selectedCSR = null;
        this.selectedCriterion = 'conocimiento_producto';
        this.dateRange = 30;
        this.charts = {};
        
        // Datos simulados embebidos
        this.data = this.generateStaticData();
        
        this.init();
    }

    generateStaticData() {
        const csrs = [
            { id: 1, name: 'Ana López', email: 'ana.lopez@company.com', avatar: 'AL', color: '#10b981' },
            { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@company.com', avatar: 'CR', color: '#3b82f6' },
            { id: 3, name: 'Sergio', email: 'sergio@company.com', avatar: 'SE', color: '#8b5cf6' },
            { id: 4, name: 'María García', email: 'maria.garcia@company.com', avatar: 'MG', color: '#f59e0b' },
            { id: 5, name: 'Juan Pérez', email: 'juan.perez@company.com', avatar: 'JP', color: '#ef4444' },
            { id: 6, name: 'Pedro Sánchez', email: 'pedro.sanchez@company.com', avatar: 'PS', color: '#6b7280' }
        ];

        const criteria = ['conocimiento_producto', 'confianza_seguridad', 'manejo_objeciones', 'persuasion', 'personalizacion'];
        
        // Generar datos de timeline
        const timelineData = [
            { date: '15 Dec', promedio: 6.8, simulaciones: 12 },
            { date: '16 Dec', promedio: 7.1, simulaciones: 15 },
            { date: '17 Dec', promedio: 6.9, simulaciones: 18 },
            { date: '18 Dec', promedio: 7.3, simulaciones: 14 },
            { date: '19 Dec', promedio: 7.0, simulaciones: 16 },
            { date: '20 Dec', promedio: 7.4, simulaciones: 20 },
            { date: '21 Dec', promedio: 7.2, simulaciones: 17 },
            { date: '22 Dec', promedio: 7.6, simulaciones: 19 },
            { date: '23 Dec', promedio: 7.1, simulaciones: 13 },
            { date: '24 Dec', promedio: 7.8, simulaciones: 22 }
        ];

        // Generar distribución por criterios
        const criteriaDistribution = [
            { name: 'Conocimiento Producto', success: 78, failure: 18, unknown: 4 },
            { name: 'Confianza Seguridad', success: 82, failure: 15, unknown: 3 },
            { name: 'Manejo Objeciones', success: 71, failure: 25, unknown: 4 },
            { name: 'Persuasion', success: 75, failure: 20, unknown: 5 },
            { name: 'Personalizacion', success: 68, failure: 28, unknown: 4 }
        ];

        // Generar ranking CSRs
        const csrRanking = [
            { ...csrs[0], avgScore: 8.5, successRate: 92, totalSims: 24 },
            { ...csrs[2], avgScore: 7.8, successRate: 85, totalSims: 22 },
            { ...csrs[1], avgScore: 7.2, successRate: 78, totalSims: 20 },
            { ...csrs[3], avgScore: 6.9, successRate: 72, totalSims: 18 },
            { ...csrs[4], avgScore: 6.3, successRate: 65, totalSims: 16 },
            { ...csrs[5], avgScore: 5.8, successRate: 58, totalSims: 14 }
        ];

        // Datos individuales para Sergio (CSR por defecto)
        const individualData = {
            csr: csrs[2], // Sergio
            timeline: [
                { sim: '#1', score: 7.2, fecha: '15 Dec' },
                { sim: '#2', score: 7.8, fecha: '16 Dec' },
                { sim: '#3', score: 7.5, fecha: '17 Dec' },
                { sim: '#4', score: 8.1, fecha: '18 Dec' },
                { sim: '#5', score: 7.9, fecha: '19 Dec' },
                { sim: '#6', score: 8.3, fecha: '20 Dec' },
                { sim: '#7', score: 7.7, fecha: '21 Dec' },
                { sim: '#8', score: 8.0, fecha: '22 Dec' },
                { sim: '#9', score: 7.6, fecha: '23 Dec' },
                { sim: '#10', score: 8.2, fecha: '24 Dec' }
            ],
            radarData: [
                { criterion: 'Conocimiento Producto', tuScore: 8.1, equipoPromedio: 7.3 },
                { criterion: 'Confianza Seguridad', tuScore: 8.4, equipoPromedio: 7.1 },
                { criterion: 'Manejo Objeciones', tuScore: 7.2, equipoPromedio: 6.8 },
                { criterion: 'Persuasión', tuScore: 7.8, equipoPromedio: 7.0 },
                { criterion: 'Personalización', tuScore: 7.5, equipoPromedio: 6.9 }
            ],
            simulations: [
                {
                    timestamp: '2024-12-24T10:30:00Z',
                    duration_seconds: 245,
                    total_score: 8.2,
                    criteria: {
                        conocimiento_producto: { result: 'success' },
                        confianza_seguridad: { result: 'success' },
                        manejo_objeciones: { result: 'success' },
                        persuasion: { result: 'success' },
                        personalizacion: { result: 'failure' }
                    },
                    call_status: 'success'
                },
                {
                    timestamp: '2024-12-23T14:15:00Z',
                    duration_seconds: 198,
                    total_score: 7.6,
                    criteria: {
                        conocimiento_producto: { result: 'success' },
                        confianza_seguridad: { result: 'success' },
                        manejo_objeciones: { result: 'failure' },
                        persuasion: { result: 'success' },
                        personalizacion: { result: 'success' }
                    },
                    call_status: 'success'
                }
            ],
            metrics: { totalSimulations: 22, avgScore: 7.8, successRate: 85 }
        };

        // Datos por criterio
        const criterionData = {
            ranking: [
                { name: 'Ana López', score: 8.9, color: '#10b981', id: 1 },
                { name: 'Sergio', score: 8.1, color: '#8b5cf6', id: 3 },
                { name: 'Carlos Ruiz', score: 7.4, color: '#3b82f6', id: 2 },
                { name: 'María García', score: 7.0, color: '#f59e0b', id: 4 },
                { name: 'Juan Pérez', score: 6.5, color: '#ef4444', id: 5 },
                { name: 'Pedro Sánchez', score: 5.8, color: '#6b7280', id: 6 }
            ],
            teamAvg: 7.3,
            metrics: {
                successRate: 78,
                totalEvaluations: 142,
                topPerformer: { name: 'Ana López', score: 8.9 },
                criterion: 'Conocimiento Del Producto'
            }
        };

        return {
            csrs,
            criteria,
            globalMetrics: {
                successRate: '77',
                avgScore: '7.2',
                totalSimulations: 134,
                topCSR: { name: 'Ana López', avg: 8.5 }
            },
            timelineData,
            criteriaDistribution,
            csrRanking,
            individualData,
            criterionData
        };
    }

    async init() {
        this.selectedCSR = this.data.csrs[2]; // Sergio por defecto
        this.setupEventListeners();
        this.populateSelectors();
        this.showTab('global');
    }

    populateSelectors() {
        // Populate CSR selector
        const csrSelector = document.getElementById('csrSelector');
        if (csrSelector) {
            csrSelector.innerHTML = '';
            this.data.csrs.forEach(csr => {
                const option = document.createElement('option');
                option.value = csr.id;
                option.textContent = csr.name;
                option.selected = csr.id === this.selectedCSR.id;
                csrSelector.appendChild(option);
            });
        }

        // Populate criteria selector
        const criterionSelector = document.getElementById('criterionSelector');
        if (criterionSelector) {
            const criteriaLabels = {
                conocimiento_producto: 'Conocimiento del Producto',
                confianza_seguridad: 'Confianza y Seguridad',
                manejo_objeciones: 'Manejo de Objeciones',
                persuasion: 'Persuasión',
                personalizacion: 'Personalización'
            };
            
            criterionSelector.innerHTML = '';
            this.data.criteria.forEach(criterion => {
                const option = document.createElement('option');
                option.value = criterion;
                option.textContent = criteriaLabels[criterion];
                option.selected = criterion === this.selectedCriterion;
                criterionSelector.appendChild(option);
            });
        }
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
                this.selectedCSR = this.data.csrs.find(c => c.id === Number(e.target.value));
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

    loadGlobalView() {
        this.renderGlobalKPIs(this.data.globalMetrics);
        this.renderTimelineChart(this.data.timelineData);
        this.renderCriteriaChart(this.data.criteriaDistribution);
        this.renderCSRRanking(this.data.csrRanking);
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
                            <span class="text-sm text-blue-600 font-medium">+0.8 vs mes anterior</span>
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
                            <span class="text-sm text-amber-600 font-medium">${metrics.topCSR.avg}/10 promedio</span>
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
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { color: '#64748b' },
                        grid: { color: '#e2e8f0' }
                    },
                    x: {
                        ticks: { color: '#64748b' },
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }

    renderCriteriaChart(data) {
        const ctx = document.getElementById('criteriaChart');
        if (!ctx) return;

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
                        backgroundColor: '#10b981'
                    },
                    {
                        label: 'Failure',
                        data: data.map(d => d.failure),
                        backgroundColor: '#ef4444'
                    },
                    {
                        label: 'Unknown',
                        data: data.map(d => d.unknown),
                        backgroundColor: '#94a3b8'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            color: '#64748b'
                        }
                    },
                    y: { stacked: true }
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
            else if (csr.avgScore < 6) badges = '⚠️';

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
                        <div class="flex-1 bg-slate-200 rounded-full h-2">
                            <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                                 style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    ${badges ? `<div class="text-2xl">${badges}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    loadIndividualView() {
        const data = this.data.individualData;
        this.renderIndividualProfile(data);
        this.renderIndividualTimeline(data.timeline);
        this.renderRadarChart(data.radarData);
        this.renderSimulationsTable(data.simulations);
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
                        <div class="text-3xl font-bold">${data.metrics.avgScore}/10</div>
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
                    pointBackgroundColor: this.selectedCSR.color,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { color: '#64748b' }
                    },
                    x: { ticks: { color: '#64748b' } }
                }
            }
        });
    }

    renderRadarChart(data) {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

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
                        borderWidth: 2
                    },
                    {
                        label: 'Promedio Equipo',
                        data: data.map(d => d.equipoPromedio),
                        borderColor: '#94a3b8',
                        backgroundColor: '#94a3b840',
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10
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

    loadCriterionView() {
        const data = this.data.criterionData;
        this.renderCriterionKPIs(data.metrics);
        this.renderCriterionRankingChart(data.ranking);
        
        const title = document.getElementById('criterion-title');
        if (title) {
            title.textContent = `Ranking - ${data.metrics.criterion}`;
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
                <p class="text-3xl font-bold text-slate-900 mt-2">${metrics.teamAvg}/10</p>
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
                    backgroundColor: data.map(d => d.color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { color: '#64748b' }
                    },
                    y: { ticks: { color: '#64748b' } }
                }
            }
        });
    }

    exportData() {
        const dataToExport = {
            activeTab: this.activeTab,
            dateRange: this.dateRange,
            selectedCSR: this.selectedCSR,
            selectedCriterion: this.selectedCriterion,
            exportDate: new Date().toISOString(),
            note: 'Dashboard Walcu by AiZentek - Versión estática para GitHub Pages'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `walcu-csr-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.csrDashboardStatic = new CSRDashboardStatic();
});