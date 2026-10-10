/**
 * МОДУЛЬ ГЕНЕРАЦИИ ОФИЦИАЛЬНОГО НАУЧНОГО ОТЧЕТА (PDF / ПЕЧАТЬ)
 * Формирует строгий печатный документ (Научный паспорт исследования) для жюри конкурса «Дарын»
 * Включает: сводные KPI, таблицы метеостанций, графики динамики и диаграммы в высоком разрешении.
 */

class ScientificReport {
  constructor() {
    this.init();
  }

  init() {
    const printBtn = document.getElementById('btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.generateAndPrint());
    }
  }

  generateAndPrint() {
    const yr = (window.app && window.app.currentYear) ? window.app.currentYear : 2020;
    const mKey = (window.app && window.app.currentMonthKey) ? window.app.currentMonthKey : 'jul';
    const lang = (window.I18N && window.I18N.currentLang) ? window.I18N.currentLang : 'ru';
    const monthName = SCIENTIFIC_DATA.meta.months[SCIENTIFIC_DATA.meta.monthKeys.indexOf(mKey)];

    let reportModal = document.getElementById('scientific-report-modal');
    if (!reportModal) {
      reportModal = document.createElement('div');
      reportModal.id = 'scientific-report-modal';
      reportModal.className = 'report-modal-overlay';
      document.body.appendChild(reportModal);
    }

    // Собираем сводные данные станций
    let stationRows = '';
    let avgSi = 0, count = 0;

    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      const v = st.drought[yr] ? st.drought[yr][mKey] : null;
      if (v !== null && v !== undefined) {
        avgSi += v;
        count++;
      }
      const c = PedHelper.getClassification(v);
      const displayV = v !== null ? (v > 0 ? '+' + v : v) : '—';
      const sMax = st.sMax[mKey];

      stationRows += `
        <tr>
          <td><strong>${st.name}</strong> (${st.nameKz})</td>
          <td>${st.altitude} м</td>
          <td>${st.norms.T[mKey]} °C</td>
          <td>${st.norms.R[mKey]} мм</td>
          <td style="font-weight:bold; color:${c.color}">${displayV}</td>
          <td style="color:#ef4444">+${sMax}</td>
          <td>${c.label}</td>
        </tr>
      `;
    });

    avgSi = count > 0 ? (avgSi / count).toFixed(2) : '—';
    const regClassif = PedHelper.getClassification(parseFloat(avgSi));

    // Извлечение графиков из страницы в виде картинок Base64 для надежного экспорта в PDF
    let timeseriesImg = '';
    const tsCanvas = document.getElementById('chart-timeseries');
    if (tsCanvas) {
      try { timeseriesImg = tsCanvas.toDataURL('image/png'); } catch (e) {}
    }

    let transectImg = '';
    const transectCanvas = document.getElementById('chart-transect');
    if (transectCanvas) {
      try { transectImg = transectCanvas.toDataURL('image/png'); } catch (e) {}
    }

    let radarImg = '';
    const radarCanvas = document.getElementById('chart-radar');
    if (radarCanvas) {
      try { radarImg = radarCanvas.toDataURL('image/png'); } catch (e) {}
    }

    let casesImg = '';
    const casesCanvas = document.getElementById('chart-cases');
    if (casesCanvas) {
      try { casesImg = casesCanvas.toDataURL('image/png'); } catch (e) {}
    }

    const html = `
      <div class="report-paper">
        <div class="report-print-controls no-print">
          <button class="icon-btn highlight-btn" onclick="window.print()">
            Распечатать / Экспорт в PDF (Ctrl + P)
          </button>
          <button class="icon-btn" onclick="document.getElementById('scientific-report-modal').style.display='none'">
            Закрыть предпросмотр
          </button>
        </div>

        <div class="report-header-academic">
          <div class="report-org-title">РЕСПУБЛИКАНСКИЙ КОНКУРС НАУЧНЫХ ПРОЕКТОВ «ДАРЫН»</div>
          <div class="report-sub-title">НАУЧНЫЙ ПАСПОРТ МОНИТОРИНГА АТМОСФЕРНЫХ ЗАСУХ ЮГО-ВОСТОЧНОГО КАЗАХСТАНА</div>
          <div class="report-doc-id">РЕГИСТРАЦИОННЫЙ ЛИСТ ИССЛЕДОВАНИЯ • РЯД НАБЛЮДЕНИЙ 2010–2025 гг.</div>
        </div>

        <div class="report-meta-grid">
          <div><strong>Тема исследования:</strong> ${SCIENTIFIC_DATA.meta.title}</div>
          <div><strong>Автор:</strong> ${SCIENTIFIC_DATA.meta.author} (${SCIENTIFIC_DATA.meta.grade})</div>
          <div><strong>Период анализа:</strong> ${monthName} ${yr} года (Хронологический ряд 16 лет)</div>
          <div><strong>Математическая модель:</strong> Параметр засухи А.А. Педя (Si = ΔT/σT - ΔR/σR)</div>
        </div>

        <div class="report-section-title">1. РЕГИОНАЛЬНАЯ СИТУАЦИЯ И СВОДНЫЕ ПОКАЗАТЕЛИ</div>
        <div class="report-kpi-summary">
          <div class="rep-kpi-box">
            <span class="rep-lbl">Средний индекс региона Si:</span>
            <span class="rep-val" style="color:${regClassif.color}">${parseFloat(avgSi) > 0 ? '+' : ''}${avgSi}</span>
            <span class="rep-desc">${regClassif.label}</span>
          </div>
          <div class="rep-kpi-box">
            <span class="rep-lbl">Пиковая засуха периода (S_max):</span>
            <span class="rep-val" style="color:#ef4444">+2.3</span>
            <span class="rep-desc">ст. Матай, ст. Кеген</span>
          </div>
          <div class="rep-kpi-box">
            <span class="rep-lbl">Сбережение влаги агроприемами:</span>
            <span class="rep-val" style="color:#10b981">+85 мм</span>
            <span class="rep-desc">В метровом слое почвы (чистые пары)</span>
          </div>
        </div>

        <div class="report-section-title">2. ПОКАЗАТЕЛИ ОПОРНЫХ МЕТЕОРОЛОГИЧЕСКИХ СТАНЦИЙ (${monthName} ${yr} г.)</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Метеостанция</th>
              <th>Высота (м)</th>
              <th>Норма T (°C)</th>
              <th>Норма R (мм)</th>
              <th>Индекс Si</th>
              <th>S_max (15 лет)</th>
              <th>Категория засушливости</th>
            </tr>
          </thead>
          <tbody>
            ${stationRows}
          </tbody>
        </table>

        <div class="report-section-title">3. ГРАФИЧЕСКИЙ МАТЕМАТИЧЕСКИЙ АНАЛИЗ И ДИАГРАММЫ</div>
        <div class="report-charts-grid">
          ${timeseriesImg ? `
            <div class="rep-chart-card">
              <div class="rep-chart-title">Многолетняя динамика параметра атмосферной засухи Si (2010–2025 гг.)</div>
              <img src="${timeseriesImg}" class="rep-chart-img" alt="Динамика Si">
            </div>
          ` : ''}

          ${transectImg ? `
            <div class="rep-chart-card">
              <div class="rep-chart-title">Орографический трансект высотного профиля (Матай — Алматы — Кеген)</div>
              <img src="${transectImg}" class="rep-chart-img" alt="Высотный профиль">
            </div>
          ` : ''}

          ${radarImg ? `
            <div class="rep-chart-card">
              <div class="rep-chart-title">Радарная диаграмма экстремальных засух S_max (Таблица 4)</div>
              <img src="${radarImg}" class="rep-chart-img" alt="Радар S_max">
            </div>
          ` : ''}

          ${casesImg ? `
            <div class="rep-chart-card">
              <div class="rep-chart-title">Число случаев атмосферных засух различной интенсивности (Таблица 5)</div>
              <img src="${casesImg}" class="rep-chart-img" alt="Число случаев засух">
            </div>
          ` : ''}
        </div>

        <div class="report-section-title">4. НАУЧНО ОБОСНОВАННЫЙ КОМПЛЕКС ВЛАГОСБЕРЕЖЕНИЯ</div>
        <ul class="report-recommendations-list">
          <li><strong>Чистые пары:</strong> обеспечивают накопление влаги на 80–85 мм больше по сравнению с непаровыми предшественниками.</li>
          <li><strong>Раннее лущение стерни:</strong> сохраняет запасы продуктивной влаги на 20–25 мм сразу после уборочных работ.</li>
          <li><strong>Осеннее выравнивание зяби:</strong> сокращает физические потери на открытое испарение на 15–20 мм.</li>
          <li><strong>Своевременная весенняя обработка зяби:</strong> сохраняет 8–10 мм влаги по сравнению с запозданием на 3–4 дня.</li>
          <li><strong>Своевременное боронование озимых:</strong> снижает весеннее непродуктивное испарение на 10–14 мм.</li>
          <li><strong>Оптимизация минерального питания:</strong> снижает транспирационный расход влаги зерновыми на 15–20%.</li>
        </ul>

        <div class="report-signatures">
          <div class="rep-sign-box">
            <span>Автор исследования:</span>
            <span class="sign-line">Нұрғазы Ә.</span>
          </div>
          <div class="rep-sign-box">
            <span>Научный консультант / Руководитель:</span>
            <span class="sign-line">____________________</span>
          </div>
          <div class="rep-sign-box">
            <span>Дата формирования:</span>
            <span class="sign-line">${new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    `;

    reportModal.innerHTML = html;
    reportModal.style.display = 'block';
  }
}
