'use strict'
const { DNAParser, ContractHandler } = require('totem-dna-parser')
const totemCommonFiles = require('totem-common-files')
const maxValue = 4294967295;


class NFT {
  constructor() {
    this.ApiURL = process.env.API_URL;
    this.ReverseApiURL = process.env.RESERVE_API_URL;

    this.Contracts = {
      avatar: process.env.AVATAR_CONTRACT,
      item: process.env.ITEM_CONTRACT,
      gem: process.env.GEM_CONTRACT
    }
  }
  async get (type, id) {
    try {

      let dna;
      try {
        const contractHandler = new ContractHandler(this.ApiURL, this.Contracts[type]);
        dna = await contractHandler.getDNA(id);
      } catch (error) {
        const contractHandler = new ContractHandler(this.ReverseApiURL, this.Contracts[type]);
        dna = await contractHandler.getDNA(id);
      }

      console.log('dna', dna);
      let parser;
      if (type === 'avatar') {
        parser = new DNAParser(totemCommonFiles.anvilandTalesAvatarFilterJson, dna);
      } else if (type === 'item') {
        parser = new DNAParser(totemCommonFiles.anvilandTalesItemFilterJson, dna);
      }
      const properties = parser.getFilterPropertiesList()
      let jsonProp = {...properties};
      let settings = {};
      for (const key in properties) {
        if (Object.hasOwnProperty.call(properties, key)) {
          settings[jsonProp[key]] = parser.getField(properties[key]);
        }
      }

      for (const key in settings) {
        if (Object.hasOwnProperty.call(settings, key) && key === 'range_nd') {
          settings.range_nd = Math.round((settings.range_nd / maxValue) * 1000);
          if (settings.range_nd < 200) {
            settings['weapon_type'] = 'Dagger';
          } else if (settings.range_nd >= 200 && settings.range_nd < 400) {
            settings['weapon_type'] = 'Axe';
          } else if (settings.range_nd >= 400) {
            settings['weapon_type'] = 'Spear';
          }
        }
      }

    
      return settings;
    } catch (e) {
      console.log(e)
    }
  }

}

module.exports = new NFT()