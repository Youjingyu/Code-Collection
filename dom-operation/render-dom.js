/******** rendering function **********/
(function(Dom, doc){
    // cache template function
    var cache = {};
    // cache the parent node of the template tag,
    // and use the parent node to render html every time
    var templ_parent_node_cache = {};

    // rendering function
    Dom.render = function render(str, data){
        var $ele = doc.getElementById(str);

        // calculate the rendering function if not cached
        var fn = cache[str] = cache[str] || new Function("obj",
                // the rendering function references jquery teml
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){var data = obj;p.push('" +
                $ele.innerHTML
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // cache the parent node
        if($ele){
            templ_parent_node_cache[str] = $ele.parentNode;
        }
        templ_parent_node_cache[str].innerHTML = fn(data);
    };
})(window.Dom || (window.Dom = {}), document);