import React, { useEffect, useRef } from 'react';

const starryBackgroundRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const starryBackground = starryBackgroundRef.current;

    function createStar() {
        const star = document.createElement('div');
        star.classList.add(styles.star);
        const randomX: number = Math.random();
        const randomY:number = Math.random();
        star.style.setProperty('--random-x', randomX.toString());
        star.style.setProperty('--random-y', randomY.toString());
        star.style.animationDuration = `${Math.random() * 2 + 0.5}s`;
        if (starryBackground) {
            starryBackground.appendChild(star);
        }
    }
    // const star = document.createElement('div');
    // star.classList.add('star'); 
    // Generate random positions
    // const randomX: number = Math.random();
    // const randomY:number = Math.random();
    // star.style.setProperty('--random-x', randomX.toString());
    // star.style.setProperty('--random-y', randomY.toString());
    // if (starryBackground) {
    //     starryBackground.appendChild(star);
    // }
    for (let starCount = 0; starCount < 20; starCount++) {
        createStar();
    }
}, []);