/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stocks              ->  index
 * POST    /api/stocks              ->  create
 * GET     /api/stocks/:id          ->  show
 * PUT     /api/stocks/:id          ->  update
 * DELETE  /api/stocks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Stock = require('./stock.model');
var https = require('https');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Stocks
export function index(req, res) {
  Stock.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Stock from the DB
export function show(req, res) {
  getStockHistory(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

function getStockHistory(stockId) {
  return new Promise(function(resolve, reject) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    
    https.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockId}.json?api_key=${process.env.QUANDL_API_KEY}&start_date=${year - 1}-${month}-${date}&end_date=${year}-${month}-${date}`, function (res) {
      
      var data = '';
      
      res.on('data', function (chunk) {
        data += chunk;
      });
      
      res.on('end', function () {
        data = JSON.parse(data);
        
        if (!data || data.quandl_error) {
          reject(data);
        }
        else {
          resolve(data);
        }
      });
        res.resume();
        
      })
      .on('error', function (err) {
        reject(Error(err.message));
      });
  });
}

// Creates a new Stock in the DB
export function create(req, res) {
  
  if (!req.body.name) {
    res.status(400).end();
  }
  
  https.get('https://www.quandl.com/api/v3/datasets/WIKI/${req.body.name.toUpperCase()}/metadata.json', function (resStock) {
    
    var data = '';
    
    resStock.on('data', function (chunk) {
      data += chunk;
    });
    
    resStock.on('end', function () {
      data = JSON.parse(data);
      
      res
        .status(resStock.statusCode)
        .end();
      
      if (parseInt(resStock.statusCode, 10) >= 200 && parseInt(resStock.statusCode, 10) < 300) {
        Stock.find({code: data.dataset.dataset_code})
          .then(function (stock) {
            if (stock.length) {
              console.log("Stock not found.");
              return;
            }
            
            Stock.create({
              name: data.dataset.name,
              code: data.dataset.dataset_code
            });
          });
      }
    }).on('error', function (err) {
      res.json(err)
        .status(400)
        .end();
    });
    
  });
}

// Updates an existing Stock in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Stock from the DB
export function destroy(req, res) {
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
