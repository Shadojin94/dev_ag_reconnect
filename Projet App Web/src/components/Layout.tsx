import type { ReactNode } from 'react'
import { registry, SLOTS } from '../app/registry'
import type { Route } from '../app/router'
import styles from './Layout.module.css'

interface LayoutProps {
  route: Route
  children: ReactNode
}

const REPO_URL = 'https://github.com/Shadojin94/dev_ag_reconnect'

/** En-tête, navigation par hash et pied de page communs à toutes les routes. */
export function Layout({ route, children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="#/">Reconnect Assist</a>
        <nav aria-label="Navigation principale">
          <ul className={styles.nav}>
            <li>
              <a
                aria-current={route === '' ? 'page' : undefined}
                className={route === '' ? styles.linkActive : styles.link}
                href="#/"
              >
                Accueil
              </a>
            </li>
            {SLOTS.map((slot) => {
              const page = registry[slot]
              const active = route === slot
              return (
                <li key={slot}>
                  <a
                    aria-current={active ? 'page' : undefined}
                    className={active ? styles.linkActive : styles.link}
                    href={`#/${slot}`}
                  >
                    {page.name}
                    {!page.ready && <span className={styles.dot} title="Lot en attente">en attente</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Démo formation IA : Développeur Augmenté, 15 septembre 2026
        </p>
        <p className={styles.footerText}>
          <a href={REPO_URL} rel="noreferrer noopener" target="_blank">Dépôt du projet</a>
        </p>
      </footer>
    </div>
  )
}
