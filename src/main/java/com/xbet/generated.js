var updateMenuSportTimer = 10 * 1000; // 10 sec
var updateSportBetsTimer = 3 * 1000; // 3 sec
var updateSport1x2Timer = 3 * 1000; // 3 sec
var updateNearGames = 180 * 1000; // 180 sec
var betHistoryTimer = 30 * 1000; // 30 sec
var nPage = 1;
var Aj = new Array();
var To = new Array();
var show1x2;
var transHis = new Array();
var openPg = new Array();
var idSport;
var curSelOBJ = null;
var openMenuSportArray = new Array(); // id открытого в меню вида спорта (Футбол, Теннис, ...)
var openLigaID = new Array(); // названия чемпионатов, которые развёрнуты в меню
for(var i = 0; i < 50; i++) openMenuSportArray[i] = 0;
var openMenuSport = null; // id открытого в меню вида спорта (Футбол, Теннис, ...)
var selectSport = null; // id выбранного(с показом событий для игры) вида спорта (Футбол, Теннис, ...)
var selectGame = null; // id выбранной игры (с показом событий) (Спартак-Зенит)
var openMenuSportGood = null; // после обновления: если такого события или вида спорта нет
var selectSportGood = null; //
var selectGameGood = null; //
var firstStart = 1;
var t1x2;
var selectSportId = null;
var startScript;
var targetDate;
var oneMinute = 60 * 1000
var oneHour = oneMinute * 60
var oneDay = oneHour * 24
var globTimerGame;
var stopTimer = 0;
var UpDownTimer = 1;
var idSetNewClass = new Array();
var idSetNewClassG = new Array();
var idGroupAdd = new Array();
var groupOpen = new Array();
var t;
var startUpdateSob = false;
var idGameArray = new Array();
var lastGameId = 0;
var saveSkoef = new Array();
var draw_b;
var startPut = 0;
var gLen = new Array();
var colV = new Array();
var lastID = 0;
var game_name = '';
var globalName = '';
var globalVI = 0;
var n = new Object();
var colSobOld = 0;
var CuponTimer, needUpdate; // Таймеры для обновления купона
var liveCuponTime = 3000; // Время обновления совместного купона
var lineCuponTime = 30000; // Время обновления купона в линии
var needUpdateLine = false; // Флаг необходимости обновления линии при совместном купоне
var lng = GetCookie('lng') || 'ru';
var betArray = new Array();
var gameArr = new Array();

setInterval("getAllSport()", updateMenuSportTimer);
setInterval("getSobByGameId(selectGame)", updateSportBetsTimer);
setInterval("showAllNear()", updateNearGames);
setInterval("showAllLiveBets1x2(selectSportId, 50)", updateSport1x2Timer);
setInterval("get_history_today()", betHistoryTimer);

var allEValue;
function onPlusClick(idgame, elem, imgSrc) {
    var idgroup=elem.parentNode.parentNode.parentNode.id.substring(6);

    if (imgSrc == 'marketAdd') {
        for (var iba = 0; iba < betArray.length; iba++) {
            if (betArray[iba] == idgroup) return;
        }
        betArray.push('group_' + idgroup);
        gameArr.push(idgame);
    } else {
        for (var iba = 0; iba < betArray.length; iba++) {
            if (betArray[iba].substring(6) == idgroup) {
                betArray[iba] = '';
                gameArr[iba] = '';
                break;
            }
        }
    }
}

function changeAllE() {
    var alleObj = document.getElementById("allE");
    allEValue = alleObj.options[alleObj.selectedIndex].value;
}

showIgrok_ = function(idGamesi, idSportsi) {
    selGame(idGamesi, idSportsi, 0);
}

getAllSport = function() {
    //path = '/getData/live/LeftMenu';
    path = '/LiveFeed/LeftMenu';

    openMenuSportGood = null;
    selectSportGood = null;
    selectGameGood = null;

    var rezSport = "";

    openLigaID = new Array();
    n = $$("[name='ln']");

    var k = 0;
    for (var i = 0; i < n.length; i++) {
        if (n[i].className == 'showLiga') {
            openLigaID[k] = (n[i].id);
            k++;
        }
    }

    try {
        if (typeof To[0] !== 'undefined')
            clearTimeout(To[0]);
        To[0] = setTimeout("ct(0)", 15000); // '<img src=\"/images/er2.png\" style=\"float:left; margin:0 7px 7px 0;\" align=\"absmiddle\"> Произошла ошибка, обновите страницу.')", 15000);
        Aj[0] = new Ajax.Request(path, {
            requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
            parameters: "lng=" + lng,
            method: "get",
            onComplete: function(request) {
                clearTimeout(To[0]);
                if (request.status != 200) {
                    // alert("Server is unavailable. Try again later.");
                } else {
                    var result = request.responseText;
                    var res = JSON.parse(result);

                    var dataLength = res.Value.length, // Общее кол-во данных (игры + периоды)
                        kolG = 0,
                        selG = 0,
                        tz = GetCookie("tzo") || 0, // Временная зона
                        kolVideo = 0,
                        showOnlyVideo = 0,
                        tmpSportID = 0,
                        tmpLigaID = 0,
                        stZS = 0,
                        stZL = 0,
                        stZG = 0,
                        minSG = new Array();

                    gLen = new Array();
                    colV = new Array();

                    if ($('sel_vid').className == 'sel')
                        showOnlyVideo = 1;

                    for (var i = 0; i < dataLength; i++) {
                        if (res.Value[i].NameGame == "")
                            kolG++;

                        var sportID = parseInt(res.Value[i].SportId, 10);
                        var sportName = res.Value[i].SportName || '';

                        // Считаем кол-во игр в каждом виде спорта
                        if (typeof gLen[sportID] == 'undefined')
                            gLen[sportID] = 0;
                        gLen[sportID]++;

                        if (tmpSportID != sportID) {
                            if (tmpSportID) {
                                if (stZL) {
                                    stZL = 0;
                                    rezSport += '</div>';
                                }
                                if (stZG) {
                                    stZG = 0;
                                    rezSport += '</div>';
                                }
                                rezSport += '</div></div>';
                                tmpLigaID = 0;
                            }

                            tmpSportID = sportID;
                            stZS = 1;

                            rezSport += '<div class="sports_tab2" n="sn" id="nSp_'+sportID+'"><div class="tab_icon left"><img alt="b" src="/images/ico_game/'+sportID+'.png" height="16" width="16" /></div><div style="float:left;width:85%;border:0px solid red;"><h1 style="width:100%;" onclick="showThis('+sportID+');"><a href="javascript:void(0);"><b id="sportN">'+sportName+'</b></a>'+'<span style="float:right; min-width:80px; text-align:center;" id="len_'+sportID+'"></span><span style="font-size:9px; color:#999999; background:#FFF; border:1px solid #999999; padding:1px; float:right; line-height:normal; margin-top:3px;">LIVE</span><span style="float:right;" id="lenV_'+sportID+'"></span>'+'</h1></div><div id="game_'+sportID+'" ';

                            if (openMenuSportArray[sportID]) rezSport += 'class="showGame" >'; else rezSport += 'class="hideGame" >'
                            if (selectSport == sportID) { selectSportGood = 1;}
                        }

                        var cin = 0;
                        var stZ = 0;
                        var pID = 0;

                        if (typeof minSG[sportID] == 'undefined')
                            minSG[sportID] = 0;
                        if (typeof colV[sportID] == 'undefined')
                            colV[sportID] = 0;

                        var MainGameId = res.Value[i].MainGameId || 0;
                        MainGameId = parseInt(MainGameId - 0, 10);

                        gameID = parseInt(res.Value[i].GameId - 0, 10);
                        gameBlock = res.Value[i].Blocked;

                        var VI = VA = sv = 0;

                        var gameOp1 = res.Value[i].Opp1 || '';
                        gameOp1 = gameOp1.replace(/'/g, "`");

                        var gameOp2 = res.Value[i].Opp2 || '';
                        gameOp2 = gameOp2.replace(/'/g, "`");

                        var game_name = gameOp1 + '-' + gameOp2;

                        var tv = vid = '';

                        if (res.Value[i].VI != null) {
                            VI = res.Value[i].VI;
                        }
                        if (res.Value[i].VA != null) {
                            VA = res.Value[i].VA;
                        }

                        if (showOnlyVideo)
                            vid = 'style="display:none;"';

                        if (VI && VA) {
                            sv = 1;
                            vid = '';
                            if (!MainGameId) {
                                kolVideo++;
                                colV[sportID]++;
                                tv = '<img onclick="if(!wClose) { playVideo(\''+VI+'?'+gameID+'\', \''+game_name+'\'); wClose = 1; return false; }" src="/images/tv.png" title="'+lp[languageID]['videowindow']+'" align="absmiddle" style="padding:0 0 3px 5px;">';
                            }
                        }

                        if (!VI && VA) {
                            sv = 1;
                            vid = '';
                            if (!MainGameId) {
                                kolVideo++;
                                colV[sportID]++;
                                tv = ' <img src="/images/tv_off.png" title="'+lp[languageID]['novideoyet']+'" align="absmiddle" style="padding:0 0 3px 5px;">';
                            }
                        }

                        var ligaName = res.Value[i].Liga || '';
                        var ligaID = res.Value[i].LigaId || '';

                        var topLiga = res.Value[i].Top || '2';

                        if (tmpLigaID != ligaID) {
                            if (tmpLigaID) {
                                if (stZG) {
                                    stZG = 0;
                                    rezSport += '</div>';
                                } else {
                                    break;
                                }
                                stZL = 0;
                                rezSport += '</div>';
                            }

                            tmpLigaID = ligaID;

                            dop = 'class="hideLiga"';
                            if (openLigaID.indexOf("liga_" + ligaID) != -1)
                                dop = 'class="showLiga"';

                            stZL = 1;
                            rezSport += '<div class="clr"></div><div class="liga'+topLiga+'" id="liga_sub_'+ligaID+'" sv="' + sv + '"  '+vid+' onclick="showLiga(\''+ligaID+'\');"><a style="font-weight:bold;" href="javascript:void(0);">'+ligaName+'</a></div><div id="liga_'+ligaID+'" name="ln" '+dop+' '+vid+' sv="' + sv + '">';
                        }

                        var dopGM = '';
                        var gmtp = res.Value[i].GameType;
                        var gmvd = res.Value[i].GameVid;

                        if (gmtp || gmvd) {
                            if (gmtp && gmvd)
                                dopGM = "(" + gmtp + " " + gmvd + ")";
                            else
                                dopGM = "(" + gmtp + gmvd + ")";
                        }

                        if (selectGame == gameID)
                            selectGameGood = 1;

                        var gameTime = res.Value[i].NameGame || '';
                        /*var gameDateTime2 = res.Value[i].TimeStart || '';

                         t2 = new Date((parseFloat(gameDateTime2) + 3600 * tz) * 1000);
                         gH = t2.getUTCHours();
                         gM = t2.getUTCMinutes();
                         if (gM < 10)
                         gM = '0' + gM;
                         gameDateTime = gH + ":" + gM;*/

                        var gameScore = cP = dopText = eL = '';

                        if (res.Value[i].Scores) {
                            var Sc1 = parseInt(res.Value[i].Scores.FullScore.Sc1, 10),
                                Sc2 = parseInt(res.Value[i].Scores.FullScore.Sc2, 10);

                            if (!isNaN(Sc1) && !isNaN(Sc2))
                                gameScore = '(' + Sc1 + ' - ' + Sc2 + ')';

                            cP = res.Value[i].Scores.CurrPeriodStr || '';
                            if (cP)
                                cP = lp[languageID]['goes'] + ' ' + cP;

                            eL = res.Value[i].Scores.TimeSec;
                            var eltime = res.Value[i].Scores.TimeDirection;

                            if (eltime == false)
                                dopText = lp[languageID]['remained'];
                            else if (eltime == true)
                                dopText = lp[languageID]['passed'];
                            else
                                dopText = lp[languageID]['break'];

                            eL = Math.round(eL / 60) || '';
                            if (eL)
                                eL = ' ' + dopText + ': ' + eL + lp[languageID]['minut'];

                            if (cP && eL)
                                cP += ',';
                        }

                        var gameNum = res.Value[i].Num || '';

                        //gameDateTime = '<b>' + gameNum + '.</b> ' + gameDateTime;
                        var gameDateTime = '<b>' + gameNum + '.</b> ';

                        if (gameOp2)
                            dpg2 = '&ndash;';
                        else
                            dpg2 = '';

                        gameOp2 += dopGM;

                        if (gameBlock) {
                            zm = '<span><img src="/images/zamok2.png" width="13" align=absmiddle></span> ';
                            lb = '';
                            rb = '';
                            cb = 'style="border-top:2px solid #666;background:#eee; opacity: 0.45;-moz-opacity:0.45;-khtml-opacity:0.45;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=45);"';
                        } else {
                            zm = '';
                            lb = '';
                            rb = '';
                            cb = '';
                        }

                        if (!MainGameId) {
                            pID = parseInt(gameID - 0, 10);

                            if (stZG) {
                                stZG = 0;
                                rezSport += "</div>";
                            }

                            selG = parseInt(gameID - 0, 10);
                            if (gameBlock)
                                rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+' id="gl_'+gameID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 0, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gl" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+');" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"><div id="g1_" '+cb+'><span class="gDT">'+zm+gameDateTime+'</span> '+lb+gameOp1+dpg2+gameOp2+rb+tv+'<br><span class="gDT">'+gameScore+' '+cP+eL+'</span></div><div style="clear:both;"></div></div></a>';
                            else
                                rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+' id="gl_'+gameID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 0, \''+gameOp1+'\', \''+gameOp2+'\');" ><div id="gl" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+');" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"style="border-top:1px solid #999;border-radius:0px;margin-bottom:8px;background:#EFEfCf;"><div id="g1_" '+cb+'><span class="gDT">'+zm+gameDateTime+'</span> '+lb+gameOp1+dpg2+gameOp2+rb+tv+'<br><span class="gDT">'+gameScore+' '+cP+eL+'</span></div><div style="clear:both;"></div></div></a>';

                            if (!stZG) {
                                stZG = 1;
                                if (openPg.indexOf(gameID) != -1)
                                    disp = 'block';
                                else
                                    disp = 'none';

                                if (gameBlock)
                                    disp = 'block';

                                rezSport += '<div id="podG_' + gameID + '" style="display:' + disp + ';border:0px dotted #ddd; margin-bottom:13px;">';
                            }
                        } else {
                            minSG[sportID]++;
                            if (parseInt(MainGameId) == selG) {
                                if (gameBlock)
                                    rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+'  id="g_'+gameID+'" pID="'+pID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 1, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gll" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+', 10);" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"><div id="g1_" '+cb+'>'+zm+lb+gameOp1+dpg2+gameOp2+rb+tv+'<span class="gT"> ('+gameTime+')</span></div><div style="clear:both;"></div></div></a>';
                                else
                                    rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+'  id="g_'+gameID+'" pID="'+pID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 1, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gll" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+', 10);" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"><div id="g1_" '+cb+'>'+zm+lb+gameOp1+dpg2+gameOp2+rb+tv+'<span class="gT"> ('+gameTime+')</span></div><div style="clear:both;"></div></div></a>';
                            } else {
                                selG = parseInt(gameID);
                                pID = parseInt(gameID);
                                if (stZG) {
                                    stZG = 0;
                                    rezSport += "</div>";
                                }

                                rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+' id="gl_'+gameID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 0, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gl" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+', 10);" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);" style="border-top:1px solid #999;border-radius:0px;margin-bottom:8px;background:#EFEfCf;"><div id="g1_" '+cb+'><span class="gDT">'+zm+gameDateTime+'</span> '+lb+gameOp1+dpg2+gameOp2+rb+tv+'<span class="gT"> ('+gameTime+')</span></div><div style="clear:both;"></div></div></a>';

                                if (!stZG) {
                                    stZG = 1;
                                    if(openPg.indexOf(gameID) != -1) disp = 'block'; else disp = 'none';
                                    rezSport += '<div id="podG_' + gameID + '" style="display:'+disp+';border:0px solid red;">';
                                }

                                if (gameBlock)
                                    rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+'  id="g_'+gameID+'" pID="'+pID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 1, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gll" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+', 10);" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"><div id="g1_" '+cb+'>'+zm+lb+gameOp1+dpg2+gameOp2+rb+tv+'<span class="gT">('+gameTime+')</span></div><div style="clear:both;"></div></div></a>';
                                else
                                    rezSport += '<a sv="'+sv+'" xx="'+ligaID+'" '+vid+'  id="g_'+gameID+'" pID="'+pID+'" href="javascript:void(0);" onClick="selGame('+gameID+', '+sportID+', 1, \''+gameOp1+'\', \''+gameOp2+'\');"><div id="gll" onMouseOver="clearTimeout(t);h1=1;showAdd(this, '+gameID+', 10);" onMouseOut="t=setTimeout(\'testHideAdd1()\', 100);"><div id="g1_" '+cb+'>'+zm+lb+gameOp1+dpg2+gameOp2+rb+tv+'<span class="gT">('+gameTime+')</span></div><div style="clear:both;"></div></div></a>';
                            }
                        }
                    }

                    if (stZG)
                        rezSport += '</div>';
                    if (tmpLigaID)
                        rezSport += '</div>';
                    if (tmpSportID)
                        rezSport += '</div>';

                    if (openMenuSportGood != 1)
                        openMenuSport = null;
                    if (selectSportGood != 1)
                        selectSport = null;
                    if (selectGameGood != 1) {
                        selGameClose();
                        selectGame = null;
                    }

                    $('cG').innerHTML = '(' + kolG + ')';
                    $('cGV').innerHTML = '(' + kolVideo + ')';
                    $('allSport').innerHTML = rezSport;

                    for (var k in gLen) {
                        var tv_d = '<span style="font-size:9px; width:33px; float:right; line-height:normal;">&nbsp;</span>';
                        if (colV[k] > 0) {
                            tv_d = '<span style="font-size:9px; color:#ffffff; background:#539dcf; border:1px solid #539dcf; padding:1px; float:right; line-height:normal; margin-top:3px;">'+lp[languageID]['video']+'</span>';
                        }

                        if ($('len_'+k))
                            $('len_'+k).innerHTML = parseInt(gLen[k] - minSG[k]) + ' / ' + colV[k] + tv_d;
                        if (showOnlyVideo) {
                            if ($('nSp_' + k))
                                if (!colV[k])
                                    $('nSp_' + k).hide();
                                else
                                    $('nSp_' + k).show();
                        }
                    }
                    updateFav();

                    if (showOnlyVideo)
                        setAllAShowHide(1);
                }
                if (curSelOBJ != null && $(curSelOBJ))
                    if ($(curSelOBJ).childNodes[0])
                        $(curSelOBJ).childNodes[0].className = 'gllSel';
            }
        });
    } catch(err) {
        if (typeof To[0] !== 'undefined')
            clearTimeout(To[0]);
        return;
    }
}

sel_all_games = function(obj)
{
    obj.className='sel';
    $('sel_vid').className='';
    showOnlyVideo = 0;
    setAllAShowHide(0);
    ChangeImg(1);
}

sel_all_videos = function(obj)
{
    obj.className='sel';
    $('sel_all').className='';
    showOnlyVideo = 1;
    setAllAShowHide(1);
    ChangeImg(1);
}

setAllAShowHide = function(n)
{
    if(n){
        for(var k in gLen) {
            if($('nSp_' + k)) if(!colV[k]) $('nSp_' + k).hide();
        }
        $$('#allSport a[sv=1]').each(function(s){
            var xx = parseInt(s.getAttribute('xx'), 10);
            //$('liga_sub_'+xx).className = 'showLiga';
            $('liga_sub_'+xx).setAttribute('sv', 1);
            $('liga_sub_'+xx).show();
            $('liga_'+xx).setAttribute('sv', 1);
            $('liga_'+xx).show();
        });
        $$('#allSport a[sv=0]').each(function(s){s.hide()});
        $$('#allSport div[sv=0]').each(function(s){s.hide()});
    } else {
        $$('#allSport div[sv=0]').each(function(s){s.show()});
        $$('#allSport .sports_tab2').each(function(s){s.show()});
        $$('#allSport a[id^="g"]').each(function(s){s.show()});
    }
}

set_for_reg_user = function()
{
    userAccount = 1;
    draw_bets();
    $('U_howBet').className = 'Show';
    $('nU_howBet').className = 'noShow';
    get_history_today();
}

showThis = function(id)
{
    game = $('game_'+id);
    selectSportId = id;
    if (document.getElementById("bHis").style.display != "none")
        for (var iba = 0; document.getElementById("bHis").style.display != "none"; iba++)
            goBackHis1(id);

    showAllLiveBets1x2(id, 50);

    // Вычисляем положение скролла
    var scrollHeight = document.getElementById("allSport").scrollHeight;
    var scrollTop = jQuery('#allSport').scrollTop();
    var scrollBottom = scrollHeight - jQuery('#allSport').height() - scrollTop;

    if(game){
        if(game.className == "hideGame") {
            game.className = "showGame";
            openMenuSportArray[id] = 1;
        }else{
            game.className = "hideGame";
            openMenuSportArray[id] = 0;
        }
    }


    // Прокручиваем скролл
    if(!scrollBottom && scrollTop) {
        var scrollDelta = scrollHeight-scrollTop;
        jQuery('#allSport').scrollTop(scrollTop + scrollDelta);
    }
}

showInfoWindow = function()
{
    deltaX =  window.pageXOffset
        || document.documentElement.scrollLeft
        || document.body.scrollLeft
        || 0;
    deltaY =  window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || 0;

    iW = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
        || 0;

    iH = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
        || 0;

    var obj = $('info_content');
    obj_x = parseInt(obj.style.width);
    obj_y = parseInt(obj.style.height);

    obj.style.left = Math.round((iW - obj_x) / 2) + deltaX + 'px';
    obj.style.top = Math.round((obj_y) / 2) + deltaY + 'px';

    obj.show();
}

selGameClose = function()
{
    if($("iInfoGame")) $("iInfoGame").hide();

    if(firstStart) return;

    $('games_content').show();
    $('shAll').innerHTML = '<div style="text-align:center; padding:10px 0; font-size:16px;">'+lp[languageID]['gameover']+'.</div>';

    startUpdateSob = false;

    var sLength = rData.length;
    for(var k = 0; k < sLength; k++)
    {
        if(rData[k].idGame == selectGame)
        {
            rData[k].block = 1;
        }
    }

    draw_bets();
}

