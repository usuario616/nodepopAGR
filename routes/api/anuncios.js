var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');

/* GET /api/Anuncios */
// Lista de Anuncios
router.get('/', async function(req, res, next) {

  try {

    const filtering = require('../functions');
    const {filtro, limit, skip, fields, sort} = filtering(req);

    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});


// GET /api/tags
// Obtener lista de tags
router.get('/tags', async function(req, res, next) {

  try {
    res.json( { tags: await Anuncio.tags() } );
  } catch (err) {
    next(err);
  }
});

// GET /api/tags
// Obtener lista de tags
router.get('/tags-articles', async function(req, res, next) {

  try {
    res.json( { tags: await Anuncio.tagsChart() } );
  } catch (err) {
    next(err);
  }
});

// GET /api/anuncios:id
// Obtener un Anuncio
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const anuncio = await Anuncio.findOne({ _id: _id });

    if (!anuncio) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ result: anuncio });

  } catch (err) {
    next(err);
  }
});

// POST /api/Anuncios (body)
// Crear un Anuncio
router.post('/', async (req, res, next) => {
  try {
    const anuncioData = req.body;
    if(anuncioData.venta!='true' && anuncioData.venta!='false'){
      return res.status(400).json({ error: 'venta debe ser "true" o "false"' });
    }
    anuncioData.venta =  (anuncioData.venta==='true')  ? true : false;
    
    const anuncio = new Anuncio(anuncioData);

    const anuncioCreado = await anuncio.save();

    res.status(201).json({ result: anuncioCreado });

  } catch (error) {
    next(error);
  }
});


module.exports = router;
