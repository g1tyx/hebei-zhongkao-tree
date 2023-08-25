const TOTAL_UPGS = 12
var UPG_DATA = {
    rows: 3,
    rowData: {
        1: [1,2,3,4],
        2: [5,6,7,8],
        3: [9,10,11,12],
    },
    1:{ //已实现
        title() { return "Get a pre-evloved notebook block after game started.(x2 every level)"},
        pref: "value:",
        targ() { return new Decimal(100)},
        cost(x) { return Decimal.pow(10,x**2+1).mul(100)},
        eff(x) { return player.upgs[1]==0?new Decimal(0):Decimal.pow(2,x).mul(16)}
    },
    2:{ //已实现
        title() { return 'You have higher chance to get a higher-value notebook block.'},
        pref: "+",
        targ() {return new Decimal(1000)},
        cost(x) { return Decimal.mul(Decimal.pow(1.44,x),1000).floor().mul(player.upgs[2].gte(25)? x**1.2 : 1)},
        eff(x) { return x*5*Number(getUpgEff(6))*Number(getUpgEff(10)) }
    },
    3:{ //已实现
        title() { return 'Add to the base of jump-merging bonus.'},
        pref: "+",
        targ() {return new Decimal(10000)},
        cost(x) { return Decimal.mul(Decimal.pow(3,x),10000).floor().mul(player.upgs[3].gte(5)?1e32:0)},
        eff(x) { return Decimal.mul(0.1,x) }
    },
    4:{ //已实现
        title() { return 'Boost scholarship gain.'},
        pref: "x",
        targ() { return new Decimal(10000)},
        cost(x) { return Decimal.mul(Decimal.pow(10,x),10000).mul(player.upgs[4].gte(4)? 10000 : 1).floor()},
        eff(x) { return Decimal.pow(2,x)},
    },
    5:{ //已实现
        title() { return 'Unlock Undo. Every level add 1 free undo for one gameplay. If you have no undo chance you will lost 90% stamina after undo.'},
        pref: "+",
        targ() { return new Decimal(100000)},
        cost(x) { return Decimal.mul(Decimal.pow(20,x),300000).floor()},
        eff(x) { return x},
    },
    6:{ //已实现
        title() { return 'You have even higher chance to get a higher-value notebook block.'},
        pref: "x",
        targ() { return new Decimal(100000)},
        cost(x) { return Decimal.mul(Decimal.pow(2.22,x),50000).mul(player.upgs[6].gte(9)? x : 1).floor()},
        eff(x) { return Decimal.mul(0.5,x).add(player.upgs[6].gte(1)? 2:1)},
    },
    7:{ //已实现
        title() { return 'Boost score gain based on your stamina.'},
        pref: "stamina*",
        targ() { return new Decimal(100000)},
        cost(x) { return Decimal.mul(Decimal.pow(300,x),100000).mul(Decimal.add(x,1)).mul(player.upgs[7].gte(2)?x**2:1).floor()},
        eff(x) { return Decimal.mul(0.02,x)},
    },
    8:{ //未实现
        title() { return 'Best rank increase scholarship gain.'},
        pref: "x",
        targ() { return new Decimal(1000000)},
        cost(x) { return Decimal.mul(Decimal.pow(25,x),1000000).floor()},
        eff(x) { return Decimal.mul(1.2,x).mul(player.upgs[7].gte(1)? ((1123-player.bestRank)/200+1) : 1).add(1)},
    },
    9:{ //未实现
        title() { return 'Increase evlove interval'},
        pref: "+",
        targ() { return new Decimal(20000000)},
        cost(x) { return Decimal.mul(Decimal.pow(33.33,x),20000000).floor()},
        eff(x) { return Decimal.mul(x,1)},
    },
    10:{ //未实现
        title() { return 'You have a chance which is higher than upgrade 6 to get a higher-value notebook block.'},
        pref: "x",
        targ() { return new Decimal(3000000)},
        cost(x) { return Decimal.mul(Decimal.pow(2,x),3000000).mul(player.upgs[10].gte(6)? x**1.5 : 1).floor()},
        eff(x) { return Decimal.mul(0.8,x).add(player.upgs[10].gte(1)? 3:1)},
    },
    11:{ //未实现
        title() { return 'Increase maximum stamina'},
        pref: "+",
        targ() { return new Decimal(15000000)},
        cost(x) { return Decimal.mul(Decimal.pow(33.33,x),600000000).floor()},
        eff(x) { return Decimal.mul(50,x)},
    },
    12:{ //未实现
        title() { return 'Improve scholarship formula (x^(1/6)->x^(1/4))'},
        pref: "+",
        targ() { return new Decimal(1500000000)},
        cost(x) { return Decimal.mul(Decimal.pow(2,x),100000000000000).floor()},
        eff(x) { return Decimal.mul(10,x)},
    },


} //全部升级信息

function PresetUpgs(){
    for (let i = 1; i <= TOTAL_UPGS; i++){
        tmp.cost[i] = getUpgCost(i)
        tmp.eff[i] = getUpgEff(i)
        tmp.extra[i] = getExtraUpgs(i)
    }
} //加载页面之后预定义升级temp

function getUpgCost(x) { return UPG_DATA[x].cost(player.upgs[x])}

function getUpgEff(x) { return UPG_DATA[x].eff(player.upgs[x].plus(tmp.extra[x]))}

function getUpgBulk() { return 1 }

function getExtraUpgs(x) {
    let extra = new Decimal(0)
    return extra
} //额外升级数量

function buyUpg(x) {
	let c = getUpgCost(x);
	if (player.balance.value.lt(c)) return; //买不起升级
	player.upgs[x] = Decimal.add(player.upgs[x]||0, new Decimal(getUpgBulk(x)));
	player.balance.value = player.balance.value.sub(c); //买得起升级
}