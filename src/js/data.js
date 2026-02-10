/**
 * Go Gadgets — Shared Product Data
 */
const PRODUCTS = {
    1: {
        id: 1, name: 'SonicPro X1 Noise Cancelling Headphones', subtitle: 'Immersive Sound',
        category: 'Audio', badge: 'New', price: 299,
        description: 'Experience studio-quality sound with the SonicPro X1. Featuring industry-leading active noise cancellation, 40mm custom drivers, and 30-hour battery life. Seamlessly switch between devices with multipoint Bluetooth 5.3.',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Matte Black', value: '#1a1a2e' },
            { name: 'Silver', value: '#c0c0c0' },
            { name: 'Midnight Blue', value: '#191970' },
        ],
        specs: { 'Driver Size': '40mm', 'Frequency Response': '4Hz–40kHz', 'Battery Life': '30 hours', 'Bluetooth': '5.3', 'Noise Cancelling': 'Active (Adaptive)', 'Weight': '250g', 'Charging': 'USB-C, 3min = 3hrs', 'Codec Support': 'LDAC, AAC, SBC' },
        features: [
            { icon: 'headphones', title: '40mm Drivers', detail: 'Premium audio clarity' },
            { icon: 'battery_full', title: '30hr Battery', detail: 'All-day listening' },
        ],
    },
    2: {
        id: 2, name: 'Horizon Watch Ultra Titanium', subtitle: 'Built for Adventure',
        category: 'Wearables', badge: '', price: 399,
        description: 'The most rugged and capable smartwatch yet. Precision dual-frequency GPS, 100m water resistance, and up to 36 hours of battery life. Titanium case with sapphire front crystal.',
        images: [
            'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Natural Titanium', value: '#b8b0a2' },
            { name: 'Orange Alpine', value: '#ff6b2c' },
        ],
        specs: { 'Case Size': '49mm', 'Case Material': 'Titanium', 'Display': 'LTPO OLED Always-On', 'Water Resistance': '100m / EN 13319', 'Battery Life': 'Up to 36 hours', 'GPS': 'Dual-frequency L1/L5', 'Storage': '32GB', 'Weight': '61.3g' },
        features: [
            { icon: 'explore', title: 'Dual GPS', detail: 'Precision L1 and L5 frequencies' },
            { icon: 'water_drop', title: '100m Water', detail: 'Dive-ready WR100' },
        ],
    },
    3: {
        id: 3, name: 'Lumina X5 Mirrorless Camera', subtitle: 'Pro-Grade Imaging',
        category: 'Photography', badge: '', price: 1299,
        description: 'Capture breathtaking photos and 4K video with the 61MP full-frame sensor. Advanced AI autofocus tracks subjects with pinpoint accuracy. Weather-sealed magnesium alloy body.',
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
        ],
        specs: { 'Sensor': '61MP Full-Frame CMOS', 'ISO Range': '100–51200 (expanded: 50–204800)', 'Video': '4K 120fps / 8K 30fps', 'Autofocus': '759-point AI Phase Detection', 'Stabilization': '5-axis IBIS (7 stops)', 'Viewfinder': '9.44M-dot OLED EVF', 'Card Slots': 'Dual CFexpress Type A/SD', 'Weight': '657g (body only)' },
        features: [
            { icon: 'photo_camera', title: '61MP Sensor', detail: 'Full-frame CMOS resolution' },
            { icon: 'slow_motion_video', title: '4K 120fps', detail: 'Cinema-grade video' },
        ],
    },
    4: {
        id: 4, name: 'SkyStream Air 2 Pro Combo', subtitle: 'Fly Further',
        category: 'Drones', badge: 'New', price: 799,
        description: 'Ultra-portable, foldable drone with a 1-inch CMOS sensor for stunning 5.4K video. 46-minute flight time, omnidirectional obstacle sensing, and ActiveTrack 5.0.',
        images: [
            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Gray', value: '#808080' },
        ],
        specs: { 'Camera Sensor': '1-inch CMOS 20MP', 'Video Resolution': '5.4K/30fps, 4K/120fps', 'Max Flight Time': '46 minutes', 'Max Range': '12 km (FCC)', 'Obstacle Sensing': 'Omnidirectional', 'Max Speed': '21 m/s (S Mode)', 'Weight': '249g (< reg. limit)', 'Internal Storage': '8GB' },
        features: [
            { icon: 'videocam', title: '5.4K Camera', detail: '1-inch CMOS sensor' },
            { icon: 'flight', title: '46min Flight', detail: 'Extended battery life' },
        ],
    },
    5: {
        id: 5, name: 'NovaBook Air 15-inch M3', subtitle: 'Strikingly Thin',
        category: 'Computers', badge: '', price: 1499,
        description: 'The world\'s thinnest 15-inch laptop. Powered by the M3 chip for lightning performance and 18-hour battery. Liquid Retina display, six-speaker sound system, and MagSafe charging.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Midnight', value: '#1a1a2e' },
            { name: 'Starlight', value: '#f5e6d3' },
            { name: 'Silver', value: '#c0c0c0' },
        ],
        storage: [
            { size: '256GB', label: 'Base Price', extra: 0 },
            { size: '512GB', label: '+$200', extra: 200 },
            { size: '1TB', label: '+$400', extra: 400 },
        ],
        specs: { 'Chip': 'M3 (8-core CPU, 10-core GPU)', 'Memory': '8GB Unified', 'Display': '15.3" Liquid Retina, 500 nits', 'Battery Life': 'Up to 18 hours', 'Weight': '1.51 kg', 'Ports': '2x Thunderbolt/USB 4, MagSafe 3', 'Audio': '6-speaker system with Spatial Audio', 'Camera': '1080p FaceTime HD' },
        features: [
            { icon: 'memory', title: 'M3 Chip', detail: 'Next-gen performance' },
            { icon: 'battery_full', title: '18hr Battery', detail: 'All-day power' },
        ],
    },
    6: {
        id: 6, name: 'Oculus Vision Pro', subtitle: 'Welcome to Spatial Computing',
        category: 'Gaming', badge: '', price: 499,
        description: 'Step into a new dimension. The Vision Pro blends digital content with your physical world using advanced passthrough and spatial computing. Micro-OLED displays, eye tracking, and hand gesture control.',
        images: [
            'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Display': 'Dual Micro-OLED (23M pixels total)', 'Chip': 'M2 + R1', 'Audio': 'Spatial Audio with dual-driver pods', 'Tracking': 'Eye, hand, and head tracking', 'Passthrough': 'Stereoscopic 3D (12 cameras)', 'Field of View': '100°+', 'Storage': '256GB', 'Battery': 'External, 2 hours' },
        features: [
            { icon: 'visibility', title: 'Eye Tracking', detail: 'Navigate with your eyes' },
            { icon: 'pan_tool', title: 'Gesture Control', detail: 'Hands-free interaction' },
        ],
    },
    7: {
        id: 7, name: 'BassBoom Mini Speaker', subtitle: 'Big Sound, Small Package',
        category: 'Audio', badge: '', price: 89,
        description: 'Take your music anywhere with the ultra-portable BassBoom Mini. IP67 waterproof and dustproof rating, 20-hour battery, and powerful bass radiator that defies its compact size.',
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
            { name: 'Red', value: '#e53e3e' },
            { name: 'Teal', value: '#38b2ac' },
        ],
        specs: { 'Speaker Output': '5W', 'Frequency Range': '80Hz–20kHz', 'Battery Life': '20 hours', 'Water Rating': 'IP67', 'Bluetooth': '5.3', 'Weight': '180g', 'Dimensions': '7.5 × 7.5 × 4.1 cm', 'Charging': 'USB-C' },
        features: [
            { icon: 'water_drop', title: 'IP67 Rated', detail: 'Waterproof & dustproof' },
            { icon: 'battery_full', title: '20hr Battery', detail: 'Party all day' },
        ],
    },
    8: {
        id: 8, name: 'Tactile Pro Mechanical Keyboard', subtitle: 'Type with Precision',
        category: 'Accessories', badge: '', price: 149,
        description: 'Premium low-profile mechanical keyboard with tactile switches. Per-key RGB, USB-C / Bluetooth, programmable macros, and aircraft-grade aluminum frame. Works across desktop and mobile.',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Space Gray', value: '#4a5568' },
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Switch Type': 'Low-profile Tactile', 'Layout': 'Full-size (104 keys)', 'Connectivity': 'USB-C / Bluetooth 5.1', 'Battery Life': '200 hours (backlight off)', 'Backlight': 'Per-key RGB', 'Frame': 'Aluminum alloy', 'Key Travel': '1.5mm', 'Weight': '810g' },
        features: [
            { icon: 'keyboard', title: 'Tactile Switches', detail: 'Satisfying key feel' },
            { icon: 'bluetooth', title: 'Multi-Device', detail: 'Switch up to 3 devices' },
        ],
    },
    9: {
        id: 9, name: 'Tab Ultra 11-inch', subtitle: 'Your Canvas, Unleashed',
        category: 'Computers', badge: '', price: 599,
        description: 'The most powerful Android tablet. 11-inch 120Hz AMOLED display, S Pen included, Snapdragon 8 Gen 2 chipset, and DeX desktop mode. Perfect for creativity and productivity.',
        images: [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Graphite', value: '#4a5568' },
            { name: 'Beige', value: '#d4c5a9' },
        ],
        storage: [
            { size: '128GB', label: 'Base Price', extra: 0 },
            { size: '256GB', label: '+$80', extra: 80 },
            { size: '512GB', label: '+$200', extra: 200 },
        ],
        specs: { 'Display': '11" AMOLED 120Hz, 2560×1600', 'Chip': 'Snapdragon 8 Gen 2', 'RAM': '8GB / 12GB', 'Camera': '13MP + 8MP Ultra-wide', 'Battery': '8400mAh (45W charging)', 'S Pen': 'Included, 2.8ms latency', 'Audio': 'Quad speakers (AKG)', 'Weight': '503g' },
        features: [
            { icon: 'draw', title: 'S Pen Included', detail: '2.8ms ultra-low latency' },
            { icon: 'desktop_windows', title: 'DeX Mode', detail: 'Desktop experience' },
        ],
    },
    10: {
        id: 10, name: 'iPhone 15 Pro Max', subtitle: 'Titanium. So Strong. So Light.',
        category: 'Smartphones', badge: 'New', price: 1199,
        description: 'Forged in titanium, the iPhone 15 Pro Max features a 48MP camera system with 5x optical zoom, A17 Pro chip with hardware ray tracing, and Action button for instant access to your favorite feature.',
        images: [
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop',
        ],
        models: [
            { name: 'iPhone 15 Pro', detail: '6.1-inch display', price: 999, monthly: 41.62 },
            { name: 'iPhone 15 Pro Max', detail: '6.7-inch display', price: 1199, monthly: 49.95 },
        ],
        colors: [
            { name: 'Natural Titanium', value: '#b8b0a2' },
            { name: 'Blue Titanium', value: '#394e6a' },
            { name: 'White Titanium', value: '#e8e5e0' },
            { name: 'Black Titanium', value: '#2d2d2d' },
        ],
        storage: [
            { size: '256GB', label: 'Base Price', extra: 0 },
            { size: '512GB', label: '+$200', extra: 200 },
            { size: '1TB', label: '+$400', extra: 400 },
        ],
        specs: { 'Chip': 'A17 Pro (3nm, 6-core)', 'Display': '6.7" Super Retina XDR OLED, 2796×1290', 'Camera': '48MP Main + 12MP UW + 12MP 5x Tele', 'Battery': 'Up to 29 hours video playback', 'Material': 'Grade 5 Titanium', 'Storage': '256GB / 512GB / 1TB', 'Connectivity': '5G, Wi-Fi 6E, UWB 2 chip', 'Weight': '221g' },
        features: [
            { icon: 'photo_camera', title: '48MP Camera', detail: '5x optical zoom, ProRAW' },
            { icon: 'memory', title: 'A17 Pro Chip', detail: '3nm, hardware ray tracing' },
        ],
    },
    11: {
        id: 11, name: 'Galaxy S24 Ultra', subtitle: 'The Ultimate Galaxy Experience',
        category: 'Smartphones', badge: '', price: 1099,
        description: 'Meet Galaxy AI. The S24 Ultra with Snapdragon 8 Gen 3, titanium frame, 200MP camera, and integrated S Pen. Live Translate, Circle to Search, and AI-powered photo editing.',
        images: [
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Titanium Gray', value: '#6b7280' },
            { name: 'Titanium Yellow', value: '#d4a843' },
            { name: 'Titanium Violet', value: '#7c3aed' },
            { name: 'Titanium Black', value: '#1f2937' },
        ],
        storage: [
            { size: '256GB', label: 'Base Price', extra: 0 },
            { size: '512GB', label: '+$120', extra: 120 },
            { size: '1TB', label: '+$360', extra: 360 },
        ],
        specs: { 'Chip': 'Snapdragon 8 Gen 3 for Galaxy', 'Display': '6.8" Dynamic AMOLED 2X, 3120×1440', 'Camera': '200MP + 12MP UW + 10MP 3x + 50MP 5x', 'Battery': '5000mAh (45W wired)', 'Frame': 'Titanium Grade 4', 'S Pen': 'Integrated', 'AI Features': 'Live Translate, Circle to Search', 'Weight': '232g' },
        features: [
            { icon: 'auto_awesome', title: 'Galaxy AI', detail: 'Smart features everywhere' },
            { icon: 'camera_enhance', title: '200MP Camera', detail: 'Ultra-high resolution' },
        ],
    },
    12: {
        id: 12, name: 'AirPods Pro 3', subtitle: 'Intelligent Sound',
        category: 'Audio', badge: 'New', price: 249,
        description: 'Next-generation AirPods Pro with H2 chip. 2x more noise cancellation, Adaptive Transparency, Personalized Spatial Audio, and up to 6 hours of listening time.',
        images: [
            'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Chip': 'H2', 'ANC': '2x more active noise cancellation', 'Transparency': 'Adaptive Transparency', 'Audio': 'Personalized Spatial Audio with head tracking', 'Battery': '6 hrs (30 hrs with case)', 'Water Rating': 'IPX4 (earbuds & case)', 'Connector': 'USB-C / MagSafe', 'Weight': '5.3g per earbud' },
        features: [
            { icon: 'noise_aware', title: '2x ANC', detail: 'H2-powered cancellation' },
            { icon: 'spatial_audio', title: 'Spatial Audio', detail: 'Personalized 3D sound' },
        ],
    },
    13: {
        id: 13, name: 'Galaxy Buds3 Pro', subtitle: 'Sound Reinvented',
        category: 'Audio', badge: 'New', price: 229,
        description: 'Premium earbuds with 2-way speakers, Ultra High Quality Audio, and AI-enhanced ANC. Blade lights design, 360 Audio, and seamless Galaxy ecosystem integration.',
        images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Silver', value: '#c0c0c0' },
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Drivers': '2-way (10.5mm woofer + 6.1mm planar tweeter)', 'ANC': 'AI-enhanced Adaptive ANC', 'Audio': 'Ultra High Quality Audio (24bit/96kHz)', 'Battery': '7 hrs (30 hrs with case)', 'Water Rating': 'IP57', 'Bluetooth': '5.4 LE Audio', 'Codec': 'Samsung Seamless, SSC HiFi', 'Weight': '5.4g per earbud' },
        features: [
            { icon: 'graphic_eq', title: '2-Way Speaker', detail: 'Woofer + planar tweeter' },
            { icon: 'hearing', title: 'AI ANC', detail: 'Adaptive noise control' },
        ],
    },
    14: {
        id: 14, name: 'MacBook Pro 16-inch M3', subtitle: 'Scary Fast',
        category: 'Computers', badge: '', price: 2499,
        description: 'The most powerful MacBook Pro ever. M3 Pro or M3 Max chip, 16-inch Liquid Retina XDR display, 22-hour battery, and up to 128GB unified memory for pro-level performance.',
        images: [
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Space Black', value: '#1a1a2e' },
            { name: 'Silver', value: '#c0c0c0' },
        ],
        storage: [
            { size: '512GB', label: 'Base Price', extra: 0 },
            { size: '1TB', label: '+$200', extra: 200 },
            { size: '2TB', label: '+$600', extra: 600 },
        ],
        specs: { 'Chip': 'M3 Pro (12-core CPU, 18-core GPU)', 'Memory': '18GB Unified (up to 128GB)', 'Display': '16.2" Liquid Retina XDR, 3456×2234', 'Battery': 'Up to 22 hours', 'Ports': '3x Thunderbolt 4, SDXC, HDMI, MagSafe', 'Audio': '6-speaker with force-cancelling woofers', 'Camera': '1080p + Center Stage', 'Weight': '2.14 kg' },
        features: [
            { icon: 'speed', title: 'M3 Pro Chip', detail: '12-core CPU, 18-core GPU' },
            { icon: 'display_settings', title: 'XDR Display', detail: '1600 nits peak HDR' },
        ],
    },
    15: {
        id: 15, name: 'DJI Mini 4 Pro', subtitle: 'Mini Drone, Mega Performance',
        category: 'Drones', badge: '', price: 759,
        description: 'Under 249g for registration-free flight in most regions. 4K/60fps HDR video, 48MP photos, omnidirectional obstacle sensing, and ActiveTrack 360° subject tracking.',
        images: [
            'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Gray', value: '#808080' },
        ],
        specs: { 'Camera': '1/1.3" CMOS, 48MP', 'Video': '4K/60fps HDR, Slow-mo 4K/100fps', 'Max Flight Time': '34 minutes', 'Max Range': '20 km (FCC)', 'Obstacle Sensing': 'Omnidirectional', 'Weight': '249g', 'Wind Resistance': 'Level 5 (29–38 km/h)', 'Internal Storage': 'None (microSD up to 512GB)' },
        features: [
            { icon: 'flight', title: 'Under 249g', detail: 'No registration required' },
            { icon: 'track_changes', title: 'ActiveTrack 360°', detail: 'Intelligent tracking' },
        ],
    },
    16: {
        id: 16, name: 'Sony WH-1000XM5', subtitle: 'Industry-Leading ANC',
        category: 'Audio', badge: '', price: 349,
        description: 'Sony\'s flagship noise-cancelling headphones. Eight microphones and two processors deliver unprecedented noise cancellation. 30-hour battery and crystal-clear calls.',
        images: [
            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
            { name: 'Silver', value: '#c0c0c0' },
            { name: 'Midnight Blue', value: '#191970' },
        ],
        specs: { 'Driver': '30mm, carbon fiber composite', 'ANC': '8 microphones, 2 processors (V1, QN1)', 'Battery': '30 hours (ANC on)', 'Bluetooth': '5.2 (LDAC, AAC, SBC)', 'Quick Charge': '3 min = 3 hours', 'Weight': '250g', 'Speak-to-Chat': 'Built-in', 'Multipoint': 'Yes (2 devices)' },
        features: [
            { icon: 'noise_control_off', title: '8-Mic ANC', detail: 'Auto NC Optimizer' },
            { icon: 'call', title: 'Crystal Calls', detail: 'AI-based noise reduction' },
        ],
    },
    17: {
        id: 17, name: 'iPad Pro 12.9-inch M2', subtitle: 'Supercharged by M2',
        category: 'Computers', badge: '', price: 1099,
        description: 'The ultimate iPad experience. M2 chip, Liquid Retina XDR display with ProMotion, Apple Pencil hover, and Thunderbolt connectivity. Pro features in a portable form factor.',
        images: [
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Space Gray', value: '#4a5568' },
            { name: 'Silver', value: '#c0c0c0' },
        ],
        storage: [
            { size: '128GB', label: 'Base Price', extra: 0 },
            { size: '256GB', label: '+$100', extra: 100 },
            { size: '512GB', label: '+$300', extra: 300 },
            { size: '1TB', label: '+$700', extra: 700 },
        ],
        specs: { 'Chip': 'M2 (8-core CPU, 10-core GPU)', 'Display': '12.9" Liquid Retina XDR, 2732×2048', 'Camera': '12MP Wide + 10MP Ultra Wide + LiDAR', 'Battery': 'Up to 10 hours', 'Connector': 'Thunderbolt / USB 4', 'Apple Pencil': '2nd gen (hover support)', 'Face ID': 'Yes', 'Weight': '682g' },
        features: [
            { icon: 'draw', title: 'Apple Pencil Hover', detail: 'Preview before you mark' },
            { icon: 'bolt', title: 'Thunderbolt', detail: 'Pro-level connectivity' },
        ],
    },
    18: {
        id: 18, name: 'Logitech MX Master 3S', subtitle: 'Designed to Perform',
        category: 'Accessories', badge: '', price: 99,
        description: 'The iconic ergonomic mouse, refined. Quiet clicks, 8K DPI track-anywhere sensor, MagSpeed electromagnetic scroll wheel, and Flow cross-computer control. Works on any surface.',
        images: [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Graphite', value: '#4a5568' },
            { name: 'Pale Gray', value: '#d1d5db' },
        ],
        specs: { 'Sensor': 'Darkfield 8000 DPI', 'Buttons': '7 (programmable)', 'Scroll Wheel': 'MagSpeed electromagnetic', 'Battery': '70 days (USB-C rechargeable)', 'Connectivity': 'Bluetooth / USB Bolt receiver', 'Flow': 'Cross-computer control (up to 3)', 'Weight': '141g', 'Quiet Clicks': 'Yes (90% noise reduction)' },
        features: [
            { icon: 'mouse', title: 'MagSpeed Scroll', detail: '1000 lines/sec precision' },
            { icon: 'devices', title: 'Flow Control', detail: 'Seamless multi-computer' },
        ],
    },
    19: {
        id: 19, name: 'Samsung Galaxy Watch 6', subtitle: 'Your Health Companion',
        category: 'Wearables', badge: '', price: 329,
        description: 'Monitor your health 24/7 with advanced BioActive sensor. Body composition analysis, sleep coaching, and heart rhythm tracking. Sapphire crystal display with rotating bezel.',
        images: [
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Graphite', value: '#4a5568' },
            { name: 'Silver', value: '#c0c0c0' },
            { name: 'Gold', value: '#d4a843' },
        ],
        specs: { 'Display': '1.5" Super AMOLED, 480×480', 'Chip': 'Exynos W930', 'Health Sensors': 'BioActive (Optical HR, ECG, BIA)', 'Battery': '425mAh (~40 hours)', 'Water Rating': '5ATM + IP68', 'OS': 'Wear OS 4 + One UI Watch', 'Storage': '16GB', 'Weight': '33.3g (without strap)' },
        features: [
            { icon: 'monitor_heart', title: 'BioActive Sensor', detail: 'ECG, HR, body composition' },
            { icon: 'bedtime', title: 'Sleep Coaching', detail: 'Advanced sleep analysis' },
        ],
    },
    20: {
        id: 20, name: 'Sony Alpha A7 IV', subtitle: 'The New Standard',
        category: 'Photography', badge: '', price: 2498,
        description: 'Next-generation 33MP full-frame hybrid camera. Real-time Eye AF for humans, animals, and birds. 4K 60p 10-bit video, 10fps burst, and 759-point phase-detect AF covering 94% of the frame.',
        images: [
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
        ],
        specs: { 'Sensor': '33MP Full-Frame Exmor R CMOS', 'ISO Range': '100–51200', 'Video': '4K/60p 10-bit 4:2:2, S-Cinetone', 'Autofocus': '759-point Real-time Eye AF', 'Burst': '10fps (AF/AE tracking)', 'Stabilization': '5.5-stop 5-axis IBIS', 'Viewfinder': '3.69M-dot OLED EVF', 'Weight': '658g (body only)' },
        features: [
            { icon: 'center_focus_strong', title: 'Real-time Eye AF', detail: 'Human, animal, bird' },
            { icon: 'movie', title: '4K 60p 10-bit', detail: 'Cinema-grade footage' },
        ],
    },
    21: {
        id: 21, name: 'Nintendo Switch OLED', subtitle: 'Play Anywhere',
        category: 'Gaming', badge: '', price: 349,
        description: 'The vibrant 7-inch OLED screen brings games to life. Enhanced audio, wide adjustable stand, 64GB internal storage, and wired LAN port for stable online play.',
        images: [
            'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Neon Red/Blue', value: '#e53e3e' },
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Display': '7" OLED (1280×720)', 'Storage': '64GB (expandable via microSD)', 'CPU/GPU': 'NVIDIA Custom Tegra', 'Battery': '4.5–9 hours', 'Audio': 'Enhanced stereo speakers', 'Dock': 'HDMI 2.0, LAN port, 2x USB', 'Joy-Con': 'Detachable wireless controllers', 'Weight': '420g (with Joy-Con)' },
        features: [
            { icon: 'tv', title: '7" OLED Display', detail: 'Vivid, rich colors' },
            { icon: 'sports_esports', title: '3 Play Modes', detail: 'TV, Tabletop, Handheld' },
        ],
    },
    22: {
        id: 22, name: 'Google Pixel 8 Pro', subtitle: 'The Best of Google',
        category: 'Smartphones', badge: '', price: 999,
        description: 'Powered by Google Tensor G3. Pro-level 50MP camera with Magic Eraser and Best Take. 7 years of OS and security updates guaranteed. AI-first phone experience.',
        images: [
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Obsidian', value: '#1a1a2e' },
            { name: 'Porcelain', value: '#f5f0e8' },
            { name: 'Bay', value: '#4a90a4' },
        ],
        storage: [
            { size: '128GB', label: 'Base Price', extra: 0 },
            { size: '256GB', label: '+$60', extra: 60 },
            { size: '512GB', label: '+$180', extra: 180 },
        ],
        specs: { 'Chip': 'Google Tensor G3', 'Display': '6.7" LTPO OLED, 2992×1344, 120Hz', 'Camera': '50MP + 48MP UW + 48MP 5x Tele', 'Battery': '5050mAh (30W wired)', 'Updates': '7 years OS + security', 'AI Features': 'Magic Eraser, Best Take, Gemini', 'Water Rating': 'IP68', 'Weight': '213g' },
        features: [
            { icon: 'auto_awesome', title: 'AI Photography', detail: 'Magic Eraser & Best Take' },
            { icon: 'update', title: '7 Years Updates', detail: 'Longest support ever' },
        ],
    },
    23: {
        id: 23, name: 'DJI Action 4', subtitle: 'Born for Adventure',
        category: 'Photography', badge: 'New', price: 399,
        description: 'Magnetic quick-release mount, 1/1.3" sensor for stunning 4K/120fps footage. 160-min battery, 18m waterproof (no case), and 155° ultra-wide FOV for immersive content.',
        images: [
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
        ],
        specs: { 'Sensor': '1/1.3" CMOS', 'Video': '4K/120fps, 4K HDR', 'Photo': '12MP', 'Waterproof': '18m (without case)', 'Battery': '160 minutes', 'FOV': '155° ultra-wide', 'Stabilization': 'RockSteady 3.0 + HorizonSteady', 'Weight': '145g' },
        features: [
            { icon: 'videocam', title: '4K/120fps', detail: '1/1.3" large sensor' },
            { icon: 'scuba_diving', title: '18m Waterproof', detail: 'No case required' },
        ],
    },
    24: {
        id: 24, name: 'Apple Watch Ultra 2', subtitle: 'Next-Level Adventure',
        category: 'Wearables', badge: '', price: 799,
        description: 'The most capable Apple Watch with S9 chip, precision dual-frequency GPS, 3000 nits peak brightness, and 72-hour battery in Low Power Mode. Built for extreme environments.',
        images: [
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Natural Titanium', value: '#b8b0a2' },
        ],
        specs: { 'Chip': 'S9 SiP (Double Tap gesture)', 'Display': '49mm LTPO2 OLED, 3000 nits', 'Case': 'Titanium, sapphire front crystal', 'Water Rating': 'WR100, EN 13319', 'Battery': '36 hrs (72 hrs Low Power)', 'GPS': 'Precision dual-frequency L1/L5', 'Siren': '86 dB siren for emergencies', 'Weight': '61.4g' },
        features: [
            { icon: 'brightness_high', title: '3000 nits', detail: 'Brightest Apple Watch' },
            { icon: 'explore', title: 'Wayfinder', detail: 'Custom adventure face' },
        ],
    },
    25: {
        id: 25, name: 'PS5 Slim Console', subtitle: 'Play Has No Limits',
        category: 'Gaming', badge: '', price: 449,
        description: 'The slimmest PS5 yet. 1TB SSD, 4K gaming at up to 120fps, ray tracing, Tempest 3D AudioTech, and DualSense wireless controller with haptic feedback and adaptive triggers.',
        images: [
            'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'CPU': 'AMD Zen 2 (8 cores, 3.5GHz)', 'GPU': 'AMD RDNA 2 (10.28 TFLOPs)', 'Storage': '1TB Custom SSD', 'RAM': '16GB GDDR6', 'Output': '4K/120fps, 8K, VRR, HDR', 'Audio': 'Tempest 3D AudioTech', 'Disc Drive': 'Ultra HD Blu-ray (detachable)', 'Weight': '3.2 kg' },
        features: [
            { icon: 'sports_esports', title: 'DualSense', detail: 'Haptic feedback & triggers' },
            { icon: 'speed', title: 'Custom SSD', detail: 'Near-instant loading' },
        ],
    },
    26: {
        id: 26, name: 'Logitech StreamCam', subtitle: 'Content Creator Essential',
        category: 'Accessories', badge: '', price: 169, inStock: false,
        description: 'Full HD 1080p at 60fps webcam with AI-enabled facial tracking, auto-framing, and smart auto-focus. Dual front-facing mics and USB-C connectivity for instant streaming.',
        images: [
            'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Graphite', value: '#4a5568' },
            { name: 'White', value: '#e8e8e8' },
        ],
        specs: { 'Resolution': '1080p / 60fps', 'Autofocus': 'Smart AI', 'Framing': 'Auto-framing (AI face tracking)', 'Microphones': 'Dual omnidirectional', 'Mount': 'Versatile (portrait & landscape)', 'Connection': 'USB-C', 'Software': 'Logitech Capture', 'Weight': '222g' },
        features: [
            { icon: 'face', title: 'AI Smart Framing', detail: 'Always perfectly framed' },
            { icon: 'hd', title: '1080p/60fps', detail: 'Smooth, sharp streams' },
        ],
    },
    27: {
        id: 27, name: 'Samsung T7 Portable SSD 2TB', subtitle: 'Speed in Your Pocket',
        category: 'Accessories', badge: '', price: 179,
        description: 'Lightning-fast 1,050MB/s transfer speed in a credit-card-sized form factor. AES 256-bit hardware encryption, shock-resistant (up to 2m drop), and USB 3.2 Gen 2 interface.',
        images: [
            'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Titan Gray', value: '#6b7280' },
            { name: 'Indigo Blue', value: '#4338ca' },
            { name: 'Red', value: '#e53e3e' },
        ],
        specs: { 'Capacity': '2TB', 'Interface': 'USB 3.2 Gen 2', 'Sequential Read': '1,050 MB/s', 'Sequential Write': '1,000 MB/s', 'Encryption': 'AES 256-bit hardware', 'Shock Resistance': '2m drop-resistant', 'Dimensions': '85 × 57 × 8mm', 'Weight': '58g' },
        features: [
            { icon: 'speed', title: '1050 MB/s', detail: 'NVMe-level speed' },
            { icon: 'security', title: 'AES 256-bit', detail: 'Hardware encryption' },
        ],
    },
    28: {
        id: 28, name: 'Xbox Series X', subtitle: 'Power Your Dreams',
        category: 'Gaming', badge: '', price: 499,
        description: 'The fastest, most powerful Xbox ever. 12 teraflops of processing power, true 4K gaming at up to 120fps, and 8K HDR High Dynamic Range capability.',
        images: [
            'https://images.unsplash.com/photo-1621259182902-8809043cf530?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
        ],
        specs: { 'CPU': '8X Cores @ 3.8 GHz', 'GPU': '12 TFLOPS AMD RDNA 2', 'Memory': '16GB GDDR6', 'Storage': '1TB NVMe SSD', 'Resolution': '4K @ 60fps, up to 120fps', 'Audio': 'Dolby Digital 5.1, Atmos', 'Weight': '4.4 kg' },
        features: [
            { icon: 'speed', title: '12 TFLOPS', detail: 'Raw graphical power' },
            { icon: '4k', title: 'True 4K Gaming', detail: 'Up to 120FPS' },
        ],
    },
    29: {
        id: 29, name: 'GoPro Hero 12 Black', subtitle: 'Capture Incredible',
        category: 'Photography', badge: 'New', price: 399,
        description: 'Incredible image quality, even better HyperSmooth video stabilization, and a huge boost in battery life. The best GoPro yet.',
        images: [
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
        ],
        specs: { 'Video': '5.3K60 + 4K120', 'Photo': '27MP', 'Stabilization': 'HyperSmooth 6.0', 'Waterproof': '33ft (10m)', 'Battery': 'Enduro Battery', 'Screens': 'Dual LCD Screens', 'Weight': '154g' },
        features: [
            { icon: 'videocam', title: '5.3K Video', detail: 'Cinematic detail' },
            { icon: 'water_drop', title: 'Waterproof', detail: 'Rugged & durable' },
        ],
    },
    30: {
        id: 30, name: 'Kindle Paperwhite Signature', subtitle: 'Read Anywhere',
        category: 'Computers', badge: '', price: 189,
        description: 'Get more with Signature Edition: wireless charging, auto-adjusting front light, and 32 GB storage. Purpose-built for reading with a 300 ppi flush-front display.',
        images: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
        ],
        colors: [
            { name: 'Black', value: '#1a1a2e' },
            { name: 'Agave Green', value: '#4b5320' },
        ],
        specs: { 'Display': '6.8” Paperwhite display technology', 'Storage': '32 GB', 'Front Light': '17 LEDs + adjustable warm light', 'Battery Life': 'Up to 10 weeks', 'Waterproof': 'IPX8', 'Charging': 'USB-C + Wireless', 'Weight': '207g' },
        features: [
            { icon: 'book', title: '300 ppi Display', detail: 'Glare-free reading' },
            { icon: 'brightness_6', title: 'Auto-Adjust Light', detail: 'Day & night reading' },
        ],
    },
};