goBackHis = function()
{
    if(!transHis.length) return;

    var his = transHis.pop();
    his = transHis.pop();
    if(typeof his !== 'undefined') selGame(his.id, his.idSelSport);
    if(!transHis.length) {firstStart = 1; showAllLiveBets1x2(); $('bHis').hide(); selectSport = null; selectGame = null; return;}
}
goBackHis1 = function(id)
{
    if (!transHis.length) return;

    var his = transHis.pop();
    his = transHis.pop();
    if (typeof his !== 'undefined')
        selGame(his.id, his.idSelSport);

    if (!transHis.length) {
        firstStart = 1;
        showAllLiveBets1x2(id,50);
        $('bHis').hide();
        selectSport = null;
        selectGame = null;
        return;
    }
}

myHis = function(id, idSelSport, type, op1, op2)
{
    this.id = id;
    this.idSelSport = idSelSport;
    this.type = type;
    this.op1 = op1;
    this.op2 = op2;
}

podGshow = function(id)
{
    if(podG = $('podG_'+id)) {
        podG.show();
        esth = 0;
        for(i = 0; i < openPg.length; i++)
        {
            if(openPg[i] == id)
            {
                esth = 1;
                break;
            }
        }

        if(!esth) openPg.push(id);
    }
}

podGhide = function(id)
{
    if(podG = $('podG_'+id)) {
        podG.hide();
        for(i = 0; i < openPg.length; i++)
        {
            if(openPg[i] == id)
            {
                openPg.splice(i, 1);
                break;
            }
        }
    }
}

selGame = function(id, idSelSport, type, op1, op2)
{
    // Вычисляем положение скролла
    var scrollHeight = document.getElementById("allSport").scrollHeight;
    var scrollTop = jQuery('#allSport').scrollTop();
    var scrollBottom = scrollHeight - jQuery('#allSport').height() - scrollTop;

    firstStart = 0;
    clearInterval(show1x2);

    if($("iInfoGame")) $("iInfoGame").hide();

    op1 = op1 || '';
    op2 = op2 || '';
    var d = '';
    var n = 0;
    type = type || 0;
    if(!type) {
        d = 'gl_';
    } else {
        d = 'g_';
    }

    if(!type)
    {
        if(podG = $('podG_'+id)) {
            if(podG.visible()) {
                //podGhide(id);
            } else {
                podGshow(id);
            }
        }
    } else {
        if($('g_'+id))
        {
            var pID = parseInt($('g_'+id).getAttribute('pID'), 10);
            podGshow(pID);
        }
    }

    // Прокручиваем сролл
    if(!scrollBottom && scrollTop) {
        var scrollDelta = scrollHeight-scrollTop;
        jQuery('#allSport').scrollTop(scrollTop + scrollDelta);
    }

    if(typeof groupOpen[id] == 'undefined') groupOpen[id] = new Array();
    idSport = idSelSport;
    selectGame = parseInt(id, 10);

    if($(d+id)) {
        if(curSelOBJ != null && $(curSelOBJ)) if($(curSelOBJ).childNodes[0]) $(curSelOBJ).childNodes[0].className = '';
        if($(d+id).childNodes[0]) $(d+id).childNodes[0].className = 'gllSel';
        curSelOBJ = (d+id);
        ligaIdcg = $(d+id).getAttribute('xx');
        if($('liga_' + ligaIdcg)) $('liga_' + ligaIdcg).className = "showLiga";
    }

    esth = 0;
    for(i = 0; i < transHis.length; i++)
    {
        if(transHis[i].id == id)
        {
            esth = 1;
            break;
        }
    }

    if(!esth) transHis.push(new myHis(id, idSelSport, type, op1, op2));
    $('bHis').show();

    strH = '';
    lenH = transHis.length;
    curN = 0;
    for(i = lenH - 1; i >= 0; i--)
    {
        curN++;
        if(curN > 7) break;
        type = transHis[i].type;
        if(!type) {
            d = 'gl_';
            n = 0;
        } else {
            d = 'g_';
            n = 1;
        }

        //if($(d+transHis[i].id) && transHis[i].op1 && transHis[i].op2) strH += "<tr style='height:25px;' valign=center><td style='width:14px;'><img width=12px src='/images/ico_game/"+transHis[i].idSelSport+".png'></td><td class='bSob'><a href='javascript:void(0);' onClick='selGame("+transHis[i].id+", "+transHis[i].idSelSport+", "+n+", \""+transHis[i].op1+"\", \""+transHis[i].op2+"\");'>"+transHis[i].op1+" - "+transHis[i].op2+"</a></td></tr>";

        if($(d+transHis[i].id) && transHis[i].op1)// && transHis[i].op2)
        {
            if(typeof($(d+transHis[i].id).innerText) !== 'undefined')
            {
                it = $(d+transHis[i].id).innerText;
            } else {
                it = $(d+transHis[i].id).textContent;
            }

            strH += "<tr style='height:25px;' valign=center><td style='width:14px;'><img width=12px src='/images/ico_game/"+transHis[i].idSelSport+".png'></td><td class='bSob'><a href='javascript:void(0);' onClick='selGame("+transHis[i].id+", "+transHis[i].idSelSport+", "+n+", \""+transHis[i].op1+"\", \""+transHis[i].op2+"\");'>"+it+"</a></td></tr>";
        }
    }

    if(strH)
    {
        strH = '<div class="sports_tab"><div class="left" onclick="BlockVisibility(2, this)" title="'+lp[languageID]['minimize']+'"><span><img src="/images/last_viewed_games.png" style="vertical-align:middle" /></span> '+lp[languageID]['recentlyViewed']+'<span style="float:right; padding:8px 5px 0 0;"><img src="/images/minimize_window.png" class="mbutton" /></span></div></div><table id="tb3" class="block_2" cellpadding="3" border="0" style="background:#fff; border-radius:0 0 5px 5px; -moz-border-radius:0 0 5px 5px; -webkit-border-radius:0 0 5px 5px;"><div style="clear:both;"></div>' + strH;
        strH += "</table>";

        $('gamesH').innerHTML = strH;
    }
    //selectGame == null
    //startUpdateSob

    game = $('game_'+idSelSport);

    if(game){
        game.className = "showGame";
        openMenuSportArray[idSelSport] = 1;
    }

    $('games_content').innerHTML = content_template;
    $('games_content').hide();
    $('info_content').innerHTML = '<div style="height:100px; padding-top:50px;text-align:center;"><img src="/images/loading.gif"><br><br>'+lp[languageID]['update']+'...</div>';
    $('info_content').show();

    getSobByGameId(selectGame);

    var sLength = rData.length;
    for(var k = 0; k < sLength; k++)
    {
        if(rData[k].idGame == selectGame)
        {
            rData[k].block = 0;
        }
    }

    draw_bets();
    return;
}

get_history_today = function()
{
    new Ajax.Request('/dataLive/bet_history_live.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "",
        method: "get",
        onComplete: function(request) {
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                $('bet_history_today').innerHTML = request.responseText;
                $('bet_history_today').show();

                setPNum(nPage);
            }
        }
    });
}

String.prototype.htmlspecialchars = function(){

    var str = this.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    return str;
};

var my_nameGroup = new Array();
my_nameGroup[1] = 'П1';
my_nameGroup[2] = 'Х';
my_nameGroup[3] = 'П2';

var shMyBetsFlag = false;
var hisUpDown = new Array();

function showAllMarkets(){
    shMyBetsFlag = false;
    document.getElementById('allMarkets').addClassName('active');
    document.getElementById('myMarDiv').removeClassName('active');
    getSobByGameId(lastGameId);
}

function showMyBets() {
    shMyBetsFlag = true;
    document.getElementById('myMarDiv').addClassName('active');
    document.getElementById('allMarkets').removeClassName('active');
    getSobByGameId(lastGameId);
}

showAllLiveBets1x2 = function(sp, cnt) {
    if (!firstStart) {
        clearInterval(t1x2);
        return;
    }

    sp = sp || 0;
    cnt = cnt || 50;
    params = '';

    if (sp == -1) {
        hotFav = new Array();
        for (var i in favorArray) {
            if (isNumber(i) && favorArray[i]) {
                hotFav[hotFav.length] = i;
            }
        }

        selectSportId = -1;
        nURL = '/getData/live/HotLinesFavor/' + hotFav.join();

    } else {
        //nURL = '/getData/live/HotGames/'+sp+'/'+cnt;
        nURL = '/LiveFeed/Get1x2';
        params = "sportId=" + sp + "&count=" + cnt + "&lng=" + lng;
    }

    try {
        new Ajax.Request(nURL, {
            requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
            parameters: params,
            method: "get",
            onComplete:function(request){
                if (request.status != 200) {
                    // alert("Server is unavailable. Try again later.");
                } else {
                     res = request.responseJSON;
                    var ansLen = res.Value.length;
                    if (!ansLen) return;

                    var resSTR = '';
                    resSTR += "<div id='group_three'><div id='titleHotLines' style='height:18px; padding:2px 0 0 4px; font-size:14px; background:#FFD400; color:#333; font-weight:bold;'>" + lp[languageID]['hotLines'] + "</div>";
                    resSTR += "<div>";

                    var tz = GetCookie("tzo") || 0;

                    for (var i = 0; i < ansLen; i++) {
                        var Op1 = res.Value[i].Opp1 || '';
                        Op1 = Op1.htmlspecialchars();

                        var Op2 = res.Value[i].Opp2 || '';
                        Op2 = Op2.htmlspecialchars();

                        var GameType = res.Value[i].GameType || '';
                        GameType = GameType.htmlspecialchars();
                        if (GameType.length)
                            GameType = '(' + GameType + ')';

                        var GameVid = res.Value[i].GameVid || '';
                        if (GameVid.lemgth)
                            GameVid = '(' + GameVid + ')';

                        var idGame = res.Value[i].Id || '';
                        idGame = parseInt(idGame, 10);

                        var dT2 = res.Value[i].Start || '';
                        t2 = new Date((parseFloat(dT2) + 3600 * tz) * 1000);

                        gH = t2.getUTCHours();
                        gM = t2.getUTCMinutes();
                        if (gM < 10) gM = '0' + gM;
                        timeStart = gH + ":" + gM;

                        gDate = t2.getUTCDate();
                        gMonth = t2.getUTCMonth();
                        dataStart = gDate + "." + (gMonth + 1);

                        var numGame = res.Value[i].Num || '';
                        numGame = parseInt(numGame, 10);

                        var idSport = res.Value[i].SportId || '';
                        idSport = parseInt(idSport, 10);

                        var nameSport = res.Value[i].SportName || '';

                        var time = '';
                        var score = '';
                        var SubSc12 = '';
                        var scores = '';

                        if (res.Value[i].Scores) {
                            time = res.Value[i].Scores.TimeSec || '';

                            if (time) {
                                /*var hours = Math.floor(time / 3600);
                                 if (hours) {
                                 time = time % 3600;
                                 if (hours < 10)
                                 hours = '0' + hours + ':';
                                 else
                                 hours = hours + ':';
                                 } else
                                 hours = '';*/

                                var minutes = Math.floor(time / 60);
                                if (minutes) {
                                    if (minutes < 10)
                                        minutes = '0' + minutes + ':';
                                    else
                                        minutes = minutes + ':';
                                } else
                                    minutes = '00:';

                                var seconds = time % 60;
                                if (seconds) {
                                    if (seconds < 10)
                                        seconds = '0' + seconds;
                                } else
                                    seconds = '00';

                                time = ' (' + /*hours +*/ minutes + seconds + ')'
                            }

                            var score1 = res.Value[i].Scores.FullScore.Sc1 || 0;
                            var score2 = res.Value[i].Scores.FullScore.Sc2 || 0;
                            score = score1 + '-' + score2;

                            var scoresLength = res.Value[i].Scores.PeriodScores.length;
                            if (scoresLength) {
                                scores += ' [';
                                for (var s = 0; s < scoresLength; s++) {
                                    if (res.Value[i].Scores.PeriodScores[s].Key) {
                                        scores += res.Value[i].Scores.PeriodScores[s].Value.Sc1 + '-' + res.Value[i].Scores.PeriodScores[s].Value.Sc2;
                                        if (s < scoresLength - 1) scores += ', ';
                                    }
                                }
                                scores += ']';
                            }

                            var mp1 = '';
                            var mp2 = '';
                            var podacha = res.Value[i].Scores.Podacha || '';
                            if (podacha == '1') mp1 = '<img src="/images/ico_game/'+idSport+'.png" width="6px" align=absmiddle> ';
                            if (podacha == '2') mp2 = ' <img src="/images/ico_game/'+idSport+'.png" width="6px" align=absmiddle> ';

                            var SubSc1 = '';
                            var SubSc2 = '';
                            if (res.Value[i].Scores.SubScore) {
                                SubSc1 = res.Value[i].Scores.SubScore.Sc1 || '0';
                                SubSc2 = res.Value[i].Scores.SubScore.Sc2 || '0';
                            }

                            if (SubSc1 != '' && SubSc2 != '')
                                SubSc12 = ' (' + mp1 + SubSc1 + '-' + SubSc2 + mp2 + ') ';
                        }

                        var video = res.Value[i].VA || '';
                        if (!video)
                            video = '';
                        else {
                            var idVideo1x2 = res.Value[i].VI;
                            var opp1x2 = Op1 + ' - ' + Op2;
                            video = '<span style="background:#539dcf; padding:0 1px; line-height:normal;"><a style="color:#fff; font-size:8px;" href="javascript:void(0);" onclick="playVideo(\''+idVideo1x2+'?'+idGame+'\', \''+opp1x2+'\'); goNaverh();">' + lp[languageID]['video'] + '</a></span>';
                        }

                        var cf1 = cf2 = cf3 = cf4 = cf5 = cf6 = cf7 = cf8 = cf9 = cf10 = cf11 = cf12 = cf13 = cf14 = '',
                            cl1 = cl2 = cl3 = cl4 = cl5 = cl6 = cl7 = cl8 = cl9 = cl10 = cl11 = cl12 = cl13 = cl14 = '',
                            cff_prm_7 = cff_prm_8 = cft_prm = cfp_prm = cfg_prm = '';

                        var est_dc_cf = est_fora = est_total = est_points = est_wingame = 0;

                        for (var j = 0; j < res.Value[i].Events.length; j++) {
                            var idSob = res.Value[i].Events[j].T;
                            var koef = res.Value[i].Events[j].C;

                            switch (idSob) {
                                // П1
                                case 1:
                                    cf1 = parseFloat(koef);
                                    break;
                                // Х
                                case 2:
                                    cf2 = parseFloat(koef);
                                    break;
                                // П2
                                case 3:
                                    cf3 = parseFloat(koef);
                                    break;
                                // П1X
                                case 4:
                                    cf4 = parseFloat(koef);
                                    est_dc_cf = 1;
                                    break;
                                // 12
                                case 5:
                                    cf5 = parseFloat(koef);
                                    est_dc_cf = 1;
                                    break;
                                // П2Х
                                case 6:
                                    cf6 = parseFloat(koef);
                                    est_dc_cf = 1;
                                    break;
                                // Фора 1
                                case 7:
                                    cf7 = parseFloat(koef);
                                    cff_prm_7 = parseFloat(res.Value[i].Events[j].P);
                                    est_fora = 1;
                                    break;
                                // Фора 2
                                case 8:
                                    cf8 = parseFloat(koef);
                                    cff_prm_8 = parseFloat(res.Value[i].Events[j].P);
                                    est_fora = 1;
                                    break;
                                // Тотал Б
                                case 9:
                                    cf9 = parseFloat(koef);
                                    cft_prm = parseFloat(res.Value[i].Events[j].P);
                                    est_total = 1;
                                    break;
                                // Тотал М
                                case 10:
                                    cf10 = parseFloat(koef);
                                    cft_prm = parseFloat(res.Value[i].Events[j].P);
                                    est_total = 1;
                                    break;
                                // Поинты
                                case 864:
                                    cf11 = parseFloat(koef);
                                    cfp_prm = parseFloat(res.Value[i].Events[j].P);
                                    var cfp_point = parseInt(cfp_prm);
                                    var cfp_num = Math.round((res.Value[i].Events[j].P - cfp_point) * 1000);
                                    est_points = 1;
                                    break;
                                // Поинты
                                case 865:
                                    cf12 = parseFloat(koef);
                                    cfp_prm = parseFloat(res.Value[i].Events[j].P);
                                    var cfp_point = parseInt(cfp_prm);
                                    var cfp_num = Math.round((res.Value[i].Events[j].P - cfp_point) * 1000);
                                    est_points = 1;
                                    break;
                                // Геймы П1
                                case 50: case 52: case 54: case 56: case 702: case 704:
                                cf13 = parseFloat(koef);
                                cfg_prm = parseFloat(res.Value[i].Events[j].P);
                                est_wingame = 1;
                                break;
                                // Геймы П2
                                case 51: case 53: case 55: case 57: case 703: case 705:
                                cf14 = parseFloat(koef);
                                cfg_prm = parseFloat(res.Value[i].Events[j].P);
                                est_wingame = 1;
                                break;
                                default:
                                    break;
                            }
                        }

                        newUp = 0;
                        if (typeof hisUpDown[idGame] == 'undefined') {
                            hisUpDown[idGame] = new Array();

                            hisUpDown[idGame]['cp1'] = 0;
                            hisUpDown[idGame]['cx'] = 0;
                            hisUpDown[idGame]['cp2'] = 0;
                            hisUpDown[idGame]['dc_cf1'] = 0;
                            hisUpDown[idGame]['dc_cf2'] = 0;
                            hisUpDown[idGame]['dc_cf3'] = 0;
                            hisUpDown[idGame]['cf1'] = 0;
                            hisUpDown[idGame]['cf2'] = 0;
                            hisUpDown[idGame]['ct1'] = 0;
                            hisUpDown[idGame]['ct2'] = 0;
                            hisUpDown[idGame]['cpoint1'] = 0;
                            hisUpDown[idGame]['cpoint2'] = 0;
                            hisUpDown[idGame]['cgame1'] = 0;
                            hisUpDown[idGame]['cgame2'] = 0;

                            up1 = up2 = up3 = up4 = up5 = up6 = up7 = up8 = up9 = up10 = up11 = up12 = up13 = up14 = 0;
                            newUp = 1;
                        }

                        if (!newUp) {
                            up1 = cf1 - hisUpDown[idGame]['cp1'];
                            up2 = cf2 - hisUpDown[idGame]['cx'];
                            up3 = cf3 - hisUpDown[idGame]['cp2'];
                            up4 = cf4 - hisUpDown[idGame]['dc_cf1'];
                            up5 = cf5 - hisUpDown[idGame]['dc_cf2'];
                            up6 = cf6 - hisUpDown[idGame]['dc_cf3'];
                            up7 = cf7 - hisUpDown[idGame]['cf1'];
                            up8 = cf8 - hisUpDown[idGame]['cf2'];
                            up9 = cf9 - hisUpDown[idGame]['ct1'];
                            up10 = cf10 - hisUpDown[idGame]['ct2'];
                            up11 = cf11 - hisUpDown[idGame]['cpoint1'];
                            up12 = cf12 - hisUpDown[idGame]['cpoint2'];
                            up13 = cf13 - hisUpDown[idGame]['cgame1'];
                            up14 = cf14 - hisUpDown[idGame]['cgame2'];
                        }

                        hisUpDown[idGame]['cp1'] = cf1;
                        hisUpDown[idGame]['cx'] = cf2;
                        hisUpDown[idGame]['cp2'] = cf3;
                        hisUpDown[idGame]['dc_cf1'] = cf4;
                        hisUpDown[idGame]['dc_cf2'] = cf5;
                        hisUpDown[idGame]['dc_cf3'] = cf6;
                        hisUpDown[idGame]['cf1'] = cf7;
                        hisUpDown[idGame]['cf2'] = cf8;
                        hisUpDown[idGame]['ct1'] = cf9;
                        hisUpDown[idGame]['ct2'] = cf10;
                        hisUpDown[idGame]['cpoint1'] = cf11;
                        hisUpDown[idGame]['cpoint2'] = cf12;
                        hisUpDown[idGame]['cgame1'] = cf13;
                        hisUpDown[idGame]['cgame2'] = cf14;

                        if (up1 > 0) cl1 = ' class="gc_"'; if (up1 < 0) cl1 = ' class="rc_"';
                        if (up2 > 0) cl2 = ' class="gc_"'; if (up2 < 0) cl2 = ' class="rc_"';
                        if (up3 > 0) cl3 = ' class="gc_"'; if (up3 < 0) cl3 = ' class="rc_"';
                        if (up4 > 0) cl4 = ' class="gc_"'; if (up4 < 0) cl4 = ' class="rc_"';
                        if (up5 > 0) cl5 = ' class="gc_"'; if (up5 < 0) cl5 = ' class="rc_"';
                        if (up6 > 0) cl6 = ' class="gc_"'; if (up6 < 0) cl6 = ' class="rc_"';
                        if (up7 > 0) cl7 = ' class="gc_"'; if (up7 < 0) cl7 = ' class="rc_"';
                        if (up8 > 0) cl8 = ' class="gc_"'; if (up8 < 0) cl8 = ' class="rc_"';
                        if (up9 > 0) cl9 = ' class="gc_"'; if (up9 < 0) cl9 = ' class="rc_"';
                        if (up10 > 0) cl10 = ' class="gc_"'; if (up10 < 0) cl10 = ' class="rc_"';
                        if (up11 > 0) cl11 = ' class="gc_"'; if (up11 < 0) cl11 = ' class="rc_"';
                        if (up12 > 0) cl12 = ' class="gc_"'; if (up12 < 0) cl12 = ' class="rc_"';
                        if (up13 > 0) cl13 = ' class="gc_"'; if (up13 < 0) cl13 = ' class="rc_"';
                        if (up14 > 0) cl14 = ' class="gc_"'; if (up14 < 0) cl14 = ' class="rc_"';

                        var null_prm = 0;

                        if (sp)
                            resSTR += "<table id='tb2'><tr id='rt'><td style='width:18px;'><img src='/images/ico_game/"+idSport+".png' /></td><td class='mta bSob'><a href='javascript:void(0);' style='font-weight:bold;' onclick='showIgrok_("+idGame+", "+idSport+");'>"+numGame+". "+Op1+"-"+Op2+' '+ GameType + ' ' + GameVid + "</a>"+ video +"<span style='float:right;'>"+SubSc12+score+scores+time+"</span></td></tr>";
                        else
                            resSTR += "<table id='tb2'><tr id='rt'><td style='width:18px;'><img src='/images/ico_game/"+idSport+".png' /></td><td class='mta bSob'><a href='javascript:void(0);' style='font-weight:bold;' onclick='showIgrok_("+idGame+", "+idSport+");'>"+numGame+". "+nameSport+". "+Op1+"-"+Op2+' '+ GameType + ' ' + GameVid + "</a>"+ video +"<span style='float:right;'>"+SubSc12+score+scores+time+"</span></td></tr>";

                        resSTR += '<tr><td colspan="2"><table width="100%" ><tr style="background:#D7E3E3;" align=center><td>' + lp[languageID]['victory1'] + '</td>';
                        if(idSport != 4 && idSport != 10 && idSport != 16) resSTR += '<td>' + lp[languageID]['draw'] + '</td>';
                        resSTR += '<td>' + lp[languageID]['victory2'] + '</td>';

                        if (est_dc_cf)
                            resSTR += '<td>' + lp[languageID]['victory1'] + lp[languageID]['draw'] + '</td><td>' + lp[languageID]['victory1'] + lp[languageID]['victory2'] + '</td><td>' + lp[languageID]['draw'] + lp[languageID]['victory2'] + '</td>';

                        resSTR += '<td>' + lp[languageID]['handicap'] + ' 1</td><td>1</td><td>' + lp[languageID]['handicap'] + ' 2</td><td>2</td><td>' + lp[languageID]['total'] + '</td><td>' + lp[languageID]['more'] + '</td><td>' + lp[languageID]['less'] + '</td>';

                        if (idSport == 4)
                            resSTR += '<td>' + lp[languageID]['points'] + '</td><td>' + lp[languageID]['victory1'] + '</td><td>' + lp[languageID]['victory2'] + '</td><td>' + lp[languageID]['games'] + '</td><td>' + lp[languageID]['victory1'] + '</td><td>' + lp[languageID]['victory2'] + '</td>';

                        if (idSport == 6 || idSport == 10 || idSport == 16 || idSport == 39)
                            resSTR += '<td>' + lp[languageID]['points'] + '</td><td>' + lp[languageID]['victory1'] + '</td><td>' + lp[languageID]['victory2'] + '</td>';

                        resSTR += '</tr><tr align="center">';

                        if (cf1)
                            resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl1+" t='1' id='b_1' n='П1' u='"+idGame+"' g='1' v='"+idGame+""+null_prm+"1' pl='0'>"+cf1+"</div></a></div></td>";
                        else
                            resSTR += "<td>-</td>";

                        if (idSport != 4 && idSport != 10 && idSport != 16) {
                            if (cf2)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl2+" t='1' id='b_2' n='Х' u='"+idGame+"' g='1' v='"+idGame+""+null_prm+"2' pl='0'>"+cf2+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";
                        }

                        if (cf3)
                            resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl3+" t='1' id='b_3' n='П2' u='"+idGame+"' g='1' v='"+idGame+""+null_prm+"3' pl='0'>"+cf3+"</div></a></div></td>";
                        else
                            resSTR += "<td>-</td>";

                        if (est_dc_cf) {
                            if (cf4)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl12+" t='6' id='b_4' n='1X' u='"+idGame+"' g='8' v='"+idGame+""+null_prm+"4' pl='0'>"+cf4+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";

                            if (cf5)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl13+" t='6' id='b_5' n='12' u='"+idGame+"' g='8' v='"+idGame+""+null_prm+"5' pl='0'>"+cf5+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";

                            if (cf6)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl14+" t='6' id='b_6' n='X2' u='"+idGame+"' g='8' v='"+idGame+""+null_prm+"6' pl='0'>"+cf6+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";
                        }

                        if (est_fora) {
                            resSTR += "<td>"+cff_prm_7+"</td>";
                            if (cf7)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl4+" id='b_7' n='Фора 1 ("+cff_prm_7+")' t='3' d='"+cff_prm_7+"' u='"+idGame+"' g='2' v='"+idGame+""+cff_prm_7+"7' pl='0'>"+cf7+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";

                            resSTR += "<td>"+cff_prm_8+"</td>";
                            if (cf8)
                                resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl5+" id='b_8' n='Фора 2 ("+cff_prm_8+")' t='3' d='"+cff_prm_8+"' u='"+idGame+"' g='2' v='"+idGame+""+cff_prm_8+"8' pl='0'>"+cf8+"</div></a></div></td>";
                            else
                                resSTR += "<td>-</td>";
                        } else {
                            resSTR += "<td>-</td>";
                            resSTR += "<td>-</td>";
                            resSTR += "<td>-</td>";
                            resSTR += "<td>-</td>";
                        }

                        if (est_total) {
                            resSTR += "<td>"+cft_prm+"</td>";
                            if (cf9) resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl6+" id='b_9' n='"+lp[languageID]['total']+" "+lp[languageID]['more']+" ("+cft_prm+")' t='2' d='"+cft_prm+"' u='"+idGame+"' g='17' v='"+idGame+""+cft_prm+"9' pl='0'>"+cf9+"</div></a></div></td>";
                            else resSTR += "<td>-</td>";
                            if (cf10) resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl7+" id='b_10' n='"+lp[languageID]['total']+" "+lp[languageID]['less']+" ("+cft_prm+")' t='2' d='"+cft_prm+"' u='"+idGame+"' g='17' v='"+idGame+""+cft_prm+"10' pl='0'>"+cf10+"</div></a></div></td>";
                            else resSTR += "<td>-</td>";
                        } else {
                            resSTR += "<td>-</td>";
                            resSTR += "<td>-</td>";
                            resSTR += "<td>-</td>";
                        }

                        if (idSport == 4 || idSport == 6 || idSport == 10 || idSport == 16 || idSport == 39) {
                            if (est_points) {
                                var pointName = lp[languageID]['spaceparty'];
                                if (idSport == 4)
                                    pointName = lp[languageID]['spacegame'];
                                if (idSport == 6)
                                    pointName = lp[languageID]['spaceset'];
                                var sob_name = cfp_point + ' (' + cfp_num + pointName + ')';
                                resSTR += '<td>'+sob_name+'</td>';
                                if (cf11) resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl8+" id='b_864' n='"+sob_name+ lp[languageID]['win'] +" 1' t='4' d='"+cfp_prm+"' u='"+idGame+"' g='135' v='"+idGame+""+cfp_prm+"864' pl='0'>"+cf11+"</div></a></div></td>"; else resSTR += "<td>-</td>";
                                if (cf12) resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl9+" id='b_865' n='"+ sob_name+ lp[languageID]['win'] +" 2' t='4' d='"+cfp_prm+"' u='"+idGame+"' g='135' v='"+idGame+""+cfp_prm+"865' pl='0'>"+cf12+"</div></a></div></td>"; else resSTR += "<td>-</td>";
                            } else {
                                resSTR += "<td>-</td>";
                                resSTR += "<td>-</td>";
                                resSTR += "<td>-</td>";
                            }
                        }

                        if (idSport == 4) {
                            if (est_wingame) {
                                resSTR += '<td>'+cfg_prm+'</td>';
                                if (cf13)
                                    resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl10+" id='b_50' n='" + lp[languageID]['game'] + " (" + cfg_prm + ")" + lp[languageID]['win'] +" 1' t='5' d='"+cfg_prm+"' u='"+idGame+"' g='22' v='"+idGame+""+cfg_prm+"50' pl='0'>"+cf13+"</div></a></div></td>";
                                else
                                    resSTR += "<td>-</td>";
                                if (cf14)
                                    resSTR += "<td style='min-width:10px;'><div id='xx_'><a><div "+cl11+" id='b_51' n='" + lp[languageID]['game'] + " (" + cfg_prm + ")" + lp[languageID]['win'] +" 2' t='5' d='"+cfg_prm+"' u='"+idGame+"' g='22' v='"+idGame+""+cfg_prm+"51' pl='0'>"+cf14+"</div></a></div></td>";
                                else
                                    resSTR += "<td>-</td>";
                            } else {
                                resSTR += "<td>-</td>";
                                resSTR += "<td>-</td>";
                                resSTR += "<td>-</td>";
                            }
                        }

                        resSTR += "</tr></table></td></tr></table>";
                    }

                    resSTR += "</div></div><br>";


                    $('games_content').innerHTML = resSTR;
                    if(sp) $('titleHotLines').innerHTML = nameSport + ' - ' + lp[languageID]['hotLines']; else $('titleHotLines').innerHTML = lp[languageID]['hotLines'];
                    if(sp == -1) $('titleHotLines').innerHTML = lp[languageID]['favorites'] + ' - ' + lp[languageID]['hotLines'];

                    t1x2 = setTimeout("setDefaultClass1x2()", 3000);
                    //getCuponUpdate();
                }
            }
        });

    } catch(err) {
        console.log(err);
        return;
    }
}

