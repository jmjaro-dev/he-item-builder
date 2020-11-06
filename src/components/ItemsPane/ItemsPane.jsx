import React, { Fragment, useState } from 'react';
// Components
import ItemBuild from './ItemBuild';
import DetailsPane from './DetailsPane';
// Heroes List
import HeroesList from './HeroesList/HeroesList';
// Items Lists
import PhysicalItemsList from './PhysicalItems/PhysicalItemsList';
import MagicalItemsList from './MagicalItems/MagicalItemsList';
import DurableItemsList from './DurableItems/DurableItemsList';
import BootsItemsList from './BootsItems/BootsItemsList';
import WardsItemsList from './WardItems/WardsItemsList';
// Databases
import { heroes } from './db/heroesdb';
import { physicalItems, magicalItems, durableItems, bootsItems, wardsItems } from './db/itemsdb';
// Portrait
import defaultHeroPortrait from '../../assets/img/heroes/intelligence/NOSFERATU.jpg';

const ItemsPane = ({ myBuilds, setMyBuilds, itemCategories, heroCategories, activeMenu, currentHeroCategory, currentItemCategory,  onSetHeroCategory, onSetItemCategory }) => {
  const [heroSelect, setHeroSelect] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const defaultHero = { name:'Nosferatu', portrait: defaultHeroPortrait };
  const [currentHero, setCurrentHero] = useState(defaultHero);
  const [edit, setEdit] = useState(false);
  const [showOverAll, setShowOverAll] = useState(false);
  const [activeItemInBuild, setActiveItemInBuild] = useState({});
  const initBuild = [
    { isEmpty: true, position: 0 },
    { isEmpty: true, position: 1 },
    { isEmpty: true, position: 2 },
    { isEmpty: true, position: 3 },
    { isEmpty: true, position: 4 },
    { isEmpty: true, position: 5 }
  ];
  
  const [itemBuild, setItemBuild] = useState(initBuild);
  const [tempBuild, setTempBuild] = useState(itemBuild);
  const initStats = { 
    health: 0,
    mana: 0,
    strength: 0,
    agility: 0,
    intelligence: 0,
    damage: 0,
    armor: 0,
    spellPower: 0,
    spellResist: 0,
    movementSpeed: 0,
    physicalLifeSteal: 0,
    magicalLifeSteal: 0,
    attackSpeed: 0,
    healthRegen: 0,
    manaRegen: 0,
    dodge: 0,
    cooldownReduction: 0,
    allAttributes: 0
  }
  const [allUniquePassives, setAllUniquePassives] = useState([]);
  const [allActiveAbilities, setAllActiveAbilities] = useState([]);
  const [totalStats, setTotalStats] = useState(initStats);
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // ? Set Edit Mode
  const onSetEditMode = _ => {
    setEdit(!edit);
  }

  // ? Adds Item to ItemBuild state
  const onAddItem = e => {
    const itemPos = Number(e.target.getAttribute("data-position"));
    // Check if itemData is not empty/null
    if(itemData) {
      const { id, name, portrait, price, category, stats, attributes, uniquePassives, activeAbility } = itemData;
      // Add Item Info to correct position
      const updatedBuild = tempBuild.map(item => {
        const addedItem = { 
          id, 
          name, 
          portrait,
          price,
          category,
          stats,
          attributes,
          uniquePassives,
          activeAbility,
          isEmpty: false, 
          position: itemPos 
        };

        if(item.position === itemPos) {
          return addedItem;
        } 
        return item;
      })
      // Update tempBuild state
      setTempBuild(updatedBuild);
    }
  }

  // ? Removes item from ItemBuild state
  const onRemoveItem = e => {
    const itemPos = Number(e.target.getAttribute("data-position"));
    
    // Add Item Info to correct position
    const updatedBuild = tempBuild.map(item => {
      const removedItem = { 
        isEmpty: true,
        position: itemPos 
      };

      if(item.position === itemPos) {
        return removedItem;
      } 
      return item;
    })
    // Update itemBuild state
    setTempBuild(updatedBuild);
  }

  // ? cancel Build
  const onCancelBuild = _ => {
    setTempBuild(itemBuild);
    setEdit(false);
  }

  // ? confirm Build
  const onConfirmBuild = _ => {
    setItemBuild(tempBuild);
    setEdit(false);
    computeStats(tempBuild);
    getUniquePassives(tempBuild);
    getUniqueActiveAbilities(tempBuild);
    computeTotalCost(tempBuild);
  }

  // ? Clears the Build 
  const onClearBuild = _ => {
    // // Create a new myBuilds Array
    // const buildInfo = {
    //   itemBuild,
    //   heroInfo: currentHero,
    //   buildDetails: {
    //     totalStats,
    //     allUniquePassives,
    //     allActiveAbilities,
    //     priceBreakdown,
    //     totalCost
    //   }
    // }
    // const newBuild = myBuilds.concat([buildInfo]);
    // setMyBuilds(newBuild);

    // reset the Build
    resetStates();
  }

  // ? Reset States
  const resetStates = _ => {
    setCurrentHero(defaultHero);
    setCurrentItem(null);
    setItemData(null);
    setActiveItemInBuild({})
    setItemBuild(initBuild);
    setTempBuild(initBuild);
    setShowOverAll(false);
    setAllUniquePassives([]);
    setAllActiveAbilities([]);
    setPriceBreakdown([]);
    setTotalStats(initStats);
    setTotalCost(0);
  }

  // ? Computes the Overall Stats of all items in the Build
  const computeStats = build => {
    let HP, MANA, STR, AGI, INT, DMG, ARMOR, SP, SR, MS, PLS, MLS, AS, HPRG, MPRG, DODGE, ALLATTR, CDR;
    HP = MANA = STR = AGI = INT = DMG = ARMOR = SP = SR = MS = PLS = MLS = AS = HPRG = MPRG = DODGE = ALLATTR = CDR = 0;
    let baseSpeed = 500, attrAddSpeed = 0, passiveAddSpeed = 0;

    // ? Gets Unique Passives of Physical LifeSteal
    const PLSPassives = [...new Set(build.map(item => {
      if(item.uniquePassives) {
        if(item.uniquePassives[0].desc.indexOf("Physical Life Steal") > -1)
        {
          return item.uniquePassives[0].desc;
        }
      }
      return false;
    }))];
    const uniquePLSPassives = PLSPassives.filter(passive => passive !== false);
    
    // * Compute Physical Life Steal
    uniquePLSPassives.forEach(passive => {
      if(passive.indexOf("% Physical Life Steal") > -1 && passive.indexOf("% Physical Life Steal") < 4 ) {
        PLS += Number(passive.substr(1, 2));
      }
    })

    // ? Gets Unique Passives of Magical LifeSteal
    const MLSPassives = [...new Set(build.map(item => {
      if(item.uniquePassives) {
        if(item.uniquePassives[0].desc.indexOf("Magical Life Steal") > -1)
        {
          return item.uniquePassives[0].desc;
        }
      }
      return false;
    }))];
    const uniqueMLSPassives = MLSPassives.filter(passive => passive !== false);

    // * Compute Magical Life Steal
    if(uniqueMLSPassives.length === 1) {
      MLS += Number(uniqueMLSPassives[0].substr(1, 2));
    } 
    
    if(uniqueMLSPassives.length > 1){
      const item1 = Number(uniqueMLSPassives[0].substr(1, 2));
      const item2 = Number(uniqueMLSPassives[1].substr(1, 2));

      if(item1 < item2) {
        MLS += item1;
      } else {
        MLS += item2;
      }
    }

    // ? Gets Unique Passives for Base Movement Speed from boots
    const MSBase = [...new Set(build.map(item => {
      if(item.uniquePassives) {
        // Get Base Speed stats
        if(item.uniquePassives[0].name === "Dash I" || item.uniquePassives[0].name === "Dash II" || item.uniquePassives[0].name === "Dash III")
        {
          return item.uniquePassives[0].desc;
        }
      }
      
      return false;
    }))];
    const uniqueMSBasePassives = MSBase.filter(passive => passive !== false);
    
    // ? Gets Unique Passives for Additional Movement Speed from boots
    const MSAdd = [...new Set(build.map(item => {
      if(item.uniquePassives && item.uniquePassives.length === 2) {
        // Get Base Speed stats
        if(item.uniquePassives[1].name === "Holy Passage I")
        {
          return item.uniquePassives[1].name;
        }
      }
      if(item.uniquePassives && item.uniquePassives.length === 3 ) {
        // Get Base Speed stats
        if(item.uniquePassives[2].name === "Holy Passage II") {
          return item.uniquePassives[2].name;
        }
      }

      return false;
    }))];
    const uniqueMSAddSpeed = MSAdd.filter(passive => passive !== false);

    // ? Gets Unique Attributes of Travel for Additional Movement Speed 
    const travelAttributes = [...new Set(build.map(item => {
      if(item.attributes) {
        // Get Base Speed stats
        if(item.attributes[0].name === "Travel I" || item.attributes[0].name === "Travel II"  )
        {
          return item.attributes[0].name;
        }
      }

      return false;
    }))];
    const uniqueTravelAttributes = travelAttributes.filter(attribute => attribute !== false);
    
    // * Compute Additional Movement Speed from Attributes 
    if( uniqueTravelAttributes.length === 1 ) {
      if(uniqueTravelAttributes[0] === "Travel I") {
        attrAddSpeed = baseSpeed * 0.1;
      } else {
        attrAddSpeed = baseSpeed * 0.12;
      }
      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    } 
    if(uniqueTravelAttributes.length > 1) {
      attrAddSpeed = baseSpeed * 0.12;
      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    }
    
    // * Compute Additional Movement Speed Unique Passives
    if( uniqueMSAddSpeed.length === 1 ) {
      if(uniqueMSAddSpeed[0] === "Holy Passage I") {
        passiveAddSpeed = baseSpeed * 0.06;
      } else {
        passiveAddSpeed = baseSpeed * 0.08;
      }
      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    } 
    if(uniqueMSAddSpeed.length > 1) {
      passiveAddSpeed = baseSpeed * 0.08;
      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    }

    // * Compute Movement Speed
    if(uniqueMSBasePassives.length === 1) {
      passiveAddSpeed += Number(uniqueMSBasePassives[0].substr(1, 2));
      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    } 
    
    if(uniqueMSBasePassives.length === 2) {
      const item1 = Number(uniqueMSBasePassives[0].substr(1, 2));
      const item2 = Number(uniqueMSBasePassives[1].substr(1, 2));

      if(item1 > item2) {
        passiveAddSpeed += item1;
      } else {
        passiveAddSpeed += item2;
      }

      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    } 
    if(uniqueMSBasePassives.length === 3) {
      const item1 = Number(uniqueMSBasePassives[0].substr(1, 2));
      const item2 = Number(uniqueMSBasePassives[1].substr(1, 2));
      const item3 = Number(uniqueMSBasePassives[2].substr(1, 2));

      if(item1 > item2 && item1 > item3){
        passiveAddSpeed += item1;
      } 
      if(item2 > item1 && item2 > item3){
        passiveAddSpeed += item2;
      } 
      if(item3 > item1 && item3 > item2){
        passiveAddSpeed += item3;
      }

      MS = baseSpeed + passiveAddSpeed + attrAddSpeed;
    }

    // ? Gets Unique Passives for Dodge Chance
    const DodgeChances = [...new Set(build.map(item => {
      if(item.name === "EVASION RUNE"){
        return item.uniquePassives[0].desc;
      }
      if(item.name === "LIFE SPRING"){
        return item.uniquePassives[1].desc;
      }
      if(item.name === "DELAY SHIELD"){
        return item.uniquePassives[0].desc;
      }
      if(item.name === "BUTTERFLY WINGS"){
        return item.uniquePassives[0].desc;
      }

      return false;
    }))];
    const uniqueDodgeChance = DodgeChances.filter(passive => passive !== false);

    // * Compute Dodge Chance
    if(uniqueDodgeChance.length !== 0) {
      let dodge = 0;
      uniqueDodgeChance.forEach(item => {
        dodge += Number(item.substr(1,2));
      })
      
      if(dodge < 35) {
        DODGE = dodge;
      } else {
        DODGE = 35;
      }
    }

    // ? Gets Unique Cooldown Reduction from boots 
    const bootsCDRS = [...new Set(build.map(item => {
      if(item.name === "WIZARD BOOTS") {
        return item.name;
      }
      return false;
    }))];
    const bootsCDR = bootsCDRS.filter(cdr => cdr !== false);
    // console.log("Boots CDR: ", bootsCDR);

    // ? Gets Unique Cooldown Reduction from Physical Items
    const physicalCDRS = [...new Set(build.map(item => {
      if(item.category === "Physical" && item.uniquePassives){
        if(item.uniquePassives.length > 0) {
          return item.uniquePassives.map(passive => {
            if(passive.name.indexOf("Fast Casting") > -1) {
              return item.name;
            }          
            return false;
          }).filter(item => item !== false)[0];
        }
        return false;  
      }
      return false;
    }))];
    let phyCDRNames, uniquePhyCDR, physicalCDR;
    phyCDRNames = physicalCDRS.filter(item => item !== false && item !== undefined);

    if(phyCDRNames.length > 0 ) {
      uniquePhyCDR = phyCDRNames.map(itemName => {
        return build.map(item => {
          if(item.name === itemName && item.uniquePassives.length > 0) {
            return item.uniquePassives.map(passive => {
              if(passive.name.indexOf("Fast Casting") > -1) {
                return passive.desc;
              }
              return false;
            }).filter(item => item !== false)[0];
          }
          return false;
        }).filter(item => item !== false)[0];
      })
      physicalCDR = uniquePhyCDR.filter(item => item !== false);
      // console.log("Phy CDR:", physicalCDR);
    }

    // ? Gets Unique Cooldown Reduction from Magical Items
    const magicalCDRS = [...new Set(build.map(item => {
      if(item.category === "Magical" && item.uniquePassives){
        if(item.uniquePassives.length > 0) {
          return item.uniquePassives.map(passive => {
            if(passive.name.indexOf("Fast Casting") > -1) {
              return item.name;
            }          
            return false;
          }).filter(item => item !== false)[0];
        }
        return false;  
      }
      return false;
    }))];
    let magCDRNames, uniqueMagCDR, magicalCDR;
    magCDRNames = magicalCDRS.filter(item => item !== false && item !== undefined);
    
    if(magCDRNames.length > 0 ) {
      uniqueMagCDR = magCDRNames.map(itemName => {
        return build.map(item => {
          if(item.name === itemName && item.uniquePassives.length > 0) {
            return item.uniquePassives.map(passive => {
              if(passive.name.indexOf("Fast Casting") > -1) {
                return passive.desc;
              }
              return false;
            }).filter(item => item !== false)[0];
          }
          return false;
        }).filter(item => item !== false)[0];
      })
      magicalCDR = uniqueMagCDR.filter(cdr => cdr !== false);
      // console.log("Mag CDR:", magicalCDR);
    }

    // ? Gets Unique Cooldown Reduction from Durable Items
    const durableCDRS = [...new Set(build.map(item => {
      if(item.category === "Durable" && item.uniquePassives){
        if(item.uniquePassives.length > 0) {
          return item.uniquePassives.map(passive => {
            if(passive.name.indexOf("Fast Casting") > -1) {
              return item.name;
            }          
            return false;
          }).filter(item => item !== false)[0];
        }
        return false;  
      }
      return false;
    }))];
    let durCDRNames, uniqueDurCDR, durableCDR;
    durCDRNames = durableCDRS.filter(item => item !== false && item !== undefined);
    
    if(durCDRNames.length > 0 ) {
      uniqueDurCDR = durCDRNames.map(itemName => {
        return build.map(item => {
          if(item.name === itemName && item.uniquePassives.length > 0) {
            return item.uniquePassives.map(passive => {
              if(passive.name.indexOf("Fast Casting") > -1) {
                return passive.desc;
              }
              return false;
            }).filter(item => item !== false)[0];
          }
          return false;
        }).filter(item => item !== false)[0];
      })
      durableCDR = uniqueDurCDR.filter(cdr => cdr !== false);
      // console.log("Dur CDR:", durableCDR);
    }

    // ? Gets Unique Cooldown Reduction from Ward Item
    const wardCDRS = [...new Set(build.map(item => {
      if(item.name === "TRUE SIGHT GEM") {
        return item.name;
      }
      return false;
    }))];
    const wardCDR = wardCDRS.filter(cdr => cdr !== false);
    // console.log("Ward CDR: ", wardCDR);
    
    // * Combine All CDRs 
    const uniqueCDRS = bootsCDR.concat(physicalCDR, magicalCDR, durableCDR, wardCDR).filter(data => data !== undefined);
    // console.log("ALL CDR", uniqueCDRS);

    // * Compute Cooldown Reduction
    if(uniqueCDRS.length !== 0) {
      let cdr = 0;

      uniqueCDRS.forEach(item => {
        if(item === "WIZARD BOOTS" || item === "TRUE SIGHT GEM") {
          cdr += 10;
        } else {
          cdr += Number(item.substr(30, 2));
        }
      })
      
      if(cdr < 40) {
        CDR = cdr;
      } else {
        CDR = 40;
      }
    }

    // ? Gets the name of Items with Spell Resist as Unique Passive
    const spellResistItems = [...new Set(build.map(item => {
      if(item.isEmpty !== true) {
        if(item.uniquePassives){
          return item.uniquePassives.map(passive => {
            if(passive.desc.indexOf("Spell Resist") > -1 && passive.desc.indexOf("Spell Resist") < 6) {
              return item.name;
            }
            return false;
          }).filter(item => item !== false)[0];
        }
      }
      
      return false;
    }))].filter(item => item !== false);
    
    // console.log(spellResistItems);
    
    // * Compute Spell Resist from 'spellResistItems'
    spellResistItems.forEach(item => {
      switch(item) {
        case "CHARMED CLOAK":
          SR += 10;
          break;
        case "ENCHANTED ORB":
          SR += 15;
          break;
        case "DODGE STONE":
          SR += 20;
          break;
        case "ACCURSED EYE":
          SR += 35;
          break;
        case "LIFE SPRING":
          SR += 20;
          break;
        case "CRYSTAL SHIELD":
          SR += 20;
          break;
        case "FORCEFIELD JEWEL":
          SR += 30;
          break;
        case "DECIMATION MACE":
          SR += 15;
          break;
        default:
          break;
      }
    });

    build.forEach(item => {
      // Map Thru Stats
      if(item.stats) {
        // ? GET STATS from 'stats'
        item.stats.forEach(stat => {
          // Compute Health
          if(stat.name === "Health") {
            HP += stat.value;
          }
          // Compute Mana
          if(stat.name === "Mana") {
            MANA += stat.value;
          }
          // Compute Strength
          if(stat.name === "Strength") {
            STR += stat.value;
          }
          // Compute Agility
          if(stat.name === "Agility") {
            AGI += stat.value;
          }
          // Compute Intelligence
          if(stat.name === "Intelligence") {
            INT += stat.value;
          }
          // Compute Damage
          if(stat.name === "Damage" || stat.name === "Attack") {
            DMG += stat.value;
          }
          // Compute Armor
          if(stat.name === "Armor") {
            ARMOR += stat.value;
          }
          // Compute Spell Power
          if(stat.name === "Spell Power") {
            SP += stat.value;
          }
          // Compute Attack Speed
          if(stat.name === "Attack Speed") {
            AS += stat.value;
          }
          // Compute Health Regen
          if(stat.name === "Health Regen") {
            HPRG += stat.value;
          }
          // Compute Mana Regen
          if(stat.name === "Mana Regen") {
            MPRG += stat.value;
          }
          // Compute All Attributes
          if(stat.name === "All Attributes") {
            ALLATTR += stat.value;
          }
        })
      }

      // update Total Stats
      setTotalStats({ 
        health : HP,
        mana : MANA,
        strength: STR,
        agility: AGI,
        intelligence: INT,
        damage: DMG,
        armor: ARMOR,
        spellPower: SP,
        spellResist: SR,
        movementSpeed: MS,
        physicalLifeSteal: PLS,
        magicalLifeSteal: MLS,
        attackSpeed: AS,
        healthRegen: HPRG,
        manaRegen: MPRG,
        dodge: DODGE,
        allAttributes: ALLATTR,
        cooldownReduction: CDR
      });      
    })
  } 

  // ? Gets all the unique passive
  const getUniquePassives = build => {
    // ? Gets the Unique Items that has unique passives from build
    const uniqueItemNames = [...new Set(build.map(item => {
      const { id, uniquePassives, isEmpty } = item;

      if(!isEmpty) {
        if(uniquePassives && uniquePassives.length > 0) {

          return id;
        }
      }

      return false;
    }))].filter(item => item !== false);

    // console.log(uniqueItemNames);

    const itemInfos = [...new Set(build.map(item => {
      const { id, name, portrait, category, uniquePassives, isEmpty } = item;

      if(!isEmpty) {
        let itemInfo = {
          id,
          name,
          portrait,
          category,
          uniquePassives
        };
        
        if(uniquePassives !== undefined) {
          return uniqueItemNames.map(itemID => {
            // check if the item matches an itemID from 'activeAbilties' array
            if(itemID === id) {
              return itemInfo;
            } 
            return false;
          }).filter(data => data !== false)[0];
        }

        return false;
      }

      return false;
    }).filter(data => data !== false).map(JSON.stringify))].map(JSON.parse);

    // console.log(itemInfos);

    // ? Check for Boots
    let defaultBootsPresent, lessSuperiorSpeedBoots, superiorSpeedBoots, superiorDivineLight, superiorHolyPassage;
    defaultBootsPresent = lessSuperiorSpeedBoots = superiorSpeedBoots = superiorDivineLight = superiorHolyPassage = false;
  
    // * Check if a 'Dancer's Greaves' and 'Dash Boots' is in the build
    itemInfos.forEach(item => {
      // * Check if item === Dancer's Greaves
      if(item.id === 'Bts3-1') {
        superiorSpeedBoots = true;
        superiorHolyPassage = true;
      }
      // * Check if item === Speedster Boots
      if(item.id === 'Bts2-6') {
        lessSuperiorSpeedBoots = true;
      }
      // * Check if item === Dash Boots
      if(item.id === 'Bts1-1') {
        defaultBootsPresent = true;
      }
      // * Check if item === Mercy Guards
      if(item.id === 'Bts3-2') {
        superiorDivineLight = true;
      }
    });

    // ? Check for Superior Physical Items
    let superiorScorch, superiorDemonHack, superiorSavagery, superiorSoulEater, superiorPrecisionStrike, superiorThornSlash;
    // init all to 'false'
    superiorScorch = superiorDemonHack = superiorSavagery = superiorSoulEater = superiorPrecisionStrike = superiorThornSlash = false;
  
    // * Check build if a superior item is present
    itemInfos.forEach(item => {
      switch(item.id) {
        case "Phy3-1": 
          superiorScorch = true;
          break;
        case "Phy3-2": 
          superiorSavagery = true;
          break;
        case "Phy3-3": 
          superiorDemonHack = true;
          break;
        case "Phy3-10": 
          superiorPrecisionStrike = true;
          break;
        case "Phy3-11": 
          superiorSoulEater = true;
          break;
        case "Phy3-12": 
          superiorThornSlash = true;
          break;
        default:
          break;
      }
    });

    // ? Check for Superior Magical Items
    let lessSuperiorCharge, superiorBreakSpell;
    // init all to 'false'
    lessSuperiorCharge = superiorBreakSpell = false;
  
    // * Check build if a superior item is present
    itemInfos.forEach(item => {
      // * Check if item === Demon Diadem
      if(item.id === 'Mag3-2') {
        lessSuperiorCharge = true;
      }
      // * Check if item === Alchemist's Orb
      if(item.id === 'Mag3-4') {
        superiorBreakSpell = true;
      }
    });

    // ? Check for Superior Durable Items
    let  lessSuperiorBreakSpell, lessSuperiorExorcism, superiorExorcism, superiorScorchDurable,  superiorCharge;
    // init all to 'false'
    lessSuperiorBreakSpell = lessSuperiorExorcism = superiorExorcism = superiorScorchDurable = superiorCharge = false;
  
    // * Check build if a superior item is present
    itemInfos.forEach(item => {
      // * Check if item === Searcing Longsword
      if(item.id === 'Dur3-12') {
        superiorScorchDurable = true;
      }
      // * Check if item === Crystal Shield
      if(item.id === 'Dur3-10') {
        superiorExorcism = true;
      }
      // * Check if item === Decimation Mace
      if(item.id === 'Phy3-6') {
        lessSuperiorExorcism = true;
      }
      // * Check if item === Heaven's Hammer
      if(item.id === 'Dur3-11') {
        superiorCharge = true;
      }
      // * Check if item === Frost Bite
      if(item.id === 'Dur3-7') {
        lessSuperiorBreakSpell = true;
      }
    });

    const uniqueItemInfos = itemInfos.map(item => {
      const { id, category, uniquePassives } = item;
      let updatedPassives, updatedInfo;

      // ? Check if item category is 'Boots'
      if(category === 'Boots') {
        // ? If item is not Dancer's Greaves and Dancer's Greaves is present the remove Dash Passive from boots 
        if(superiorSpeedBoots === true && id !== 'Bts3-1') {
          // ? If 'superiorHolyPassage' is true and item === 'Bts2-6' (Speedster Boots)
          if(superiorHolyPassage === true && id === 'Bts2-6') {
            updatedInfo = { ...item, uniquePassives: [] };
            return updatedInfo;
          } else {
            updatedPassives = uniquePassives.splice(1,1);

            updatedInfo = { ...item, uniquePassives: updatedPassives };
            return updatedInfo;
          }
        }

        // ? If 'lessSuperiorSpeedBoots' is true and item !== 'Bts2-6' (Speedster Boots) 
        if(lessSuperiorSpeedBoots === true && superiorHolyPassage === false && id !== 'Bts2-6') {
          updatedPassives = uniquePassives.splice(1,1);

          updatedInfo = { ...item, uniquePassives: updatedPassives };
          return updatedInfo;
        }

        // ? If item is the Dash Boots then remove the passive
        if(defaultBootsPresent === true && id === 'Bts1-1') {

          updatedInfo = { ...item, uniquePassives: [] };
          return updatedInfo;
        }
        
        return item;
      } else if(category === 'Physical') {
        // ? If 'superiorScorch' true, check if item id === 'Phy2-5' (Scorching Knife)
        if(superiorScorch === true && id === 'Phy2-5') {
          
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
        // ? If 'superiorSavagery' true, check if item id === 'Phy2-3' (Savage Mask)
        if(superiorSavagery === true && id === 'Phy2-3') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }
        // ? If 'superiorDemonHack' true, check if item id === 'Phy2-12' (Crippling Piercer)
        if(superiorDemonHack === true && id === 'Phy2-12') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
        // ? If 'superiorPrecisionStrike' true, check if item id === 'Phy2-10' (Precision Stave)
        if(superiorPrecisionStrike === true && id === 'Phy2-10') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
        // ? If 'superiorSoulEater' true, check if item id === 'Phy2-7' (Souleater's Sword)
        if(superiorSoulEater === true && id === 'Phy2-7') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }
        // ? If 'superiorThornSlash' true, check if item id === 'Phy2-2' (Caustic Thorn)
        if(superiorThornSlash === true && id === 'Phy2-2') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
        // ? If 'superiorExorcism' true, check if item id === 'Phy3-6' (Decimation Mace)
        if(superiorExorcism === true && id === 'Phy3-6') {
          updatedPassives = uniquePassives.splice(0,2);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }
      } else if(category === 'Magical') {
        // ? If 'lessSuperiorCharge' true, check if item id === 'Mag2-7' (Magic Warhammer)
        if(lessSuperiorCharge === true && id === 'Mag2-7') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }
        // ? If 'superiorCharge' true, check if item id !== 'Dur3-11' (Heaven's Hammer)
        if(superiorCharge === true && id !== 'Dur3-11') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }
        // ? If 'lessSuperiorBreakSpell' true, check if item id === 'Mag2-4' (Wizard's Prism)
        if(lessSuperiorBreakSpell === true && id === 'Mag2-4') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
        // ? If 'superiorBreakSpell' true, check if item id === 'Mag2-4' (Wizard's Prism)
        if(superiorBreakSpell === true && id === 'Mag2-4') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
      } else if(category === 'Durable') {
        // ? If 'superiorScorchDurable' true, check if item id === 'Dur2-6' (Scorching Mace)
        if(superiorScorchDurable === true && id === 'Dur2-6') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }

        // ? If 'superiorExorcism' true, check if item id === 'Dur2-2' (Enchanted Orb)
        if(superiorExorcism === true && id === 'Dur2-2') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }

        // ? If 'lessSuperiorExorcism' true, check if item id === 'Dur2-2' (Enchanted Orb)
        if(lessSuperiorExorcism === true && id === 'Dur2-2') {
          updatedPassives = uniquePassives.splice(0,1);
          updatedInfo = { ...item, uniquePassives: updatedPassives };

          return updatedInfo;
        }

        // ? If 'superiorBreakSpell' true, check if item id === 'Dur3-7' (Frost Bite)
        if(superiorBreakSpell === true && id === 'Dur3-7') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }

        // ? If 'superiorDivineLight' true, check if item id === 'Dur2-5' (Divine Shield)
        if(superiorDivineLight === true && id === 'Dur2-5') {
          updatedInfo = { ...item, uniquePassives: [] };

          return updatedInfo;
        }
      }

      return item; 
    })

    // console.log(uniqueItemInfos);

    // ? Sets the allUniquePassives state
    setAllUniquePassives(uniqueItemInfos);
  }

  // ? Gets all the Active abilities from items
  const getUniqueActiveAbilities = build => {
    // ? Gets all the unique active abilities of items in the build
    const activeAbilities = [...new Set(build.map(item => {
      const { id, activeAbility } = item;
      // check if an item has Active Abilities
      if(activeAbility) {
        return id;
      } 
      return false;
    }))].filter(item => item !== false);
    
    // console.log(activeAbilities);

    // ? Gets active abilities information based from 'activeAbilties'
    const uniqueActiveAbilities = [...new Set(build.map(item => {
      // check if the item slot is not empty
      if(!item.isEmpty) {
        // initialize the value of itemInfo
        let itemInfo = {
          id: item.id,
          name: item.name,
          portrait: item.portrait,
          activeAbility: item.activeAbility
        };

        return activeAbilities.map(itemID => {
          // check if the item matches an itemID from 'activeAbilties' array
          if(itemID === item.id) {
            return itemInfo;
          } 
          return false;
        }).filter(data => data !== false)[0];
      } 

      return false;
    }).filter(item => item !== undefined && item !== false).map(JSON.stringify))].map(JSON.parse);

    // console.log(uniqueActiveAbilities);

    // ? Check for Superior Active Items
    let superiorDomeBreaker, superiorImmunity;
    superiorDomeBreaker = superiorImmunity = false;
  
    // * Check if a 'Dancer's Greaves' and 'Dash Boots' is in the build
    uniqueActiveAbilities.forEach(item => {
      // * Check if item === Dome Breaker
      if(item.id === 'Mag3-7') {
        superiorDomeBreaker = true;
      }
      // * Check if item === Accursed Eye
      if(item.id === 'Dur3-1') {
        superiorImmunity = true;
      }
    });

    // console.log(superiorDomeBreaker, superiorImmunity);

    // ? If Dome Breaker and Accursed Eye is both present then remove less Dodge Stone and God Hand if present
    if(superiorDomeBreaker === true && superiorImmunity === true) {
      // * Set 'activeAbilities' state 
      setAllActiveAbilities(uniqueActiveAbilities.filter(item => item.id !== 'Mag2-1' && item.id !== 'Dur2-7'));
    }
    // ? If Dome Breaker is present then remove God Hand if present
    else if(superiorDomeBreaker === true && superiorImmunity === false) {
      // * Set 'activeAbilities' state 
      setAllActiveAbilities(uniqueActiveAbilities.filter(item => item.id !== 'Mag2-1'));      
    }
    // ? If Accursed Eye is present then remove Dodge Stone if present
    else if(superiorDomeBreaker === false && superiorImmunity === true) {
      // * Set 'activeAbilities' state 
      setAllActiveAbilities(uniqueActiveAbilities.filter(item => item.id !== 'Dur2-7'));      
    } else {
      // * Set 'activeAbilities' state 
      setAllActiveAbilities(uniqueActiveAbilities);
    }

  }

  // ? Computes Total Cost and Breakdown of the build
  const computeTotalCost = build => {
    let total = 0;
    let breakdown = [];
    
    build.forEach(item => {
      const { name, portrait , price } = item;

      if(!item.isEmpty) {
        breakdown.push({ name, portrait, price })
        total += price;
      }
    });
    
    setPriceBreakdown(breakdown);
    setTotalCost(total);
    // console.log(breakdown, total);
  }

  // ? Toggle showOverAll
  const onShowOverall = _ => {
    setShowOverAll(!showOverAll);
  }

  // ? set Current Item ID for Detail Info
  const onSetCurrentItem = e => {
    const itemID = e.target.parentElement.parentElement.getAttribute("data-id");
    const isFromBuild = e.target.parentElement.parentElement.parentElement.classList.contains("itemBuild");
    const pos = Number(e.target.parentElement.parentElement.getAttribute("data-position"));

    if(e.target.tagName === 'IMG') {
      // Physical
      if(itemID.indexOf("Phy") > -1) {
        setItemData(physicalItems.filter(item => item.id === itemID)[0])
      }
      // Magical
      if(itemID.indexOf("Mag") > -1) {
        setItemData(magicalItems.filter(item => item.id === itemID)[0])
      }
      // Durable
      if(itemID.indexOf("Dur") > -1) {
        setItemData(durableItems.filter(item => item.id === itemID)[0])
      }
      // Boots
      if(itemID.indexOf("Bts") > -1) {
        setItemData(bootsItems.filter(item => item.id === itemID)[0])
      }
      // Wards
      if(itemID.indexOf("Wrd") > -1) {
        setItemData(wardsItems.filter(item => item.id === itemID)[0])
      }
      if(!isFromBuild){
        setCurrentItem(itemID);
        setActiveItemInBuild({});
      } else{
        setCurrentItem(null);
        setActiveItemInBuild({ id: itemID, pos });
      }
    }
  }

  // ? Toggle heroSelect value 'true' / 'false'
  const onSetHeroSelect = _ => {
    setHeroSelect(!heroSelect);
  }

  // ? set Current Hero
  const onSetCurrentHero = e => {
    const name = e.target.parentElement.getAttribute("hero-name");
    const portrait = e.target.parentElement.getAttribute("hero-portrait");
    const heroInfo = { name, portrait }

    setCurrentHero(heroInfo);
    setHeroSelect(!heroSelect);
  }

  return (
    <>
      <div id="itemsPane" className="col">
        { heroSelect === false && (
          <Fragment>
            {/* Item Lists */}
            <div className="categories">
              {itemCategories.map(category => (
                <div key={category} className={currentItemCategory !== category ? "categoryContainer" : "categoryContainer active"} onClick={onSetItemCategory}>
                  {category}
                </div>
                )
              )}
            </div>
            <div className="itemsList">
              {currentItemCategory === 'Physical' && activeMenu === 'CREATE BUILD' &&  <PhysicalItemsList items={physicalItems} currentItem={currentItem} onSetCurrentItem={onSetCurrentItem} />}
              {currentItemCategory === 'Magical' && activeMenu === 'CREATE BUILD' &&  <MagicalItemsList items={magicalItems} currentItem={currentItem} onSetCurrentItem={onSetCurrentItem} />}
              {currentItemCategory === 'Durable' && activeMenu === 'CREATE BUILD' &&  <DurableItemsList items={durableItems} currentItem={currentItem} onSetCurrentItem={onSetCurrentItem} />}
              {currentItemCategory === 'Boots' && activeMenu === 'CREATE BUILD' &&  <BootsItemsList items={bootsItems} currentItem={currentItem} onSetCurrentItem={onSetCurrentItem} />}
              {currentItemCategory === 'Wards' && activeMenu === 'CREATE BUILD' &&  <WardsItemsList items={wardsItems} currentItem={currentItem} onSetCurrentItem={onSetCurrentItem} />}
            </div>
          </Fragment>
        )}

        {heroSelect === true && (
          <Fragment>
            {/* Hero Lists */}
            <div className="categories">
              {heroCategories.map(category => (
                <div key={category} className={currentHeroCategory !== category ? "categoryContainer" : "categoryContainer active"} onClick={onSetHeroCategory}>
                  {category}
                </div>
                )
              )}
            </div>
            <HeroesList currentHeroCategory={currentHeroCategory} heroes={heroes} onSetCurrentHero={onSetCurrentHero} />
          </Fragment>
        )}
        {activeMenu === 'CREATE BUILD' && heroSelect === false && <ItemBuild itemBuild={itemBuild} tempBuild={tempBuild} activeItemInBuild={activeItemInBuild} currentHero={currentHero} onSetCurrentItem={onSetCurrentItem} edit={edit} onSetEditMode={onSetEditMode} onSetHeroSelect={onSetHeroSelect} onAddItem={onAddItem} onRemoveItem={onRemoveItem} onConfirmBuild={onConfirmBuild} onCancelBuild={onCancelBuild} onClearBuild={onClearBuild} />}
      </div>
      
      <div id="detailsPane" className="col">
        <DetailsPane itemData={itemData} totalCost={totalCost} priceBreakdown={priceBreakdown} totalStats={totalStats} allUniquePassives={allUniquePassives} allActiveAbilities={allActiveAbilities} showOverAll={showOverAll} onShowOverall={onShowOverall}/>
      </div>
    </>
  )
}

export default ItemsPane;