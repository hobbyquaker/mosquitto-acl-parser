const writeEntries = (type, entries) => {
    let output = '';
    entries.forEach(entry => {
        output += `${type} ${entry.perm} ${entry.topic}\n`;
    });
    return output;
};

module.exports = {
    stringify: acl => {
        let output = '# created by mosquitto-acl-parser\n\n';
        if (acl.topics) {
            output += writeEntries('topic', acl.topics);
            output += '\n';
        }
        if (acl.users) {
            Object.keys(acl.users).forEach(user => {
                const entries = acl.users[user];
                output += `user ${user}\n`;
                output += writeEntries('topic', entries);
                output += '\n';
            });
        }
        if (acl.patterns) {
            output += writeEntries('pattern', acl.patterns);
        }
        return output;
    },
    parse: str => {
        /* eslint-disable no-cond-assign */
        const acl = {};
        let user = null;
        str.split('\n').forEach(line => {
            let match;
            if (match = line.match(/^\s*user\s+(.*)$/)) {
                [, user] = match;
            } else if (match = line.match(/^\s*topic\s+(read|write|readwrite)\s+(.*)$/)) {
                const [, perm, topic] = match;
                if (user === null) {
                    if (!acl.topics) {
                        acl.topics = [];
                    }
                    acl.topics.push({perm, topic});
                } else {
                    if (!acl.users) {
                        acl.users = {};
                    }
                    if (!acl.users[user]) {
                        acl.users[user] = [];
                    }
                    acl.users[user].push({perm, topic});
                }
            } else if (match = line.match(/^\s*topic\s+(.*)$/)) {
                const [, topic] = match;
                if (user === null) {
                    if (!acl.topics) {
                        acl.topics = [];
                    }
                    acl.topics.push({perm: 'readwrite', topic});
                } else {
                    if (!acl.users) {
                        acl.users = {};
                    }
                    if (!acl.users[user]) {
                        acl.users[user] = [];
                    }
                    acl.users[user].push({perm: 'readwrite', topic});
                }
            } else if (match = line.match(/^\s*pattern\s+(read|write|readwrite)\s+(.*)$/)) {
                const [, perm, topic] = match;
                if (!acl.patterns) {
                    acl.patterns = [];
                }
                acl.patterns.push({perm, topic});
            }
        });
        return acl;
    }
};