shPG = function(obj)
{
    if($('div_PG' + obj).style.display == 'none')
    {
        $('div_PG' + obj).style.display = 'block';
        $('im_' + obj).src = '/images/minus.gif';
    } else {
        $('div_PG' + obj).style.display = 'none';
        $('im_' + obj).src = '/images/plus.gif';
    }

}

RegExp.escape = function(text)
{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

showAllNear = function()
{
    //new Ajax.Request('/dataLive/showAllNear_live.php', {
    new Ajax.Request('/AnnounceFeed/GetAnnounceWeb', {
        requestHeaders: {"If-Modified-Since": "Sat, 1 Jan 2000 00:00:00 GMT", "Content-Type":"application/json"},
        parameters: "lng=" + lng,
        method: "get",
        onComplete: function(request){
            if(request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                resultA = request.responseJSON;
                if (!resultA.length)
                    return;

                var resSTR="";

                resSTR += '<div class="sports_tab"><div class="left" onclick="BlockVisibility(3, this)" title="'+lp[languageID]['minimize']+'"><span><img src="/images/waiting_games.png" style="vertical-align:middle" /></span> '+lp[languageID]['upEvents']+'<span style="float:right; padding:8px 5px 0 0;"><img src="/images/minimize_window.png" class="mbutton" /></span></div></div>';

                var cm = 0;
                var b1 = '';
                var b2 = '';
                var b3 = '';
                var n = 0;
                var col2 = 0;

                for (var i = 0; i < resultA.length; i++){
                    var idSport = resultA[i].sportId;
                    var name = resultA[i].name;
                    var champ = resultA[i].champ;
                    var nameSport = resultA[i].sportName;
                    var tMin = resultA[i].TimeBefore;
                    var live_video = resultA[i].video;
                    if (live_video == 'True') {
                        live_video = '<span style="font-size:8px; color:#ffffff; background:#539dcf; border:1px solid #539dcf; line-height:normal; margin:2px 0 0 5px; text-transform:uppercase;">'+lp[languageID]['video']+'</span>';
                    } else
                        live_video = '';

                    if (!name.length)
                        name = champ;

                    var h = Math.floor(tMin / 60);
                    var m = Math.floor(tMin - h * 60);
                    var t = '';

                    if(h) t += h + " " + lp[languageID]['hour'] + ". ";
                    t += m + " " + lp[languageID]['minut'] + ".";

                    if (!h && !m) continue;

                    if (h < 2) {
                        b1 += "<tr style='height:25px;' valign=center><td style='width:14px;'><img width=12px src='/images/ico_game/"+idSport+".png'></td><td class='bSob' onMouseOut='hideSp();' onMouseOver='showSp(this, \""+nameSport+"\")'>"+name+live_video+"</td><td style='width:75px;' align=right>"+t+"</div></td></tr>";
                        col2++;
                    }

                    if (h >= 2 && h < 4) {
                        b2 += "<tr style='height:25px;' valign=center><td style='width:14px;'><img width=12px src='/images/ico_game/"+idSport+".png'></td><td class='bSob' onMouseOut='hideSp();' onMouseOver='showSp(this, \""+nameSport+"\")'>"+name+live_video+"</td><td style='width:75px;' align=right>"+t+"</div></td></tr>";
                    }

                    if (h >= 4) {
                        b3 += "<tr style='height:25px;' valign=center><td style='width:14px;'><img width=12px src='/images/ico_game/"+idSport+".png'></td><td class='bSob' onMouseOut='hideSp();' onMouseOver='showSp(this, \""+nameSport+"\")'>"+name+live_video+"</td><td style='width:75px;' align=right>"+t+"</div></td></tr>";
                    }
                }

                resSTR += '<div style="background:#FFF; overflow-y:auto; border-radius:0 0 5px 5px; -moz-border-radius:0 0 5px 5px; -webkit-border-radius:0 0 5px 5px; display:block;" class="block_3">';

                if (b1) {
                    if (col2 > 10)
                        show2 = 'none';
                    else
                        show2 = 'block';

                    resSTR += "<div class='sports_tab2'><div class='tab_icon left'><img alt='b' src='/images/watch.gif' height='20' width='20' style='margin-top:1px;' /></div><div style='float:left;width:225px;border:0px solid red;'><h1 style='width:100%;'><a id='dn2' href='javascript:void(0);' onClick='if($(\"b1\").visible()) $(\"b1\").hide(); else $(\"b1\").show();'><b>"+lp[languageID]['before2']+"</b></a></h1></div></div><div id='b1' style='display:"+show2+";'><table id='tb3' cellpadding='3' border='0'><div style='clear:both;'></div>"+b1+"</table></div>";
                }

                if (b2) {
                    resSTR += "<div class='sports_tab2'><div class='tab_icon left'><img alt='b' src='/images/watch.gif' height='20' width='20' style='margin-top:1px;' /></div><div style='float:left;width:225px;border:0px solid red;'><h1 style='width:100%;'><a id='dn2' href='javascript:void(0);' onClick='if($(\"b2\").visible()) $(\"b2\").hide(); else $(\"b2\").show();'><b>"+lp[languageID]['before4']+"</b></a></h1></div></div><div id='b2' style='display:none;'><table id='tb3' cellpadding='3' border='0'><div style='clear:both;'></div>"+b2+"</table></div>";
                }

                if (b3) {
                    resSTR += "<div class='sports_tab2'><div class='tab_icon left'><img alt='b' src='/images/watch.gif' height='20' width='20' style='margin-top:1px;' /></div><div style='float:left;width:225px;border:0px solid red;'><h1 style='width:100%;'><a id='dn2' href='javascript:void(0);' onClick='if($(\"b3\").visible()) $(\"b3\").hide(); else $(\"b3\").show();'><b>"+lp[languageID]['before6']+"</b></a></h1></div></div><div id='b3' style='display:none;'><table id='tb3' cellpadding='3' border='0'><div style='clear:both;'></div>"+b3+"</table></div>";
                }

                resSTR += '</div>';

                $('games_near').innerHTML = resSTR;
                SetBlockVisibility();
            }
        }
    });
}

setDefaultClass1x2 = function()
{
    start = $('group_three');
    if(!start) return;
    allDiv = start.getElementsByTagName('div');

    for(var i = 0; i < allDiv.length; i++)
    {
        if(allDiv[i].id.substr(0, 2) == 'b_')
        {
            allDiv[i].className = '';

        }
    }
}

getTimeUntil = function(targetMS)
{
    var diff = 0;
    var today = new Date()
    if(UpDownTimer > 0)	diff = targetMS.valueOf() + today.valueOf() - startScript.valueOf()
    if(UpDownTimer < 0)	diff = targetMS.valueOf() - (today.valueOf() - startScript.valueOf())
    return Math.floor(diff)
}

getCountUp = function()
{
    var ms = getTimeUntil(targetDate)
    var output = ""
    var days, hrs, mins, secs
    if (ms >= 0) {
        days = Math.floor(ms/oneDay)
        ms -= oneDay * days
        hrs = Math.floor(ms/oneHour)
        ms -= oneHour * hrs
        mins = Math.floor(ms/oneMinute);
        ms -= oneMinute * mins
        secs = Math.floor(ms/1000)
        //if(days) output += days + ":"
        //if(hrs) output += hrs + ":"
        mins += hrs * 60;
        if(mins) {if(mins<10){mins='0'+mins;} output += mins + ":"} else {output += "00:"}
        if(secs<10){secs='0'+secs;} output += secs + ""
    } else {
        output += "00:00";//"Время ещё не началось."
    }
    return output
}

updateCountUp = function()
{
    clearTimeout(globTimerGame);
    if(stopTimer) {clearTimeout(globTimerGame); return;}
    var tGame = $('timeGame');
    if(tGame) tGame.innerHTML = getCountUp();
    globTimerGame = setTimeout("updateCountUp()", 1000);
}

// Обновить купон
getCuponUpdate = function() {
    if (startPut) return;

    // Сбрасываем таймеры обновления купона
    deleteCuponUpdateTimer();

    var param = new Array();
    var sLength = rData.length;
    var idBet = 0;
    var i = 0;
    var line = false;
    var live = false;

    for (var k = 0; k < sLength; k++) {
        if (rData[k].idGame) {
            if (rData[k].dopV != '')
                idBet = (rData[k].idBetG+"").substr((rData[k].idGame+""+rData[k].dopV).length);
            else
                idBet = (rData[k].idBetG+"").substr((rData[k].idGame+"").length);

            if (rData[k].dopV == null)
                rData[k].dopV = "0";

            if (typeof rData[k].PlayerId == 'undefined')
                rPId = 0;
            else
                rPId = rData[k].PlayerId;

            param[i] = '{"GameId":'+rData[k].idGame+',"Type":'+idBet+',"Coef":'+rData[k].koef+',"Param":'+rData[k].dopV+',"PlayerId":'+rPId+',"Kind":'+rData[k].Direction+'}';
            i++;

            if (rData[k].Direction == 1)
                live = true;
            if (rData[k].Direction == 3)
                line = true;
        }
    }

    if (param.length > 0 && live) {
        updateCoupon("/LiveUtil/UpdateCoupon", param, liveCuponTime/*, live*/);
        if ((typeof needUpdate == 'undefined' || needUpdate == null) && line)
            needUpdate = setInterval('needUpdateLine = true', lineCuponTime);
    } else if (param.length > 0 && line && !live) {
        updateCoupon("/LineUtil/UpdateCoupon", param, lineCuponTime/*, live*/);
    } else {
        draw_bets();
    }
}

// Обновляем данные купона
updateCoupon = function(url, param, time/*, common*/) {
    var postData = '{"Events":[' + param.join(',') + '],"NeedUpdateLine":' + needUpdateLine + ',"lng":"' + lng + '"}';
    /*if (common)
     postData = '{"zcoupon":' + postData + '}';*/

    new Ajax.Request(url, {
        requestHeaders: {"Access-Control-Allow-Headers": "Content-Type, X-Requested-With", "If-Modified-Since":"Sat, 1 Jan 2000 00:00:00 GMT", "Content-Type":"application/json"},
        parameters: postData,
        method: "post",
        onComplete: function(request) {
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                result = request.responseJSON;

                var succes = result.Success;

                if (!succes)
                    return;

                if (succes && result.Value !== null) {
                    // Ответный флаг для того чтобы отключить обновление при совместном купоне
                    var nUpdate = result.Value.NeedUpdateLine;

                    if (nUpdate) {
                        needUpdateLine = false;
                        clearInterval(needUpdate);
                        needUpdate = null;
                    }

                    var length = result.Value.Events.length;

                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            var extk = 0;

                            var koef = result.Value.Events[i].Coef;
                            koef = parseFloat(koef).toFixed(2);

                            var dopV = result.Value.Events[i].Param;

                            if (!dopV)
                                dopV = 0;
                            dopV = parseFloat(dopV);

                            var gameId = result.Value.Events[i].GameId;
                            var betId = result.Value.Events[i].Type;
                            var sobID = gameId + '' + dopV + '' + betId;

                            var block = result.Value.Events[i].Block;

                            var sLength = rData.length;
                            for (var k = 0; k < sLength; k++) {
                                if (rData[k].idGame && rData[k].idBetG == sobID) {
                                    if (!parseInt(koef)) {
                                        rData[k].block = 1;
                                        break;
                                    }

                                    if (block) {
                                        rData[k].block = 1;
                                        break;
                                    }

                                    rData[k].block = 0;

                                    r = koef - rData[k].koef;
                                    if (r > 0)
                                        rData[k].ex = 1;
                                    if (r < 0)
                                        rData[k].ex = -1;

                                    if(r)
                                        extk = 1;

                                    rData[k].koef = koef;

                                    if (parseFloat(rData[k].dopV) != parseFloat(dopV)) {
                                        rData[k].block = 1;
                                        rData[k].ex = 0;
                                    }

                                    break;
                                }
                            }
                        }

                        if (extk)
                            getMaxBet();

                        draw_bets();
                    }
                } else {
                    var error = result.Error;
                    alerts(lp[languageID]['message'], error);
                }
            }
        }
    });

    CuponTimer = setInterval('getCuponUpdate()', time);
}

deleteCuponUpdateTimer = function() {
    clearInterval(CuponTimer);
}

getStPozition = function(widthSt, leftSt, rightSt)
{
    var w = widthSt;
    var a = leftSt;
    var b = rightSt;

    var a0 = w / 2;
    var x;
    var y;

    if(!a && !b)
    {
        x = y = a0;
    } else {
        x = a0 * (((a - b) / (a + b)) + 1);
        y = w - x;
    }

    return [x, y];
}

