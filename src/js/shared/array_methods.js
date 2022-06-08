
Array.prototype.combinations = function(p) {
    var combs, head, tailcombs;

    if (p > this.length || p <= 0) {
        return [];
    }

    if (p == this.length) {
        return [this];
    }

    if (p == 1) {
        combs = [];
        for (i = 0; i < this.length; i++) {
            combs.push([this[i]]);
        }
        return combs;
    }

    combs = [];
    for (var i = 0; i < this.length - p + 1; i++) {
        head = this.slice(i, i+1);
        tailcombs = this.slice(i + 1).combinations(p - 1);
        for (var j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
};

Array.prototype.permutations =  async function(avoidBrowserFreeze = false, iterationCallback = null) {
    if (this.length === 0) {
        return [[]];
    }

    var result = [];

    const iterate = async (i) => {
        var copy = Object.create(this);
        var head = copy.splice(i, 1);
        var rest = await copy.permutations(avoidBrowserFreeze, iterationCallback);
        for (var j = 0; j < rest.length; j++) {
            var next = head.concat(rest[j]);
            result.push(next);
        }
        iterationCallback?.();
    }
    for (var i = 0; i < this.length; i++) {
        if (avoidBrowserFreeze) {
            await new Promise(async r => {
                setTimeout(async () => {
                    await iterate(i);
                    r();
                })
            });
        } else {
            iterate(i);
        }
    }
    return result;
};

Array.prototype.arrangements = function(p) {
    var combinations = this.combinations(p);
    var arrangements = [];
    combinations.forEach(function(combination) {
        var ps = combination.permutations();
        ps.forEach(function(p) {
            arrangements.push(p);
        });
    });
    return arrangements;
};