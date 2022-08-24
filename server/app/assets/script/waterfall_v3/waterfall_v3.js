// v2.2.0

let separator = `<hr class="separator">`

let settingBlocks = {
    category: (categoryTitle, disabled=false) => {

        let id = genHex(16)
        return {
            id: id,
            html: `<div class="settingCategory${disabled ? ' disabled' : ''}">
        <div class="title">
            <h3 class="categoryTitle">${categoryTitle}</h3>
        </div>
    </div>`
        }
    },
    switch: (settingName) => {
        let id = genHex(16)
        return {
            id: id,
            html: `<div class="setting" id="setting_${id}">
            <div class="flexed totalwidth">
                <label class="settingLabel" for="setting_${id}_checkbox">${settingName}</label>
            </div>
            <div class="flexed flexedright">
                <div class="subcategory checkbox-container">
                    <input class="checkbox" type="checkbox" id="setting_${id}_checkbox">
                    <div class="checkbox-visual">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>`
        }
    }
}


let AllSettings = [
    // { id: "setting_1bz28fnzekn", type: "checkbox/text/integer/select"}
]

function updateTextInput(elementId, value) {
    document.getElementById(elementId).textContent = `${value}`
}


let Errors = [

]

class generateCategory {
    constructor(categoryName, categoryID, settingList, isEnabled=true, depthIDS=null, depth=1) {
        this.settingList = settingList
        this.categoryName = categoryName
        this.categoryID = categoryID
        this.isEnabled = isEnabled
        this.depth = depth
        this.depthIDS = (depthIDS == null ? [categoryID] : depthIDS)
        //console.log("generateCategory with depthIDS!",depthIDS, this.depthIDS)
        this.maxDepth = 3 // inclu

        this.references = [
            // { id: "main.selectsheep", settingType: settingType}
        ]

        /*
        [
            {
                name: "Main settings",
                description: "Les paramètres principaux",
                id: "main", // lowercase and one word
                settingType: {
                    type: 2,
                    value: [
                        { placeholder: "Activer le matin", value: "active_1"},
                        { placeholder: "Activer le matin", value: "active_2"},
                    ]
                },
                submenu: [

                ]
            }
        ]
        

        settingType:
        0 : Nothing
        1 : Boolean button
        2 : Select list
        3 : Select list radio
        4 : Text input
        5 : Textarea input
        6 : Integer input
        7 : Float input
        8 : Slider
        9 : List manager
        */
    }

    getDepthIDS() {
        //console.log("this.depthIDS",this.depthIDS)
        return JSON.parse(JSON.stringify(this.depthIDS))
    }
    getDepthIDS_String() {
        //console.log("this.depthIDS",this.depthIDS)
        return `${this.depthIDS.join("_")}`
    }
    getWaterfallID(id) {
        //console.log("this.depthIDS",this.depthIDS)
        return `${this.depthIDS.join("_")}_${id}`
    }

    clearReferences() {
        this.references = []
    }
    addReference(setting, submenuCategoryClass=false) {
        this.references.push({setting: setting, submenuCategoryClass: submenuCategoryClass, waterfallID: `${this.getDepthIDS_String()}_${setting.id}` })
        //console.log("references",this.references)
        return this.references
    }

    /**
     * Retourne true si tous les champs requis sont remplis, cela inclu tous les champs pouvant être vide
     */
    canSaveJSON() {
        let notFilled = false
        let mapped = this.references.map((item, index) => {
            if(item.submenuCategoryClass) {
                //console.log("depthIDS",this.getDepthIDS())
                //console.log("item.submenuCategoryClass",item.submenuCategoryClass.getSettingsValuesJSON())
            }
            let setting = item.setting
            let v, value, elem_query;
            switch(setting) {
                case 0:
                    return false
                case 1:
                    if(setting.submenu && setting.submenu.length > 0) {
                        if(item.submenuCategoryClass) {
                            if(document.getElementById(`setting_${item.waterfallID}_checkbox`).checked) {
                                let v = item.submenuCategoryClass.canSaveJSON()
                                if(!v) {
                                    notFilled = true
                                }
                            }
                        }
                    } else {
                        return undefined
                    }
                    break;
                case 2:
                    v = document.getElementById(`setting_${item.waterfallID}_select`).value
                    if(!v || v == undefined || v == null || v == "") notFilled = true
                    break;
                case 4: case 5: case 6: case 7: case 8:
                    v = document.getElementById(`setting_${item.waterfallID}_value`).value
                    if(!v || v == undefined || v == null || v == "") notFilled = true
                    break;
                case 3:
                    elem_query = document.querySelector(`input[name="setting_${item.waterfallID}_radiobutton"]:checked`)
                    value = (elem_query? elem_query.value : undefined)
                    v = (elem_query ? elem_query.value : false)
                    if(!elem_query || !v || v == undefined || v == null || v == "") notFilled = true
                    break;
                case 9:
                    return { id: setting.id, value: ("list manager not created" || null) }
                default:
                    return undefined
            }
        })
        return !notFilled
    }

