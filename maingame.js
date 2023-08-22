var player;
var tmp = {};
var tab = {
    normal: "Main",
    options: "Setting",
}
var newstime
const tabs = {
    normal: {
        Options() { return true },
        Main() { return true },
        Game() { return true },
        Result() { return true },
        Introduction() { return true },
    },
    options:
    {
        Setting() {return true},
        Changelog() {return true},
    }
}
function showTab(name, type) { if (tabs[type][name]()) tab[type] = name }
//游戏各种大小标签页以及是否解锁判定