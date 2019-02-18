const mapper = require('./mapper');
const expect = require('chai').expect

describe('The mapper module', function () {

    // deepSet tests
    it('deepSet sets nested arrays correctly', function() {
        let r = {};
        mapper.deepSet(r, 'b[0][1].h.y[0][1][0].p', 2);
        
        expect(r.b[0][1].h.y[0][1][0].p).to.eql(2);
    });

    it('deepSet set does not overwrite an existing object', function () {
        let r = {'a': 1, 'b': 2 };
        mapper.deepSet(r, 'c', 'expectedValue');

        expect(r.a).to.eql(1);
        expect(r.b).to.eql(2);
        expect(r.c).to.eql('expectedValue');
    });

    it('deepSet updates existing values', function () {
        let r = {'a': 1, 'b': 2, c: { x: 1, y:[1, 2]} };
        mapper.deepSet(r, 'a', 11);
        mapper.deepSet(r, 'c.x', 22);
        mapper.deepSet(r, 'c.y[0]', 4);
        mapper.deepSet(r, 'c.y[1]', 22);
    
        expect(r.a).to.eql(11);
        expect(r.c.x).to.eql(22);
        expect(r.c.y[0]).to.eql(4);
        expect(r.c.y[1]).to.eql(22);
    });

    // deepGet tests
    it('deepGet fetches nested array values correctly', function() {
        r = {a: 1, b:[[1,2,3], [4, 5]], c:{x:[9, {y:[10]}]}};
        
        expect(mapper.deepGet(r, 'b[0][0]')).to.eql(1);
        expect(mapper.deepGet(r, 'b[0][1]')).to.eql(2);
        expect(mapper.deepGet(r, 'b[0][2]')).to.eql(3);

        expect(mapper.deepGet(r, 'b[1][0]')).to.eql(4);
        expect(mapper.deepGet(r, 'b[1][1]')).to.eql(5);

        expect(mapper.deepGet(r, 'c.x[0]')).to.eql(9);
        expect(mapper.deepGet(r, 'c.x[1].y[0]')).to.eql(10);
    })

    it('deepGet fetches nested objects correctly', function(){
        n = {x:1, y:1};
        r = {a: {b: {c: {d: n}}}};

        expect(mapper.deepGet(r, 'a.b.c.d.x')).to.eql(1);
        expect(mapper.deepGet(r, 'a.b.c.d.y')).to.eql(1);

        expect(mapper.deepGet(r, 'a.b.c.d')).to.eql(n);
        expect(mapper.deepGet(r, 'a.b.c.d')).to.eql({x:1, y:1});
    });

    it('deepGet returns undefined for non-existant target property hierarchies', function(){
        n = {x:1, y:1};
        r = {a: {b: {c: {d: n}}}};

        expect(mapper.deepGet(r, 'a.b.c.d.x.h')).to.eql(undefined);
        expect(mapper.deepGet(r, 'a.b.c.d.x')).to.eql(1);
    });

    // map tests
    it('map correctly maps simple objects', function(){
        s = {a:1, b:2, c:'x'};
        t = {};

        mapper.map(s, t, 'a', 'a');
        mapper.map(s, t, 'b', 'b');
        mapper.map(s, t, 'c', 'c');

        expect(t).to.eql(s);
    });

    it('map correctly maps from source nested objects', function(){
        s = {a:1, b:2, c:{p:1, q:[1, 2]}};
        t = {o:{}};

        mapper.map(s, t, 'c.p', 'o.p');
        mapper.map(s, t, 'c.q', 'o.q');

        expect(t.o.p).to.eql(1);
        expect(t.o.q).to.eql(s.c.q);
    });

    it('map correctly maps source nested arrays to target nested arrays', function(){
        s = { a: 1, b: 2, c: {p: 1, q: [ [3, 4], [ {f: 1}, {y: 2} ] ] } };
        t = { o:[ 
            [1, 2], 
            [5, 6], 
            {x: 1, y: 2, z:[3] } 
        ] };

        mapper.map(s, t, 'c.p', 'o[0][1]');
        mapper.map(s, t, 'c.q[0][1]', 'o[2].x');
        mapper.map(s, t, 'c.q[1][0].f', 'o[2].z[1]');

        expect(t.o[0][1]).to.eql(s.c.p);
        expect(t.o[2].x).to.eql(s.c.q[0][1]);
        expect(t.o[2].z[1]).to.eql(s.c.q[1][0].f);
        expect(t.o[2].z).to.eql([3, 1]);
    });

});