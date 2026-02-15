import { Link } from 'react-router-dom';
import { footerLinks } from '../../data/navigation';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>学习资源</h4>
          {footerLinks.learning.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="footer-section">
          <h4>官方资源</h4>
          {footerLinks.official.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-section">
          <h4>社区</h4>
          {footerLinks.community.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>LangChain4j 学习指南 - 帮助新人快速掌握 Java AI 开发</p>
      </div>
    </footer>
  );
};

export default Footer;