    getSettingsValuesJSON() {
        let the_json = {}
        let the_mapped = []
        
        this.references.forEach((item, index) => {
            if(item.submenuCategoryClass) {
                //console.log("depthIDS",this.getDepthIDS())
                //console.log("item.submenuCategoryClass",item.submenuCategoryClass.getSettingsValuesJSON())
            }
            let setting = item.setting
            let the_value, elem_query;
            switch(setting.settingType.type) {
                case 0:
                    the_json[setting.id] = setting.value
                    return the_mapped.push({ id: setting.id, value: null })
                case 1:
                    if(setting.submenu && setting.submenu.length > 0) {
                        if(item.submenuCategoryClass) {
                            the_json[setting.id] = (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? item.submenuCategoryClass.getSettingsValuesJSON().json : false)
                            return the_mapped.push({ id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? item.submenuCategoryClass.getSettingsValuesJSON().mapped : false) })
                        } else {
                            the_json[setting.id] = "ERROR"
                            return the_mapped.push({ id: setting.id, value: "ERROR"})
                        }
                    } else {
                        the_value = (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? true : false)
                        the_json[setting.id] = the_value
                        return the_mapped.push({ id: setting.id, value: the_value })
                    }
                case 2:
                    the_value = (document.getElementById(`setting_${item.waterfallID}_select`).value || null)
                    the_json[setting.id] = the_value
                    return the_mapped.push({ id: setting.id, value: the_value })
                case 3:
                    elem_query = document.querySelector(`input[name="setting_${item.waterfallID}_radiobutton"]:checked`)
                    the_value = (elem_query? elem_query.value : undefined)
                    the_json[setting.id] = the_value
                    return the_mapped.push({ id: setting.id, value: value })
                case 4: case 5:
                    the_value = (document.getElementById(`setting_${item.waterfallID}_value`).value || null)
                    the_json[setting.id] = the_value
                    return the_mapped.push({ id: setting.id, value: the_value })
                case 6: case 7: case 8:
                    the_value = parseFloat(document.getElementById(`setting_${item.waterfallID}_value`).value || null)
                    the_json[setting.id] = the_value
                    return the_mapped.push({ id: setting.id, value: the_value })
                case 9:
                    the_value = ("list manager not created" || null)
                    the_json[setting.id] = the_value
                    return the_mapped.push({ id: setting.id, value: the_value })
            }
        })
        
