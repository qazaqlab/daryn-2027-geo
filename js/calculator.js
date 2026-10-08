/**
 * ИНТЕРАКТИВНЫЙ НАУЧНЫЙ КАЛЬКУЛЯТОР ИНДЕКСА АТМОСФЕРНОЙ ЗАСУХИ А.А. ПЕДЯ
 * Позволяет вычислять Si по фактическим данным или пресетам 5 метеостанций
 */

class PedCalculator {
  constructor() {
    this.stationSelect = document.getElementById('calc-station-select');
    this.monthSelect = document.getElementById('calc-month-select');
    this.inputT = document.getElementById('calc-temp');
    this.inputR = document.getElementById('calc-rain');
    this.inputTNorm = document.getElementById('calc-temp-norm');
    this.inputRNorm = document.getElementById('calc-rain-norm');
    this.inputSigmaT = document.getElementById('calc-sigma-t');
    this.inputSigmaR = document.getElementById('calc-sigma-r');
    this.customToggle = document.getElementById('calc-custom-toggle');

    this.init();
  }

  init() {
    if (!this.stationSelect) return;

    // Заполнение опций станций
    this.stationSelect.innerHTML = Object.values(SCIENTIFIC_DATA.stations)
      .map(st => `<option value="${st.id}">${st.name}</option>`)
      .join('');

    // Заполнение месяцев
    this.monthSelect.innerHTML = SCIENTIFIC_DATA.meta.months
      .map((m, idx) => `<option value="${SCIENTIFIC_DATA.meta.monthKeys[idx]}">${m}</option>`)
      .join('');

    // Слушатели событий
    this.stationSelect.addEventListener('change', () => this.syncStationNorms());
    this.monthSelect.addEventListener('change', () => this.syncStationNorms());

    [this.inputT, this.inputR, this.inputTNorm, this.inputRNorm, this.inputSigmaT, this.inputSigmaR].forEach(el => {
      if (el) el.addEventListener('input', () => this.calculate());
    });

    if (this.customToggle) {
      this.customToggle.addEventListener('change', (e) => {
        const isCustom = e.target.checked;
        this.inputTNorm.disabled = !isCustom;
        this.inputRNorm.disabled = !isCustom;
        this.inputSigmaT.disabled = !isCustom;
        this.inputSigmaR.disabled = !isCustom;
        if (!isCustom) this.syncStationNorms();
      });
    }

    // Начальная синхронизация
    this.syncStationNorms();
  }

  syncStationNorms() {
    const stId = this.stationSelect.value;
    const mKey = this.monthSelect.value;
    const station = SCIENTIFIC_DATA.stations[stId];
    if (!station) return;

    const normT = station.norms.T[mKey];
    const normR = station.norms.R[mKey];
    const sigT = station.sigma.T[mKey];
    const sigR = station.sigma.R[mKey];

    this.inputTNorm.value = normT;
    this.inputRNorm.value = normR;
    this.inputSigmaT.value = sigT;
    this.inputSigmaR.value = sigR;

    // Подставляем реалистичные тестовые значения T и R с небольшой аномалией для наглядности
    if (!this.inputT.value || this.inputT.dataset.auto) {
      this.inputT.value = (normT + 2.5).toFixed(1);
      this.inputT.dataset.auto = 'true';
    }
    if (!this.inputR.value || this.inputR.dataset.auto) {
      this.inputR.value = Math.max(0.5, (normR - 4.0)).toFixed(1);
      this.inputR.dataset.auto = 'true';
    }

    this.calculate();
  }