getSobByGameId = function(id) {
    startUpdateSob = false;
    var span;
    var tickCount = 0;

    if (typeof To[2] !== 'undefined') {
        clearTimeout(To[2]);
        ct(2);
    }

    if (selectGame == null || startUpdateSob) {
        return;
    }

    id = id || selectGame || 0;
    //path = '/getData/live/GameData/'+id;
    path = '/LiveFeed/GetGame';

    try {
        clearTimeout(t);
        setDefaultClass();

        if (typeof To[2] !== 'undefined')
            clearTimeout(To[2]);

        To[2] = setTimeout("ct(2)", 6000);
        Aj[2] = new Ajax.Request(path, {
            requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
            parameters: "id=" + id + "&lng=" + lng,
            method: "get",
            onComplete: function(request) {
                clearTimeout(To[2]);
                startUpdateSob = false;

                if (request.status != 200) {
                    // alert("Server is unavailable. Try again later.");
                } else {
                    startUpdateSob = true;

                    result = request.responseText;
                    res = result.evalJSON();

                    idGameArray = new Array();

                    var MainGameId = parseInt(res.Value.MainGameId, 10) || 0;

                    var VI = VA = 0;
                    if (res.Value.VI != null) {
                        VI = res.Value.VI;
                    }

                    VA = res.Value.VA;
                    if (VA) {
                        var Oponent1 = res.Value.Opp1;
                        var Oponent2 = res.Value.Opp2;

                        globalName = Oponent1 + ' - ' + Oponent2;

                        if (MainGameId)
                            id = MainGameId;

                        if (VI != 0 && VA && wClose && (globalVI) != (VI+'?'+id)) {
                            playVideo(VI + '?' + id, globalName);
                            globalVI = VI + '?' + id;
                        }
                    }

                    var xErr = res.Value.Error;

                    if (xErr != null) {
                        $('shAll').innerHTML = '<div style="text-align:center; padding:10px 0; font-size:16px;">'+lp[languageID]['gameover']+'</div>';
                        $('games_content').show();
                        $('info_content').hide();
                        $('timeGame').hide();
                        $('gl2').hide();
                        $('gl3').hide();
                        startUpdateSob = false;
                        //getCuponUpdate();
                        return;
                    }

                    idSetNewClass = new Array();
                    idSetNewClassG = new Array();
                    idGroupAdd = new Array();
                    cur = 0;

                    clearTimeout(t);

                    var cp = res.Value.NameGame || '';
                    if (cp)
                        cp = '<div style="text-align:center;"><span style="color:#FFD400;background:#373737; padding:1px 3px 1px 3px;">' + lp[languageID]['bettingon'] + ' ' + cp + '</span></div>';

                    var GameStateStr = '';
                    if (res.Value.Scores != null) {
                        GameStateStr = res.Value.Scores.Info || '';
                        if (GameStateStr && GameStateStr != null)
                            GameStateStr = '<font style="background:#FFD400;color:#020301;">&nbsp;[ ' + GameStateStr + ' ]&nbsp;</font>';
                    }

                    $('games_content').innerHTML = content_template;

                    if (lastGameId != id) {
                        saveSkoef = new Array();
                        lastGameId = id;
                    }

                    $('one_ch').style.visibility = "visible";

                    if (GetCookie('one_click') == 'true') {
                        $('one_click').checked = true;
                        $('one_span').show();
                    } else {
                        $('one_click').checked = false;
                        $('one_span').hide();
                    }

                    var ok = 0;
                    var monitor = new Array();

                    if (monitor.indexOf(idSport) == -1)
                        ok = idSport;

                    $('topMon').style.background = "url(/images/monitor/monitor_"+ok+".jpg) no-repeat";
                    $('topMon').style.height = "134px";

                    var sportNameText = res.Value.SportName || '';
                    tmpsportNameText = sportNameText;

                    if (sportNameText.substr(-1) != '.' && sportNameText)
                        sportNameText += '.';

                    var numGame = res.Value.Num || '';

                    var champNameText = res.Value.Champ || '';

                    var Gamer1 = res.Value.Opp1 || '';
                    var Gamer2 = res.Value.Opp2 || '';

                    var GameVid = res.Value.GameVid || '';
                    if (GameVid)
                        GameVid = '(' + GameVid + ')';

                    var GameType = res.Value.GameType || '';
                    if (GameType)
                        GameType = '(' + GameType + ')';

                    dg = '';
                    if (Gamer2)
                        dg = '-';

                    if (tmpsportNameText == Gamer1 || champNameText == Gamer1)
                        gn = '';
                    else
                        gn = Gamer1;

                    $('sportNameText').innerHTML = numGame+". "+champNameText+". "+gn+dg+Gamer2+" "+GameVid+GameType+" <br/><b>"+cp+"</b>";
                    $('Gamer1').innerHTML = Gamer1;
                    $('Gamer2').innerHTML = Gamer2;
                    if (!Gamer2)
                        $('GamerR').hide();

                    $('iGame1').innerHTML = '';

                    var cop = '';
                    if (res.Value.Scores != null)
                        cop = res.Value.Scores.CourseOfPlay || '';
                    if (cop != '' && cop != null) {
                        if (cop.length > 1) {
                            var tmp = cop.split('|');
                            var iText = '';

                            for (var m = 0; m < tmp.length - 1; m++) {
                                iText += '<div style="border-bottom:1px dotted #ccc;margin:4px 0 4px 0;">'+tmp[m]+'</div>'
                            }

                            $('iGame2').innerHTML = iText;
                            $('isp').show();
                        }
                    }

                    var GameFinished = res.Value.Finished;
                    if (GameFinished == true) {
                        $('periodGame').innerHTML = lp[languageID]['gameover'];
                        $('timeGame').hide();
                        stopTimer = 1;
                    } else if (res.Value.Scores != null) {
                        var periodGame = res.Value.Scores.CurrPeriodStr || '';
                        $('periodGame').innerHTML = 'Идёт: ' + periodGame;
                    }

                    var tvChannel = res.Value.TvChannel || '';
                    if (tvChannel != '' && tvChannel != null)
                        $('sportNameText').innerHTML += '<div style="margin-top:5px; text-align:center; font-weight:bold;">' + lp[languageID]['LiveBroadcast'] + ': <span style="color:#FFD400; background:#373737; padding:1px 3px;">'+ tvChannel +'</span></div>';

                    var curTimeGame = 0;
                    if (res.Value.Scores != null)
                        curTimeGame = res.Value.Scores.TimeSec || 0; // Время игры
                    UpDownTimer = new Date((parseFloat(curTimeGame)) * 1000);
                    cTGH = UpDownTimer.getUTCHours() || 0;
                    cTGMin = UpDownTimer.getUTCMinutes() || 0;
                    cTGS = UpDownTimer.getUTCSeconds() || 0;

                    if (cTGH!=0 || cTGMin!=0 || cTGS!=0) $('timeGame').show();

                    if (cTGH==0 && cTGMin==0 && cTGS==0) {
                        $('timeGame').hide();
                        pG = $('periodGame').innerHTML;
                        $('periodGame').innerHTML = pG.substr(0, pG.length);
                    }

                    if (!periodGame && cTGH==0 && cTGMin==0 && cTGS==0)
                        $('gl1').hide();
                    else
                        $('gl1').show();

                    // Запустить таймер или остановить
                    if (res.Value.Scores != null)
                        var startTimer = res.Value.Scores.TimeRun;
                    if (startTimer) {
                        stopTimer = 0;
                        targetDate = Date.UTC(1970, 0, 1, cTGH, cTGMin, cTGS, 0);
                        startScript = new Date();
                        updateCountUp();
                    } else {
                        stopTimer = 1;
                        clearTimeout(globTimerGame);
                        startScript = new Date();
                        targetDate = Date.UTC(1970, 0, 1, cTGH, cTGMin, cTGS, 0);
                        var tGame = $('timeGame');
                        if (tGame)
                            tGame.innerHTML = getCountUp();
                    }

                    var scoreGameOne = '0';
                    var scoreGameTwo = '0';
                    if (res.Value.Scores != null) {
                        scoreGameOne = res.Value.Scores.FullScore.Sc1.toString() || '';
                        scoreGameTwo = res.Value.Scores.FullScore.Sc2.toString() || '';
                    }

                    var scoreGame = '';
                    if (scoreGameOne && scoreGameTwo) {
                        scoreGame =  scoreGameOne + '-' + scoreGameTwo;
                        $('gl2').innerHTML = scoreGame;
                    }

                    var tmpScore = new Array();
                    tmpScore[0] = '';
                    tmpScore[1] = '';

                    if (scoreGame.length)
                        tmpScore = scoreGame.split('-');

                    var PSLength = 0;
                    if (res.Value.Scores != null)
                        PSLength = res.Value.Scores.PeriodScores.length;
                    var scoreGame2 = '';
                    for (var x = 0; x < PSLength; x++) {
                        scoreGame2 += res.Value.Scores.PeriodScores[x].Value.Sc1 + '-' + res.Value.Scores.PeriodScores[x].Value.Sc2;
                        if (x < PSLength-1)
                            scoreGame2 +=', ';
                    }

                    var tName = res.Value.PeriodName || '';
                    var tP = '';
                    if (res.Value.Scores != null)
                        tP = res.Value.Scores.Podacha;

                    var tSS1 = '';
                    var tSS2 = '';
                    if (res.Value.Scores != null && res.Value.Scores.SubScore != null){
                        tSS1 = res.Value.Scores.SubScore.Sc1 || '0';
                        tSS2 = res.Value.Scores.SubScore.Sc2 || '0';
                    }

                    var sportId = res.Value.SportId || '';

                    if (!scoreGame && !scoreGame2)
                        $('gl2').hide();

                    var sT = new Array();
                    if (sT.indexOf(idSport) != -1)
                        scoreGame2 = '';

                    if (1==1 || scoreGame2.length) {
                        $('gl2').hide();
                        $('gl3').hide();

                        tP = parseInt(tP, 10);

                        var pU1 = '';
                        var pU2 = '';
                        var pathIMG = "<img style='padding-left:15px;' width='10px' src='/images/ico_game/" + idSport + ".png'>";

                        if (tP == 1)
                            pU1 = pathIMG;
                        if (tP == 2)
                            pU2 = pathIMG;

                        var torn = parseInt(res.Value.IsTourn, 10);
                        if (torn == 1) {
                            var str1 = '<tr id="mc1" class="mc1t"><td align="center">'+GameStateStr+'</td>';
                            var str2 = '<tr id="mc1"><td>&nbsp;' + $('Gamer1').innerHTML + '&nbsp;</td>';
                            var str3 = '<tr><td>&nbsp;&nbsp;' + $('Gamer2').innerHTML + '</td>';
                        } else {
                            var str1 = '<tr id="mc1" class="mc1t"><td align="center">'+GameStateStr+'</td><td>&nbsp;</td><td>&nbsp;</td><td>'+lp[languageID]['score']+'</td>';
                            var str2 = '<tr id="mc1"><td>&nbsp;&nbsp;' + $('Gamer1').innerHTML + '</td><td>' + pU1 + '</td><td>' + tSS1 + '</td><td>'+tmpScore[0]+'</td>';
                            var str3 = '<tr><td>&nbsp;&nbsp;' + $('Gamer2').innerHTML + '</td><td>' + pU2 + '</td><td>' + tSS2 + '</td><td>'+tmpScore[1]+'</td>';
                        }

                        if (idSport == 5)
                            tName = lp[languageID]['inning'];

                        var allPeriodsScoresLength = 0;
                        if (res.Value.Scores)
                            allPeriodsScoresLength = res.Value.Scores.PeriodScores.length || 0;

                        if (allPeriodsScoresLength) {
                            for (var i = 0; i < allPeriodsScoresLength; i++) {
                                var key = parseInt(res.Value.Scores.PeriodScores[i].Key, 10);

                                if (key < 10) {
                                    // Названия
                                    if ((idSport == 3 && key == 5) || (idSport == 2 && key == 4)) {
                                        tName = lp[languageID]['overtime'];
                                        str1 += '<td id="mc2" style="width:40px;">' + tName + '</td>';
                                    } else if (idSport == 2 && key == 5) {
                                        tName = lp[languageID]['bullet'];
                                        str1 += '<td id="mc2" style="width:40px;">' + tName + '</td>';
                                    } else if (idSport == 66 || (idSport == 30 && allPeriodsScoresLength > 5 && i < allPeriodsScoresLength - 5)) {
                                        continue;
                                    } else
                                        str1 += '<td id="mc2">' + (key) + ' ' + tName + '</td>';

                                    var scor1 = res.Value.Scores.PeriodScores[i].Value.Sc1;
                                    var scor2 = res.Value.Scores.PeriodScores[i].Value.Sc2;

                                    // Счет по периодам
                                    if (idSport != 66 && idSport != 30) {
                                        str2 += '<td id="mc2">' + scor1 + '</td>';
                                        str3 += '<td id="mc2">' + scor2 + '</td>';
                                    } else if (idSport == 30 && allPeriodsScoresLength > 5 && i >= allPeriodsScoresLength - 5) {
                                        str2 += '<td id="mc2">' + scor1 + '</td>';
                                        str3 += '<td id="mc2">' + scor2 + '</td>';
                                    } else if (idSport == 30 && allPeriodsScoresLength <= 5) {
                                        str2 += '<td id="mc2">' + scor1 + '</td>';
                                        str3 += '<td id="mc2">' + scor2 + '</td>';
                                    }
                                }
                            }
                        }

                        var Statistic = '';
                        if (res.Value.Scores != null)
                            Statistic = res.Value.Scores.Statistic || '';
                        if (Statistic != '' && Statistic != null) {
                            var ICorner1 = Statistic[0].Value || '';
                            var ICorner2 = Statistic[1].Value || '';
                            var IYellowCard1 = Statistic[2].Value || '';
                            var IYellowCard2 = Statistic[3].Value || '';
                            var IRedCard1 = Statistic[4].Value || '';
                            var IRedCard2 = Statistic[5].Value || '';
                            var IPenalty1 = Statistic[6].Value || '';
                            var IPenalty2 = Statistic[7].Value || '';
                            var ISub1 = parseInt(Statistic[8].Value, 10) || 0; // количество замен
                            var ISub2 = parseInt(Statistic[9].Value, 10) || 0;
                            var ShotsOn1 = parseInt(Statistic[10].Value, 10) || 0;
                            var ShotsOn2 = parseInt(Statistic[11].Value, 10) || 0;
                            var ShotsOff1 = parseInt(Statistic[12].Value, 10) || 0;
                            var ShotsOff2 = parseInt(Statistic[13].Value, 10) || 0;
                            var Attacks1 = parseInt(Statistic[14].Value, 10) || 0; // число атак
                            var Attacks2 = parseInt(Statistic[15].Value, 10) || 0;
                            var DanAttacks1 = parseInt(Statistic[16].Value, 10) || 0; // число опасных атак
                            var DanAttacks2 = parseInt(Statistic[17].Value, 10) || 0;

                            str1 += '<td id="mc2"><img src="/images/Corner.png" style="width:18px" title="'+lp[languageID]['corner']+'"></td><td><img src="/images/YellowCard.png" style="width:18px" title="'+lp[languageID]['yellowcard']+'"></td><td><img src="/images/RedCard.png" style="width:18px" title="'+lp[languageID]['redcard']+'"></td><td><img src="/images/Penalty.png" style="width:18px" title="'+lp[languageID]['penalty']+'"></td>';
                            str2 += "<td id='mc2'>"+ICorner1+"</td><td>"+IYellowCard1+"</td><td>"+IRedCard1+"</td><td>"+IPenalty1+"</td>";
                            str3 += "<td id='mc2'>"+ICorner2+"</td><td>"+IYellowCard2+"</td><td>"+IRedCard2+"</td><td>"+IPenalty2+"</td>";

                            iG1 = '';
                            var ISub = getStPozition(400, ISub1, ISub2);
                            iG1 += '<table width=80% align=center><tr><td>'+ISub1+'</td><td align=center>'+lp[languageID]['numOfSubstitutions']+'</td><td align=right>'+ISub2+'</td></tr><tr><td colspan=3><div style="float:left;background:#003300;height:3px;width:'+ISub[0]+'px;"></div><div style="float:right;background:#ff0000;height:3px;width:'+ISub[1]+'px;"></div></td></tr>';
                            var ShotsOn = getStPozition(400, ShotsOn1, ShotsOn2);
                            iG1 += '<tr><td>'+ShotsOn1+'</td><td align=center>'+lp[languageID]['shotsOnGoal']+'</td><td align=right>'+ShotsOn2+'</td></tr><tr><td colspan=3><div style="float:left;background:#003300;height:3px;width:'+ShotsOn[0]+'px;"></div><div style="float:right;background:#ff0000;height:3px;width:'+ShotsOn[1]+'px;"></div></td></tr>';
                            var ShotsOff = getStPozition(400, ShotsOff1, ShotsOff2);
                            iG1 += '<tr><td>'+ShotsOff1+'</td><td align=center>'+lp[languageID]['attemptsOffTarget']+'</td><td align=right>'+ShotsOff2+'</td></tr><tr><td colspan=3><div style="float:left;background:#003300;height:3px;width:'+ShotsOff[0]+'px;"></div><div style="float:right;background:#ff0000;height:3px;width:'+ShotsOff[1]+'px;"></div></td></tr>';
                            var Attacks = getStPozition(400, Attacks1, Attacks2);
                            iG1 += '<tr><td>'+Attacks1+'</td><td align=center>'+lp[languageID]['numOfAttacks']+'</td><td align=right>'+Attacks2+'</td></tr><tr><td colspan=3><div style="float:left;background:#003300;height:3px;width:'+Attacks[0]+'px;"></div><div style="float:right;background:#ff0000;height:3px;width:'+Attacks[1]+'px;"></div></td></tr>';
                            var DanAttacks = getStPozition(400, DanAttacks1, DanAttacks2);
                            iG1 += '<tr><td>'+DanAttacks1+'</td><td align=center>'+lp[languageID]['numOfDangerousAttacks']+'</td><td align=right>'+DanAttacks2+'</td></tr><tr><td colspan=3><div style="float:left;background:#003300;height:3px;width:'+DanAttacks[0]+'px;"></div><div style="float:right;background:#ff0000;height:3px;width:'+DanAttacks[1]+'px;"></div></td></tr></table>';

                            $('iGame1').innerHTML = '<div>' + iG1 + '</div>';

                        }

                        str1 += "</tr>";
                        str2 += "</tr>";
                        str3 += "</tr>";

                        $('gl4').innerHTML = "<table cellspacing=0 cellpadding='2' class='mc mct mcts'>" + str1 + str2 + str3 + "</table>";
                    }

                    if (torn == 1) {
                        tmp_name = '';
                        resText1 = '';
                        resText17 = '';
                        resText26 = '';
                        resText385 = '';
                        fl1 = 1;
                        fl17 = 1;
                        fl26 = 1;
                        fl385 = 1;

                        var table = res.Value.Events;
                        tickCount = 0;

                        for (var i = 0; i < table.length; i++) {
                            groupID = parseInt(table[i].G, 10) || 0;
                            gameID = parseInt(table[i].GameId, 10) || 0;

                            var imgSrc = "/images/marketAdd.gif";
                            var imgTitle = "Добавить в 'Мои рынки'";

                            for (var iba = 0; iba < betArray.length; iba++) {
                                if (betArray[iba].substring(6) == groupID) {
                                    imgSrc = '/images/marketRemove.gif';
                                    imgTitle = 'Удалить из моих рынков';
                                    break;
                                }
                            }

                            var onClickStr = 'onPlusClick(' + gameID  +', this, \'' + imgSrc.substring(8,17) + '\')';

                            if (groupID == 1 && fl1) {
                                if (imgSrc == '/images/marketRemove.gif') tickCount++;

                                resText1 += '<div id="n_"><a class="shG">Кто выше</a><span id="plusButton"><a href="javascript:void(0)" id="addGroup1" onclick="' + onClickStr + '"><img src=' + imgSrc + ' title="Добавить в мои рынки"></a></span></div><div><table id="tb">';
                                fl1 = 0;
                            }

                            if (groupID == 17 && fl17) {
                                if (imgSrc == '/images/marketRemove.gif') tickCount++;

                                resText17 += '<div id="n_"><a class="shG">' + lp[languageID]['total'] + '</a><span id="plusButton"><a href="javascript:void(0)" id="addGroup17" onclick="' + onClickStr + '"><img src="' + imgSrc + '" title="Добавить в мои рынки"></a></span></div><div><table id="tb">';
                                fl17 = 0;
                            }

                            if (groupID == 26 && fl26) {
                                if (imgSrc == '/images/marketRemove.gif') tickCount++;

                                resText26 += '<div id="n_"><a class="shG">' + lp[languageID]['winner'] + '</a><span id="plusButton"><a href="javascript:void(0)" id="addGroup26" onclick="' + onClickStr + '"><img src="' + imgSrc + '" title="Добавить в мои рынки"></a></span></div><div><table id="tb">';
                                fl26 = 0;
                            }

                            if (groupID == 385 && fl385) {
                                if (imgSrc == '/images/marketRemove.gif') tickCount++;

                                resText385 += '<div id="n_"><a class="shG">' + lp[languageID]['willBe'].replace('()', parseFloat(table[i].P)) + '</a><span id="plusButton"><a href="javascript:void(0)" id="addGroup385" onclick="' + onClickStr + '"><img src="' + imgSrc + '" title="Добавить в мои рынки"></a></span></div><div><table id="tb">';
                                fl385 = 0;
                            }

                            switch(groupID) {
                                case 1:
                                    opp1 = table[i].Opp1 || '';
                                    opp2 = table[i].Opp2 || '';
                                    name =  opp1 + ' - ' + opp2 || '';
                                    gameID = parseInt(table[i].GameId, 10) || 0;
                                    betID = parseInt(table[i].T, 10) || 0;

                                    if (name != tmp_name && tmp_name != '')
                                        resText1 += '</tr>';

                                    if (name != tmp_name)
                                        resText1 += '<tr><td colspan="2" style="padding: 3px 6px; font-weight: bold;">' + name + '</td></tr><tr>';

                                    var who = opp1;
                                    if (name == tmp_name)
                                        who = opp2;

                                    tmp_name = name;

                                    dopValue = table[i].P;
                                    if (dopValue)
                                        parseDopValue = parseFloat(dopValue);
                                    else
                                        parseDopValue = 0;

                                    sobID = gameID+''+parseDopValue+''+betID;

                                    if (!dopValue)
                                        dopValue = 0;

                                    dopValue = parseFloat(dopValue);

                                    koef = parseFloat(table[i].C).toFixed(2);
                                    blockSob = table[i].B;

                                    idGameArray.push(gameID);

                                    style = '';
                                    if (blockSob) {
                                        style = 'style="text-decoration: line-through;"';
                                    }

                                    idSetNewClass[cur] = betID;
                                    idSetNewClassG[cur] = groupID;
                                    cur++;

                                    resText1 += '<td><div id="s_" style="display: block;"><div id="z_" ' + style + '>' + who + '</div><a><div id="b_' + betID + '"'
                                        + 'bl="' + blockSob + '" u="' + gameID + '" v="' + sobID + '" g="' + groupID + '" ' + style + '>' + koef + '</div></a></div></td>';
                                    break;

                                case 17:
                                    opp1 = table[i].Opp1 || '';
                                    opp2 = table[i].Opp2 || '';

                                    name = opp1;
                                    if (opp2 !='')
                                        name =  opp1 + ' - ' + opp2 || '';

                                    gameID = parseInt(table[i].GameId, 10) || 0;
                                    betID = parseInt(table[i].T, 10) || 0;

                                    resText17 += '<tr><td colspan="2" style="padding: 3px 6px; font-weight: bold;">' + name + '</td></tr><tr>';

                                    dopValue = table[i].P;
                                    if (dopValue)
                                        parseDopValue = parseFloat(dopValue);
                                    else
                                        parseDopValue = 0;

                                    sobID = gameID+''+parseDopValue+''+betID;

                                    if (!dopValue)
                                        dopValue = 0;

                                    dopValue = parseFloat(dopValue);

                                    koef = parseFloat(table[i].C).toFixed(2);
                                    blockSob = table[i].B;

                                    idGameArray.push(gameID);

                                    var dV = dopValue;

                                    if (betID == 9)
                                        dopValue = 'Тотал (' + dopValue + ') Б';
                                    if (betID == 10)
                                        dopValue = 'Тотал (' + dopValue + ') М';

                                    style = '';
                                    if (blockSob) {
                                        style = 'style="text-decoration: line-through;"';
                                    }

                                    idSetNewClass[cur] = betID;
                                    idSetNewClassG[cur] = groupID;
                                    cur++;

                                    resText17 += '<td><div id="s_" style="display: block;"><div id="z_" ' + style + '>' + dopValue + '</div><a><div id="b_' + betID + '"'
                                        + 'bl="' + blockSob + '" u="' + gameID + '" d="' + dV + '" v="' + sobID + '" g="' + groupID + '" ' + style + '>' + koef + '</div></a></div></td></tr>';
                                    break;

                                case 26:
                                    name =  table[i].Opp1 || '';
                                    gameID = parseInt(table[i].GameId, 10) || 0;
                                    betID = parseInt(table[i].T, 10) || 0;

                                    dopValue = table[i].P;
                                    if (dopValue)
                                        parseDopValue = parseFloat(dopValue);
                                    else
                                        parseDopValue = 0;

                                    sobID = gameID+''+parseDopValue+''+betID;

                                    if (!dopValue)
                                        dopValue = 0;

                                    dopValue = parseFloat(dopValue);

                                    koef = parseFloat(table[i].C).toFixed(2);
                                    blockSob = table[i].B;

                                    idGameArray.push(gameID);

                                    style = '';
                                    if (blockSob) {
                                        style = 'style="text-decoration: line-through;"';
                                    }

                                    idSetNewClass[cur] = betID;
                                    idSetNewClassG[cur] = groupID;
                                    cur++;

                                    resText26 += '<tr><td><div id="s_" style="display: block;"><div id="z_" ' + style + '>' + name + '</div><a><div id="b_' + betID + '"'
                                        + 'bl="' + blockSob + '" u="' + gameID + '" v="' + sobID + '" g="' + groupID + '" ' + style + '>' + koef + '</div></a></div></td></tr>';
                                    break;

                                case 385:
                                    name =  table[i].Opp1 || '';
                                    gameID = parseInt(table[i].GameId, 10) || 0;
                                    betID = parseInt(table[i].T, 10) || 0;

                                    dopValue = table[i].P;
                                    if (dopValue)
                                        parseDopValue = parseFloat(dopValue);
                                    else
                                        parseDopValue = 0;

                                    sobID = gameID+''+parseDopValue+''+betID;

                                    if (!dopValue)
                                        dopValue = 0;

                                    dopValue = parseFloat(dopValue);

                                    koef = parseFloat(table[i].C).toFixed(2);
                                    blockSob = table[i].B;

                                    idGameArray.push(gameID);

                                    style = '';
                                    if (blockSob) {
                                        style = 'style="text-decoration: line-through;"';
                                    }

                                    idSetNewClass[cur] = betID;
                                    idSetNewClassG[cur] = groupID;
                                    cur++;

                                    resText385 += '<tr><td><div id="s_" style="display: block;"><div id="z_" ' + style + '>' + name + '</div><a><div id="b_' + betID + '"'
                                        + 'bl="' + blockSob + '" u="' + gameID + '" v="' + sobID + '" g="' + groupID + '" d="' + dopValue + '" ' + style + '>' + koef + '</div></a></div></td></tr>';
                                    break;

                                default:
                                    break;
                            }
                        }

                        if (!shMyBetsFlag) {
                            document.getElementById('allMarkets').addClassName('active');
                            document.getElementById('myMarDiv').removeClassName('active');
                        } else {
                            document.getElementById('myMarDiv').addClassName('active');
                            document.getElementById('allMarkets').removeClassName('active');
                        }

                        var empty = true;
                        if (resText1.length) {
                            resText1 += "</table></div>";

                            if (shMyBetsFlag) {
                                var flag = false;
                                for (var iba = 0; iba < betArray.length; iba++){
                                    if (betArray[iba].substring(6) == 1 && !flag){
                                        empty = false;
                                        $('group_1').innerHTML = resText1;
                                        $('group_1').show();
                                        $('shAll').hide();
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    $('group_1').innerHTML = resText1;
                                    $('group_1').hide();
                                    $('shAll').hide();
                                }
                            } else {
                                empty = false;
                                $('group_1').innerHTML = resText1;
                                $('group_1').show();
                                $('shAll').hide();
                            }
                        }

                        if (resText17.length) {
                            resText17 += "</table></div>";

                            if (shMyBetsFlag) {
                                var flag = false;
                                for (var iba = 0; iba < betArray.length; iba++){
                                    if (betArray[iba].substring(6) == 17 && !flag){
                                        empty = false;
                                        $('group_17').innerHTML = resText17;
                                        $('group_17').show();
                                        $('shAll').hide();
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    $('group_17').innerHTML = resText17;
                                    $('group_17').hide();
                                    $('shAll').hide();
                                }
                            } else {
                                empty = false;
                                $('group_17').innerHTML = resText17;
                                $('group_17').show();
                                $('shAll').hide();
                            }
                        }

                        if (resText26.length) {
                            resText26 += "</table></div>";

                            if (shMyBetsFlag) {
                                var flag = false;
                                for (var iba = 0; iba < betArray.length; iba++){
                                    if (betArray[iba].substring(6) == 26 && !flag){
                                        empty = false;
                                        $('group_26').innerHTML = resText26;
                                        $('group_26').show();
                                        $('shAll').hide();
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    $('group_26').innerHTML = resText26;
                                    $('group_26').hide();
                                    $('shAll').hide();
                                }
                            } else {
                                empty = false;
                                $('group_26').innerHTML = resText26;
                                $('group_26').show();
                                $('shAll').hide();
                            }
                        }

                        if (resText385.length) {
                            resText385 += "</table></div>";

                            if (shMyBetsFlag) {
                                var flag = false;
                                for (var iba = 0; iba < betArray.length; iba++){
                                    if (betArray[iba].substring(6) == 385 && !flag){
                                        empty = false;
                                        $('group_385').innerHTML = resText385;
                                        $('group_385').show();
                                        $('shAll').hide();
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    $('group_385').innerHTML = resText385;
                                    $('group_385').hide();
                                    $('shAll').hide();
                                }
                            } else {
                                empty = false;
                                $('group_385').innerHTML = resText385;
                                $('group_385').show();
                                $('shAll').hide();
                            }
                        }

                        document.getElementById("tickCount").innerHTML = "("+tickCount+")";
                        if (empty) showAllMarkets();

                        $('info_content').hide();
                        $('games_content').show();
                        startUpdateSob = false;
                        return;
                    }

                    if (GameFinished == true) {
                        $('shAll').innerHTML = '<div style="text-align:center; padding:10px 0; font-size:16px;">'+lp[languageID]['gameover']+'</div>';
                        $('games_content').show();
                        $('info_content').hide();
                        return;
                    }

                    var events = res.Value.Events;
                    var eventsLength = res.Value.Events.length;
                    var kolInG = new Array();

                    var b388 = 0;
                    var b389 = 0;
                    var b390 = 0;
                    var betID_old = 0;
                    var PlayerId = 0;

                    $('kolSob').innerHTML = ' | ' + lp[languageID]['numEvents'] + ': ' + eventsLength;

                    for (var i = 0; i < eventsLength; i++) {
                        if (events[i].G == '') continue;
                        PlayerId = 0;
                        gameID = res.Value.Id;
                        groupID = events[i].G;
                        betID = events[i].T;
                        blockSob = events[i].B;

                        // Подсветка max коэффициентов
                        maxCoeff = parseInt(events[i].I, 10) || 0;

                        dopValue = events[i].P;
                        if (dopValue)
                            parseDopValue = parseFloat(dopValue);
                        else
                            parseDopValue = 0;

                        sobID = gameID+''+parseDopValue+''+betID;

                        if (!dopValue)
                            dopValue = 0;
                        dV = parseFloat(dopValue);

                        koef = parseFloat(events[i].C).toFixed(2);

                        if (typeof kolInG[groupID] == 'undefined')
                            kolInG[groupID] = 0;

                        kolInG[groupID]++;

                        if (!$('b_'+betID) || !$('group_'+groupID)) {
                            set_err('b_'+betID+' : group_'+groupID);
                            continue;
                        }

                        curTD = $('b_'+betID).parentNode.parentNode.parentNode;
                        curName = $('b_'+betID).parentNode.parentNode.firstChild.innerHTML;
                        //newID = betID+"_"+dopValue+"_"+koef;
                        newID = betID+"_"+dopValue;
                        var elem = "<div id='s_' style='display:block; color:#333333'><div id='z_'>"+curName+"</div><a><div id='b_"+newID+"'>0</div></a></div>";//метка
                        Element.insert(curTD, {bottom: elem});

                        betID_old = betID;
                        betID = newID;

                        if (events[i].Pl != null) {
                            var idPl = events[i].Pl.Id || 0;
                            PlayerId = parseInt(idPl, 10);
                        }

                        ppp = $('b_'+betID).parentNode.parentNode.firstChild;
                        p = $('b_'+betID).parentNode.parentNode;

                        if (GameType == lp[languageID]['corner']) { // 'Угловые'
                            if (groupID == 31) {
                                $("group_" + groupID).childNodes[0].innerHTML = lp[languageID]['lastCorner'];
                            }
                        }

                        if (dopValue) {
                            z = $('b_'+betID).parentNode.previous();
                            txt = z.childNodes[0].nodeValue;
                            parentGroupName = jQuery('#b_' + betID).closest('#tb').parent().prev().find('.shG');

                            dopValue = parseFloat(dopValue);

                            notPlus = new Array(0,3,6,10,12,13,15,17,20,21,22,23,24,27,28,29,30,33,34,57,60,69,87,88,89,95,96,102,104,105,106,110,113,114,124,125,127,129,130,135,136,137,138,139,141,148,150,152,154,168,172,174,176,182,345,347,381,387,389,391,405,413);
                            if (notPlus.indexOf(parseInt(groupID)) == -1)
                                if (dopValue > 0)
                                    dopValue = "+" + parseFloat(dopValue);
                                else
                                    dopValue = parseFloat(dopValue);

                            groupID = parseInt(groupID, 10);
                            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            if (GameType == lp[languageID]['cards']) { // 'Карточки'
                                if (groupID == 20) {
                                    $("group_" + groupID).childNodes[0].innerHTML = lp[languageID]['nextcard'];
                                    if (betID_old == 388)
                                        txt = "() "+lp[languageID]['card']+" 1";
                                    if (betID_old == 390)
                                        txt = "() " + lp[languageID]['not'];
                                    if (betID_old == 389)
                                        txt = "() "+lp[languageID]['card']+" 2";
                                }
                                if (groupID == 96) {
                                    $("group_" + groupID).childNodes[0].innerHTML = lp[languageID]['cardUpToMinute'];
                                    if (betID_old == 812)
                                        txt = "Карточка номер () будет до () минуты - Да";
                                    if (betID_old == 813)
                                        txt = "Карточка номер () будет до () минуты - Нет";
                                }
                            }

                            if (GameType == lp[languageID]['corner']) {
                                if (groupID == 20) {
                                    $("group_" + groupID).childNodes[0].innerHTML = "Следующий угловой";
                                    if (betID_old == 388)
                                        txt = "() угловой 1";
                                    if (betID_old == 390)
                                        txt = "() не будет";
                                    if (betID_old == 389)
                                        txt = "() угловой 2";
                                }
                                if (groupID == 96) {
                                    $("group_" + groupID).childNodes[0].innerHTML = "Угловой до минуты";
                                    if (betID_old == 812)
                                        txt = "Угловой номер () будет до () минуты - Да";
                                    if (betID_old == 813)
                                        txt = "Угловой номер () будет до () минуты - Нет";
                                }
                            }
                            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            if (groupID == 124 && betID_old == 735) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                if (c0 > c1) {
                                    var num = 2;
                                    dopValue = '[' + c1 + ']';
                                } else {
                                    var num = 1;
                                    dopValue = '[' + c0 + ']';
                                }
                                txt = txt.replace("()", num).replace("[]", dopValue);
                            }

                            if (groupID == 405) {
                                var textType = '';

                                // Керлинг
                                if (idSport = 46) {
                                    textType = ' эндов';
                                }

                                // Снукер
                                if (idSport == 30) {
                                    textType = ' фреймов';
                                }

                                if (parentGroupName.length) {
                                    var gName = jQuery(parentGroupName).text();

                                    if (gName.indexOf(textType) == -1) {
                                        jQuery(parentGroupName).text(gName + textType);
                                    }
                                }

                                var c0 = parseInt(dopValue);
                                txt = txt.replace("()", '(' + dopValue + ')' + textType);
                            }

                            if (groupID == 106 && betID_old == 825) {
                                var textType = ' по буллитам';

                                if (idSport == 1)
                                    textType = ' в серии пенальти';

                                var c0 = parseInt(dopValue);
                                txt = txt.replace("()", '(' + c0 + ')' + textType);
                            }

                            if (groupID == 124 && betID_old == 737 ) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                if (c0 > c1) {
                                    var num = 1;
                                    dopValue = '[' + c1 + ':' + c1 + ']';
                                } else {
                                    var num = 2;
                                    dopValue = '[' + c0 + ':' + c0 + ']';
                                }
                                txt = txt.replace("()", num);
                                txt = txt.replace("[]", dopValue);
                            }

                            if (groupID == 136) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                dopValue = c0 + '-' + c1;
                                txt = txt.replace("()", dopValue);
                            }

                            if (groupID == 139 && betID_old == 880) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                if (c0 > c1 && c0 != 999) {
                                    var num = 1;
                                    dopValue = lp[languageID]['withscore'] + ' (' + c0 + ':' + c1 + ')';
                                }
                                if (c0 < c1 && c1 != 999) {
                                    var num = 2;
                                    dopValue = lp[languageID]['withscore'] + ' (' + c0 + ':' + c1 + ')';
                                }
                                if (c0 > c1 && c0 == 999) {
                                    var num = 1;
                                    dopValue = lp[languageID]['anotherscore'];
                                }
                                if (c0 < c1 && c1 == 999) {
                                    var num = 2;
                                    dopValue = lp[languageID]['anotherscore'];
                                }
                                txt = txt.replace("()", num);
                                txt = txt.replace("[]", dopValue);
                            }

                            if (groupID == 20) {
                                if (txt.indexOf('()') == -1)
                                    txt = txt.replace("()", '('+dopValue+')');
                            }

                            if (groupID == 27) {
                                if (Math.abs(dopValue) != dopValue)
                                    dopValue = '0:' + Math.abs(dopValue);
                                else
                                    dopValue = Math.abs(dopValue) + ':0';

                                txt = txt.replace("()", '('+dopValue+')');
                            }

                            if (groupID == 28 || groupID == 29 || groupID == 30 || groupID == 69 || groupID == 87 || groupID == 88 || groupID == 89 || groupID == 103 || groupID == 108 || groupID == 110 || groupID == 130) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                if (groupID == 103) {
                                    c0 += ':00';
                                    c1 += ':59';
                                }
                                if (c0 < c1)
                                    dopValue = lp[languageID]['from'] + ' ' + c0 + ' ' + lp[languageID]['to'] + ' ' + c1;
                                if (c0 == c1)
                                    dopValue = c0;
                                if (c1 > 900)
                                    dopValue = lp[languageID]['from'] + ' ' + c0 + ' ' + lp[languageID]['andmore'];

                                if ((idSport == 3 || idSport == 10) && groupID == 69)
                                    txt = txt.replace("()", '('+dopValue+') ' + lp[languageID]['point']);
                                else if (idSport == 1 && (groupID == 29 || groupID == 30)) {
                                    if (jQuery("#group_" + groupID).length && groupID == 29)
                                        jQuery("#group_" + groupID).children().first().html('Инд. тотал 1 (точное количество голов)');
                                    else if(jQuery("#group_" + groupID).length && groupID ==30)
                                        jQuery("#group_" + groupID).children().first().html('Инд. тотал 2 (точное количество голов)');

                                    txt = dopValue + ' ' + lp[languageID]['goal'];
                                } else
                                    txt = txt.replace("()", '('+dopValue+')');
                            }

                            if (groupID == 148 || groupID == 152 || groupID == 345) {
                                var c0, c1, c2;
                                c0 = parseInt(dopValue);
                                c1 = c2 = Math.round((dopValue - c0) * 1000);
                                c0 = c0 / 100;
                                c1 += ':00';
                                var addTime = 4;
                                if (betID_old == 892 || betID_old == 893 || betID_old == 1262 || betID_old == 1263 || betID_old == 1268 || betID_old == 1269 || betID_old == 1282 || betID_old == 1283 || betID_old == 1288 || betID_old == 1289 || betID_old == 1298 || betID_old == 1299) addTime = 9;
                                if (betID_old == 894 || betID_old == 895 || betID_old == 898 || betID_old == 899 || betID_old == 1264 || betID_old == 1265 || betID_old == 1270 || betID_old == 1271 || betID_old == 1284 || betID_old == 1285 || betID_old == 1290 || betID_old == 1291) addTime = 14;
                                if (betID_old == 896 || betID_old == 897 || betID_old == 1266 || betID_old == 1267 || betID_old == 1280 || betID_old == 1281 || betID_old == 1286 || betID_old == 1287) addTime = 1;
                                var plus = '', totalTime = c2 + addTime;
                                if ((totalTime == 44 || totalTime == 89) && sportId == 1) plus = '+';
                                c2 = totalTime + ':59' + plus;
                                txt = txt.replace("()", "(" + c0 + ")").replace("()", c1).replace("()", c2);
                            }

                            // Победа в интервале, Забьёт в промежутке
                            if (groupID == 347 || groupID == 381) {
                                var c0, c1;
                                c0 = parseInt(dopValue);
                                c1 = Math.round((dopValue - c0) * 1000);
                                c0 += ':00';
                                c1 += ':59';
                                txt = txt.replace("()", c0).replace("()", c1);
                            }

                            // Индивидуальный тотал серий, тотал серий
                            if (groupID == 391 || groupID == 413) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);

                                if (c0 == c1 && c1 != 999)
                                    dopValue = '(' + c0 + ')';

                                if (c0 != c1 && c1 != 999)
                                    dopValue = 'c (' + c0 + ') до (' + c1 + ')';

                                if (c0 != c1 && c1 == 999)
                                    dopValue = '(' + c0 + ' ' + lp[languageID]['andmore'] + ')';

                                txt = txt.replace("()", dopValue);
                            }

                            // Самая результативная серия
                            if (groupID == 399) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);

                                dopValue = '(' + c0 + '-' + c1 + ')';

                                if (c1 == 999)
                                    dopValue = '(' + c0 + ' ' + lp[languageID]['andmore'] + ')';

                                txt = txt.replace("()", dopValue);
                            }

                            if (groupID == 124) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                txt = txt.replace("()", c0+':'+c1);
                            }

                            if (groupID == 0) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                if (c0 < c1)
                                    dopValue = c0 + ' - ' + c1;
                                if (c0 == c1)
                                    dopValue = c0;
                                txt = txt.replace("()", dopValue);
                            }

                            if (groupID == 96 || groupID == 113 || groupID == 114) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                txt = txt.replace('()', c1);
                                txt = txt.replace('()', c0);
                            }

                            if (groupID == 95 || groupID == 125 || groupID == 141 || groupID == 154) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                txt = txt.replace('()', c0);
                                txt = txt.replace('()', c1);
                            }

                            if (groupID == 33 || groupID == 34) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                gName = $("group_" + groupID).childNodes[0].innerHTML;
                                gName = gName.replace('()', c0);
                                gName = gName.replace('()', c1);
                                $("group_" + groupID).childNodes[0].innerHTML = gName;
                            }

                            if (groupID == 135) {
                                var c0 = parseInt(dopValue);
                                var c1 = Math.round((dopValue - c0) * 1000);
                                var pointName = lp[languageID]['spaceparty'];
                                if (sportId == 4)
                                    pointName = lp[languageID]['spacegame'];
                                if (sportId == 6)
                                    pointName = lp[languageID]['spaceset'];
                                dopValue = c0 + ' (' + c1 + pointName +')';
                                txt = txt.replace("()", dopValue);
                            }

                            if (groupID == 143) {
                                var c0 = parseInt(dopValue);
                                txt = txt.replace("()", c0);
                            }

                            if (txt.indexOf('()') != -1) {
                                if (notPlus.indexOf(parseInt(groupID)) == -1)
                                    txt = txt.replace("()", '('+dopValue+')');
                                else
                                    txt = txt.replace("()", '('+parseFloat(dopValue)+')');
                            }
                            z.childNodes[0].nodeValue = txt;
                        } else {
                            z = $('b_'+betID).parentNode.previous();
                            txt = z.childNodes[0].nodeValue;
                            txt = txt.replace('()', '(0)');
                            z.childNodes[0].nodeValue = txt;
                        }

                        if ((betID == 388 && b388) || (betID == 389 && b389) || (betID == 390 && b390))
                            continue;

                        // Подсветка max коэффициентов
                        if (maxCoeff && !blockSob) {
                            p.childNodes[1].down().setStyle({'background': '#f3c000'});
                            p.setStyle({'background': '#f3c000', opacity: 0.75});
                        }

                        if (blockSob) {
                            p.childNodes[1].down().setStyle({'background': '#ccc'});
                            p.setStyle({'background': '#ccc', opacity: 0.55});

                            addElementBefore(ppp, 'span', '<img src="/images/zamok2.png" width="11" align=absmiddle>')

                            var sLength = rData.length;
                            for (var k = 0; k < sLength; k++) {
                                if (rData[k].idBetG == sobID) {
                                    rData[k].block = 1;
                                    break;
                                }
                            }
                        }

                        if (typeof groupOpen[gameID][groupID] !== 'undefined') {
                            pgg = groupID;
                        } else {
                            pgg = -1;
                        }

                        grID = $('group_'+groupID);

                        textG = grID.firstChild.innerHTML;
                        gd = 0;
                        if (textG.indexOf('ag_') == -1)
                            gd = 1;

                        if (pgg != -1) {
                            if (groupOpen[gameID][pgg]) {
                                if (gd) {
                                    if (grID.firstChild.id!="plusButton") {
                                        grID.firstChild.innerHTML = '<a id="ag_'+groupID+'" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');"><img src="/images/minus2.gif"></a> ' + '<a class="shG" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');">' + textG + '</a> <span id="kolG_'+groupID+'" style="display:none;"></span>';
                                        var imgSrc="/images/marketAdd.gif";
                                        var imgTitle="Добавить в 'Мои рынки'";
                                        for (var iba = 0; iba < betArray.length; iba++) {
                                            if (betArray[iba].substring(6) == groupID) {
                                                imgSrc="/images/marketRemove.gif";
                                                imgTitle="Убрать из 'Мои рынки'";
                                                tickCount++;
                                                break;
                                            }
                                        }

                                        if (!shMyBetsFlag) {
                                            document.getElementById('allMarkets').addClassName('active');
                                            document.getElementById('myMarDiv').removeClassName('active');
                                        } else {
                                            document.getElementById('myMarDiv').addClassName('active');
                                            document.getElementById('allMarkets').removeClassName('active');
                                        }

                                        document.getElementById("tickCount").innerHTML="("+tickCount+")";

                                        span = document.createElement("span");

                                        span.style.display = "inline-block";
                                        span.style.margin = "0px 10px 0px 0px";

                                        span.id = "plusButton";
                                        grID.children[0].appendChild(span);

                                        var linkAdd = document.createElement("a");
                                        linkAdd.href = "javascript:void(0);";
                                        linkAdd.id = "addGroup"+groupID;
                                        linkAdd.onclick = function() {
                                            if (this.firstChild.src.substr(-13) == "marketAdd.gif") {
                                                tickCount++;
                                                document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                                this.firstChild.src = "/images/marketRemove.gif";
                                                for (var iba = 0; iba < betArray.length; iba++) {
                                                    if (betArray[iba]=='group_'+this.id.substring(8) && gameArr[iba]==gameID) return;
                                                }
                                                betArray.push('group_'+this.id.substring(8));
                                                gameArr.push(gameID);
                                            } else {
                                                tickCount--;
                                                document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                                this.firstChild.src="/images/marketAdd.gif";
                                                for (var iba=0;iba<betArray.length;iba++) {
                                                    if (betArray[iba]=='group_'+this.id.substring(8)) {
                                                        betArray[iba]='';
                                                        gameArr[iba]='';
                                                    }
                                                }
                                            }
                                        };

                                        span.appendChild(linkAdd);
                                        var imgAdd = document.createElement("img");
                                        imgAdd.src = imgSrc;
                                        imgAdd.style.width = "16px";
                                        imgAdd.title = imgTitle;
                                        linkAdd.appendChild(imgAdd);
                                        span.style.float = "right";
                                        span.style.color = "#330000";
                                        var count = 0;
                                    }
                                }
                                grID.firstChild.next().show();
                            } else {
                                if (gd)
                                    if (grID.firstChild.id != "plusButton") {
                                        grID.firstChild.innerHTML = '<a id="ag_'+groupID+'" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');"><img src="/images/plus2.gif"></a> ' + '<a class="shG" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');">' + textG + '</a> <span id="kolG_'+groupID+'"></span>';
                                        var imgSrc="/images/marketAdd.gif";
                                        var imgTitle="Добавить в 'Мои рынки'";
                                        for (var iba = 0; iba < betArray.length; iba++) {
                                            if (betArray[iba].substring(6) == groupID) {
                                                imgSrc = "/images/marketRemove.gif";
                                                imgTitle = "Убрать из 'Мои рынки'";
                                                tickCount++;
                                                break;
                                            }
                                        }

                                        if (!shMyBetsFlag){
                                            document.getElementById('allMarkets').addClassName('active');
                                            document.getElementById('myMarDiv').removeClassName('active');
                                        } else {
                                            document.getElementById('myMarDiv').addClassName('active');
                                            document.getElementById('allMarkets').removeClassName('active');
                                        }

                                        document.getElementById("tickCount").innerHTML="("+tickCount+")";

                                        span = document.createElement("span");

                                        span.style.display="inline-block";
                                        span.style.margin="0px 10px 0px 0px";

                                        span.id="plusButton";
                                        grID.children[0].appendChild(span);
                                        var linkAdd=document.createElement("a");
                                        linkAdd.href = "javascript:void(0)";
                                        linkAdd.id = "addGroup"+groupID;
                                        linkAdd.onclick = function() {
                                            if (this.firstChild.src.substr(-13) == "marketAdd.gif") {
                                                tickCount++;
                                                document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                                this.firstChild.src = "/images/marketRemove.gif";
                                                for (var iba = 0; iba < betArray.length; iba++) {
                                                    if (betArray[iba]=='group_'+this.id.substring(8) && gameArr[iba]==gameID) return;
                                                }
                                                betArray.push('group_'+this.id.substring(8));
                                                gameArr.push(gameID);
                                            } else {
                                                tickCount--;
                                                document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                                this.firstChild.src="/images/marketAdd.gif";
                                                for (var iba=0;iba<betArray.length;iba++) {
                                                    if (betArray[iba]=='group_'+this.id.substring(8)) {
                                                        betArray[iba]='';
                                                        gameArr[iba]='';
                                                    }
                                                }
                                            }
                                        };

                                        span.appendChild(linkAdd);
                                        var imgAdd = document.createElement("img");
                                        imgAdd.src = imgSrc;
                                        imgAdd.style.width = "16px";
                                        imgAdd.title = imgTitle;
                                        linkAdd.appendChild(imgAdd);
                                        span.style.float = "right";
                                        span.style.color = "#330000";
                                        var count = 0;
                                    }

                                grID.lastChild.hide();
                            }
                        } else {
                            if (gd){
                                if (grID.firstChild.id!="plusButton") {
                                    grID.firstChild.innerHTML = '<a id="ag_'+groupID+'" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');"><img src="/images/minus2.gif"></a> ' + '<a class="shG" href="javascript:void(0);" onClick="shG('+groupID+', '+gameID+');">' + textG + '</a> <span id="kolG_'+groupID+'" style="display:none;"></span>';
                                    var imgSrc="/images/marketAdd.gif";
                                    var imgTitle="Добавить в 'Мои рынки'";
                                    for (var iba = 0; iba < betArray.length; iba++) {
                                        if (betArray[iba].substring(6) == groupID){
                                            imgSrc = "/images/marketRemove.gif";
                                            imgTitle = "Убрать из 'Мои рынки'";
                                            tickCount++;
                                            break;
                                        }
                                    }

                                    document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                    if (!shMyBetsFlag){
                                        document.getElementById('allMarkets').addClassName('active');
                                        document.getElementById('myMarDiv').removeClassName('active');
                                    } else {
                                        document.getElementById('myMarDiv').addClassName('active');
                                        document.getElementById('allMarkets').removeClassName('active');
                                    }

                                    span=document.createElement("span");
                                    span.style.display = "inline-block";
                                    span.style.margin = "0px 10px 0px 0px";
                                    span.id = "plusButton";
                                    grID.children[0].appendChild(span);
                                    var linkAdd = document.createElement("a");
                                    linkAdd.href = "javascript:void(0)";
                                    linkAdd.id =" addGroup"+groupID;
                                    linkAdd.setAttribute("gID",gameID);
                                    linkAdd.onclick = function() {
                                        if (this.firstChild.src.substr(-13) == "marketAdd.gif") {
                                            tickCount++;
                                            document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                            this.firstChild.src = "/images/marketRemove.gif";
                                            for (var iba = 0; iba < betArray.length; iba++) {
                                                if (betArray[iba]=='group_'+this.id.substring(8) && gameArr[iba]==gameID) return;
                                            }
                                            betArray.push('group_'+this.id.substring(8));
                                            gameArr.push(gameID);
                                        } else {
                                            tickCount--;
                                            document.getElementById("tickCount").innerHTML="("+tickCount+")";
                                            this.firstChild.src="/images/marketAdd.gif";
                                            for (var iba=0;iba<betArray.length;iba++) {
                                                if (betArray[iba]=='group_'+this.id.substring(8)) {
                                                    betArray[iba]='';
                                                    gameArr[iba]='';
                                                }
                                            }
                                        }
                                    };
                                    span.appendChild(linkAdd);
                                    var imgAdd=document.createElement("img");
                                    imgAdd.src=imgSrc;
                                    imgAdd.style.width="16px";
                                    imgAdd.title=imgTitle;
                                    linkAdd.appendChild(imgAdd);
                                    span.style.float="right";
                                    span.style.color="#330000";
                                    var count=0;
                                }
                            }
                            groupOpen[gameID][groupID] = 1;
                            grID.firstChild.next().show();
                        }

                        idSetNewClass[cur] = betID;
                        idSetNewClassG[cur] = groupID;
                        cur++;

                        $('b_'+betID).setAttribute('bl', blockSob);
                        $('b_'+betID).setAttribute('u', gameID);
                        $('b_'+betID).setAttribute('v', sobID);
                        $('b_'+betID).setAttribute('g', groupID);
                        $('b_'+betID).setAttribute('d', dV);
                        $('b_'+betID).setAttribute('pl', PlayerId);
                        $('b_'+betID).childNodes[0].nodeValue = koef;

                        r = 0;

                        if (typeof saveSkoef[betID] !== 'undefined') {
                            r = koef - saveSkoef[betID];
                            saveSkoef[betID] = koef;
                        } else {
                            saveSkoef[betID] = koef;
                        }

                        if (!blockSob) {
                            if (r > 0)
                                $('b_'+betID).className = 'gc_';
                            if (r < 0)
                                $('b_'+betID).className = 'rc_';
                        }

                        p.style.display = 'block';

                        var sLength = rData.length;
                        for (var k = 0; k < sLength; k++) {
                            if (rData[k].idBetG == sobID) {
                                rData[k].koef = koef;
                                //rData[k].dopV = dV;
                                rData[k].ex = 0;
                                if (r > 0)
                                    rData[k].ex = 1;
                                if (r < 0)
                                    rData[k].ex = -1;
                                if (blockSob) {
                                    rData[k].block = 1;
                                    rData[k].ex = 0;
                                } else {
                                    rData[k].block = 0;
                                }
                                if (parseFloat(rData[k].dopV) != parseFloat(dV)) {
                                    rData[k].block = 1;
                                    rData[k].ex = 0;
                                }
                                break;
                            }
                        }

                        if(betID == 388) b388 = 1;
                        if(betID == 389) b389 = 1;
                        if(betID == 390) b390 = 1;
                    }


                    t = setTimeout("setDefaultClass()", 3000);

                    idGroupAdd = idSetNewClassG.uniq();
                    var flag = false;
                    var empty = true;
                    for (var i = 0; i < idGroupAdd.length; i++) {
                        if (shMyBetsFlag){
                            flag = false;
                            for (var j = 0; j < betArray.length; j++) {
                                if ("group_"+idGroupAdd[i] == betArray[j] && !flag) {
                                    flag = true;
                                    empty = false;
                                    $('group_'+idGroupAdd[i]).show();
                                    $('kolG_'+idGroupAdd[i]).innerHTML = ' (' + kolInG[idGroupAdd[i]] + ')';
                                    groupOpen[selectGame][i] = 1;
                                }
                            }
                        } else {
                            empty = false;
                            $('group_'+idGroupAdd[i]).show();
                            $('kolG_'+idGroupAdd[i]).innerHTML = ' (' + kolInG[idGroupAdd[i]] + ')';
                        }
                    }
                    if (empty) showAllMarkets();

                    $('info_content').hide();
                    $('games_content').show();
                    startUpdateSob = false;
                }
            }

        });
    } catch (err) {
        startUpdateSob = false;
        //$('info_content').hide();
        $('games_content').show();
        if(typeof To[2] !== 'undefined') clearTimeout(To[2]);
        //getCuponUpdate();
        return;
    }

}

