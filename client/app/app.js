'use strict';

angular.module('stockTrackerApp', [
  'stockTrackerApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'highcharts-ng'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

// Load the fonts
Highcharts.createElement('link', {
  href: '//fonts.googleapis.com/css?family=Inconsolata',
  rel: 'stylesheet',
  type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    backgroundColor: '#F0F0F0',
    style: {
      fontFamily: "'Inconsolata', sans-serif"
    },
  },
  title: {
    style: {
      color: '#F3F3F3',
      fontSize: '30px'
    }
  },
  xAxis: {
    gridLineColor: '#0F0F0F',
    labels: {
      style: {
        color: '#0F0F0F'
      },
      fontSize: '20px'
    },
    lineColor: '#0F0F0F',
    tickColor: '#0F0F0F',
    title: {
      style: {
        color: '#000000'

      }
    }
  },
  yAxis: {
    gridLineColor: '#0F0F0F',
    labels: {
      style: {
        color: '#0F0F0F',
        fontSize: '20px'
      }
    },
    lineColor: '#0F0F0F',
    tickColor: '#0F0F0F',
    tickWidth: 1,
    title: {
      style: {
        color: '#0F0F0F'
      }
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: '#494949'
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#B0B0B3'
      },
      marker: {
        lineColor: '#333'
      }
    },
    boxplot: {
      fillColor: '#505053'
    },
    candlestick: {
      lineColor: 'white'
    },
    errorbar: {
      color: 'white'
    }
  },
  legend: {
    itemStyle: {
      color: '#0f0f0f'
    },
    itemHoverStyle: {
      color: '#FFF'
    },
    itemHiddenStyle: {
      color: '#606063'
    }
  },
  credits: {
    style: {
      color: '#666'
    }
  },
  labels: {
    style: {
      color: '#707073'
    }
  },

  drilldown: {
    activeAxisLabelStyle: {
      color: '#333333'
    },
    activeDataLabelStyle: {
      color: '#333333'
    }
  },

  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC'
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        }
      }
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },

  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    },
    xAxis: {
      gridLineColor: '#505053'
    }
  },

  // special colors for some of the
  legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
  background2: '#505053',
  dataLabelsColor: '#B0B0B3',
  textColor: '#C0C0C0',
  contrastTextColor: '#F0F0F3',
  maskColor: 'rgba(255,255,255,0.3)'
};

var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