  calculate() {
    const T = parseFloat(this.inputT.value);
    const R = parseFloat(this.inputR.value);
    const TNorm = parseFloat(this.inputTNorm.value);
    const RNorm = parseFloat(this.inputRNorm.value);
    const sigT = parseFloat(this.inputSigmaT.value);
    const sigR = parseFloat(this.inputSigmaR.value);

    if (isNaN(T) || isNaN(R) || isNaN(TNorm) || isNaN(RNorm) || isNaN(sigT) || isNaN(sigR) || sigT <= 0 || sigR <= 0) {
      return;
    }

    const deltaT = T - TNorm;
    const deltaR = R - RNorm;
    const termT = deltaT / sigT;
    const termR = deltaR / sigR;
    const Si = termT - termR;

    // Классификация
    const classif = PedHelper.getClassification(Si);

    // Обновление интерфейса
    const resultValEl = document.getElementById('calc-result-val');
    const resultBadgeEl = document.getElementById('calc-result-badge');
    const resultVerdictEl = document.getElementById('calc-result-verdict');
    const resultDeltaTEl = document.getElementById('calc-delta-t');
    const resultDeltaREl = document.getElementById('calc-delta-r');
    const resultTermTEl = document.getElementById('calc-term-t');
    const resultTermREl = document.getElementById('calc-term-r');
    const gaugeFillEl = document.getElementById('calc-gauge-fill');
    const gaugeNeedleEl = document.getElementById('calc-gauge-needle');

    if (resultValEl) {
      resultValEl.textContent = (Si > 0 ? '+' : '') + Si.toFixed(2);
      resultValEl.style.color = classif.color;
    }

    if (resultBadgeEl) {
      resultBadgeEl.textContent = classif.label;
      resultBadgeEl.style.backgroundColor = classif.bg;
      resultBadgeEl.style.color = classif.color;
      resultBadgeEl.style.borderColor = classif.color;
    }

    if (resultVerdictEl) {
      let advice = "";
      if (Si <= 0) {
        advice = "Благоприятные условия увлажнения. Атмосферная засуха отсутствует. Риска дефицита почвенной влаги для сельскохозяйственных культур нет.";
      } else if (Si < 1.0) {
        advice = "Слабая атмосферная засуха. Наблюдается умеренное иссушение верхнего слоя почвы. Рекомендуется поверхностное боронование и сохранение стерни.";
      } else if (Si < 2.0) {
        advice = "ОПАСНАЯ АТМОСФЕРНАЯ ЗАСУХА! Прямая угроза урожайности зерновых и кормовых культур. Необходим комплекс мер: сохранение чистых паров (+80–85 мм влаги), своевременная обработка зяби.";
      } else {
        advice = "ЭКСТРЕМАЛЬНАЯ АТМОСФЕРНАЯ ЗАСУХА! Катастрофический дефицит осадков при высоких температурах воздуха. Критическая опасность гибели посевов и деградации пастбищных угодий.";
      }
      resultVerdictEl.innerHTML = `<strong>Научный вывод:</strong> ${advice}`;
    }

    if (resultDeltaTEl) resultDeltaTEl.textContent = (deltaT >= 0 ? '+' : '') + deltaT.toFixed(2) + ' °C';
    if (resultDeltaREl) resultDeltaREl.textContent = (deltaR >= 0 ? '+' : '') + deltaR.toFixed(2) + ' мм';
    if (resultTermTEl) resultTermTEl.textContent = (termT >= 0 ? '+' : '') + termT.toFixed(2);
    if (resultTermREl) resultTermREl.textContent = (termR >= 0 ? '+' : '') + termR.toFixed(2);

    // Шкала-спидометр от -3 до +3
    if (gaugeNeedleEl) {
      const clampedSi = Math.max(-3, Math.min(3, Si));
      const percent = ((clampedSi + 3) / 6) * 100;
      gaugeNeedleEl.style.left = `${percent}%`;
    }

    // Рендер формулы в KaTeX, если доступен
    const formulaEl = document.getElementById('calc-formula-step');
    if (formulaEl && window.katex) {
      const latex = `S_i = \\frac{${deltaT >= 0 ? '+' : ''}${deltaT.toFixed(1)}}{${sigT.toFixed(1)}} - \\left( \\frac{${deltaR >= 0 ? '+' : ''}${deltaR.toFixed(1)}}{${sigR.toFixed(1)}} \\right) = ${termT.toFixed(2)} - (${termR.toFixed(2)}) = \\mathbf{${Si.toFixed(2)}}`;
      try {
        katex.render(latex, formulaEl, { displayMode: true });
      } catch (e) {
        formulaEl.textContent = latex;
      }
    }
  }
}