        let mapped = this.references.map((item, index) => {
            if(item.submenuCategoryClass) {
                //console.log("depthIDS",this.getDepthIDS())
                //console.log("item.submenuCategoryClass",item.submenuCategoryClass.getSettingsValuesJSON())
            }
            let setting = item.setting
            let value, elem_query;
            switch(setting.settingType.type) {
                case 0:
                    return { id: setting.id, value: null }
                case 1:
                    if(setting.submenu && setting.submenu.length > 0) {
                        if(item.submenuCategoryClass) {
                            return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? item.submenuCategoryClass.getSettingsValuesJSON() : false) }
                        } else {
                            return { id: setting.id, value: "ERROR"}
                        }
                    } else {
                        return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? true : false) }
                    }
                case 2:
                    return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_select`).value || null) }
                case 3:
                    elem_query = document.querySelector(`input[name="setting_${item.waterfallID}_radiobutton"]:checked`)
                    value = (elem_query? elem_query.value : undefined)
                    return { id: setting.id, value: value }
                case 4: case 5: case 6: case 7: case 8:
                    return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
                case 9:
                    return { id: setting.id, value: ("list manager not created" || null) }
            }
        })
        return { mapped: the_mapped, json: the_json}
    }

    categoryBase(categoryName, categoryID, settingList_html) {
        let id = genHex(16)
        let waterfallCategoryID = this.getWaterfallID(categoryID)
        settingList_html = settingList_html.map((value, index) => {
            if(settingList_html[index+1]) {
                if(settingList_html[index+1].type == 1)return value.html
                else return `${value.html}\n${separator}`
            } else return value.html
        })
        //console.log("this.isEnabled",this.isEnabled)
        if(categoryID == 'submenu') return {
            id: id,
            html: `<div class="settingCategory${this.isEnabled ? '' : ' disabled'}" id="${waterfallCategoryID}"">
            <div style="display: flex; width: 100%; background-color: #282A2E; border-radius: 10px 10px 0px 0px; margin-bottom: 10px;">
                <div style="display: flex; margin: auto;">
                    <h2 class="categoryTitle">${categoryName}</h2>
                    <div style="margin: auto; margin-right: 0px; padding: 5px 10px; background-color: #5865F2; border-radius: 31px; font-size: 15px; font-weight: 750; height: min-content;">submenu</div>
                </div>
            </div>
            ${settingList_html.join(`\n`)}
            </div>`
        }
        else return {
            id: id,
            html: `<div class="settingCategory${this.isEnabled ? '' : ' disabled'}" id="${waterfallCategoryID}">
            <div style="display: flex; width: 100%; background-color: #282A2E; border-radius: 10px 10px 0px 0px; margin-bottom: 10px;">
                <h2 class="categoryTitle">${categoryName}</h2>
            </div>
            ${settingList_html.join(`\n`)}
            </div>`
        }
    }

    _genSetting_nothing(name, description, id, settingType) {
        let waterfallID = this.getWaterfallID(id)
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
                <div class="flexed totalwidth">
                    <label class="settingLabel">
                        <div class="name">${name}</div>
                        <div class="description">${description}</div>
                    </label>
                </div>
                <div class="flexed flexedright">
                </div>
            </div>`
        }
    }
    
    _genSetting_switch(name, description, id, settingType, onclickFunctionName=false) {
        let waterfallID = this.getWaterfallID(id)
        // console.log("onclickFunctionName",onclickFunctionName)
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed totalwidth">
                <label class="settingLabel" for="setting_${waterfallID}_checkbox">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright">
                <div class="subcategory checkbox-container">
                    <input class="checkbox" type="checkbox" id="setting_${waterfallID}_checkbox"${(settingType.value ? " checked" : "")}${onclickFunctionName ? ` onclick="${onclickFunctionName}"` : ""}>
                    <div class="checkbox-visual">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>`
        }
    }
    
    _genSetting_select(name, description, id, settingType) {     
        let waterfallID = this.getWaterfallID(id)
        let selected;
        let placeholder =  settingType.placeholder || null;
        let selectedIndex = settingType.selected
        let selectedList = settingType.value.slice()
        if(!settingType.required) {
            selectedList.unshift({name: '', value: ''})
            if(selectedIndex == undefined) {
                selected = {name: '', value: ''}
            }
            else {
                selectedIndex=selectedIndex+1
            }
        }
        let list = selectedList
        let blocks = selectedList.map((item, index) => {
            if(index == selectedIndex) selected = {name: item.name, value: item.value}
            return `<div onmouseover="selectedID='setting_${waterfallID}_select'" onmouseout="selectedID=undefined" onclick="selectMenuOption('setting_${waterfallID}_select', ${index}, '${item.name}', '${item.value}', this.hasAttribute('selected'))" style="display: flex;" class="options" value="${item.value}"${(index == selectedIndex ? " selected" : "")}><div style="margin: auto; margin-left: 0px; max-width: 100%; overflow-wrap: break-word;">${item.name}</div></div>`
        }).join("")
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed totalwidth">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright" style="display: flex; height: 41px; min-width: 300px;">
                <button type="text" class="discordSelectCSS" onfocusout="selectMenuChecker(this.id, 'onfocusout')" onfocusin="selectMenuChecker(this.id, 'onclick'); document.getElementById('alt2_'+this.id).setSelectionRange(document.getElementById('alt2_'+this.id).value.length, document.getElementById('alt2_'+this.id).value.length); document.getElementById('alt2_'+this.id).focus();" onclick="selectMenuChecker(this.id, 'onclick')" style="border-radius: 5px;" id="setting_${waterfallID}_select" value="${(selected ? `${selected.value}` : "")}">
                    <input oninput="selectMenuSearch('setting_${waterfallID}_select', this.value)" type="text" id="alt2_setting_${waterfallID}_select" class="selectedName" ${(placeholder ? `placeholder="${placeholder}"` : "")} value="${(selected ? `${selected.name}` : "")}"></input>
                    <div id="alt3_setting_${waterfallID}_select" style="display: flex; min-width: 30px; height: 100%;">
                        <svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819">
                            <g>
                                <path d="M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561
                                L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416
                                C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848
                                c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693
                                C444.819,130.287,441.295,121.629,434.252,114.203z"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="selector" id="alt1_setting_${waterfallID}_select" style="visibility: hidden; top: 100%; border-radius: 0px 0px 5px 5px;">
                        ${blocks}
                    </div>
                </button>
            </div>
        </div>`
        }
    }

    _genSetting_selectRadio(name, description, id, settingType) {

        /*

        <div class="radio_button_container">
            <div class="bloc">
                <label>
                      <div class="part"> <input id="cc" class="input_radio" type="radio" checked="checked" name="test"> </div>
                      <div class="part"> <p>Coucou</p> </div>
                 </label>
            </div>
            <div class="bloc">
              <label>
                    <div class="part"> <input class="input_radio" type="radio" checked="checked" name="test"> </div>
                    <div class="part"> <p>Coucou</p> </div>
              </label>
            </div>
            <div class="bloc">
              <label>
                    <div class="part"> <input class="input_radio" type="radio" checked="checked" name="test"> </div>
                    <div class="part"> <p>Coucou</p> </div>
              </label>
            </div>
            <div class="bloc">
              <label>
                    <div class="part"> <input class="input_radio" type="radio" checked="checked" name="test"> </div>
                    <div class="part"> <p>Coucou</p> </div>
              </label>
            </div>
        
        </div>
        */


        let waterfallID = this.getWaterfallID(id)
        

        let blocks = settingType.value.map((item, index) => {
            return `<div class="bloc">
            <label>
                  <div class="part"> <input class="input_radio" type="radio" name="setting_${waterfallID}_radiobutton" value="${item.value}" ${(index == settingType.selected ? " checked" : "")}> </div>
                  <div class="part"> <p>${item.name}</p> </div>
             </label>
        </div>`
        }).join("")
        //console.log("RADIO BUTTON blocks",blocks)
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed totalwidth">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
                <div class="radio_button_container">
                    ${blocks}
                </div>
            </div>
        </div>`
        }
    }

    _genSetting_text(name, description, id, settingType) {
        let waterfallID = this.getWaterfallID(id)
        let placeholder, min, max, value, password;
        if(settingType.value) {
            placeholder = settingType.value.placeholder || null
            value = settingType.value.value || null     
            min = settingType.value.min
            max = settingType.value.max
            password = settingType.value.password || null
        }
        if(password) return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright_noautowidth" style="display: flex; height: 41px;">
                <input class="passwordInput" type="password" id="setting_${waterfallID}_value" ${placeholder ? `placeholder="${placeholder}"` : ""} ${min != undefined ? `minlength="${min}"` : ""} ${max != undefined ? `maxlength="${max}"` : ""} ${value ? `value="${value}"` : ""}>
                <div id='alt1_setting_${waterfallID}_value' onclick="viewPSW('setting_${waterfallID}_value',this.id)" class="passwordInputEye">
                    <svg xmlns="http://www.w3.org/2000/svg" style="margin: auto;" width="15" height="15" viewBox="0 0 20 20"><g fill="#fff"><path d="M10 14.5a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5zM10 3C3 3 0 10 0 10s3 7 10 7 10-7 10-7-3-7-10-7z"/><circle cx="10" cy="10" r="2.5"/></g></svg>
                </div>
            </div>
        </div>`
        }
        else return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright_noautowidth" style="height: 41px;">
                <input class="textInput" type="text" id="setting_${waterfallID}_value" ${placeholder ? `placeholder="${placeholder}"` : ""} ${min != undefined ? `minlength="${min}"` : ""} ${max != undefined ? `maxlength="${max}"` : ""} ${value ? `value="${value}"` : ""}>
            </div>
        </div>`
        }
    }

    _genSetting_textarea(name, description, id, settingType) {
        let waterfallID = this.getWaterfallID(id)
        let placeholder, min, max, rows, value;
        if(settingType.value) {
            placeholder = settingType.value.placeholder || null
            min = settingType.value.min
            max = settingType.value.max
            rows = settingType.value.rows
            value = settingType.value.value || null
        }
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright_noautowidth">
                <textarea class="textarea" ${rows != undefined ? `oninput="maxRow(this.id, ${rows})"` : ""} id="setting_${waterfallID}_value" ${placeholder ? `placeholder="${placeholder}"` : ""} ${min != undefined ? `minlength="${min}"` : ""} ${max != undefined ? `maxlength="${max}"` : ""} rows="5">${value ? `${value}` : ""}</textarea>
            </div>
        </div>`
        }
    }

    _genSetting_number(name, description, id, settingType, step=1) {
        let waterfallID = this.getWaterfallID(id)
        let selected = settingType.selected
        let min, max;
        if(settingType.value) {
            min = settingType.value.min
            max = settingType.value.max
        }
        if(min !== undefined) {if(selected < min) selected = min}
        if(max !== undefined) {if(selected > max) selected = max}
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed totalwidth">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright" style="display: flex; height: 41px; min-width: 200px;">
                <input type="number" class="numberInput" id="setting_${waterfallID}_value" step="${step}" ${(selected != undefined ? ` value="${selected}"` : "")} onfocusout="${(min != undefined ? `if(this.value < ${min})this.value=${min};` : "")} ${(max !== undefined ? `if(this.value > ${max})this.value=${max};` : "")} this.value=Math.floor(this.value/${step})*${step}" ${(min !== undefined ? `min="${min}"` : "")} ${(max !== undefined ? `max="${max}"` : "")}>
                <div class="numberInputArrows">
                    <div onclick="document.getElementById('setting_${waterfallID}_value').stepUp()" class="intArrow">
                        <svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819">
                            <g>
                                <path d="M433.968,278.657L248.387,92.79c-7.419-7.044-16.08-10.566-25.977-10.566c-10.088,0-18.652,3.521-25.697,10.566
                                L10.848,278.657C3.615,285.887,0,294.549,0,304.637c0,10.28,3.619,18.843,10.848,25.693l21.411,21.413
                                c6.854,7.23,15.42,10.852,25.697,10.852c10.278,0,18.842-3.621,25.697-10.852L222.41,213.271L361.168,351.74
                                c6.848,7.228,15.413,10.852,25.7,10.852c10.082,0,18.747-3.624,25.975-10.852l21.409-21.412
                                c7.043-7.043,10.567-15.608,10.567-25.693C444.819,294.545,441.205,285.884,433.968,278.657z"/>
                            </g>
                        </svg>
                    </div>
                    <div onclick="document.getElementById('setting_${waterfallID}_value').stepDown()" class="intArrow">
                        <svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" x="0px" y="0px" width="8" height="8" viewBox="0 0 444.819 444.819">
                            <g>
                                <path d="M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561
                                L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416
                                C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848
                                c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693
                                C444.819,130.287,441.295,121.629,434.252,114.203z"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>`
        }
    }
    
    _genSetting_float(name, description, id, settingType, step=0.01) {
        return this._genSetting_number(name, description, id, settingType, step)
    }

    _genSetting_slider(name, description, id, settingType, step=1) {
        let waterfallID = this.getWaterfallID(id)
        let defaultvalue = settingType.value.defaultvalue || Math.floor((settingType.value.min + settingType.value.max)/2)
        if(settingType.selected) defaultvalue = settingType.selected
        return {
            id: id,
            html: `<div class="setting" id="setting_${waterfallID}">
            <div class="flexed totalwidth">
                <label class="settingLabel">
                    <div class="name">${name}</div>
                    <div class="description">${description}</div>
                </label>
            </div>
            <div class="flexed flexedright_noautowidth totalwidth">
                <div class="sliderSelectedValue" id="${waterfallID}_slider_displayValue">${defaultvalue}</div>
                <div class="sliderInfos">
                    <div class="borne">${settingType.value.min}</div>
                    <input type="range" min="${settingType.value.min}" max="${settingType.value.max}" value="${defaultvalue}" step="${settingType.value.step || 1}" class="discordSlider" id="setting_${waterfallID}_value" onchange='updateTextInput("${waterfallID}_slider_displayValue", this.value)'>
                    <div class="borne">${settingType.value.max}</div>
                </div>
            </div>
        </div>`
        }
    }


    getHTML() {
        let duplicates = _getArrayDuplicates(this.settingList.map(x => {
            return x.id
        }))
        //console.log("duplicates",duplicates)
        if(duplicates.length != 0) {
            let textError = `[COMPILE ERROR] invalid settingList: Duplicates ids were founds ['${duplicates.join("', '")}']`
            let settingList_html = [`<div>
                <h1 style="color:red">${textError}</h1>
            </div>`]
            Errors.push(textError)
            return this.categoryBase(this.categoryName, this.categoryID, settingList_html).html
        }

        if(this.depth > this.maxDepth) {
            let textError = `[COMPILE ERROR] invalid Depth: Trying to make submenus in submenus for a depth more than ${this.maxDepth}`
            let settingList_html = [`<div>
                <h1 style="color:red">${textError}</h1>
            </div>`]
            Errors.push(textError)
            return this.categoryBase(this.categoryName, this.categoryID, settingList_html).html
        }


        let settingList_html = []
        for(let i in this.settingList) {
            let setting = this.settingList[i]

            let partial_html_setting;
            switch(setting.settingType.type) {
                case 0:
                    partial_html_setting = this._genSetting_nothing(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 1:
                    partial_html_setting = this._genSetting_switch(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 2:
                    partial_html_setting = this._genSetting_select(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 3:
                    partial_html_setting = this._genSetting_selectRadio(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 4:
                    partial_html_setting = this._genSetting_text(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 5:
                    partial_html_setting = this._genSetting_textarea(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 6:
                    partial_html_setting = this._genSetting_number(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 7:
                    partial_html_setting = this._genSetting_float(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
                case 8:
                    partial_html_setting = this._genSetting_slider(setting.name, setting.description, setting.id, setting.settingType).html
                    break;
            }
            if(setting.submenu && setting.submenu.length > 0) {

                let isEnabled = (setting.settingType.type == 1 ? setting.settingType.value : true)

                //console.log("AAAAAAAAAAA setting.settingType.value",isEnabled)

                let new_list_of_waterfalls_id = this.getDepthIDS()
                new_list_of_waterfalls_id.push(`${setting.id}`)
                
                let waterfallID = this.getWaterfallID(setting.id)

                let new_category = new generateCategory(`${setting.name}`, `submenu`, setting.submenu, isEnabled, new_list_of_waterfalls_id ,this.depth+1)
                if(setting.settingType.type == 1) {
                    let onclickFunction = () => {
                        let that = document.getElementById(`setting_${waterfallID}_checkbox`)
                        let submenu = document.getElementById(`${waterfallID}_submenu`)
                        //console.log("document.getElementById(`${waterfallID}_submenu`)",`${waterfallID}_submenu`)
                        if(that.checked) {
                            submenu.className = submenu.className.split("disabled").join("").trim()
                        } else {
                            submenu.className = submenu.className.split("disabled").join("").trim()
                            submenu.className = submenu.className.split("disabled").join("").trim()+" disabled"
                        }
                    }
                    OnclickFunctions[setting.id] = onclickFunction
                    partial_html_setting = this._genSetting_switch(setting.name, setting.description, setting.id, setting.settingType, `OnclickFunctions['${setting.id}']()`).html
                }
                settingList_html.push({type: 0, html: partial_html_setting})
                settingList_html.push({type: 1, html: new_category.getHTML()})
                
                this.addReference(setting, new_category)

            } else {
                settingList_html.push({type: 0, html: partial_html_setting})
                this.addReference(setting)
            }



        }
        //console.log("settingList_html",settingList_html)
        return this.categoryBase(this.categoryName, this.categoryID, settingList_html).html
    }

    generate() {
        return parseHTML(this.getHTML())
    }
}

let OnclickFunctions = {

}

let waterfall_example_settingList = [
    {
        name: "Paramètres généraux",
        description: "Paramètres généraux",
        id: "main", // lowercase and one word
        submenu: [
            {
                name: "Activer le bot ou non",
                description: "Permet d'activer si besoin le bot et de le désactiver",
                id: "active", // lowercase and one word
                settingType: {
                    type: 1,
                    value: true
                },
                submenu: [
        
                ]
            },
            {
                name: "Activer le bot ou non",
                description: "Permet d'activer si besoin le bot et de le désactiver",
                id: "1", // lowercase and one word
                settingType: {
                    type: 1,
                    value: false
                },
                submenu: [
        
                ]
            },
            {
                name: "Activer le bot ou non",
                description: "Permet d'activer si besoin le bot et de le désactiver",
                id: "2", // lowercase and one word
                settingType: {
                    type: 1,
                    value: false
                },
                submenu: [
        
                ]
            },
            {
                name: "Activer le bot ou non",
                description: "Permet d'activer si besoin le bot et de le désactiver",
                id: "3", // lowercase and one word
                settingType: {
                    type: 1,
                    value: true
                },
                submenu: [
        
                ]
            },
            {
                name: "Activer le bot ou non",
                description: "Permet d'activer si besoin le bot et de le désactiver",
                id: "4", // lowercase and one word
                settingType: {
                    type: 1,
                    value: false
                },
                submenu: [
        
                ]
            },
            {
                name: "Auto redémarrage",
                description: "Redémarrer ou non automatiquement le bot",
                id: "restart", // lowercase and one word
                settingType: {
                    type: 1,
                    value: true
                },
                submenu: [
                    {
                        name: "",
                        description: "Lundi",
                        id: "lundi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                    {
                        name: "",
                        description: "Mardi",
                        id: "mardi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                    {
                        name: "",
                        description: "Mercredi",
                        id: "mercredi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        },
                        submenu: [
                            {
                                name: "",
                                description: "Mardi",
                                id: "mardi", // lowercase and one word
                                settingType: {
                                    type: 8,
                                    value: { min: 1, max: 255, step: 1}
                                }
                            },
                            {
                                name: "",
                                description: "Mercredi",
                                id: "mercredi", // lowercase and one word
                                settingType: {
                                    type: 1,
                                    value: false
                                }
                            },
                        ]
                    },
                    {
                        name: "",
                        description: "Jeudi",
                        id: "jeudi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                    {
                        name: "",
                        description: "Vendredi",
                        id: "vendredi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                    {
                        name: "",
                        description: "Samedi",
                        id: "samedi", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                    {
                        name: "",
                        description: "Dimanche",
                        id: "dimanche", // lowercase and one word
                        settingType: {
                            type: 1,
                            value: false
                        }
                    },
                ]
            },
            {
                name: "Mon animal",
                description: "Choisir votre animal",
                id: "selectsheep", // lowercase and one word
                settingType: {
                    type: 2,
                    required: true,
                    selected: 1,
                    value: [
                        { name: "-- Choose element --", value:""},
                        { name: "One sheep", value:"sheep"},
                        { name: "A Creeper", value:"creeper"},
                    ]
                },
                submenu: [
        
                ]
            },
            {
                name: "Couleurs de base",
                description: "Choisir la couleur de base parmis les 3",
                id: "basecolor", // lowercase and one word
                settingType: {
                    type: 3,
                    selected: 1,
                    value: [
                        { name: "Red", value:"red"},
                        { name: "Green", value:"green"},
                        { name: "Blue", value:"blue"},
                    ]
                },
                submenu: [
        
                ]
            },
            {
                name: "Message de bienvenue",
                description: "Message envoyé aux nouveaux membres",
                id: "welcomemsg", // lowercase and one word
                settingType: {
                    type: 4,
                    required: true,
                    value: { placeholder: "Message de bienvenue", value:"Bienvenue à toi @user !"}
                },
                submenu: [
        
                ]
            },
            {
                name: "Jours dans le mois",
                description: "Régler le nombre de jours par mois",
                id: "number1", // lowercase and one word
                settingType: {
                    type: 6,
                    required: true,
                    value: {value: 4}
                },
                submenu: [
        
                ]
            },
            {
                name: "Slider",
                description: "Message envoyé aux nouveaux membres",
                id: "slider1", // lowercase and one word
                settingType: {
                    type: 8,
                    required: true,
                    selected: 4,
                    value: { min: 1, max: 5, step: 1}
                },
                submenu: [
        
                ]
            },
            {
                name: "Slider",
                description: "Message envoyé aux nouveaux membres",
                id: "slider2", // lowercase and one word
                settingType: {
                    type: 8,
                    required: true,
                    selected: 35,
                    value: { min: 7, max: 100, step: 1}
                },
                submenu: [
        
                ]
            },
            {
                name: "Délai entre les messages",
                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                id: "slider3", // lowercase and one word
                settingType: {
                    type: 8,
                    required: true,
                    selected: 5.234,
                    value: { min: 1.3, max: 10, step: 0.001}
                },
                submenu: [
        
                ]
            },
            {
                name: "Délai entre les messages",
                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                id: "zefzefzefzef", // lowercase and one word
                settingType: {
                    type: 8,
                    required: true,
                    selected: 64,
                    value: { min: 1, max: 255, step: 1}
                },
                submenu: [
        
                ]
            },
            {
                name: "Slider",
                description: "Message envoyé aux nouveaux membres",
                id: "switch1", // lowercase and one word
                settingType: {
                    type: 1,
                    required: true,
                    selected: true,
                    value: false
                },
                submenu: [
        
                ]
            },
            {
                name: "Textarea",
                description: "Messages de bienvenue",
                id: "welcomemsg2", // lowercase and one word
                settingType: {
                    type: 1,
                    required: true,
                    selected: true,
                    value: { placeholder: "Message de bienvenue", value:"Bienvenue à toi @user !"}
                },
                submenu: [
        
                ]
            }
        ]
    },
    {
        name: "coucou",
        id: "main2",
        submenu: [
            {
                name: "Délai entre les messages",
                description: "Le nombre de seconde à attendre entre l'envoie de chaque messages.",
                id: "zefzefzefzef", // lowercase and one word
                settingType: {
                    type: 8,
                    required: true,
                    selected: 64,
                    value: { min: 1, max: 255, step: 1}
                },
                submenu: [
        
                ]
            },
            {
                name: "Slider",
                description: "Message envoyé aux nouveaux membres",
                id: "switch1", // lowercase and one word
                settingType: {
                    type: 1,
                    required: true,
                    selected: true,
                    value: false
                },
                submenu: [
        
                ]
            }
        ]
        
    }
]
/*
        settingType:
        0 : Nothing
        1 : Boolean button
        2 : Select list
        3 : Select list radio
        4 : Text input
        5 : Textarea input
        6 : Integer input
        7 : Float input
        8 : Slider
        9 : List manager
*/

let Global_ = {
    "categories": []
}

let Waterfall = {
    genWaterfallHTML: (settingsWaterfall) => {
        try {
            let html = []
            for(let i in settingsWaterfall) {
                let new_category = new generateCategory(settingsWaterfall[i].name, settingsWaterfall[i].id, settingsWaterfall[i].submenu)
                html.push(new_category.getHTML())
                if(i < settingsWaterfall.length-1) html.push(separator)
            }
            return html.join("\n")
        } catch(e) { console.error(e) }
    },
    createWaterfall: (element, settingsWaterfall) => {
        try {
            for(let i in settingsWaterfall) {
                let new_category = new generateCategory(settingsWaterfall[i].name, settingsWaterfall[i].id, settingsWaterfall[i].submenu)
                element.appendChild(new_category.generate())
                if(i < settingsWaterfall.length-1) element.appendChild(parseHTML(separator))
                Global_["categories"].push({id: settingsWaterfall[i].id, object: new_category})
            }
            //_autoResizeVerticallyAllTextarea()
        } catch(e) { console.error(e) }
    },
    clearWaterfall: (element) => {
        element.innerHTML = ""
        Global_["categories"] = []
    },
    getSettings: () => {
        let json = {}
        let mapped = []
        Global_["categories"].forEach((category, index) => {
            json[category.id] = category.object.getSettingsValuesJSON().json
            mapped.push({ id: category.id, value: category.object.getSettingsValuesJSON().mapped})
        })
        return { json: json, mapped: mapped}
    },
    canSaveJSON: () => {
        return !(Global_["categories"].map((category, index) => {
            return category.object.canSaveJSON()
        }).indexOf(false) != -1)
    }
}

// let category1 = new generateCategory("Paramètres généraux", "main", waterfall_example_settingList)

/*
let parsed = settingBlocks.category("CategoryTitle1").html.appendChild(settingBlocks.switch("Sitch Button 1").html)

document.getElementById("category1").appendChild(parsed)
*/

//document.getElementById("mainbox").appendChild(category1.generate())


/*
console.log(category1.getSettingsValuesJSON())
*/


/*
setInterval(() => {
    console.log(category1.getSettingsValuesJSON())
}, 3000)
*/