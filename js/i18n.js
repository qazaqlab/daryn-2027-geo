/**
 * МОДУЛЬ МУЛЬТИЯЗЫЧНОСТИ (ҚАЗАҚША / РУССКИЙ / ENGLISH)
 * Обеспечивает мгновенный перевод терминологии, карточек, таблиц и аналитики
 */

const I18N = {
  currentLang: 'ru',

  dict: {
    ru: {
      siteTitle: "Мониторинг атмосферных засух Юго-Восточного Казахстана",
      siteSubtitle: "Геоинформационная аналитическая система",
      contestBadge: "Конкурс «Дарын»",
      periodBadge: "2010–2025 гг.",

      navMap: "Геокарта (2D / 3D)",
      navTransect: "Высотный профиль",
      navAnalytics: "Аналитика и ряды",
      navCalculator: "Модель Педя",
      navEconomic: "Агро-экономика",
      navAgro: "Влагосбережение",
      navDatabase: "Архив данных",
      navAbout: "Методология",

      btnExportCsv: "CSV",
      btnExportJson: "JSON",
      btnPrintReport: "Печать отчета (PDF)",
      btnLight: "Светлая тема",
      btnDark: "Темная тема",

      heroTitle: "Особенности формирования атмосферных засух на территории юго-восточного Казахстана",
      authorLabel: "Автор исследования:",
      authorVal: "ученик 11 «Г» класса Нұрғазы Әмір",
      programLabel: "Научная программа:",
      programVal: "Республиканский конкурс «Дарын»",
      networkLabel: "Наблюдательная сеть:",
      networkVal: "5 опорных метеостанций (Талдыкорган, Жаланашколь, Матай, Алматы, Кеген)",
      methodLabel: "Математический аппарат:",
      methodVal: "Параметр атмосферной засухи А.А. Педя (Si)",

      regSiLabel: "Региональный индекс Si:",
      regStatusDesc: "Средневзвешенное значение по опорным пунктам",

      kpiStations: "Опорная сеть",
      kpiStationsVal: "5 станций",
      kpiStationsSub: "Высотный градиент от 372 м до 1802 м над у.м.",
      kpiPeriod: "Временной охват",
      kpiPeriodVal: "16 лет",
      kpiPeriodSub: "2010–2025 гг. (теплое полугодие: апр – авг)",
      kpiPeak: "Пиковый экстремум (S_max)",
      kpiPeakSub: "Зафиксирован на станциях Матай и Кеген",
      kpiDangerous: "Опасные засухи (Si > 1)",
      kpiDangerousVal: "8 случаев",
      kpiDangerousSub: "Критический порог ущерба продуктивности посевов",
      kpiWater: "Резерв влагонакопления",
      kpiWaterVal: "+85 мм",
      kpiWaterSub: "Эффект сбережения влаги чистыми парами",

      mode2D: "2D ГИС-карта (Интерполяция / Спутник)",
      mode3D: "3D Цифровая модель рельефа (DEM)",
      focusLabel: "Фокус:",
      focusAll: "Все станции",
      focusAlmaty: "Алматы (Заилийский Алатау)",
      focusKegen: "Кеген (Плато 1802м)",
      focusZhalanashkol: "Жаланашколь (Джунгарские ворота)",
      focusMatay: "Матай (Прибалхашье)",
      focusTaldykorgan: "Талдыкорган (Каратал)",

      layersLabel: "ГИС-слои:",
      layerDistricts: "Сельхоз-районы",
      layerRivers: "Гидросеть и реки",

      hint3D: "Управление 3D камерой: ЛКМ — вращение, ПКМ — смещение, колесо мыши — масштаб",
      legendTitle: "Градация засух (индекс Si)",
      legendWet: "Si ≤ 0: Избыточное увлажнение / норма",
      legendWeak: "0 < Si < 1: Слабая засуха",
      legendDanger: "1 ≤ Si < 2: Опасная атмосферная засуха",
      legendExtreme: "Si ≥ 2: Сильная экстремальная засуха",

      playBtn: "Воспроизведение",
      pauseBtn: "Пауза",
      yearLabel: "Год наблюдений:",
      speedLabel: "Скорость:",

      months: ["Апрель", "Май", "Июнь", "Июль", "Август"],
      monthShort: ["Апр", "Май", "Июн", "Июл", "Авг"],

      stationsHeader: "Опорные пункты наблюдений метеорологической сети",
      detailAnalyticsBtn: "Детальная аналитика станции",

      // Высотный профиль
      transectTitle: "Высотный гео-профиль и орографический трансект региона",
      transectDesc: "Анализ влияния высотной поясности и рельефа на температуру, осадки и параметры засух по линии от пустынного Прибалхашья до высокогорий Центрального Тянь-Шаня.",
      transectAxisElev: "Высота над уровнем моря (м)",
      transectAxisTemp: "Норма температуры (°C)",
      transectAxisRain: "Норма осадков (мм)",

      // Экономический калькулятор
      econTitle: "Экономико-агрономический калькулятор ущерба и урожайности",
      econDesc: "Моделирование потерь урожая сельскохозяйственных культур при атмосферной засухе (Si) и расчет предотвращенного финансового ущерба (в тенге / ₸).",
      cropSelectLabel: "Сельскохозяйственная культура:",
      cropAreaLabel: "Площадь посева (гектар):",
      cropBaseYieldLabel: "Базовая урожайность (ц/га):",
      cropPriceLabel: "Рыночная цена (тенге / тонна):",
      cropRiskMonthLabel: "Критический месяц вегетации:",
      cropPotentialLossLabel: "Прогнозируемые потери урожая:",
      cropLossTonsLabel: "Физические потери зерна:",
      cropDirectDamageLabel: "Прямой финансовый ущерб:",
      cropSavedProfitLabel: "Предотвращенный ущерб от влагосбережения:",
      cropAdviceTitle: "Агрономическое заключение по рискам урожая:"
    },

    kz: {
      siteTitle: "Оңтүстік-Шығыс Қазақстандағы атмосфералық қуаңшылық мониторингі",
      siteSubtitle: "Геоақпараттық аналитикалық жүйе",
      contestBadge: "«Дарын» конкурсы",
      periodBadge: "2010–2025 жж.",

      navMap: "Геокарта (2D / 3D)",
      navTransect: "Биіктік профилі",
      navAnalytics: "Аналитика және қатарлар",
      navCalculator: "Педь моделі",
      navEconomic: "Агро-экономика",
      navAgro: "Ылғал сақтау",
      navDatabase: "Деректер мұрағаты",
      navAbout: "Әдістеме",

      btnExportCsv: "CSV",
      btnExportJson: "JSON",
      btnPrintReport: "Есепті басып шығару (PDF)",
      btnLight: "Ашық реңк",
      btnDark: "Күңгірт реңк",

      heroTitle: "Оңтүстік-Шығыс Қазақстан аумағындағы атмосфералық қуаңшылықтың қалыптасу ерекшеліктері",
      authorLabel: "Зерттеу авторы:",
      authorVal: "11 «Г» сынып оқушысы Нұрғазы Әмір",
      programLabel: "Ғылыми бағдарлама:",
      programVal: "Республикалық «Дарын» ғылыми жобалар конкурсы",
      networkLabel: "Бақылау желісі:",
      networkVal: "5 тіректік метеостанция (Талдықорған, Жалаңашкөл, Матай, Алматы, Кеген)",
      methodLabel: "Математикалық аппарат:",
      methodVal: "А.А. Педьтің атмосфералық қуаңшылық параметрі (Si)",

      regSiLabel: "Аймақтық Si индексі:",
      regStatusDesc: "Тіректік метеостанциялар бойынша орташаланған мән",

      kpiStations: "Тіректік желі",
      kpiStationsVal: "5 станция",
      kpiStationsSub: "Биіктік градиенті теңіз деңгейінен 372 м-ден 1802 м-ге дейін",
      kpiPeriod: "Уақыттық қамту",
      kpiPeriodVal: "16 жыл",
      kpiPeriodSub: "2010–2025 жж. (жылы жартыжылдық: сәуір – тамыз)",
      kpiPeak: "Ең жоғарғы экстремум (S_max)",
      kpiPeakSub: "Матай және Кеген метеостанцияларында тіркелген",
      kpiDangerous: "Қауіпті қуаңшылық (Si > 1)",
      kpiDangerousVal: "8 оқиға",
      kpiDangerousSub: "Ауыл шаруашылығы дақылдарына қауіпті сыни шек",
      kpiWater: "Ылғал жинақтау қоры",
      kpiWaterVal: "+85 мм",
      kpiWaterSub: "Таза сүдігер пар есебінен ылғал үнемдеу әсері",

      mode2D: "2D ГАЖ-картасы (Интерполяция / Жерсерік)",
      mode3D: "3D Жер бедерінің сандық моделі (DEM)",
      focusLabel: "Фокус:",
      focusAll: "Барлық станциялар",
      focusAlmaty: "Алматы (Іле Алатауы)",
      focusKegen: "Кеген (1802м Үстірті)",
      focusZhalanashkol: "Жалаңашкөл (Жоңғар қақпасы)",
      focusMatay: "Матай (Балқаш маңы)",
      focusTaldykorgan: "Талдықорған (Қаратал)",

      layersLabel: "ГАЖ-қабаттары:",
      layerDistricts: "Ауыл шаруашылығы аудандары",
      layerRivers: "Гидрологиялық желі мен өзендер",

      hint3D: "3D камераны басқару: Сол жақ батырма — айналдыру, Оң жақ — жылжыту, Дөңгелек — масштаб",
      legendTitle: "Қуаңшылық шкаласы (Si индексі)",
      legendWet: "Si ≤ 0: Артық ылғалдану / климаттық қалып",
      legendWeak: "0 < Si < 1: Әлсіз қуаңшылық",
      legendDanger: "1 ≤ Si < 2: Қауіпті атмосфералық қуаңшылық",
      legendExtreme: "Si ≥ 2: Қатты төтенше қуаңшылық",

      playBtn: "Ойнату",
      pauseBtn: "Кідірту",
      yearLabel: "Бақылау жылы:",
      speedLabel: "Жылдамдық:",

      months: ["Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз"],
      monthShort: ["Сәу", "Мам", "Маус", "Шіл", "Там"],

      stationsHeader: "Метеорологиялық желінің тіректік бақылау пункттері",
      detailAnalyticsBtn: "Станцияның толық аналитикасы",

      transectTitle: "Аймақтың биіктік гео-профилі мен орографиялық трансекті",
      transectDesc: "Балқаш маңы шөлді жазығынан Орталық Тянь-Шань биік тауларына дейінгі бағыттағы биіктік белдеуліліктің температураға, жауын-шашынға және қуаңшылыққа әсерін талдау.",
      transectAxisElev: "Теңіз деңгейінен биіктік (м)",
      transectAxisTemp: "Температура нормасы (°C)",
      transectAxisRain: "Жауын-шашын нормасы (мм)",

      econTitle: "Шығымдылық пен экономикалық шығынды бағалау калькуляторы",
      econDesc: "Атмосфералық қуаңшылық кезіндегі (Si) дақылдар шығынын модельдеу және ылғал сақтау технологиялары есебінен сақталған қаржыны (теңге / ₸) есептеу.",
      cropSelectLabel: "Ауыл шаруашылығы дақылы:",
      cropAreaLabel: "Егіс көлемі (гектар):",
      cropBaseYieldLabel: "Базалық өнімділік (ц/га):",
      cropPriceLabel: "Нарықтық бағасы (теңге / тонна):",
      cropRiskMonthLabel: "Вегетацияның сыни айы:",
      cropPotentialLossLabel: "Болжамды өнім шығыны:",
      cropLossTonsLabel: "Жоғалған астық көлемі:",
      cropDirectDamageLabel: "Тікелей қаржылық шығын:",
      cropSavedProfitLabel: "Ылғал сақтау арқылы сақталған қаражат:",
      cropAdviceTitle: "Өнімділік тәуекелдері бойынша агрономиялық қорытынды:"
    },

    en: {
      siteTitle: "Atmospheric Drought Monitoring in South-Eastern Kazakhstan",
      siteSubtitle: "Geoinformation Analytical System",
      contestBadge: "Daryn Competition",
      periodBadge: "2010–2025",

      navMap: "Geo-Map (2D / 3D)",
      navTransect: "Elevation Profile",
      navAnalytics: "Analytics & Series",
      navCalculator: "Ped Model",
      navEconomic: "Agro-Economics",
      navAgro: "Water Conservation",
      navDatabase: "Data Archive",
      navAbout: "Methodology",

      btnExportCsv: "CSV",
      btnExportJson: "JSON",
      btnPrintReport: "Print Report (PDF)",
      btnLight: "Light Theme",
      btnDark: "Dark Theme",

      heroTitle: "Features of Atmospheric Drought Formation in South-Eastern Kazakhstan",
      authorLabel: "Research Author:",
      authorVal: "11th Grade Student Amir Nurghazy",
      programLabel: "Scientific Program:",
      programVal: "Republican Research Competition «Daryn»",
      networkLabel: "Observation Network:",
      networkVal: "5 Meteorological Stations (Taldykorgan, Zhalanashkol, Matay, Almaty, Kegen)",
      methodLabel: "Mathematical Method:",
      methodVal: "Ped Atmospheric Drought Index (Si)",

      regSiLabel: "Regional Si Index:",
      regStatusDesc: "Weighted average value across reference stations",

      kpiStations: "Reference Network",
      kpiStationsVal: "5 stations",
      kpiStationsSub: "Elevation gradient from 372 m to 1802 m a.s.l.",
      kpiPeriod: "Temporal Span",
      kpiPeriodVal: "16 years",
      kpiPeriodSub: "2010–2025 (warm half-year: Apr – Aug)",
      kpiPeak: "Peak Extremum (S_max)",
      kpiPeakSub: "Recorded at Matay and Kegen stations",
      kpiDangerous: "Severe Droughts (Si > 1)",
      kpiDangerousVal: "8 cases",
      kpiDangerousSub: "Critical threshold for crop yield reduction",
      kpiWater: "Water Reserve",
      kpiWaterVal: "+85 mm",
      kpiWaterSub: "Soil moisture preservation via clean fallow",

      mode2D: "2D GIS Map (Interpolation / Satellite)",
      mode3D: "3D Digital Elevation Model (DEM)",
      focusLabel: "Focus:",
      focusAll: "All Stations",
      focusAlmaty: "Almaty (Trans-Ili Alatau)",
      focusKegen: "Kegen (1802m Plateau)",
      focusZhalanashkol: "Zhalanashkol (Dzungarian Gate)",
      focusMatay: "Matay (Balkhash Basin)",
      focusTaldykorgan: "Taldykorgan (Karatal)",

      layersLabel: "GIS Layers:",
      layerDistricts: "Agro Districts",
      layerRivers: "Hydrography & Rivers",

      hint3D: "3D Camera controls: LMB — rotate, RMB — pan, scroll wheel — zoom",
      legendTitle: "Ped Drought Scale (Si Index)",
      legendWet: "Si ≤ 0: Excessive moisture / climatic norm",
      legendWeak: "0 < Si < 1: Mild drought",
      legendDanger: "1 ≤ Si < 2: Dangerous atmospheric drought",
      legendExtreme: "Si ≥ 2: Severe extreme drought",

      playBtn: "Play",
      pauseBtn: "Pause",
      yearLabel: "Observation Year:",
      speedLabel: "Speed:",

      months: ["April", "May", "June", "July", "August"],
      monthShort: ["Apr", "May", "Jun", "Jul", "Aug"],

      stationsHeader: "Reference Observation Network Stations",
      detailAnalyticsBtn: "Detailed Station Analytics",

      transectTitle: "Regional Elevation Profile & Orographic Transect",
      transectDesc: "Analysis of elevation zonation and relief effects on temperature, rainfall, and drought indices from desert Lake Balkhash lowlands to the Central Tien Shan alpine plateau.",
      transectAxisElev: "Elevation a.s.l. (m)",
      transectAxisTemp: "Temperature Norm (°C)",
      transectAxisRain: "Precipitation Norm (mm)",

      econTitle: "Crop Yield Loss & Economic Damage Calculator",
      econDesc: "Simulation of crop yield loss under atmospheric drought (Si) and calculation of prevented financial losses (in Kazakhstani Tenge / ₸).",
      cropSelectLabel: "Agricultural Crop:",
      cropAreaLabel: "Cultivated Area (hectares):",
      cropBaseYieldLabel: "Baseline Yield (c/ha):",
      cropPriceLabel: "Market Price (KZT / metric ton):",
      cropRiskMonthLabel: "Critical Growth Month:",
      cropPotentialLossLabel: "Predicted Yield Loss:",
      cropLossTonsLabel: "Physical Grain Loss:",
      cropDirectDamageLabel: "Direct Financial Loss:",
      cropSavedProfitLabel: "Prevented Loss via Water Conservation:",
      cropAdviceTitle: "Agronomic Conclusion on Yield Risk:"
    }
  },

  t(key) {
    const langDict = this.dict[this.currentLang] || this.dict.ru;
    return langDict[key] !== undefined ? langDict[key] : (this.dict.ru[key] || key);
  },

  setLang(lang) {
    if (!this.dict[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('drought_portal_lang', lang);
    this.applyTranslations();

    // Оповещаем другие компоненты
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' && el.type === 'button') {
          el.value = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Обновляем активный класс на кнопках языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
  }
};
