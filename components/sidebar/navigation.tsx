'use client'
import React from 'react';
import styles from './sidebar.module.css';

interface NavigationProps {
    onNavigate: (section: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        onNavigate(sectionId);
    };

    return (
        <div className={styles.navigationContainer}>
            
            <nav className={styles.navMenu}>
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('about-section')}
                >
                    <span className={styles.navText}>About Me</span>
                </button>
                
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('projects-section')}
                >
                    <span className={styles.navText}>Projects</span>
                </button>
                
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('contact-section')}
                >
                    <span className={styles.navText}>Contact Me</span>
                </button>
            </nav>
            
        </div>
    );
}
