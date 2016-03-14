# statsD backend for SPM Performance Monitoring

A plugin to connect [etsy's statsD](https://github.com/etsy/statsd) to [SPM Performance Monitoring](http://sematext.com/spm/) by Sematext. 

# Installation

```
cd /path/to/statsd-dir
npm install statsd-spm-backend --save
```

# Preparation

1. Get a free account [apps.sematext.com](https://apps.sematext.com/users-web/register.do)  
2. [Create an SPM App](https://apps.sematext.com/spm-reports/registerApplication.do) to obtain the SPM Application Token.

# Configuration
```
spmToken: "your_spm_app_token"
backends: ["statsd-spm-backend"]
```

How to enable
Add statsd-spm-backend to your list of statsd backends:
```
backends: ["statsd-spm-backend"]
```

# Support 

- Twitter: [@sematext](http://www.twitter.com/sematext)
- Blog: [blog.sematext.com](http://blog.sematext.com)
- Homepage: [www.sematext.com](http://www.sematext.com)