shG = function(idGr, idGam)
{
    if (!groupOpen[idGam][idGr]) {
        jQuery('#group_' + idGr).children().last().show();
        jQuery('#kolG_' + idGr).hide();
        jQuery('#ag_' + idGr).html('<img src="/images/minus2.gif">');
        groupOpen[idGam][idGr] = 1;
    } else {
        jQuery('#group_' + idGr).children().last().hide();
        jQuery('#kolG_' + idGr).show();
        jQuery('#ag_' + idGr).html('<img src="/images/plus2.gif">');
        groupOpen[idGam][idGr] = 0;
    }
}

hideAllsh = function(obj)
{
    pn = obj.parentNode.parentNode.id;
    grHelpSelector = jQuery('#' + pn + ' #n_:visible');
    len = grHelpSelector.length;

    if (len) {
        for (var i = 0; i < len; i++) {
            grHelpSelector[i].next().hide();

            grId = parseInt(grHelpSelector[i].parentNode.id.replace('group_', ''), 10);

            if (jQuery('#' + pn + ' #kolG_' + grId).length)
                jQuery('#' + pn + ' #kolG_' + grId).show();

            if (jQuery('#' + pn + ' #ag_' + grId).length)
                jQuery('#' + pn + ' #ag_' + grId).html('<img src="/images/plus2.gif">');

            groupOpen[selectGame][grId] = 0;
        }
    }
}

