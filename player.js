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
	bestRank: 1123,
	grid: [],
	};
	return p;
}

function fixPlayer() {
	let start = getStartPlayer();
	addNewV(player, start);
    //gridSetUp()
}
//检查player对象中是否有未定义对象，如果有替换为player初始值中的对应值，方便进一步游戏开发
//真是的，谁愿意游戏开发过程中加变量后一个个定义数值啊啊啊啊啊
//所以加入这个
//==系统提示：作者由于废话被禁言15min==
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
	else player = getStartPlayer();//玩家没玩过
	
	fixPlayer();//很重要!!!没了容易出事
	updateTemp();//加载各种二级变量
	updateTemp();
	updateTemp();
	updateTemp();
	updateTemp();
	loadVue();//加载vue
	intervals.game = setInterval(function() { gameLoop(0)}, 30) //30毫秒一个tick
	intervals.save = setInterval(function() { save(); }, 2500) //2.5秒一保存
}
function save() {
	localStorage.setItem(storageName, btoa(JSON.stringify(player)));
}
//导入存档
function importSave() {
	let data = prompt("粘贴你的存档: ")
	if (data===undefined||data===null||data=="") return;
	try {
		player = JSON.parse(atob(data));
		save()
		window.location.reload();
	} catch(e) {
		console.log("导入失败!请检查你的存档的复制过程中是否有遗漏!");
		console.error(e);
		return;
	}
}
//导出存档(导出方式为*下载文件*)
function exportSave() {
	let data = btoa(JSON.stringify(player))
	const a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
	a.setAttribute('download', "fclwd_"+new Date()+".txt");
	a.setAttribute('id', 'downloadSave');

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
//重置游戏
function hardReset() {
	if (!confirm("你真的要重置游戏吗?这不会给予你任何加成!")) return;
	player = getStartPlayer();
	save();
	window.location.reload();
}
function onClick(id){
	player.stepScore = 0
	player.stepStemina = -1
	player.scoreMult = 1
	if(id == player.current) player.current = 0 //搁这原地tp呢
	else{
		if(typeof(player.grid[player.current])=='number'&&NaNCheck(player.grid[player.current])<0) player.current = id //负数方块无法合并
		else if(player.grid[player.current]==undefined) player.current = id
		else if(player.grid[player.current]=='nothing') player.current = id //空位？！
		else if(typeof(player.grid[player.current])=='number'&&NaNCheck(player.grid[player.current])>0){
            if(!(player.current[0]==id[0]||player.current[1]==id[1])) {player.current = id;return} //不同行同列无法合并
			else if(player.current == id+1||player.current == id-1||player.current == id-10||player.current == id+10){ //相邻方块
				if(player.grid[id] == 'nothing'){ //空位
				    player.grid[id] = player.grid[player.current]
					player.grid[player.current] = getNewBlock()
					player.stemina -= (1+getTotalMinusStemina())
					player.score -= getTotalMinus()
					if(getTotalMinus()!=0)floatText('score', '-'+formatWhole(getTotalMinus()))
					player.current = 0
				}
				else if(typeof(player.grid[id])=='number'&&NaNCheck(player.grid[id]) == player.grid[player.current]){ //相同数字方块
				    player.grid[id] = player.grid[player.current]*2,player.stepScore += player.grid[id],player.stepStemina += Math.LOG2E*Math.log(player.grid[id])
					player.grid[player.current] = getNewBlock()
					player.stepScore -= getTotalMinus()
					player.stepStemina -= getTotalMinusStemina()
					player.score += player.stepScore
					player.stemina += player.stepStemina
					player.current = 0
					if(player.stepStemina>=0)floatText('score', ''+formatWhole(player.stepScore))
					else floatText('score', formatWhole(player.stepScore))
				}
				else player.current = id //无法合并的其他情况
			}
			else if((player.current.toString()[0] == id.toString()[0]||player.current.toString()[1] == id.toString()[1])&&(typeof(player.grid[id])=='number'&&NaNCheck(player.grid[id]) == player.grid[player.current])){ //可以跳跃合并(无新方块生成)
				if(typeof(player.grid[id])=='number'&&NaNCheck(player.grid[id]) == player.grid[player.current]) skipPending(id.toString(),player.current.toString(),player.grid[player.current])
				player.grid[id] = player.grid[player.current]*2,player.stepScore += player.grid[id]*player.scoreMult,player.stepStemina += Math.LOG2E*Math.log(player.grid[id])
				player.grid[player.current] = 'nothing'
				player.stepScore -= getTotalMinus()
				player.stepStemina -= getTotalMinusStemina()
				player.score += player.stepScore
				player.stemina += player.stepStemina
	            player.current = 0
				if(player.stepStemina>=0)floatText('score', ''+formatWhole(player.stepScore))
				else floatText('score', formatWhole(player.stepScore))
			}
			else player.current = id
		}
	}
}
function getNewBlock(){
    let random = Math.random()
	if(getMaxBlock() <= 32){
	    if(random <= 0.8) return 2
	    else if(random <= 0.9) return 4
	    else return -1
	}
	if(getMaxBlock() <= 64){
		if(random <= 0.7) return 2
		else if(random <= 0.85) return 4
		else if(random <= 0.95) return -1
		else return -2
	}
	if(getMaxBlock() <= 128){
		if(random <= 0.6) return 2
		else if(random <= 0.8) return 4
		else if(random <= 0.9) return -1
		else return -2
	}
	if(getMaxBlock() <= 256){
		if(random <= 0.6) return 2
		else if(random <= 0.8) return 4
		else if(random <= 0.9) return -1
		else if(random <= 0.95) return -2
		else return -4
	}
	if(getMaxBlock() <= 512){
		if(random <= 0.6) return 2
		else if(random <= 0.8) return 4
		else if(random <= 0.9) return -2
		else if(random <= 0.95) return -4
		else return -8
	}
	if(getMaxBlock() <= 1024){
		if(random <= 0.6) return 2
		else if(random <= 0.8) return 4
		else if(random <= 0.9) return -4
		else if(random <= 0.95) return -8
		else return -16
	}
}
function skipPending(id1,id2,number){ //判定能否消除途经方块
	if(Number(id2) < Number(id1)){
		id1 = {id1:id2,id2:id1}
		id2 = id1.id2
		id1 = id1.id1
	}
	if(id1[0] == id2[0]){
        for(var i = Number(id1)+1; i < Number(id2); i++){
			if(typeof(player.grid[i])=='number'&&NaNCheck(player.grid[i]) < 0&&NaNCheck(player.grid[i]*(-1)) < number) {player.stepScore += player.grid[i]*(-1),player.grid[i] = 'nothing',player.scoreMult+=0.2,player.stepStemina += 2}
			player.scoreMult+=0.1
		}
	}
	else if(id1[1] == id2[1]){
        for(var i = Number(id1)+10; i < Number(id2);i = i + 10){
			if(typeof(player.grid[i])=='number'&&NaNCheck(player.grid[i]) < 0&&NaNCheck(player.grid[i]*(-1)) < number) {player.stepScore += player.grid[i]*(-1),player.grid[i] = 'nothing',player.scoreMult+=0.2,player.stepStemina += 2}
			player.scoreMult+=0.1
		}
	}
}

const LEVEL_DATA = {
	0:{
		size:5,
		map:{
			1:[-1,-3,"nothing",-3,-1],
			2:[-3,2,"nothing",2,-3],
			3:["nothing","nothing",18,"nothing","nothing"],
			4:[-3,2,"nothing",2,-3],
			5:[-1,-3,"nothing",-3,-1],
		}
	}
}

function floatText(id, text, leftOffset=200) {
    var el = $("#" + id)
    el.append("<div class='floatingText' style='left: " + leftOffset + "px;position:relative'>" + text + "</div>")
    setTimeout(function() {
        el.children()[4].remove()
    }, 1000)
}

function startGame(){
	player.stemina = 20
	player.score = 0
	player.try += 1
	gridSetUp()
	showTab('Game', 'normal')
}

/*
setInterval(function(){
	floatText('score', '+1.798e308')
},1000)
*/

function GetFontColor()
{
    if(player.stemina>98) return 'cyan'
	else if(player.stemina>90) return 'yellow'
    else if(player.stemina>10) return 'rgb(255,'+(((player.stemina-10)*3.1875))+',0)'
    else return 'red'
}

function calcRank()
{
	if(player.score<1230) return 1123-player.score/10
	else if(player.score<3230) return 1000-(player.score-1230)/20
	else if(player.score<6230) return 900-(player.score-3230)/30
	else if(player.score<12230) return 800-(player.score-6230)/60
}

function endGame()
{
	if(calcRank()<player.bestRank) player.bestRank = calcRank()
	player.score = 0
	showTab('Main', 'normal')
}