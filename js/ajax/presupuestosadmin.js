jQuery(document).ready(function( $ )
{
	$('#loader').fadeOut();
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	window.tabla_registros = $('.datatable').DataTable(
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
	
	llenarTabla();
	llenarCecos('#form-crear #cecos');
	llenarUsuarios('#form-crear #idusuario');
	llenarUsuarios('#form-duplicar #duplicado_idusuarios');
	llenarCecos('#form-editar #edit_cecos');
	llenarCecos('#form-duplicar #duplicado_cecos');

	$('#btn-nuevo').on('click', function(e){
		$('#form-crear')[0].reset();
		$('#transaccion').val('');
		$('#manual1').hide();
		$('#manual2').hide();
		$('#excel').hide();
		$('#btn-crear').attr('disabled','true');
	});

	$('#ing-manual').on('click', function(e){
		e.preventDefault();
		$('#transaccion').val('manual');
		$('#manual1').show();
		$('#manual2').show();
		$('#excel').hide();
		$('#btn-crear').removeAttr('disabled');
	});

	$('#ing-excel').on('click', function(e){
		e.preventDefault();
		$('#transaccion').val('excel');
		$('#excel').show();
		$('#manual1').hide();
		$('#manual2').hide();
		$('#btn-crear').removeAttr('disabled');
	});

	function llenarTabla()
	{
		$.ajax(
		{
			type:  		'GET',
			url: 		'ws/presupuestos/administradores',
			dataType: 	'json',
		})
		.done( function( data )
		{
			if( data.result )
			{
				var cont = 0; var acciones = '';
				$.each(data.records, function( index, value )
				{	
					if (value.usuario) {
						if( value.usuario.presupuestos_aprobadores == 1 && value.usuario.presupuestos == 1 ){
							col1 = ++cont;
							col2 = value.usuario.nombre;
							col3 = value.usuario.email;
							col4 = value.cecos;
							col5 = 	'<td>'+
										'<a title = "Editar" class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
								    	'<a title = "Eliminar" style=" margin: 5px;" class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>'+
								    	'<a title = "Duplicar CECOS" class="btn btn-success btn-xs btn-duplicar" href="#modal-duplicar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-copy "></i></a>'+
									'</td>'
							window.tabla_registros.row.add([col1,col2,col3,col4,col5]).draw(false);
						}
						else
						{
							console.log( value.usuario.nombre );
						}
					} else {

					}
				});
			}
			else
				console.log( data.message );
		})
		.fail( function( err ) 
		{
			console.log( err );
		})
		.always( function()
		{
			$('#loader').fadeOut(); 
		});
	}

	function llenarCecos(selector)
	{
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/cecos/lista',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$.each(data.records.TI_CECO.item, function( index, value )
				{
					$(selector).append($("<option />").val(value.KOSTL).text(value.LTEXT+' - '+value.KOSTL));
				});
				
				$(selector).select2({ });
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	}

	function llenarUsuarios( selector )
	{
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/presupuestos/administradores/lista',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$(selector).append($("<option />").val('0').text('Seleccione un usuario'));
				
				$.each(data.records, function(index, value)
				{
					$(selector).append($("<option />").val(value.id).text(value.email+' - '+value.nombre));
				});
				
				$(selector).select2({ });
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	}

	// ------------------------------------------------------------------------------------ CREAR NUEVO APROBADOR ----------------------------------------------------------------------------------------------------------------
	$('#btn-crear').on('click', function( e )
	{
		e.preventDefault();
		jQuery('#loader').show();
		if( $('#transaccion').val() == 'excel' )
		{
			if( $('#data').val() )
			{
				var formData = new FormData( $('#form-crear')[0] );
				$.ajax(
				{
					type: 	'POST',
					url: 	'ws/presupuestos/administradores',
					data: 	formData,
					async: false,
	            	cache: false,
	            	contentType: false,
	            	processData: false,
				})
				.done(function( data )
				{
					console.log(data.records);
					if( data.result )
					{	
						$('#modal-crear').modal('hide'); 
		                setTimeout( function(){ amigable(); }, 500);
		                if(data.records)
		                	toastr['success']('Se agregó '+data.records.nuevo+' y actualizó '+data.records.actualizar+', correctamente', 'Éxito')
		                else
		                	toastr['success'](data.message, 'Éxito')
					}
					else
						toastr['error'](data.message, 'Error')
				})
				.fail(function( err )
				{
					console.log( err );
				})
				.always(function() { 
					jQuery('#loader').fadeOut();
				});
			}
			else
				toastr['error']('Hace falta el archivo de excel', 'Error');
		}
		else
		{
			if( $('#cecos').val() && $('#idusuario').val() )
			{
				cecos 		= 	$('#cecos').val().join();
				idusuario 	=	$('#idusuario').val();
				$.ajax(
				{
					type: 	'POST',
					url: 	'ws/presupuestos/administradores',
					data: 	'cecos='+cecos+'&idusuario='+idusuario+'&transaccion='+$('#transaccion').val(),
				})
				.done(function( data )
				{
					console.log(data);
					if( data.result )
					{	
						$('#modal-crear').modal('hide'); 
		                setTimeout( function(){ amigable(); }, 500);  
		                toastr['success'](data.message, 'Éxito')
					}
					else
						toastr['error'](data.message, 'Error')
				})
				.fail(function( err )
				{
					console.log( err );
				})
				.always(function() { });
			}
			else
				toastr['error']('Hacen falta datos', 'Error');
		}


		// var formData = new FormData( $('#form-crear')[0] );
		// if( $('#cecos').val() )
		// 	cecos=$('#cecos').val().join();
		// else
		// 	cecos='';


		// if( ( $('#cecos').val() && $('#idusuario').val() )  ||  ( $('#data').val() ) )
		// {
		// 	$.ajax(
		// 	{
		// 		type: 	'POST',
		// 		url: 	'ws/presupuestos/administradores',
		// 		data: 	formData,/*'form='+formData+'&cecos='+cecos+'&idusuario='+$('#idusuario').val(),*/
		// 		async: false,
  //           	cache: false,
  //           	contentType: false,
  //           	processData: false,
		// 	})
		// 	.done(function( data )
		// 	{
		// 		console.log(data);
		// 		if( data.result )
		// 		{	
		// 			$('#modal-crear').modal('hide'); 
	 //                setTimeout( function(){ amigable(); }, 500);  
	 //                toastr['success'](data.message, 'Éxito')
		// 		}
		// 		else
		// 			toastr['error'](data.message, 'Error')
		// 	})
		// 	.fail(function( err )
		// 	{
		// 		console.log( err );
		// 	})
		// 	.always(function() { });
		// }
		// else
		// 	toastr['error']('Hacen falta datos', 'Error');
	});

	// ------------------------------------------------------------------------------------ MOSTRAR DATOS DE APROBADOR ----------------------------------------------------------------------------------------------------------------
	$('#tabla-registros').on('click', 'a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(this).data('idregistro');
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/presupuestos/administradores/'+idregistro,
			dataType: 	'json'
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$('#form-editar #edit_administrador').val(data.records.usuario.nombre);
				$('#form-editar #edit_cecos').val(data.records.cecos).trigger("change");
			}
			else
				toastr['error'](data.message, 'Error')
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	});

	// ------------------------------------------------------------------------------------ ACTUALIZAR DATOS DE APROBADOR --------------------------------------------------------------------------------------------------------------
	$('#btn-editar').on('click', function( e )
	{
		e.preventDefault();
		$.ajax(
		{
			type: 	'PUT',
			url: 	'ws/presupuestos/administradores/'+idregistro,
			data: 	{ detalle:$('#edit_cecos').val().join() }
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$('#modal-editar').modal('hide'); 
                setTimeout( function(){ amigable(); }, 500);  
                toastr['success'](data.message, 'Éxito')
			}
			else
				toastr['error'](data.message, 'Error')
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	});
	//--------------------------------------------------------------------------------- MOSTRAR DATOS PARA DUPLICAR ------------------------------------------------------------
	$('#tabla-registros').on('click', 'a.btn-duplicar', function( e )
	{
		e.preventDefault();
		idregistro = $(this).data('idregistro');
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/presupuestos/administradores/'+idregistro,
			dataType: 	'json'
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$('#form-duplicar #duplicado_cecos').val(data.records.cecos).trigger("change");
			}
			else
				toastr['error'](data.message, 'Error')
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	});
	//----------------------------------------------------------------------- CREAR USUARIO CECOS DUPLICACODS ---------------------------------------------------------------
	$('#btn-duplicar').on('click', function( e )
	{
		e.preventDefault();
		if( $('#duplicado_idusuarios').val() > 0 )
		{
			$.ajax(
			{
				type: 	'POST',
				url: 	'ws/presupuestos/administradores',
				data: 	{ idusuario:$('#duplicado_idusuarios').val(), detalle:$('#duplicado_cecos').val().join() }
			})
			.done(function( data )
			{
				if( data.result )
				{	
					$('#modal-duplicar').modal('hide'); 
	                setTimeout( function(){ amigable(); }, 500);  
	                toastr['success'](data.message, 'Éxito')
				}
				else
					toastr['error'](data.message, 'Error')
			})
			.fail(function( err )
			{
				console.log( err );
			})
			.always(function() { });
		}
		else
			toastr['error']('Debe seleccionar un usuario', 'Error')
	});

	// ------------------------------------------------------------------------------------ ELIMINAR APROBADOR --------------------------------------------------------------------------------------------------------------
	$('#tabla-registros').on('click', 'a.btn-eliminar', function( e )
	{
		ideliminar = $(this).data('idregistro');
	});

	$('#btn-eliminar').on('click', function( e )
	{
		e.preventDefault();
		$.ajax(
		{
			type: 	'DELETE',
			url: 	'ws/presupuestos/administradores/'+ideliminar,
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$('#modal-eliminar').modal('hide'); 
                setTimeout( function(){ amigable(); }, 500);  
                toastr['success'](data.message, 'Éxito')
			}
			else
				toastr['error'](data.message, 'Error')
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	});
});