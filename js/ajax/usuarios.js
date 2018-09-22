jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var correo = "";

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
			url: 		'ws/usuarios',
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
					col4 = value.pernr;
					col5 = value.depto;
					col6 = value.jefe;
					col7 =	'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
						    '<a style=" margin: 5px;" class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>';							
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7]).draw(false);
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

	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/usuarios',
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
		            $("#form-editar #email").val(result.records.email);
		            $("#form-editar #usuario").val(result.records.usuario);
		            $("#form-editar #nombre").val(result.records.nombre);
		            result.records.admin            == 1 ? $("#form-editar #admin").attr('checked', 'checked') : $("#form-editar #admin").removeAttr('checked', 'checked');
		            result.records.voluntariados    == 1 ? $("#form-editar #voluntariados").attr('checked', 'checked') : $("#form-editar #voluntariados").removeAttr('checked', 'checked');
		            result.records.concursos        == 1 ? $("#form-editar #concursos").attr('checked', 'checked') : $("#form-editar #concursos").removeAttr('checked', 'checked');
		            result.records.comedores        == 1 ? $("#form-editar #comedores").attr('checked', 'checked') : $("#form-editar #comedores").removeAttr('checked', 'checked');
		            result.records.documentos_admin == 1 ? $("#form-editar #documentos").attr('checked', 'checked') : $("#form-editar #documentos").removeAttr('checked', 'checked');
		            result.records.donaciones       == 1 ? $("#form-editar #donaciones").attr('checked', 'checked') : $("#form-editar #donaciones").removeAttr('checked', 'checked');
		            result.records.presupuestos     == 1 ? $("#form-editar #presupuestos").attr('checked', 'checked') : $("#form-editar #presupuestos").removeAttr('checked', 'checked');
		            result.records.perfil           == 1 ? $("#form-editar #perfil").attr('checked', 'checked') : $("#form-editar #perfil").removeAttr('checked', 'checked');
		            result.records.activos_fijos 	== 1 ? $("#form-editar #activos_fijos").attr('checked', 'checked') : $("#form-editar #activos_fijos").removeAttr('checked', 'checked');
                    result.records.km_administrador == 1 ? $("#form-editar #admin_kilometraje").attr('checked', 'checked') : $("#form-editar #admin_kilometraje").removeAttr('checked', 'checked');
					result.records.compras_admin    == 1 ? $("#form-editar #compras_admin").attr('checked', 'checked') : $("#form-editar #compras_admin").removeAttr('checked', 'checked');
                    result.records.compras_acceso   == 1 ? $("#form-editar #compras_acceso").attr('checked', 'checked') : $("#form-editar #compras_acceso").removeAttr('checked', 'checked');
                    result.records.evaluacion_proveedores   == 1 ? $("#form-editar #evaluacion_proveedores").attr('checked', 'checked') : $("#form-editar #evaluacion_proveedores").removeAttr('checked', 'checked');
                    result.records.recursos_humanos   		== 1 ? $("#form-editar #recursos_humanos").attr('checked', 'checked') : $("#form-editar #recursos_humanos").removeAttr('checked', 'checked');
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

			$.ajax(
			{
				type: 		'PUT',
				url: 		'ws/usuarios/'+idregistro,
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
		correo = $(this).parent().siblings().eq(2).text();
		ideliminar = $(e.target).closest("a").data("idregistro");
	});

	function destroy( e )
	{
		e.preventDefault();
		$.ajax(
		{
			type:	"DELETE",
			url:	"ws/usuarios/"+ideliminar,
			success: function( result )
			{
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-eliminar").modal('hide');
					if(localStorage.USUARIO.localeCompare(correo) == -1) 
						{		
							location.href ="ws/salir";
							localStorage.clear();
						}
				}
				else
				{
					toastr['error'](result.message, 'Error');

				}
			},
			error: function( result )
			{
				console.log( result );
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}
});