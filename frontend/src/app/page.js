'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Login from "@/app/components/Login";
import Students from "@/app/components/Students";
import { useState } from "react";
import List from "@/app/components/List"
import Sections from "@/app/components/Sections";
import Assignments from "@/app/components/Assignments";
import Courses from "@/app/components/Courses";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

  return (
      <>
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <div style={{textAlign: 'right', padding: '10px'}}>
            {!loggedIn ? (
                <Login onLogin={() => setLoggedIn(true)}/>
            ) : (
                <button onClick={() => setLoggedIn(false)}>Logout</button>
            )}
          </div>
          <Students isAdmin={loggedIn} />
          <Sections isAdmin={loggedIn} />
          <Assignments isAdmin={loggedIn} />
          <Courses isAdmin={loggedIn} />
        </div>
      </main>
    </div>
      </>
  );
}
