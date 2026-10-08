/**
 * НАУЧНЫЕ ДИАГРАММЫ И АНАЛИТИКА (CHART.JS)
 * Динамика индексов, тепловая карта интенсивности, климатические нормы, экстремумы
 */

class ScientificCharts {
  constructor() {
    this.chartTimeseries = null;
    this.chartNorms = null;
    this.chartCases = null;
    this.chartRadar = null;
    this.selectedStation = 'all';
    this.selectedMonthKey = 'jul';
    this.init();
  }

  init() {
    this.renderTimeseries();
    this.renderNorms();
    this.renderCases();
    this.renderRadar();
    this.renderHeatmapMatrix('taldykorgan');
  }

  // 1. График динамики индекса Педя Si (2010–2025 гг.)
  renderTimeseries() {
    const ctx = document.getElementById('chart-timeseries');
    if (!ctx) return;

    if (this.chartTimeseries) {
      this.chartTimeseries.destroy();
    }

    const years = SCIENTIFIC_DATA.meta.years;
    const datasets = [];

    const stationList = this.selectedStation === 'all' 
      ? Object.values(SCIENTIFIC_DATA.stations) 
      : [SCIENTIFIC_DATA.stations[this.selectedStation]];

    stationList.forEach(st => {
      const dataPoints = years.map(yr => {
        if (this.selectedMonthKey === 'avg') {
          // Среднее за теплое полугодие
          const mKeys = SCIENTIFIC_DATA.meta.monthKeys;
          let sum = 0, count = 0;
          mKeys.forEach(k => {
            const v = st.drought[yr] ? st.drought[yr][k] : null;
            if (v !== null && v !== undefined) {
              sum += v;
              count++;
            }
          });
          return count > 0 ? Number((sum / count).toFixed(2)) : null;
        } else {
          return st.drought[yr] ? st.drought[yr][this.selectedMonthKey] : null;
        }
      });

      datasets.push({
        label: st.name,
        data: dataPoints,
        borderColor: st.color,
        backgroundColor: st.color + '25',
        borderWidth: 2.5,
        pointBackgroundColor: st.color,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.25,
        spanGaps: true
      });
    });

    this.chartTimeseries = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { size: 12, family: 'Inter, system-ui, sans-serif' }
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const val = context.raw;
                if (val === null) return 'Нет данных';
                const c = PedHelper.getClassification(val);
                return `Категория: ${c.label}`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Параметр атмосферной засухи (Si)',
              font: { weight: 'bold' }
            },
            grid: {
              color: (context) => {
                if (context.tick.value === 0) return '#0284c7';
                if (context.tick.value === 1) return '#ea580c';
                if (context.tick.value === 2) return '#dc2626';
                return 'rgba(148, 163, 184, 0.15)';
              },
              lineWidth: (context) => {
                return (context.tick.value === 0 || context.tick.value === 1 || context.tick.value === 2) ? 2 : 1;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Годы наблюдений (2010–2025 гг.)',
              font: { weight: 'bold' }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            }
          }
        }
      }
    });
  }

  // 2. Сравнение климатических норм (Таблица 1: Нормы темп. и осадков)
  renderNorms() {
    const ctx = document.getElementById('chart-norms');
    if (!ctx) return;

    if (this.chartNorms) {
      this.chartNorms.destroy();
    }

    const months = SCIENTIFIC_DATA.meta.months;
    const monthKeys = SCIENTIFIC_DATA.meta.monthKeys;

    // Сравнение средних температур по месяцам для всех 5 станций
    const datasets = Object.values(SCIENTIFIC_DATA.stations).map(st => {
      return {
        label: `${st.name} (T, °C)`,
        data: monthKeys.map(k => st.norms.T[k]),
        borderColor: st.color,
        backgroundColor: st.color,
        borderWidth: 2,
        tension: 0.2
      };
    });

    this.chartNorms = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: {
            title: { display: true, text: 'Норма температуры (°C)' },
            grid: { color: 'rgba(148, 163, 184, 0.15)' }
          },
          x: {
            title: { display: true, text: 'Месяцы теплого полугодия' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        }
      }
    });
  }

  // 3. Число случаев засух различной интенсивности (Таблица 5)
  renderCases() {
    const ctx = document.getElementById('chart-cases');
    if (!ctx) return;

    if (this.chartCases) {
      this.chartCases.destroy();
    }

    const stations = ['taldykorgan', 'zhalanashkol', 'matay', 'almaty', 'kegen'];
    const labels = stations.map(id => SCIENTIFIC_DATA.stations[id].name);

    this.chartCases = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Весенние слабые (Si 0-1)',
            data: stations.map(id => SCIENTIFIC_DATA.summaryCases[id].sp_weak),
            backgroundColor: '#22c55e',
            stack: 'spring'
          },
          {
            label: 'Весенние средние (Si 1-2)',
            data: stations.map(id => SCIENTIFIC_DATA.summaryCases[id].sp_med),
            backgroundColor: '#ea580c',
            stack: 'spring'
          },
          {
            label: 'Летние слабые (Si 0-1)',
            data: stations.map(id => SCIENTIFIC_DATA.summaryCases[id].su_weak),
            backgroundColor: '#10b981',
            stack: 'summer'
          },
          {
            label: 'Летние средние (Si 1-2)',
            data: stations.map(id => SCIENTIFIC_DATA.summaryCases[id].su_med),
            backgroundColor: '#ef4444',
            stack: 'summer'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: {
            title: { display: true, text: 'Количество зафиксированных случаев' },
            grid: { color: 'rgba(148, 163, 184, 0.15)' }
          },
          x: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        }
      }
    });
  }

  // 4. Экстремальные значения S_max при засухах (Таблица 4)
  renderRadar() {
    const ctx = document.getElementById('chart-radar');
    if (!ctx) return;

    if (this.chartRadar) {
      this.chartRadar.destroy();
    }

    const months = SCIENTIFIC_DATA.meta.months;
    const monthKeys = SCIENTIFIC_DATA.meta.monthKeys;

    const datasets = Object.values(SCIENTIFIC_DATA.stations).map(st => {
      return {
        label: st.name,
        data: monthKeys.map(k => st.sMax[k]),
        borderColor: st.color,
        backgroundColor: st.color + '22',
        borderWidth: 2,
        pointRadius: 4
      };
    });

    this.chartRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: months,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 2.5,
            ticks: {
              stepSize: 0.5
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.2)'
            },
            pointLabels: {
              font: { size: 12, weight: 'bold' }
            }
          }
        }
      }
    });
  }

  // 5. Тепловая матрица засух (Heatmap Grid)
  renderHeatmapMatrix(stationId) {
    const container = document.getElementById('heatmap-matrix-container');
    if (!container) return;

    const station = SCIENTIFIC_DATA.stations[stationId];
    if (!station) return;

    const years = SCIENTIFIC_DATA.meta.years;
    const months = SCIENTIFIC_DATA.meta.months;
    const monthKeys = SCIENTIFIC_DATA.meta.monthKeys;

    let html = `
      <div class="heatmap-table-wrapper">
        <table class="heatmap-table">
          <thead>
            <tr>
              <th>Год</th>
              ${months.map(m => `<th>${m}</th>`).join('')}
              <th>Среднее</th>
            </tr>
          </thead>
          <tbody>
    `;

    years.forEach(yr => {
      let rowSum = 0;
      let validCount = 0;

      const cells = monthKeys.map(k => {
        const val = station.drought[yr] ? station.drought[yr][k] : null;
        if (val !== null && val !== undefined) {
          rowSum += val;
          validCount++;
          const c = PedHelper.getClassification(val);
          const displayVal = val > 0 ? `+${val}` : `${val}`;
          return `<td style="background:${c.bg}; color:${c.color}; font-weight:bold" title="${yr} г., ${k}: ${displayVal} (${c.label})">${displayVal}</td>`;
        } else {
          return `<td style="color:#94a3b8; background:#f8fafc" title="Нет данных">—</td>`;
        }
      }).join('');

      const avg = validCount > 0 ? (rowSum / validCount).toFixed(2) : '—';
      const avgClassif = validCount > 0 ? PedHelper.getClassification(parseFloat(avg)) : { color: '#94a3b8', bg: '#fff' };
      const avgDisplay = avg !== '—' && parseFloat(avg) > 0 ? `+${avg}` : avg;

      html += `
        <tr>
          <td class="year-header"><strong>${yr}</strong></td>
          ${cells}
          <td style="background:${avgClassif.bg}; color:${avgClassif.color}; font-weight:bold">${avgDisplay}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  setStationFilter(stationId) {
    this.selectedStation = stationId;
    this.renderTimeseries();
    if (stationId !== 'all') {
      this.renderHeatmapMatrix(stationId);
    }
  }

  setMonthFilter(monthKey) {
    this.selectedMonthKey = monthKey;
    this.renderTimeseries();
  }
}
