/*==============================================================================
This Wikiwyg mode supports a preview of current changes

COPYRIGHT:

    Copyright (c) 2005 Socialtext Corporation 
    655 High Street
    Palo Alto, CA 94301 U.S.A.
    All rights reserved.

Wikiwyg is free software. 

This library is free software; you can redistribute it and/or modify it
under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 2.1 of the License, or (at
your option) any later version.

This library is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser
General Public License for more details.

    http://www.gnu.org/copyleft/lesser.txt

 =============================================================================*/

proto = new Subclass('Wikiwyg.Preview', 'Wikiwyg.Mode');

proto.classtype = 'preview';
proto.modeDescription = 'Preview';

proto.config = {
    divId: null
}

proto.initializeObject = function() {
    if (this.config.divId)
        this.div = document.getElementById(this.config.divId);
    else
        this.div = document.createElement('div');
    // XXX Make this a config option.
    this.div.style.backgroundColor = 'lightyellow';
}

proto.enableThis = function() {
    Wikiwyg.Mode.prototype.enableThis.apply(this, arguments);
    jQuery('table.sort', this.div)
        .each(function() {
            Socialtext.make_table_sortable(this);
        });
}

proto.toHtml = function(func) {
    func(this.div.innerHTML);
}

proto.disableStarted = function() {
    this.wikiwyg.divHeight = this.div.offsetHeight;
}

proto.enableStarted = function() {
    jQuery('#st-edit-mode-container').addClass('preview');
}

proto.disableFinished = function() {
    jQuery('#st-edit-mode-container').removeClass('preview');
}

proto.fromHtml = function(html) {
    this.div.innerHTML = html;
    this.div.style.display = 'block';
    this.wikiwyg.enableLinkConfirmations();
    if (/SyntaxHighlighter\.all/.test(html)) {
        $('#st-page-preview script[src]').each(function(){
            $.getScript($(this).attr('src'), function(){
                var _alert = window.alert;
                SyntaxHighlighter.vars.discoveredBrushes = null;
                window.alert = function(){};
                SyntaxHighlighter.highlight();
                window.alert = _alert;
            })
        });

    }
}

