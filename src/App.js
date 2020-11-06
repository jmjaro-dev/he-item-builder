import React, { useState } from 'react';
import './App.css';
// Components
import Navbar from './components/layout/Navbar';
// import LeftMenu from './components/LeftMenu/LeftMenu';
import BuildsPane from './components/builds/BuildsPane';
import ItemsPane from './components/ItemsPane/ItemsPane';
// // Firebase DB
// import firebasedb from './db/firebase';

function App() {
  // States
  // const [activeMenu, setActiveMenu] = useState("CREATE BUILD");
  const [myBuilds, setMyBuilds] = useState([]);
  const [currentHeroCategory, setHeroCategory] = useState('Strength');
  const [currentItemCategory, setItemCategory] = useState('Physical');
  
  // const menus = ["MY BUILDS", "CREATE BUILD"];
  const heroCategories = ['Strength', 'Agility', 'Intelligence'];
  const itemCategories = ['Physical', 'Magical', 'Durable', 'Boots', 'Wards'];
  const activeMenu = "CREATE BUILD";
  // const onSetActiveMenu = e => {
  //   setActiveMenu(e.target.innerText);
  //   console.log(myBuilds);
  // }

  const onSetHeroCategory = e => {
    setHeroCategory(e.target.innerText)
  }

  const onSetItemCategory = e => {
    setItemCategory(e.target.innerText)
  }

  return (
    <div className="App">
      <div id="mainContainer">
        <Navbar />
        <div className="mainContent">
          {/* <LeftMenu menus={menus} activeMenu={activeMenu} onSetActiveMenu={onSetActiveMenu}/> */}
          {activeMenu === 'CREATE BUILD' ? ( 
            <ItemsPane myBuilds={myBuilds} setMyBuilds={setMyBuilds} itemCategories={itemCategories} heroCategories={heroCategories} activeMenu={activeMenu} currentHeroCategory={currentHeroCategory} currentItemCategory={currentItemCategory} onSetHeroCategory={onSetHeroCategory} onSetItemCategory={onSetItemCategory} />
          ) : (
            <BuildsPane myBuilds={myBuilds} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
