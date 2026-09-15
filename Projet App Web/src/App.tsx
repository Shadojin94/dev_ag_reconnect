import { AsciiBackground } from './components/index.ts'
import { ChatWindow } from './features/base-connaissances/index.ts'
import styles from './App.module.css'

function App() {
  return (
    <>
      <AsciiBackground />
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              <svg className={styles.logo} viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
              </svg>
            </span>
            <span className={styles.name}>
              Reconnect <em className={styles.accent}>Assist</em>
            </span>
          </div>
          <span className={styles.badge}>
            <span className={styles.badgeScope}>Base de connaissances · </span>Kimi K3
          </span>
        </header>
        <main className={styles.main}>
          <ChatWindow lang="fr" />
        </main>
      </div>
    </>
  )
}

export default App
