// بيانات الحيوانات مع روابط صور كرتونية عالية الجودة
const ANIMALS = [
    // الـحـيـوانـات الألـيـفـة
    { id: "cat", name: "قِـطّة", category: "pets", imagePath: "https://img.icons8.com/color/512/cat--v1.png", soundPath: "cat meow.mp3" },
    { id: "dog", name: "كَـلـب", category: "pets", imagePath: "https://img.icons8.com/color/512/dog--v1.png", soundPath: "sounds/dog.mp3" },
    { id: "rabbit", name: "أَرْنَـب", category: "pets", imagePath: "https://img.icons8.com/color/512/rabbit.png", soundPath: "sounds/rabbit.mp3" },
    
    // حـيـوانـات الـغـابـة
    { id: "lion", name: "أَسَـد", category: "wild", imagePath: "https://img.icons8.com/color/512/lion.png", soundPath: "sounds/lion.mp3" },
    { id: "elephant", name: "فِـيـل", category: "wild", imagePath: "https://img.icons8.com/color/512/elephant.png", soundPath: "sounds/elephant.mp3" },
    { id: "monkey", name: "قِـرْد", category: "wild", imagePath: "https://img.icons8.com/color/512/monkey.png", soundPath: "sounds/monkey.mp3" },
    
    // الـحـيـوانـات الـمـائـيـة
    { id: "dolphin", name: "دُلْـفِـيـن", category: "sea", imagePath: "https://img.icons8.com/color/512/dolphin.png", soundPath: "sounds/dolphin.mp3" },
    { id: "whale", name: "حُـوت", category: "sea", imagePath: "https://img.icons8.com/color/512/whale.png", soundPath: "sounds/whale.mp3" },
    { id: "shark", name: "قِرْش", category: "sea", imagePath: "https://img.icons8.com/color/512/shark.png", soundPath: "sounds/shark.mp3" },
];

// ألوان الحواف حسب التصنيف
const CATEGORY_COLORS = {
    pets: "#FFADAD",
    wild: "#FFD6A5",
    sea: "#9BF6FF"
};

const animalsGrid = document.getElementById('animals-grid');
const tabButtons = document.querySelectorAll('.tab-btn');

let activeCategory = 'pets';

// دالة لتشغيل الصوت (مع محاولة تشغيله فقط إذا كان الملف موجوداً)
function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch(err => {
        console.log("صوت MP3 غير موجود حالياً، سأكتفي بالنطق الصوتي.");
    });
}

// دالة لنطق الاسم بالعربية (Web Speech API)
function speakName(name) {
    // إلغاء أي نطق مستمر حالياً
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "ar-SA";
    utterance.pitch = 1.2; // جعل الصوت طفولياً قليلاً
    utterance.rate = 0.9;  // جعل النطق أبطأ قليلاً ليفهمه الطفل
    window.speechSynthesis.speak(utterance);
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

    const handleInteraction = () => {
        speakName(animal.name);
        playSound(animal.soundPath);
    };

    card.addEventListener('click', handleInteraction);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleInteraction();
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
