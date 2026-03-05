const NAV_TABS = ["Design", "Configure", "Simulate", "Deploy"];

export default function Header() {
  return (
    <header className="header">

      <div className="header__left">
        <div className="header__logo">
          <div className="header__logo-icon">P</div>
          <span className="header__logo-text">PAI Configurator</span>
        </div>

        <div className="header__divider" />
      </div>

      {/* ── Right: Action buttons ── */}
      <div className="header__actions">
        <button className="btn-secondary">Save</button>
        <button className="btn-primary">▶ Launch</button>
      </div>

    </header>
  );
}
