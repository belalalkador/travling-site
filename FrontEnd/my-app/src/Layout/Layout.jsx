import Footer from "../Sections/Footer";
import Header from "../Sections/Header";
import "./layout.css"; // <<< Import the CSS

export const Layout = ({children}) => {
  return (
    <div className="layout-container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
