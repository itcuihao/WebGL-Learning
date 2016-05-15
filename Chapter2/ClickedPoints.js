//
//将位置信息从JavaScript程序中传给顶点着色器，有两种方式：attribute变量和uniform变量。
//		attribute传输与顶点相关的数据；uniform传输那些与顶点无关的数据
//			1）在顶点着色器中声明attribute变量
//			2）将attribute赋值给gl_Position变量
//			3）向attribute变量传输数据
//			
//		attribute 被称为存储限定符，表示其声明的是一个attribute变量，必须声明为全局变量。
//		
//
//
//
//
//
//
//
//
//
//
//
//
//
//顶点着色器程序 GLSL ES语言
var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'attribute float a_PointSize;\n' +

	'void main() {\n'+
	' gl_Position = a_Position;\n' + //设置坐标
	' gl_PointSize = a_PointSize;\n' + //设置尺寸
	'}\n';

//片元着色器程序
var FSHADER_SOURCE =

	'void main() {\n'+
	' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' + //设置颜色
	'}\n';

function main(){
	//获取<canvas>元素
	var canvas = document.getElementById('webgl');

	//获取WebGL绘图上下文
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	//初始化着色器
	if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
		console.log('Failed to initialize shaders.');
		return;
	}

	//获取attribute变量的存储位置
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	if (a_Position<0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

	if (a_PointSize<0) {
		console.log('Failed to get the storage location of a_PointSize');
		return;
	}

	//将顶点位置传输给attribute
	// gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	//将顶点大小传输给attribute
	gl.vertexAttrib1f(a_PointSize, 5.0)
	//指定清空<canvas>的颜色
	gl.clearColor(0.5,0.5,0.5,1.0);

	//注册鼠标点击事件响应函数 ---- 匿名函数 function mousedown(ev) 为了访问局部变量 gl、canvas、a_Position
	canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position);};
	//清空<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	//绘制一个点
	// gl.drawArrays(gl.POINTS,0,1);
}

var g_points = []; //鼠标点击位置数组
function click(ev, gl, canvas, a_Position) {
	var x = ev.clientX; //鼠标点击处的X坐标
	var y = ev.clientY; //鼠标点击处的Y坐标
	var rect = ev.target.getBoundingClientRect();
	//
	//坐标系不同需要转化
	//	1）浏览器客户(client area)与<canvas>坐标不同
	//	2) <canvas>坐标系统与WebGL坐标系统不同
	//	故,坐标由浏览器客户区 ——> <canvas>坐标系 ——> WebGL坐标系
	//	
	x = ((x-rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y-rect.top))/(canvas.width/2);
	//将坐标存储到g_points数组中
	// g_points.push(x);g_points.push(y);
	g_points.push([x,y]);

	//清空<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	var len = g_points.length;
	for (var i = 0; i < len; i++) {
		var xy = g_points[i];
		//将点得位置传递到变量中a_Position
		// gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

		//绘制点
		gl.drawArrays(gl.POINTS, 0, 1);
	}

}




























