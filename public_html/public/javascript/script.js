/**************************************************
  Show loader when changing pages on app
**************************************************/

document.addEventListener('DOMContentLoaded', function() {
   'use strict';

   var menuScript = {
      init: function() {
         var self = this;
         var menu = document.querySelector('.menu-select');
         var sideMenu = document.querySelector('.side-nav');
         var container = document.querySelector('#container');
         var social = document.querySelector('.social');
         var width = window.innerWidth;

         menu.addEventListener('click', function(){
            self.toggleMenu(sideMenu,container,social);
         }, true);
      },

      toggleMenu: function(sm,c,s) {
         var menuClasses = sm.classList;
         var socialClasses = s.classList;

         var menuIsHidden = sm.classList.contains('slideOutLeft');
         var menuIsShown = sm.classList.contains('slideOutRight');
         var socialIsHidden = s.classList.contains('slideOutUp');
         var socialIsShown = s.classList.contains('slideInDown');

         if (socialIsHidden) {
            if (window.innerWidth < 768) {
               menuClasses.remove('slideOutLeft');
               menuClasses.add('slideInLeft');
            }
            socialClasses.remove('slideOutUp');
            socialClasses.add('slideInDown');
         } else if (socialIsShown) {
            if (window.innerWidth < 768) {
               menuClasses.remove('slideInLeft');
               menuClasses.add('slideOutLeft');
            }
            socialClasses.remove('slideInDown');
            socialClasses.add('slideOutUp');
         } else {
            if (window.innerWidth < 768) {
               menuClasses.remove('slideOutLeft');
               menuClasses.add('slideInLeft');
            }
            socialClasses.remove('slideOutUp');
            socialClasses.add('slideInDown');
         }

         // c.classList.toggle('container-full');
      },
   };

   menuScript.init();

   new Tablesort(document.querySelector('.stats-table'), {
     descending: true
   });

});

/*!
 * tablesort v4.0.1 (2016-07-23)
 * http://tristen.ca/tablesort/demo/
 * Copyright (c) 2016 ; Licensed MIT
*/!function(){function a(b,c){if(!(this instanceof a))return new a(b,c);if(!b||"TABLE"!==b.tagName)throw new Error("Element must be a table");this.init(b,c||{})}var b=[],c=function(a){var b;return window.CustomEvent&&"function"==typeof window.CustomEvent?b=new CustomEvent(a):(b=document.createEvent("CustomEvent"),b.initCustomEvent(a,!1,!1,void 0)),b},d=function(a){return a.getAttribute("data-sort")||a.textContent||a.innerText||""},e=function(a,b){return a=a.toLowerCase(),b=b.toLowerCase(),a===b?0:b>a?1:-1},f=function(a,b){return function(c,d){var e=a(c.td,d.td);return 0===e?b?d.index-c.index:c.index-d.index:e}};a.extend=function(a,c,d){if("function"!=typeof c||"function"!=typeof d)throw new Error("Pattern and sort must be a function");b.push({name:a,pattern:c,sort:d})},a.prototype={init:function(a,b){var c,d,e,f,g=this;if(g.table=a,g.thead=!1,g.options=b,a.rows&&a.rows.length>0)if(a.tHead&&a.tHead.rows.length>0){for(e=0;e<a.tHead.rows.length;e++)if(a.tHead.rows[e].classList.contains("sort-row")){c=a.tHead.rows[e];break}c||(c=a.tHead.rows[a.tHead.rows.length-1]),g.thead=!0}else c=a.rows[0];if(c){var h=function(){g.current&&g.current!==this&&(g.current.classList.remove("sort-up"),g.current.classList.remove("sort-down")),g.current=this,g.sortTable(this)};for(e=0;e<c.cells.length;e++)f=c.cells[e],f.classList.contains("no-sort")||(f.classList.add("sort-header"),f.tabindex=0,f.addEventListener("click",h,!1),f.classList.contains("sort-default")&&(d=f));d&&(g.current=d,g.sortTable(d))}},sortTable:function(a,g){var h,i=this,j=a.cellIndex,k=e,l="",m=[],n=i.thead?0:1,o=a.getAttribute("data-sort-method"),p=a.getAttribute("data-sort-order");if(i.table.dispatchEvent(c("beforeSort")),g?h=a.classList.contains("sort-up")?"sort-up":"sort-down":(h=a.classList.contains("sort-up")?"sort-down":a.classList.contains("sort-down")?"sort-up":"asc"===p?"sort-down":"desc"===p?"sort-up":i.options.descending?"sort-up":"sort-down",a.classList.remove("sort-down"===h?"sort-up":"sort-down"),a.classList.add(h)),!(i.table.rows.length<2)){if(!o){for(;m.length<3&&n<i.table.tBodies[0].rows.length;)l=d(i.table.tBodies[0].rows[n].cells[j]),l=l.trim(),l.length>0&&m.push(l),n++;if(!m)return}for(n=0;n<b.length;n++)if(l=b[n],o){if(l.name===o){k=l.sort;break}}else if(m.every(l.pattern)){k=l.sort;break}for(i.col=j,n=0;n<i.table.tBodies.length;n++){var q,r=[],s={},t=0,u=0;if(!(i.table.tBodies[n].rows.length<2)){for(q=0;q<i.table.tBodies[n].rows.length;q++)l=i.table.tBodies[n].rows[q],l.classList.contains("no-sort")?s[t]=l:r.push({tr:l,td:d(l.cells[i.col]),index:t}),t++;for("sort-down"===h?(r.sort(f(k,!0)),r.reverse()):r.sort(f(k,!1)),q=0;t>q;q++)s[q]?(l=s[q],u++):l=r[q-u].tr,i.table.tBodies[n].appendChild(l)}}i.table.dispatchEvent(c("afterSort"))}},refresh:function(){void 0!==this.current&&this.sortTable(this.current,!0)}},"undefined"!=typeof module&&module.exports?module.exports=a:window.Tablesort=a}();

(function(){
  var cleanNumber = function(i) {
    return i.replace(/[^\-?0-9.]/g, '');
  },

  compareNumber = function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    a = isNaN(a) ? 0 : a;
    b = isNaN(b) ? 0 : b;

    return a - b;
  };

  Tablesort.extend('number', function(item) {
    return item.match(/^-?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
      item.match(/^-?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
      item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
  }, function(a, b) {
    a = cleanNumber(a);
    b = cleanNumber(b);

    return compareNumber(b, a);
  });
}());