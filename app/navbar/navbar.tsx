"use client";
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaAlignJustify } from "react-icons/fa";
import Navigation from '@/components/sidebar/navigation';
import Sidebar from "../../components/sidebar/sidebar";

export default function Navbar() { 
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavigate = (section: string) => {
        // Close sidebar after navigation
        setSidebarOpen(false);
    };

    return (

        <nav className={styles.nav}>


            <Link href="/">
                <Image  
                    className={styles.logo}
                    width={90}
                    height={90}
                    src="/Y.svg" alt="Personal logo"/>
            </Link>

            <div className={styles.tabs}>
                {/*
                <Link href="/" className={styles.tab}>
                    About Me
                </Link>
                */}
                <Link href="/" className={styles.tab}>Yanheng Chen</Link>
                {/*
                <Link href="/experience/" className={styles.tab}>Experience</Link>
                */
                }
            </div>

            
            <div className={styles.sidebarTab} onClick={toggleSidebar}>
                <FaAlignJustify/>
            </div>

            <Sidebar isOpen={sidebarOpen}
                     onClose={toggleSidebar}>
                <Navigation onNavigate={handleNavigate}/>
            </Sidebar>


        </nav>
    );
}
