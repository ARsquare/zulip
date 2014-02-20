add_dependencies({
    util: 'js/util.js'
});

var people = require("js/people.js");

set_global('page_params', {
    people_list: []
});
set_global('activity', {
    set_user_statuses: function () {}
});

(function test_basics() {
    var full_name = 'Isaac Newton';
    var email = 'isaac@example.com';
    var isaac = {
        email: email,
        full_name: full_name
    };
    people.add(isaac);

    var person = people.get_by_name(full_name);
    assert.equal(person.email, email);
    person = people.get_by_email(email);
    assert.equal(person.full_name, full_name);
    person = people.realm_get(email);
    assert(!person);
    people.add_in_realm(isaac);
    person = people.realm_get(email);
    assert.equal(person.email, email);

    people.update({email: email, is_admin: true});
    person = people.get_by_email(email);
    assert.equal(person.full_name, full_name);
    assert.equal(person.is_admin, true);

    people.update({email: email, full_name: 'Sir Isaac'});
    person = people.get_by_email(email);
    assert.equal(person.full_name, 'Sir Isaac');
    assert.equal(person.is_admin, true);

    people.remove(person);
    person = people.get_by_email(email);
    assert(!person);
}());

(function test_get_rest_of_realm() {
    var myself = {
        email: 'myself@example.com',
        full_name: 'Yours Truly'
    };
    global.page_params.email = myself.email;
    var alice1 = {
        email: 'alice1@example.com',
        full_name: 'Alice'
    };
    var alice2 = {
        email: 'alice2@example.com',
        full_name: 'Alice'
    };
    var bob = {
        email: 'bob@example.com',
        full_name: 'Bob van Roberts'
    };
    people.add_in_realm(myself);
    people.add_in_realm(alice1);
    people.add_in_realm(bob);
    people.add_in_realm(alice2);
    var others = people.get_rest_of_realm();
    var expected = [
        { email: 'alice1@example.com', full_name: 'Alice' },
        { email: 'alice2@example.com', full_name: 'Alice' },
        { email: 'bob@example.com', full_name: 'Bob van Roberts' }
    ];
    assert.deepEqual(others, expected);
}());
