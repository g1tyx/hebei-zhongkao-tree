function getStepText(score){
   if(score <= 100) floatText('score', '+'+formatWhole(score),200,'white'),player.stepRating.current[0]+=1
   else if(score <= 300) floatText('score', '+'+formatWhole(score)+'<br>Good!',200,'skyblue'),player.stepRating.current[1]+=1
   else if(score <= 1000) floatText('score', '+'+formatWhole(score)+'<br>Great!',200,'lime'),player.stepRating.current[2]+=1
   else if(score <= 3000) floatText('score', '+'+formatWhole(score)+'<br>Amazing!',200,'lavender'),player.stepRating.current[3]+=1
   else if(score <= 10000) floatText('score', '+'+formatWhole(score)+'<br>Unbelievable!',200,'lavender'),player.stepRating.current[4]+=1
   else if(score <= 30000) floatText('score', '+'+formatWhole(score)+'<br>Fantastic!',200,'darkViolet'),player.stepRating.current[5]+=1
   else if(score <= 100000) floatText('score', '+'+formatWhole(score)+'<br>Marvel!',200,'hotpink'),player.stepRating.current[6]+=1
   else if(score <= 300000) floatText('score', '+'+formatWhole(score)+'<br>Miracle!',200,'orange'),player.stepRating.current[7]+=1
   else if(score <= 1000000) floatText('score', '+'+formatWhole(score)+'<br>Unparalleled miracle!!',200,'red'),player.stepRating.current[8]+=1
   else floatText('score', '+'+formatWhole(score)+'<br>Eternal miracle!!',200,'red'),player.stepRating.current[9]+=1
}

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

function evloveAll()
{
    for(var i=1; i<=9; i++)
	{
		for (var j=1; j<=9; j++)
		{
            var ran = Math.random()*100
	        if(player.grid[i*10+j]<0&&player.grid[i*10+j]*(-1)*ran<=getEvloveFactor()) player.grid[i*10+j] = player.grid[i*10+j]*2
		}
	}
    player.evloveLeft = getEvloveTurns()
}