import React from 'react';

function LeftMenu({menus, activeMenu, onSetActiveMenu}) {

  return (
    <div id="leftMenu">
      <div className="col">
        {menus.map(menu => (
          <div key={menu} className={menu !== activeMenu ? "menu" : "menu active"} onClick={onSetActiveMenu}>
            {menu}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftMenu;