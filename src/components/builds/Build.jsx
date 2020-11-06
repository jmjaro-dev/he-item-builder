import React from 'react';

const Build = ({ itemBuild, heroInfo }) => {

  return (
    <div className="buildInfo">
      <div className="row">
        {/* Hero Portrait */}
        <div className="col portrait">
          <img src={heroInfo.portrait} alt={heroInfo.name}/>
        </div>
        
        {/* Item Build */}
        <div className="col buildItems">
          {/* 2nd Row */}
          <div className="row">
            {/* Current Items in Build */}
            <div className="row">
              { itemBuild.map(item => (
                  <div key={item.position} className="itemPortrait" data-id={item.id} data-position={item.position} >
                    {!item.isEmpty ? (
                      <div>
                        <img src={item.portrait} alt={item.name}/>
                      </div>
                    ) : (
                      <div className="itemPlaceholder">
                        
                      </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Build;