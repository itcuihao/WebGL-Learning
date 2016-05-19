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

	//-------------------------
	//设置顶点位置
	var n = initVertexBuffers(gl);
	if (n<0){
		console.log('Failed to set the positions of the vertices');
		return;
	}
	//将顶点位置传输给attribute
	// gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	//将顶点大小传输给attribute
	gl.vertexAttrib1f(a_PointSize, 15.0)
	//指定清空<canvas>的颜色
	gl.clearColor(0.5,0.5,0.5,1.0);

	//清空<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	//绘制四个点
	gl.drawArrays(gl.POINTS,0,n);  //n=4
}

function initVertexBuffers(gl){
	var vertices = new Float32Array([
		0.0, 0.5, -0.5, 0.0, 0.0, -0.5, 0.5, 0.0
	]);
	var n=4;	//点的个数

	//创建缓冲区对象
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object ');
		return -1;
	}

	//将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	//向缓冲区对象中写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	//将缓冲区对象分配给a_Position变量
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	//连接a_Position变量与分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);

	return n;
}
