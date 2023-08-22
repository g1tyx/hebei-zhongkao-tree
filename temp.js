function updateTemp() {
	updateTempThought();
}
//更新所有游戏内二级变量的数值
function updateTempThought()
{
    tmp.currSize = 5
    if(player.stemina > 100) player.stemina = 100
    if(player.stemina < 0) player.stemina = 0
    if(getState() == 'running') showTab('Game', 'normal')
    if(getState() == 'failed') showTab('Result', 'normal')
    if (!tmp.cost) tmp.cost = {};
	if (!tmp.eff) tmp.eff = {};
	if (!tmp.extra) tmp.extra = {};
    PresetUpgs()
}

function getState(){
    if(player.score == 0&&player.stemina <= 0) return 'out'
    else if(player.score!=0&&player.stemina < 1) return 'failed'
    else return 'running'
}