jQuery( document ).ready( function( $ )
{
	 
	$( "#btn-importar" ).on( "click" , importarExcel ); 
	$("#tabla-registros").DataTable({
        "oLanguage": {
            "sLengthMenu": "Mostrando _MENU_ filas",
            "sSearch": "",
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });
    
	$('#loader').hide();

	$( ':file' ).change( function()
	{
	    var file = this.files[0];
	    var name = file.name;
	    var size = file.size;
	    var type = file.type;
	    
	});

	$('#tipo').empty();
    $('#tipo').append('<option value="0" >Seleccione un Tipo de Carga</option>'); 
	$('#tipo').append('<option value="1">Reserva Conchal</option>'); 
	$('#tipo').append('<option value="2">IAK Guatemala</option>'); 
	$('#tipo').append('<option value="3">Musmanni</option>'); 
	$('#tipo').append('<option value="4">Florida Bebidas</option>'); 
    $('#tipo').trigger("chosen:updated");
	
	var subio = false;
	
	function importarExcel(e)
	{
	   if($('#tipo').val() != 0 )
	   {
			e.preventDefault();
			if( !subio )
			{
				subio = true;
				toastr[ "warning" ]( "Este proceso puede tardar varios minutos, espere a que la pagina se recarge" , "Espere!" );
				var formData = new FormData($('#form-importar')[0]);
				
			    $.ajax(
			    {
			        url: 'ws/voluntariados/cargaintegrantes',  //Server script to process data
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
							setTimeout( function() { $.get( "voluntariados/carga" , function( data ) { $('#contenido-dinamico').html( data ); } ); } , 500 );
						}
						else
						{
							toastr[ "error" ]( e.message , "Espera!" );
							console.log(e.message);
							$('#modal-importar').modal('hide');
							setTimeout( function() { $.get( "voluntariados/carga" , function( data ) { $('#contenido-dinamico').html( data ); } ); } , 500 );
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
			{
				 
				toastr[ "error" ]( "Actualice la página, por seguridad solo se permite subir un archivo a la vez" , "Espera" );
		 
			} 
		}
		else
		{
			toastr[ "error" ]( "Seleccione un tipo de carga." , "Espere!" );
		}

	}
	
	function progressHandlingFunction(e)
	{
	    if(e.lengthComputable){
	    	
	        $('progress').attr({value:e.loaded,max:e.total});
	        $("#barra-progreso").attr("style",'width:'+e.loaded+"%");
	        
	    }
	}
	

});