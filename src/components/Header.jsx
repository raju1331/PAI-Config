const NAV_TABS = ["Design", "Configure", "Simulate", "Deploy"];
import paiLogo from "../assets/pai.svg";
import saveIcon from "../assets/icon.svg";
import launchIcon from "../assets/launch.svg";
import sidebarIcon from "../assets/iconoir_sidebar-collapse.svg";
import backIcon from "../assets/lsicon_left-filled.svg";

export default function Header() {
  return (
    <header className="header">

      <div className="header__left">
                <button className="header__back-btn">
          <img src={backIcon} alt="Back" className="header__icon" />
        </button>

        <div className="header__logo">
           <img src={paiLogo} alt="PAI" className="header__logo-img" />
          <span className="header__logo-text">Configurator</span>
        </div>

<button className="header__sidebar-btn">
          <img src={sidebarIcon} alt="Sidebar" className="header__icon" />
        </button>
        <div className="header__divider" />
      </div>
 <div className="header__actions">
        <button className="btn-secondary">
          <img src={saveIcon} alt="Save" className="header__btn-icon" />
          Save
        </button>
        <button className="btn-primary">
          <img src={launchIcon} alt="Launch" className="header__btn-icon" />
         ▶ Launch
        </button>
      </div>
     

    </header>
  );
}
