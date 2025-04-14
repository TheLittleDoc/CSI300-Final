'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Login from "@/app/components/Login";
import Dashboard from "@/app/components/Dashboard";
import { useState } from "react";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

  return (
      <>
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
        />
        <div>
          <div style={{textAlign: 'right', padding: '10px'}}>
            {!loggedIn ? (
                <Login onLogin={() => setLoggedIn(true)}/>
            ) : (
                <button onClick={() => setLoggedIn(false)}>Logout</button>
            )}
          </div>
          <Dashboard isAdmin={loggedIn}/>
        </div>
      </main>
    </div>
      </>
  );
}
