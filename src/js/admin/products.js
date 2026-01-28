// Local Storage Keys
const STORAGE_KEYS = {
    PRODUCTS: 'gadget_admin_products',
    CATEGORIES: 'gadget_admin_categories',
    INVENTORY_HISTORY: 'gadget_admin_inventory_history'
};

// Mock data
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        sku: "APP-15P-256",
        category: "smartphones",
        brand: "Apple",
        price: 999.00,
        stock: 42,
        status: "instock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1RYD7d0kHslXStM27Vw-b6UJeh3zmbnRQLud4T7R3RUL9FnSIcGPpDhlvSTmKRmEm83zzBWi3wetM3svok88fCegSOmq9AmR3V_bEy271HM0yjUc9QLdMpTLxdeAKsW5UdAGMwHjZzwb-vaIywTt8YD5kvARpxNronmoH-QGekTkYMjBMbAmNkUyFCrBu8m3SVzCzm3qyQu-MLeglHtGhnDJjV5TzL37kGrTt3b9Ht1M5TYiZOR2EfALq0261KmFcxGuesqMj2eQ",
        description: "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.",
        features: "Titanium design\nA17 Pro chip\nAdvanced camera system\nDynamic Island\nUSB-C connectivity",
        specs: "Display: 6.1-inch Super Retina XDR\nProcessor: A17 Pro\nStorage: 256GB\nRAM: 8GB\nBattery: 3274mAh",
        featured: true,
        salesCount: 1245,
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        id: 2,
        name: "MacBook Air M3",
        sku: "APP-MBA-M3",
        category: "laptops",
        brand: "Apple",
        price: 1299.00,
        stock: 8,
        status: "lowstock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANhR9ZVBt6rFIzUvc-Gy-fipQtTPkc7UwJ9rK52zJK-NVkicNz-eTX7IgKNZDDKsQStn8KHynDyQlQeDB5jh0R0zvRj0Dc7ZxB4QLd2sMOEPYX0TRRQNLVQ39vRh50cJkD9CwQpcnX08aR3G6e2JLIrEejGHb0cRbMZSCqpg6_p-pP9RuprQ_9xnzEMS_UYhPxtbKbA54eI03fMW_9PIUMby_qJkEzVD-LFN6baVVFJV2jg_UEhFnMvo1cdBSK3Rbglbn30yLPSHY",
        description: "Supercharged by M3 chip with up to 18 hours of battery life.",
        features: "M3 chip\n18-hour battery life\nLiquid Retina display\nFanless design\nMagSafe charging",
        specs: "Display: 13.6-inch Liquid Retina\nProcessor: Apple M3\nStorage: 256GB SSD\nRAM: 8GB\nWeight: 2.7 pounds",
        featured: true,
        salesCount: 892,
        createdAt: "2024-02-20T14:15:00Z"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        sku: "SNY-XM5-BLK",
        category: "audio",
        brand: "Sony",
        price: 348.00,
        stock: 156,
        status: "instock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8bVs-y3VSoI_GD_Clqj98NAXdQMlv2ZZTBirGlWkaG_YEk-sQkd5gRkvM-vPpMBPwNFwVpavZOB5lUUqmEfIk_OyVah5ut4Qso_Ws7_C4OHHfv3eMki4-_K3oQZTZX-5pEiUI8SUEsQO0lMz9r0VYvKBh2yxCY04OL7VkuzwMa_9apMOeE1yfeMR5wADPjEzmw-jV24sIEaUiq4i6raARft9KRzOhCF5q8dywBUt-qW_td3wF9WalIgUDqTdVPxUZv5z2KdxVSU4",
        description: "Industry-leading noise cancellation with 30-hour battery life.",
        features: "Industry-leading noise cancellation\n30-hour battery life\nAuto NC Optimizer\nMulti-device pairing\nCrystal clear calls",
        specs: "Battery: 30 hours (NC on)\nCharging: 3 hours (full charge)\nWeight: 250g\nConnectivity: Bluetooth 5.2\nDriver: 30mm",
        featured: false,
        salesCount: 2310,
        createdAt: "2024-01-10T09:45:00Z"
    },
    {
        id: 4,
        name: "Google Pixel 8",
        sku: "GGL-PX8-128",
        category: "smartphones",
        brand: "Google",
        price: 699.00,
        stock: 0,
        status: "outstock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1tUR_ZcU38wwDO1iyq7ukS8EA7BWMtSDT0hq9QFzs15vjN9fgg_buh_KaE2ak-zA8Y6W1-iZDgUdfxtXqBQxL3grtp_uZ2AVsrQ6pModS23F26q0eQcUvEof0wqn_mCRbsTs--GgkFYKN7CA0o2SzMwjouP5SNGS9i1lPEEKtbAiUcWt3EKGvRMK59etzb4WpgdG1m2ItaN_k4SV_Sl303vhZfc9hmYNsUbZumzLEhiF9MvQAVLN-YPEjgOwNXHC96bftuMyXF8",
        description: "Powered by Google AI with advanced photo editing tools.",
        features: "Google Tensor G3 chip\nAdvanced photo editing\n7 years of OS updates\nFace unlock\nMagic Eraser",
        specs: "Display: 6.2-inch Actua\nProcessor: Google Tensor G3\nStorage: 128GB\nRAM: 8GB\nBattery: 4575mAh",
        featured: false,
        salesCount: 567,
        createdAt: "2024-03-05T11:20:00Z"
    },
    {
        id: 5,
        name: "Logitech G Pro X",
        sku: "LOG-GPX-WHT",
        category: "accessories",
        brand: "Logitech",
        price: 149.99,
        stock: 89,
        status: "instock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCeOgHJ9MnfsowZI6Qh3EWCfSy2MrJLx63nP-nz2zu0yZOIdDLDJKtj-ehVyK25HIUoxATZxO8ucYdtBSaX0lMzHG05ue7y_8aIngXfXopJWwy5xnlVwJNvSqnUEwz211dRZxA5fdJl3jyfXi1wNQpWFOixxkPgGue24p6MP8KUmeRFq3TS7rDe6ahUezapUOKXr94GE37I4D2yIVnj8Imk67xIG0ke0pyu0MKpWMivUZpez1LGbuUDEwM8ZwUcl0037zyhISAWyw",
        description: "Professional-grade gaming headset with Blue VO!CE microphone technology.",
        features: "Blue VO!CE microphone\nPro-G 50mm drivers\nDTS Headphone:X 2.0\nLightweight design\nDetachable cable",
        specs: "Driver: 50mm Pro-G\nMicrophone: Cardioid (Blue VO!CE)\nFrequency: 20Hz-20kHz\nImpedance: 35 Ohm\nWeight: 320g",
        featured: false,
        salesCount: 1234,
        createdAt: "2024-02-28T16:40:00Z"
    },
    {
        id: 6,
        name: 'iPad Pro 12.9"',
        sku: "APP-IPP-129",
        category: "tablets",
        brand: "Apple",
        price: 1099.00,
        stock: 5,
        status: "lowstock",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD5mD_0NHnv4_6GxLSy1MQomJ4EfftWM5ausDlHZXzbuIElOzxjed0b0O5LFNxV_489XWlliWScSJMgCXWfKgoFRnDVe57wICxcHpuoMt8LvQQxw2b6P_aBjvvUbbXiJOcJU_2waZ8b0izSzV8agvMVbHKxwE_xUczqVIOc7zTVzoxgoJowXmRaoKai5HRYU8PO4K0rezCaNqf15oEMYSu9VlzLHfKl6VKjaDLtbW_eoPmicK3X06fy0FYEQuKEEcNGOI2M3HpM04",
        description: "M2 chip, Liquid Retina XDR display, and ProMotion technology.",
        features: "M2 chip\nLiquid Retina XDR display\nProMotion technology\nThunderbolt connectivity\nApple Pencil hover",
        specs: "Display: 12.9-inch Liquid Retina XDR\nProcessor: Apple M2\nStorage: 128GB\nRAM: 8GB\nBattery: 40.88 watt-hour",
        featured: true,
        salesCount: 678,
        createdAt: "2024-03-15T13:25:00Z"
    },
    {
        id: 7,
        name: "Samsung Galaxy Z Fold5",
        sku: "SAM-GZF5-256",
        category: "smartphones",
        brand: "Samsung",
        price: 1799.00,
        stock: 15,
        status: "instock",
        image: "https://images.samsung.com/is/image/samsung/p6pim/us/feature/164418397/us-feature-foldable-s-flex-mode-535804062",
        description: "Foldable smartphone with improved hinge and multitasking capabilities.",
        features: "Foldable design\nImproved hinge\nMulti-window multitasking\nS Pen support\nUnder-display camera",
        specs: "Display: 7.6-inch Dynamic AMOLED 2X\nProcessor: Snapdragon 8 Gen 2\nStorage: 256GB\nRAM: 12GB\nBattery: 4400mAh",
        featured: true,
        salesCount: 345,
        createdAt: "2024-03-01T10:10:00Z"
    },
    {
        id: 8,
        name: "Dell XPS 15",
        sku: "DEL-XPS15-1TB",
        category: "laptops",
        brand: "Dell",
        price: 2199.00,
        stock: 12,
        status: "instock",
        image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-nt-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3514&hei=2400&qlt=100,1&resMode=sharp2&size=3514,2400&chrss=full",
        description: "Powerful creative workstation with OLED display and RTX graphics.",
        features: "OLED display\nRTX graphics\nIntel Core i9 processor\nInfinityEdge display\nPremium build quality",
        specs: "Display: 15.6-inch OLED 3.5K\nProcessor: Intel Core i9-13900H\nGPU: NVIDIA RTX 4070\nStorage: 1TB SSD\nRAM: 32GB",
        featured: false,
        salesCount: 234,
        createdAt: "2024-02-10T15:30:00Z"
    },
    {
        id: 9,
        name: "Bose QuietComfort Ultra",
        sku: "BOS-QCU-BLK",
        category: "audio",
        brand: "Bose",
        price: 429.00,
        stock: 45,
        status: "instock",
        image: "https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/qc_ultra_over_ear_black_EC_hero.psd/jcr:content/renditions/cq5dam.web.1280.1280.png",
        description: "Immersive audio with world-class noise cancellation.",
        features: "Immersive Audio\nWorld-class noise cancellation\nCustomTune technology\nComfortable fit\n24-hour battery",
        specs: "Battery: 24 hours (NC on)\nCharging: 15 min for 2.5 hours\nWeight: 260g\nConnectivity: Bluetooth 5.3\nMicrophones: 8-mic array",
        featured: false,
        salesCount: 890,
        createdAt: "2024-01-25T12:45:00Z"
    },
    {
        id: 10,
        name: "Apple Watch Ultra 2",
        sku: "APP-AWU2-GPS",
        category: "wearables",
        brand: "Apple",
        price: 799.00,
        stock: 32,
        status: "instock",
        image: "https://www.apple.com/v/apple-watch-ultra-2/a/images/overview/hero/hero_1__b8z3k6v12yeq_large.jpg",
        description: "Rugged smartwatch with advanced fitness features and dive capabilities.",
        features: "Rugged titanium case\nDive capabilities\nPrecision dual-frequency GPS\nAction button\nAlways-on Retina display",
        specs: "Display: 49mm Always-on Retina\nProcessor: S9 SiP\nStorage: 64GB\nBattery: 36 hours\nWater resistance: 100m",
        featured: true,
        salesCount: 1567,
        createdAt: "2024-03-10T09:15:00Z"
    },
    {
        id: 11,
        name: "PlayStation 5",
        sku: "SON-PS5-DISC",
        category: "gaming",
        brand: "Sony",
        price: 499.99,
        stock: 18,
        status: "instock",
        image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        description: "Next-gen gaming console with ultra-high speed SSD and ray tracing.",
        features: "Ultra-high speed SSD\nRay tracing support\n4K 120fps gaming\nHaptic feedback\nAdaptive triggers",
        specs: "Processor: AMD Zen 2 (8-core)\nGPU: AMD RDNA 2 (10.28 TFLOPS)\nStorage: 825GB SSD\nRAM: 16GB GDDR6\nOptical drive: 4K UHD Blu-ray",
        featured: true,
        salesCount: 4567,
        createdAt: "2024-01-05T08:20:00Z"
    },
    {
        id: 12,
        name: "Nintendo Switch OLED",
        sku: "NIN-SWOLED-RED",
        category: "gaming",
        brand: "Nintendo",
        price: 349.99,
        stock: 24,
        status: "instock",
        image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/switch/site-design-update/switch-oled-model-red-blue-joycon",
        description: "Hybrid gaming console with vibrant OLED screen.",
        features: "Vibrant OLED screen\nWide adjustable stand\nEnhanced audio\n64GB internal storage\nTV mode support",
        specs: "Display: 7-inch OLED\nStorage: 64GB\nBattery: 4.5-9 hours\nResolution: 720p handheld / 1080p docked\nConnectivity: WiFi, Bluetooth 4.1",
        featured: false,
        salesCount: 2987,
        createdAt: "2024-02-15T14:50:00Z"
    },
    {
        id: 13,
        name: "GoPro Hero 12",
        sku: "GOP-H12-BLK",
        category: "cameras",
        brand: "GoPro",
        price: 399.99,
        stock: 28,
        status: "instock",
        image: "https://gopro.com/content/dam/help/hero12-black/media/hero12-black-front.png",
        description: "Action camera with 5.3K video and HyperSmooth 6.0 stabilization.",
        features: "5.3K video\nHyperSmooth 6.0\n10-bit color\nHDR video\nWaterproof design",
        specs: "Video: 5.3K60, 4K120\nStabilization: HyperSmooth 6.0\nBattery: Enduro (1720mAh)\nWaterproof: 33ft (10m)\nWeight: 154g",
        featured: false,
        salesCount: 1234,
        createdAt: "2024-03-08T11:35:00Z"
    },
    {
        id: 14,
        name: "DJI Mini 4 Pro",
        sku: "DJI-M4P-FLY",
        category: "drones",
        brand: "DJI",
        price: 759.00,
        stock: 9,
        status: "lowstock",
        image: "https://www.dji.com/content/dam/dji/consumer/mini-4-pro/overview/dji-mini-4-pro-drone-pic.png",
        description: "Ultra-light drone with omnidirectional obstacle sensing.",
        features: "Omnidirectional obstacle sensing\n4K/60fps HDR video\nActiveTrack 360\n48MP photos\n34-min flight time",
        specs: "Weight: <249g\nVideo: 4K/60fps HDR\nBattery: 34 minutes\nSensors: Omnidirectional\nMax speed: 16m/s",
        featured: true,
        salesCount: 567,
        createdAt: "2024-03-20T10:05:00Z"
    },
    {
        id: 15,
        name: "Kindle Paperwhite",
        sku: "AMA-KPW-16GB",
        category: "e-readers",
        brand: "Amazon",
        price: 149.99,
        stock: 67,
        status: "instock",
        image: "https://m.media-amazon.com/images/I/61X+3NNeURL._AC_SL1500_.jpg",
        description: "Waterproof e-reader with 6.8\" glare-free display.",
        features: "Waterproof design\nGlare-free display\nAdjustable warm light\nWeeks of battery life\nAudible support",
        specs: "Display: 6.8\" 300ppi\nStorage: 16GB\nBattery: Weeks of use\nWaterproof: IPX8\nWeight: 205g",
        featured: false,
        salesCount: 4567,
        createdAt: "2024-01-30T13:15:00Z"
    },
    {
        id: 16,
        name: "Microsoft Surface Pro 9",
        sku: "MIC-SP9-256",
        category: "tablets",
        brand: "Microsoft",
        price: 999.99,
        stock: 14,
        status: "instock",
        image: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Surface-Pro-9-Consumer-Content-Placement-02-1?wid=406&hei=230&fit=crop",
        description: "Versatile 2-in-1 laptop with PixelSense touchscreen.",
        features: "2-in-1 design\nPixelSense touchscreen\nIntel Evo platform\nSurface Pen support\nWindows 11 Pro",
        specs: "Display: 13\" PixelSense\nProcessor: 12th Gen Intel Core i5\nStorage: 256GB SSD\nRAM: 8GB\nBattery: Up to 15.5 hours",
        featured: false,
        salesCount: 789,
        createdAt: "2024-02-25T16:20:00Z"
    },
    {
        id: 17,
        name: "Razer Blade 16",
        sku: "RAZ-BL16-4070",
        category: "laptops",
        brand: "Razer",
        price: 3299.00,
        stock: 6,
        status: "lowstock",
        image: "https://assets2.razerzone.com/images/pnx.assets/618c0b65424070a1017a7168ea1b6337/razer-blade-16-2024-usp-dual-mode-500x500.jpg",
        description: "Gaming laptop with dual-mode mini-LED display.",
        features: "Dual-mode mini-LED\nNVIDIA RTX 4070\nIntel Core i9\nVapor chamber cooling\nPer-key RGB lighting",
        specs: "Display: 16\" mini-LED (Dual-mode)\nProcessor: Intel Core i9-14900HX\nGPU: NVIDIA RTX 4070\nStorage: 1TB SSD\nRAM: 32GB",
        featured: true,
        salesCount: 123,
        createdAt: "2024-03-12T14:30:00Z"
    },
    {
        id: 18,
        name: "Meta Quest 3",
        sku: "MET-Q3-128",
        category: "vr",
        brand: "Meta",
        price: 499.99,
        stock: 38,
        status: "instock",
        image: "https://www.meta.com/quest/quest-3/static/media/quest3ProductImageFull.0e0831339c6cfae10dc9.png",
        description: "Mixed reality headset with pancake lenses and Snapdragon XR2 Gen 2.",
        features: "Mixed reality\nPancake lenses\nSnapdragon XR2 Gen 2\nTouch Plus controllers\nColor passthrough",
        specs: "Display: 2064x2208 per eye\nProcessor: Snapdragon XR2 Gen 2\nStorage: 128GB\nRAM: 8GB\nField of view: 110°",
        featured: false,
        salesCount: 2345,
        createdAt: "2024-02-18T11:10:00Z"
    },
    {
        id: 19,
        name: "Anker 737 Power Bank",
        sku: "ANK-737-24K",
        category: "accessories",
        brand: "Anker",
        price: 149.99,
        stock: 52,
        status: "instock",
        image: "https://m.media-amazon.com/images/I/71fPVA-6bQL._AC_SL1500_.jpg",
        description: "24,000mAh power bank with 140W charging.",
        features: "140W charging\n24,000mAh capacity\nGaNPrime technology\nDigital display\nMulti-device charging",
        specs: "Capacity: 24,000mAh\nOutput: 140W max\nInput: 100W max\nPorts: 2x USB-C, 1x USB-A\nWeight: 588g",
        featured: false,
        salesCount: 3456,
        createdAt: "2024-01-20T15:45:00Z"
    },
    {
        id: 20,
        name: "LG C3 OLED TV",
        sku: "LG-C3-65",
        category: "tvs",
        brand: "LG",
        price: 1799.99,
        stock: 7,
        status: "lowstock",
        image: "https://www.lg.com/us/images/tvs/md08000568/gallery/OLED65C3PUA-DZ-01.jpg",
        description: "65-inch OLED TV with α9 Gen6 AI processor.",
        features: "OLED evo panel\nα9 Gen6 AI processor\nDolby Vision IQ\nDolby Atmos\nwebOS 23",
        specs: "Display: 65\" OLED evo\nProcessor: α9 Gen6 AI\nResolution: 4K (3840x2160)\nRefresh rate: 120Hz\nHDR: Dolby Vision, HDR10",
        featured: true,
        salesCount: 456,
        createdAt: "2024-02-28T09:55:00Z"
    },
    {
        id: 21,
        name: "Sonos Era 300",
        sku: "SON-ERA300-BLK",
        category: "audio",
        brand: "Sonos",
        price: 449.00,
        stock: 21,
        status: "instock",
        image: "https://www.sonos.com/content/dam/sonos/products/era-300/black/product-3d/era-300-black-pdp-3d-01.png",
        description: "Spatial audio speaker with Dolby Atmos support.",
        features: "Spatial audio\nDolby Atmos support\nWi-Fi 6\nBluetooth 5.0\nVoice control",
        specs: "Drivers: 6 amplified drivers\nConnectivity: WiFi 6, Bluetooth 5.0\nAudio formats: Dolby Atmos, Stereo\nWeight: 4.44kg\nDimensions: 260 x 185 x 175mm",
        featured: false,
        salesCount: 678,
        createdAt: "2024-03-05T12:25:00Z"
    },
    {
        id: 22,
        name: "Fitbit Charge 6",
        sku: "FIT-C6-BLK",
        category: "wearables",
        brand: "Fitbit",
        price: 159.95,
        stock: 43,
        status: "instock",
        image: "https://i5.walmartimages.com/seo/Fitbit-Charge-6-Fitness-Tracker-Black_84919598-5e6d-434a-9359-7d2fbb26a5c3.11a9ed4ce5a1792bdb2cf55ec45ba559.jpeg",
        description: "Advanced fitness tracker with built-in GPS.",
        features: "Built-in GPS\n40+ exercise modes\nSleep tracking\nStress management\n6+ day battery",
        specs: "Display: AMOLED touchscreen\nBattery: 7+ days\nGPS: Built-in\nWater resistance: 50m\nSensors: Heart rate, SpO2",
        featured: false,
        salesCount: 2345,
        createdAt: "2024-02-22T10:40:00Z"
    },
    {
        id: 23,
        name: "SanDisk Extreme Pro",
        sku: "SND-EXTPRO-1TB",
        category: "storage",
        brand: "SanDisk",
        price: 119.99,
        stock: 89,
        status: "instock",
        image: "https://www.westerndigital.com/content/dam/store/en-us/assets/products/memory-cards/sandisk-extreme-pro-sdxc-uhs-i-card/gallery/extreme-pro-sdxc-uhs-i-card-front.png",
        description: "1TB SD card with 200MB/s read speeds.",
        features: "200MB/s read speeds\n140MB/s write speeds\n4K video support\nTemperature proof\nWater proof",
        specs: "Capacity: 1TB\nRead speed: 200MB/s\nWrite speed: 140MB/s\nClass: UHS-I, V30\nTemperature: -25°C to 85°C",
        featured: false,
        salesCount: 4567,
        createdAt: "2024-01-18T14:15:00Z"
    },
    {
        id: 24,
        name: "Corsair K100 RGB",
        sku: "COR-K100-BLK",
        category: "accessories",
        brand: "Corsair",
        price: 229.99,
        stock: 31,
        status: "instock",
        image: "https://www.corsair.com/us/en/media/catalog/product/c/h/ch-9129011-na-k100_front_01.png",
        description: "Mechanical gaming keyboard with optical-mechanical switches.",
        features: "Optical-mechanical switches\nAXON hyper-processing\nPBT double-shot keycaps\nPer-key RGB\nElgato Stream Deck integration",
        specs: "Switches: OPX optical-mechanical\nPolling rate: 4000Hz (AXON)\nKeycaps: PBT double-shot\nLighting: Per-key RGB\nConnectivity: USB Type-C",
        featured: false,
        salesCount: 890,
        createdAt: "2024-02-14T16:50:00Z"
    },
    {
        id: 25,
        name: "Logitech MX Master 3S",
        sku: "LOG-MX3S-GRY",
        category: "accessories",
        brand: "Logitech",
        price: 99.99,
        stock: 74,
        status: "instock",
        image: "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png",
        description: "Advanced wireless mouse for productivity.",
        features: "Quiet clicks\n8K DPI sensor\nFast scrolling\nMulti-device flow\nEasy-switch",
        specs: "Sensor: Darkfield 8000 DPI\nButtons: 7 programmable\nBattery: 70 days\nConnectivity: Bluetooth, USB receiver\nWeight: 141g",
        featured: false,
        salesCount: 5678,
        createdAt: "2024-01-22T11:30:00Z"
    },
    {
        id: 26,
        name: "Samsung 49\" Odyssey G9",
        sku: "SAM-ODG9-240",
        category: "monitors",
        brand: "Samsung",
        price: 1299.99,
        stock: 11,
        status: "instock",
        image: "https://images.samsung.com/is/image/samsung/p6pim/uk/ls49ag952npxxu/gallery/uk-odyssey-oled-g9-g95sc-ls49ag952npxxu-534906077",
        description: "Dual QHD curved gaming monitor with 240Hz refresh rate.",
        features: "Dual QHD curved display\n240Hz refresh rate\nQLED technology\nHDR2000\nG-Sync Compatible",
        specs: "Display: 49\" QLED curved\nResolution: 5120x1440\nRefresh rate: 240Hz\nResponse time: 1ms\nHDR: HDR2000",
        featured: true,
        salesCount: 234,
        createdAt: "2024-03-03T13:40:00Z"
    },
    {
        id: 27,
        name: "Google Nest Hub Max",
        sku: "GGL-NHMAX-CHALK",
        category: "smart-home",
        brand: "Google",
        price: 229.00,
        stock: 26,
        status: "instock",
        image: "https://lh3.googleusercontent.com/SoQxscmCCLLK9NUt7Pmo0KQXjXe9vKLtOQQtyZzEV-nTQjN7EX0Q7VqsDYK1FOZcY3Mx15p6UxHV2AHqN4sI4WGsWv9Vsf_iH_j2P3g=rw-e365-w1440",
        description: "10-inch smart display with camera and Google Assistant.",
        features: "10-inch display\nBuilt-in camera\nGoogle Assistant\nVideo calling\nSmart home control",
        specs: "Display: 10\" HD touchscreen\nCamera: 6.5MP wide-angle\nSpeakers: Stereo speakers\nConnectivity: WiFi, Bluetooth\nWeight: 1.3kg",
        featured: false,
        salesCount: 1234,
        createdAt: "2024-02-05T15:20:00Z"
    },
    {
        id: 28,
        name: "Apple AirTag 4-Pack",
        sku: "APP-ATAG-4PK",
        category: "accessories",
        brand: "Apple",
        price: 99.00,
        stock: 112,
        status: "instock",
        image: "https://www.apple.com/v/airtag/a/images/overview/hero__xr6t5jafqqm6_large.jpg",
        description: "Bluetooth tracker for finding everyday items.",
        features: "Precision Finding\nReplaceable battery\nLost mode\nPrivacy features\nWater resistant",
        specs: "Battery: CR2032 (user replaceable)\nConnectivity: Bluetooth, U1 chip\nRange: Bluetooth range\nWater resistance: IP67\nBattery life: Over 1 year",
        featured: false,
        salesCount: 7890,
        createdAt: "2024-01-12T09:10:00Z"
    },
    {
        id: 29,
        name: "ASUS ROG Ally",
        sku: "ASU-ROGALLY-Z1",
        category: "gaming",
        brand: "ASUS",
        price: 699.99,
        stock: 19,
        status: "instock",
        image: "https://dlcdnwebimgs.asus.com/gain/f2f7f151-5d69-4fdd-91d7-3287138c8724/w800",
        description: "Windows gaming handheld with AMD Z1 Extreme processor.",
        features: "Windows 11 gaming handheld\nAMD Z1 Extreme processor\n1080p 120Hz display\nROG XG Mobile support\nCustomizable controls",
        specs: "Display: 7\" 1080p 120Hz\nProcessor: AMD Z1 Extreme\nGPU: AMD RDNA 3\nRAM: 16GB LPDDR5\nStorage: 512GB SSD",
        featured: true,
        salesCount: 456,
        createdAt: "2024-03-18T14:15:00Z"
    },
    {
        id: 30,
        name: "B&O Beoplay Portal",
        sku: "BOP-PORTAL-BLK",
        category: "audio",
        brand: "Bang & Olufsen",
        price: 499.00,
        stock: 8,
        status: "lowstock",
        image: "https://bang-olufsen.formstack.com/forms/media_library_media_file/image_files/000/005/666/original/B_O_Portal_Black_front.webp",
        description: "Premium wireless headphones for gaming and music.",
        features: "Adaptive Active Noise Cancellation\nDolby Atmos for gaming\n50-hour battery\nTransparency mode\nPremium materials",
        specs: "Battery: 50 hours (ANC on)\nConnectivity: Bluetooth 5.1, 2.4GHz\nDrivers: 40mm custom\nWeight: 288g\nMicrophones: 6-mic array",
        featured: false,
        salesCount: 123,
        createdAt: "2024-02-08T11:50:00Z"
    }
];

