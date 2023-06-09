
module.exports = {
  WitnetPriceSolverProduct: {
    "Price-BAT/USD-6": {
      constructorParams: null,
      dependencies: [
        "Price-BAT/USDT-6",
        "Price-USDT/USD-6", 
      ],
    },
    "Price-BNB/USD-6": {
      dependencies: [ 
        "Price-BNB/USDT-6", 
        "Price-USDT/USD-6", 
      ],
    },
    "Price-BUSD/USD-6": {
      dependencies: [ 
        "Price-BUSD/USDT-6", 
        "Price-USDT/USD-6", 
      ],
    },
    "Price-ELA/USD-6": {
      dependencies: [ 
        "Price-ELA/USDT-6", 
        "Price-USDT/USD-6", 
      ],
    },
    "Price-HT/USD-6": {
      dependencies: [ 
        "Price-HT/USDT-6", 
        "Price-USDT/USD-6", 
      ],
    },
    "Price-QUICK/USD-6": {
      dependencies: [ 
        "Price-QUICK/USDC-6", 
        "Price-USDC/USD-6", 
      ],
    },
    "Price-METIS/USD-6": {
      dependencies: [ 
        "Price-METIS/USDT-6", 
        "Price-USDT/USD-6" 
      ],
    },
  },
}
