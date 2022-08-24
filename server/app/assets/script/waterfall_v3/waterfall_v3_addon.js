function selectMenuChecker(id, event) {
    if(!id)return;
    if(selectedID)return;
    else {
        if(selectedID === null)return selectedID = undefined
    }
    let alt1 = `alt1_${id}`
    let alt2 = `alt2_${id}`
    let alt3 = `alt3_${id}`
    let top = document.getElementById(id).getBoundingClientRect().y+document.getElementById(alt1).offsetHeight+50>window.innerHeight
    if(event == 'onfocusout') {
        focusedID = undefined
        document.getElementById(alt2).blur()
        document.getElementById(alt1).style.visibility='hidden'
        document.getElementById(id).style.borderRadius='5px'
        document.getElementById(alt3).innerHTML='<svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819"><g><path d="M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693C444.819,130.287,441.295,121.629,434.252,114.203z"></path></g></svg>'
        for(i in document.getElementById(alt1).children) {
            let childrenN = document.getElementById(alt1).children[i]
            if(childrenN.children) {
                document.getElementById(alt1).children[i].style.display='flex'
                if(childrenN.getAttribute('value') == document.getElementById(id).value && document.getElementById(alt2).value != childrenN.children[0].textContent)document.getElementById(alt2).value=childrenN.children[0].textContent
            }
        }
    }
    if(event == 'onclick') {
        focusedID = id
        document.getElementById(alt3).innerHTML='<svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819"><g><path d="M433.968,278.657L248.387,92.79c-7.419-7.044-16.08-10.566-25.977-10.566c-10.088,0-18.652,3.521-25.697,10.566L10.848,278.657C3.615,285.887,0,294.549,0,304.637c0,10.28,3.619,18.843,10.848,25.693l21.411,21.413c6.854,7.23,15.42,10.852,25.697,10.852c10.278,0,18.842-3.621,25.697-10.852L222.41,213.271L361.168,351.74c6.848,7.228,15.413,10.852,25.7,10.852c10.082,0,18.747-3.624,25.975-10.852l21.409-21.412c7.043-7.043,10.567-15.608,10.567-25.693C444.819,294.545,441.205,285.884,433.968,278.657z"></path></g></svg>'
        if(top) {
            document.getElementById(id).style.borderRadius='0px 0px 5px 5px'
            document.getElementById(alt1).style=`visibility: visible; border-radius: 5px 5px 0px 0px; bottom: 100%; border-bottom: solid 1px #282A2E;`
        } else {
            document.getElementById(id).style.borderRadius='5px 5px 0px 0px'
            document.getElementById(alt1).style=`visibility: visible; border-radius: 0px 0px 5px 5px; top: 100%; border-top: solid 1px #282A2E;`
        }
    }
    if(event == 'scroll') {
        if(document.getElementById(id).style.borderRadius != '5px') {
            if(top) {
                document.getElementById(id).style.borderRadius='0px 0px 5px 5px'
                document.getElementById(alt1).style=`visibility: visible; border-radius: 5px 5px 0px 0px; bottom: 100%; border-bottom: solid 1px #282A2E;`
            } else {
                document.getElementById(id).style.borderRadius='5px 5px 0px 0px'
                document.getElementById(alt1).style=`visibility: visible; border-radius: 0px 0px 5px 5px; top: 100%; border-top: solid 1px #282A2E;`
            }
        }
    }
}

function selectMenuOption(id, index, name, value, selected) {
    if(!selected) {
    for(i in document.getElementById(`alt1_${id}`).children) {
        if(document.getElementById(`alt1_${id}`).children[i].hasAttribute('selected')) {
            document.getElementById(`alt1_${id}`).children[i].removeAttribute('selected')
            break;
        }
    }
    document.getElementById(id).value=value
    document.getElementById(`alt2_${id}`).value=name
    document.getElementById(`alt1_${id}`).children[index].toggleAttribute('selected')
    }
    document.getElementById(`alt2_${id}`).blur()
    document.getElementById(`alt1_${id}`).style.visibility='hidden'
    document.getElementById(id).style.borderRadius='5px'
    document.getElementById(`alt3_${id}`).innerHTML='<svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819"><g><path d="M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693C444.819,130.287,441.295,121.629,434.252,114.203z"></path></g></svg>'
    selectedID = null
    focusedID = undefined
}

function selectMenuSearch(id, value) {
    for(i in document.getElementById(`alt1_${id}`).children) {
        let childrenN = document.getElementById(`alt1_${id}`).children[i]
        if(childrenN.children) {
            if(childrenN.children[0].textContent.toUpperCase().search(value.toUpperCase()) == -1) childrenN.style.display='none'
            else childrenN.style.display='flex'
        }
    }
}

function Scrolled() {
    if(document.getElementById('mainbox').scrollTop < 200) {
        document.getElementById('titlebar').style.minHeight = (150-150*document.getElementById('mainbox').scrollTop/200)+'px'
    } else document.getElementById('titlebar').style.minHeight = 0
}

function maxRow(id, max_row) {
    if(document.getElementById(id).value.split(/\n/g).length > max_row) {
        document.getElementById(id).value = document.getElementById(id).value.substring(0,document.getElementById(id).value.length-1)
    }
}

function viewPSW(id,myid) {
    if(document.getElementById(id).type=='password') {
        view=1
        document.getElementById(id).type='text'
        document.getElementById(myid).innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto;" width="15" height="15" viewBox="0 0 20 20"><g fill="#fff"><path d="M12.49 9.94A2.5 2.5 0 0 0 10 7.5z"/><path d="M8.2 5.9a4.38 4.38 0 0 1 1.8-.4 4.5 4.5 0 0 1 4.5 4.5 4.34 4.34 0 0 1-.29 1.55L17 14.14A14 14 0 0 0 20 10s-3-7-10-7a9.63 9.63 0 0 0-4 .85zM2 2L1 3l2.55 2.4A13.89 13.89 0 0 0 0 10s3 7 10 7a9.67 9.67 0 0 0 4.64-1.16L18 19l1-1zm8 12.5A4.5 4.5 0 0 1 5.5 10a4.45 4.45 0 0 1 .6-2.2l1.53 1.44a2.47 2.47 0 0 0-.13.76 2.49 2.49 0 0 0 3.41 2.32l1.54 1.45a4.47 4.47 0 0 1-2.45.73z"/></g></svg>'
    } else {
        view=0
        document.getElementById(id).type='password'
        document.getElementById(myid).innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto;" width="15" height="15" viewBox="0 0 20 20"><g fill="#fff"><path d="M10 14.5a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5zM10 3C3 3 0 10 0 10s3 7 10 7 10-7 10-7-3-7-10-7z"/><circle cx="10" cy="10" r="2.5"/></g></svg>'
    }
}