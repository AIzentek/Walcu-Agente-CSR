// Generador de datos simulados para el Dashboard CSR
export interface CSR {
  id: number;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

export interface CriteriaResult {
  result: 'success' | 'failure' | 'unknown';
  score_normalized: number;
}

export interface Simulation {
  simulation_id: string;
  csr_id: number;
  csr_name: string;
  timestamp: string;
  duration_seconds: number;
  difficulty: 'low' | 'medium' | 'high';
  total_score: number;
  call_status: 'success' | 'failure';
  criteria: Record<string, CriteriaResult>;
  criteria_passed: number;
  criteria_total: number;
}

export interface DashboardData {
  csrs: CSR[];
  simulations: Simulation[];
  criteria: string[];
}

export const generateData = (): DashboardData => {
  const csrs: CSR[] = [
    { id: 1, name: 'Ana López', email: 'ana.lopez@company.com', avatar: 'AL', color: '#10b981' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@company.com', avatar: 'CR', color: '#3b82f6' },
    { id: 3, name: 'Sergio', email: 'sergio@company.com', avatar: 'SE', color: '#8b5cf6' },
    { id: 4, name: 'María García', email: 'maria.garcia@company.com', avatar: 'MG', color: '#f59e0b' },
    { id: 5, name: 'Juan Pérez', email: 'juan.perez@company.com', avatar: 'JP', color: '#ef4444' },
    { id: 6, name: 'Pedro Sánchez', email: 'pedro.sanchez@company.com', avatar: 'PS', color: '#6b7280' }
  ];

  const criteria = ['conocimiento_producto', 'confianza_seguridad', 'manejo_objeciones', 'persuasion', 'personalizacion'];
  const simulations: Simulation[] = [];
  let simId = 1;

  csrs.forEach((csr, csrIndex) => {
    const performanceMultiplier = csrIndex === 0 ? 1.3 : csrIndex === 5 ? 0.6 : 1.0 - (csrIndex * 0.1);
    const numSimulations = Math.floor(30 + Math.random() * 20);
    
    for (let i = 0; i < numSimulations; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const criteriaResults: Record<string, CriteriaResult> = {};
      let successCount = 0;
      
      criteria.forEach(criterion => {
        let baseProbability = 0.5 * performanceMultiplier;
        
        if (csrIndex === 0) baseProbability = 0.85;
        if (csrIndex === 2) {
          baseProbability = criterion === 'confianza_seguridad' || criterion === 'persuasion' ? 0.75 :
                           criterion === 'conocimiento_producto' ? 0.45 : 0.60;
        }
        if (csrIndex === 5) baseProbability = 0.30;
        
        const improvementFactor = (90 - daysAgo) / 90 * 0.2;
        baseProbability += improvementFactor;
        
        const isSuccess = Math.random() < baseProbability;
        const isUnknown = Math.random() < 0.03;
        
        if (isSuccess) successCount++;
        
        criteriaResults[criterion] = {
          result: isUnknown ? 'unknown' : (isSuccess ? 'success' : 'failure'),
          score_normalized: isUnknown ? 0 : (isSuccess ? (3.5 + Math.random() * 1.5) : (1.5 + Math.random() * 1.5))
        };
      });
      
      const totalScore = Object.values(criteriaResults).reduce((sum, c) => sum + c.score_normalized, 0) / criteria.length;
      
      simulations.push({
        simulation_id: `sim_${simId++}`,
        csr_id: csr.id,
        csr_name: csr.name,
        timestamp: date.toISOString(),
        duration_seconds: Math.floor(180 + Math.random() * 300),
        difficulty: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        total_score: Math.round(totalScore * 10) / 10,
        call_status: successCount >= 3 ? 'success' : 'failure',
        criteria: criteriaResults,
        criteria_passed: successCount,
        criteria_total: criteria.length
      });
    }
  });

  simulations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return { csrs, simulations, criteria };
};

// Función para calcular métricas globales
export const calculateGlobalMetrics = (simulations: Simulation[], csrs: CSR[]) => {
  const successRate = (simulations.filter(s => s.call_status === 'success').length / simulations.length * 100).toFixed(0);
  const avgScore = (simulations.reduce((sum, s) => sum + s.total_score, 0) / simulations.length).toFixed(1);
  const totalSimulations = simulations.length;
  
  const topCSR = csrs.reduce((top, csr) => {
    const csrSims = simulations.filter(s => s.csr_id === csr.id);
    const csrAvg = csrSims.length > 0 ? csrSims.reduce((sum, s) => sum + s.total_score, 0) / csrSims.length : 0;
    return csrAvg > (top.avg || 0) ? { ...csr, avg: csrAvg } : top;
  }, {} as any);
  
  return { successRate, avgScore, totalSimulations, topCSR };
};

// Función para calcular datos de evolución temporal
export const calculateTimelineData = (simulations: Simulation[]) => {
  const grouped: Record<string, { date: string; scores: number[]; count: number }> = {};
  
  simulations.forEach(sim => {
    const date = new Date(sim.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    if (!grouped[date]) grouped[date] = { date, scores: [], count: 0 };
    grouped[date].scores.push(sim.total_score);
    grouped[date].count++;
  });
  
  return Object.values(grouped)
    .map(g => ({
      date: g.date,
      promedio: parseFloat((g.scores.reduce((a, b) => a + b, 0) / g.scores.length).toFixed(2)),
      simulaciones: g.count
    }))
    .reverse()
    .slice(-15);
};

// Función para calcular distribución por criterios
export const calculateCriteriaDistribution = (simulations: Simulation[], criteria: string[]) => {
  return criteria.map(criterion => {
    const results = simulations.map(s => s.criteria[criterion].result);
    const success = results.filter(r => r === 'success').length;
    const failure = results.filter(r => r === 'failure').length;
    const unknown = results.filter(r => r === 'unknown').length;
    const total = results.length;
    
    return {
      name: criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      success: Number((success / total * 100).toFixed(0)),
      failure: Number((failure / total * 100).toFixed(0)),
      unknown: Number((unknown / total * 100).toFixed(0)),
      successCount: success,
      failureCount: failure
    };
  });
};

// Función para calcular ranking de CSRs
export const calculateCSRRanking = (simulations: Simulation[], csrs: CSR[]) => {
  return csrs.map(csr => {
    const csrSims = simulations.filter(s => s.csr_id === csr.id);
    const avgScore = csrSims.length > 0 ? csrSims.reduce((sum, s) => sum + s.total_score, 0) / csrSims.length : 0;
    const successRate = csrSims.length > 0 ? csrSims.filter(s => s.call_status === 'success').length / csrSims.length * 100 : 0;
    
    return {
      ...csr,
      avgScore: parseFloat(avgScore.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(0)),
      totalSims: csrSims.length
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
};