const MOCK_CATEGORIES = [
    { id: 1, name: "Smartphones", slug: "smartphones", icon: "smartphone", status: "active", type: "main", productCount: 4, displayOrder: 1 },
    { id: 2, name: "Laptops", slug: "laptops", icon: "computer", status: "active", type: "main", productCount: 4, displayOrder: 2 },
    { id: 3, name: "Audio", slug: "audio", icon: "headphones", status: "active", type: "main", productCount: 5, displayOrder: 3 },
    { id: 4, name: "Tablets", slug: "tablets", icon: "tablet", status: "active", type: "main", productCount: 2, displayOrder: 4 },
    { id: 5, name: "Wearables", slug: "wearables", icon: "watch", status: "active", type: "main", productCount: 2, displayOrder: 5 },
    { id: 6, name: "Accessories", slug: "accessories", icon: "cable", status: "active", type: "main", productCount: 4, displayOrder: 6 },
    { id: 7, name: "Gaming", slug: "gaming", icon: "sports_esports", status: "active", type: "main", productCount: 3, displayOrder: 7 },
    { id: 8, name: "Cameras", slug: "cameras", icon: "photo_camera", status: "active", type: "main", productCount: 1, displayOrder: 8 },
    { id: 9, name: "Drones", slug: "drones", icon: "flight", status: "active", type: "main", productCount: 1, displayOrder: 9 },
    { id: 10, name: "E-readers", slug: "e-readers", icon: "menu_book", status: "active", type: "main", productCount: 1, displayOrder: 10 },
    { id: 11, name: "VR", slug: "vr", icon: "view_in_ar", status: "active", type: "main", productCount: 1, displayOrder: 11 },
    { id: 12, name: "TVs", slug: "tvs", icon: "tv", status: "active", type: "main", productCount: 1, displayOrder: 12 },
    { id: 13, name: "Monitors", slug: "monitors", icon: "desktop_windows", status: "active", type: "main", productCount: 1, displayOrder: 13 },
    { id: 14, name: "Storage", slug: "storage", icon: "sd_storage", status: "active", type: "main", productCount: 1, displayOrder: 14 },
    { id: 15, name: "Smart Home", slug: "smart-home", icon: "home", status: "active", type: "main", productCount: 1, displayOrder: 15 }
];

