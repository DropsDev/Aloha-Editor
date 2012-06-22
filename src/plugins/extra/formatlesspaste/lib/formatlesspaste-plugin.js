/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define([
	'aloha/core',
	'aloha/plugin',
	'jquery',
	'ui/component', 
	'ui/toggleButton',
	'formatlesspaste/formatlesshandler',
	'aloha/contenthandlermanager',
	'i18n!formatlesspaste/nls/i18n',
	'i18n!aloha/nls/i18n',
	'ui/port-helper-floatingmenu',
	'css!formatlesspaste/css/formatless.css'
], function(Aloha,
            Plugin,
            jQuery,
            Component,
            ToggleButton,
            FormatlessPasteHandler,
            ContentHandlerManager,
            i18n,
            i18nCore,
            FloatingmenuPortHelper) {
	'use strict';

	// Public Methods
	return Plugin.create('formatlesspaste', {
		
		
		/**
		 * Configure Formatless pasting
		 */
		formatlessPasteOption: false, 
		
		/**
		 * Whether to display a button in the floating menu that allows to switch formatless pasting on and off
		 */
		button: true,
		
		//Here we removes the text-level semantic and edit elements (http://dev.w3.org/html5/spec/text-level-semantics.html#usage-summary)
		strippedElements : [
			"a",
			"em",
			"strong",
			"small",
			"s",
			"cite",
			"q",
			"dfn",
			"abbr",
			"time",
			"code",
			"var",
			"samp",
			"kbd",
			"sub",
			"sup",
			"i",
			"b",
			"u",
			"mark",
			"ruby",
			"rt",
			"rp",
			"bdi",
			"bdo",
			"ins",
			"del" 
		],

		/**
		 * Initialize the PastePlugin
		 */
		init: function() {
			var that = this;

			// look for old configuration directly in settings
			if ( typeof this.settings.formatlessPasteOption !== 'undefined') {
				this.formatlessPasteOption = this.settings.formatlessPasteOption;
			}
			
			if ( typeof this.settings.strippedElements !== 'undefined') {
				this.strippedElements = this.settings.strippedElements;
			}
			
			// look for newer config in settings.config
			if (this.settings.config) {
				if (this.settings.config.formatlessPasteOption) {
					this.formatlessPasteOption = this.settings.config.formatlessPasteOption;
				}
				if (this.settings.config.strippedElements) {
					this.strippedElements = this.settings.config.strippedElements;
				}
				if (this.settings.config.button === false) {
					this.button = false;
				}
			}
			
			this.registerFormatlessPasteHandler(); 
			var formatlessPasteHandlerLastState;
			Aloha.bind( 'aloha-editable-activated', function( event, params) {
				var config = that.getEditableConfig( params.editable.obj );
				if ( !config ) {
					return;
				}
				if ( config.strippedElements ) {
					FormatlessPasteHandler.strippedElements = config.strippedElements;
				}
				if (config.formatlessPasteOption === true) {
					//that.formatlessPasteButton.setState(true);
					FloatingmenuPortHelper.setStateTrueAll('toggleFormatlessPaste');
					FormatlessPasteHandler.enabled = true;
				} else if (config.formatlessPasteOption === false) {
					//that.formatlessPasteButton.setState(false);
					FloatingmenuPortHelper.setStateFalseAll('toggleFormatlessPaste');
					FormatlessPasteHandler.enabled = false;
				}
				if ( config.button === false ) {
					//that.formatlessPasteButton.hide();
					FloatingmenuPortHelper.hideAll('toggleFormatlessPaste');
				} else {
					//that.formatlessPasteButton.show();
					FloatingmenuPortHelper.showAll('toggleFormatlessPaste');
				}
			});
		},

		/**
		 * Register Formatless paste handler
		 */
		registerFormatlessPasteHandler: function(){
			ContentHandlerManager.register( 'formatless', FormatlessPasteHandler );
			FormatlessPasteHandler.strippedElements = this.strippedElements;
			// add button to toggle format-less pasting

			Component.define('toggleFormatlessPaste', ToggleButton, {
				tooltip: i18n.t('button.formatlessPaste.tooltip'),
				icon: 'aloha-icon aloha-icon-formatless-paste',
				scope: 'Aloha.continuoustext',
				click: function () { 
					//toggle the value of allowFormatless
					FormatlessPasteHandler.enabled = !FormatlessPasteHandler.enabled;
				}
			});

			//this.formatlessPasteButton = Component.getGlobalInstance("toggleFormatlessPaste");

			// activate formatless paste button if option is set
			if (this.formatlessPasteOption === true) {
				//this.formatlessPasteButton.setState(true);
				FloatingmenuPortHelper.setStateTrueAll('toggleFormatlessPaste');
				FormatlessPasteHandler.enabled = true;
			}
			
			// hide button by default if configured
			if (this.button === false) {
				//this.formatlessPasteButton.hide();
				FloatingmenuPortHelper.setStateFalseAll('toggleFormatlessPaste');
			}
		}
	});
});
