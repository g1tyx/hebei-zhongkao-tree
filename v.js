var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
			player,
			tmp,
			format,
			Decimal,
			tab,
        }
	})
}

const COIN_DATA = [
	{ "name": " placeholder", "color": "#ffffff", "value": 1e305},
	{ "name": " placeholder", "color": "#ffffff", "value": 1e300},
	{ "name": " placeholder", "color": "#ffffff", "value": 1e200},
    { "name": " 𒀱ultiversium", "color": "#ffffff", "value": 1e64, "class": "currency-shadow-rainbow" },
    { "name": " 𒀱niversium", "color": "#ffffff", "value": 1e49, "class": "currency-shadow" },
    { "name": " 𒇫uperclusterium", "color": "#66ccff", "value": 1e43, "class": "currency-shadow" },
    { "name": "🜊ilkyGalaxium", "color": "#00ff00", "value": 1e37, "class": "currency-bold" },
    { "name": "✹olitarium", "color": "#ffffcc", "value": 1e32 },
    { "name": "∰acilitium", "color": "#ff0083", "value": 1e28 },
    { "name": "Φhitane", "color": "#27b897", "value": 1e25 },
    { "name": "Ξizene", "color": "#cd72ff", "value": 1e22 },
    { "name": "Δyclohaptene", "color": "#f5c211", "value": 1e19 },
    { "name": "diamond", "color": "#ffffff", "value": 1e16 },
    { "name": "ruby", "color": "#ed333b", "value": 1e14 },
    { "name": "sapphire", "color": "#6666ff", "value": 1e12 },
    { "name": "emerald", "color": "#2ec27e", "value": 1e10 },
    { "name": "platinum", "color": "#79b9c7", "value": 1e8 },
    { "name": "gold", "color": "#E5C100", "value": 1000000 },
    { "name": "silver", "color": "#a8a8a8", "value": 10000 },
    { "name": "copper", "color": "#a15c2f", "value": 100 },
	{ "name": "iron", "color": "#444444", "value": 1 },
]
function formatMoney(money)
{
    var money2 = Math.floor(money)
    var money_list = ["","","",'#000000',"#000000","#000000"]
    var coinUsed = 0
    for(var i=0 ; i<=2; i++){
        for (var j = 1; j < COIN_DATA.length; j++) {
            var m = COIN_DATA[j].value;
            var prev = COIN_DATA[j - 1].value;
            var diff = prev ? prev / m : Infinity;
            var amount = Math.floor(money2 / m) % diff;
            if ((amount > 0 || (money2 < 1 && m == 1))) {
                money_list[i] = amount+COIN_DATA[j].name
                money_list[i+3] = COIN_DATA[j].color
                coinUsed++
                break
            }
        }
        money2 = money2-(amount*m)
        if(money2==0) break
}
return money_list
}