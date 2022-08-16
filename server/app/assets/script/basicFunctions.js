
let socket = io()

socket.on("redirect", datas => {
    if(datas && datas.url) {
        window.location.href = datas.url
    }
})

function setCookie(cname, cvalue, exdays) {
    if(!exdays) exdays = 1
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* TOASTS */
let Toasts = document.getElementById('toasts')

function createNotification(type = null, message = null) {
    displayDuration = 5000
    if(message == null || type == null) return;
    const notif = document.createElement('div')
    notif.classList.add('toast')
    notif.classList.add(type ? type : "info")
    notif.innerText = message ? message : "Notification message is null"
    Toasts.appendChild(notif)
    setTimeout(() => {
        fade(notif,2)
    }, displayDuration)
    setTimeout(() => {
        notif.remove()
    }, displayDuration+3000)
}

function fade(element, duration) {
    // duration in second
    var op = 1;// initial opacity
    let removeStep = 0.02
    var timer = setInterval(function () {
        if (op <= removeStep){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * removeStep;
    }, 5*duration);
}

function parseHTML(string) {
    let DOMparser = new DOMParser(); // DOMparser.parseFromString("string")
    let string2 = `<div class="ZojGHNZkjZOJzcAEJNGZACILkgjhazLCDigjhlibzdfcikbgzakCieeeeeeeeebdhbikhbfIZHKCDFikZAC">${string}</div>`
    //console.log(string2)
    let a = DOMparser.parseFromString(string2, "text/html")
    let b = a.getElementsByClassName("ZojGHNZkjZOJzcAEJNGZACILkgjhazLCDigjhlibzdfcikbgzakCieeeeeeeeebdhbikhbfIZHKCDFikZAC")[0].firstChild
    return b
}

/**
 * f() : Retourne une chaine héxadécimale de la longueur voulue
 * @param {Number} length - Longueur de la chaine voulue
 * @param {Boolean} capitalize - Mettre la chaine en caractères majuscule
 */
function genHex(length, capitalize=false) {
    let str = [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return (capitalize ? str.toUpperCase() : str.toLowerCase())
}


/**
 * f() : Renvoie true si au moins 1 élément est présent en double
 * @param {Number} list - La liste à check
 */
 function _isArrayDuplicates(list) {
    return ([...new Set(list.filter((item, index) => list.indexOf(item) != index))].length != 0)
}

/**
 * f() : Renvoie la liste des éléments qui sont présent 2 fois ou plus
 * @param {Number} list - La liste à check
 */
 function _getArrayDuplicates(list) {
    return [...new Set(list.filter((item, index) => list.indexOf(item) != index))]
}



function _autoResizeVerticallyAllTextarea() {
    Array.from( document.querySelectorAll('.textarea-autoresize-vertically'), (elem)=>{
    
        function updateSize(){
          elem.style.height = (elem.scrollHeight +2) + 'px';
        }
        elem.addEventListener('input', updateSize);
        updateSize();
    });
}

function _autoResizeVerticallyThisElement(elem) {
    function updateSize(){
        elem.style.height = (elem.scrollHeight +2) + 'px';
    }
    elem.addEventListener('input', updateSize);
    updateSize();
}


class new_cooldowns {
    constructor() {
        this.lastTimestamp = Date.now()
        this.cooldowns = []
    }
    add(name, delay, makeNotif=true) {
        this.cooldowns.push({
            id: genHex(16),
            name: name,
            last: 1,
            delay: delay,
            makeNotif: makeNotif
        })
    }
    test(nameOrId) {
        let filtred = this.cooldowns.filter(x => {
            return (x.id == nameOrId || x.name == nameOrId)
        })
        if(filtred.length > 0) {
            if( (filtred[0].last + filtred[0].delay) < Date.now() ) {
                this.lock(nameOrId)
                return true
            } else {
                if(filtred[0].makeNotif) createNotification("info", "Ralentissez entre les actions !")
                return false
            }
        } else {
            return true
        }
    }
    reset(nameOrId) {
        this.cooldowns = this.cooldowns.map((x, index) => {
            if(x.id == nameOrId || x.name == nameOrId) {
                let b = x
                b.last = 1
                return b
            }
            return x
        })
    }
    lock(nameOrId) {
        this.cooldowns = this.cooldowns.map((x, index) => {
            if(x.id == nameOrId || x.name == nameOrId) {
                let b = x
                b.last = Date.now()
                return b
            }
            return x
        })
    }

}
let Cooldowns = new new_cooldowns()