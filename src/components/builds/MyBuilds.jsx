import React, { Fragment } from 'react';
// Components
import Build from './Build';

const MyBuilds = ({ myBuilds }) => {
  return (
    <Fragment>
      {myBuilds.map((buildInfo, i) => (
        <Build key={i} itemBuild={buildInfo.itemBuild} heroInfo={buildInfo.heroInfo}/>
      ))}
    </Fragment>
  )
}

export default MyBuilds;