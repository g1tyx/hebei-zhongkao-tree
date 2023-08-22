const TOTAL_UPGS = 4
var UPG_DATA = {
    rows: 1,
    rowData: {
        1: [1,2,3,4],
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
        cost(x) { return Decimal.mul(Decimal.pow(1.44,x),1000).floor()},
        eff(x) { return x*5 }
    },
    3:{ //已实现
        title() { return 'Add to the base of jump-merging bonus.'},
        pref: "+",
        targ() {return new Decimal(10000)},
        cost(x) { return Decimal.mul(Decimal.pow(3,x),10000).floor()},
        eff(x) { return Decimal.mul(0.1,x) }
    },
    4:{ //已实现
        title() { return 'Boost scholarship gain.'},
        pref: "x",
        targ() { return new Decimal(10000)},
        cost(x) { return Decimal.mul(Decimal.pow(10,x),10000).floor()},
        eff(x) { return Decimal.pow(1.5,x)},
    }
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