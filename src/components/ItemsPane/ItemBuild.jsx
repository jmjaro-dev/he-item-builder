import React, { Fragment } from 'react';

const ItemBuild = ({ itemBuild, tempBuild, activeItemInBuild, currentHero, edit, onSetEditMode, onSetHeroSelect, onAddItem, onRemoveItem, onClearBuild, onConfirmBuild, onCancelBuild, onSetCurrentItem }) => {

  return (
    <div id="itemBuild">
      <div className="row">
        {/* Select Hero */}
        <div className="col heroPanel">
          {/* Select Hero Button */}
          <div className="selectHeroBtn" onClick={onSetHeroSelect}>HERO</div>

          {/* Hero Portrait */}
          <div  className="heroPortrait">
            <img src={currentHero.portrait} alt={currentHero.name}/>
          </div>
        </div>

        {/* Item Build */}
        <div className="col buildPanel">
          {/* Item Build Panel */}
          <div className="row itemBuildPanel">
            {/* Current Items in Build */}
            <div className="col itemBuild" onClick={onSetCurrentItem}>
              {!edit ? ( itemBuild.map(item => (
                  <div key={item.position} className={!item.isEmpty && item.id === activeItemInBuild.id && item.position === activeItemInBuild.pos ? "itemPortrait active" : "itemPortrait"} data-id={item.id} data-position={item.position}>
                    {!item.isEmpty ? (
                      <div>
                        {edit && (
                          <span className="removeItem" data-position={item.position} onClick={onRemoveItem}>x</span>
                        )}
                        <img src={item.portrait} alt={item.name} />
                      </div>
                    ) : (
                      <div className="itemPlaceholder">
                        {edit && (
                          <div className="addBtn" data-position={item.position} onClick={onAddItem}>
                            ADD
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : ( tempBuild.map(item => (
                  <div key={item.position} className="itemPortrait" data-id={item.id} data-position={item.position} >
                    {!item.isEmpty ? (
                      <div>
                        {edit && (
                          <span className="removeItem" data-position={item.position} onClick={onRemoveItem}>x</span>
                        )}
                        <img src={item.portrait} alt={item.name}/>
                      </div>
                    ) : (
                      <div className="itemPlaceholder">
                        {edit && (
                          <div className="addBtn" data-position={item.position} onClick={onAddItem}>
                            ADD
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )
              }
            </div>
            {/* Buttons */}
            <div className="col buildBtns">
              {!edit ? (
                <Fragment>
                  {/* Edit Btn */ }
                  <div className="editBtn" onClick={onSetEditMode}> EDIT </div>
                  {/* Save Btn */}
                  <div className="saveBtn" onClick={onClearBuild}> CLEAR </div>
                </Fragment>
              ) : (
                <Fragment>
                  {/* OK Btn */}
                  <div className="okBtn" onClick={onConfirmBuild}> OK </div>
                  {/* Cancel Btn */ }
                  <div className="cancelBtn" onClick={onCancelBuild}> CANCEL </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemBuild;