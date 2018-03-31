/**
 * Draw.io Plugin to create OPM Diagramms
 * This is still work in progress.
 *
 * LOAD library by rawgit reference:
 *
  * https://rawgit.com/brendanhall/opm-drawio/master/opm-drawio.js
 * Based on original C4 example by  Tobias Hochgürtel
 * https://raw.githubusercontent.com/tobiashochguertel/draw-io/master/C4-drawIO.xml
 */
Draw.loadPlugin(function (ui) {
     var sidebar_id = 'stpa';
    var sidebar_title = 'STPA Notation';

    var stpaUtils = {};
    stpaUtils.is = function (cell) {
        return (cell &&
            cell.hasOwnProperty('') &&
            (cell.stpa !== null));
    };
    stpaUtils.isModel = function (cell) {
        return (stpaUtils.is(cell) &&
            cell &&
            cell.hasOwnProperty('value') &&
            (cell.value &&
                cell.value.hasAttribute('stpaType'))
        );
    };
    
    stpaUtils.registCodec = function (func) {
        var codec = new mxObjectCodec(new func());
        codec.encode = function (enc, obj) {
            try {
                var data = enc.document.createElement(func.name);
            } catch (e) {
                (window.console && console.error(e));
            }
            return data
        };
        codec.decode = function (dec, node, into) {
            return new func();
        };
        mxCodecRegistry.register(codec);
    };

    stpaStateHandler = function (state) {
        mxVertexHandler.apply(this, arguments);
    };
    stpaStateHandler.prototype = new mxVertexHandler();
    stpaStateHandler.prototype.constructor = stpaStateHandler;
    stpaStateHandler.prototype.domNode = null;
    stpaStateHandler.prototype.init = function () {
        mxVertexHandler.prototype.init.apply(this, arguments);
        this.domNode = document.createElement('div');
        this.domNode.style.position = 'absolute';
        this.domNode.style.whiteSpace = 'nowrap';
        if (this.custom) this.custom.apply(this, arguments);
        var img = stpaUtils.createSettingsIcon();
        mxEvent.addGestureListeners(img,
            mxUtils.bind(this, function (evt) {
                mxEvent.consume(evt);
            })
        );
        this.domNode.appendChild(img);
        this.graph.container.appendChild(this.domNode);
        this.redrawTools();
    };
    stpaStateHandler.prototype.redraw = function () {
        mxVertexHandler.prototype.redraw.apply(this);
        this.redrawTools();
    };
    stpaStateHandler.prototype.redrawTools = function () {
        if (this.state !== null && this.domNode !== null) {
            var dy = (mxClient.IS_VML && document.compatMode === 'CSS1Compat') ? 20 : 4;
            this.domNode.style.left = (this.state.x + this.state.width - this.domNode.children.length * 14) + 'px';
            this.domNode.style.top = (this.state.y + this.state.height + dy) + 'px';
        }
    };
    stpaStateHandler.prototype.destroy = function (sender, me) {
        mxVertexHandler.prototype.destroy.apply(this, arguments);
        if (this.domNode !== null) {
            this.domNode.parentNode.removeChild(this.domNode);
            this.domNode = null;
        }
    };

    
    stpaControlAction = function () {
    };
    stpaControlAction.prototype.handler = stpaStateHandler;
    stpaControlAction.prototype.create = function () {
        var label = '<div style="text-align: left"><div style="text-align: center">Control Action</div>;'
        var cell = new mxCell('', new mxGeometry(0, 0, 160, 0), 'edgeStyle=none;rounded=0;html=1;entryX=0;entryY=0;jettySize=auto;orthogonalLoop=1;strokeColor=#6c8ebf;strokeWidth=2;fontColor=#000000;jumpStyle=none;dashed=0;');
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        cell.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        cell.geometry.relative = true;
        cell.edge = true;
        cell.value.setAttribute('label', label);
        cell.value.setAttribute('stpaType', 'Control Action');
        cell.stpa = this;
        return cell;
    };
    stpaUtils.registCodec(stpaControlAction);


   stpaFeedback = function () {
    };
    stpaFeedback.prototype.handler = stpaStateHandler;
    stpaFeedback.prototype.create = function () {
        var label = '<div style="text-align: left"><div style="text-align: center">Feedback</div>;'
        var cell = new mxCell('', new mxGeometry(0, 0, 160, 0), 'edgeStyle=none;rounded=0;html=1;entryX=0;entryY=0;jettySize=auto;orthogonalLoop=1;strokeColor=#6c8ebf;strokeWidth=2;fontColor=#000000;jumpStyle=none;dashed=1;');
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        cell.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        cell.geometry.relative = true;
        cell.edge = true;
        cell.value.setAttribute('label', label);
        cell.value.setAttribute('stpaType', 'Feedback');
        cell.stpa = this;
        return cell;
    };
    stpaUtils.registCodec(stpaFeedback);

    stpaController = function () {
    };
    stpaController.prototype.handler = stpaStateHandler;
    stpaController.prototype.create = function () {
        var cell = new mxCell('', new mxGeometry(0, 70, 160, 110), 'rounded=0;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=7;strokeColor=#6c8ebf;shadow=0');
        // 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=3;strokeColor=#000000;verticalAlign=bottom;shadow=1');
        cell.setVertex(true);
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.setAttribute('label', '<div style="text-align: left">Controller</div>');
        cell.setAttribute('placeholders', '1');
        cell.setAttribute('opmName', 'State');
        cell.setAttribute('stpaType', 'stpaController');
        cell.stpa = this;
        return cell;
    };

    stpaUtils.registCodec(stpaController);

  stpaControlledProc = function () {
    };
    stpaControlledProc.prototype.handler = stpaStateHandler;
    stpaControlledProc.prototype.create = function () {
        var cell = new mxCell('', new mxGeometry(0, 70, 160, 110), 'rounded=0;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=7;strokeColor=#6c8ebf;shadow=0');
        // 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=3;strokeColor=#000000;verticalAlign=bottom;shadow=1');
        cell.setVertex(true);
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.setAttribute('label', '<div style="text-align: left">Controlled Process</div><div>Description</div>'');
        //name<div>[Person]</div><div><br></div><div>Beschreibung</div>'
        cell.setAttribute('placeholders', '1');
        cell.setAttribute('opmName', 'State');
        cell.setAttribute('stpaType', 'stpaControlledProc');
        cell.stpa = this;
        return cell;
    };

    stpaUtils.registCodec(stpaControlledProc);


  stpaActuation = function () {
    };
    stpaActuation.prototype.handler = stpaStateHandler;
    stpaActuation.prototype.create = function () {
        var cell = new mxCell('', new mxGeometry(0, 70, 160, 110), 'rounded=0;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=7;strokeColor=#6c8ebf;shadow=0');
        // 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=3;strokeColor=#000000;verticalAlign=bottom;shadow=1');
        cell.setVertex(true);
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.setAttribute('label', '<div style="text-align: left">Actuation</div>');
        cell.setAttribute('placeholders', '1');
        cell.setAttribute('opmName', 'State');
        cell.setAttribute('stpaType', 'stpaActuation');
        cell.stpa = this;
        return cell;
    };

    stpaUtils.registCodec(stpaActuation);


  stpaSensing = function () {
    };
    stpaSensing.prototype.handler = stpaStateHandler;
    stpaSensing.prototype.create = function () {
        var cell = new mxCell('', new mxGeometry(0, 70, 160, 110), 'rounded=0;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=7;strokeColor=#6c8ebf;shadow=0');
        // 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=3;strokeColor=#000000;verticalAlign=bottom;shadow=1');
        cell.setVertex(true);
        cell.setValue(mxUtils.createXmlDocument().createElement('object'));
        cell.setAttribute('label', '<div style="text-align: left">Sensing</div>');
        cell.setAttribute('placeholders', '1');
        cell.setAttribute('opmName', 'State');
        cell.setAttribute('stpaType', 'stpaSensing');
        cell.stpa = this;
        return cell;
    };

    stpaUtils.registCodec(stpaSensing);




    // Adds custom sidebar entry
    ui.sidebar.addPalette(sidebar_id, sidebar_title, true, function (content) {
        var verticies = [stpaController,stpaControlledProc,stpaSensing,stpaActuation];
        for (var i in verticies) {
            var cell = verticies[i].prototype.create();
            content.appendChild(ui.sidebar.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, cell.label));
        }
        content.appendChild(ui.sidebar.createEdgeTemplateFromCells([stpaControlAction.prototype.create()], 160, 0, 'Control Action'));
        content.appendChild(ui.sidebar.createEdgeTemplateFromCells([stpaFeedback.prototype.create()], 160, 0, 'Feedback'));
    });

});
