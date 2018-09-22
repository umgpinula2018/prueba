jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;
	// Propiedades
	window.tabla= $('.datatable').dataTable(
	{
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

	$('#loader').fadeOut();
	//Eventos
	$('#nuevo_activo').on('click',function(){
		$('#form-crear').validate().resetForm();
		$('#codigo').val('');
		$('#descripcion').val('');
		$('#ubicacion').val('');

		$('#codigo').removeClass('valid');
		$('#descripcion').removeClass('valid');
		$('#ubicacion').removeClass('valid');

		$('#codigo').removeClass('error');
		$('#descripcion').removeClass('error');
		$('#ubicacion').removeClass('error');
	});
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);

	//Funciones
	function store( e )
	{
		e.preventDefault();
		if ($('#form-crear').valid()) {
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/donaciones/activos',
				data: 		datos,
				success: function( result )
				{
					if( result.result )
					{
						$('#modal-crear').modal('hide');
						setTimeout( function(){ amigable(); }, 500);  
						toastr['success'](result.message, 'Éxito');
					}
					else
					{
						toastr['error'](result.message, 'Error');
					}
				},
				error: 	function( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	}

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			var datos = $('#form-editar').serialize();
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/donaciones/activos/'+idregistro,
				dataType: 	'json',
				data: 		datos,
				success: function ( result )
				{
					if( result.result )
					{
						setTimeout( function(){ amigable(); }, 500);  						
						toastr['success'](result.message, 'Éxito')
				        $('#modal-editar').modal('hide'); 
					}
					else
					{
						toastr['error'](result.message, 'Error');
					}
				},
				error: function ( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	}

	$("#tabla-registros").on('click', 'a.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("idregistro");
	});

	function destroy( e )
	{
		e.preventDefault();
		$('#loader').fadeIn();
		$.ajax
		({
			type:	"DELETE",
			url:	"ws/donaciones/activos/"+ideliminar,
			success: function( result )
			{
				if( result.result )
				{
					// $('#loader').fadeOut();
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-eliminar").modal('hide');
				}
				else
				{
					toastr['error'](result.message, 'Error');
					$('#loader').fadeOut();
				}
			},
			error: function( result )
			{
				$('#loader').fadeOut();
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		$('#form-editar #ubicacion').removeClass('valid');
		$('#form-editar #ubicacion').removeClass('error');
		$('#form-editar #codigo').removeClass('valid');
		$('#form-editar #codigo').removeClass('error');
		$('#form-editar #activo').removeClass('valid');
		$('#form-editar #activo').removeClass('error');
		$('.error').remove();

		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/donaciones/activos/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #activo").val(result.records[0].descripcion);
		            $("#form-editar #codigo").val(result.records[0].codigo);
		            $("#form-editar #ubicacion").val(result.records[0].ubicacion);
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#btn-modal-excel').on('click', function(){
		$('#form-importar').validate().resetForm();
	});

	$('#btn-cargarlistaact').on('click', function( e )
	{
		e.preventDefault();
		if ($('#form-importar').valid()) {
			if( !subio )
			{
				subio = true;
				$('#loader').fadeIn();
				// toastr[ 'warning' ]( 'Este proceso puede tardar varios minutos, espere a que la pagina se recarge' , 'Espere' );
				var formData = new FormData($('#form-importar')[0]);
			    $.ajax(
			    {
			        type: 			'POST',
			        dataType: 		'json',
			        url: 			'ws/donaciones/cargaractivos',  
			        cache: 			false,
			        contentType: 	false,
			        processData: 	false,
				    data: 			formData,
			        success: function( result )
				        {
				        	if( result.result )
				        	{
				        		// $('#loader').fadeOut();
					        	toastr['success']( result.message , 'Éxito' );
								setTimeout( function(){ amigable(); }, 500);
								$('#modal-excel').modal('hide');
							}
							else
							{
								$('#loader').fadeOut();
								toastr['error']( result.message , 'Espera' );
								// setTimeout( function(){ amigable(); }, 500);
								$('#modal-excel').modal('hide');
							}
				        },
			        error: function( e )
				        {
				        	$('#loader').fadeOut();
							toastr[ 'error' ]( 'Ocurrió un problema, intenta de nuevo' , 'Error' );
				        }		        
			    });
			}
			else
				toastr[ 'danger' ]( 'Actualice la página, por seguridad solo se permite subir un archivo a la vez' , 'Espere' );
		} 
	});
});