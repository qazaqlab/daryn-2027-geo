/**
 * МОДУЛЬ ЭКОНОМИКО-АГРОНОМИЧЕСКОГО КАЛЬКУЛЯТОРА УЩЕРБА И УРОЖАЙНОСТИ
 * Моделирует снижение урожайности в зависимости от индекса Педя Si и рассчитывает
 * экономический ущерб и выгоду от влагоресурсосбережения в тенге (₸).
 */

class EconomicCalculator {
  constructor() {
    this.crops = {
      wheat_spring: {
        id: 'wheat_spring',
        nameRu: 'Яровая пшеница',
        nameKz: 'Жаздық бидай',
        nameEn: 'Spring Wheat',
        baseYield: 18.0, // ц/га
        pricePerTon: 85000, // ₸/т
        sensitivity: 1.15
      },
      wheat_winter: {
        id: 'wheat_winter',
        nameRu: 'Озимая пшеница',
        nameKz: 'Күздік бидай',
        nameEn: 'Winter Wheat',
        baseYield: 24.0,
        pricePerTon: 90000,
        sensitivity: 0.95
      },
      barley: {
        id: 'barley',
        nameRu: 'Ячмень фуражный',
        nameKz: 'Жемдік арпа',
        nameEn: 'Barley',
        baseYield: 20.0,
        pricePerTon: 75000,
        sensitivity: 0.90
      },
      corn: {
        id: 'corn',
        nameRu: 'Кукуруза на зерно',
        nameKz: 'Дәнді жүгері',
        nameEn: 'Grain Corn',
        baseYield: 55.0,
        pricePerTon: 70000,
        sensitivity: 1.30
      },
      soybean: {
        id: 'soybean',
        nameRu: 'Соя масличная',
        nameKz: 'Майлы соя',
        nameEn: 'Soybean',
        baseYield: 22.0,
        pricePerTon: 180000,
        sensitivity: 1.25
      },
      alfalfa: {
        id: 'alfalfa',
        nameRu: 'Кормовые травы (Люцерна)',
        nameKz: 'Мал азықтық шөптер (Жоңышқа)',
        nameEn: 'Alfalfa / Forage',
        baseYield: 35.0,
        pricePerTon: 45000,
        sensitivity: 0.80
      }
    };

    this.init();
  }

  init() {
    this.cropSelect = document.getElementById('econ-crop-select');
    this.areaInput = document.getElementById('econ-area-input');
    this.yieldInput = document.getElementById('econ-yield-input');
    this.priceInput = document.getElementById('econ-price-input');
    this.stationSelect = document.getElementById('econ-station-select');
    this.monthSelect = document.getElementById('econ-month-select');

    if (!this.cropSelect) return;

    this.renderCropOptions();
    this.syncCropDefaults();

    // Слушатели
    this.cropSelect.addEventListener('change', () => this.syncCropDefaults());
    [this.areaInput, this.yieldInput, this.priceInput].forEach(inp => {
      if (inp) inp.addEventListener('input', () => this.calculate());
    });

    if (this.stationSelect) this.stationSelect.addEventListener('change', () => this.calculate());
    if (this.monthSelect) this.monthSelect.addEventListener('change', () => this.calculate());

    window.addEventListener('langChanged', () => {
      this.renderCropOptions();
      this.calculate();
    });

    this.calculate();
  }

  renderCropOptions() {
    if (!this.cropSelect) return;
    const currentVal = this.cropSelect.value || 'wheat_spring';
    const isKz = I18N.currentLang === 'kz';
    const isEn = I18N.currentLang === 'en';

    let html = '';
    Object.values(this.crops).forEach(crop => {
      const name = isKz ? crop.nameKz : (isEn ? crop.nameEn : crop.nameRu);
      html += `<option value="${crop.id}">${name}</option>`;
    });
    this.cropSelect.innerHTML = html;
    this.cropSelect.value = currentVal;
  }

  syncCropDefaults() {
    const cropId = this.cropSelect.value;
    const crop = this.crops[cropId];
    if (!crop) return;

    if (this.yieldInput) this.yieldInput.value = crop.baseYield;
    if (this.priceInput) this.priceInput.value = crop.pricePerTon;
    this.calculate();
  }

