'use strict'

const nftHelper = require('../../helpers/dna-parser')

class NFTController {
  async get (req, res, next) {
    const { type, id } = req.params
    const { width = 500, height = 500, glow = 'true' } = req.query
    if (!type || !id) {
      res.status(404).json({ error: 'Wrong format' })
    }
    if (type) {
      const nft = await nftHelper.get(type, id);
      console.log('nft', nft);

      nft['glow_color'] = nft.primary_color.replace(')', ', 0.5)').replace('rgb', 'rgba');

      res.setHeader('Content-Type', 'image/svg+xml');
      res.render(`layouts/${type}.hbs`, {
        layout: `${type}.hbs`,
        ...nft,
        glow,
        width: width,
        height: height
      })
    } else {
      res.status(404).json({ error: 'File not found' })
    }
  }
}

module.exports = new NFTController()
