const macl = require('./index.js');

const acl = macl.parse(`# This affects access control for clients with no username.
topic read $SYS/#

# This only affects clients with username "roger".
user roger
topic foo/bar

# This affects all clients.
pattern write $SYS/broker/connection/%c/state`);

//console.log(JSON.stringify(acl, null, '  '));

/*console.log(macl.stringify({
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
*/

console.log(macl.stringify({
    patterns: [
        {
            perm: 'read',
            topic: 'test'
        }
    ]
}));