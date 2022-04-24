/**
 * Javascript untuk widget tees di blogspot
 */




var base_url = 'https://tees.co.id/';

var styleTag = document.createElement("link");
styleTag.rel = "stylesheet";
styleTag.type = "text/css";
styleTag.href =  base_url + "assets/css/tees-widget.css";
styleTag.media = "all";
document.getElementsByTagName('head')[0].appendChild(styleTag);

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

var scriptTag = document.getElementsByTagName('script');
    scriptTag = scriptTag[scriptTag.length - 1];
var parentTag = scriptTag.parentNode;
var sort = scriptTag.getAttribute("sort");
var store = scriptTag.getAttribute("store");
var limit = scriptTag.getAttribute("limit");

var xhr = new XMLHttpRequest();

if(limit == null) {
    limit = 3;
} 

if(sort == null) {
    sort = 'popular';
}

if(store != undefined) {
    var url = base_url + 'go/stores/' + store + '/products?per_page=' + limit + '&sort=' + sort;    
} else {
    var url = base_url + 'go/products?per_page=' + limit + '&sort=' + sort;
}

xhr.open('GET', url);
xhr.onload = function() {
    if (xhr.status === 200) {
        var tees_widget = document.createElement('div');
        tees_widget.setAttribute('id', 'tees-widget-123192');

        parentTag.appendChild(tees_widget);

        var res = JSON.parse(xhr.responseText).data.products;
        
        if(res.length > 0) {
            for(i=0;i<res.length;i++) {
                var product_item = document.createElement('div');
                product_item.setAttribute('class', 'product-item');
                product_item.style.paddingBottom = '10px';
                tees_widget.appendChild(product_item);

                var link = createLink(res[i]);
                product_item.appendChild(link);

                var img = document.createElement('img');
                img.src = res[i].image_thumb;
                img.style.maxWidth = "135px";
                img.style.background = "transparant";
                img.style.paddingBottom = "1px";

                var meta = document.createElement('div');
                meta.setAttribute('class', 'meta');

                link.appendChild(img);
                link.appendChild(meta);

                var title = document.createElement('span');
                title.setAttribute('class', 'title');
                title.textContent = cut(res[i].name, 12);

                var price = document.createElement('span');
                price.setAttribute('class', 'price');
                price.textContent = 'Rp. ' + formatNumber(res[i].price.normal);

                meta.appendChild(title);
                meta.appendChild(price);                
            }
        }

        var clear = document.createElement('div');
        clear.setAttribute('class', 'clear');
        tees_widget.appendChild(clear);

        if(store != undefined) {
            var cta = document.createElement('a');
            cta.setAttribute('class', 'cta');
            cta.setAttribute('href', base_url + 'stores/' + store);
            cta.setAttribute('target', '_blank');
            cta.textContent = "Lihat Semua \u00bb";
            tees_widget.appendChild(cta);
        }

        var powered = document.createElement('a');
        powered.setAttribute('class', 'powered');
        powered.setAttribute('href', base_url);
        //powered.textContent = "Powered by Tees.co.id";
        tees_widget.appendChild(powered);

    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();

function dehumanize(input) {
    if(input == undefined || input == "")
      return "";

    input = input.replace(/[^0-9a-z]/gi, '-');
    input = input.replaceAll('--', '-');
    input = input.toLowerCase();
    return input;
}

function createLink (data) {
    var link = document.createElement('a');
    link.style.textDecoration = 'none';
    link.style.color = '#313131';
    link.style.textAlign = 'center';
    link.style.display = 'block';
    link.style.fontFamily = 'inherit';

    var utm = 'utm_source=widget&utm_medium=referral&utm_campaign=product&utm_content=' + dehumanize(data.name);
    link.setAttribute('href', base_url + data.model.sname + '-' + dehumanize(data.name) + '-' + data.id + '?model=' + data.model.sname + '&' + utm);
    link.setAttribute('target', '_blank');

    return link;
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function cut (string, max) {
    if(string.length > max) {
        string = string.substr(0, max).trim() + '...';
    }

    return string;
}