showAllsh = function(obj)
{
    pn = obj.parentNode.parentNode.id;
    grHelpSelector = jQuery('#' + pn + ' #n_:visible');
    len = grHelpSelector.length;

    if (len) {
        for (var i = 0; i < len; i++) {
            grHelpSelector[i].next().show();

            grId = parseInt(grHelpSelector[i].parentNode.id.replace('group_', ''), 10);

            if (jQuery('#' + pn + ' #kolG_' + grId).length)
                jQuery('#' + pn + ' #kolG_' + grId).hide();

            if (jQuery('#' + pn + ' #ag_' + grId).length)
                jQuery('#' + pn + ' #ag_' + grId).html('<img src="/images/minus2.gif">');

            groupOpen[selectGame][grId] = 1;
        }
    }
}

addElementBefore = function(node, tag, htm) {
    var ne = document.createElement(tag);
    if (htm)
        ne.innerHTML = htm;
    ne.style.cssFloat = 'left';
    ne.style.padding = '2px 0 0 0';
    node.parentNode.insertBefore(ne, node);
}

addElementAfter = function(node, tag, htm) {
    var ne = document.createElement(tag);
    if (htm)
        ne.innerHTML = htm;
    node.parentNode.insertBefore(ne, node.nextSibling);
}

setDefaultClass = function() {
    for (var i = 0; i < idSetNewClass.length; i++) {
        if ($('b_'+idSetNewClass[i]))
            $('b_'+idSetNewClass[i]).className = '';
    }
}

sb = function(obj) {
    alert(obj.firstChild.getAttribute('v'))
}

goObserv = function(elt, type) {
    var type2 = type || 0;
    blSob = parseInt(elt.getAttribute('bl'), 10);
    if (blSob) return;
    idGame = elt.getAttribute('u');
    idGroup = elt.getAttribute('g');
    dV = elt.getAttribute('d');
    idBetG = elt.getAttribute('v'); // gameId + dV + betId
    PlayerId = parseInt(elt.getAttribute('pl'), 10);
    if (isNaN(PlayerId) || !PlayerId) PlayerId = 0;

    if ($('group_' + idGroup).down().innerHTML.indexOf('ag_') != -1)
        var nameGroup = $('group_'+idGroup).down().firstChild.next().innerHTML;
    else
    //var nameGroup = $('group_'+idGroup).down().innerHTML;
        var nameGroup = $('group_'+idGroup).down().firstChild.innerHTML;

    var sportNameText;
    if ($('sportNameText') && type2) {
        sportNameText = $('sportNameText').innerHTML;
    } else {
        //top_ = elt.parentNode.parentNode.parentNode.parentNode;
        sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
        nameGroup = '1x2';
    }

    var nameBet = elt.parentNode.previous().innerHTML;
    var koef = elt.innerHTML;

    if (GetCookie('one_click') == 'true') {
        var idBet = 0;
        var hash = GetCookie('uhash') || 0;
        var uId = GetCookie('ua') || 0;
        var postData = '';
        var DataEvents;

        startPut = 1;

        if (idGame) {
            if (dV != '' && dV != null)
                idBet = (idBetG+"").substr((idGame+""+dV).length);
            else
                idBet = (idBetG+"").substr((idGame+"").length);

            if (dV == null) dV = "0";

            if (typeof PlayerId == 'undefined')
                rPId = 0;
            else
                rPId = PlayerId;

            DataEvents = '{"GameId":' + parseInt(idGame, 10) + ',"Type":' + parseInt(idBet, 10) + ',"Coef":' + parseFloat(koef) + ',"Kind":'+1+',"Param":' + parseFloat(dV) + ',"PlayerId":' + rPId + '}';

            type = 0;
            dopParam = 0;

            var one_stavka = GetCookie('one_summa_click') || '10';
            one_stavka = one_stavka.replace(',', '.');

            //postData = '{"zcoupon":{"hash":"' + hash + '","UserId":' + uId + ',"Summ":' + one_stavka + ',"Vid":' + dopParam + ',"Events":[' + DataEvents + ']},"CheckCf":' + type + ',"lng":"' + lng + '"}';
            postData = '{"hash":"' + hash + '","UserId":' + uId + ',"Summ":' + one_stavka + ',"Vid":' + dopParam + ',"Events":[' + DataEvents + '],"CheckCf":' + type + ',"lng":"' + lng + '"}';
        }

        goPutOneClick(postData);
        return;
    }

    var est = 0;
    var n = 0;
    sLength = rData.length;

    for (var i = 0; i < sLength; i++) {
        if (rData[i].idGame == idGame || idGameArray.indexOf(idGame) != -1) {
            rData[i].nameGroup = nameGroup;
            rData[i].idGroup = parseInt(idGroup, 10);
            rData[i].idBetG = idBetG;
            rData[i].nameBet = nameBet;
            rData[i].koef = koef;
            rData[i].dopV = dV;
            rData[i].block = 0;
            rData[i].PlayerId = PlayerId;
            rData[i].Direction = 1;
            n = i;
            est = 1;
            break;
        }
    }

    var curColSob = 0;
    sLength = rData.length;

    for (var i = 0; i < sLength; i++) {
        if (rData[i].idGame) {
            curColSob++;
        }
    }

    if (!est && curColSob < 20) {
        rData[sLength] = new Object();
        rData[sLength].idGame = idGame;
        rData[sLength].sportNameText = sportNameText;
        rData[sLength].nameGroup = nameGroup;
        rData[sLength].idGroup = parseInt(idGroup, 10);
        rData[sLength].idBetG = idBetG;
        rData[sLength].nameBet = nameBet;
        rData[sLength].koef = koef;
        rData[sLength].dopV = dV;
        rData[sLength].block = 0;
        rData[sLength].PlayerId = PlayerId;
        rData[sLength].Direction = 1;
        n = sLength;
    }

    // Открываем блок, если он свёрнут
    if (jQuery('.block_6').css('display') == 'none') {
        jQuery('.block_6').show();
        var elem = jQuery('.block_6').prev('.sports_tab:first').find('.mbutton:first');
        if (elem.attr('src') == '/images/maximize_window.png') {
            elem.attr('src', '/images/minimize_window.png');
            jQuery('.block_6').prev('.sports_tab:first').find('.left:first').attr('title', lp[languageID]['minimize']);
            SaveBlockStatus(6);
        }
    }

    getMaxBet();
    draw_bets(n);
    getCuponUpdate();
}

