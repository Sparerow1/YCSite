"use client"

import React from "react";
import Flow from "../../components/utils/flow";
import style from "../../components/utils/flow.module.css";


export default function Home() {

    return (
        <div>
            <div className={style.flow}>
                <Flow/>
            </div>
        </div>
    );
}