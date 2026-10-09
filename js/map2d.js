/**
 * 2D ГИС КАРТА ЮГО-ВОСТОЧНОГО КАЗАХСТАНА (LEAFLET.JS)
 * Отображение метеостанций, изолиний засушливости и пространственной интерполяции
 */

class DroughtMap2D {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.currentYear = 2020;
    this.currentMonthKey = 'jul';
    this.stationMarkers = {};
    this.canvasLayer = null;
    this.selectedStationId = null;
    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Центр Юго-Восточного Казахстана (Семиречье / Жетісу)
    const center = [44.45, 79.35];
    const initialZoom = 7;

    // Базовые картографические слои
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    });

    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
      maxZoom: 17
    });

    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    });

    // Инициализация карты
    this.map = L.map(this.containerId, {
      center: center,
      zoom: initialZoom,
      layers: [satelliteLayer],
      zoomControl: true
    });

    // Векторные ГИС-слои (районы и реки)
    this.districtsLayer = L.layerGroup();
    this.riversLayer = L.layerGroup();
    this.buildVectorLayers();

    // Контрол базовых и оверлейных слоев
    const baseMaps = {
      "Спутник (Esri World Imagery)": satelliteLayer,
      "Топография и Рельеф (OpenTopoMap)": topoLayer,
      "Темная научная карта (CartoDB Dark)": darkLayer,
      "Схема (OpenStreetMap)": osmLayer
    };

    const overlayMaps = {
      "Сельскохозяйственные районы": this.districtsLayer,
      "Гидросеть и реки региона": this.riversLayer
    };

    this.districtsLayer.addTo(this.map);
    this.riversLayer.addTo(this.map);

    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(this.map);
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(this.map);

    // Добавляем IDW холст для интерполяции поля засухи
    this.initInterpolationCanvas();

    // Создаем маркеры станций
    this.renderStations();

    // Слушатель изменения размера
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  buildVectorLayers() {
    // 1. Сельскохозяйственные районы Семиречья (полигоны)
    const districts = [
      {
        name: 'Аксуский район',
        nameKz: 'Ақсу ауданы',
        spec: 'Богарное и орошаемое зерноводство, сахарная свекла, пастбища (ст. Матай)',
        coords: [[45.4, 78.0], [46.3, 78.3], [46.1, 79.8], [45.2, 79.4], [45.4, 78.0]]
      },
      {
        name: 'Каратальский / Талдыкорганский район',
        nameKz: 'Қаратал / Талдықорған өңірі',
        spec: 'Орошаемое земледелие (соя, пшеница, рис, овощеводство)',
        coords: [[44.7, 77.8], [45.3, 77.9], [45.2, 79.1], [44.6, 78.9], [44.7, 77.8]]
      },
      {
        name: 'Алакольский район',
        nameKz: 'Алакөл ауданы',
        spec: 'Зерновые культуры, кормопроизводство, озёрный бассейн (ст. Жаланашколь)',
        coords: [[45.2, 80.8], [46.2, 81.2], [45.8, 82.6], [45.1, 82.2], [45.2, 80.8]]
      },
      {
        name: 'Илийский / Талгарский / Карасайский районы',
        nameKz: 'Іле / Талғар / Қарасай аудандары',
        spec: 'Интенсивное земледелие, плодоводство, кукуруза, соя (ст. Алматы)',
        coords: [[43.0, 76.4], [43.8, 76.5], [43.7, 77.6], [43.0, 77.5], [43.0, 76.4]]
      },
      {
        name: 'Кегенский район',
        nameKz: 'Кеген ауданы',
        spec: 'Высокогорное богарное земледелие, ячмень, кормовые травы, отгонное овцеводство (ст. Кеген)',
        coords: [[42.7, 78.6], [43.4, 78.8], [43.3, 79.9], [42.6, 79.7], [42.7, 78.6]]
      }
    ];

    districts.forEach(d => {
      const poly = L.polygon(d.coords, {
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#38bdf8',
        fillOpacity: 0.08
      });
      poly.bindTooltip(`<strong>${d.name} (${d.nameKz})</strong><br><span style="font-size:11px;">Специализация: ${d.spec}</span>`, { sticky: true });
      this.districtsLayer.addLayer(poly);
    });

    // 2. Гидросеть: главные реки региона
    const rivers = [
      {
        name: 'река Или (Іле өзені)',
        coords: [[43.7, 80.2], [43.9, 79.1], [43.8, 77.5], [44.3, 76.8], [44.9, 75.8], [45.3, 74.5]]
      },
      {
        name: 'река Каратал (Қаратал өзені)',
        coords: [[44.8, 78.9], [45.0, 78.4], [45.3, 78.0], [45.7, 77.6], [46.3, 77.0]]
      },
      {
        name: 'река Аксу (Ақсу өзені)',
        coords: [[45.0, 79.5], [45.4, 79.0], [45.9, 78.5], [46.3, 78.0]]
      },
      {
        name: 'река Лепсы (Лепсі өзені)',
        coords: [[45.2, 80.3], [45.6, 79.8], [46.1, 79.3], [46.5, 78.7]]
      },
      {
        name: 'река Чарын (Шарын өзені)',
        coords: [[42.9, 79.3], [43.2, 79.1], [43.6, 79.3], [43.9, 79.4]]
      }
    ];

    rivers.forEach(r => {
      const line = L.polyline(r.coords, {
        color: '#06b6d4',
        weight: 2.5,
        opacity: 0.85
      });
      line.bindTooltip(`<strong>${r.name}</strong>`, { sticky: true });
      this.riversLayer.addLayer(line);
    });
  }

  // Создание canvas-слоя для пространственной интерполяции поля засухи (IDW)
  initInterpolationCanvas() {
    const CanvasOverlay = L.Layer.extend({
      onAdd: (map) => {
        this.canvas = L.DomUtil.create('canvas', 'leaflet-drought-canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.45';
        this.canvas.style.zIndex = '200';
        map.getPanes().overlayPane.appendChild(this.canvas);
        map.on('moveend resize', this.drawInterpolation, this);
        this.drawInterpolation();
      },
      onRemove: (map) => {
        map.getPanes().overlayPane.removeChild(this.canvas);
        map.off('moveend resize', this.drawInterpolation, this);
      }
    });

    this.canvasLayer = new CanvasOverlay();
    this.map.addLayer(this.canvasLayer);
  }

  // Расчет и отрисовка интерполированного поля засухи методом IDW
  drawInterpolation() {
    if (!this.canvas || !this.map) return;
    const size = this.map.getSize();
    const bounds = this.map.getBounds();
    const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());

    if (this.canvas.width !== size.x || this.canvas.height !== size.y) {
      this.canvas.width = size.x;
      this.canvas.height = size.y;
    }
    L.DomUtil.setPosition(this.canvas, topLeft);

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, size.x, size.y);

    // Сбор точек со значениями
    const points = [];
    Object.values(SCIENTIFIC_DATA.stations).forEach(st => {
      const val = st.drought[this.currentYear] ? st.drought[this.currentYear][this.currentMonthKey] : null;
      if (val !== null && val !== undefined) {
        const pt = this.map.latLngToContainerPoint([st.lat, st.lon]);
        points.push({ x: pt.x, y: pt.y, val: val });
      }
    });

    if (points.length < 2) return;

    // Сетка для быстрой интерполяции
    const step = 20;
    const cols = Math.ceil(size.x / step);
    const rows = Math.ceil(size.y / step);

    // Ограничивающий полигон вокруг станций
    const minX = Math.min(...points.map(p => p.x)) - 100;
    const maxX = Math.max(...points.map(p => p.x)) + 100;
    const minY = Math.min(...points.map(p => p.y)) - 80;
    const maxY = Math.max(...points.map(p => p.y)) + 80;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * step + step / 2;
        const py = r * step + step / 2;

        if (px < minX || px > maxX || py < minY || py > maxY) continue;

        // IDW (Inverse Distance Weighting)
        let num = 0;
        let den = 0;
        let minDist = 9999;
        let closestVal = 0;

        for (let i = 0; i < points.length; i++) {
          const dx = px - points[i].x;
          const dy = py - points[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            closestVal = points[i].val;
          }
          if (dist < 1) {
            num = points[i].val;
            den = 1;
            break;
          }
          const w = 1 / Math.pow(dist, 2);
          num += points[i].val * w;
          den += w;
        }

        // Затухание за пределами выпуклой зоны
        if (minDist > 260) continue;

        const val = den > 0 ? num / den : closestVal;
        const alpha = Math.max(0, 0.45 * (1 - minDist / 260));

        ctx.fillStyle = this.getColorForSi(val, alpha);
        ctx.fillRect(c * step, r * step, step, step);
      }
    }
  }

  getColorForSi(val, alpha = 0.5) {
    if (val <= 0) {
      // Влажно: синий -> бирюзовый
      return `rgba(14, 165, 233, ${alpha})`;
    } else if (val < 1.0) {
      // Слабая засуха: салатово-зеленый -> желтый
      return `rgba(34, 197, 94, ${alpha})`;
    } else if (val < 2.0) {
      // Опасная засуха: оранжевый
      return `rgba(249, 115, 22, ${alpha * 1.1})`;
    } else {
      // Экстремальная: красный / багровый
      return `rgba(220, 38, 38, ${alpha * 1.2})`;
    }
  }

  renderStations() {
    Object.values(SCIENTIFIC_DATA.stations).forEach(station => {
      const val = station.drought[this.currentYear] ? station.drought[this.currentYear][this.currentMonthKey] : null;
      const classif = PedHelper.getClassification(val);

      const customIcon = L.divIcon({
        className: 'custom-station-marker-wrapper',
        html: `
          <div class="station-pulse-beacon" id="marker-${station.id}" style="--marker-color: ${classif.color}">
            <div class="pulse-ring"></div>
            <div class="marker-core">
              <span class="marker-val">${val !== null ? (val > 0 ? '+' + val : val) : '—'}</span>
            </div>
            <div class="marker-pin-label">${station.name}</div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([station.lat, station.lon], { icon: customIcon });

      marker.on('click', () => {
        this.selectStation(station.id);
      });

      marker.bindPopup(() => this.createPopupContent(station), {
        maxWidth: 340,
        className: 'scientific-station-popup'
      });

      marker.addTo(this.map);
      this.stationMarkers[station.id] = marker;
    });
  }

  createPopupContent(station) {
    const val = station.drought[this.currentYear] ? station.drought[this.currentYear][this.currentMonthKey] : null;
    const classif = PedHelper.getClassification(val);
    const monthName = SCIENTIFIC_DATA.meta.months[SCIENTIFIC_DATA.meta.monthKeys.indexOf(this.currentMonthKey)];
    const normT = station.norms.T[this.currentMonthKey];
    const normR = station.norms.R[this.currentMonthKey];
    const sMax = station.sMax[this.currentMonthKey];

    return `
      <div class="popup-card">
        <div class="popup-header" style="border-left: 4px solid ${classif.color}">
          <div class="popup-title">${station.name} <span class="popup-kz">(${station.nameKz})</span></div>
          <div class="popup-region">${station.region} • ${station.altitude} м н.у.м.</div>
        </div>
        <div class="popup-body">
          <div class="popup-si-badge" style="background: ${classif.bg}; border-color: ${classif.color}; color: ${classif.color}">
            <span class="si-num">${val !== null ? (val > 0 ? '+' + val : val) : 'Н/Д'}</span>
            <span class="si-desc">Индекс Педя (${monthName} ${this.currentYear} г.)</span>
          </div>
          <div class="popup-classif-tag" style="color: ${classif.color}">
            <strong>${classif.label}</strong>
          </div>
          <div class="popup-risk-text">${classif.risk || ''}</div>
          <hr class="popup-divider">
          <div class="popup-metrics-grid">
            <div class="p-metric">
              <span class="p-lbl">Норма темп. (${monthName}):</span>
              <span class="p-val">${normT} °C</span>
            </div>
            <div class="p-metric">
              <span class="p-lbl">Норма осадков (${monthName}):</span>
              <span class="p-val">${normR} мм</span>
            </div>
            <div class="p-metric">
              <span class="p-lbl">Макс. засуха S_max:</span>
              <span class="p-val" style="color:#ef4444">+${sMax}</span>
            </div>
            <div class="p-metric">
              <span class="p-lbl">Число засух (15 лет):</span>
              <span class="p-val">${station.cases.total} случаев</span>
            </div>
          </div>
          <div class="popup-landscape">
            <em>Ландшафт:</em> ${station.landscape}
          </div>
          <button class="popup-view-btn" onclick="window.app.selectStation('${station.id}')">
            Детальная аналитика станции
          </button>
        </div>
      </div>
    `;
  }

  updateTime(year, monthKey) {
    this.currentYear = year;
    this.currentMonthKey = monthKey;

    // Обновляем маркеры
    Object.values(SCIENTIFIC_DATA.stations).forEach(station => {
      const val = station.drought[this.currentYear] ? station.drought[this.currentYear][this.currentMonthKey] : null;
      const classif = PedHelper.getClassification(val);
      const markerEl = document.getElementById(`marker-${station.id}`);
      if (markerEl) {
        markerEl.style.setProperty('--marker-color', classif.color);
        const valEl = markerEl.querySelector('.marker-val');
        if (valEl) {
          valEl.textContent = val !== null ? (val > 0 ? '+' + val : val) : '—';
        }
      }
      // Обновляем открытый попап, если есть
      const marker = this.stationMarkers[station.id];
      if (marker && marker.isPopupOpen()) {
        marker.setPopupContent(this.createPopupContent(station));
      }
    });

    // Перерисовываем интерполяцию
    this.drawInterpolation();
  }

  selectStation(stationId) {
    this.selectedStationId = stationId;
    const st = SCIENTIFIC_DATA.stations[stationId];
    if (st && this.map) {
      this.map.flyTo([st.lat, st.lon], 9, { duration: 1.2 });
      if (this.stationMarkers[stationId]) {
        this.stationMarkers[stationId].openPopup();
      }
    }
  }

  flyToPreset(preset) {
    if (!this.map) return;
    switch (preset) {
      case 'all':
        this.map.flyTo([44.45, 79.35], 7, { duration: 1.2 });
        break;
      case 'almaty':
        this.map.flyTo([43.2389, 76.9455], 10, { duration: 1.2 });
        break;
      case 'kegen':
        this.map.flyTo([43.0189, 79.2208], 10, { duration: 1.2 });
        break;
      case 'zhalanashkol':
        this.map.flyTo([45.5422, 82.1644], 9, { duration: 1.2 });
        break;
      case 'matay':
        this.map.flyTo([45.8953, 78.7186], 10, { duration: 1.2 });
        break;
      case 'taldykorgan':
        this.map.flyTo([45.0156, 78.3739], 10, { duration: 1.2 });
        break;
    }
  }
}
