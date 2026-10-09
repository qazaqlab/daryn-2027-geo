/**
 * МОДУЛЬ ВЫСОТНОГО ГЕО-ПРОФИЛЯ И ОРОГРАФИЧЕСКОГО ТРАНСЕКТА
 * Демонстрирует высотную поясность, перепад температур, осадков и Si от Прибалхашья до Тянь-Шаня
 */

class ElevationTransect {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chart = null;
    this.currentYear = 2020;
    this.currentMonthKey = 'jul';

    // Опорный трансект: с северо-запада на юго-восток
    this.transectPoints = [
      { id: 'balkhash', name: 'Оз. Балхаш (Берег)', nameKz: 'Балқаш көлі', dist: 0, alt: 342, zone: 'Пустынно-песчаный пояс' },
      { id: 'matay', name: 'ст. Матай', nameKz: 'Матай ст.', dist: 85, alt: 391, zone: 'Полупустынное Прибалхашье', stationId: 'matay' },
      { id: 'karatal', name: 'р. Каратал (Пойма)', nameKz: 'Қаратал өзені', dist: 160, alt: 470, zone: 'Аллювиальная долина' },
      { id: 'taldykorgan', name: 'ст. Талдыкорган', nameKz: 'Талдықорған ст.', dist: 240, alt: 602, zone: 'Предгорья Джунгарского Алатау', stationId: 'taldykorgan' },
      { id: 'ili', name: 'р. Или (Капшагай)', nameKz: 'Іле өзені', dist: 330, alt: 480, zone: 'Илийская долина' },
      { id: 'almaty', name: 'ст. Алматы (ОГМС)', nameKz: 'Алматы ст.', dist: 410, alt: 848, zone: 'Предгорья Заилийского Алатау', stationId: 'almaty' },
      { id: 'medeu', name: 'Медеу / Чимбулак', nameKz: 'Медеу / Шымбұлақ', dist: 435, alt: 1750, zone: 'Горно-лесной пояс Тянь-Шаня' },
      { id: 'kegen', name: 'ст. Кеген', nameKz: 'Кеген ст.', dist: 530, alt: 1802, zone: 'Высокогорное плато Тянь-Шаня', stationId: 'kegen' }
    ];

    this.init();
  }

  init() {
    this.renderChart();

    window.addEventListener('langChanged', () => {
      this.renderChart();
    });
  }

  getStationData(point) {
    if (!point.stationId) {
      // Синтетическая интерполяция для промежуточных географических точек
      const altNorm = point.alt;
      const tJul = (26.0 - (altNorm / 1000) * 6.5).toFixed(1);
      const rJul = (8.0 + (altNorm / 1000) * 3.5).toFixed(1);
      return { T: parseFloat(tJul), R: parseFloat(rJul), Si: 0.1 };
    }

    const st = SCIENTIFIC_DATA.stations[point.stationId];
    const normT = st.norms.T[this.currentMonthKey];
    const normR = st.norms.R[this.currentMonthKey];
    const drought = st.drought[this.currentYear] ? st.drought[this.currentYear][this.currentMonthKey] : 0.0;
    return { T: normT, R: normR, Si: drought !== null ? drought : 0.0 };
  }

  renderChart() {
    const ctx = document.getElementById(this.canvasId);
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const isKz = I18N.currentLang === 'kz';
    const isEn = I18N.currentLang === 'en';

    const labels = this.transectPoints.map(p => {
      if (isKz) return p.nameKz;
      if (isEn) return p.id.toUpperCase();
      return p.name;
    });

    const altitudes = this.transectPoints.map(p => p.alt);
    const temps = this.transectPoints.map(p => this.getStationData(p).T);
    const rains = this.transectPoints.map(p => this.getStationData(p).R);
    const siValues = this.transectPoints.map(p => this.getStationData(p).Si);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: isKz ? 'Теңіз деңгейінен биіктік (м)' : (isEn ? 'Elevation a.s.l. (m)' : 'Высота рельефа (м)'),
            data: altitudes,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            yAxisID: 'yAlt',
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: isKz ? 'Температура нормасы (°C)' : (isEn ? 'Temp Norm (°C)' : 'Норма температуры (°C)'),
            data: temps,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.2,
            yAxisID: 'yMeteo',
            pointRadius: 4
          },
          {
            label: isKz ? 'Жауын-шашын нормасы (мм)' : (isEn ? 'Precipitation Norm (mm)' : 'Норма осадков (мм)'),
            data: rains,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            borderWidth: 2,
            tension: 0.2,
            yAxisID: 'yMeteo',
            pointRadius: 4
          },
          {
            label: isKz ? 'Қуаңшылық индексі (Si)' : (isEn ? 'Drought Index (Si)' : 'Индекс засухи (Si)'),
            data: siValues,
            borderColor: '#ef4444',
            backgroundColor: '#ef4444',
            borderWidth: 2.5,
            tension: 0.2,
            yAxisID: 'ySi',
            pointRadius: 5
          }
        ]
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
            labels: { boxWidth: 12, font: { size: 11, family: 'monospace' } }
          },
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                const idx = context[0].dataIndex;
                const pt = this.transectPoints[idx];
                return `Ландшафтная зона: ${pt.zone} (Дистанция: ~${pt.dist} км)`;
              }
            }
          }
        },
        scales: {
          yAlt: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Высота над у.м. (м)' },
            min: 200,
            max: 2200,
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          yMeteo: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Темп. (°C) / Осадки (мм)' },
            min: 0,
            max: 30,
            grid: { drawOnChartArea: false }
          },
          ySi: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Индекс Педя Si' },
            min: -3,
            max: 3,
            grid: { drawOnChartArea: false }
          },
          x: {
            title: { display: true, text: 'Орографический трансект (Прибалхашье -> Заилийский Алатау -> Тянь-Шань)' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }

  updateTime(year, monthKey) {
    this.currentYear = year;
    this.currentMonthKey = monthKey;
    this.renderChart();
  }
}
