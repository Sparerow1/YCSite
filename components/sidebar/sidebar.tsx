'use client'
import React from 'react';
import { ReactNode } from 'react';
import styles from './sidebar.module.css';
import { FaCaretRight } from 'react-icons/fa';

interface SidebarProps {
    children: ReactNode;
    isOpen : boolean;
    onClose : () => void;
}

export default function Sidebar({ children, isOpen, onClose }: SidebarProps) {



    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            {children}

            <FaCaretRight style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            color: 'black',
                            cursor: 'pointer'
                        }}   onClick={onClose}/>
        </div>

    );
}