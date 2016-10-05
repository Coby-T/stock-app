'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, highchartsNG, stockService, $timeout) {
    this.$http = $http;
    this.stocks = [];
    this.newStock = '';
    this.startDate = '';
    this.endDate = '';
    this.stockService = stockService;
    this.$timeout = $timeout;
    
    var mainCtrl = this;
    
    this.chartConfig = this.getHighchartConfig();

    $http.get('/api/stocks').then(response => {
      this.stocks = response.data;
      socket.syncUpdates('stock', this.stocks, function (event, item) {
        
        if (event === 'created') {
          mainCtrl.getStock(item.code);
        }
        else if (event === 'deleted') {
          mainCtrl.removeStock(item.code);
        }
      });

      this.stocks.forEach(function(stock) {
        mainCtrl.getStock(stock.code);
      });
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('stock');
    });
    
    highchartsNG.ready(function() {}, this);
  }
  
  getStock(id) {
    var series = {
      name: id,
      data: []
    };
    var mainCtrl = this;
    this.stockService.get(id)
      .then(function(data) {
        series.data = data.data.dataset.data.reverse().map(function(info) {
          return [(new Date(info[0]).getTime()), info[1] ];
        });
        
        mainCtrl.chartConfig.series.push(series);
      });
  }

  addStock() {
    if (this.newStock) {
      this.stockService.create(this.newStock)
        .then(this.newStock = '');
    }
  }
  
  removeStock(id) {
    var object = _.find(this.chartConfig.series, item => {
      return item.name.toUpperCase() === id.toUpperCase();
    });
    
    if (object) {
      this.chartConfig.series.splice(this.chartConfig.series.indexOf(object), 1);
    }
  }

  deleteStock(stock) {
    this.stockService.remove(stock);
  }
  
  getHighchartConfig() {
    return {
      rangeSelector: {
        selected: 3
      },
      
      xAxis: {
        type: 'datetime'
      },

      yAxis: {
        labels: {
          formatter: function () {
            return '$' + this.value;
          }
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },

      plotOptions: {
        series: {
          compare: ''
        }
      },

      tooltip: {
        valueDecimals: 2,
        valuePrefix: 'USD$ '
      },

      series: [],

      title: {
        text: 'Stocks'
      },
      loading: false,
      useHighStocks: true,
      size: {
        height: 400
      },
      func: chart => {
        this.$timeout(function() {
          chart.reflow();
        }, 0);
      }
    };
  }
}

angular.module('stockTrackerApp')
  .controller('MainController', MainController);

})();