// Storage Helper Functions
class StorageManager {
    static initStorage() {
        // Initialize products in localStorage if empty
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
        }
        
        // Initialize categories in localStorage if empty
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
        }
        
        // Initialize inventory history if empty
        if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_HISTORY)) {
            localStorage.setItem(STORAGE_KEYS.INVENTORY_HISTORY, JSON.stringify([]));
        }
    }
    
    static getProducts() {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        return products.map(product => ({
            ...product,
            status: product.stock > 20 ? 'instock' : product.stock > 0 ? 'lowstock' : 'outstock'
        }));
    }
    
    static saveProducts(products) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
    
    static getCategories() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    }
    
    static saveCategories(categories) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    
    static getInventoryHistory() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY_HISTORY)) || [];
    }
    
    static saveInventoryHistory(history) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY_HISTORY, JSON.stringify(history));
    }
    
    static getNextProductId() {
        const products = this.getProducts();
        return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }
    
    static getNextCategoryId() {
        const categories = this.getCategories();
        return categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    }
}

// Pagination variables
let currentPage = 1;
const productsPerPage = 10;

// Products functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    const modal = document.getElementById('addProductModal');
    const openModalBtn = document.getElementById('openAddProduct');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const viewModal = document.getElementById('viewProductModal');
    const closeViewModalBtn = document.getElementById('closeViewModal');
    const closeViewBtn = document.getElementById('closeViewBtn');
    
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveText = document.getElementById('saveText');
    const saveIcon = document.getElementById('saveIcon');
    
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const tableBody = document.getElementById('tableBody');
    const productCount = document.getElementById('productCount');
    const productCategorySelect = document.getElementById('productCategory');
    const paginationNav = document.getElementById('paginationNav');

    let uploadedImages = [];
    let currentProducts = [];
    let filteredProducts = [];
    let isEditing = false;
    let editingProductId = null;
    
    // Initialize storage and data
    StorageManager.initStorage();
    initializePage();
    
    // Function to initialize the page
    function initializePage() {
        // Get data from localStorage
        const products = StorageManager.getProducts();
        const categories = StorageManager.getCategories();
        
        // Populate category dropdowns
        populateCategoryDropdowns(categories);
        
        // Set current products and render
        currentProducts = [...products];
        filteredProducts = [...products];
        renderProducts();
    }
    
    // Function to populate category dropdowns
    function populateCategoryDropdowns(categories) {
        // Clear existing options
        productCategorySelect.innerHTML = '<option value="">Select Category</option>';
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Add active categories to both dropdowns
        categories
            .filter(cat => cat.status === 'active')
            .forEach(category => {
                const option1 = document.createElement('option');
                option1.value = category.slug;
                option1.textContent = category.name;
                productCategorySelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = category.slug;
                option2.textContent = category.name;
                categoryFilter.appendChild(option2);
            });
    }
    
    // Function to open sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden', 'opacity-0');
        sidebarOverlay.classList.add('block', 'opacity-100');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.remove('block', 'opacity-100');
        sidebarOverlay.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
    }
    
    // Function to open modal (add or edit)
    function openModal(product = null) {
        if (product) {
            // Edit mode
            isEditing = true;
            editingProductId = product.id;
            modalTitle.textContent = 'Edit Product';
            saveText.textContent = 'Update Product';
            
            // Fill form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productBrand').value = product.brand;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productSku').value = product.sku;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productSalesCount').value = product.salesCount || 0;
            document.getElementById('productFeatures').value = product.features || '';
            document.getElementById('productSpecs').value = product.specs || '';
            document.getElementById('productFeatured').checked = product.featured || false;
            
            // Handle image
            if (product.image) {
                uploadedImages = [{
                    name: 'product-image.jpg',
                    data: product.image,
                    size: 0.5
                }];
                updateImagePreview();
            }
        } else {
            // Add mode
            isEditing = false;
            editingProductId = null;
            modalTitle.textContent = 'Add New Product';
            saveText.textContent = 'Create Product';
            
            // Reset form
            resetForm();
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to open view modal
    function openViewModal(product) {
        // Set basic information
        document.getElementById('viewProductImage').src = product.image;
        document.getElementById('viewProductImage').alt = product.name;
        document.getElementById('viewModalTitle').textContent = product.name;
        document.getElementById('viewModalSubtitle').textContent = `SKU: ${product.sku}`;
        document.getElementById('viewProductName').textContent = product.name;
        document.getElementById('viewProductSku').textContent = product.sku;
        document.getElementById('viewProductBrand').textContent = product.brand;
        document.getElementById('viewProductCategory').textContent = getCategoryName(product.category);
        document.getElementById('viewProductPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('viewProductStock').textContent = product.stock;
        document.getElementById('viewProductSales').textContent = product.salesCount || 0;
        document.getElementById('viewProductDescription').textContent = product.description || 'No description available';
        
        // Set status badge
        const statusBadge = document.getElementById('viewStatusBadge');
        statusBadge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(product.status)}`;
        statusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${getStatusDotClass(product.status)} mr-1.5"></span>${getStatusText(product.status)}`;
        
        // Set features
        const featuresList = document.getElementById('viewProductFeatures');
        featuresList.innerHTML = '';
        if (product.features) {
            const features = product.features.split('\n').filter(f => f.trim());
            features.forEach(feature => {
                const li = document.createElement('li');
                li.className = 'flex items-start gap-2';
                li.innerHTML = `<span class="material-symbols-outlined text-primary text-[16px] mt-0.5">check</span><span>${feature.trim()}</span>`;
                featuresList.appendChild(li);
            });
        } else {
            featuresList.innerHTML = '<li class="text-slate-400">No features listed</li>';
        }
        
        // Set specifications
        const specsDiv = document.getElementById('viewProductSpecs');
        specsDiv.innerHTML = '';
        if (product.specs) {
            const specs = product.specs.split('\n').filter(s => s.trim());
            specs.forEach(spec => {
                const [key, ...valueParts] = spec.split(':');
                if (key && valueParts.length > 0) {
                    const div = document.createElement('div');
                    div.className = 'grid grid-cols-3 gap-2 py-1 border-b border-slate-100 last:border-0';
                    div.innerHTML = `
                        <span class="font-medium text-slate-700">${key.trim()}</span>
                        <span class="col-span-2 text-slate-600">${valueParts.join(':').trim()}</span>
                    `;
                    specsDiv.appendChild(div);
                }
            });
        } else {
            specsDiv.innerHTML = '<div class="text-slate-400">No specifications listed</div>';
        }
        
        // Set product flags
        document.getElementById('viewProductFeatured').classList.toggle('hidden', !product.featured);
        
        // Check if it's a latest product (created in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isLatest = new Date(product.createdAt) > thirtyDaysAgo;
        document.getElementById('viewProductLatest').classList.toggle('hidden', !isLatest);
        
        // Check if it's a best seller (salesCount > 1000)
        const isBestSeller = (product.salesCount || 0) > 1000;
        document.getElementById('viewProductBestSeller').classList.toggle('hidden', !isBestSeller);
        
        viewModal.classList.remove('hidden');
        viewModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        resetForm();
        isEditing = false;
        editingProductId = null;
    }
    
    // Function to close view modal
    function closeViewModal() {
        viewModal.classList.remove('flex');
        viewModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Function to reset form
    function resetForm() {
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = '';
        document.getElementById('productBrand').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productSku').value = '';
        document.getElementById('productStock').value = '';
        document.getElementById('productSalesCount').value = '';
        document.getElementById('productFeatures').value = '';
        document.getElementById('productSpecs').value = '';
        document.getElementById('productFeatured').checked = false;
        imageUploadInput.value = '';
        imagePreview.innerHTML = '';
        uploadedImages = [];
    }
    
    // Function to render products table with pagination
    function renderProducts() {
        tableBody.innerHTML = '';
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
        const currentProductsPage = filteredProducts.slice(startIndex, endIndex);
        
        currentProductsPage.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50 transition-colors group';
            row.innerHTML = `
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div class="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img alt="${product.name}" class="h-full w-full object-cover" src="${product.image}"/>
                    </div>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-slate-900">${product.name}</div>
                    <div class="text-slate-500 text-xs mt-0.5">SKU: ${product.sku}</div>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-slate-600">
                    ${getCategoryName(product.category)}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    $${product.price.toFixed(2)}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(product.status)}">
                        <span class="w-1.5 h-1.5 rounded-full ${getStatusDotClass(product.status)} mr-1.5"></span>
                        ${getStatusText(product.status)}
                    </span>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="text-slate-400 hover:text-primary transition-colors p-1 view-btn" data-id="${product.id}" title="View">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button class="text-slate-400 hover:text-primary transition-colors p-1 edit-btn" data-id="${product.id}" title="Edit">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button class="text-slate-400 hover:text-rose-500 transition-colors p-1 delete-btn" data-id="${product.id}" title="Delete">
                            <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update product count
        const totalProducts = StorageManager.getProducts().length;
        productCount.innerHTML = `Showing <span class="font-medium">${startIndex + 1}</span> to <span class="font-medium">${endIndex}</span> of <span class="font-medium">${filteredProducts.length}</span> results`;
        
        // Render pagination
        renderPagination(totalPages);
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const product = StorageManager.getProducts().find(p => p.id === id);
                if (product) {
                    openViewModal(product);
                }
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const product = StorageManager.getProducts().find(p => p.id === id);
                if (product) {
                    openModal(product);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteProduct(id);
            });
        });
    }
    
    // Function to render pagination
    function renderPagination(totalPages) {
        paginationNav.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevButton = document.createElement('a');
        prevButton.href = '#';
        prevButton.className = 'relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50';
        prevButton.innerHTML = '<span class="sr-only">Previous</span><span class="material-symbols-outlined text-[20px]">chevron_left</span>';
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
        paginationNav.appendChild(prevButton);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const pageButton = document.createElement('a');
                pageButton.href = '#';
                pageButton.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage ? 'z-10 bg-primary border-primary text-white' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`;
                pageButton.textContent = i;
                pageButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderProducts();
                });
                paginationNav.appendChild(pageButton);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700';
                ellipsis.textContent = '...';
                paginationNav.appendChild(ellipsis);
            }
        }
        
        // Next button
        const nextButton = document.createElement('a');
        nextButton.href = '#';
        nextButton.className = 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50';
        nextButton.innerHTML = '<span class="sr-only">Next</span><span class="material-symbols-outlined text-[20px]">chevron_right</span>';
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
        paginationNav.appendChild(nextButton);
    }
    
    // Helper function to get category name
    function getCategoryName(slug) {
        const categories = StorageManager.getCategories();
        const category = categories.find(c => c.slug === slug);
        return category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1);
    }
    
    // Helper functions for status display
    function getStatusClass(status) {
        switch(status) {
            case 'instock': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'lowstock': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'outstock': return 'bg-rose-100 text-rose-800 border border-rose-200';
            default: return 'bg-slate-100 text-slate-800 border border-slate-200';
        }
    }
    
    function getStatusDotClass(status) {
        switch(status) {
            case 'instock': return 'bg-emerald-500';
            case 'lowstock': return 'bg-amber-500';
            case 'outstock': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    }
    
    function getStatusText(status) {
        switch(status) {
            case 'instock': return 'In Stock';
            case 'lowstock': return 'Low Stock';
            case 'outstock': return 'Out of Stock';
            default: return 'Unknown';
        }
    }
    
    // Function to filter products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const stock = stockFilter.value;
        const products = StorageManager.getProducts();
        
        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.sku.toLowerCase().includes(searchTerm) ||
                                 product.brand.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            const matchesStock = !stock || product.status === stock;
            
            return matchesSearch && matchesCategory && matchesStock;
        });
        
        // Reset to first page when filtering
        currentPage = 1;
        renderProducts();
    }
    
    // Function to save product (add or update)
    function saveProduct() {
        const productName = document.getElementById('productName').value.trim();
        const productCategory = document.getElementById('productCategory').value;
        const productBrand = document.getElementById('productBrand').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productPrice = document.getElementById('productPrice').value;
        const productSku = document.getElementById('productSku').value.trim().toUpperCase();
        const productStock = document.getElementById('productStock').value;
        const productSalesCount = document.getElementById('productSalesCount').value;
        const productFeatures = document.getElementById('productFeatures').value.trim();
        const productSpecs = document.getElementById('productSpecs').value.trim();
        const productFeatured = document.getElementById('productFeatured').checked;
        
        // Basic validation
        if (!productName || !productCategory || !productBrand || !productPrice || !productSku || productStock === '') {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (parseFloat(productPrice) <= 0) {
            showNotification('Price must be greater than 0', 'error');
            return;
        }
        
        if (parseInt(productStock) < 0) {
            showNotification('Stock quantity cannot be negative', 'error');
            return;
        }
        
        if (parseInt(productSalesCount) < 0) {
            showNotification('Sales count cannot be negative', 'error');
            return;
        }
        
        // Check for duplicate SKU when adding new product
        if (!isEditing) {
            const existingProducts = StorageManager.getProducts();
            if (existingProducts.some(p => p.sku === productSku)) {
                showNotification('SKU already exists. Please use a unique SKU.', 'error');
                return;
            }
        }
        
        // Show loading state
        const originalIcon = saveIcon.innerHTML;
        saveIcon.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>';
        saveProductBtn.disabled = true;
        
        setTimeout(() => {
            const products = StorageManager.getProducts();
            
            if (isEditing) {
                // Update existing product
                const index = products.findIndex(p => p.id === editingProductId);
                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        name: productName,
                        category: productCategory,
                        brand: productBrand,
                        description: productDescription,
                        price: parseFloat(productPrice),
                        sku: productSku,
                        stock: parseInt(productStock),
                        status: productStock > 20 ? 'instock' : productStock > 0 ? 'lowstock' : 'outstock',
                        image: uploadedImages.length > 0 ? uploadedImages[0].data : products[index].image,
                        salesCount: parseInt(productSalesCount) || 0,
                        features: productFeatures,
                        specs: productSpecs,
                        featured: productFeatured
                    };
                }
            } else {
                // Add new product
                const newProduct = {
                    id: StorageManager.getNextProductId(),
                    name: productName,
                    sku: productSku,
                    category: productCategory,
                    brand: productBrand,
                    price: parseFloat(productPrice),
                    stock: parseInt(productStock),
                    status: productStock > 20 ? 'instock' : productStock > 0 ? 'lowstock' : 'outstock',
                    image: uploadedImages.length > 0 ? uploadedImages[0].data : 'https://via.placeholder.com/150?text=Product',
                    description: productDescription,
                    features: productFeatures,
                    specs: productSpecs,
                    featured: productFeatured,
                    salesCount: parseInt(productSalesCount) || 0,
                    createdAt: new Date().toISOString()
                };
                
                products.unshift(newProduct);
            }
            
            // Save to localStorage
            StorageManager.saveProducts(products);
            
            // Update UI
            filterProducts();
            closeModal();
            
            // Reset loading state
            saveIcon.innerHTML = originalIcon;
            saveProductBtn.disabled = false;
            
            showNotification(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        }, 1000);
    }
    
    // Function to delete product
    function deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }
        
        const products = StorageManager.getProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index > -1) {
            products.splice(index, 1);
            StorageManager.saveProducts(products);
            filterProducts();
            showNotification('Product deleted successfully!');
        }
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Function to handle image upload
    function handleImageUpload(files) {
        for (let file of files) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                continue;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2),
                    data: e.target.result
                };
                
                uploadedImages.push(imageData);
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Function to update image preview
    function updateImagePreview() {
        imagePreview.innerHTML = '';
        
        uploadedImages.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50';
            previewItem.innerHTML = `
                <div class="w-10 h-10 rounded-md bg-slate-200 flex-shrink-0 overflow-hidden">
                    <img src="${image.data}" alt="${image.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-slate-900 truncate">${image.name}</p>
                    <p class="text-[10px] text-slate-500">${image.size} MB</p>
                </div>
                <button class="text-slate-400 hover:text-rose-500 p-1 remove-image-btn" data-index="${index}">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            `;
            imagePreview.appendChild(previewItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-image-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                uploadedImages.splice(index, 1);
                updateImagePreview();
            });
        });
    }
    
    // Event listeners for sidebar
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Event listeners for modal
    openModalBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveProductBtn.addEventListener('click', saveProduct);
    
    // Event listeners for view modal
    closeViewModalBtn.addEventListener('click', closeViewModal);
    closeViewBtn.addEventListener('click', closeViewModal);
    
    // Event listener for image upload
    imageUploadArea.addEventListener('click', () => imageUploadInput.click());
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('border-primary', 'bg-blue-50');
    });
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('border-primary', 'bg-blue-50');
    });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('border-primary', 'bg-blue-50');
        handleImageUpload(e.dataTransfer.files);
    });
    imageUploadInput.addEventListener('change', (e) => {
        handleImageUpload(e.target.files);
    });
    
    // Event listeners for filtering
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    stockFilter.addEventListener('change', filterProducts);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnOpenBtn = openSidebarBtn.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnOpenBtn && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
            closeSidebar();
        }
    });
    
    // Close modals when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    viewModal.addEventListener('click', function(event) {
        if (event.target === viewModal) {
            closeViewModal();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            // On large screens, ensure sidebar is visible
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        } else {
            // On small screens, hide sidebar by default
            if (!sidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        }
    });
    
    // Handle escape key for closing modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
            if (!viewModal.classList.contains('hidden')) {
                closeViewModal();
            }
            if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                closeSidebar();
            }
        }
    });
});