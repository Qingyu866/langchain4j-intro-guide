import { NavLink } from 'react-router-dom';
import { navigationData } from '../../data/navigation';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg className="sidebar-logo-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h1 className="sidebar-logo-title">LangChain4j</h1>
            <p className="sidebar-logo-subtitle">入门指南</p>
          </div>
        </div>

        <div className="space-y-6">
          {navigationData.map((group) => (
            <div key={group.title} className="sidebar-nav-group">
              <h3 className="sidebar-nav-title">{group.title}</h3>
              <ul className="sidebar-nav-list">
                {group.items.map((item) => (
                  <li key={item.pageId}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar-nav-link ${isActive ? 'active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