goObserv2 = function(elt) {
    idGame = elt.getAttribute('u');
    idGroup = elt.getAttribute('g');
    dV = elt.getAttribute('d');
    idBetG = elt.getAttribute('v'); //  = gameId + dV + betId
    idMyGroup = parseInt(elt.getAttribute('t'), 10);
    PlayerId = parseInt(elt.getAttribute('pl'), 10);
    if (isNaN(PlayerId) || !PlayerId) PlayerId = 0;

    switch (idMyGroup) {
        case 1:
            nameGroup = lp[languageID]['1x2'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        case 2:
            nameGroup = lp[languageID]['total'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        case 3:
            nameGroup = lp[languageID]['handicap'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        case 4:
            nameGroup = lp[languageID]['points'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        case 5:
            nameGroup = lp[languageID]['gamesWin'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        case 6:
            nameGroup = lp[languageID]['doublechance'];
            sportNameText = elt.up('table').up('table').down('td', 1).children[0].innerHTML;
            break;
        default:
            nameGroup = '';
            sportNameText = '';
            break;
    }

    var nameBet = elt.getAttribute('n');
    var koef = elt.innerHTML;

    if (GetCookie('one_click') == 'true') {
        var idBet = 0;

        var hash = GetCookie('uhash') || 0;
        var uId = GetCookie('ua') || 0;

        var postData = '';
        var DataEvents;

        startPut = 1;

        if (idGame) {
            if (dV != '' && dV != null)
                idBet = (idBetG+"").substr((idGame+""+dV).length);
            else
                idBet = (idBetG+"").substr((idGame+"").length);

            if (dV == null) dV = "0";

            if (typeof PlayerId == 'undefined')
                rPId = 0;
            else
                rPId = PlayerId;

            DataEvents = '{"GameId":' + parseInt(idGame, 10) + ',"Type":' + parseInt(idBet, 10) + ',"Coef":' + parseFloat(koef) + ',"Kind":'+1+',"Param":' + parseFloat(dV) + ',"PlayerId":' + rPId + '}';

            type = 0;
            dopParam = 0;

            var one_stavka = GetCookie('one_summa_click') || '10';
            one_stavka = one_stavka.replace(',', '.');

            //postData = '{"zcoupon":{"hash":"' + hash + '","UserId":' + uId + ',"Summ":' + one_stavka + ',"Vid":' + dopParam + ',"Events":[' + DataEvents + ']},"CheckCf":' + type + ',"lng":"' + lng + '"}';
            postData = '{"hash":"' + hash + '","UserId":' + uId + ',"Summ":' + one_stavka + ',"Vid":' + dopParam + ',"Events":[' + DataEvents + '],"CheckCf":' + type + ',"lng":"' + lng + '"}';
        }

        goPutOneClick(postData);
        return;
    }

    if (dV == null) dV = "0";

    var est = 0;
    var n = 0;
    sLength = rData.length;

    for (var i = 0; i < sLength; i++) {
        if (rData[i].idGame == idGame || idGameArray.indexOf(idGame) != -1) {
            rData[i].nameGroup = nameGroup;
            rData[i].idGroup = parseInt(idGroup, 10);
            rData[i].idBetG = idBetG;
            rData[i].nameBet = nameBet;
            rData[i].koef = koef;
            rData[i].dopV = dV;
            rData[i].block = 0;
            rData[i].PlayerId = PlayerId;
            rData[i].Direction = 1;
            n = i;
            est = 1;
            break;
        }
    }

    var curColSob = 0;
    sLength = rData.length;

    for (var i = 0; i < sLength; i++) {
        if (rData[i].idGame) {
            curColSob++;
        }
    }

    if (!est && curColSob < 20) {
        rData[sLength] = new Object();
        rData[sLength].idGame = idGame;
        rData[sLength].sportNameText = sportNameText;
        rData[sLength].nameGroup = nameGroup;
        rData[sLength].idGroup = parseInt(idGroup, 10);
        rData[sLength].idBetG = idBetG;
        rData[sLength].nameBet = nameBet;
        rData[sLength].koef = koef;
        rData[sLength].dopV = dV;
        rData[sLength].block = 0;
        rData[sLength].PlayerId = PlayerId;
        rData[sLength].Direction = 1;
        n = sLength;
    }

    // Открываем блок, если он свёрнут
    if (jQuery('.block_6').css('display') == 'none') {
        jQuery('.block_6').show();
        var elem = jQuery('.block_6').prev('.sports_tab:first').find('.mbutton:first');
        if (elem.attr('src') == '/images/maximize_window.png') {
            elem.attr('src', '/images/minimize_window.png');
            jQuery('.block_6').prev('.sports_tab:first').find('.left:first').attr('title', lp[languageID]['minimize']);
            SaveBlockStatus(6);
        }
    }

    getMaxBet();
    draw_bets(n);
    getCuponUpdate();
}

// Максимально возможная сумма ставки
getMaxBet = function() {
    var url = '/LineUtil/MaxBet';
    var DataEvents = new Array();
    var sLength = rData.length;
    var idBet = 0;
    var kol = 0;
    var live = false;

    for (var k = 0; k < sLength; k++) {
        if (rData[k].idGame) {
            if (rData[k].dopV != '' && rData[k].dopV != null)
                idBet = (rData[k].idBetG+"").substr((rData[k].idGame+""+rData[k].dopV).length);
            else
                idBet = (rData[k].idBetG+"").substr((rData[k].idGame+"").length);

            if (rData[k].dopV == null) rData[k].dopV = "0";

            if (typeof rData[k].PlayerId == 'undefined')
                rPId = 0;
            else
                rPId = rData[k].PlayerId;

            DataEvents[kol] = '{"Coef":'+parseFloat(rData[k].koef)+',"GameId":'+parseInt(rData[k].idGame, 10)+',"Kind":'+rData[k].Direction+',"Param":'+parseFloat(rData[k].dopV)+',"PlayerId":'+rPId+',"Type":'+parseInt(idBet, 10)+'}';

            kol++;

            // Если есть события из Live
            if (rData[k].Direction == 1) {
                url = '/LiveUtil/MaxBet';
                live = true;
            }
        }
    }

    var vidSob = jQuery('#vidSob').attr('value') || '1';
    switch (vidSob) {
        case '1':
            dopParam = 0;
            break;
        case '2':
            dopParam = 1;
            break;
        case '3':
            dopParam = 3;
            break;
        default:
            dopParam = vidSob;
            var t = dopParam.split('|');

            if (typeof t[0] == 'undefined' || typeof t[1] == 'undefined') {
                alerts(lp[languageID]['message'], lp[languageID]['incorData']);
                jQuery('#goPutBetLoad').hide();
                jQuery('#goPutBetButton').show();
                return;
            }

            t[0] = Math.abs(parseInt(t[0], 10));
            t[1] = Math.abs(parseInt(t[1], 10));

            if (t[0] >= t[1] || !t[0] || !t[1]) {
                alerts(lp[languageID]['message'], lp[languageID]['incorData']);
                jQuery('#goPutBetLoad').hide();
                jQuery('#goPutBetButton').show();
                return;
            }
            dopParam = "2" + '' + str_pad(t[0], 2, '0', 'STR_PAD_LEFT') + '' + str_pad(t[1], 2, '0', 'STR_PAD_LEFT');
            break;
    }

    var sum = jQuery('#bet_input').value || 0;
    var uId = GetCookie('ua') || 0;

    // Если купон совместный (Линия + Live)
    /*if (live) {
     postData = '{"zcoupon":{"Summ":'+sum+',"Vid":'+dopParam+',"Events":['+DataEvents.join(',')+']},"idUser":'+uId+',"lng":"'+lng+'"}';
     } else {*/
    postData = '{"UserId":'+uId+',"Summ":'+sum+',"Vid":'+dopParam+',"Events":['+DataEvents.join(',')+'],"lng":"'+lng+'"}';
    //}

    new Ajax.Request(url, {
        requestHeaders: {"Access-Control-Allow-Headers": "Content-Type, X-Requested-With", "If-Modified-Since":"Sat, 1 Jan 2000 00:00:00 GMT", "Content-Type":"application/json"},
        parameters: postData,
        method: "post",
        onComplete: function(request) {
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                result = request.responseJSON;

                if (!result.Success)
                    return;

                money = result.Value;
                jQuery('#summ_max').html(money);
            }
        }
    });
}

var rData = new Array();
var rDataLast = new Array();

Event.observe(document.body, 'click', a=function(event) {
    var elt = Event.element(event);
    id = elt.id.substr(0, 2);
    id1 = elt.id.substr(0, 3);

    if(id == 'z_' || id1 == 'z1_')
    {
        var el = elt.next().firstChild;
        if(id == 'z_') goObserv(el,1)
        if(id1 == 'z1_') goObserv(el,0)
        //goObserv(el)
        return;
    }

    if(id == 's_' || id1 == 'ss_')
    {
        var el = elt.children[0].next().firstChild;
        if(id == 's_') goObserv(el,1)
        if(id1 == 'ss_') goObserv(el,0)
        return;
    }

    if(id1 == 'x2_')
    {
        var el = elt.next().firstChild;
        goObserv2(el)
        return;
    }

    if(id1 == 'xx_')
    {
        var el = elt.children[0].next().firstChild;
        goObserv2(el)
        return;
    }

    if(id == 'b_')
    {
        if(elt.parentNode.parentNode.id == 'xx_')
        {
            goObserv2(elt);
        } else {
            goObserv(elt,1)
        }
    }
});

del_bet = function(n,nn) {
    rData[n].idGame = 0;
    rData[n].idBetG = 0;
    setRDARA();
    getMaxBet();
    draw_bets(nn);
}

draw_bets = function(n,col)
{
    col = col || 0;
    clearTimeout(draw_b);
    $('all_bets').innerHTML = '';
    var est = 0;
    var summ_koef = 1;
    var chain_koef = 0;
    var colSobNew = 0;

    sLength = rData.length;
    for(var i = 0; i < sLength; i++)
    {
        if(rData[i].idGame)
        {
            est = 1;
            classUpDown = '';

            if(!rData[i].block) {
                summ_koef *= rData[i].koef;
                chain_koef += parseFloat(rData[i].koef);
                colSobNew++;
            }

            if(rData[i].ex > 0) {classUpDown = 'gc_';rData[i].ex = 0}
            if(rData[i].ex < 0) {classUpDown = 'rc_';rData[i].ex = 0}

            var re = /[a-zа-я ]/i;
            if(!re.test(rData[i].nameBet)) rData[i].nameBet = rData[i].nameBet.replace(/\(.*\)/gi, '()');
            nbNew = dopValueUpdate(rData[i].dopV, rData[i].nameBet, rData[i].idGroup);
            rData[i].nameBet = nbNew;

            if(rData[i].block) {
                css_table = 'class="tbs_r"';
                dz = '<div class="gameBlockInCoupon">' + lp[languageID]['lock'] + '</div>';
            } else {
                css_table = '';
                dz = '';
            }

            $('all_bets').innerHTML += '<section ' + css_table + '>' + dz +
                '<div class="rate">' +
                '<div class="teams">' +
                '<span>' + rData[i].sportNameText + '</span>' +
                '</div>' +
                '<div class="type">' +
                '<span class="type-name">' + rData[i].nameGroup + ': </span><span class="team">' + nbNew + '</span><span class="bet ' + classUpDown + '">' + rData[i].koef + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="del-rate" title="Удалить ставку" onClick="del_bet(' + i + ',' + n + ')"></div>' +
                '</section>';
        }
    }

    if(colSobNew != colSobOld)
    {
        HideSystemMinimumStake();

        colSobOld = colSobNew;

        var rezSob = '';
        if(colSobOld) {
            rezSob += "<select id='vidSob' onChange='draw_bets("+n+", 1);'>";
            if (colSobOld == 1)
                rezSob += '<option value="1">'+lp[languageID]['single']+'</option>';
            if (colSobOld > 1) {
                rezSob += '<option value="2" onclick="HideSystemMinimumStake()">'+lp[languageID]['express']+'</option>';
                rezSob += '<option value="3" onclick="HideSystemMinimumStake()">'+lp[languageID]['chain']+'</option>';
            }
            if (colSobOld > 2 && colSobOld <= 12) {
                for(var i = 1; i < colSobOld-1; i++) rezSob += '<option value="'+(i+1)+'|'+colSobOld+'" onclick="SystemMinimumStake('+ parseInt(i+1) +', '+ colSobOld +')">'+lp[languageID]['system']+': '+(i+1)+"/"+colSobOld+'</option>';
            }
            rezSob = rezSob + "</select>";
            $('selVid').innerHTML = rezSob;

            if (colSobOld == 1) {
                $('rateType').hide();
                $('coeffTotal').hide();
                $('clearAllBetsBlock').hide();
            } else {
                $('rateType').show();
                $('coeffTotal').show();
                $('clearAllBetsBlock').show();
            }
        }
    }

    if (est && userAccount) {
        $('price_bets').style.display = 'block';
        if ($('vidSob')) {
            if($('vidSob').value == 1 || $('vidSob').value == 2)
                $('summ_koef').innerHTML = summ_koef.toFixed(2);
            else if ($('vidSob').value == 3) {
                $('summ_koef').innerHTML = (chain_koef - (colSobNew - 1)).toFixed(2);
            } else
                $('summ_koef').innerHTML = '-';
        } else {
            $('rateType').hide();
            $('coeffTotal').hide();
            $('clearAllBetsBlock').hide();
        }
    } else {
        $('price_bets').hide();
        $('bet_input').value = '';

        // Сбрасываем таймеры обновления купона
        deleteCuponUpdateTimer();
    }

    setRDARA();
    set_summ_win();
    if(!col) draw_b = setTimeout("draw_bets("+n+",1)", 3000);
}

str_pad = function(input, pad_length, pad_string, pad_type) {
    var half = '', pad_to_go;
    var str_pad_repeater = function(s, len) {
        var collect = '', i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH')
        pad_type = 'STR_PAD_RIGHT';

    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type == 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }
    return input;
}

ct = function(n, mess)
{
    mess = mess || '';
    Aj[n].transport.abort();
    if(mess) alerts(lp[languageID]['message'], mess);
}

goPutOneClick = function(postData) {
    if (postData.length > 0) {
        var url = '/dataLineLive/put_bets_common.php';
        var uId = GetCookie('ua') || 0;
        var one_stavka = GetCookie('one_summa_click') || '10';
        one_stavka = one_stavka.replace(',', '.');

        if (uId) {
            try	{
                $('lightBox2').show();
                $('lightBox2').innerHTML = '<div style="box-shadow:0 0 5px 2px rgba(0, 0, 0, 0.3); top:50%; left:50%; position:relative; margin:-65px 0 0 -125px; width:250px; height:90px; background:#fff; border-radius:10px; text-align:center; color:#666; padding-top:40px; border:3px solid #73b5c5;">'+lp[languageID]['betInProgress']+'...<br /><img src="/images/loading_line.gif"></div>';

                clearTimeout(To[1]);
                To[1] = setTimeout("ct(1, '<img src=\"/images/er2.png\" style=\"float:left; margin:0 7px 7px 0;\" align=\"absmiddle\"> "+lp[languageID]['betRej']+"');$('lightBox2').innerHTML = '';$('lightBox2').hide();", 30000);
                debugMsg(3, "Сумма: "+one_stavka+" Параметры: "+postData+" ID: "+uId+" Браузер: "+window.navigator.userAgent, "WebUserLiveOneClickBet");

                Aj[1] = new Ajax.Request(url, {
                    requestHeaders: {"Access-Control-Allow-Headers": "Content-Type, X-Requested-With", "If-Modified-Since":"Sat, 1 Jan 2000 00:00:00 GMT", "contentType":"application/json", "Content-Type":"application/json"},
                    parameters: postData,
                    method: "post",
                    onComplete: function(request) {
                        clearTimeout(To[1]);
                        startPut = 0;

                        if (request.status != 200) {
                            $('lightBox2').innerHTML = '';
                            $('lightBox2').hide();
                            // alert("Server is unavailable. Try again later.");
                        } else {
                            $('lightBox2').innerHTML = '';
                            $('lightBox2').hide();

                            result = request.responseText;
                            result = result.evalJSON();

                            var success = result.Success;
                            var error = result.Error;

                            if (success == false) {
                                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle">' + error);
                                getSobByGameId(0,selectGame);
                                return;
                            }

                            var idStavki = 0;
                            if (result.Value != null) {
                                idStavki = result.Value.Id;
                                idStavki = parseInt(idStavki, 10);
                            }

                            if (idStavki) {
                                debugMsg(3, "ID ставки: "+idStavki+" ID: "+uId+" Браузер: "+window.navigator.userAgent, "WebUserLiveOneClickBetConfirm");

                                var valuta = lp[languageID][GetCookie('cur')]?lp[languageID][GetCookie('cur')]:GetCookie('cur');
                                var balance = result.Value.Balance;

                                $('uMoney').innerHTML = balance + ' ' + valuta;
                                rData = new Array();
                                get_history_today();
                                getLastCupon();
                                getSobByGameId(0,selectGame);

                                alerts(lp[languageID]['message'], '<img src="/images/gok.png" align="absmiddle"> ' + lp[languageID]['betAccepted']);

                                return;
                            } else {
                                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle">' + error);
                                getSobByGameId(0,selectGame);

                                return;
                            }
                        }
                    }
                });
            } catch (err) {
                $('lightBox2').hide();
                startPut = 0;
                clearTimeout(To[1]);

                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle"> '+lp[languageID]['repeatBet']);
            }
        }
    } else {
        startPut = 0;
    }
}

goPut = function() {
    ga('send', 'event', 'button', 'click', 'MakeBet');

    var url = '/dataLine/put_bets_line.php';

    $('bet_input').removeAttribute('onkeypress');
    if ($('bet_input').readAttribute('onkeypress') == null) {
        $('goPutBetLoad').show();
        $('goPutBetButton').hide();

        var sLength = rData.length;
        var idBet = 0;
        var kol = 0;
        var hash = GetCookie('uhash') || 0;
        var uId = GetCookie('ua') || 0;
        var postData = '';
        var DataEvents = new Array();
        var live = false;

        startPut = 1;

        for (var k = 0; k < sLength; k++) {
            if (rData[k].idGame) {
                if (rData[k].dopV != '')
                    idBet = (rData[k].idBetG+"").substr((rData[k].idGame+""+rData[k].dopV).length);
                else
                    idBet = (rData[k].idBetG+"").substr((rData[k].idGame+"").length);

                if (rData[k].dopV == null)
                    rData[k].dopV = "0";

                if (typeof rData[k].PlayerId == 'undefined')
                    rPId = 0;
                else
                    rPId = rData[k].PlayerId;

                DataEvents[kol] = '{"Coef":'+parseFloat(rData[k].koef)+',"GameId":'+parseInt(rData[k].idGame, 10)+',"Kind":'+rData[k].Direction+',"Param":'+parseFloat(rData[k].dopV)+',"PlayerId":'+rPId+',"Type":'+parseInt(idBet, 10)+'}';

                if (rData[k].Direction == 1) {
                    url = '/dataLineLive/put_bets_common.php';
                    live = true;
                }

                kol++;
            }
        }

        if (DataEvents.length > 0) {
            var vidSob = jQuery('#vidSob').attr('value');

            switch (vidSob) {
                case '1':
                    dopParam = 0;
                    break;
                case '2':
                    dopParam = 1;
                    break;
                case '3':
                    dopParam = 3;
                    break;
                default:
                    dopParam = vidSob;
                    var t = dopParam.split('|');

                    if (typeof t[0] == 'undefined' || typeof t[1] == 'undefined') {
                        alerts(lp[languageID]['message'], lp[languageID]['incorData']);
                        jQuery('#goPutBetLoad').hide();
                        jQuery('#goPutBetButton').show();
                        return;
                    }

                    t[0] = Math.abs(parseInt(t[0], 10));
                    t[1] = Math.abs(parseInt(t[1], 10));

                    if (t[0] >= t[1] || !t[0] || !t[1]) {
                        alerts(lp[languageID]['message'], lp[languageID]['incorData']);
                        jQuery('#goPutBetLoad').hide();
                        jQuery('#goPutBetButton').show();
                        return;
                    }
                    dopParam = "2" + '' + str_pad(t[0], 2, '0', 'STR_PAD_LEFT') + '' + str_pad(t[1], 2, '0', 'STR_PAD_LEFT');
                    break;
            }

            var sum = jQuery('#bet_input').attr('value').replace(',', '.') || '0';
            var allE = 0;
            objSel = $('allE');
            allE = objSel.options[objSel.selectedIndex].value;

            /*if (live) {
             postData = '{"zcoupon":{"hash":"'+hash+'","UserId":'+uId+',"Summ":'+sum+',"Vid":'+dopParam+',"Events":['+DataEvents.join(',')+']},"checkCf":'+allE+',"lng":"'+lng+'"}';
             } else {*/
            postData = '{"hash":"'+hash+'","UserId":'+uId+',"Summ":'+sum+',"Vid":'+dopParam+',"Events":['+DataEvents.join(',')+'],"CheckCf":'+allE+',"lng":"'+lng+'"}';
            //}

            try {
                debugMsg(3, "Сумма: "+sum+" Параметры: "+postData+" ID: "+uId+" Браузер: "+window.navigator.userAgent, "WebUserLiveBet");

                clearTimeout(To[1]);
                To[1] = setTimeout("ct(1, '<img src=\"/images/er2.png\" style=\"float:left; margin:0 7px 7px 0;\" align=\"absmiddle\"> "+lp[languageID]['betRej']+"');$('goPutBetLoad').hide();$('goPutBetButton').show();", 30000);

                Aj[1] = new Ajax.Request(url, {
                    requestHeaders: {"Access-Control-Allow-Headers": "Content-Type, X-Requested-With", "If-Modified-Since":"Sat, 1 Jan 2000 00:00:00 GMT", "Content-Type":"application/json"},
                    parameters: postData,
                    method: "post",
                    onComplete: function(request) {
                        clearTimeout(To[1]);
                        startPut = 0;

                        if (request.status != 200) {
                            $('goPutBetLoad').hide();
                            $('goPutBetButton').show();
                            $('bet_input').setAttribute('onkeypress', 'if(keyPress(event)==13){goPut();return false;}');
                        } else {
                            $('goPutBetLoad').hide();
                            $('goPutBetButton').show();
                            $('bet_input').setAttribute('onkeypress', 'if(keyPress(event)==13){goPut();return false;}');

                            var result = request.responseText;
                            result = result.evalJSON();

                            var success = result.Success;
                            var error = result.Error;

                            if (success == false) {
                                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle">' + error);
                                draw_bets();
                                getSobByGameId(0, selectGame);
                                return;
                            }

                            var idStavki = 0;
                            if (result.Value != null) {
                                idStavki = result.Value.Id;
                                idStavki = parseInt(idStavki, 10);
                            }

                            if (idStavki) {
                                debugMsg(3, "ID ставки: "+idStavki+" ID: "+uId+" Браузер: "+window.navigator.userAgent, "WebUserLiveBetConfirm");

                                var valuta = lp[languageID][GetCookie('cur')]?lp[languageID][GetCookie('cur')]:GetCookie('cur');
                                var balance = result.Value.Balance;

                                updateUpd();
                                $('uMoney').innerHTML = balance + ' ' + valuta;  // Обновляем сумму на счете
                                rData = new Array();
                                draw_bets();
                                get_history_today();
                                getLastCupon();
                                // Сбрасываем таймеры обновления купона
                                deleteCuponUpdateTimer();
                                alerts(lp[languageID]['message'], '<img src="/images/gok.png" align="absmiddle"> ' + lp[languageID]['betAccepted']);
                                return;
                            } else {
                                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle">' + error);
                                //getCuponUpdate();
                                return;
                            }
                        }
                    }
                });
            } catch (err) {
                startPut = 0;
                clearTimeout(To[1]);
                alerts(lp[languageID]['message'], '<img src="/images/er2.png" style="float:left; margin:0 7px 7px 0;" align="absmiddle"> '+lp[languageID]['repeatBet']);
                $('goPutBetLoad').hide();
                $('goPutBetButton').show();
                $('bet_input').setAttribute('onkeypress', 'if(keyPress(event)==13){goPut();return false;}');
            }
        } else {
            $('goPutBetLoad').hide();
            $('goPutBetButton').show();
            $('bet_input').setAttribute('onkeypress', 'if(keyPress(event)==13){goPut();return false;}');
            startPut = 0;
        }
    }
}

// Показать купон
showRDATA = function() {
    var sLength = rData.length;
    for (var k = 0; k < sLength; k++) {
        var s = "com.nhl.json.live.Game ID: ";
        s+=rData[k].idGame + "; Sport name: "
        s+=rData[k].sportNameText + "; Group name: "
        s+=rData[k].nameGroup + "; Group ID: "
        s+=rData[k].idGroup + "; Bet ID: "
        s+=rData[k].idBetG + "; Bet name: "
        s+=rData[k].nameBet + "; Koef: "
        s+=rData[k].koef + "; Block: "
        s+=rData[k].block + "; DopValue: "
        s+=rData[k].dopV + "; Player ID: "
        s+=rData[k].PlayerId + "; Direction: "
        s+=rData[k].Direction

        console.log(s)
    }
}

// Сохранить купон
var startRD = 0;
var setRD;

setRDARA = function() {
    var sLength = rData.length;
    var s = "";
    for (var k = 0; k < sLength; k++) {
        if (!rData[k].idGame) continue;
        if (rData[k].dopV == null) rData[k].dopV = 0;
        s+="&rdata[]="
        s+=rData[k].idGame
        s+="|"
        s+=rData[k].sportNameText
        s+="|"
        s+=rData[k].nameGroup
        s+="|"
        s+=rData[k].idBetG
        s+="|"
        s+=rData[k].nameBet
        s+="|"
        s+=rData[k].koef
        s+="|"
        s+=rData[k].block
        s+="|"
        s+=rData[k].dopV
        s+="|"
        s+=rData[k].idGroup
        s+="|"
        s+=rData[k].PlayerId
        s+="|"
        s+=rData[k].Direction
    }

    if (startRD) setRD.transport.abort();
    startRD = 1;
    setRD = new Ajax.Request('/dataLineLive/rdata_common.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "t=set&rdata=" + s + "&alle="+allEValue,
        method: "post",
        onComplete: function(request) {
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                req = request.responseText;
            }
            startRD = 0;
        }
    });
}

// Получить купон
getRDARA = function(tmp) {
    tmp = tmp || 0;
    new Ajax.Request('/dataLineLive/rdata_common.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "t=get",
        method: "post",
        onComplete: function(request){
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                result = request.responseXML;

                var answer = result.getElementsByTagName('g');
                if (!answer.length) return;

                rData = new Array();
                for (var i = 0; i < answer.length; i++) {
                    var idGame = parseInt(answer[i].getAttribute('i'));
                    var idBetG = answer[i].getAttribute('d');
                    var koef = parseFloat(answer[i].getAttribute('k')).toFixed(2);
                    var block = parseInt(answer[i].getAttribute('b'));

                    var dV = answer[i].getAttribute('v');
                    if (!dV) dV = 0;

                    var idGroup = parseInt(answer[i].getAttribute('ig'), 10);
                    var PlayerId = parseInt(answer[i].getAttribute('pl'), 10);

                    var sportNameText = answer[i].getElementsByTagName('sn');
                    sportNameText = sportNameText[0].textContent || sportNameText[0].text || '';

                    var nameGroup = answer[i].getElementsByTagName('ng');
                    nameGroup = nameGroup[0].textContent || nameGroup[0].text || '';

                    var nameBet = answer[i].getElementsByTagName('nb');
                    nameBet = nameBet[0].textContent || nameBet[0].text || '';

                    var Direction = answer[i].getElementsByTagName('dir');
                    Direction = Direction[0].textContent || Direction[0].text || '';

                    var allEXML = answer[i].getElementsByTagName('ae');
                    allEXML = allEXML[0].textContent || allEXML[0].text || '';
                    var opt = document.getElementById("allE").options;
                    for (var w = 0; w < opt.length; w++) {
                        if (opt[w].value == allEXML) {
                            opt[w].selected = true;
                            break;
                        }
                    }
                    allEValue = allEXML;

                    rData[i] = new Object();
                    rData[i].idGame = idGame;
                    rData[i].sportNameText = sportNameText;
                    rData[i].nameGroup = nameGroup;
                    rData[i].idGroup = idGroup;
                    rData[i].idBetG = idBetG;
                    rData[i].nameBet = nameBet;
                    rData[i].ex = 0;
                    rData[i].koef = koef;
                    rData[i].block = 0;
                    rData[i].dopV = dV;
                    rData[i].PlayerId = PlayerId;
                    rData[i].Direction = Direction;
                }

                if (tmp) getMaxBet();
                draw_bets();
                getCuponUpdate();
            }
        }
    });
}

