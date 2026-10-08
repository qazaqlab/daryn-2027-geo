/**
 * 3D ГЕОПРОСТРАНСТВЕННАЯ РЕЛЬЕФНАЯ МОДЕЛЬ (THREE.JS)
 * Цифровая модель рельефа Юго-Восточного Казахстана (Тянь-Шань, Жетісу, Прибалхашье)
 * Динамические 3D-маяки индекса Педя и атмосферные частицы
 */

class DroughtMap3D {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.terrainMesh = null;
    this.stationBeacons = {};
    this.particles = null;
    this.particleGeo = null;
    this.currentYear = 2020;
    this.currentMonthKey = 'jul';
    this.animationFrameId = null;
    this.isInitialized = false;

    // Географические границы исследуемой области
    this.geoBounds = {
      minLat: 42.6,
      maxLat: 46.4,
      minLon: 76.2,
      maxLon: 82.8
    };

    // Размеры 3D плоскости
    this.worldWidth = 320;
    this.worldDepth = 240;
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container || this.isInitialized) return;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 550;

    // 1. Сцена
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1120);
    this.scene.fog = new THREE.FogExp2(0x0b1120, 0.0022);

    // 2. Камера
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
    this.camera.position.set(0, 220, 280);

    // 3. Рендерер
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Управление OrbitControls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.05; // Не уходить под землю
      this.controls.minDistance = 60;
      this.controls.maxDistance = 600;
      this.controls.target.set(0, 10, 0);
    }

    // 5. Освещение
    this.setupLighting();

    // 6. Построение 3D рельефа местности
    this.buildTerrain();

    // 7. Построение 3D маяков метеостанций
    this.buildStationBeacons();

    // 8. Атмосферные частицы засушливости / влаги
    this.buildAtmosphericParticles();

    // 9. Добавление координатной сетки и компаса
    this.buildReferenceGrid();

    // Обработчик ресайза
    window.addEventListener('resize', () => this.onWindowResize());

    // Запуск цикла анимации
    this.isInitialized = true;
    this.animate();

    // Первоначальное обновление данных
    this.updateData(this.currentYear, this.currentMonthKey);
  }

  setupLighting() {
    // Рассеянный свет ночного/дневного неба
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.65);
    hemiLight.position.set(0, 300, 0);
    this.scene.add(hemiLight);

    // Направленное «солнце», подчеркивающее рельеф горных хребтов (Тянь-Шань и Джунгарский Алатау)
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(150, 260, 120);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 800;
    const d = 200;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Дополнительный контурный свет
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(-180, 120, -150);
    this.scene.add(rimLight);
  }

  // Перевод географических координат в координаты 3D сцены
  geoTo3D(lat, lon) {
    const normX = (lon - this.geoBounds.minLon) / (this.geoBounds.maxLon - this.geoBounds.minLon);
    const normZ = (lat - this.geoBounds.minLat) / (this.geoBounds.maxLat - this.geoBounds.minLat);

    // Центрируем на 0, 0
    const x = (normX - 0.5) * this.worldWidth;
    const z = (0.5 - normZ) * this.worldDepth; // Инвертируем Z (север вверх)
    return { x, z };
  }

  // Высота рельефа в точке (симуляция реальной орографии Юго-Восточного Казахстана)
  getTerrainElevation(lat, lon) {
    // 1. Южный хребет Тянь-Шань / Заилийский Алатау (широта ~42.8 - 43.5, долгота 76.5 - 79.5)
    let elev = 8; // Базовый уровень равнины Прибалхашья (300-400м)

    // Горы Заилийский Алатау / Кунгей Алатау (юг)
    const southDist = Math.max(0, 43.6 - lat);
    if (lat < 43.6 && lon > 76.2 && lon < 80.0) {
      const ridgeStrength = Math.sin((lon - 76.2) / (80.0 - 76.2) * Math.PI);
      elev += (southDist * 42) * (0.8 + 0.4 * ridgeStrength);
    }

    // Высокогорное Кегенское плато (lat: 43.02, lon: 79.22, h=1800м)
    const dKegen = Math.hypot((lat - 43.02) * 1.5, lon - 79.22);
    if (dKegen < 1.2) {
      elev += Math.max(0, (1.2 - dKegen) * 22);
    }

    // Хребет Джунгарский Алатау (северо-восток, lat: 44.4 - 45.8, lon: 78.8 - 81.5)
    const djungarDist = Math.hypot((lat - 45.0) * 1.8, (lon - 80.0) * 0.9);
    if (djungarDist < 2.0) {
      elev += Math.max(0, Math.cos(djungarDist * Math.PI / 4.0) * 36);
    }

    // Джунгарские ворота (впадина между Джунгарским Алатау и хребтом Барлык, Жаланашколь lat: 45.54, lon: 82.16, h=372м)
    const dGate = Math.hypot((lat - 45.54) * 2.0, (lon - 82.16) * 1.2);
    if (dGate < 0.6) {
      elev = Math.min(elev, 10 + dGate * 12);
    }

    // Балхашская впадина (север / северо-запад, lat > 45.5, lon < 78.5)
    if (lat > 45.5 && lon < 78.5) {
      elev = Math.max(4, elev * 0.4);
    }

    // Легкий шум рельефа
    const noise = Math.sin(lat * 18.0) * Math.cos(lon * 22.0) * 1.8;
    return Math.max(4, elev + noise);
  }

  buildTerrain() {
    const segX = 140;
    const segZ = 120;
    const geometry = new THREE.PlaneGeometry(this.worldWidth, this.worldDepth, segX, segZ);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors = [];

    // Высотные цветовые градиенты (от песчаных степей до заснеженных пиков Тянь-Шаня)
    const cLow = new THREE.Color(0xbfa77a);    // Песчано-полынная равнина Прибалхашья (Матай)
    const cMidLow = new THREE.Color(0x738a53); // Степные и предгорные предгорья (Талдыкорган, 600м)
    const cMid = new THREE.Color(0x3e603b);    // Горно-лесной пояс (Заилийский Алатау, 1500-2200м)
    const cHigh = new THREE.Color(0x524b42);   // Скалы и альпийские луга
    const cSnow = new THREE.Color(0xf1f5f9);   // Вечные снега и ледники пиков (Хан-Тенгри, Талгар)

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Обратный перевод в координаты
      const normX = (x / this.worldWidth) + 0.5;
      const normZ = 0.5 - (z / this.worldDepth);
      const lon = this.geoBounds.minLon + normX * (this.geoBounds.maxLon - this.geoBounds.minLon);
      const lat = this.geoBounds.minLat + normZ * (this.geoBounds.maxLat - this.geoBounds.minLat);

      const y = this.getTerrainElevation(lat, lon);
      pos.setY(i, y);

      // Окраска по высоте
      let vertexColor = new THREE.Color();
      if (y < 12) {
        vertexColor.lerpColors(cLow, cMidLow, (y - 4) / 8);
      } else if (y < 26) {
        vertexColor.lerpColors(cMidLow, cMid, (y - 12) / 14);
      } else if (y < 42) {
        vertexColor.lerpColors(cMid, cHigh, (y - 26) / 16);
      } else {
        vertexColor.lerpColors(cHigh, cSnow, Math.min(1, (y - 42) / 14));
      }
      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: false
    });

    this.terrainMesh = new THREE.Mesh(geometry, material);
    this.terrainMesh.receiveShadow = true;
    this.terrainMesh.castShadow = true;
    this.scene.add(this.terrainMesh);

    // Подложка / боковой пьедестал для эффектного отображения геоблока
    this.buildBasePedestal();
  }

  buildBasePedestal() {
    const boxGeo = new THREE.BoxGeometry(this.worldWidth + 2, 8, this.worldDepth + 2);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(boxGeo, boxMat);
    pedestal.position.set(0, -4, 0);
    this.scene.add(pedestal);
  }

  buildStationBeacons() {
    const stations = SCIENTIFIC_DATA.stations;

    Object.values(stations).forEach(station => {
      const coords = this.geoTo3D(station.lat, station.lon);
      const elev = this.getTerrainElevation(station.lat, station.lon);

      // Группа станции
      const group = new THREE.Group();
      group.position.set(coords.x, elev, coords.z);

      // 1. Опорное кольцо на поверхности земли
      const ringGeo = new THREE.RingGeometry(2.5, 4.0, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.4;
      group.add(ringMesh);

      // 2. Внутренний световой диск
      const discGeo = new THREE.CircleGeometry(2.2, 32);
      discGeo.rotateX(-Math.PI / 2);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.y = 0.45;
      group.add(discMesh);

      // 3. Вертикальный световой энергетический цилиндр (высота масштабируется от Si)
      const cylGeo = new THREE.CylinderGeometry(0.8, 1.4, 25, 16);
      cylGeo.translate(0, 12.5, 0); // Опора на y=0
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
        roughness: 0.3
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      group.add(cylMesh);

      // 4. Венчает маяк светящаяся сфера
      const orbGeo = new THREE.SphereGeometry(2.0, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.0
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.y = 25;
      group.add(orbMesh);

      // 5. Точечный источник света над станцией
      const pointLight = new THREE.PointLight(0xf59e0b, 1.2, 45);
      pointLight.position.y = 26;
      group.add(pointLight);

      this.scene.add(group);

      this.stationBeacons[station.id] = {
        group,
        ringMesh,
        cylMesh,
        orbMesh,
        pointLight,
        station,
        baseY: elev
      };
    });
  }

  buildAtmosphericParticles() {
    const count = 750;
    this.particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * this.worldWidth;
      positions[i * 3 + 1] = 10 + Math.random() * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.worldDepth;

      // Теплые золотистые частицы суховея / взвеси
      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.75;
      colors[i * 3 + 2] = 0.4;
    }

    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(this.particleGeo, pMat);
    this.scene.add(this.particles);
  }

  buildReferenceGrid() {
    // Вспомогательная геодезическая сетка в основании
    const grid = new THREE.GridHelper(this.worldWidth, 16, 0x334155, 0x1e293b);
    grid.position.y = -4.1;
    this.scene.add(grid);

    // Указатель на Север (N)
    const dir = new THREE.Vector3(0, 0, -1);
    const origin = new THREE.Vector3(-this.worldWidth / 2 + 15, 2, this.worldDepth / 2 - 15);
    const arrowHelper = new THREE.ArrowHelper(dir, origin, 20, 0x38bdf8, 5, 3);
    this.scene.add(arrowHelper);
  }

  updateData(year, monthKey) {
    this.currentYear = year;
    this.currentMonthKey = monthKey;

    let avgSi = 0;
    let validCount = 0;

    Object.values(SCIENTIFIC_DATA.stations).forEach(station => {
      const beacon = this.stationBeacons[station.id];
      if (!beacon) return;

      const val = station.drought[year] ? station.drought[year][monthKey] : null;
      const classif = PedHelper.getClassification(val);

      if (val !== null && val !== undefined) {
        avgSi += val;
        validCount++;
      }

      // Высота световой колонны в зависимости от Si
      // При отрицательном (влажно) - минимальная высота (5-8), при высоком Si - до 45
      const height = val !== null ? Math.max(5, Math.min(48, 14 + val * 12)) : 6;
      const col = new THREE.Color(classif.color);

      // Масштабируем цилиндр по Y
      beacon.cylMesh.scale.set(1, height / 25, 1);
      beacon.orbMesh.position.y = height;
      beacon.pointLight.position.y = height + 1;

      // Обновляем материалы и цвета
      beacon.cylMesh.material.color.copy(col);
      beacon.cylMesh.material.emissive.copy(col);
      beacon.orbMesh.material.emissive.copy(col);
      beacon.pointLight.color.copy(col);
      beacon.ringMesh.material.color.copy(col);

      // Если сильная засуха — повышаем интенсивность свечения
      const isExtreme = val !== null && val >= 1.5;
      beacon.pointLight.intensity = isExtreme ? 2.5 : 1.2;
    });

    // Реакция атмосферных частиц: при средней засухе цвет золотисто-оранжевый, при увлажнении — прохладный голубой
    if (validCount > 0 && this.particles) {
      avgSi /= validCount;
      const pColorArray = this.particleGeo.attributes.color.array;
      const isDrought = avgSi > 0.5;

      for (let i = 0; i < pColorArray.length / 3; i++) {
        if (isDrought) {
          pColorArray[i * 3] = 0.98;
          pColorArray[i * 3 + 1] = 0.65;
          pColorArray[i * 3 + 2] = 0.25;
        } else {
          pColorArray[i * 3] = 0.25;
          pColorArray[i * 3 + 1] = 0.75;
          pColorArray[i * 3 + 2] = 0.98;
        }
      }
      this.particleGeo.attributes.color.needsUpdate = true;
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Пульсация колец станций
    Object.values(this.stationBeacons).forEach((beacon, idx) => {
      const pulse = 1.0 + Math.sin(time * 3 + idx) * 0.15;
      beacon.ringMesh.scale.set(pulse, pulse, pulse);
    });

    // Движение атмосферных частиц (суховей / ветер)
    if (this.particles) {
      const pos = this.particleGeo.attributes.position.array;
      for (let i = 0; i < pos.length / 3; i++) {
        // Движение с юго-запада на северо-восток (преобладающий перенос)
        pos[i * 3] += 0.22;
        pos[i * 3 + 2] -= 0.15;

        // Зацикливание
        if (pos[i * 3] > this.worldWidth / 2) pos[i * 3] = -this.worldWidth / 2;
        if (pos[i * 3 + 2] < -this.worldDepth / 2) pos[i * 3 + 2] = this.worldDepth / 2;
      }
      this.particleGeo.attributes.position.needsUpdate = true;
    }

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Смена 3D ракурсов камеры
  flyToPreset(preset) {
    if (!this.controls) return;

    switch (preset) {
      case 'overview':
        this.tweenCamera(new THREE.Vector3(0, 220, 280), new THREE.Vector3(0, 10, 0));
        break;
      case 'almaty': {
        const c = this.geoTo3D(43.2389, 76.9455);
        this.tweenCamera(new THREE.Vector3(c.x + 40, 75, c.z + 65), new THREE.Vector3(c.x, 22, c.z));
        break;
      }
      case 'kegen': {
        const c = this.geoTo3D(43.0189, 79.2208);
        this.tweenCamera(new THREE.Vector3(c.x + 35, 70, c.z + 55), new THREE.Vector3(c.x, 26, c.z));
        break;
      }
      case 'zhalanashkol': {
        const c = this.geoTo3D(45.5422, 82.1644);
        this.tweenCamera(new THREE.Vector3(c.x - 45, 60, c.z + 50), new THREE.Vector3(c.x, 12, c.z));
        break;
      }
      case 'matay': {
        const c = this.geoTo3D(45.8953, 78.7186);
        this.tweenCamera(new THREE.Vector3(c.x + 30, 60, c.z + 60), new THREE.Vector3(c.x, 8, c.z));
        break;
      }
      case 'taldykorgan': {
        const c = this.geoTo3D(45.0156, 78.3739);
        this.tweenCamera(new THREE.Vector3(c.x + 40, 65, c.z + 60), new THREE.Vector3(c.x, 14, c.z));
        break;
      }
      case 'ortho':
        this.tweenCamera(new THREE.Vector3(0, 310, 5), new THREE.Vector3(0, 0, 0));
        break;
    }
  }

  tweenCamera(targetPos, targetLookAt) {
    // Плавный переход камеры
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const duration = 1200;
    const startTime = performance.now();

    const updateTween = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // EaseInOutCubic
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);

      if (progress < 1) {
        requestAnimationFrame(updateTween);
      }
    };
    updateTween();
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
