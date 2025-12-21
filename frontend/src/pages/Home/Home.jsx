import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [activeSection, setActiveSection] = useState("home");

  const handleViewMenu = () => {
    const menuSection = document.getElementById("explore-menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      const headerSection = document.getElementById("header");
      const menuSection = document.getElementById("explore-menu");

      if (menuSection && scrollPosition >= menuSection.offsetTop) {
        setActiveSection("menu");
      } else if (headerSection && scrollPosition >= headerSection.offsetTop) {
        setActiveSection("home");
      }

      sessionStorage.setItem("activeSection", activeSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  return (
    <>
      <div id="header">
        <Header onViewMenu={handleViewMenu} />
      </div>
      <div id="explore-menu">
        <ExploreMenu setCategory={setCategory} category={category} />
      </div>
      <FoodDisplay category={category} />
    </>
  );
};

export default Home;