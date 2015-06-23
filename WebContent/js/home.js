/*******************************************************************************
 * Licensed Materials - Property of IBM (c) Copyright IBM Corporation 2014. All
 * Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights: Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 ******************************************************************************/

/*
 * This script is not an AMD module, but is the main driver for this page.
 * However it has dependencies, so we use the require() function to load those,
 * then initialize the page.
 */

require(
		[ "i18n!nls/messages"],
		function(messages) {

			_.templateSettings = {
				interpolate : /<@=([\s\S]+?)@>/g,
				evaluate : /<@([\s\S]+?)@>/g,
				escape : /<@-([\s\S]+?)@>/g
			};

			var baseUrl = window.location.protocol + '//' + window.location.host + $(document).data("context_path");
			var allPageIds = [ "#generate-template-page" ];

			function switchPageTo(showPageId) {
				allPageIds.forEach(function(id) {
					if (showPageId != id) {
						$(id).empty();
						$(id).addClass("hide");
					}
				});

				// we might not need this code in production as the call will be
				// made to
				// the server to fetch the data for the request page, thus
				// avoiding the flasing effect
				var delay = 100; // in milliseconds
				setTimeout(function() {
					return $(showPageId).removeClass("hide");
				}, delay);
			}

			function changeTitle(newTitle) {
				if (!newTitle) {
					return;
				}

				$("head title").text(messages.rpe + " - " + newTitle);
			}

			function doGenerate() {
				switchPageTo("#generate-template-page");
				changeTitle(messages.generatePageTitle);

				var url = location.href.split("#")[0] + "?action=generate";
				$("#generate-template-page").load(url, function() {
					require.undef("generate-template");
					require([ "generate-template" ]);
				});
			}

			function attachHandlers() {
				
			}

			// Backbone router initialization
			function initializeRouter() {
				var Router = Backbone.Router.extend({
					routes : {
						'generate' : 'generate',
					},

					generate : function() {
						doGenerate();
					},
				});

				new Router();

				Backbone.history.start();
			}

			initializeRouter();
			attachHandlers();
			location.hash ="#generate";
		});