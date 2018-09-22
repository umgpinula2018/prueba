
jQuery( document ).ready( function( $ )
{
	window.loader = $("#fakeloader").fakeLoader(
	{
	    timeToHide:1200, //Time in milliseconds for fakeLoader disappear
	    zIndex:"9999",//Default zIndex
	    spinner:"spinner1",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
	    bgColor:"rgba(53, 56, 54, 0.498039)", //Hex, RGB or RGBA colors
	}).show();
})