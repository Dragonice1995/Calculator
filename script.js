document.addEventListener("keypress", pressKey);
document.addEventListener("keydown", pressSpecKey);

//возможные операторы
const operators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
	'%': (x, y) => x % y,
};

//функция определяет унарная операция или нет
function isUnary(oper) {
	if ((oper == '-') || (oper == '+')) {
		return true;
	} else {
		return false;
	}
};

//функция определяет приоритет операции
function priority(oper) {
	if ((oper == '+') || (oper == '-')) {
		return 1;
	} else if ((oper == '*') || (oper == '/') || (oper == '%')) {
		return 2;
	} else {
		return -1;
	}
};

//функция вычисления с помощью обратной польской записи (Reverse Polish notation (RPN))
function calculate() {
	var expression = document.getElementById("expression");
	var expr = expression.value;
	var mayBeUnary = true; //операция является унарной
	var unaryOp = ''; //унарная операция
	var result = []; //результаты расчета
	var stack = []; //операции
	for (var i = 0; i < expr.length; i++) {
		if (expr[i] != ' ') {
			if (expr[i] == '(') {
				//заносим открывающуюся скобку в стек
				stack.push(expr[i]);
				mayBeUnary = true;
			} else if (expr[i] == ')') {
				//если закрывающаяся скобка, то выполняем все вычисления
				//пока не считаем из стека открывающуюся скобку;
				//обе скобки отбрасываем
				var vr = stack.pop();
				while ((vr != '(') && (stack.length != 0)) {
					var [y, x] = [result.pop(), result.pop()];
					result.push(operators[vr](x, y));
					vr = stack.pop();
				}
				//если последний символ не (, то ошибка
				if (vr != '(') {
					expression.value = "Ошибка";
					return 0;
				}
				mayBeUnary = false;
			} else if (expr[i] in operators) {
				//если оператор
				if (mayBeUnary && isUnary(expr[i])) {
					//если унарный, то запоминаем его
					if ((unaryOp == expr[i]) && (unaryOp == '-')) {
						unaryOp = '';
					} else {
						unaryOp = expr[i];
					}
				} else {
					//если не унарный, то выполняем все операции из стека,
					//у которых приоритет выше либо равен данной операции,
					//а затем заносим операцию в стек
					while ((stack.length != 0) && (priority(stack[stack.length - 1]) >= priority(expr[i]))) {
						if (result.length >= 2) {
							var vr = stack.pop();
							var [y, x] = [result.pop(), result.pop()];
							result.push(operators[vr](x, y));	
						} else {
							//нет чисел для операции
							expression.value = "Ошибка";
							return 0;
						}
					}
					stack.push(expr[i]);
				}
				mayBeUnary = true;
			} else if (!isNaN(expr[i])){
				//заносим все цифры и точки в number, а затем
				//преобразуем в число с учетом унарой операции
				var number = "";
				var mayBePoint = true;
				while ((!isNaN(expr[i]) || (expr[i] == '.')) && (i < expr.length)) {
					if (expr[i] == ".") {
						//не больше одной точки в числе
						if (!mayBePoint) {
							expression.value = "Ошибка";
							return 0;
						}
						mayBePoint = false;
					}
					number += expr[i];
					i++;
				}
				i--;
				if (unaryOp != '') {
					result.push(parseFloat(unaryOp + number));
					unaryOp = '';
				} else {
					result.push(parseFloat(number));
				}
				mayBeUnary = false;
			} else {
				//ошибка в выражении, так как таких символов не должно быть
				expression.value = "Ошибка";
				return 0;
			}
		}		
	}
	//выполняем оставшиеся операции
	while ((stack.length != 0) && (result.length >= 2)) {
		var [y, x] = [result.pop(), result.pop()];
		result.push(operators[stack.pop()](x, y));
	}
	if (!isNaN(result[result.length - 1]) && stack.length == 0) {
		expression.value = result.pop();
	} else {
		expression.value = "Ошибка";
		return 0;
	}
};

//функция добавления к строке символа
function addCharacter(char) {
	var expression = document.getElementById("expression");
	if ((expression.value == "0" && (char != ".")) || expression.value == "Ошибка") {
		expression.value = char;
	} else {
		expression.value += char;
	}
};

//функция обработки нажатия клавиши
function pressKey(e) {
	var expression = document.getElementById("expression");
	if (e.which == 13) {
		calculate();
	} else {
		var ch = e.key;
		if ((!isNaN(ch)) || (ch in operators) || (ch == ".") || (ch == "(") || (ch == ")")) {
			addCharacter(ch);
		}
	}
};

//функция обработки нажатия спец клавиши (del и backspace)
function pressSpecKey(e) {
	var expression = document.getElementById("expression");
	if (e.which == 46) {
		clearText();
	} else if (e.which == 8) {
		var str = expression.value;
		expression.value = str.substring(0, str.length - 1);
	}
};

//функция очистки поля
function clearText() {
	document.getElementById("expression").value = '0';
};