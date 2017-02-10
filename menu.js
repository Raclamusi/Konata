function installMainMenu(){

    /* global RiotControl ACTION CHANGE store */
    let rc = RiotControl;
    let remote = require("electron").remote;
    let DEP_ARROW_TYPE = require("./KonataRenderer").DEP_ARROW_TYPE;

    function makeMenuTemplate(){

        let tab = store ? store.activeTab : null;
        let tabID = store ? store.activeTabID : 0;
        
        // https://github.com/electron/electron/blob/master/docs/api/menu-item.md
        return [
            {
                label: "File",
                submenu: [
                    {
                        label: "Open",
                        accelerator: "Command+O",
                        click: function(){rc.trigger(ACTION.DIALOG_FILE_OPEN);}
                    },
                    {
                        label: "Reload",
                        enabled: tab ? true : false,
                        accelerator: "Command+R",
                        click: function(){rc.trigger(ACTION.FILE_RELOAD);}
                    },
                    {
                        label: "Quit",
                        accelerator: "Command+Q",
                        click: function(){rc.trigger(ACTION.APP_QUIT);}
                    },
                ]
            },
            {
                label: "Window",
                submenu: [
                    {
                        label:"Next tab",
                        accelerator:"Command + N",
                        click: function(){rc.trigger(ACTION.TAB_MOVE, true);}
                    },
                    {
                        label:"Previous tab",
                        accelerator:"Command + P",
                        click: function(){rc.trigger(ACTION.TAB_MOVE, false);}
                    },
                    {
                        label:"Zoom out",
                        accelerator:"Command + Shift + =",
                        click: function(){rc.trigger(ACTION.KONATA_ZOOM, false, 0, 0);}
                    },
                    {
                        label:"Zoom in",
                        accelerator:"Command + -",
                        click: function(){rc.trigger(ACTION.KONATA_ZOOM, true, 0, 0);}
                    },
                ]
            },
            {
                label: "View",
                enabled: tab ? true : false,
                submenu: [
                    {
                        label: "Transparent mode",
                        type: "checkbox",
                        checked: tab ? tab.transparent : false, 
                        click: function(e){
                            rc.trigger(ACTION.KONATA_TRANSPARENT, tabID, e.checked);
                        }
                    },
                    {
                        label: "Color scheme",
                        submenu: [
                            {
                                label: "Default",
                                type: "checkbox",
                                checked: tab ? tab.colorScheme == "default" : true, 
                                click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "default");}
                            },
                            {
                                label: "Orange",
                                type: "checkbox",
                                checked: tab ? tab.colorScheme == "orange" : false, 
                                click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "orange");}
                            },
                            {
                                label: "Blue",
                                checked: tab ? tab.colorScheme == "blue" : false, 
                                type: "checkbox",
                                click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "blue");}
                            },
                        ]
                    },
                    {
                        label: "Dependency arrow",
                        submenu: [
                            {
                                label: "Inside-line",
                                type: "checkbox",
                                checked: store.depArrowType == DEP_ARROW_TYPE.INSIDE_LINE, 
                                click: function(){
                                    rc.trigger(
                                        ACTION.KONATA_SET_DEP_ARROW_TYPE,
                                        DEP_ARROW_TYPE.INSIDE_LINE
                                    );
                                }
                            },
                            {
                                label: "Leftside-curve",
                                type: "checkbox",
                                checked: store.depArrowType == DEP_ARROW_TYPE.LEFT_SIDE_CURVE, 
                                click: function(){
                                    rc.trigger(
                                        ACTION.KONATA_SET_DEP_ARROW_TYPE,
                                        DEP_ARROW_TYPE.LEFT_SIDE_CURVE
                                    );
                                }
                            }
                        ]
                    },
                ]
            },
            {
                label: "Help",
                submenu: [
                    {
                        label: "Version",
                        click: function(){
                            rc.trigger(
                                ACTION.DIALOG_MODAL_MESSAGE,
                                "Konata ver 0.0.2, Kojiro Izuoka and Ryota Shioya."
                            );
                        }
                    }
                ]
            }
        ];
    }

    function setMenu(template){
        let Menu = remote.Menu;
        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    // 初期状態として store なしで1回メニューを作る
    setMenu(makeMenuTemplate());

    // メニューのチェックボックス状態の更新
    rc.on(CHANGE.MENU_UPDATE, function(){
        setMenu(makeMenuTemplate());
    });
}


function popupTabMenu(tabID){

    /* global RiotControl ACTION */
    let rc = RiotControl;
    let remote = require("electron").remote;
    let tab = store.tabs[tabID];

    let menuTemplate = [
        {
            label: "Syncronize scroll",
            type: "checkbox",
            enabled: 
                store.activeTabID != tabID,    // 自分自身の時は無効化
            checked: 
                store.activeTab.syncScroll && store.activeTab.syncScrollTab.id == tabID, 
            click: function(e){
                rc.trigger(ACTION.KONATA_SYNC_SCROLL, store.activeTabID, tabID, e.checked);
            }
        },
        {
            label: "Transparent mode",
            type: "checkbox",
            checked: tab.transparent, 
            click: function(e){
                rc.trigger(ACTION.KONATA_TRANSPARENT, tabID, e.checked);
            }
        },
        {
            label: "Color scheme",
            submenu: [
                {
                    label: "Default",
                    type: "checkbox",
                    checked: tab.colorScheme == "default", 
                    click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "default");}
                },
                {
                    label: "Orange",
                    type: "checkbox",
                    checked: tab.colorScheme == "orange", 
                    click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "orange");}
                },
                {
                    label: "Blue",
                    checked: tab.colorScheme == "blue", 
                    type: "checkbox",
                    click: function(){rc.trigger(ACTION.KONATA_CHANGE_COLOR_SCHEME, tabID, "blue");}
                },
            ]
        }
    ];

    let Menu = remote.Menu;
    let menu = Menu.buildFromTemplate(menuTemplate);
    menu.popup();
}

function popupPipelineMenu(pos){

    /* global RiotControl ACTION */
    let rc = RiotControl;
    let remote = require("electron").remote;

    let menuTemplate = [
        {
            label:"Zoom out",
            click: function(){rc.trigger(ACTION.KONATA_ZOOM, false, pos[0], pos[1]);}
        },
        {
            label:"Zoom in",
            click: function(){rc.trigger(ACTION.KONATA_ZOOM, true, pos[0], pos[1]);}
        },
        {
            label: "Adjust position",
            click: function(){
                // その時のパイプラインの左上がくるように移動
                let render = store.activeTab.renderer;
                let op = render.getOpFromPixelPosY(0);
                if (op) {
                    rc.trigger(
                        ACTION.KONATA_MOVE_LOGICAL_POS, 
                        [op.fetchedCycle, op.id]
                    );
                }
            }
        },
    ];

    let Menu = remote.Menu;
    let menu = Menu.buildFromTemplate(menuTemplate);
    menu.popup();
}



module.exports.installMainMenu = installMainMenu;
module.exports.popupTabMenu = popupTabMenu;
module.exports.popupPipelineMenu = popupPipelineMenu;