  calculate() {
    const cropId = this.cropSelect ? this.cropSelect.value : 'wheat_spring';
    const crop = this.crops[cropId] || this.crops.wheat_spring;

    const area = parseFloat(this.areaInput ? this.areaInput.value : 500) || 1; // га
    const baseYieldC = parseFloat(this.yieldInput ? this.yieldInput.value : crop.baseYield) || crop.baseYield; // ц/га
    const pricePerTon = parseFloat(this.priceInput ? this.priceInput.value : crop.pricePerTon) || crop.pricePerTon; // ₸/т

    // Определяем Si выбранной станции
    const stId = this.stationSelect ? this.stationSelect.value : 'taldykorgan';
    const mKey = this.monthSelect ? this.monthSelect.value : 'jul';
    const yr = (window.app && window.app.currentYear) ? window.app.currentYear : 2020;

    let Si = 1.2;
    if (SCIENTIFIC_DATA.stations[stId] && SCIENTIFIC_DATA.stations[stId].drought[yr]) {
      const v = SCIENTIFIC_DATA.stations[stId].drought[yr][mKey];
      if (v !== null && v !== undefined) Si = v;
    }

    // Модель потери урожайности (%)
    let lossPercent = 0;
    if (Si <= 0) {
      lossPercent = 0;
    } else if (Si < 1.0) {
      lossPercent = Si * 8.5 * crop.sensitivity;
    } else if (Si < 2.0) {
      lossPercent = (12.0 + (Si - 1.0) * 18.0) * crop.sensitivity;
    } else {
      lossPercent = Math.min(80.0, (30.0 + (Si - 2.0) * 25.0) * crop.sensitivity);
    }

    lossPercent = Number(lossPercent.toFixed(1));

    // Валовой плановый сбор (тонн)
    const plannedGrossTons = (area * baseYieldC) / 10.0;
    // Потеря в тоннах
    const lostTons = Number((plannedGrossTons * (lossPercent / 100.0)).toFixed(1));
    // Прямой убыток в тенге (₸)
    const directLossKzt = Math.round(lostTons * pricePerTon);

    // Эффект от внедрения комплекса влагосбережения (чистые пары, лущение стерни)
    // Сохраняет в среднем 60% от потенциальных потерь
    const savedTons = Number((lostTons * 0.62).toFixed(1));
    const savedProfitKzt = Math.round(savedTons * pricePerTon);

    // Вывод в DOM
    const outSiEl = document.getElementById('econ-current-si');
    const outLossPercentEl = document.getElementById('econ-loss-percent');
    const outLossTonsEl = document.getElementById('econ-loss-tons');
    const outDamageKztEl = document.getElementById('econ-damage-kzt');
    const outSavedKztEl = document.getElementById('econ-saved-kzt');
    const outAdviceEl = document.getElementById('econ-advice-box');

    if (outSiEl) {
      outSiEl.textContent = (Si > 0 ? '+' : '') + Si.toFixed(2);
      outSiEl.style.color = PedHelper.getClassification(Si).color;
    }

    if (outLossPercentEl) {
      outLossPercentEl.textContent = `${lossPercent}%`;
      outLossPercentEl.style.color = lossPercent > 20 ? '#ef4444' : (lossPercent > 5 ? '#ea580c' : '#10b981');
    }

    if (outLossTonsEl) outLossTonsEl.textContent = `${lostTons.toLocaleString('ru-RU')} тонн`;
    if (outDamageKztEl) outDamageKztEl.textContent = `${directLossKzt.toLocaleString('ru-RU')} ₸`;
    if (outSavedKztEl) outSavedKztEl.textContent = `+${savedProfitKzt.toLocaleString('ru-RU')} ₸`;

    if (outAdviceEl) {
      const isKz = I18N.currentLang === 'kz';
      const isEn = I18N.currentLang === 'en';

      let text = '';
      if (Si <= 0) {
        text = isKz 
          ? "Ылғалдану жағдайы қалыпты. Қуаңшылық қаупі жоқ. Шығымдылық жоспарлы деңгейде сақталады."
          : (isEn ? "Moisture levels are optimal. No drought risk. Crop yield meets planned targets."
          : "Условия увлажнения оптимальны. Риска засухи нет. Урожайность сохранится на плановом уровне.");
      } else if (Si < 1.0) {
        text = isKz
          ? "Әлсіз атмосфералық қуаңшылық. Топырақтың беткі қабатын тырмалау және ылғал жабу шаралары шығынды толық болдырмайды."
          : (isEn ? "Mild drought. Timely surface harrowing and stubble mulching will completely mitigate yield loss."
          : "Слабая засуха. Боронование верхнего слоя и закрытие влаги позволят полностью избежать недобора.");
      } else if (Si < 2.0) {
        text = isKz
          ? `ҚАУІПТІ ҚУАҢШЫЛЫҚ! Болжамды шығын шамамен ${lossPercent}%. Сүдігер пар мен фосфор-калий тыңайтқыштары ${savedProfitKzt.toLocaleString('ru-RU')} ₸ көлеміндегі қаражатты сақтап қалады.`
          : (isEn ? `DANGEROUS DROUGHT! Predicted yield loss ~${lossPercent}%. Fallow systems and optimized fertilization will prevent ${savedProfitKzt.toLocaleString('ru-RU')} KZT in losses.`
          : `ОПАСНАЯ ЗАСУХА! Прогнозируемый недобор около ${lossPercent}%. Паровые предшественники и оптимизация питания предотвратят потери на сумму ${savedProfitKzt.toLocaleString('ru-RU')} ₸.`);
      } else {
        text = isKz
          ? `ТӨТЕНШЕ ҚАТТЫ ҚУАҢШЫЛЫҚ! Астық көлемі ${lostTons} тоннаға азаю қаупі бар. Агротехникалық кешенді жедел қолдану міндетті.`
          : (isEn ? `CRITICAL DROUGHT! Threat of losing ${lostTons} tons of grain. Immediate deployment of water-saving agro-techniques is mandatory.`
          : `ЭКСТРЕМАЛЬНАЯ ЗАСУХА! Угроза недобора ${lostTons} тонн зерна. Экстренное применение влагосберегающего комплекса обязательно.`);
      }
      outAdviceEl.innerHTML = `<strong>${I18N.t('cropAdviceTitle')}</strong> ${text}`;
    }
  }
}
