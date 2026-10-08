/**
 * НАУЧНЫЙ ГЕОПОРТАЛ: АТМОСФЕРНЫЕ ЗАСУХИ ЮГО-ВОСТОЧНОГО КАЗАХСТАНА
 * База данных научного исследования (2010–2025 гг.)
 * Автор исследования: ученик 11 «Г» класса Нұрғазы Әмір
 * Научный конкурс: «Дарын»
 */

const SCIENTIFIC_DATA = {
  meta: {
    title: "Особенности формирования атмосферных засух на территории юго-восточного Казахстана",
    author: "Нұрғазы Әмір",
    grade: "Ученик 11 «Г» класса",
    contest: "Республиканский конкурс научных проектов «Дарын»",
    period: "2010–2025 гг. (16 лет наблюдений)",
    months: ["Апрель", "Май", "Июнь", "Июль", "Август"],
    monthKeys: ["apr", "may", "jun", "jul", "aug"],
    stationsCount: 5,
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  },

  // Опорные метеорологические станции
  stations: {
    taldykorgan: {
      id: "taldykorgan",
      name: "Талдыкорган",
      nameKz: "Талдықорған",
      lat: 45.0156,
      lon: 78.3739,
      altitude: 602,
      region: "Область Жетісу",
      landscape: "Предгорная равнина у подножия Джунгарского Алатау, бассейн реки Каратал",
      description: "Опорная континентальная станция. Характеризуется выраженным весенне-летним прогревом воздуха и чередованием периодов засухи и ливневых осадков.",
      color: "#3b82f6",
      norms: {
        T: { apr: 10.1, may: 16.1, jun: 21.0, jul: 23.3, aug: 21.5 },
        R: { apr: 6.8, may: 9.2, jun: 11.7, jul: 12.6, aug: 10.6 }
      },
      sigma: {
        T: { apr: 2.3, may: 1.8, jun: 1.9, jul: 1.5, aug: 1.8 },
        R: { apr: 42.0, may: 42.4, jun: 30.6, jul: 40.0, aug: 21.7 }
      },
      sMax: { apr: 2.2, may: 2.0, jun: 1.7, jul: 1.7, aug: 1.3 },
      cases: {
        spring_weak: 3, spring_med: 2, spring_strong: 0,
        summer_weak: 9, summer_med: 0, summer_strong: 0,
        total_spring: 5, total_summer: 9, total: 14
      },
      drought: {
        2010: { apr: -0.9, may: 1.1, jun: 1.5, jul: -0.2, aug: 0.2 },
        2011: { apr: 0.5, may: 0.6, jun: -0.1, jul: 1.2, aug: 0.0 },
        2012: { apr: 0.1, may: -1.1, jun: -1.1, jul: 0.3, aug: -2.7 },
        2013: { apr: -0.7, may: -3.0, jun: -2.2, jul: -3.7, aug: -1.2 },
        2014: { apr: -2.7, may: 0.0, jun: -0.1, jul: 0.4, aug: 0.4 },
        2015: { apr: 0.5, may: -0.5, jun: 0.7, jul: 0.2, aug: 0.8 },
        2016: { apr: -1.8, may: 0.1, jun: 0.5, jul: 0.8, aug: 0.0 },
        2017: { apr: 2.2, may: 0.2, jun: 0.3, jul: 1.4, aug: 0.3 },
        2018: { apr: -0.6, may: -1.8, jun: 0.3, jul: 1.2, aug: 0.9 },
        2019: { apr: -0.7, may: 0.6, jun: -1.0, jul: -0.4, aug: 1.3 },
        2020: { apr: 1.5, may: 0.4, jun: 1.0, jul: 0.8, aug: -0.1 },
        2021: { apr: -0.9, may: 2.0, jun: 1.7, jul: 0.3, aug: 0.6 },
        2022: { apr: -1.2, may: -1.2, jun: -1.7, jul: -1.0, aug: 1.2 },
        2023: { apr: 1.1, may: -0.9, jun: -0.5, jul: -0.3, aug: 0.0 },
        2024: { apr: 0.5, may: 0.5, jun: 0.4, jul: -0.7, aug: -0.4 },
        2025: { apr: 0.1, may: -0.5, jun: 1.1, jul: 1.7, aug: -1.1 }
      }
    },

    zhalanashkol: {
      id: "zhalanashkol",
      name: "Жаланашколь",
      nameKz: "Жалаңашкөл",
      lat: 45.5422,
      lon: 82.1644,
      altitude: 372,
      region: "Область Жетісу (Джунгарские ворота)",
      landscape: "Межгорный коридор ветров между хребтами Джунгарский Алатау и Барлык, приозерная впадина",
      description: "Уникальный пункт наблюдений в узкой тектонической впадине Джунгарских ворот. Известна сильнейшими ураганными ветрами Сайкан и Эби, усиливающими испарение.",
      color: "#10b981",
      norms: {
        T: { apr: 10.8, may: 18.2, jun: 23.5, jul: 25.6, aug: 23.9 },
        R: { apr: 6.0, may: 8.2, jun: 11.7, jul: 12.6, aug: 11.7 }
      },
      sigma: {
        T: { apr: 2.1, may: 1.7, jun: 1.8, jul: 1.6, aug: 1.7 },
        R: { apr: 38.0, may: 35.0, jun: 28.0, jul: 32.0, aug: 25.0 }
      },
      sMax: { apr: 1.5, may: 1.0, jun: 1.8, jul: 0.8, aug: 1.1 },
      cases: {
        spring_weak: 2, spring_med: 0, spring_strong: 0,
        summer_weak: 3, summer_med: 0, summer_strong: 0,
        total_spring: 2, total_summer: 3, total: 5
      },
      drought: {
        2010: { apr: -0.8, may: 0.0, jun: 1.8, jul: -1.6, aug: -0.9 },
        2011: { apr: 0.4, may: 0.7, jun: 0.5, jul: 0.8, aug: 0.1 },
        2012: { apr: -0.3, may: -0.8, jun: -2.6, jul: -0.2, aug: -3.2 },
        2013: { apr: -0.6, may: -3.3, jun: -2.1, jul: -2.5, aug: -1.1 },
        2014: { apr: -1.7, may: -0.7, jun: -0.3, jul: -0.5, aug: -0.6 },
        2015: { apr: -0.5, may: null, jun: -0.7, jul: -1.3, aug: -0.7 },
        2016: { apr: -2.2, may: -1.3, jun: null, jul: null, aug: -1.1 },
        2017: { apr: 1.5, may: 0.5, jun: -0.3, jul: -0.8, aug: -0.9 },
        2018: { apr: -1.1, may: -0.5, jun: 1.1, jul: -0.3, aug: 1.1 },
        2019: { apr: -0.6, may: 0.7, jun: -1.5, jul: -0.6, aug: 0.3 },
        2020: { apr: 0.3, may: 1.0, jun: 0.4, jul: -0.8, aug: 0.1 },
        2021: { apr: -1.1, may: -1.0, jun: null, jul: -1.5, aug: -0.1 },
        2022: { apr: -1.2, may: -1.0, jun: -1.7, jul: -1.1, aug: 0.8 },
        2023: { apr: -2.0, may: -0.6, jun: -0.7, jul: -2.9, aug: -1.7 },
        2024: { apr: -0.1, may: -0.3, jun: -0.8, jul: -0.3, aug: -0.6 },
        2025: { apr: -0.2, may: -0.3, jun: 0.5, jul: 0.4, aug: -0.3 }
      }
    },

    matay: {
      id: "matay",
      name: "Матай",
      nameKz: "Матай",
      lat: 45.8953,
      lon: 78.7186,
      altitude: 391,
      region: "Область Жетісу (Аксуский район)",
      landscape: "Песчано-пустынная и полупустынная равнина южного Прибалхашья",
      description: "Семиаридная зона Прибалхашья с резким дефицитом увлажнения. Высокая повторяемость ранневесенних и летних суховеев, быстро иссушающих верхний почвенный горизонт.",
      color: "#f59e0b",
      norms: {
        T: { apr: 9.8, may: 17.0, jun: 22.5, jul: 24.9, aug: 22.5 },
        R: { apr: 6.0, may: 8.0, jun: 10.2, jul: 11.0, aug: 9.4 }
      },
      sigma: {
        T: { apr: 2.2, may: 1.9, jun: 2.0, jul: 1.7, aug: 1.9 },
        R: { apr: 35.0, may: 32.0, jun: 25.0, jul: 30.0, aug: 20.0 }
      },
      sMax: { apr: 2.3, may: 1.2, jun: 1.4, jul: 2.0, aug: 1.6 },
      cases: {
        spring_weak: 1, spring_med: 2, spring_strong: 0,
        summer_weak: 7, summer_med: 0, summer_strong: 0,
        total_spring: 3, total_summer: 7, total: 10
      },
      drought: {
        2010: { apr: -1.4, may: 0.9, jun: 1.4, jul: -1.0, aug: 0.2 },
        2011: { apr: 0.2, may: 0.4, jun: 0.3, jul: 0.6, aug: 0.1 },
        2012: { apr: 0.3, may: -0.7, jun: -1.1, jul: 0.4, aug: -3.9 },
        2013: { apr: -0.5, may: -0.4, jun: -1.9, jul: -3.1, aug: -0.9 },
        2014: { apr: -2.7, may: 0.4, jun: 0.4, jul: 0.3, aug: 0.4 },
        2015: { apr: 0.6, may: -1.5, jun: -0.1, jul: -0.4, aug: 0.1 },
        2016: { apr: -1.9, may: -0.2, jun: 0.8, jul: -1.1, aug: 0.1 },
        2017: { apr: 2.3, may: 0.3, jun: 0.6, jul: 0.8, aug: 0.5 },
        2018: { apr: -0.9, may: -1.3, jun: 0.8, jul: 1.2, aug: 1.6 },
        2019: { apr: null, may: null, jun: null, jul: null, aug: null },
        2020: { apr: 1.6, may: 0.8, jun: 0.5, jul: 0.1, aug: 1.1 },
        2021: { apr: -1.7, may: 1.7, jun: 1.3, jul: 0.2, aug: 0.8 },
        2022: { apr: -0.05, may: -2.2, jun: -2.2, jul: -0.3, aug: 1.5 },
        2023: { apr: 0.8, may: -0.1, jun: -0.6, jul: 0.4, aug: 0.3 },
        2024: { apr: -0.5, may: 0.4, jun: 0.4, jul: -0.6, aug: -0.1 },
        2025: { apr: 0.1, may: 0.2, jun: 1.0, jul: 2.0, aug: -1.1 }
      }
    },

    almaty: {
      id: "almaty",
      name: "Алматы (ОГМС)",
      nameKz: "Алматы (ОГМС)",
      lat: 43.2389,
      lon: 76.9455,
      altitude: 848,
      region: "г. Алматы / подножие Заилийского Алатау",
      landscape: "Высотная предгорная зона Северного Тянь-Шаня, полоса конусов выноса горных рек",
      description: "Опорная гидрометеорологическая обсерватория крупнейшего мегаполиса у подножия хребта Заилийский Алатау. Осадки выше за счет орографического подъема воздушных масс, но при антициклонах наблюдаются сильные засухи.",
      color: "#8b5cf6",
      norms: {
        T: { apr: 10.8, may: 16.2, jun: 20.7, jul: 23.4, aug: 22.3 },
        R: { apr: 7.6, may: 10.2, jun: 12.1, jul: 12.7, aug: 11.3 }
      },
      sigma: {
        T: { apr: 2.4, may: 1.9, jun: 1.8, jul: 1.6, aug: 1.7 },
        R: { apr: 45.0, may: 48.0, jun: 38.0, jul: 35.0, aug: 28.0 }
      },
      sMax: { apr: 1.6, may: 2.1, jun: 1.6, jul: 2.2, aug: 1.3 },
      cases: {
        spring_weak: 3, spring_med: 1, spring_strong: 0,
        summer_weak: 8, summer_med: 1, summer_strong: 0,
        total_spring: 4, total_summer: 9, total: 13
      },
      drought: {
        2010: { apr: -0.8, may: -0.3, jun: 1.3, jul: -1.0, aug: -0.1 },
        2011: { apr: 0.5, may: 0.1, jun: 0.2, jul: 0.8, aug: -0.4 },
        2012: { apr: 0.2, may: -2.4, jun: -1.5, jul: -0.3, aug: -3.0 },
        2013: { apr: -0.9, may: -2.0, jun: -0.9, jul: -1.7, aug: -1.9 },
        2014: { apr: -2.8, may: -0.1, jun: 0.8, jul: 0.3, aug: 0.4 },
        2015: { apr: 0.4, may: -0.6, jun: 1.0, jul: -0.9, aug: -0.7 },
        2016: { apr: -2.4, may: -1.0, jun: -0.3, jul: -0.3, aug: -0.3 },
        2017: { apr: 1.6, may: -1.2, jun: 0.4, jul: 1.4, aug: -0.5 },
        2018: { apr: -0.9, may: -2.2, jun: -1.1, jul: -0.1, aug: 1.1 },
        2019: { apr: -0.7, may: -0.2, jun: -1.2, jul: -2.5, aug: 1.3 },
        2020: { apr: 1.5, may: 1.1, jun: 0.0, jul: 0.5, aug: 0.6 },
        2021: { apr: -0.9, may: 2.1, jun: 1.6, jul: -0.3, aug: 0.3 },
        2022: { apr: -2.0, may: -1.3, jun: -1.3, jul: -1.1, aug: 1.1 },
        2023: { apr: -2.6, may: -1.3, jun: -2.2, jul: -3.9, aug: -1.7 },
        2024: { apr: 0.1, may: -0.3, jun: 0.1, jul: -0.7, aug: 0.7 },
        2025: { apr: 0.3, may: -0.6, jun: 1.5, jul: 2.2, aug: -2.2 }
      }
    },

    kegen: {
      id: "kegen",
      name: "Кеген",
      nameKz: "Кеген",
      lat: 43.0189,
      lon: 79.2208,
      altitude: 1802,
      region: "Алматинская область (Кегенский район)",
      landscape: "Высокогорное плато и межгорная котловина Центрального Тянь-Шаня",
      description: "Самая высокогорная станция выборки (1802 м). Характеризуется коротким безморозным периодом, низкими средними температурами и специфическим высотным ходом засух.",
      color: "#ef4444",
      norms: {
        T: { apr: 4.4, may: 9.2, jun: 12.9, jul: 15.0, aug: 14.1 },
        R: { apr: 5.5, may: 7.5, jun: 9.4, jul: 10.4, aug: 9.3 }
      },
      sigma: {
        T: { apr: 2.0, may: 1.6, jun: 1.7, jul: 1.4, aug: 1.5 },
        R: { apr: 30.0, may: 32.0, jun: 24.0, jul: 26.0, aug: 22.0 }
      },
      sMax: { apr: 2.3, may: 1.8, jun: 1.9, jul: 1.2, aug: 1.4 },
      cases: {
        spring_weak: 1, spring_med: 1, spring_strong: 0,
        summer_weak: 6, summer_med: 0, summer_strong: 0,
        total_spring: 2, total_summer: 6, total: 8
      },
      drought: {
        2010: { apr: -0.6, may: 0.5, jun: 1.9, jul: -0.8, aug: -0.5 },
        2011: { apr: 0.4, may: 0.2, jun: -0.8, jul: 1.2, aug: -1.2 },
        2012: { apr: -0.1, may: -1.3, jun: -1.1, jul: 0.0, aug: -0.5 },
        2013: { apr: -0.6, may: -2.4, jun: -1.5, jul: -1.9, aug: -1.8 },
        2014: { apr: -2.3, may: 0.6, jun: 0.0, jul: -0.8, aug: 0.8 },
        2015: { apr: -0.5, may: -0.5, jun: 0.7, jul: -0.5, aug: 0.2 },
        2016: { apr: -2.4, may: -1.1, jun: -0.6, jul: 0.4, aug: -0.6 },
        2017: { apr: 2.3, may: -0.7, jun: 0.0, jul: 1.2, aug: 0.1 },
        2018: { apr: -1.4, may: -2.7, jun: 0.1, jul: -0.3, aug: 0.1 },
        2019: { apr: -1.2, may: 0.0, jun: -1.6, jul: -0.8, aug: 0.8 },
        2020: { apr: 0.4, may: 0.0, jun: -0.3, jul: 0.3, aug: -0.6 },
        2021: { apr: -0.6, may: 1.8, jun: 1.2, jul: -0.2, aug: 0.0 },
        2022: { apr: -1.3, may: -1.5, jun: -0.2, jul: -0.6, aug: 1.4 },
        2023: { apr: -2.6, may: -0.9, jun: -0.4, jul: -2.8, aug: -0.5 },
        2024: { apr: 0.0, may: -0.5, jun: 0.1, jul: -0.2, aug: 0.2 },
        2025: { apr: 0.6, may: -0.8, jun: 0.4, jul: 1.2, aug: -1.8 }
      }
    }
  },

  // Сводные данные из Таблицы 5 (Число случаев с засухами различной интенсивности)
  summaryCases: {
    taldykorgan: { name: "Талдыкорган", sp_weak: 3, sp_med: 2, sp_str: 0, su_weak: 9, su_med: 0, su_str: 0 },
    zhalanashkol: { name: "Жаланашколь", sp_weak: 2, sp_med: 0, sp_str: 0, su_weak: 3, su_med: 0, su_str: 0 },
    matay: { name: "Матай", sp_weak: 1, sp_med: 2, sp_str: 0, su_weak: 7, su_med: 0, su_str: 0 },
    almaty: { name: "Алматы (ОГМС)", sp_weak: 3, sp_med: 1, sp_str: 0, su_weak: 8, su_med: 1, su_str: 0 },
    kegen: { name: "Кеген", sp_weak: 1, sp_med: 1, sp_str: 0, su_weak: 6, su_med: 0, su_str: 0 },
    total: { name: "Сумма", sp_weak: 10, sp_med: 6, sp_str: 0, su_weak: 33, su_med: 1, su_str: 0 },
    percent: { name: "% доли", sp_weak: "10%", sp_med: "0.6%", sp_str: "0%", su_weak: "33%", su_med: "1%", su_str: "0%" }
  },

  // Повторяемость засух по годам и месяцам (Таблицы 6 и 7)
  recurrence: {
    allDroughts: { // Si > 0
      apr: [2011, 2012, 2025],
      may: [2010, 2011, 2014, 2020],
      jun: [2015, 2020, 2024, 2025],
      jul: [2011, 2014, 2020],
      aug: [2014, 2015, 2019, 2021]
    },
    dangerousDroughts: { // Si > 1
      apr: [2017, 2020],
      may: [2021],
      jun: [2010, 2021],
      jul: [2017, 2025],
      aug: [2018, 2022]
    }
  },

  // Комплекс агротехнических и природоохранных мероприятий
  agrotechnics: [
    {
      id: "clean_fallow",
      code: "M-01",
      title: "Чистые пары",
      benefit: "+80 – 85 мм",
      benefitValue: 82.5,
      unit: "мм почвенной влаги",
      stage: "Допосевной период озимых",
      description: "По чистым парам к началу сева озимых в метровом слое почвы накапливается на 80–85 мм больше продуктивной влаги по сравнению с непаровыми предшественниками.",
      efficiency: "Максимальная"
    },
    {
      id: "early_stubble",
      code: "M-02",
      title: "Раннее лущение стерни",
      benefit: "+20 – 25 мм",
      benefitValue: 22.5,
      unit: "мм почвенной влаги",
      stage: "Послеуборочный период",
      description: "Своевременное лущение сразу после уборки разрушает капилляры, задерживает капиллярный ток воды и увеличивает запасы почвенной влаги на 20–25 мм.",
      efficiency: "Высокая"
    },
    {
      id: "autumn_leveling",
      code: "M-03",
      title: "Осеннее выравнивание зяби",
      benefit: "15 – 20 мм",
      benefitValue: 17.5,
      unit: "мм сбережения испарения",
      stage: "Осенняя подготовка",
      description: "Уменьшает микрорельефную площадь открытого испарения в предзимний период, сокращая непродуктивные потери влаги на 15–20 мм.",
      efficiency: "Высокая"
    },
    {
      id: "spring_tillage",
      code: "M-04",
      title: "Своевременная весенняя обработка зяби",
      benefit: "8 – 10 мм",
      benefitValue: 9.0,
      unit: "мм сбережения влаги",
      stage: "Ранняя весна",
      description: "Проведение закрытия влаги в оптимальные агротехнические сроки сберегает 8–10 мм влаги по сравнению с полями с опозданием на 3–4 дня.",
      efficiency: "Умеренная"
    },
    {
      id: "harrowing",
      code: "M-05",
      title: "Своевременное боронование озимых",
      benefit: "10 – 14 мм",
      benefitValue: 12.0,
      unit: "мм снижения испарения",
      stage: "Весенняя вегетация",
      description: "Разрушает почвенную корку после таяния снега, предотвращает растрескивание почвы и уменьшает прямое испарение на 10–14 мм.",
      efficiency: "Умеренная"
    },
    {
      id: "fertilization",
      code: "M-06",
      title: "Минеральное и органическое питание",
      benefit: "-15 – 20 %",
      benefitValue: 17.5,
      unit: "% снижения транспирации",
      stage: "Вегетационный период",
      description: "Оптимизация минерального питания повышает осмотический потенциал клеток растений и сокращает расход воды на единицу сухого вещества урожая на 15–20%.",
      efficiency: "Очень высокая"
    }
  ]
};

