
window.onload = function() {
    var i; /*index*/
    
    /*為每個li後面加上關閉按鈕*/
    function closeBtn() {
      var myNodelist = document.getElementsByTagName("li");
      for (i = 0; i < myNodelist.length; i++) {
        var span = document.createElement("span");
        var txt = document.createTextNode("\u00D7"); /*unicode代碼*/
        span.appendChild(txt);       
        // same with ->  span.innerHTML = "\u00D7";
        span.className = "close";
        myNodelist[i].appendChild(span);
      }
    }
  
    /*點擊關閉按鈕，隱藏當前li*/
    function closeElement() {
      var close = document.getElementsByClassName("close");
      for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          var div = this.parentElement; /*關閉按鈕的父元素 - li*/
          div.style.display = "none";
        }
      }
    }
  
    /*點擊li的時候，加上.checked，再點擊則取消*/
    function ifChecked() {
      var list = document.querySelector('ul');
      list.onclick = function(ev) {
        // tagName是大寫,規定的
        if (ev.target.tagName === 'LI') {
          ev.target.classList.toggle('checked');
        }
      }
    }
  
    /*點擊添加時，創建一個新的ul*/
    function newElement() {
      var li = document.createElement("li");
      var inputValue = document.getElementById("myInput").value;
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      if (inputValue === '') {
        alert("請先輸入一個具體任務。");
      } else {
        document.getElementById("myUL").appendChild(li);
      }
      document.getElementById("myInput").value = ""; /*清空輸入*/
    }
     
    /*初始化list*/
    function initList() {   
      closeBtn();
      closeElement();
      ifChecked();
    }
    
  /*初始化*/
  function init() {
    var addButton = document.getElementById("addButton"); 
    initList();

    /*添加按鈕點擊時執行*/
    addButton.onclick = function() {
      newElement();
      initList();
    }

    /*按回車時亦執行*/
    document.onkeydown = function(event) {
      if(event.keyCode == 13) {
        newElement();
        initList();
      }
    }
  }

  init();

};