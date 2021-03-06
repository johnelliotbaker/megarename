// ==UserScript==
// @name Mega Renamer
// @namespace Violentmonkey Scripts
// @match *://mega.nz/*
// @match *://192.168.2.12:999/*
// @version 0.0.9
// @require https://code.jquery.com/jquery-1.12.4.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @updateURL   https://raw.githubusercontent.com/johnelliotbaker/megarename/master/final.js
// @downloadURL https://raw.githubusercontent.com/johnelliotbaker/megarename/master/final.js
// ==/UserScript==


var data = [];

function createDialog()
{
    $body = $("body");
    $dialog = $('<dialog/>')
        .attr({ id: "myDlg", title: "Megalinks Renamer"})
        .css({ "max-width": "80%" })
        .appendTo($body);
    $dlgTop = $("<div/>");
    $dlgBody = $("<div/>")
        .attr({ id: "myDlgBody" })
        .css({
        display: "block", position: "relative",
        "margin-top": "10px",
        "max-height": "80vh",
        "overflow-y": "scroll",
        })
        .appendTo($dialog);
    var myDlg = document.getElementById("myDlg");
    return $dialog;
}

function initDialog($dialog)
{
    clearDialogContent($dialog);
    createTable($dialog);
}

function createTable($parent)
{
    $myDlgBody = $("#myDlgBody");
    $table = $('<table/>')
        .attr({ id: "myTable", style: "width: 100%", })
        .appendTo($myDlgBody);
    $tbody = $('<tbody/>')
        .attr({ id: "myTableBody"})
        .appendTo($myDlgBody);
    return $table
}

function createTr($parent, id="")
{
    $tr = $('<tr/>').appendTo($parent);
    return $tr
}

function createRow($parent, strn, size="")
{
    $td = $("<td/>").appendTo($parent);
    $textinput = $("<textarea/>")
    .attr({ cols: "35", rows: "2" })
    .css({ resize: "none", "font-size": "125%" })
    .html(strn)
    .appendTo($td);
    $parent.append($td);

    $td = $("<td/>").appendTo($parent);
    $textinput = $("<textarea/>")
    .attr({ cols: "5", rows: "2" })
    .css({ resize: "none", "font-size": "125%" })
    .addClass("ta_size")
    .html(size)
    .appendTo($td);

    $td = $("<td/>").appendTo($parent);
    $textinput = $("<button/>")
    .attr({ type: "button" })
    .html("Jezalify")
    .appendTo($td)
    .click(jezalify);
    $parent.append($td);

    $td = $("<td/>").appendTo($parent);
    $textinput = $("<button/>")
    .attr({ type: "button" })
    .html("copy")
    .appendTo($td)
    .click(copyToClipboard);
    $parent.append($td);

    // $td = $("<td/>").appendTo($parent);
    // $textinput = $("<button/>")
    // .attr({ type: "button" })
    // .html("Docify")
    // .appendTo($td)
    // .click(docify);
    // $parent.append($td);
}

function getTextArea($elem)
{
    $textarea = $elem.parentsUntil("tr").parent().find("textarea");
    return $textarea;
}

function jezalify(e)
{
    $curr = $(e.toElement);
    $textarea = getTextArea($curr);
    $titlearea = $($textarea[0]);
    var filename = $titlearea.val();
    $sizearea = $($textarea[1]);
    var size = $sizearea.val();
    var data = {"filename": filename, "size": size};
    $strn = generate2(data);
    $titlearea.val($strn);
}

function docify(e)
{
    $curr = $(e.toElement);
    $textarea = getTextArea($curr);
    $titlearea = $($textarea[0]);
    var filename = $titlearea.val();
    $sizearea = $($textarea[1]);
    var size = $sizearea.val();
    var data = {"filename": filename, "size": size};
    $strn = generate1(data);
    $titlearea.val($strn);
}

function copyToClipboard(e)
{
    // $curr = $(e.toElement);
    // $textarea = getTextArea($curr);
    $curr = $(e.toElement);
    $textarea = getTextArea($curr);
    $titlearea = $($textarea[0]);
    var filename = $titlearea.val();
    $sizearea = $($textarea[1]);
    var size = $sizearea.val();
    var data = {"filename": filename, "size": size};
    $titlearea.select()
    document.execCommand("copy");
    console.log("copied");
}

function loadData()
{
    data = searchData();
    updateContent(data);
}

function jezalifyAll()
{
    $tbody = $("#myTableBody");
    $tr = $tbody.find("tr");
    $tr.each(function(e)
        {
            $textarea = $($tr[e]).find("textarea");
            $titlearea = $($textarea[0]);
            var filename = $titlearea.val();
            $sizearea = $($textarea[1]);
            var size = $sizearea.val();
            var data = {"filename": filename, "size": size};
            $strn = generate2(data);
            $titlearea.val($strn);
        });
}

