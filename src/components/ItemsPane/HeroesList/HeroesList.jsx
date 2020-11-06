import React from 'react'

const HeroesList = ({ heroes, currentHeroCategory, onSetCurrentHero }) => {
  return (
    <div className="heroesList">
      <div className="heroesListContainer">
        {heroes.filter(hero => hero.category === currentHeroCategory).map(hero => (
          <div key={hero.id} className="heroContainer">
            <div className="heroPortrait" onClick={onSetCurrentHero} hero-name={hero.name} hero-portrait={hero.portrait}>
              <img src={hero.portrait} alt={hero.name} />
            </div>
            <p className="heroName">{hero.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroesList;
