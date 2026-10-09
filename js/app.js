/**
 * ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
 * Управление интерфейсом, анимация таймлайна, переключение 2D/3D режимов,
 * интерактивный агро-симулятор и экспорт научных данных.
 */

class ScienceApp {
  constructor() {
    this.map2d = null;
    this.map3d = null;
    this.charts = null;
    this.calculator = null;

    this.currentYear = 2020;
    this.currentMonthKey = 'jul';
    this.isPlaying = false;
    this.playInterval = null;
    this.playSpeed = 350; // мс на шаг (высокая скорость анимации)
    this.activeMapMode = '2d'; // '2d' или '3d'
    this.activeTheme = 'dark';

    this.init();
  }

  init() {
    // 1. Инициализация темы
    this.initTheme();

    // 2. Инициализация компонентов
    this.map2d = new DroughtMap2D('map2d-container');
    this.map3d = new DroughtMap3D('map3d-container');
    this.charts = new ScientificCharts();
    this.calculator = new PedCalculator();
    this.transect = new ElevationTransect('chart-transect');
    this.economic = new EconomicCalculator();
    this.report = new ScientificReport();

    // 3. Рендер компонентов страницы
    this.renderStationSelectorCards();
    this.renderAgroSimulator();
    this.renderDatabaseTables();
    this.renderScientificFormulas();

    // 4. Настройка слушателей событий
    this.setupEventListeners();
    this.setupLanguageSwitcher();

    // 5. Первоначальное обновление данных индикаторов
    this.updateGlobalTime(this.currentYear, this.currentMonthKey);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('drought_portal_theme') || 'dark';
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const newTheme = this.activeTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
      });
    }
  }

  setTheme(theme) {
    this.activeTheme = theme;
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('drought_portal_theme', theme);

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? 'Светлая тема' : 'Темная тема';
    }
  }

  setupEventListeners() {
    // Переключение вкладок навигации
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.switchSection(targetId);
      });
    });

    // Переключение режимов 2D / 3D карты
    const btn2D = document.getElementById('btn-mode-2d');
    const btn3D = document.getElementById('btn-mode-3d');
    if (btn2D && btn3D) {
      btn2D.addEventListener('click', () => this.switchMapMode('2d'));
      btn3D.addEventListener('click', () => this.switchMapMode('3d'));
    }

    // Слайдер года
    const yearSlider = document.getElementById('timeline-year-slider');
    const yearValueDisplay = document.getElementById('timeline-year-val');
    if (yearSlider) {
      yearSlider.addEventListener('input', (e) => {
        const yr = parseInt(e.target.value);
        if (yearValueDisplay) yearValueDisplay.textContent = yr;
        this.updateGlobalTime(yr, this.currentMonthKey);
      });
    }

    // Кнопки месяцев
    const monthButtons = document.querySelectorAll('.month-pill-btn');
    monthButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        monthButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mKey = btn.dataset.month;
        this.updateGlobalTime(this.currentYear, mKey);
      });
    });

    // Кнопка воспроизведения анимации
    const playBtn = document.getElementById('timeline-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlayTimeline());
    }

    // Переключение скорости воспроизведения (1x, 2x, 4x)
    const speedButtons = document.querySelectorAll('.timeline-speed-btn');
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseInt(btn.dataset.speed);
        this.setPlaySpeed(speed);
      });
    });

    // Пресеты видов карты
    const presetButtons = document.querySelectorAll('.map-preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.preset;
        if (this.activeMapMode === '2d') {
          this.map2d.flyToPreset(preset);
        } else {
          this.map3d.flyToPreset(preset);
        }
      });
    });

    // Фильтр графиков
    const chartStationSelect = document.getElementById('chart-station-filter');
    if (chartStationSelect) {
      chartStationSelect.addEventListener('change', (e) => {
        this.charts.setStationFilter(e.target.value);
      });
    }

    const chartMonthSelect = document.getElementById('chart-month-filter');
    if (chartMonthSelect) {
      chartMonthSelect.addEventListener('change', (e) => {
        this.charts.setMonthFilter(e.target.value);
      });
    }

    // Экспорт в CSV
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportDatabaseToCSV());
    }

    // Экспорт в JSON
    const exportJsonBtn = document.getElementById('export-json-btn');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this.exportDatabaseToJSON());
    }
  }

  switchSection(sectionId) {
    const sections = document.querySelectorAll('.portal-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const targetSec = document.getElementById(sectionId);
    if (targetSec) {
      targetSec.classList.add('active');
      targetSec.scrollIntoView({ behavior: 'smooth' });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${sectionId}`);
    });
  }

  switchMapMode(mode) {
    this.activeMapMode = mode;
    const view2d = document.getElementById('map2d-view');
    const view3d = document.getElementById('map3d-view');
    const btn2D = document.getElementById('btn-mode-2d');
    const btn3D = document.getElementById('btn-mode-3d');

    if (mode === '2d') {
      if (view2d) view2d.style.display = 'block';
      if (view3d) view3d.style.display = 'none';
      if (btn2D) btn2D.classList.add('active');
      if (btn3D) btn3D.classList.remove('active');
      if (this.map2d && this.map2d.map) {
        setTimeout(() => this.map2d.map.invalidateSize(), 150);
      }
    } else {
      if (view2d) view2d.style.display = 'none';
      if (view3d) view3d.style.display = 'block';
      if (btn2D) btn2D.classList.remove('active');
      if (btn3D) btn3D.classList.add('active');
      if (this.map3d && !this.map3d.isInitialized) {
        this.map3d.init();
      } else if (this.map3d) {
        this.map3d.onWindowResize();
      }
    }
  }

  updateGlobalTime(year, monthKey) {
    this.currentYear = year;
    this.currentMonthKey = monthKey;

    // Обновляем отображение на слайдере
    const yearSlider = document.getElementById('timeline-year-slider');
    const yearValueDisplay = document.getElementById('timeline-year-val');
    if (yearSlider) yearSlider.value = year;
    if (yearValueDisplay) yearValueDisplay.textContent = year;

    // Обновляем кнопку месяца
    const monthButtons = document.querySelectorAll('.month-pill-btn');
    monthButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.month === monthKey);
    });

    // 1. Обновляем 2D карту
    if (this.map2d) {
      this.map2d.updateTime(year, monthKey);
    }

    // 2. Обновляем 3D карту
    if (this.map3d && this.map3d.isInitialized) {
      this.map3d.updateData(year, monthKey);
    }

    // 3. Обновляем плашку текущего состояния региона
    this.updateRegionalStatusBanner();

    // 4. Обновляем карточки станций
    this.updateStationCardsValues();

    // 5. Обновляем высотный трансект
    if (this.transect) {
      this.transect.updateTime(year, monthKey);
    }

    // 6. Обновляем агро-экономический расчет
    if (this.economic) {
      this.economic.calculate();
    }
  }

  setupLanguageSwitcher() {
    const savedLang = localStorage.getItem('drought_portal_lang') || 'ru';
    if (window.I18N) {
      I18N.setLang(savedLang);
    }

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (window.I18N) {
          I18N.setLang(lang);
        }
      });
    });
  }

  togglePlayTimeline() {
    this.isPlaying = !this.isPlaying;
    const playBtn = document.getElementById('timeline-play-btn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? 'Пауза' : 'Воспроизведение';
      playBtn.classList.toggle('playing', this.isPlaying);
    }

    if (this.isPlaying) {
      const years = SCIENTIFIC_DATA.meta.years;
      this.playInterval = setInterval(() => {
        let nextYearIdx = years.indexOf(this.currentYear) + 1;
        if (nextYearIdx >= years.length) {
          nextYearIdx = 0; // Зацикливание
        }
        this.updateGlobalTime(years[nextYearIdx], this.currentMonthKey);
      }, this.playSpeed);
    } else {
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    }
  }

  setPlaySpeed(speedMs) {
    this.playSpeed = speedMs;
    if (this.isPlaying && this.playInterval) {
      clearInterval(this.playInterval);
      const years = SCIENTIFIC_DATA.meta.years;
      this.playInterval = setInterval(() => {
        let nextYearIdx = years.indexOf(this.currentYear) + 1;
        if (nextYearIdx >= years.length) {
          nextYearIdx = 0;
        }
        this.updateGlobalTime(years[nextYearIdx], this.currentMonthKey);
      }, this.playSpeed);
    }
  }

  updateRegionalStatusBanner() {
    const bannerValEl = document.getElementById('region-status-val');
    const bannerBadgeEl = document.getElementById('region-status-badge');
    const bannerDescEl = document.getElementById('region-status-desc');
    const bannerMonthEl = document.getElementById('region-status-month');

    if (!bannerValEl) return;

    const monthName = SCIENTIFIC_DATA.meta.months[SCIENTIFIC_DATA.meta.monthKeys.indexOf(this.currentMonthKey)];
    if (bannerMonthEl) {
      bannerMonthEl.textContent = `${monthName} ${this.currentYear} г.`;
    }

    let sum = 0, count = 0;
    let maxStation = null, maxVal = -999;

    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      const val = st.drought[this.currentYear] ? st.drought[this.currentYear][this.currentMonthKey] : null;
      if (val !== null && val !== undefined) {
        sum += val;
        count++;
        if (val > maxVal) {
          maxVal = val;
          maxStation = st;
        }
      }
    });

    if (count > 0) {
      const avg = sum / count;
      const classif = PedHelper.getClassification(avg);

      bannerValEl.textContent = (avg > 0 ? '+' : '') + avg.toFixed(2);
      bannerValEl.style.color = classif.color;

      if (bannerBadgeEl) {
        bannerBadgeEl.textContent = classif.label;
        bannerBadgeEl.style.backgroundColor = classif.bg;
        bannerBadgeEl.style.color = classif.color;
        bannerBadgeEl.style.borderColor = classif.color;
      }

      if (bannerDescEl) {
        if (maxVal >= 1.0 && maxStation) {
          bannerDescEl.innerHTML = `<strong>Очаг засухи:</strong> ст. ${maxStation.name} (${maxVal > 0 ? '+' + maxVal : maxVal}) • ${classif.risk}`;
        } else {
          bannerDescEl.textContent = `Среднее по 5 метеостанциям: ${classif.risk}`;
        }
      }
    } else {
      bannerValEl.textContent = 'Н/Д';
    }
  }

  renderStationSelectorCards() {
    const container = document.getElementById('station-cards-grid');
    if (!container) return;

    let html = '';
    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      html += `
        <div class="station-feature-card" id="st-card-${st.id}" onclick="window.app.selectStation('${st.id}')">
          <div class="st-card-header">
            <span class="st-card-badge" style="background:${st.color}22; color:${st.color}">${st.region}</span>
            <span class="st-card-alt">${st.altitude} м</span>
          </div>
          <h4 class="st-card-title">${st.name} <span class="st-kz">(${st.nameKz})</span></h4>
          <p class="st-card-landscape">${st.landscape}</p>
          <div class="st-card-metrics">
            <div class="st-m-item">
              <span class="st-m-lbl">Текущий Si:</span>
              <span class="st-m-val cur-si" style="color:${st.color}">—</span>
            </div>
            <div class="st-m-item">
              <span class="st-m-lbl">S_max за 15 лет:</span>
              <span class="st-m-val text-red">+${Math.max(...Object.values(st.sMax))}</span>
            </div>
            <div class="st-m-item">
              <span class="st-m-lbl">Число засух:</span>
              <span class="st-m-val">${st.cases.total}</span>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  updateStationCardsValues() {
    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      const card = document.getElementById(`st-card-${st.id}`);
      if (!card) return;
      const val = st.drought[this.currentYear] ? st.drought[this.currentYear][this.currentMonthKey] : null;
      const curEl = card.querySelector('.cur-si');
      if (curEl) {
        if (val !== null && val !== undefined) {
          const c = PedHelper.getClassification(val);
          curEl.textContent = (val > 0 ? '+' : '') + val;
          curEl.style.color = c.color;
        } else {
          curEl.textContent = '—';
          curEl.style.color = '#94a3b8';
        }
      }
    });
  }

  selectStation(stationId) {
    if (this.activeMapMode === '2d' && this.map2d) {
      this.map2d.selectStation(stationId);
    } else if (this.activeMapMode === '3d' && this.map3d) {
      this.map3d.flyToPreset(stationId);
    }

    if (this.charts) {
      this.charts.setStationFilter(stationId);
      const sel = document.getElementById('chart-station-filter');
      if (sel) sel.value = stationId;
    }

    // Подсветка карточки
    document.querySelectorAll('.station-feature-card').forEach(c => c.classList.remove('active'));
    const targetCard = document.getElementById(`st-card-${stationId}`);
    if (targetCard) targetCard.classList.add('active');
  }

  renderAgroSimulator() {
    const listContainer = document.getElementById('agro-measures-list');
    if (!listContainer) return;

    let html = '';
    SCIENTIFIC_DATA.agrotechnics.forEach(item => {
      html += `
        <label class="agro-measure-item">
          <input type="checkbox" class="agro-checkbox" data-id="${item.id}" data-benefit="${item.benefitValue}" checked onchange="window.app.updateAgroSimulation()">
          <div class="agro-item-content">
            <div class="agro-item-top">
              <span class="agro-code">${item.code}</span>
              <span class="agro-title">${item.title}</span>
              <span class="agro-badge">${item.benefit}</span>
            </div>
            <p class="agro-desc">${item.description}</p>
            <div class="agro-meta">
              <span><strong>Период:</strong> ${item.stage}</span>
              <span><strong>Эффективность:</strong> ${item.efficiency}</span>
            </div>
          </div>
        </label>
      `;
    });
    listContainer.innerHTML = html;
    this.updateAgroSimulation();
  }

  updateAgroSimulation() {
    const checkboxes = document.querySelectorAll('.agro-checkbox:checked');
    let totalMoisture = 0;
    let transpirationReduction = 0;

    checkboxes.forEach(cb => {
      const val = parseFloat(cb.dataset.benefit);
      const id = cb.dataset.id;
      if (id === 'fertilization') {
        transpirationReduction += val;
      } else {
        totalMoisture += val;
      }
    });

    const totalEl = document.getElementById('sim-total-moisture');
    const transpEl = document.getElementById('sim-transp-reduction');
    const mitigationEl = document.getElementById('sim-drought-mitigation');

    if (totalEl) totalEl.textContent = `+${totalMoisture.toFixed(1)} мм`;
    if (transpEl) transpEl.textContent = `-${transpirationReduction.toFixed(1)}%`;
    if (mitigationEl) {
      // Снижение эквивалентного Si
      const siReduction = (totalMoisture / 35.0).toFixed(2);
      mitigationEl.textContent = `Снижение риска Si на ~${siReduction} пункта`;
    }
  }

  renderDatabaseTables() {
    // Таблица 1: Климатические нормы
    const t1Body = document.getElementById('table1-body');
    if (t1Body) {
      let h = '';
      const mKeys = SCIENTIFIC_DATA.meta.monthKeys;
      const stations = Object.values(SCIENTIFIC_DATA.stations);

      // Сначала температуры
      stations.forEach(st => {
        h += `<tr>
          <td><strong>${st.name}</strong></td>
          <td>Температура T (°C)</td>
          ${mKeys.map(k => `<td>${st.norms.T[k]}</td>`).join('')}
        </tr>`;
      });
      // Затем осадки
      stations.forEach(st => {
        h += `<tr>
          <td><strong>${st.name}</strong></td>
          <td>Осадки R (мм)</td>
          ${mKeys.map(k => `<td>${st.norms.R[k]}</td>`).join('')}
        </tr>`;
      });
      t1Body.innerHTML = h;
    }

    // Таблица 4: Экстремумы S_max
    const t4Body = document.getElementById('table4-body');
    if (t4Body) {
      let h = '';
      const mKeys = SCIENTIFIC_DATA.meta.monthKeys;
      Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
        h += `<tr>
          <td><strong>${st.name}</strong></td>
          ${mKeys.map(k => {
            const v = st.sMax[k];
            const isHigh = v >= 2.0;
            return `<td style="${isHigh ? 'color:#ef4444; font-weight:bold' : ''}">+${v}</td>`;
          }).join('')}
        </tr>`;
      });
      t4Body.innerHTML = h;
    }

    // Таблица 5: Число случаев засух
    const t5Body = document.getElementById('table5-body');
    if (t5Body) {
      let h = '';
      const c = SCIENTIFIC_DATA.summaryCases;
      ['taldykorgan', 'zhalanashkol', 'matay', 'almaty', 'kegen', 'total', 'percent'].forEach(k => {
        const row = c[k];
        const isBold = k === 'total' || k === 'percent';
        h += `<tr style="${isBold ? 'font-weight:bold; background:rgba(59,130,246,0.1)' : ''}">
          <td>${row.name}</td>
          <td>${row.sp_weak}</td>
          <td>${row.sp_med}</td>
          <td>${row.sp_str}</td>
          <td>${row.su_weak}</td>
          <td>${row.su_med}</td>
          <td>${row.su_str}</td>
        </tr>`;
      });
      t5Body.innerHTML = h;
    }

    // Таблицы 6 и 7: Повторяемость засух по годам
    const t67Body = document.getElementById('table67-body');
    if (t67Body) {
      let h = '';
      const mKeys = SCIENTIFIC_DATA.meta.monthKeys;
      const months = SCIENTIFIC_DATA.meta.months;
      mKeys.forEach((k, idx) => {
        const yearsAll = SCIENTIFIC_DATA.recurrence.allDroughts[k].join(', ');
        const yearsDang = SCIENTIFIC_DATA.recurrence.dangerousDroughts[k].join(', ');
        h += `<tr>
          <td><strong>${months[idx]}</strong></td>
          <td>${yearsAll || '—'}</td>
          <td style="color:#ef4444; font-weight:bold">${yearsDang || '—'}</td>
        </tr>`;
      });
      t67Body.innerHTML = h;
    }
  }

  renderScientificFormulas() {
    if (!window.katex) return;
    const formulaDisplay = document.getElementById('ped-main-formula');
    if (formulaDisplay) {
      const latex = `S_i = \\frac{\\Delta T}{\\sigma_T} - \\frac{\\Delta R}{\\sigma_R} = \\frac{T_i - \\bar{T}}{\\sigma_T} - \\frac{R_i - \\bar{R}}{\\sigma_R}`;
      katex.render(latex, formulaDisplay, { displayMode: true });
    }
  }

  exportDatabaseToCSV() {
    let csv = "Станция,Год,Апрель,Май,Июнь,Июль,Август\n";
    const years = SCIENTIFIC_DATA.meta.years;
    const mKeys = SCIENTIFIC_DATA.meta.monthKeys;

    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      years.forEach(yr => {
        const row = [st.name, yr];
        mKeys.forEach(k => {
          const val = st.drought[yr] ? st.drought[yr][k] : '';
          row.push(val !== null && val !== undefined ? val : '');
        });
        csv += row.join(',') + "\n";
      });
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `атмосферные_засухи_казахстан_2010_2025.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportDatabaseToJSON() {
    const jsonStr = JSON.stringify(SCIENTIFIC_DATA, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `атмосферные_засухи_казахстан_dataset.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Запуск при загрузке документа
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ScienceApp();
});
