import ReactFlow, { Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';
import styles from './flow.module.css';
import Strip from './strip';
// import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import Popup from '../popups/popup';



interface CustomModalPopupNodeProps {
    data: { label: string };
    id: string;
}

export default function CustomModalPopupNode({ data, id }: CustomModalPopupNodeProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (            
            <div className={styles.nodes}  onClick={() => setIsOpen(!isOpen)}>
                <Strip />
            
                <Popup 
                    isOpen={isOpen} 
                    onClose={() => setIsOpen(false)}
                    id = {id}
                    
                />

                <div className={styles.label}>
                    {data.label}
                </div>
                <Handle 
                      type="target"
                      position={Position.Top} 

                      id='top'
                       />
                <Handle 
                      type="source"
                      position={Position.Bottom} 
                      id = 'bottom'
                       />
            </div>
    );
}