import React, { Fragment } from 'react';

const BootsItemsList = ({ items, currentItem, onSetCurrentItem }) => {
  return (
    <div className="itemsListContainer" onClick={onSetCurrentItem}>
      {/* Column 1 */}
      <div className="col">
        {/* Limit Items to 1st column only */}
        {items.map((item, i) => (
          <Fragment key={item.id}>
            {i === 0 && (
              <div className="itemContainer" data-id={item.id}>
                {/* Item Portrait */}
                <div className={item.id !== currentItem ? "itemPortrait" : "itemPortrait active"}>
                  <img src={item.portrait} alt={item.name}/>
                </div>
                {/* Item Info */}
                <div className="itemQuickInfo">
                  <div className="itemName">{item.name}</div>
                  <div className="itemPrice">{item.price}</div>
                </div>
              </div>
            )}
          </Fragment>
        ))}  
      </div>

      {/* Column 2 */}
      <div className="col">
        {/* Limit Items to 2nd column only */}
        {items.map((item, i) => (
          <Fragment key={item.id}>
            {i > 0 && i < 7 && (
              <div className="itemContainer" data-id={item.id}>
                {/* Item Portrait */}
                <div className={item.id !== currentItem ? "itemPortrait" : "itemPortrait active"}>
                  <img src={item.portrait} alt={item.name}/>
                </div>
                {/* Item Info */}
                <div className="itemQuickInfo">
                  <div className="itemName">{item.name}</div>
                  <div className="itemPrice">{item.price}</div>
                </div>
              </div>
            )}
          </Fragment>
        ))}  
      </div>

      {/* Column 3 */}
      <div className="col">
        {/* Limit Items to 3rd column only */}
        {items.map((item, i) => (
          <Fragment key={item.id}>
            {i > 6  && (
              <div className="itemContainer" data-id={item.id}>
                {/* Item Portrait */}
                <div className={item.id !== currentItem ? "itemPortrait" : "itemPortrait active"}>
                  <img src={item.portrait} alt={item.name}/>
                </div>
                {/* Item Info */}
                <div className="itemQuickInfo">
                  <div className="itemName">{item.name}</div>
                  <div className="itemPrice">{item.price}</div>
                </div>
              </div>
            )}
          </Fragment>
        ))}  
      </div>
    </div>
  )
}

export default BootsItemsList;