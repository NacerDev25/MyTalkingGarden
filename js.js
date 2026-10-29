// بيانات الحيوانات مع وصف الأصوات لتوفير بديل ميسر في حال عدم توفر ملفات الصوت
const ANIMALS = [
    // الـحـيـوانـات الألـيـفـة
    { id: "cat", name: "قِـطّة", category: "pets", imagePath: "https://img.icons8.com/color/512/cat--v1.png", soundPath: "cat-meow.mp3", soundDesc: "مواء" },
    { id: "dog", name: "كَـلـب", category: "pets", imagePath: "https://img.icons8.com/color/512/dog--v1.png", soundPath: "dog.mp3", soundDesc: "نباح" },
    { id: "horse", name: "حِـصَـان", category: "pets", imagePath: "https://img.icons8.com/color/512/horse.png", soundPath: "dragon-studio-horse-neigh-515279.mp3", soundDesc: "صهيل" },
    { id: "bird", name: "عُـصْـفُـور", category: "pets", imagePath: "https://img.icons8.com/color/512/bird.png", soundPath: "audiopapkin-blackbird-singing-296516.mp3", soundDesc: "تغريد" },
    
    // حـيـوانـات الـغـابـة
    { id: "lion", name: "أَسَـد", category: "wild", imagePath: "https://img.icons8.com/color/512/lion.png", soundPath: "lion.mp3", soundDesc: "زئير" },
    { id: "elephant", name: "فِـيـل", category: "wild", imagePath: "https://img.icons8.com/color/512/elephant.png", soundPath: "elephant.mp3", soundDesc: "نهيم" },
    { id: "monkey", name: "قِـرْد", category: "wild", imagePath: "https://img.icons8.com/color/512/monkey.png", soundPath: "monkey.mp3", soundDesc: "قهقهة وصياح" },
    
    // الـحـيـوانـات الـمـائـيـة
    { id: "dolphin", name: "دُلْـفِـيـن", category: "sea", imagePath: "https://img.icons8.com/color/512/dolphin.png", soundPath: "dolphin.mp3", soundDesc: "صفير" },
    { id: "whale", name: "حُـوت", category: "sea", imagePath: "https://img.icons8.com/color/512/whale.png", soundPath: "whale.mp3", soundDesc: "غناء تحت الماء" },
    { id: "shark", name: "قِرْش", category: "sea", imagePath: "https://img.icons8.com/color/512/shark.png", soundPath: "shark.mp3", soundDesc: "ضربات زعنفة ذيلية في الماء" },
];

// ألوان الحواف الميسرة للتصنيفات (المتغيرات المعرفة في CSS)
const CATEGORY_COLORS = {
    pets: "var(--pink)",
    wild: "var(--yellow)",
    sea: "var(--blue)"
};

// العناصر الأساسية في واجهة المستخدم
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const appContainer = document.getElementById('app-container');
const animalsGrid = document.getElementById('animals-grid');
const tabButtons = document.querySelectorAll('.tab-btn');
const audioPlayer = document.getElementById('global-audio-player');
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');

// إعدادات الوصول الميسر والتشغيل
const settings = {
    sound: localStorage.getItem('sound') !== 'false', // افتراضي: تشغيل
    speech: localStorage.getItem('speech') !== 'false', // افتراضي: تشغيل
    contrast: localStorage.getItem('contrast') === 'true', // افتراضي: إيقاف
    motion: localStorage.getItem('motion') === 'true' // افتراضي: إيقاف
};

let activeCategory = 'pets';
let isAudioRunning = false;

// دالة لإنشاء عنصر الإعلان الصوتي لقارئات الشاشة (Live Region)
const liveAnnouncer = document.createElement('div');
liveAnnouncer.className = 'sr-only';
liveAnnouncer.setAttribute('aria-live', 'polite');
liveAnnouncer.setAttribute('aria-atomic', 'true');
document.body.appendChild(liveAnnouncer);

function announceToScreenReader(message) {
    liveAnnouncer.textContent = '';
    setTimeout(() => {
        liveAnnouncer.textContent = message;
    }, 50);
}

