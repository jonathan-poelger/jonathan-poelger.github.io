let imageData = [
    {
        path: 'chateau.png',
        text: `ramassons les bouteilles sur les plages<br/>les seaux, les sacs, les mégots, les canettes,<br/>le plastique, le polystyrène, le fer et le verre<br/>fabriquons un château de détritus et de sable`,
        x: 15, y: 70, height: 200
    },
    {
        path: 'chaussures.png',
        text: `faut-il vraiment tout posséder<br/>pour exister`,
        x: 60, y: 85, height: 110
    },
    {
        path: 'coquillage.png',
        text: `la mer pleure<br/>elle aussi`,
        x: 85, y: 85, height: 50
    },
    {
        path: 'dauphin.webp',
        text: `pourquoi mer et terre s’accordent si bien<br/>et les humains si mal<br/>parons nos cheveux de fleurs<br/>pour habiter ensemble`,
        x: 55, y: 5, height: 70
    },
    {
        path: 'enfants.png',
        text: `les enfants méritent-ils<br/>d’avoir une mer souffrante<br/>et un monde en apnée`,
        x: 70, y: 45, height: 130
    },
    {
        path: 'meduse.png',
        text: `les méduses ont pris leur envol<br/>dans le ciel elles dansent<br/>on dirait des oiseaux`,
        x: 15, y: 20, height: 80
    },
    {
        path: 'poisson_jaune.png',
        text: `je voudrais un chapeau d’eau<br/>qui porterait les poissons jusqu’à la lune<br/>un chapeau d’eau qui toucherait les étoiles<br/>pour qu’enfin mer et ciel s’embrassent<br/>je me vêtirais d’une robe faite de vagues<br/>pour danser sous la lune`,
        x: 70, y: 18, height: 50
    },
    {
        path: 'seau.png',
        text: `vidons nos glaçons dans la mer<br/>elle a de la fièvre`,
        x: 80, y: 70, height: 100
    },
    {
        path: 'tortue.png',
        text: `il faut nourrir les tortues<br/>elles abriteront nos demeures`,
        x: 50, y: 70, height: 90
    },
    {
        path: 'baleine.png',
        text: `bientôt les baleines<br/>toucheront les gratte-ciel<br/>le soleil aura les pieds dans l’eau`,
        x: 85, y: 15, height: 150
    },
    {
        path: 'bouteille.webp',
        text: `j’ai essayé d’écrire la mer<br/>pour qu’elle ne déborde pas`,
        x: 5, y: 85, height: 95
    },
    {
        path: 'corail.png',
        text: `j’ai rêvé de constellations<br/>faites d’étoiles et de corail<br/>il y avait des poissons<br/>et la mer qui souriait`,
        x: 35, y: 50, height: 100
    },
    {
        path: 'dechets2.png',
        text: `j’ai attrapé un sac plastique<br/>tout transparent<br/>j’ai essayé de vider la mer<br/>j’ai rempli mon cœur<br/>de tristesse`,
        x: 70, y: 70, height: 500
    },
    {
        path: 'déchets.png',
        text: `balancés par la houle<br/>les déchets s’endorment<br/>dans le gyre du Pacifique`,
        x: 50, y: 50, height: 150
    },
    {
        path: 'etoile_de_mer.webp',
        text: `je ne sais pas nager<br/>peut-être que demain<br/>je mourrais`,
        x: 15, y: 50, height: 70
    },
    {
        path: 'oiseau.png',
        text: `l’horizon tremble sous les vagues<br/>victime silencieuse<br/>de l’érosion des côtes`,
        x: 20, y: 5, height: 85
    },
    {
        path: 'ours_polaire.png',
        text: `ça fond en hiver<br/>comme une glace en été<br/>les ours flottent sur les derniers glaçons`,
        x: 85, y: 8, height: 105
    },
    {
        path: 'poisson2.webp',
        text: `on se ressemble tous<br/>trempés jusqu’aux os<br/>on a froid`,
        x: 35, y: 20, height: 30
    },
    {
        path: 'poisson.webp',
        text: `parfois j’ai peur<br/>il fait noir<br/>sous l’eau`,
        x: 50, y: 25, height: 40
    },
    {
        path: 'velo.png',
        text: `j’ai dessiné un tricycle<br/>qui transforme les déchets<br/>en poussière d’étoiles<br/>à chaque coup de pédale`,
        x: 32, y: 80, height: 280
    }
];

window.addEventListener('DOMContentLoaded', () => {
    const sound = document.getElementById('bg-sound');

    const enableSound = () => {
        console.log("PLAY")
        sound.play().catch(err => console.warn('Autoplay failed:', err));
        document.removeEventListener('click', enableSound);
    };

    document.addEventListener('click', enableSound);
});

const collectedImages = new Set();
let activePopupImage = null;

