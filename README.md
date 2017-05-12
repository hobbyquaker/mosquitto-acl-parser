# mosquitto-acl-parser

[![NPM version](https://badge.fury.io/js/mosquitto-acl-parser.svg)](http://badge.fury.io/js/mosquitto-acl-parser)
[![Dependency Status](https://img.shields.io/gemnasium/hobbyquaker/mosquitto-acl-parser.svg?maxAge=2592000)](https://gemnasium.com/github.com/hobbyquaker/mosquitto-acl-parser)
[![Build Status](https://travis-ci.org/hobbyquaker/mosquitto-acl-parser.svg?branch=master)](https://travis-ci.org/hobbyquaker/mosquitto-acl-parser)
[![Coverage Status](https://coveralls.io/repos/github/hobbyquaker/mosquitto-acl-parser/badge.svg?branch=master)](https://coveralls.io/github/hobbyquaker/mosquitto-acl-parser?branch=master)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Parse and Stringify Mosquitto ACLs

This tiny module parses [Mosquitto](https://mosquitto.org/) ACLs into a Javascript object and stringifies objects back 
into a ACL string.

## Usage

`npm install mosquitto-acl-parser`

### .parse(string)

```Javascript
const macl = require('mosquitto-acl-parser');

const acl = macl.parse(`# This affects access control for clients with no username.
topic read $SYS/#

# This only affects clients with username "roger".
user roger
topic foo/bar

# This affects all clients.
pattern write $SYS/broker/connection/%c/state`);
```

`acl` contains then...
```JSON
{
  "topics": [
    {
      "perm": "read",
      "topic": "$SYS/#"
    }
  ],
  "users": {
    "roger": [
      {
        "perm": "readwrite",
        "topic": "foo/bar"
      }
    ]
  },
  "patterns": [
    {
      "perm": "write",
      "topic": "$SYS/broker/connection/%c/state"
    }
  ]
}
```

### .stringify(acl)

```Javascript
const macl = require('mosquitto-acl-parser');

console.log(macl.stringify({
    topics: [
        {
            perm: 'read',
            topic: 'everyone/can/read  '
        },
        {
            perm: 'readwrite',
            topic: 'everyone/can/readwrite'
        }
    ],
    users: {
        user1: [
            {
                perm: 'read',
                topic: 'user1/can/read'
            },
            {
                perm: 'readwrite',
                topic: 'user1/can/readwrite'
            }
        ],
        user2: [
            {
                perm: 'read',
                topic: 'user2/can/read'
            },
            {
                perm: 'readwrite',
                topic: 'user2/can/readwrite'
            }
        ]
    },
    patterns: [
        {
            perm: 'read',
            topic: 'pattern/%u/can/read'
        },
        {
            perm: 'readwrite',
            topic: 'pattern/%u/can/readwrite'
        }
    ]
}));
```

Outputs...
```
# created by mosquitto-acl-parser

topic read everyone/can/read  
topic readwrite everyone/can/readwrite

user user1
topic read user1/can/read
topic readwrite user1/can/readwrite

user user2
topic read user2/can/read
topic readwrite user2/can/readwrite

pattern read pattern/%u/can/read
pattern readwrite pattern/%u/can/readwrite
```

## License

MIT (c) 2017 [Sebastian Raff](https://github.com/hobbyquaker)

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