// Отобразить последний купон
getLastCupon = function() {
    new Ajax.Request('/dataLive/get_last_kupon_live.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "",
        method: "post",
        onComplete: function(request) {
            if (request.status != 200) {
                // alert("Server is unavailable. Try again later.");
            } else {
                req = request.responseXML;

                var resTXT = '';

                var answer = req.getElementsByTagName('g');
                if (!answer.length) {
                    $('lastCupon').hide();
                    return;
                }

                rDataLast = new Array();
                for (var i = 0; i < answer.length; i++) {
                    var idGame = parseInt(answer[i].getAttribute('i'), 10);
                    //var idBetG = parseInt(answer[i].getAttribute('d'));
                    var idBetG = answer[i].getAttribute('d');
                    var koef = parseFloat(answer[i].getAttribute('k')).toFixed(2);
                    var block = parseInt(answer[i].getAttribute('b'), 10);
                    //var dV = parseFloat(answer[i].getAttribute('v'));
                    var dV = answer[i].getAttribute('v');
                    if (!dV) dV = 0;
                    var idGroup = parseInt(answer[i].getAttribute('ig'), 10);
                    var PlayerId = answer[i].getAttribute('pl');
                    if(isNaN(PlayerId) || !PlayerId) PlayerId = 0;
                    PlayerId = parseInt(PlayerId, 10);

                    // Глобальная переменная для dopValueUpdate
                    idSport = parseInt(answer[i].getAttribute('s'), 10);

                    var sportNameText = answer[i].getElementsByTagName('sn');
                    sportNameText = sportNameText[0].textContent || sportNameText[0].text || '';

                    var nameGroup = answer[i].getElementsByTagName('ng');
                    nameGroup = nameGroup[0].textContent || nameGroup[0].text || '';

                    var nameBet = answer[i].getElementsByTagName('nb');
                    nameBet = nameBet[0].textContent || nameBet[0].text || '';

                    var Direction = answer[i].getElementsByTagName('dir');
                    Direction = Direction[0].textContent || Direction[0].text || 1;
                    Direction = parseInt(Direction, 10);

                    var idSob = parseInt(answer[i].getAttribute('is'), 10);

                    rDataLast[i] = new Object();
                    rDataLast[i].idGame = idGame;
                    rDataLast[i].sportNameText = sportNameText;
                    rDataLast[i].nameGroup = nameGroup;
                    rDataLast[i].idBetG = idBetG;
                    rDataLast[i].nameBet = nameBet;
                    rDataLast[i].ex = 0;
                    rDataLast[i].koef = koef;
                    rDataLast[i].block = 0;
                    rDataLast[i].dopV = dV;
                    rDataLast[i].idGroup = idGroup;
                    rDataLast[i].PlayerId = PlayerId;
                    rDataLast[i].Direction = Direction;

                    nameBet = dopValueUpdate(dV, nameBet, idGroup, idSob);

                    resTXT += '<section>' +
                        '<div class="rate">' +
                        '<div class="teams">' +
                        '<span>' + sportNameText + '</span>' +
                        '</div>' +
                        '<div class="type">' +
                        '<span class="type-name">' + nameGroup + ': </span><span class="team">' + nameBet + '</span><span class="bet">' + koef + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</section>';
                }

                resTXT += '<div style="padding-top:5px;text-align:center;"><a id="goPutBetButton" href="javascript:void(0);" onClick="goToCupon();" style="padding:1px 5px 1px 5px;background:#F9F9F9; border:1px solid #666;color:#333;font-size:11px;">'+lp[languageID]['repCoupon']+'</a></div>';
                $('lCid').innerHTML = resTXT;
                $('lastCupon').show();
            }
        }
    });
}

// Повторить купон
goToCupon = function() {
    var est = 0;
    var n = 0;
    sLengthLast = rDataLast.length;

    for (var k = 0; k < sLengthLast; k++) {
        sLength = rData.length;

        for (var i = 0; i < sLength; i++) {
            if (rData[i].idGame == rDataLast[k].idGame || idGameArray.indexOf(rDataLast[k].idGame) != -1) {
                n = i;
                est = 1;
                break;
            }
        }

        if (!est) {
            rData[sLength] = new Object();
            rData[sLength].idGame = rDataLast[k].idGame;
            rData[sLength].sportNameText = rDataLast[k].sportNameText;
            rData[sLength].nameGroup = rDataLast[k].nameGroup;
            rData[sLength].idGroup = rDataLast[k].idGroup;
            rData[sLength].idBetG = rDataLast[k].idBetG;
            rData[sLength].nameBet = rDataLast[k].nameBet;
            rData[sLength].koef = rDataLast[k].koef;
            rData[sLength].dopV = rDataLast[k].dopV;
            rData[sLength].block = 0;
            rData[sLength].PlayerId = rDataLast[k].PlayerId;
            rData[sLength].Direction = rDataLast[k].Direction;
            n = sLength;
        }

        // Если в купоне есть события из линии, то обновляем их
        if (rDataLast[k].Direction == 3)
            needUpdateLine = true;
    }

    getMaxBet();
    getCuponUpdate();
}

clearAllBets = function()
{
    rData = new Array();
    setRDARA();
    draw_bets();
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var t;
var curFav = 0;
var h1 = 0;
var h2 = 0;
var favorArray = new Array();

if(!window.opera && window.Node && window.XMLSerializer)
{
    if(Node.prototype.__defineGetter__)
        Node.prototype.__defineGetter__('outerHTML', function() {
            return new XMLSerializer().serializeToString(this);
        });
}

isNumber = function(n)
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var onM=0;

updateFav = function()
{
    var rez = '';
    var kol = 0;

    for(var i in favorArray)
    {
        if(isNumber(i) && favorArray[i])
        {
            pGL = $$('#gl_'+i);
            if(pGL[1]) pGL[0] = pGL[1];
            if(pGL[0])
            {
                rez += pGL[0].outerHTML;
                kol++;
            } else {
                pGL = $$('#g_'+i);
                if(pGL[1]) pGL[0] = pGL[1];
                if(pGL[0])
                {
                    rez += pGL[0].outerHTML;
                    kol++;
                }
            }
        }
    }

    var tmpFav = '(' + kol + ')';
    //if(kol) tmpFav += ' <span style="float:right;" onmouseover="javascript:onM=1;" onmouseout="javascript:onM=0;"><a href="javascript:void(0);" onclick="clearFav();" style="color:#cccccc;">'+lp[languageID]['clear']+'</a> / <a href="javascript:void(0);" onClick="selectGame=null; selectSportId=-1; firstStart=1; showAllLiveBets1x2(-1);" style="color:#cccccc;">горячие</a></span>';
    if(kol) tmpFav += ' <span style="float:right;" onmouseover="javascript:onM=1;" onmouseout="javascript:onM=0;"><a href="javascript:void(0);" onclick="clearFav();" style="color:#cccccc;">'+lp[languageID]['clear']+'</a></span>';
    $('favCol').innerHTML = tmpFav;
    $('allFavor').innerHTML = rez;
}

clearFav = function()
{
    if(confirm(lp[languageID]['confirmDelFavorites']))
    {
        favorArray = new Array();
        setFav();
        updateFav();
    }
}

showAdd = function(obj, idGame, deltaY)
{
    deltaY = deltaY || 0;

    var scr = document.getElementById('allSport').scrollTop;
    var pos = $(obj).positionedOffset();

    curFav = idGame;

    el = $('fav');
    el.style.top = pos[1] + deltaY - scr + 'px';
    el.style.left = pos[0] - Math.round(parseInt(el.style.width)) + 'px';

    if(typeof favorArray[idGame] == 'undefined' || !favorArray[idGame])
        el.style.background = "url('/images/favorite_0.png') no-repeat 5px 5px";
    else
        el.style.background = "url('/images/favorite_1.png') no-repeat 5px 5px";
    el.show();
}

addFav = function()
{
    if(!curFav) return;
    el = $('fav');

    if(typeof favorArray[curFav] == 'undefined' || !favorArray[curFav])
    {
        favorArray[curFav] = 1;
        el.style.background = "url('/images/favorite_1.png') no-repeat 5px 5px";
    } else {
        favorArray[curFav] = 0;
        el.style.background = "url('/images/favorite_0.png') no-repeat 5px 5px";
    }

    setFav();
    if($("allFavor").visible()) hideAdd();
    updateFav();
}

testHideAdd1 = function()
{
    if(!h2) hideAdd();
    h1 = 0;
}

testHideAdd2 = function()
{
    if(!h1) hideAdd();
    h2 = 0;
}

hideAdd = function()
{
    el = $('fav');
    curFav = 0;
    el.hide();
}

getFav = function()
{
    new Ajax.Request('/dataLive/fav_live.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "t=get",
        method: "post",
        onComplete:function(request){
            if(request.status != 200) {
                //alert("Server is unavailable. Try again later.");
            } else {
                result = request.responseXML;

                var answer 		= result.getElementsByTagName('g');
                if(!answer.length) return;

                favorArray = new Array();
                for(var i = 0; i < answer.length; i++)
                {
                    var idGame = parseInt(answer[i].getAttribute('i'));
                    favorArray[idGame] = 1;
                }

                updateFav();
            }
        }
    });
}

setFav = function()
{
    var rez = '';
    for(var i in favorArray)
    {
        if(isNumber(i) && favorArray[i])
        {
            rez += i + "|";
        }
    }

    new Ajax.Request('/dataLive/fav_live.php', {
        requestHeaders: ["If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"],
        parameters: "t=set&d=" + rez,
        method: "post",
        onComplete:function(request){
            if(request.status != 200) {
                //alert("Server is unavailable. Try again later.");
            } else {
                req = request.responseText;
            }
        }
    });
}

setPNum = function(n)
{
    if (jQuery('#p' + n).length) {
        jQuery('#p' + nPage).hide();
        jQuery('#p' + n).show();

        if (jQuery('#np' + nPage).length) {
            jQuery('#np' + nPage).attr('class', 'npage');
            jQuery('#np' + n).attr('class', 'npageselect');
            nPage = n;
        }
    }
}

showSp = function(obj, text)
{
    var pos = $(obj).positionedOffset();

    el = $('spN');
    el.style.top = pos[1] + 5 + 'px';
    el.style.left = pos[0] + 240 + 'px';

    el.innerHTML = text;
    el.show();
}

hideSp = function()
{
    $('spN').hide();
}

dopValueUpdate = function(dopValue, txt, groupID, idSob)
{
    if (typeof(betID) == 'undefined' && idSob) betID = idSob;
    else idSob = 0;

    notPlus = new Array(0,3,6,10,12,13,15,17,20,21,22,23,24,27,28,29,30,33,34,57,60,69,87,88,89,95,96,102,104,105,106,110,113,114,124,125,127,129,130,135,136,137,138,139,141,148,150,152,154,168,172,174,176,182,345,347,381,387,389,391,405,413);
    if(notPlus.indexOf(parseInt(groupID, 10)) == -1) if(dopValue > 0) dopValue = "+" + parseFloat(dopValue); else dopValue = parseFloat(dopValue);

    if(groupID == 27)
    {
        if(Math.abs(dopValue) != dopValue) dopValue = '0:' + Math.abs(dopValue); else dopValue = Math.abs(dopValue) + ':0';
        txt = txt.replace("()", '('+dopValue+')');
    }
    if(groupID == 28 || groupID == 29 || groupID == 30 || groupID == 69 || groupID == 87 || groupID == 88 || groupID == 89 || groupID == 103 || groupID == 108 || groupID == 110 || groupID == 130)
    {
        var c0 = parseInt(dopValue, 10);
        var c1 = Math.round((dopValue - c0) * 1000);
        if(groupID == 103) {c0 += ':00'; c1 += ':59';}
        if(c0 < c1) dopValue = lp[languageID]['from'] + ' ' + c0 + ' ' + lp[languageID]['to'] + ' ' + c1;
        if(c0 == c1) dopValue = c0;
        if(c1 > 900) dopValue = lp[languageID]['from'] + ' ' + c0 + ' ' + lp[languageID]['andmore'];

        if ((idSport == 3 || idSport == 10) && groupID == 69)
            txt = txt.replace("()", '('+dopValue+') ' + lp[languageID]['point']);
        else
            txt = txt.replace("()", '('+dopValue+')');
    }

    if (groupID == 148 || groupID == 152 || groupID == 345) {
        var c0, c1, c2;
        c0 = parseInt(dopValue);
        c1 = c2 = Math.round((dopValue - c0) * 1000);
        c0 = c0 / 100;
        c1 += ':00';
        var addTime = 4;
        if (betID == 892 || betID == 893 || betID == 1262 || betID == 1263 || betID == 1268 || betID == 1269 || betID == 1282 || betID == 1283 || betID == 1288 || betID == 1289 || betID == 1298 || betID == 1299) addTime = 9;
        if (betID == 894 || betID == 895 || betID == 898 || betID == 899 || betID == 1264 || betID == 1265 || betID == 1270 || betID == 1271 || betID == 1284 || betID == 1285 || betID == 1290 || betID == 1291) addTime = 14;
        if (betID == 896 || betID == 897 || betID == 1266 || betID == 1267 || betID == 1280 || betID == 1281 || betID == 1286 || betID == 1287) addTime = 1;
        var plus = '', totalTime = c2 + addTime;
        if ((totalTime == 44 || totalTime == 89) && sportId == 1) plus = '+';
        c2 = totalTime + ':59' + plus;
        txt = txt.replace("()", "(" + c0 + ")").replace("()", c1).replace("()", c2);
    }

    if (groupID == 106 && betID == 825) {
        var textType = ' по буллитам';

        if (idSport == 1)
            textType = ' в серии пенальти';

        var c0 = parseInt(dopValue);
        txt = txt.replace("()", '(' + c0 + ')' + textType);
    }

    // Лидер после
    if (groupID == 405) {
        var textType = '';

        // Керлинг
        if (idSport = 46) {
            textType = ' эндов';
        }

        // Снукер
        if (idSport == 30) {
            textType = ' фреймов';
        }

        var c0 = parseInt(dopValue);
        txt = txt.replace("()", '(' + dopValue + ')' + textType);
    }

    // Победа в интервале, Забьёт в промежутке
    if (groupID == 347 || groupID == 381) {
        var c0, c1;
        c0 = parseInt(dopValue);
        c1 = Math.round((dopValue - c0) * 1000);
        c0 += ':00';
        c1 += ':59';
        txt = txt.replace("()", c0).replace("()", c1);
    }

    // Индивидуальный тотал серий, тотал серий
    if (groupID == 391 || groupID == 413) {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);

        if (c0 == c1 && c1 != 999)
            dopValue = '(' + c0 + ')';

        if (c0 != c1 && c1 != 999)
            dopValue = 'c (' + c0 + ') до (' + c1 + ')';

        if (c0 != c1 && c1 == 999)
            dopValue = '(' + c0 + ' ' + lp[languageID]['andmore'] + ')';

        txt = txt.replace("()", dopValue);
    }

    // Самая результативная серия
    if (groupID == 399) {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);

        dopValue = '(' + c0 + '-' + c1 + ')';

        if (c1 == 999)
            dopValue = '(' + c0 + ' ' + lp[languageID]['andmore'] + ')';

        txt = txt.replace("()", dopValue);
    }

    if(groupID == 124)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        txt = txt.replace("()", c0+':'+c1);
    }
    if(groupID == 0)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        if(c0 < c1) dopValue = c0 + ' - ' + c1;
        if(c0 == c1) dopValue = c0;
        txt = txt.replace("()", dopValue);
    }
    if(groupID == 96 || groupID == 113 || groupID == 114)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        txt = txt.replace('()', c1);
        txt = txt.replace('()', c0);
    }
    if(groupID == 95 || groupID == 125 || groupID == 141 || groupID == 154)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        txt = txt.replace('()', c0);
        txt = txt.replace('()', c1);
    }

    if(groupID == 33 || groupID == 34)
    {
        var c0 = parseInt(dopValue, 10);
        var c1 = Math.round((dopValue - c0) * 1000);
        gName = txt;
        gName = gName.replace('()', c0);
        gName = gName.replace('()', c1);
        txt = gName;
    }
    if(groupID == 124 && betID == 735)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        if(c0 > c1) {
            var num = 2;
            dopValue = '[' + c1 + ']';
        }
        else {
            var num = 1;
            dopValue = '[' + c0 + ']';
        }
        txt = txt.replace("()", num).replace("[]", dopValue);
    }

    if(groupID == 124 && betID == 737 )
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        if(c0 > c1) {
            var num = 1;
            dopValue = '[' + c1 + ':' + c1 + ']';
        }
        else {
            var num = 2;
            dopValue = '[' + c0 + ':' + c0 + ']';
        }
        txt = txt.replace("()", num);
        txt = txt.replace("[]", dopValue);
    }

    if (groupID == 135) {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        var pointName = lp[languageID]['spaceparty'];
        if(idSport == 4) pointName = lp[languageID]['spacegame'];
        if(idSport == 6) pointName = lp[languageID]['spaceset'];
        dopValue = c0 + ' (' + c1 + pointName +')';
        txt = txt.replace("()", dopValue);
    }

    if(groupID == 136)
    {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        dopValue = c0 + '-' + c1;
        txt = txt.replace("()", dopValue);
    }

    if(groupID == 139 && betID == 880) {
        var c0 = parseInt(dopValue);
        var c1 = Math.round((dopValue - c0) * 1000);
        if(c0 > c1 && c0 != 999) {
            var num = 1;
            dopValue = lp[languageID]['withscore'] + ' (' + c0 + ':' + c1 + ')';
        }
        if(c0 < c1 && c1 != 999) {
            var num = 2;
            dopValue = lp[languageID]['withscore'] + ' (' + c0 + ':' + c1 + ')';
        }
        if(c0 > c1 && c0 == 999) {
            var num = 1;
            dopValue = lp[languageID]['anotherscore'];
        }
        if(c0 < c1 && c1 == 999) {
            var num = 2;
            dopValue = lp[languageID]['anotherscore'];
        }
        txt = txt.replace("()", num);
        txt = txt.replace("[]", dopValue);
    }

    if(groupID == 143)
    {
        var c0 = parseInt(dopValue);
        txt = txt.replace("()", c0);
    }

    if(txt.indexOf('()') != -1) {
        if(notPlus.indexOf(parseInt(groupID)) == -1)
            txt = txt.replace("()", '('+dopValue+')');
        else
            txt = txt.replace("()", '('+parseFloat(dopValue)+')');
    }

    return txt;
}

set_summ_win = function()
{
    var bi = parseFloat($('bet_input').value);
    if(!bi) bi = 0;
    var sk = parseFloat($('summ_koef').innerHTML);
    if(!sk) sk = 0;
    $('summ_win').innerHTML = (bi * sk).toFixed(2);
}

set_err = function(err)
{
    return;
    new Ajax.Request('/live/er.php', {
        parameters: "er=" + err,
        method: "post",
        onComplete:function(request){
            if(request.status != 200) {
            } else {
            }
        }
    });
}

set_one_click = function()
{
    var expdate = new Date();
    FixCookieDate(expdate);
    expdate.setTime(expdate.getTime() + (720 * 60 * 60 * 100));
    SetCookie("one_click", $('one_click').checked, expdate, '/');
    if($('one_click').checked) {
        $('one_span').show();
        $('one_summa').value = GetCookie('one_summa_click') || '10';
    } else {
        $('one_span').hide();
    }
}

set_one_summa = function()
{
    var expdate = new Date();
    FixCookieDate(expdate);
    expdate.setTime(expdate.getTime() + (720 * 60 * 60 * 100));
    var val = parseFloat($('one_summa').value);
    if(isNaN(val)) val = 10;
    SetCookie("one_summa_click", val, expdate, '/');
    alerts(lp[languageID]['message'], '<img src="/images/gok.png" align="absmiddle"> ' + lp[languageID]['amountSet']);
}

addSum = function(sum) {
    var cur = $('one_summa').value || 0;
    if(cur == 10) cur = 0;
    $('one_summa').value = parseFloat(cur) + parseFloat(sum);
}

function handleMouseLeave(handler) {
    return function(e) {
        e = e || event; // IE
        var toElement = e.relatedTarget || e.toElement; // IE
        while (toElement && toElement !== this) {
            toElement = toElement.parentNode;
        }
        if (toElement == this) {
            return;
        }
        return handler.call(this, e);
    };
}

jQuery(document).ready(function(){
    if(GetCookie('one_click') == 'true') {
        $('one_click').checked = true;
        $('one_span').show();
        $('one_summa').value = GetCookie('one_summa_click') || '10';
    }

    document.getElementById('all_sum').onmouseout = handleMouseLeave(function(e) {
        e = e || event;
        $('all_sum').hide();
    });
});

showLiga = function(id) {
    var liga = $('liga_'+id);

    if(liga){
        if(liga.className == "hideLiga") {
            liga.className = "showLiga";
        }else{
            liga.className = "hideLiga";
        }
    }
    return;
}


// Минимальная сумма ставки для системы

SystemMinimumStake = function(outcomeNum, systemSize) {
    var uId = GetCookie('ua') || 0;
    var data = '{"Basis":' + systemSize + ',"Parameter":' + outcomeNum + ',"UserId":' + uId + '}';

    jQuery.ajax({
        url: '/LiveUtil/SystemMinimumStake',
        type: 'POST',
        contentType: 'application/json',
        data: data,
        success: function(data) {
            if (data.Success) {
                jQuery('#system_summ_mim span').html(data.Value);
                jQuery('#system_summ_mim').css('display', '');
            }
        }
    });
}

HideSystemMinimumStake = function() {
    jQuery('#system_summ_mim').css('display', 'none');
}