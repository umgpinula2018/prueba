jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;
	$('#loader').show();
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
	$('#btn-nuevo').on('click',function(){
		$('#codigo').val('');
		$('#descripcion').val('');
		$('#unidad').val('');

		$('#codigo').removeClass('valid');
		$('#codigo').removeClass('error');
		$('#descripcion').removeClass('valid');
		$('#descripcion').removeClass('error');
		$('#unidad').removeClass('valid');
		$('#unidad').removeClass('error');
		$('.error').remove();

	});
	//Eventos
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);

	//Funciones
	function store( e )
	{
		e.preventDefault();
		var datos = $('#form-crear').serialize();
		if ($('#form-crear').valid()) { 
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/donaciones/productos',
				data: 		datos,
				success: function( result )
					{
						if( result.result )
						{
							$('#modal-crear').modal('hide');
							toastr['success'](result.message, 'Éxito');
							setTimeout( function(){ amigable(); }, 500);  
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
				url: 		'ws/donaciones/productos/'+idregistro,
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
			url:	"ws/donaciones/productos/"+ideliminar,
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
					$('#loader').fadeOut();
					toastr['error'](result.message, 'Error');
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
		$('#form-editar #codigo').removeClass('valid');
		$('#form-editar #codigo').removeClass('error');
		$('#form-editar #producto').removeClass('valid');
		$('#form-editar #producto').removeClass('error');
		$('#form-editar #unidad').removeClass('valid');
		$('#form-editar #unidad').removeClass('error');
		$('.error').remove();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/donaciones/productos/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #producto").val(result.records[0].descripcion);
		            $("#form-editar #codigo").val(result.records[0].codigo);
		            $("#form-editar #unidad").val(result.records[0].unidad);
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

	$('.btn-importar').on('click',function(){
		$('#form-importar').validate().resetForm();
	});

	$('#btn-cargarlistapro').on('click', function( e )
	{
		e.preventDefault();
		if ($('#form-importar').valid()) {
			if( !subio )
			{
				subio = true;
				// toastr[ 'warning' ]( 'Este proceso puede tardar varios minutos, espere a que la pagina se recarge' , 'Espere' );
				$('#loader').fadeIn();
				var formData = new FormData($('#form-importar')[0]);
			    $.ajax(
			    {
			        type: 			'POST',
			        dataType: 		'json',
			        url: 			'ws/donaciones/cargarproductos',  
			        cache: 			false,
			        contentType: 	false,
			        processData: 	false,
				    data: 			formData,
			        success: function( result )
			        {
			        	if( result.result )
			        	{
				        	toastr['success']( result.message , 'Éxito' );
							setTimeout( function(){ amigable(); }, 500);
							// $('#loader').fadeOut();
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
			        error: function( err )
			        {
			        	console.log( err );
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