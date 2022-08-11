

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

    getSettingsValuesJSON() {
        let mapped = this.references.map((item, index) => {
            if(item.submenuCategoryClass) {
                //console.log("depthIDS",this.getDepthIDS())
                //console.log("item.submenuCategoryClass",item.submenuCategoryClass.getSettingsValuesJSON())
            }
            let setting = item.setting
            if(setting.settingType.type == 0) {
                return { id: setting.id, value: null }
            } else if(setting.settingType.type == 1) {
                if(setting.submenu && setting.submenu.length > 0) {
                    if(item.submenuCategoryClass) {
                        return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? item.submenuCategoryClass.getSettingsValuesJSON() : false) }
                    } else {
                        return { id: setting.id, value: "ERROR"}
                    }
                } else {
                    return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_checkbox`).checked ? true : false) }
                }
            } else if(setting.settingType.type == 2) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_select`).value || null) }
            } else if(setting.settingType.type == 3) {
                let elem_query = document.querySelector(`input[name="setting_${item.waterfallID}_radiobutton"]:checked`)
                let value = (elem_query? elem_query.value : undefined)
                return { id: setting.id, value: value }
            } else if(setting.settingType.type == 4) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
            } else if(setting.settingType.type == 5) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
            } else if(setting.settingType.type == 6) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
            } else if(setting.settingType.type == 7) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
            } else if(setting.settingType.type == 8) {
                return { id: setting.id, value: (document.getElementById(`setting_${item.waterfallID}_value`).value || null) }
            } else if(setting.settingType.type == 9) {
                return { id: setting.id, value: ("list manager not created" || null) }
            }
        })
        return mapped
    }

    categoryBase(categoryName, categoryID, settingList_html) {
        let id = genHex(16)
        let waterfallCategoryID = this.getWaterfallID(categoryID)
        //console.log("this.isEnabled",this.isEnabled)
        return {
            id: id,
            html: `<div class="settingCategory${this.isEnabled ? '' : ' disabled'}" id="${waterfallCategoryID}">
        <div class="title">
            <h2 class="categoryTitle">${categoryName}</h2>
        </div>
        ${settingList_html.join(`\n${separator}\n`)}
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
        let blocks = settingType.value.map((item, index) => {
            return `<option value="${item.value}"${(index == settingType.selected ? " selected" : "")}>${item.name}</option>`
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
            <div class="flexed flexedright">
                <select class="discordSelectCSS" id="setting_${waterfallID}_select">
                    ${blocks}
                </select>
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
        let placeholder, value;
        if(settingType.value) {
            placeholder = settingType.value.placeholder || null
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
                <input class="textInput" type="${settingType.value.password ? 'password' : 'text'}" id="setting_${waterfallID}_value"${placeholder ? `placeholder="${placeholder}"` : ""}${value ? `value="${value}"` : ""}>
            </div>
        </div>`
        }
    }

    _genSetting_textarea(name, description, id, settingType) {
        let waterfallID = this.getWaterfallID(id)
        let placeholder, value;
        if(settingType.value) {
            placeholder = settingType.value.placeholder || null
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
                <textarea class="textarea textarea-autoresize-vertically" id="setting_${waterfallID}_value"${placeholder ? `placeholder="${placeholder}"` : ""} rows="5">${value ? `${value}` : ""}</textarea>
            </div>
        </div>`
        }
    }

    _genSetting_number(name, description, id, settingType, step=1) {
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
                <input type="number" class="numberInput" id="setting_${waterfallID}_value" ${(settingType.value ? ` value="${settingType}"` : "")}>
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
            if(setting.settingType.type == 0) {
                partial_html_setting = this._genSetting_nothing(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 1) {
                partial_html_setting = this._genSetting_switch(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 2) {
                partial_html_setting = this._genSetting_select(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 3) {
                partial_html_setting = this._genSetting_selectRadio(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 4) {
                partial_html_setting = this._genSetting_text(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 5) {
                partial_html_setting = this._genSetting_textarea(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 6) {
                partial_html_setting = this._genSetting_number(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 7) {
                partial_html_setting = this._genSetting_float(setting.name, setting.description, setting.id, setting.settingType).html
            } else if(setting.settingType.type == 8) {
                partial_html_setting = this._genSetting_slider(setting.name, setting.description, setting.id, setting.settingType).html
            }
            
            if(setting.submenu && setting.submenu.length > 0) {

                let isEnabled = (setting.settingType.type == 1 ? setting.settingType.value : true)

                //console.log("AAAAAAAAAAA setting.settingType.value",isEnabled)

                let new_list_of_waterfalls_id = this.getDepthIDS()
                new_list_of_waterfalls_id.push(`${setting.id}`)
                
                let waterfallID = this.getWaterfallID(setting.id)

                let new_category = new generateCategory(`${setting.name} submenu`, `submenu`, setting.submenu, isEnabled, new_list_of_waterfalls_id ,this.depth+1)
                if(setting.settingType.type == 1) {
                    let onclickFunction = () => {
                        let that = document.getElementById(`setting_${waterfallID}_checkbox`)
                        let submenu = document.getElementById(`${waterfallID}_submenu`)
                        console.log("document.getElementById(`${waterfallID}_submenu`)",`${waterfallID}_submenu`)
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
                settingList_html.push(partial_html_setting)
                settingList_html.push(new_category.getHTML())
                
                this.addReference(setting, new_category)

            } else {
                settingList_html.push(partial_html_setting)
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
                    value: 4 // undefined
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
        let html = []
        for(let i in settingsWaterfall) {
            let new_category = new generateCategory(settingsWaterfall[i].name, settingsWaterfall[i].id, settingsWaterfall[i].submenu)
            html.push(new_category.getHTML())
            html.push(separator)
        }
        return html.join("\n")
    },
    createWaterfall: (element, settingsWaterfall) => {
        for(let i in settingsWaterfall) {
            let new_category = new generateCategory(settingsWaterfall[i].name, settingsWaterfall[i].id, settingsWaterfall[i].submenu)
            element.appendChild(new_category.generate())
            element.appendChild(parseHTML(separator))
            Global_["categories"].push({id: settingsWaterfall[i].id, object: new_category})
        }
        _autoResizeVerticallyAllTextarea()
    },
    clearWaterfall(element) {
        element.innerHTML = ""
        Global_["categories"] = []
    },
    getSettings() {
        return Global_["categories"].map((category, index) => {
            return { id: category.id, value: category.object.getSettingsValuesJSON()}
        })
    },
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