function animateToMenu(img, data) {
    const clone = img.cloneNode();
    const rect = img.getBoundingClientRect();
    const target = menuBtn.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.height = `${img.offsetHeight}px`;
    clone.style.opacity = '1';
    clone.style.transform = 'scale(1)';
    clone.style.transition = 'all 5s ease';
    clone.style.zIndex = '10000';
    clone.style.pointerEvents = 'none';

    document.body.appendChild(clone);

    // Trigger the animation in the next frame
    requestAnimationFrame(() => {
        // Move clone to the menu button's position
        clone.style.left = `${target.left + window.scrollX + target.width / 2}px`;
        clone.style.top = `${target.top + window.scrollY + target.height / 2}px`;
        clone.style.opacity = '0'; // Fade it out as it moves
        clone.style.transform = 'scale(0.2)'; // Shrink it down
    });

    setTimeout(() => {
        clone.remove();
        addToMenu(data);
    }, 6000);
}

function addToMenu(data) {
    const thumb = document.createElement('img');
    thumb.src = "files/imgs/" + data.path;
    thumb.title = data.text;

    thumb.addEventListener('click', () => {
        Polaroid.innerHTML = data.text;
        Polaroid.style.color = 'white';
        Polaroid.style.textAlign = 'center';
    });

    Fridge.appendChild(thumb);
}



const floatingMenu = document.getElementById('floatingMenu');
const Fridge = document.getElementById('Fridge');
const Polaroid = document.getElementById('Polaroid');


const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.background = '#fff';
popup.style.border = '1px solid #aaa';
popup.style.borderRadius = '8px';
popup.style.padding = '10px';
popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
popup.style.display = 'none';
popup.style.zIndex = '1000';
popup.style.whiteSpace = 'pre-line';
popup.style.textAlign = 'center';
popup.style.fontFamily = 'EB Garamond, Garamond, serif';
popup.style.fontSize = '25px';
document.body.appendChild(popup);

document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && popup.style.display === 'block') {
        popup.style.display = 'none';

        if (activePopupImage && !collectedImages.has(activePopupImage.data.path)) {
            const { imgEl, data } = activePopupImage;
            collectedImages.add(data.path);
            animateToMenu(imgEl, data);
            imgEl.style.opacity = '0';
            imgEl.style.pointerEvents = 'none';
            visibleCount--;
        }

        activePopupImage = null;
    }
});



let visibleCount = 0;
let nextAllowedTime = Date.now();

imageData.forEach(data => {
    const img = document.createElement('img');
    img.src = "files/imgs/" + data.path;
    img.style.position = 'absolute';
    img.style.height = `${data.height}px`;
    img.style.left = `${data.x}%`;
    img.style.top = `${data.y}%`;
    img.style.transform = 'translate(-50%, -50%)';
    img.style.cursor = 'pointer';
    img.style.transition = 'opacity 1s';
    img.style.zIndex = '10';
    img.style.opacity = '0';
    img.style.pointerEvents = 'none';

    document.body.appendChild(img);

    // Timer refs to cancel later
    let showTimeout = null;
    let hideTimeout = null;

    function tryShow() {
        const now = Date.now();

        if (visibleCount >= 2 || now < nextAllowedTime) {
            showTimeout = setTimeout(tryShow, Math.random() * 10000);
            return;
        }

        // Show the image
        img.style.opacity = '1';
        img.style.pointerEvents = 'auto';
        visibleCount++;
        nextAllowedTime = now + 10000;

        const showDuration = 15000 + Math.random() * 20000;

        hideTimeout = setTimeout(() => {
            img.style.opacity = '0';
            img.style.pointerEvents = 'none';
            visibleCount--;

            const hideDuration = 10000 + Math.random() * 10000;
            showTimeout = setTimeout(tryShow, hideDuration);
        }, showDuration);
    }

    setTimeout(tryShow, Math.random() * 10000);

    img.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.innerHTML = data.text;
        popup.style.left = `${e.pageX + 10}px`;
        popup.style.top = `${e.pageY + 10}px`;
        popup.style.display = 'block';
        

        if (activePopupImage && !collectedImages.has(activePopupImage.data.path)) {
            const { imgEl, data } = activePopupImage;
            collectedImages.add(data.path);
            animateToMenu(imgEl, data);
            imgEl.style.opacity = '0';
            imgEl.style.pointerEvents = 'none';
            visibleCount--;
        }
        activePopupImage = { imgEl: img, data, cancelTimers };
        // Cancel timers for this image so it never shows again
        cancelTimers();
    });

    function cancelTimers() {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
    }
});


const menuBtn = document.getElementById('menuBtn');

menuBtn.addEventListener('click', () => {
    floatingMenu.classList.toggle('active');
});

const rulesMenu = document.getElementById('rules');

document.addEventListener('click', () => {
    rulesMenu.classList.add('hidden');
});

const infoButton = document.getElementById('infoBtn');
infoButton.addEventListener('click', (e) => {
    e.stopPropagation();
    rulesMenu.classList.remove('hidden');
});

/*
TODO
- cookies of the gotten imgs
- reset button
*/