// Вспомогательные функции для классификации индекса Педя
const PedHelper = {
  getClassification(val) {
    if (val === null || val === undefined) return { label: "Нет данных", color: "#94a3b8", bg: "#f1f5f9", severity: 0 };
    if (val <= 0) {
      return {
        label: "Избыточное увлажнение / Норма",
        shortLabel: "Увлажнение",
        color: "#0284c7",
        bg: "rgba(2, 132, 199, 0.15)",
        border: "#0284c7",
        severity: 1,
        risk: "Низкий риск для с/х культур"
      };
    } else if (val < 1.0) {
      return {
        label: "Слабая атмосферная засуха",
        shortLabel: "Слабая",
        color: "#16a34a",
        bg: "rgba(22, 163, 74, 0.15)",
        border: "#16a34a",
        severity: 2,
        risk: "Умеренное влияние на вегетацию"
      };
    } else if (val < 2.0) {
      return {
        label: "Средняя (опасная) атмосферная засуха",
        shortLabel: "Опасная",
        color: "#ea580c",
        bg: "rgba(234, 88, 12, 0.15)",
        border: "#ea580c",
        severity: 3,
        risk: "Существенный ущерб урожаю сельхозкультур"
      };
    } else {
      return {
        label: "Сильная (экстремальная) атмосферная засуха",
        shortLabel: "Экстремальная",
        color: "#dc2626",
        bg: "rgba(220, 38, 38, 0.15)",
        border: "#dc2626",
        severity: 4,
        risk: "Критическая угроза гибели посевов и дефицита кормов"
      };
    }
  },

  calculatePed(T, T_norm, sigma_T, R, R_norm, sigma_R) {
    const deltaT = T - T_norm;
    const deltaR = R - R_norm;
    const termT = deltaT / sigma_T;
    const termR = deltaR / sigma_R;
    const Si = termT - termR;
    return {
      Si: Number(Si.toFixed(2)),
      deltaT: Number(deltaT.toFixed(2)),
      deltaR: Number(deltaR.toFixed(2)),
      termT: Number(termT.toFixed(2)),
      termR: Number(termR.toFixed(2))
    };
  }
};
