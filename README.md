# 📊 Dashboard Agente CSR

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Technology](https://img.shields.io/badge/Tech-Hono%20%2B%20Chart.js-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Dashboard Completo de Performance para Agentes CSR

## 🚀 Descripción del Proyecto

Dashboard interactivo para el análisis y evaluación de performance de Agentes de Customer Service (CSR). Sistema completo con visualizaciones avanzadas, métricas en tiempo real y análisis comparativo.

### ✨ Características Principales
- 📈 **Métricas en Tiempo Real**: KPIs actualizados con filtros temporales
- 👤 **Análisis Individual**: Perfiles detallados por agente
- 📊 **Comparativas por Criterio**: Rankings y evaluaciones específicas
- 🎨 **Visualizaciones Interactivas**: Charts responsivos con Chart.js
- 📱 **Diseño Responsive**: Optimizado para desktop y tablet
- 🔄 **Datos Dinámicos**: 300+ simulaciones realistas

## 🔗 Enlaces

- **🌐 Demo en Vivo**: [Ver Dashboard](https://3000-i4bwj69qxj2xa0pum6b2y-6532622b.e2b.dev)
- **🔍 API Health Check**: [Métricas Globales](https://3000-i4bwj69qxj2xa0pum6b2y-6532622b.e2b.dev/api/metrics/global)
- **📁 Repositorio**: [GitHub](https://github.com/USERNAME/dashboard-agente-csr)

## Funcionalidades Completadas

### ✅ Vista Global
- **KPIs Principales**: Tasa de éxito, score promedio, total simulaciones, top performer
- **Evolución Temporal**: Gráfico de línea mostrando tendencias del equipo
- **Distribución por Criterios**: Gráfico de barras horizontales con porcentajes de éxito/fallo
- **Ranking de CSRs**: Lista ordenada con scores, progress bars y badges de reconocimiento

### ✅ Vista Individual
- **Perfil del CSR**: Panel con información personal y métricas clave
- **Selector de CSR**: Dropdown para cambiar entre diferentes CSRs
- **Evolución Personal**: Gráfico de línea con últimas 20 simulaciones
- **Radar de Competencias**: Comparativa de 5 criterios vs promedio del equipo
- **Tabla de Simulaciones**: Últimas 10 simulaciones con detalles completos

### ✅ Vista por Criterio  
- **Selector de Criterios**: 5 criterios de evaluación disponibles
- **KPIs del Criterio**: Tasa de éxito, top performer, promedio, total evaluaciones
- **Ranking por Criterio**: Gráfico de barras horizontales con colores personalizados

### ✅ Funcionalidades Adicionales
- **Filtrado Temporal**: 7, 30, 60, 90 días
- **Exportación de Datos**: JSON con configuración actual
- **Responsive Design**: Optimizado para desktop y tablet
- **Loading States**: Indicadores de carga para mejor UX

## Entry URIs y Parámetros

### Frontend
- `GET /` - Dashboard principal con todas las vistas

### API Endpoints
- `GET /api/metrics/global?days={dateRange}` - Métricas globales del equipo
- `GET /api/timeline?days={dateRange}` - Datos de evolución temporal
- `GET /api/criteria/distribution?days={dateRange}` - Distribución por criterios
- `GET /api/csrs/ranking?days={dateRange}` - Ranking de CSRs
- `GET /api/csrs/{id}/data?days={dateRange}` - Datos individuales de CSR
- `GET /api/criteria/{criterion}/ranking?days={dateRange}` - Ranking por criterio específico
- `GET /api/csrs` - Lista completa de CSRs
- `GET /api/criteria` - Lista de criterios con labels

**Parámetros comunes:**
- `days`: Rango de fechas (7, 30, 60, 90)
- `id`: ID numérico del CSR
- `criterion`: Clave del criterio (conocimiento_producto, confianza_seguridad, etc.)

## Data Architecture

### Modelos Principales
- **CSR**: id, name, email, avatar, color
- **Simulation**: simulation_id, csr_id, timestamp, score, criterios, status
- **CriteriaResult**: result (success/failure/unknown), score_normalized

### Criterios de Evaluación
1. **Conocimiento del Producto** (conocimiento_producto)
2. **Confianza y Seguridad** (confianza_seguridad)  
3. **Manejo de Objeciones** (manejo_objeciones)
4. **Persuasión** (persuasion)
5. **Personalización** (personalizacion)

### Generación de Datos
- **300+ simulaciones** distribuidas entre 6 CSRs
- **Variación de performance** realista por CSR
- **Datos temporales** de últimos 90 días
- **Puntuaciones** normalizadas de 0-5

## User Guide

### Navegación Principal
1. **Vista Global** 🏠: Métricas generales del equipo y rankings
2. **Individual** 👤: Análisis detallado por CSR seleccionado  
3. **Por Criterio** 📈: Comparativa específica por criterio de evaluación

### Filtros y Controles
- **Rango Temporal**: Selector superior derecho (7-90 días)
- **Selección CSR**: Dropdown en vista individual
- **Criterios**: Dropdown en vista por criterio
- **Exportar**: Botón para descargar datos en JSON

### Interpretación de Gráficos
- **Verde**: Resultados exitosos/buenos
- **Rojo**: Resultados fallidos/mejorables
- **Gris**: Datos desconocidos/no evaluados
- **Badges**: ⭐⭐⭐ (Top 3), ⚠️ (Performance bajo)

## Tech Stack
- **Backend**: Hono + TypeScript + Cloudflare Workers
- **Frontend**: JavaScript Vanilla + Chart.js + TailwindCSS + Font Awesome
- **Visualizaciones**: Chart.js (Line, Bar, Radar charts)
- **Styling**: TailwindCSS + Custom CSS
- **Icons**: Font Awesome 6.4.0

## Deployment
- **Platform**: Cloudflare Pages Ready
- **Status**: ✅ Active - Development Version
- **Environment**: Sandbox Development
- **Process Manager**: PM2 (ecosystem.config.cjs)
- **Last Updated**: 2025-01-10

## Características Técnicas
- **Responsive Design**: Optimizado para resoluciones 1200px+
- **Loading Performance**: Lazy loading de gráficos y datos
- **Error Handling**: Manejo de errores en API y frontend
- **Chart Cleanup**: Destrucción correcta de gráficos previos
- **Memory Management**: Gestión eficiente de recursos Chart.js

## Próximos Pasos Recomendados
1. **Integración con Base de Datos Real**: Reemplazar generador de datos simulados
2. **Autenticación de Usuarios**: Sistema de login para CSRs y supervisores
3. **Notificaciones Push**: Alertas por performance bajo
4. **Exportación Avanzada**: PDF reports y Excel
5. **Filtros Avanzados**: Por supervisor, región, producto
6. **Análisis Predictivo**: ML para predecir performance futura
7. **Mobile App**: Versión nativa para dispositivos móviles

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <strong>🚀 Dashboard Agente CSR - Walcu by AiZentek</strong><br>
  <em>Sistema de Evaluación de Performance para Customer Service Representatives</em><br><br>
  <a href="#">⭐ Dale una estrella si te gustó este proyecto ⭐</a>
</div>