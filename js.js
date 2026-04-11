// بيانات الحيوانات مع روابط صور كرتونية عالية الجودة
const ANIMALS = [
    // الـحـيـوانـات الألـيـفـة
    { id: "cat", name: "قِـطّة", category: "pets", imagePath: "https://img.icons8.com/color/512/cat--v1.png", soundPath: "cat-meow.mp3" },
    { id: "dog", name: "كَـلـب", category: "pets", imagePath: "https://img.icons8.com/color/512/dog--v1.png", soundPath: "dog.mp3" },
    { id: "horse", name: "حِـصَـان", category: "pets", imagePath: "https://img.icons8.com/color/512/horse.png", soundPath: "dragon-studio-horse-neigh-515279.mp3" },
    
    // حـيـوانـات الـغـابـة
    { id: "lion", name: "أَسَـد", category: "wild", imagePath: "https://img.icons8.com/color/512/lion.png", soundPath: "lion.mp3" },
    { id: "elephant", name: "فِـيـل", category: "wild", imagePath: "https://img.icons8.com/color/512/elephant.png", soundPath: "elephant.mp3" },
    { id: "monkey", name: "قِـرْد", category: "wild", imagePath: "https://img.icons8.com/color/512/monkey.png", soundPath: "monkey.mp3" },
    
    // الـحـيـوانـات الـمـائـيـة
    { id: "dolphin", name: "دُلْـفِـيـن", category: "sea", imagePath: "https://img.icons8.com/color/512/dolphin.png", soundPath: "dolphin.mp3" },
    { id: "whale", name: "حُـوت", category: "sea", imagePath: "https://img.icons8.com/color/512/whale.png", soundPath: "whale.mp3" },
    { id: "shark", name: "قِرْش", category: "sea", imagePath: "https://img.icons8.com/color/512/shark.png", soundPath: "shark.mp3" },
];

// ألوان الحواف حسب التصنيف
const CATEGORY_COLORS = {
    pets: "#FFADAD",
    wild: "#FFD6A5",
    sea: "#9BF6FF"
};

// إعدادات شاشة البدء لتفعيل الصوت في الهواتف
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    // تفعيل مشغل الصوت (تشغيل صامت لمرة واحدة لفك القفل)
    audioPlayer.src = ""; 
    audioPlayer.play().catch(() => {});

    // تفعيل محرك النطق (نطق فارغ لفك القفل)
    const silentUtterance = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(silentUtterance);

    // إخفاء الشاشة
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.style.display = 'none';
    }, 500);
});

const animalsGrid = document.getElementById('animals-grid');
const tabButtons = document.querySelectorAll('.tab-btn');

let activeCategory = 'pets';

// كائن صوتي واحد لإعادة استخدامه (أفضل للهواتف)
const audioPlayer = new Audio();

// دالة لتشغيل الصوت (مع محاولة تشغيله فقط إذا كان الملف موجوداً)
function playSound(path) {
    if (!path) return;
    
    audioPlayer.src = path;
    audioPlayer.load(); // تحميل الملف أولاً لضمان الجاهزية
    audioPlayer.play().catch(err => {
        console.log("صوت MP3 غير موجود أو تم منعه:", path);
    });
}

// دالة لنطق الاسم بالعربية (Web Speech API)
function speakName(name) {
    // إلغاء أي نطق مستمر حالياً
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "ar-SA";
    utterance.pitch = 1.1; 
    utterance.rate = 0.8;  
    
    // التأكد من أن النطق يبدأ بعد انتهاء الإلغاء السابق
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 50);
}

// دالة لإنشاء بطاقة الحيوان
function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.style.borderColor = CATEGORY_COLORS[animal.category];
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `حيوان ${animal.name}`);
    card.tabIndex = 0;

    card.innerHTML = `
        <div class="animal-image-container">
            <img src="${animal.imagePath}" alt="${animal.name}" loading="lazy">
        </div>
        <h3 class="animal-name">${animal.name}</h3>
        <div class="play-icon">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
    `;

    const handleInteraction = (e) => {
        // منع السلوك الافتراضي لضمان استجابة أسرع على الهواتف
        if (e) e.stopPropagation();

        // تشغيل صوت الحيوان أولاً (أكثر حساسية في الهواتف)
        playSound(animal.soundPath);
        
        // ثم نطق الاسم بعد تأخير بسيط جداً لضمان عدم التداخل
        setTimeout(() => {
            speakName(animal.name);
        }, 100);
    };

    card.addEventListener('click', handleInteraction);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction(e);
        }
    });

    return card;
}

// دالة لتحديث عرض الشبكة
function renderAnimals() {
    // تأثير اختفاء بسيط قبل التغيير
    animalsGrid.style.opacity = '0';
    
    setTimeout(() => {
        animalsGrid.innerHTML = '';
        const filtered = ANIMALS.filter(a => a.category === activeCategory);
        filtered.forEach(animal => {
            animalsGrid.appendChild(createAnimalCard(animal));
        });
        animalsGrid.style.opacity = '1';
    }, 200);
}

// إعداد أزرار التبويب
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        activeCategory = btn.getAttribute('data-category');
        renderAnimals();
    });
});

// العرض الأولي
renderAnimals();