// تهيئة الإعدادات وتطبيقها على عناصر التحكم
function initSettings() {
    const soundChk = document.getElementById('toggle-sound');
    const speechChk = document.getElementById('toggle-speech');
    const contrastChk = document.getElementById('toggle-contrast');
    const motionChk = document.getElementById('toggle-motion');

    soundChk.checked = settings.sound;
    speechChk.checked = settings.speech;
    contrastChk.checked = settings.contrast;
    motionChk.checked = settings.motion;

    if (settings.contrast) document.body.classList.add('high-contrast');
    if (settings.motion) document.body.classList.add('reduce-motion');

    soundChk.addEventListener('change', (e) => {
        settings.sound = e.target.checked;
        localStorage.setItem('sound', settings.sound);
        announceToScreenReader(settings.sound ? "تم تفعيل صوت الحيوانات" : "تم كتم صوت الحيوانات");
    });

    speechChk.addEventListener('change', (e) => {
        settings.speech = e.target.checked;
        localStorage.setItem('speech', settings.speech);
        announceToScreenReader(settings.speech ? "تم تفعيل نطق الأسماء" : "تم إيقاف نطق الأسماء");
    });

    contrastChk.addEventListener('change', (e) => {
        settings.contrast = e.target.checked;
        localStorage.setItem('contrast', settings.contrast);
        if (settings.contrast) {
            document.body.classList.add('high-contrast');
            announceToScreenReader("تم تفعيل نمط التباين العالي");
        } else {
            document.body.classList.remove('high-contrast');
            announceToScreenReader("تم إيقاف نمط التباين العالي");
        }
    });

    motionChk.addEventListener('change', (e) => {
        settings.motion = e.target.checked;
        localStorage.setItem('motion', settings.motion);
        if (settings.motion) {
            document.body.classList.add('reduce-motion');
            announceToScreenReader("تم تفعيل وضع تقليل الحركة");
        } else {
            document.body.classList.remove('reduce-motion');
            announceToScreenReader("تم إيقاف وضع تقليل الحركة");
        }
    });
}

// فتح وإغلاق لوحة الإعدادات
settingsToggle.addEventListener('click', () => {
    const isExpanded = settingsToggle.getAttribute('aria-expanded') === 'true';
    settingsToggle.setAttribute('aria-expanded', !isExpanded);
    if (isExpanded) {
        settingsPanel.classList.add('hidden');
        announceToScreenReader("تم إغلاق لوحة الإعدادات");
    } else {
        settingsPanel.classList.remove('hidden');
        document.getElementById('toggle-sound').focus();
        announceToScreenReader("تم فتح لوحة إعدادات الوصول الميسر. اضغط مفتاح الهروب Escape للإغلاق في أي وقت.");
    }
});

// إغلاق اللوحة عند ضغط Escape
settingsPanel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        settingsPanel.classList.add('hidden');
        settingsToggle.setAttribute('aria-expanded', 'false');
        settingsToggle.focus();
        announceToScreenReader("تم إغلاق لوحة الإعدادات");
    }
});

// إعداد شاشة البدء لإلغاء قيود تشغيل الصوت التلقائي في الهواتف
// وتطبيق إدارة تركيز ميسرة للمكفوفين
window.addEventListener('DOMContentLoaded', () => {
    startBtn.focus();
    initSettings();
});

startBtn.addEventListener('click', () => {
    // تشغيل ملف صوت فارغ لفك حظر الصوت
    audioPlayer.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";
    audioPlayer.play().catch(() => {});

    // نطق فارغ لفك حظر النطق الآلي
    const silentUtterance = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(silentUtterance);

    // إخفاء الشاشة مع إتاحة المحتوى للملاحة
    startOverlay.style.opacity = '0';
    appContainer.removeAttribute('inert');
    appContainer.removeAttribute('aria-hidden');

    setTimeout(() => {
        startOverlay.style.display = 'none';
        
        // نقل التركيز إلى الترويسة الرئيسية
        const appHeading = document.getElementById('app-heading');
        appHeading.setAttribute('tabindex', '-1');
        appHeading.focus();
        
        announceToScreenReader("مرحباً بك في حديقتي الناطقة! تم تفعيل الصوت بنجاح. يمكنك التنقل بين التصنيفات باستخدام مفاتيح الأسهم اليمين واليسار.");
    }, 400);
});

// دالة لنطق النصوص بطريقة ميسرة وقابلة للانتظار (Async)
function speakText(text) {
    return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ar-SA";
        utterance.pitch = 1.1; 
        utterance.rate = 0.8;  
        
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        
        // صمام أمان لضمان عدم تعليق التطبيق في حال حدوث خطأ في محرك النطق في المتصفح
        setTimeout(() => {
            resolve();
        }, 3000);
        
        window.speechSynthesis.speak(utterance);
    });
}

