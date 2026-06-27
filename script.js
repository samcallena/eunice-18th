document.addEventListener('DOMContentLoaded', () => {
    
    // Audio elements
    const bgMusic = document.getElementById('bg-music');
    const popSfx = document.getElementById('pop-sfx');
    const unlockSfx = document.getElementById('unlock-sfx');
    const victorySfx = document.getElementById('victory-sfx');
    const musicToggleBtn = document.getElementById('music-toggle-btn');

    // Music control toggle system
    musicToggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play blocked by browser setup"));
            musicToggleBtn.textContent = "⏸ Pause Music";
            musicToggleBtn.style.background = "#D87093";
            musicToggleBtn.style.color = "white";
        } else {
            bgMusic.pause();
            musicToggleBtn.textContent = "🎵 Play Music";
            musicToggleBtn.style.background = "white";
            musicToggleBtn.style.color = "#D87093";
        }
    });

    // Zero-lag instant sound effect player logic
    function playSound(audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.log("SFX play blocked"));
    }
    
    // Photo Memory Database
    const memoryData = {
        queen: {
            title: "💖 I",
            html: `<p class="memory-popup-text">I just want you to know how thankful I am that I got to have a friend like you. Hindi ko in-expect na may taong magiging ganito ka-important sa buhay ko. Thank you for all the times na sinamahan mo ako, pinakinggan mo ako, at pinagaan mo ‘yung mga araw na hindi ko alam paano haharapin. Sobrang na-a-appreciate ko lahat ng little things na ginagawa mo, kahit minsan hindi ko agad nasasabi. I'm really lucky to have you, Eunice. 🥰✨</p>`
        },
        cute: {
            title: "💝 LOVE",
            html: `<p class="memory-popup-text">LOVE ko talaga yung friendship natin kasi kahit hindi naman tayo perfect, we always find our way back to each other. Ang dami na nating pinagdaanan, from random laughs, endless kwentuhan, hanggang sa mga times na hindi tayo okay. Pero through everything, I'm grateful na ikaw ‘yung kasama ko sa journey na 'to. Thank you for staying, for understanding me, and for always making an effort. Kahit magbago man ‘yung routine natin ngayon, I hope you know na I’ll always value what we have. 🥺💕</p>`
        },
        friendship: {
            title: "💞 YOU",
            html: `<p class="memory-popup-text">YOU are someone I will always be proud of. Seeing you grow and become the person you are today makes me so happy. I hope you always remember how amazing you are and how much you deserve all the good things coming your way. Thank you for being you, for being my friend, my kakwentuhan, and one of the people I can always count on. Happy 18th, Eunice. I’m always cheering for you, kahit saan pa tayo dalhin ng buhay. 👑🌟💖</p>`
        }
    };

    // DOM Target Connectors
    const memoryModal = document.getElementById('memory-modal');
    const letterModal = document.getElementById('letter-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const letterCloseBtn = document.getElementById('letter-close-btn');
    const modalDynamicContent = document.getElementById('modal-dynamic-content');

    // Attach click triggers to Lookbook cards
    document.querySelectorAll('.clickable-photo').forEach(photoCard => {
        photoCard.addEventListener('click', () => {
            const memoryKey = photoCard.getAttribute('data-memory');
            const data = memoryData[memoryKey];
            
            if (data) {
                playSound(popSfx);
                modalDynamicContent.innerHTML = `
                    <h2 class="memory-popup-title">${data.title}</h2>
                    ${data.html}
                `;
                memoryModal.classList.add('active');
                createConfettiBurst(15);
            }
        });
    });

    // Close Modals Logic
    modalCloseBtn.addEventListener('click', () => {
        memoryModal.classList.remove('active');
        modalDynamicContent.innerHTML = ""; 
    });

    letterCloseBtn.addEventListener('click', () => {
        letterModal.classList.remove('active');
        document.getElementById('gift-box').classList.remove('open'); 
    });

    window.addEventListener('click', (e) => {
        if(e.target === memoryModal) {
            memoryModal.classList.remove('active');
            modalDynamicContent.innerHTML = "";
        }
        if(e.target === letterModal) {
            letterModal.classList.remove('active');
            document.getElementById('gift-box').classList.remove('open');
        }
    });

    // Background Particle Sparkles Loop
    const sparkleContainer = document.getElementById('sparkles');
    for (let i = 0; i < 35; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.width = `${Math.random() * 8 + 4}px`;
        sparkle.style.height = sparkle.style.width;
        sparkle.style.animationDelay = `${Math.random() * 5}s`;
        sparkle.style.animationDuration = `${Math.random() * 3 + 3}s`;
        sparkleContainer.appendChild(sparkle);
    }

    // Interactive Button Unlocking Mechanics
    const gameButtons = document.querySelectorAll('.game-btn');
    const giftSection = document.getElementById('gift-section');
    const gameZone = document.getElementById('game-zone');
    const clickedItems = new Set();

    gameButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemType = btn.getAttribute('data-item');
            btn.classList.add('activated');
            clickedItems.add(itemType);

            playSound(popSfx);
            createConfettiBurst(15);

            if (clickedItems.size === 3) {
                setTimeout(() => {
                    playSound(unlockSfx);
                    giftSection.classList.remove('locked');
                    // Translated game completion message to Casual English
                    gameZone.innerHTML = "<h3>🎉 UNLOCKED! 🎉</h3><p>Open your interactive gift box below to reveal your sweet surprise message! 🎁👇</p>";
                    gameZone.style.borderColor = "#5cdb6d";
                    gameZone.style.background = "#E6F9EC";
                    
                    triggerGrandConfettiStorm();
                }, 400);
            }
        });
    });

    // Opening Gift Box -> Opens full screen Sweet Letter Pop-out
    const giftBox = document.getElementById('gift-box');
    giftBox.addEventListener('click', () => {
        if (!giftSection.classList.contains('locked')) {
            giftBox.classList.add('open'); 
            playSound(victorySfx);
            
            setTimeout(() => {
                letterModal.classList.add('active');
                createConfettiBurst(60);
            }, 500);
        }
    });

    // Confetti Math Engine
    const canvas = document.getElementById('confetti-canvas');
    const colors = ['#FFB6C1', '#FF69B4', '#D87093', '#FFFACD', '#E6F9EC', '#E8D3FF'];

    function createConfettiPiece() {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.width = `${Math.random() * 6 + 6}px`;
        piece.style.height = `${Math.random() * 10 + 6}px`;
        
        if(Math.random() > 0.5) piece.style.borderRadius = "50%";

        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        canvas.appendChild(piece);
        setTimeout(() => piece.remove(), 3000);
    }

    function createConfettiBurst(count) {
        for(let i=0; i<count; i++) {
            createConfettiPiece();
        }
    }

    function triggerGrandConfettiStorm() {
        let iterations = 0;
        const interval = setInterval(() => {
            createConfettiBurst(15);
            iterations++;
            if (iterations > 6) clearInterval(interval);
        }, 150);
    }
});