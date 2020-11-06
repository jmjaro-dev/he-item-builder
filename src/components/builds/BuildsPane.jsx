import React, { Fragment } from 'react';
// Component
import MyBuilds from './MyBuilds';
import DetailsPane from './DetailsPane';

const BuildsPane = ({ myBuilds }) => {
  return (
    <Fragment>
      <div id="buildsPane" className="col">
        <MyBuilds myBuilds={myBuilds} />
      </div>

      <div id="detailsPane" className="col">
        <DetailsPane />
        {/* <DetailsPane itemData={itemData} totalCost={totalCost} priceBreakdown={priceBreakdown} totalStats={totalStats} allUniquePassives={allUniquePassives} allActiveAbilities={allActiveAbilities} showOverAll={showOverAll} onShowOverall={onShowOverall}/> */}
      </div>
    </Fragment>
  )
}

export default BuildsPane
