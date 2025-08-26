"use client";
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaAlignJustify } from "react-icons/fa";
import ContactMe from '@/components/sidebar/contactMe';
import Sidebar from "../../components/sidebar/sidebar";

export default function Navbar() { 
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
                <Link href="/" className={styles.tab}>
                    About Me
                </Link>

                <Link href="/projects/" className={styles.tab}>Projects</Link>
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
                <ContactMe/>
            </Sidebar>


        </nav>
    );
}
