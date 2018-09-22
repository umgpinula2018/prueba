jQuery( document ).ready( function( $ )
{
	 
	$( "#btn-importar" ).on( "click" , importarExcel ); 
	
	var subio = false;
	
	function importarExcel(e)
	{
		e.preventDefault();
		if( !subio )
		{
			subio = true;
			toastr[ "warning" ]( "Este proceso puede tardar varios minutos, espere a que la pagina se recarge" , "Espere!" );
			var formData = new FormData($('#form-importar')[0]);
		    $.ajax(
		    {
		        url: 'ws/activos/cargaexcel',  //Server script to process data
		        type: 'POST',
		        xhr: function() 
		        {  // Custom XMLHttpRequest
		            var myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload)
		            { // Check if upload property exists
		                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
		            }
		            return myXhr;
		        },
		        beforeSend: function()
		        {
					//$.gritter.add({title:'Error',text:"BEFORE",class_name:'growl-danger'});
					$("#barra-progreso").attr("style",'width:0%');
		        },
		        success: function(e)
		        {
		        	if(e.result)
		        	{
			        	toastr[ "success" ]( e.message , "Exito!" );
						$('#modal-importar').modal('hide');
						setTimeout( function(){ window.location.reload();}, 500); 
					}
					else
					{
						toastr[ "error" ]( e.message , "Espera!" );
						$('#modal-importar').modal('hide');
						setTimeout( function(){ window.location.reload();}, 500); 
					}
		        },
		        error: function(e)
		        {
		        	console.log(e);
					toastr[ "error" ]( "Todos los campos son requeridos" , "Error!" );
		        },
		        // Form data
		        data: formData,
		        cache: false,
		        contentType: false,
		        processData: false
		    });
		}
		else
			toastr[ "error" ]( "Actualice la página, por seguridad solo se permite subir un archivo a la vez" , "Espera" );
	}
	
	function progressHandlingFunction(e)
	{
	    if(e.lengthComputable){
	    	
	        $('progress').attr({value:e.loaded,max:e.total});
	        $("#barra-progreso").attr("style",'width:'+e.loaded+"%");
	        
	    }
	}
	

});