function docifyAll()
{
    $tbody = $("#myTableBody");
    $tr = $tbody.find("tr");
    $tr.each(function(e)
        {
            $textarea = $($tr[e]).find("textarea");
            $titlearea = $($textarea[0]);
            var filename = $titlearea.val();
            $sizearea = $($textarea[1]);
            var size = $sizearea.val();
            var data = {"filename": filename, "size": size};
            $strn = generate1(data);
            $titlearea.val($strn);
        });
}

function createTopMenu($parent)
{

    $div = $('<div align="center"><div/>').prependTo($parent);

    $checkbox = $("<input/>")
        .attr({ type: "checkbox", id: "cb_mega", name:"cb_mega" })
        .css({"opacity": "100"})
        .prop("checked", true)
        .appendTo($div)
    $label = $("<label/>")
        .html("mega").appendTo($div);


    $checkbox = $("<input/>")
        .attr({ type: "checkbox", id: "cb_size", name:"cb_size" })
        .css({"opacity": "100"})
        .prop("checked", true)
        .appendTo($div)
    $label = $("<label/>")
        .html("size").appendTo($div);


    $textinput = $("<button/>")
    .attr({ type: "button", id: "btn_load" })
    .html("Load")
    .appendTo($div)
    .click(loadData);

    $textinput = $("<button/>")
    .attr({ type: "button" })
    .html("Jezalify All")
    .appendTo($div)
    .click(jezalifyAll);

    // $textinput = $("<button/>")
    // .attr({ type: "button" })
    // .html("Docify All")
    // .appendTo($div)
    // .click(docifyAll);

    var myDlg = document.getElementById("myDlg");
    $textinput = $("<button/>")
    .attr({ type: "button" })
    .html("Close")
    .appendTo($div)
    .click(function(){
        myDlg.close();
    });

    return $div;
}

function createContent(aStrn)
{
    $dialog = createDialog();
    $top    = createTopMenu($dialog);
    $table  = createTable($dialog);
    $tbody  = $table.children()[0];
    updateContent(aStrn);
}

function updateContent(aStrn)
{
    $tbody = $("#myTableBody");
    $tbody.empty();
    for (var key in aStrn)
    {
        strnTitle = aStrn[key]['title'];
        strnSize = aStrn[key]['size'];
        $tr = createTr($tbody);
        createRow($tr, strnTitle, strnSize);
    }
}

REGEX = {
    "ext": /\b(\.\w+)$\b/gi,
    "sgroup": /\b(d-z0n3)$\b/gi,
    "rgroup": /\b-([a-zA-Z0-9]+)$\b/gi,
    "year": /\b(19|20)\d{2}\b/g,
    "resolution":/\b(576p|720p|1080p|2160p|4k|uhd)\b/gi,
    "audio": /\b(imax|atmos|hifi|truehd|dts-hd.ma.5.1|dts-hd|dts)\b/gi,
    "audioChannel": /\b(7\.1|5\.1|stereo|mono|dd5.1)\b/gi,
    "audioCodec": /\b(flac2.0|flac)\b/gi,
    "remux": /\b(remux)\b/gi,
    "video": /\b(avc|vc1|hdr)\b/gi,
    "videoSource": /\b(HDRip|bluray|blu-ray|bdrip|hdrip|webrip|web-dl|webdl)\b/gi,
    "videoCodec": /\b(x265|x264|hevc)\b/gi,
    "subtitle": /\b(multisub|korsub)\b/gi,
}


bModal = false;
bLoaded = false;


function extractField(strn, type){
    var regex = REGEX[type];
    var aResult = [];
    do {
        match = regex.exec(strn);
        if (match) {
            aResult.push(match[0]);
        }
    } while (match);
    return aResult;
}


function generate2(data)
{
    // preserve pattern
    var strn = data['filename'];
    var size = data['size'];
    strn = strn.replace(/([^\d])(\d)\.(\d)([^\d]|$)/gi, "$1$2***$3$4");
    strn = strn.replace(/(x|h)\.(264|265)/gi, "$1***$2");
    strn = normalizeWhitespace(strn);
    var field = extractField(strn, "ext");
    for (var key in field)
    {
        var value = field[key];
        strn = strn.replace(value, '');
    }
    strn = replacePattern(strn, [["\.", " "]]);
    var i = strn.search(REGEX["year"]);
    var arr = []
    arr.push(strn.slice(0, i).trim());
    arr.push("(" + strn.slice(i, i+4).trim() + ")");
    arr.push("(" + strn.slice(i+4).trim() + ")");
    strn = arr.join(" ");
    // restore preserved pattern
    var repl = [ ["***", "."], ]
    strn = replacePattern(strn, repl);
    // Optionally prepend [MEGA]
    if ($("#cb_mega").is(":checked"))
    {
        strn = "[MEGA] " + strn;
    }
    if ($("#cb_size").is(":checked"))
    {
        strn += " [" + size + "]";
    }
    var final = strn
    return final;
}
    

