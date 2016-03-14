var SPM = require('spm-metrics-js')
var os = require('os')

function getSetsSize (vals) {
  var ret = {}
  for (var val in vals) {
    ret[val] = vals[val].values().length
  }
  return ret
}

function SpmBackend (startupTime, config, emitter) {
  this.lastFlush = startupTime
  this.lastException = startupTime
  console.log(config)
  this.config = config
  this.spmCm = new SPM(config.spmToken || process.env.SPM_TOKEN, 10000)
  if (this.config.debug || process.env.DEBBUG) {
    this.spmCm.on('add', console.log)
  }
  this.spmCm.on('error', console.error)
  emitter.on('flush', function (timestamp, metrics) {
    this.flush(timestamp, metrics)
  }.bind(this))
  emitter.on('status', function (callback) {
    this.status(callback)
  }.bind(this))
}

SpmBackend.prototype.flush = function (timestamp, metrics) {
  // console.log('Flushing stats at ', new Date(timestamp * 1000).toString())
  var spmCm = this.spmCm
  // console.log(JSON.stringify(metrics.sets))
  var sets = getSetsSize(metrics.sets)
  var key = null
  for (key in sets) {
    spmCm.add(key, metrics.counters[key], 'sum', os.hostname(), key.split('.')[0])
  }
  for (key in metrics.counters) {
    spmCm.add(key, metrics.counters[key], 'sum', os.hostname(), key.split('.')[0])
  }
  for (key in metrics.counter_rates) {
    spmCm.add(key + '.counter_rate', metrics.counter_rates[key], 'avg', os.hostname(), key.split('.')[0])
  }
  for (key in metrics.gauges) {
    spmCm.add(key + '.avg', metrics.gauges[key], 'avg', os.hostname(), key.split('.')[0])
    spmCm.add(key + '.min', metrics.gauges[key], 'min', os.hostname(), key.split('.')[0])
    spmCm.add(key + '.max', metrics.gauges[key], 'max', os.hostname(), key.split('.')[0])
  }
  for (key in metrics.timer_data) {
    if (metrics.timer_data[key].mean !== undefined) {
      spmCm.add(key + '.mean', metrics.timer_data[key].mean, 'avg', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.max', metrics.timer_data[key].upper, 'max', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.min', metrics.timer_data[key].lower, 'min', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.sum', metrics.timer_data[key].sum, 'sum', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.count', metrics.timer_data[key].count, 'sum', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.count_ps', metrics.timer_data[key].count, 'sum', os.hostname(), key.split('.')[0])
      spmCm.add(key + '.upper_90', metrics.timer_data[key].upper_90, 'avg', os.hostname(), key.split('.')[0])
    }
  }
  if (this.config.debug) {
    console.log('Flushing stats at ', new Date(timestamp * 1000).toString())
    console.log('Sets: ' + JSON.stringify(sets))
    console.log('Metrics: ' + JSON.stringify(metrics))
  }
}

SpmBackend.prototype.status = function (write) {
  ['lastFlush', 'lastException'].forEach(function (key) {
    write(null, 'SPM', key, this[key])
  }, this)
}

exports.init = function (startupTime, config, events) {
  var instance = new SpmBackend(startupTime, config, events)
  return true
}
