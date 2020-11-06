import React, { Fragment } from 'react'

const DetailsPane = ({ itemData, totalCost, priceBreakdown, totalStats, allUniquePassives, allActiveAbilities, showOverAll, onShowOverall }) => {

  return (
    <Fragment>
      {showOverAll === false ? (
        <Fragment>
          {/* Item Name and Price */}
          {itemData && itemData.portrait && (
            <Fragment>
              <div className="itemDetailsContainer">
                {/* Item Portrait, Name & Price  */}
                <div className="row detailedInfoContainer">
                  {/* Item Portrait */}
                  <div className="col portraitContainer">
                    <div key={itemData.id} className="itemPortraitBig">
                      <img src={itemData.portrait} alt={itemData.name} />
                    </div>
                  </div>
                  {/* Item Name and Price  */}
                  <div className="col mainInfoContainer">
                    <div className="row itemName">{itemData.name}</div>
                    <div className="row itemPrice"> 
                      <span className="goldIcon"></span>
                      {itemData.price}
                    </div>
                  </div>
                </div>

                {/* Item Attributes, Stats & Effects  */}
                <div className="row itemEffectsContainer">
                  {/* Item Stats */}
                  {itemData.stats && (
                    <div className="row itemStats">
                      {itemData.stats.map(stat => (
                        <span key={stat.name}>
                          +{stat.value}
                          {stat.type === "percent" && "%"}
                          {' '}
                          {stat.name}
                        </span>
                      ))}
                    </div>
                    )
                  }
                  {/* Item Attributes  */}
                  {itemData.attributes && (
                    <div className="row itemAttributes">
                      {itemData.attributes.map((attribute, i) => (
                        <Fragment key={i}>
                          <p className="attributeName">{attribute.name ? `Attribute - ${attribute.name}` : "Attribute:"}</p>
                          <p className="attributeDesc">{attribute.desc}</p>
                        </Fragment>
                      ))}
                    </div>
                  )}
                  {/* Unique Passives  */}
                  {itemData.uniquePassives && (
                    <div className="row itemPassives">
                      {itemData.uniquePassives.map((passive, i) => (
                        <Fragment key={i}>
                          <p className="passiveName">{passive.name ? `Unique Passive - ${passive.name}:` : "Unique Passive:"}</p>
                          <p className="passiveDesc">{passive.desc}</p>
                        </Fragment>
                      ))}
                    </div>
                  )}

                  {/* Item Effects  */}
                  {itemData.specialEffects && (
                    <div className="row itemEffects">
                      {itemData.specialEffects.map((effect, i) => (
                        <Fragment key={i}>
                          <p className="effectName">{effect.name}:</p>
                          <p className="effectDesc">{effect.desc}</p>
                        </Fragment>
                      ))}
                    </div>
                  )}
                  
                  {/* Active Ability  */}
                  {itemData.activeAbility && (
                    <div className="row itemActiveAbility">
                      <p className="activeAblityName">Active Ability - {itemData.activeAbility.name}:</p>
                      <p className="activeAblityDesc">{itemData.activeAbility.desc}</p>
                      {itemData.activeAbility.manaCost && (
                        <p className="activeAblityManaCost">Mana Cost: <span>{itemData.activeAbility.manaCost}</span></p>
                      )}
                      <p className="activeAblityCooldown">Cooldown: <span>{itemData.activeAbility.cooldown}s</span></p>
                      {itemData.activeAbility.castRange && (
                        <p className="activeAblityCastRange">Cast Range: <span>{itemData.activeAbility.castRange}</span></p>
                      )}
                      {itemData.activeAbility.effectRadius && (
                        <p className="activeAblityEffectRadius">Effect Radius: <span>{itemData.activeAbility.effectRadius}</span></p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="row detailsButtonContainer">
                <div className="detailsBtn" onClick={onShowOverall}>SHOW BUILD DETAILS</div>
              </div>
            </Fragment>
          )}
        </Fragment>   
      ) : (
        <Fragment>
          <div className="buildDetailsContainer">
            {totalCost !== 0 && (
              <div className="row totalCostContainer">
                <div className="costHeader">BUILD TOTAL COST</div>
                <div className="priceBreakdown">
                  <div className="breakdownHeader">COST BREAKDOWN</div>
                  {priceBreakdown.map((item, i) => (
                    <div key={i} className="itemInfo">
                      <img className="smallPortrait" src={item.portrait} alt={item.name} />  
                      <span className="goldIcon"></span> <span className="itemPrice">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="priceContainer">
                  <div className="totalText">TOTAL COST </div>
                  <span className="goldIcon"></span> 
                  <span className="itemPrice">{totalCost}</span>
                </div>
              </div>
            )}
            <div className="row statsContainer">
              <div className="statsHeader">STATS FROM ITEMS</div>
              <div className="row">
                {/* Left Column Stats */}
                <div className="col statsCol">
                  <p className="statName">HEALTH: <span className={totalStats.health !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.health}</span> </p>
                  <p className="statName">MANA: <span className={totalStats.mana !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.mana}</span> </p>
                  <p className="statName">STR: <span className={totalStats.strength !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.strength}</span> </p>
                  <p className="statName">AGI: <span className={totalStats.agility !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.agility}</span> </p>
                  <p className="statName">INT: <span className={totalStats.intelligence !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.intelligence}</span> </p>
                  <p className="statName">SP POW: <span className={totalStats.spellPower !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.spellPower}</span> </p>
                  <p className="statName">ARMOR: <span className={totalStats.armor !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.armor}</span> </p>
                  <p className="statName">SP RES: <span className={totalStats.spellResist !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.spellResist}</span> </p>
                  <p className="statName">DODGE: <span className={totalStats.dodge !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.dodge !== 0 ? `${totalStats.dodge} %` : totalStats.dodge}</span> </p>
                </div>
                {/* Right Column Stats */}
                <div className="col statsCol">
                  <p className="statName">DAMAGE: <span className={totalStats.damage !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.damage}</span> </p>
                  <p className="statName">SPEED: <span className={totalStats.movementSpeed !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.movementSpeed}</span> </p>
                  <p className="statName">ATK SPEED: <span className={totalStats.attackSpeed !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.attackSpeed}</span> </p>
                  <p className="statName">PHY LS: <span className={totalStats.physicalLifeSteal !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.physicalLifeSteal !== 0 ? `${totalStats.physicalLifeSteal} %` : totalStats.physicalLifeSteal}</span> </p>
                  <p className="statName">MAG LS: <span className={totalStats.magicalLifeSteal !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.magicalLifeSteal !== 0 ? `${totalStats.magicalLifeSteal} %` : totalStats.magicalLifeSteal}</span> </p>
                  <p className="statName">HP REGEN: <span className={totalStats.healthRegen !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.healthRegen}</span> </p>
                  <p className="statName">MP REGEN: <span className={totalStats.manaRegen !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.manaRegen !== 0 ? `${totalStats.manaRegen} %` : totalStats.manaRegen}</span> </p>
                  <p className="statName">CDR: <span className={totalStats.cooldownReduction !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.cooldownReduction !== 0 ? `${totalStats.cooldownReduction} %` : totalStats.cooldownReduction}</span> </p>
                  <p className="statName">ALL ATTR: <span className={totalStats.allAttributes !== 0 ? "statValue" : "defaultStatValue"}>{totalStats.allAttributes}</span> </p>
                </div>
              </div>
            </div>
            <div className="row uniquePassivesContainer">
              {allUniquePassives && allUniquePassives.length !== 0 && (
                <Fragment>
                  <div className="passivesHeader">UNIQUE PASSIVES</div>
                  <div className="passiveContainer">
                    {allUniquePassives.map((item) => (
                      <Fragment key={item.id}>
                        {item.uniquePassives.length !== 0 && (
                          <Fragment>
                            <div className="itemInfo">
                              <img className="smallPortrait" src={item.portrait} alt={item.name} />
                            </div>
                            {item.uniquePassives.map((passive, i) => (
                              <div key={i} className="passivesContainer">
                                <p className="passivesText">
                                  <span className="passiveSeparator">{passive.name ? `${passive.name} -` : ">"}</span> {passive.desc}
                                </p>
                              </div>
                            ))}
                          </Fragment>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
            <div className="row activeAbilitiesContainer">
              {allActiveAbilities && allActiveAbilities.length !== 0 && (
                <Fragment>
                  <div className="activesHeader">ACTIVE ITEMS</div>
                  <div className="activesContainer">
                    {allActiveAbilities.map((abilityInfo, i) => (
                      <Fragment key={i}>
                        <div className="row itemActiveAbility">
                          <img key={i} src={abilityInfo.portrait} alt={abilityInfo.name} className="smallPortrait"/>
                          <p className="activeAblityName">{abilityInfo.activeAbility.name}:</p>
                          <p className="activeAblityDesc">{abilityInfo.activeAbility.desc}</p>
                          {abilityInfo.activeAbility.manaCost && (
                            <p className="activeAblityManaCost">Mana Cost: <span>{abilityInfo.activeAbility.manaCost}</span></p>
                          )}
                          <p className="activeAblityCooldown">Cooldown: <span>{abilityInfo.activeAbility.cooldown}s</span></p>
                          {abilityInfo.activeAbility.castRange && (
                            <p className="activeAblityCastRange">Cast Range: <span>{abilityInfo.activeAbility.castRange}</span></p>
                          )}
                          {abilityInfo.activeAbility.effectRadius && (
                            <p className="activeAblityEffectRadius">Effect Radius: <span>{abilityInfo.activeAbility.effectRadius}</span></p>
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="row detailsButtonContainer">
            <div className="detailsBtn" onClick={onShowOverall}>HIDE BUILD DETAILS</div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default DetailsPane;
