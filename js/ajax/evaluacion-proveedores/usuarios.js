jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;

	//Propiedades
	window.tabla_registros = $('#tabla-registros').DataTable(
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

	//Eventos
	llenarTabla();
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	
	//Funciones
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/evaluacion/proveedores/usuarios',
			dataType: 	'json',
		})
		.done( function( data )
		{
			if( data.result )
			{
				$.each(data.records, function( index, value )
				{	
					col1 = ++index;
					col2 = value.nombre;
					col3 = value.email;
					col4 = value.depto;
					col5 =	'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
						    '<a style=" margin: 5px;" class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>';							
					window.tabla_registros.row.add([col1,col2,col3,col4,col5]).draw(false);
				});
			}
			else
				toastr['error'](data.message, 'Error');
		})
		.fail( function( error )
		{
			console.log(error);
		})
		.always(function()
		{
			$('#loader').fadeOut();
		});
	}
	$('#crearRegistro').on('click',function(){
		$('#form-crear #email').val('');
		$('#form-crear #email').removeClass('valid');
		$('#form-crear #email').removeClass('error');
	});


	function store( e )
	{
		e.preventDefault();
		console.log($('#form-crear').serialize());
		var StateSAP 		= $("#SAP").is(":checked");
		var StateSolicitud 	= $("#solicitudespendientes").is(":checked");
		var StateHistorial 	= $("#historialdeevaluaciones").is(":checked");
		var StateReportes 	= $("#reportes").is(":checked");
		var StateUsuarios 	= $("#usuarios").is(":checked");

			if(!StateSAP && !StateSolicitud &&!StateHistorial &&!StateReportes && !StateUsuarios)
			{
				toastr['error']('Debe seleccionar al menos un cargo', 'Error');
           		event.preventDefault();
			}
			else
			{
				if( $( '#form-crear' ).valid() )
				{
					var datos = $('#form-crear').serialize();
					console.log(datos);
					$.ajax(
					{
						type: 		'POST',
						url: 		'ws/evaluacion/proveedores/usuarios',
						dataType: 	'json',
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
	}

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/evaluacion/proveedores/usuarios/"+idregistro,
	        success : function( result )
        	
        	{
				if( result.result )
				{
				   $("#form-editar #email").val(result.records.email);
		            $("#form-editar #nombre").val(result.records.nombre);
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	        },
	        error: function(data)
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/usuarios/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					if(result.records.email != 	'undefined')
					{
		            $("#form-editar #email").val(result.records.email);
		            $("#form-editar #usuario").val(result.records.usuario);
		            $("#form-editar #nombre").val(result.records.nombre);
		            result.records.evaluacion_proveedores_SAP            			== 1 ? $("#form-editar #SAP").attr('checked', 'checked') : $("#form-editar #SAP").removeAttr('checked', 'checked');
		            result.records.evaluacion_proveedores_solicitudespendientes    	== 1 ? $("#form-editar #solicitudespendientes").attr('checked', 'checked') : $("#form-editar #solicitudespendientes").removeAttr('checked', 'checked');
		            result.records.evaluacion_proveedores_historialevaluaciones     == 1 ? $("#form-editar #historialdeevaluaciones").attr('checked', 'checked') : $("#form-editar #historialdeevaluaciones").removeAttr('checked', 'checked');
		            result.records.evaluacion_proveedores_reportes        			== 1 ? $("#form-editar #reportes").attr('checked', 'checked') : $("#form-editar #reportes").removeAttr('checked', 'checked');
		            result.records.evaluacion_proveedores_usuarios 					== 1 ? $("#form-editar #usuarios").attr('checked', 'checked') : $("#form-editar #usuarios").removeAttr('checked', 'checked');
		            }
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	        },
	        error: function( data )
        	{
        		console.log( data );
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});


	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/evaluacion/proveedores/usuarios/'+idregistro,
				dataType: 	'json',
				data: 		$('#form-editar').serialize(),
				success: function ( result )
				{
					if( result.result )
					{
						setTimeout( function(){ amigable(); }, 500);  						
						toastr['success'](result.message, 'Éxito')
				        $('#modal-editar').modal('hide'); 
					        if(localStorage.USUARIO.localeCompare(result.records.email) == -1) 
							{	
							location.href ="panel";
							}
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
		$.ajax
		({
			type:	"DELETE",
			url:	"ws/evaluacion/proveedores/usuarios/"+ideliminar,
			success: function( result )
			{				
				// console.log(ideliminar)
				
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-eliminar").modal('hide');
					
					if(localStorage.USUARIO.localeCompare(result.records.email) == -1)
						{	
						location.href ="panel";
						}
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
			},
			error: function( result )
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}
});