// دالة تفاعلية لمعالجة نقر/تفعيل بطاقة الحيوان
async function handleAnimalInteraction(animal) {
    if (isAudioRunning) {
        // إيقاف أي صوت أو نطق حالي لبدء التفاعل الجديد فوراً
        audioPlayer.pause();
        window.speechSynthesis.cancel();
    }
    
    isAudioRunning = true;
    
    // 1. تشغيل صوت الحيوان (إذا كان مفعلاً)
    if (settings.sound && animal.soundPath) {
        let playPromise = null;
        try {
            audioPlayer.src = animal.soundPath;
            audioPlayer.load();
            playPromise = audioPlayer.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                // الانتظار حتى انتهاء الصوت أو لمدة ثانيتين كحد أقصى لتجنب التأخير الطويل للأطفال
                await new Promise((resolve) => {
                    let isResolved = false;
                    
                    const onEnded = () => {
                        if (isResolved) return;
                        isResolved = true;
                        audioPlayer.removeEventListener('ended', onEnded);
                        resolve();
                    };
                    
                    audioPlayer.addEventListener('ended', onEnded);
                    
                    setTimeout(() => {
                        if (isResolved) return;
                        isResolved = true;
                        audioPlayer.removeEventListener('ended', onEnded);
                        resolve();
                    }, 2000);
                });
            }
        } catch (err) {
            console.log("تعذر تشغيل ملف MP3، تشغيل النطق الميسر البديل:", err);
            // بديل ميسر: إذا فشل تشغيل الصوت، ننطق وصف الصوت (مثال: "صوت الأسد: زئير")
            if (settings.speech) {
                await speakText(`صوت ال${animal.name}: ${animal.soundDesc}`);
                // تأخير بسيط بين وصف الصوت ونطق الاسم
                await new Promise(r => setTimeout(r, 400));
            }
        }
    }
    
    // 2. نطق اسم الحيوان (إذا كان مفعلاً)
    if (settings.speech) {
        await speakText(animal.name);
    }
    
    isAudioRunning = false;
}

// دالة لإنشاء بطاقة الحيوان
function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.style.borderColor = CATEGORY_COLORS[animal.category];
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `حيوان ${animal.name}. اضغط لسماع الصوت والاسم.`);
    card.tabIndex = 0;

    // تم إضافة aria-hidden للأجزاء الداخلية لتجنب القراءة المزدوجة والمربكة من قارئات الشاشة
    card.innerHTML = `
        <div class="animal-image-container" aria-hidden="true">
            <img src="${animal.imagePath}" alt="" loading="lazy">
        </div>
        <h3 class="animal-name" aria-hidden="true">${animal.name}</h3>
        <div class="play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
    `;

    const triggerInteraction = (e) => {
        if (e) e.stopPropagation();
        handleAnimalInteraction(animal);
    };

    card.addEventListener('click', triggerInteraction);
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerInteraction(e);
        }
    });

    return card;
}

// دالة لتحديث عرض الحيوانات
function renderAnimals() {
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

// تفعيل وتحديث الملاحة بين التبويبات (Roving Tabindex & ARIA Rules)
const tabs = Array.from(tabButtons);

function activateTab(tabBtn) {
    tabs.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
    });

    tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', 'true');
    tabBtn.setAttribute('tabindex', '0');
    tabBtn.focus();

    activeCategory = tabBtn.getAttribute('data-category');
    
    // تحديث ربط شبكة العرض بالتبويب النشط
    animalsGrid.setAttribute('aria-labelledby', tabBtn.id);
    
    renderAnimals();
    announceToScreenReader(`تم عرض تصنيف ${tabBtn.textContent}`);
}

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        activateTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        
        if (e.key === 'ArrowLeft') {
            // المضي قدماً للتصنيف التالي (اليسار في الوضع العربي RTL)
            targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowRight') {
            // الرجوع للتصنيف السابق (اليمين في الوضع العربي RTL)
            targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            targetIndex = 0;
        } else if (e.key === 'End') {
            targetIndex = tabs.length - 1;
        }

        if (targetIndex !== -1) {
            e.preventDefault();
            activateTab(tabs[targetIndex]);
        }
    });
});

// العرض الأولي للصفحة
renderAnimals();
