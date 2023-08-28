//初始player对象值
var storageName = "LoseWeightStory";
intervals = {}
var gameData = {
    started: false,
    newsMsg: "",
    newsMarj: -1000000,
    newsLength: 0,
    newsRS: false,
    newsCooldown: 0,
};

function getStartPlayer() {
    let p = {
        currTime: new Date().getTime(),
        currGameTime: new Date().getTime(),
        try: 0,
        current: 0,
        score: 0,
        stepScore: 0,
        scoreMult: 1,
        stemina: 0,
        stepStemina: 0,
        random: 0,
        bestRank: 1123,
        evloveLeft: 30,
        grid: [],
        upgs: [],
        last: {
            grid: [],
            score: 0,
            freeUndo: 1,
        },
        display: {
            upgs: false,
            graduate: false,
        },
        stepRating: {
            current: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            all: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        balance: {
            value: new Decimal(0),
            total: new Decimal(0),
        }
    };
    return p;
}

function fixPlayer() {
    let start = getStartPlayer();
    addNewV(player, start);
    for (let i = 1; i <= TOTAL_UPGS; i++) player.upgs[i] = new Decimal(player.upgs[i] || 0);
    //gridSetUp()
}
//检查player对象中是否有未定义对象，如果有替换为player初始值中的对应值，方便进一步游戏开发
function addNewV(obj, start) {
    for (let x in start) {
        if (obj[x] === undefined) obj[x] = start[x]
        else if (typeof start[x] == "object" && !(start[x] instanceof Decimal)) addNewV(obj[x], start[x])
        else if (start[x] instanceof Decimal) obj[x] = new Decimal(obj[x])
    }
}
//加载游戏(网页body完成加载后运行)
function loadGame() {
    let g = localStorage.getItem(storageName);
    if (g !== null) player = JSON.parse(atob(g));
    else player = getStartPlayer(); //玩家没玩过

    fixPlayer(); //很重要!!!没了容易出事
    updateTemp(); //加载各种二级变量
    updateTemp();
    updateTemp();
    updateTemp();
    updateTemp();
    loadVue(); //加载vue
    intervals.game = setInterval(function() { gameLoop(0) }, 30) //30毫秒一个tick
    intervals.save = setInterval(function() { save(); }, 2500) //2.5秒一保存
}

function save() {
    localStorage.setItem(storageName, btoa(JSON.stringify(player)));
}
//导入存档
function importSave() {
    let data = prompt("Paste your save: ")
    if (data === undefined || data === null || data == "") return;
    try {
        player = JSON.parse(atob(data));
        save()
        window.location.reload();
    } catch (e) {
        console.log("Import failed! Please check if you have a right save.");
        console.error(e);
        return;
    }
}
//导出存档(导出方式为*下载文件*)
function exportSave() {
    let data = btoa(JSON.stringify(player))
    const a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
    a.setAttribute('download', "Hebei Zhongkao Tree_" + new Date() + ".txt");
    a.setAttribute('id', 'downloadSave');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
//重置游戏
function hardReset() {
    if (!confirm("您确定要进行硬重置吗？ 这不会给你任何奖励!!!")) return;
    player = getStartPlayer();
    save();
    window.location.reload();
}

function onClick(id) {
    player.stepScore = 0
    player.stepStemina = -1
    player.scoreMult = 1
    if (id == player.current) player.current = 0 //原地tp给姐爬
    else {
        if (typeof(player.grid[player.current]) == 'number' && NaNCheck(player.grid[player.current]) < 0) player.current = id //负数方块无法合并
        else if (player.grid[player.current] == undefined) player.current = id
        else if (player.grid[player.current] == 'nothing') player.current = id //空位？！
        else if (typeof(player.grid[player.current]) == 'number' && NaNCheck(player.grid[player.current]) > 0) {
            if (!(player.current[0] == id[0] || player.current[1] == id[1])) { player.current = id; return } //不同行同列无法合并
            else if (player.current == id + 1 || player.current == id - 1 || player.current == id - 10 || player.current == id + 10) { //相邻方块
                if (player.grid[id] == 'nothing') { //空位
                    recordGrid()
                    player.grid[id] = player.grid[player.current]
                    player.grid[player.current] = getNewBlock()
                    player.stemina -= (1 + getTotalMinusStemina())
                    player.score -= getTotalMinus()
                    if (getTotalMinus() != 0) floatText('score', '-' + formatWhole(getTotalMinus()))
                    player.current = 0
                    player.evloveLeft -= 1
                    if (player.evloveLeft == 0) evloveAll()
                } else if (typeof(player.grid[id]) == 'number' && NaNCheck(player.grid[id]) == player.grid[player.current]) { //相同数字方块
                    recordGrid()
                    player.grid[id] = player.grid[player.current] * 2, player.stepScore += player.grid[id] * ScoreMult(), player.stepStemina += Math.LOG2E * Math.log(player.grid[id])
                    player.grid[player.current] = getNewBlock()
                    player.stepScore -= getTotalMinus()
                    player.stepStemina -= getTotalMinusStemina()
                    player.score += player.stepScore
                    player.stemina += player.stepStemina
                    player.current = 0
                    if (player.stepStemina >= 0) getStepText(player.stepScore)
                    else getStepText(player.stepScore)
                    player.evloveLeft -= 1
                    if (player.evloveLeft == 0) evloveAll()
                } else player.current = id //无法合并的其他情况
            } else if ((player.current.toString()[0] == id.toString()[0] || player.current.toString()[1] == id.toString()[1]) && (typeof(player.grid[id]) == 'number' && NaNCheck(player.grid[id]) == player.grid[player.current])) { //可以跳跃合并(无新方块生成)
                if (typeof(player.grid[id]) == 'number' && NaNCheck(player.grid[id]) == player.grid[player.current]) skipPending(id.toString(), player.current.toString(), player.grid[player.current])
                player.grid[id] = player.grid[player.current] * 2, player.stepScore += player.grid[id] * player.scoreMult * ScoreMult(), player.stepStemina += Math.LOG2E * Math.log(player.grid[id])
                player.grid[player.current] = 'nothing'
                player.stepScore -= getTotalMinus()
                player.stepStemina -= getTotalMinusStemina()
                player.score += player.stepScore
                player.stemina += player.stepStemina
                player.current = 0
                if (player.stepStemina >= 0) getStepText(player.stepScore)
                else getStepText(player.stepScore)
                player.evloveLeft -= 1
                if (player.evloveLeft == 0) evloveAll()
            } else player.current = id
        }
    }
}

function getNewBlock() {
    player.random = Math.random()
    if (player.score <= 1000 * ScoreMult()) {
        if (player.random <= 0.9) return getRandomPositiveBlock(0.9)
        return -1
    }
    if (player.score <= 3000 * ScoreMult()) {
        if (player.random <= 0.85) return getRandomPositiveBlock(0.85)
        if (player.random <= 0.95) return -1
        else return -2
    }
    if (player.score <= 7000 * ScoreMult()) {
        if (player.random <= 0.8) return getRandomPositiveBlock(0.8)
        if (player.random <= 0.9) return -1
        else return -2
    }
    if (player.score <= 12000 * ScoreMult()) {
        if (player.random <= 0.8) return getRandomPositiveBlock(0.8)
        if (player.random <= 0.9) return -1
        else if (player.random <= 0.95) return -2
        else return -4
    }
    if (player.score <= 30000 * ScoreMult()) {
        if (player.random <= 0.8) return getRandomPositiveBlock(0.8)
        if (player.random <= 0.9) return -2
        else if (player.random <= 0.95) return -4
        else return -8
    } else {
        if (player.random <= 0.8) return getRandomPositiveBlock(0.8)
        if (player.random <= 0.9) return -4
        else if (player.random <= 0.95) return -8
        else return -16
    }
}

function ScoreMult() {
    let mult = 1
    if (player.upgs[7].gte(1)) mult *= (Number(getUpgEff(7)) * (player.stemina + 1) + 1)
    if (player.upgs[5].gte(1)) mult *= 1.3
    return mult
}

function getEvloveFactor() {
    let base = 40
    if (player.score >= (1000 * ScoreMult())) base += 40
    if (player.score >= (3000 * ScoreMult())) base += 55
    if (player.score >= (7000 * ScoreMult())) base += 70
    if (player.score >= (12000 * ScoreMult())) base += 90
    if (player.score >= (30000 * ScoreMult())) base += 110
    if (player.score >= (70000 * ScoreMult())) base += Math.sqrt(player.score - 70000) ** 0.8
    return base
}

function getEvloveTurns() {
    let turns = 10 + Number(getUpgEff(9))
    if (player.score >= 100000) turns = Math.floor(turns / 2)
    if (player.score >= 220000) turns = Math.floor(turns / 1.6)
    return turns
}

function getRandomPositiveBlock(base) {
    if (getBlockFactor() <= 100) {
        if (player.random <= (100 - getBlockFactor()) / 100 * base) return 2
        else if (player.random <= base) return 4
    } else if (getBlockFactor() <= 1000) {
        if (player.random <= (100 - getBlockFactor() / 10) / 100 * base) return 4
        else if (player.random <= base) return 8
    } else if (getBlockFactor() <= 10000) {
        if (player.random <= (100 - getBlockFactor() / 100) / 100 * base) return 8
        else if (player.random <= base) return 16
    } else if (getBlockFactor() <= 1000000) {
        if (player.random <= (100 - getBlockFactor() / 10000) / 100 * base) return 16
        else if (player.random <= base) return 32
    } else return 64
}

function getBlockFactor() {
    return 10 + Number(getUpgEff(2))
}

function skipPending(id1, id2, number) { //判定能否消除途经方块
    player.scoremult += getUpgEff(3)
    recordGrid()
    if (Number(id2) < Number(id1)) {
        id1 = { id1: id2, id2: id1 }
        id2 = id1.id2
        id1 = id1.id1
    }
    if (id1[0] == id2[0]) {
        for (var i = Number(id1) + 1; i < Number(id2); i++) {
            if (typeof(player.grid[i]) == 'number' && NaNCheck(player.grid[i]) < 0 && NaNCheck(player.grid[i] * (-1)) < number) { player.stepScore += player.grid[i] * (-1), player.grid[i] = 'nothing', player.scoreMult += 0.2, player.stepStemina += 2 }
            player.scoreMult += 0.1
        }
    } else if (id1[1] == id2[1]) {
        for (var i = Number(id1) + 10; i < Number(id2); i = i + 10) {
            if (typeof(player.grid[i]) == 'number' && NaNCheck(player.grid[i]) < 0 && NaNCheck(player.grid[i] * (-1)) < number) { player.stepScore += player.grid[i] * (-1), player.grid[i] = 'nothing', player.scoreMult += 0.2, player.stepStemina += 2 }
            player.scoreMult += 0.1
        }
    }
}

const LEVEL_DATA = {
    0: {
        size: 5,
        map: {
            1: [-1, -3, "nothing", -3, -1],
            2: [-3, 2, "nothing", 2, -3],
            3: ["nothing", "nothing", 18, "nothing", "nothing"],
            4: [-3, 2, "nothing", 2, -3],
            5: [-1, -3, "nothing", -3, -1],
        }
    }
}

function floatText(id, text, leftOffset = 200, color = 'white') {
    var el = $("#" + id)
    el.append("<div class='floatingText' style='left: " + leftOffset + "px;position:relative;color:" + color + "'>" + text + "</div>")
    setTimeout(function() {
        el.children()[4].remove()
    }, 1000)
}

function startGame() {
    if (player.bestRank == 1123) {
        if (!confirm("这是你第一次玩这个游戏。 您想阅读该游戏的介绍[取消]还是立即开始游戏[确认]?")) {
            showTab('Introduction', 'normal')
            return
        }
    }
    player.stemina = 20
    player.score = 0
    player.try += 1
    player.evloveLeft = 30
    gridSetUp()
    if (player.upgs[1] >= 1) player.grid[43] = Number(getUpgEff(1).round())
    showTab('Game', 'normal')
}
/*setInterval(function(){
	getStepText(19000000000000)
},1000)
*/
function GetFontColor() {
    if (player.stemina > 98) return 'cyan'
    else if (player.stemina > 90) return 'yellow'
    else if (player.stemina > 10) return 'rgb(255,' + (((player.stemina - 10) * 3.1875)) + ',0)'
    else return 'red'
}

function calcRank() {
    if (player.score < 0) return 1123
    if (player.score < 1230) return 1123 - player.score / 10
    else if (player.score < 3230) return 1000 - (player.score - 1230) / 20
    else if (player.score < 6230) return 900 - (player.score - 3230) / 30
    else if (player.score < 12230) return 800 - (player.score - 6230) / 60
    else if (player.score < 20230) return 700 - (player.score - 12230) / 90
    else if (player.score < 50230) return 600 - (player.score - 20230) / 300
    else if (player.score < 350230) return 500 - (player.score - 50230) / 3000
    else if (player.score < 1550230) return 400 - (player.score - 350230) / 12000
}

function endGame() {
    if (calcRank() < player.bestRank) player.bestRank = calcRank()
    player.balance.value = player.balance.value.add(calcBalance())
    player.balance.total = player.balance.total.add(calcBalance())
    player.score = 0
    player.last.freeUndo = Number(player.upgs[5])
    for (var i = 0; i <= 9; i++) {
        player.stepRating.all[i] += player.stepRating.current[i]
        player.stepRating.current[i] = 0
    }
    showTab('Main', 'normal')
}

function calcBalance() {
    let base = new Decimal(player.score).div(2)
    for (var i = 1; i <= 9; i++) {
        base = base.mul(Math.pow(player.stepRating.current[i], 1 / 6) + 1)
    }
    base = base.mul(getUpgEff(4))
    base = base.mul(getUpgEff(8))
    return base
}

function getImage(money) {
    if (money.lt(100)) return 'https://i.postimg.cc/dVQS2RM4/1dollar.jpg'
    else if (money.lt(10000)) return 'https://i.postimg.cc/xjtmkLR0/100dollar.jpg'
    else if (money.lt(1e6)) return 'https://i.postimg.cc/wxftxgqM/10-4dollar.png'
    else if (money.lt(1e8)) return 'https://i.postimg.cc/j59r9gTx/10-6dollar.png'
    else return 'https://i.postimg.cc/mgwkqs5T/10-8dollar.png'
}

function graduate() {
    if (calcRank() > 400 || getMaxBlock() < 2048) alert('You have not met the requirements of graduation now!')
    else alert('Coming soon...')
}

function getEnd(arr) {
    var a = arr.toString()
    if (a[a.length - 1] == '1') return 'st'
    if (a[a.length - 1] == '2') return 'nd'
    if (a[a.length - 1] == '3') return 'rd'
    else return 'th'
}