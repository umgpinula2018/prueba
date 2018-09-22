jQuery(document).on("ready", inicio);

function amigable()
{
	var urlmenu = window.location.hash.substr(2);
	
	if( urlmenu.length > 0 )
	{
		amigableMenu( urlmenu );
	}
	else
	{
		jQuery.get("main", cargarContenidoDinamico);
	}
}

function amigableMenu( layout )
{
	var datos = null;
	//bloquearUI( true );
	
	if(layout.length != undefined)
	{
    	console.info("Loading Layout: "+ layout);
    	
		jQuery.get( layout , datos, cargarContenidoDinamico )
			.fail(function()
			{
				//bloquearUI( false );
	    	});
  	}
  	else
  	{
   	 	console.error("No existe vista");
  	}
}

function cargarContenidoDinamico( html )
{
	jQuery("#contenido-dinamico")
		.html(html)
		.ready( cargarComponentes );
}

function cargarComponentes( e )
{

}

function inicio( e )
{
	amigable();
	jQuery(".data-menu").on("click", verificarMenu)
}

function verificarMenu( e )
{
	var layout = jQuery(this).data("menu");
	var datos = jQuery(this).data();
	//bloquearUI( true );
	datosVista = datos;
	
	if(layout.length != undefined)
	{
    	console.info("Loading Layout: "+ layout);
    	window.location.hash = "#/" + layout;
    	
		jQuery.get( layout , datos, cargarContenidoDinamico )
			.fail(function()
			{
				//bloquearUI( false );
	    	});
  	}
  	else
  	{
   	 	console.error("No existe vista");
  	}
  	
  	e.preventDefault();
}