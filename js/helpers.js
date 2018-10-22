function setValues(obj, left, top, width, height){
	obj.style.left = left + "px";
	obj.style.top = top + "px";
	obj.style.width = width + "px";
	obj.style.height = height + "px";
}

function check(map, row, col){
	return map.barrierList[row +'-'+col] === undefined;
}