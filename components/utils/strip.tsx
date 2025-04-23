import React, { useEffect, useRef } from 'react';
import styles from './flow.module.css';

export default function Strip() {

    const stripRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const strip = stripRef.current;

        const startAnimation = (strip: HTMLDivElement | null) => {
            console.log('starting animation');
            if (strip) {
                strip.classList.remove(styles.strip); // remove the animation
                console.log(styles.strip + 'animation removed');
                strip.offsetHeight; // trigger reflow
                strip.classList.add(styles.strip); // add the animation back
            }
        }

        const handleAnimationEnd = () => {
            console.log("ended animation")
            setTimeout(() => {
                console.log('restarting animation at 5 seconds delay');
                startAnimation(strip);
            }, 5000);
        };


        strip?.addEventListener('animationend',handleAnimationEnd);

        return () => {
            strip?.removeEventListener('animationend', handleAnimationEnd);
        };

    }, [])



    return <div ref={stripRef} className={styles.strip}></div>;
}