function generate1(data)
{
    var strn = data['filename'];
    var size = data['size'];
    strn = normalizeWhitespace(strn);
    var strnOriginal = strn;
    var aField = {};
    for (var regkey in REGEX){
        var value = REGEX[regkey];
        var field = extractField(strn, regkey);
        for (var key in field)
        {
            var value = field[key];
            strn = strn.replace(value, '');
        }
        aField[regkey] = field;
    }
    strn = replacePattern(strn, [['.', ' ']]);
    var title = normalizeWhitespace(strn).trim();
    var a = aField;
    var final = `${title} (${a['year']})`;
    final = appendVideo(final, aField);
    final = appendAudio(final, aField);
    final = appendSubtitle(final, aField);
    final = appendReleaseGroups(final, aField);
    final = normalizeWhitespace(final);
    return final;
}


function appendReleaseGroups(strn, a)
{
    var r = a['rgroup'][0];
    if (r) { r = r.replace('-', '') } 
    else {r = ""};
    var s = a['sgroup'][0] ? a['sgroup'][0] : '';
    var t = r + s;
    if (t)
    {
        return strn + `(${t})`
    }
    return strn;
}


function appendSubtitle(strn, a)
{
    var r = a['subtitle'];
    var t = r.concat().join(' ');
    if (t)
    {
        return strn + `(${t})`
    }
    return strn;
}


function appendAudio(strn, a)
{
    var r = a['audio'];
    var v = a['audioChannel'];
    var c = a['audioCodec'];
    var t = r.concat(v, c).join(' ');
    if (t)
    {
        return strn + `(${t})`
    }
    return strn;
}


function appendVideo(strn, a)
{
    var r = a['resolution'];
    var v = a['videoSource'];
    var c = a['videoCodec'];
    var m = a['remux'];
    var o = a['video'];
    var t = r.concat(v, c, m, o).join(' ');
    if (t)
    {
        return strn + `(${t})`
    }
    return strn;
}


function replacePattern(strn, aPattern)
{
    for (var key in aPattern)
    {
        ptn = aPattern[key];
        while (strn.indexOf(ptn[0]) > -1)
        {
            strn = strn.replace(ptn[0], ptn[1]);
        }
    }
    return strn;
}


function normalizeWhitespace(strn)
{
    return strn.replace(/\s+(?=\s)/g, '');
}

function formatString(strn)
{
    return generate1(strn);
}

function searchData()
{
    console.log("Searching Data");
    data = []
    $fn = $("span.filename");
    if ($fn.length > 0)
    {
        $fn.each(function(i){
            $elem = $($fn[i]);
            var title = $elem.text();
            var info = $('div[class="download info-txt small-txt"]');
            var size = info.html();
            entry = {title: title, size: size};
            if (title) data.push(entry);
        });
    }
    $fn = $("span.file-block-title");
    if ($fn.length > 0)
    {
        console.log($fn);
        $fn.each(function(i){
            $elem = $($fn[i]);
            console.log($elem);
            $p = $elem.parent();
            var title = $elem.text();

            var titleText = $p.attr("title");
            var size = /(\s|^)((\d+)(kb|mb|gb))\s/gi.exec(titleText);
            size = size[3] + " " + size[4];
            entry = {title: title, size: size};
            if (title) data.push(entry);
        });
    }
    $fn = $("span.tranfer-filetype-txt");
    if ($fn.length > 0)
    {
        $fn.each(function(i){
            $elem = $($fn[i]);
            var title = $elem.text();
            entry = {title: title, size: ""};
            if (title) data.push(entry);
        });
    }
    return data;
}

function main()
{
    loadData();
    createContent(data);
}

function KeyPress(e)
{
    var popup = document.getElementById("popup");
    var evtobj = window.event? event : e;
    var myDlg = document.getElementById("myDlg");
    // if (evtobj.keyCode == 32 && evtobj.ctrlKey) // "ctr" + "space"
    if (evtobj.keyCode == 192) // "`"
    {
        if (bModal)
        {
            myDlg.close();
        }
        else
        {
            loadData();
            myDlg.showModal();
        }
        bModal = !bModal;
    }
}
document.onkeydown = KeyPress;


var bProduction = true;
if (bProduction)
{
    setTimeout(function(){
        main();
    }, 100);
}
else
{
    var aStrn = [];
    aStrn.push("AAAAAAAAAAAAAA");
    aStrn.push("BBBBBBBBBBBBBB");
    aStrn.push("CCCCCCCCCCCCCC");
    aStrn.push("DDDDDDDDDDDDDD");
    aStrn.push("EEEEEEEEEEEEEE");
    createContent(aStrn);
}
