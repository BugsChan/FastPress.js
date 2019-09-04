/**
 * copyleft © 陈子为 （BugsChan)
 * 2019.09.04
 * 支持chrome和firefox浏览器
 * 申明：本软件是开源软件，你可以自行定制和用在自己的项目中，但请做好审核和适配工作。
 * 如有问题本人概不负责！
 */

class KeyboardCtrl{
	
	constructor() {
	    window.addEventListener("keydown", (evt) => {
	    	if(evt.keyCode == 17){
	    		this.struggle()
	    	}else if(evt.keyCode == 27 && this.dom){
	    		this.dom.blur();
	    	}else if(this.set){
	    		const clearsee = ()=>{
	    			this.onsee = false;
	    			this.focus(this.cmd);
	    			this.clearAll();
	    		};
	    		if(this.onsee){
	    			this.cmd += this.getKeyNum(evt.keyCode);
	    			clearTimeout(this.timer);
	    			this.timer = setTimeout(clearsee, 500);
	    		}else{
	    			this.cmd = this.getKeyNum(evt.keyCode);
	    			this.timer = setTimeout(clearsee, 500);
	    			this.onsee = true;
	    		}
	    	}
	    });
	}
	struggle(){
		if(!this.set){
			this.setAll();
		}else{
			this.clearAll();
		}
	}
	setAll(){
		const addDom = (dom, innerText) => {
			const position = dom.getBoundingClientRect();
			const x = position.x + document.documentElement.scrollLeft;
			const y = position.y + document.documentElement.scrollTop;
			const width = position.width;
			const heigh = position.height;
			let newDom = document.createElement("div");
			newDom.className = "keyboardshow";
			newDom.style.height = '20px';
			newDom.style.width = '35px';
			newDom.style.fontSize = '18px !important';
			newDom.innerText = innerText;
			newDom.style.position = 'absolute ';
			newDom.style.left = x - (dom.tagName.toLowerCase() == 'option' ? 40 : 15) + 'px ';
			newDom.style.top = y - 5 + 'px ';
			newDom.style.backgroundColor = 'yellow';
			newDom.style.textAlign = 'center';
			newDom.style.zIndex = '8888';
			document.body.appendChild(newDom);
		};
		this.set = true;
		let all = document.querySelectorAll("a,input,button,select,option");
		const keyCodes = this.getKeyCodes(all.length);
		this.cmds = {};
		for(let i = 0; i < keyCodes.length; i++){
			this.cmds[keyCodes[i]] = all[i];
			addDom(all[i], keyCodes[i].toUpperCase());
		}
	}
	clearAll(){
		this.set = false;
		let all = document.querySelectorAll(".keyboardshow");
		for(let each of all){
			document.body.removeChild(each);
		}
	}
	getKeyNum(keycode){
		//a 65
		const aCode = 'a'.charCodeAt(0);
		return String.fromCharCode(aCode + (keycode - 65));
	}
	getKeyCodes(length){
		const codeToKey = (code) => {
			let ans = '';
			if(code > 26){
				ans += codeToKey(parseInt(code / 26));
			}
			ans += String.fromCharCode('a'.charCodeAt(0) + (code % 26 == 0 ? 26 : code % 26) - 1);
			return ans;
		};
		let keycodes = [];
		for(let i = 0; i < length; i++){
			keycodes.push(codeToKey(i + 1));
		}
		return keycodes;
	}
	focus(code){
		const dom = this.cmds[code];
		if(!dom)return;
		switch(dom.tagName.toLowerCase()){
			case "input":
				if(dom.type == 'text' || dom.type == 'password' || dom.type == 'number'){
					this.dom = dom;
					dom.focus();
					break;
				}
			case 'select':
				dom.size = dom.length;
				break;
			case 'option':
				dom.parentNode.selectedIndex = ((node) => {
					//判断node是第几个元素
					let index = 0;
					node = node.previousElementSibling;
					while(node){
						index ++;
						node = node.previousElementSibling
					};
					return index;
				})(dom);
				break;
			default:
				let eventObj = document.createEvent("MouseEvents");
				eventObj.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0);
				dom.dispatchEvent(eventObj);
		}
	}
}

//如果作为一个模块使用，则取消注释
//export {KeyboardCtrl};

//如果作为引用使用，则加上注释
new KeyboardCtrl();
