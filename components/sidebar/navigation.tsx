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
            <h1 className={styles.navTitle}>Navigation</h1>
            
            <nav className={styles.navMenu}>
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('about-section')}
                >
                    <span className={styles.navIcon}>��</span>
                    <span className={styles.navText}>About Me</span>
                </button>
                
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('projects-section')}
                >
                    <span className={styles.navIcon}>��</span>
                    <span className={styles.navText}>Projects</span>
                </button>
                
                <button 
                    className={styles.navItem}
                    onClick={() => scrollToSection('contact-section')}
                >
                    <span className={styles.navIcon}>��</span>
                    <span className={styles.navText}>Contact Me</span>
                </button>
            </nav>
            
            <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Connect With Me</h3>
                <div className={styles.socialLinks}>
                    <a 
                        href="https://www.linkedin.com/in/yan-chen-8a7a50211" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                    >
                        <span className={styles.socialIcon}>💼</span>
                        <span className={styles.socialText}>LinkedIn</span>
                    </a>
                    
                    <a 
                        href="https://github.com/Sparerow1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                    >
                        <span className={styles.socialIcon}>🐙</span>
                        <span className={styles.socialText}>GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
