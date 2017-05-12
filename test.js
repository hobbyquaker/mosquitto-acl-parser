require('should');

const macl = require('./index.js');

const aclExample = {
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
        'user1': [
            {
                perm: 'read',
                topic: 'user1/can/read'
            },
            {
                perm: 'readwrite',
                topic: 'user1/can/readwrite'
            }
        ],
        'user2': [
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
};

describe('stringify and parse', () => {
    it('should stringify the example and parse it again', () => {
        macl.parse(macl.stringify(aclExample)).should.deepEqual(aclExample);
    });
});

describe('stringify', () => {
    it('should stringify a topic', () => {
        macl.stringify({
            topics: [
                {
                    perm: 'read',
                    topic: 'test'
                }
            ]
        }).should.equal(`# created by mosquitto-acl-parser

topic read test

`);
    });
    it('should stringify a pattern', () => {
        macl.stringify({
            patterns: [
                {
                    perm: 'read',
                    topic: 'test'
                }
            ]
        }).should.equal(`# created by mosquitto-acl-parser

pattern read test
`);
    });
    it('should stringify a users topic', () => {
        macl.stringify({
            users: {
                'user1': [
                    {
                        perm: 'read',
                        topic: 'user1/can/read'
                    }
                ]
            }
        }).should.equal(`# created by mosquitto-acl-parser

user user1
topic read user1/can/read

`);
    });
});

describe('parse', () => {
    it('should parse the mosquitto example acl', () => {
        macl.parse(`# This affects access control for clients with no username.
topic read $SYS/#

# This only affects clients with username "roger".
user roger
topic foo/bar

# This affects all clients.
pattern write $SYS/broker/connection/%c/state`).should.deepEqual({
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
        )
    });
    it('should parse topics without permission', () => {
        macl.parse(`topic $SYS/#
topic foo/bar
user user1
topic foo/bar
topic foo/baz
`).should.deepEqual({
                "topics": [
                    {
                        "perm": "readwrite",
                        "topic": "$SYS/#"
                    },
                    {
                        "perm": "readwrite",
                        "topic": "foo/bar"
                    }
                ],
                "users": {
                    "user1": [
                        {
                            "perm": "readwrite",
                            "topic": "foo/bar"
                        },
                        {
                            "perm": "readwrite",
                            "topic": "foo/baz"
                        }
                    ]
                }
            }
        )
    });
});
