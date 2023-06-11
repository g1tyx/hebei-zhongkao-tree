function gridSetUp()
{
	for(var i=1; i<=9; i++)
	{
		for (var j=1; j<=9; j++)
		{
	        player.grid[i*10+j] = 'nothing'
		}
	}
	player.grid[33] = 2
}

function getMaxBlock()
{
	let max = 0
	for(var i=1; i<=9; i++)
	{
		for (var j=1; j<=9; j++)
		{
	        if(player.grid[i*10+j]>max) max = player.grid[i*10+j]
		}
	}
	return max
}

function getTotalMinus()
{
	let minus = 0
	for(var i=1; i<=9; i++)
	{
		for (var j=1; j<=9; j++)
		{
	        if(player.grid[i*10+j]<0) minus += player.grid[i*10+j]
		}
	}
	return minus*(-1)
}

function getTotalMinusStemina()
{
	let minus = 0
	for(var i=1; i<=9; i++)
	{
		for (var j=1; j<=9; j++)
		{
	        if(player.grid[i*10+j]<-1) minus += Math.LOG2E*Math.log(player.grid[i*10+j]*(-1))
		}
	}
	return minus
}